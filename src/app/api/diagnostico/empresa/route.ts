import { NextResponse, after } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { sendEmailWithRetry } from '@/lib/email/send-with-retry'
import { logger, maskEmail } from '@/lib/logger/structured'
import { generatePdiEmpresa } from '@/lib/diagnostico/pdi-empresa-generator'

// A geração do PDI chama o LLM (até 30s) e roda depois da response, via after().
// O default da plataforma abortaria a execução no meio.
export const maxDuration = 60

type Payload = {
  empresa?: string
  unidadeFilial?: string
  segmento?: string
  gestorNome?: string
  gestorCargo?: string
  gestorEmail?: string
  gestorWhatsapp?: string
  supervisorNome?: string
  supervisorCargo?: string
  supervisorWhatsapp?: string
  tempoNaFuncao?: string
  qtdLiderados?: string
  dataAvaliacao?: string
  perfilLiderancaEsperado?: Record<string, number>
  perfilComportamentalDesejado?: Record<string, Record<string, number>>
  diagnosticoAtual?: Record<string, number>
  modulos?: Record<string, string>
  expectativas?: Record<string, number>
  comportamentosFortalecer?: string
  comportamentosEliminar?: string
  oQueSeriaExcelente?: string
  // PDI-4.A — Visão de carreira do supervisor (gestor)
  proximoPasso?: string
  prazoEvolucao?: string
  planoSucessao?: string
  maiorBloqueio?: string
  // PDI-4.B — KPIs operacionais reais (números)
  kpis?: Record<string, string>
}

function normalize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function calcDiscScores(disc: Record<string, Record<string, number>>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const dimension of ['D', 'I', 'S', 'C']) {
    const values = Object.values(disc[dimension] || {})
    if (values.length === 0) {
      result[dimension] = 0
      continue
    }
    const sum = values.reduce((a, b) => a + b, 0)
    result[dimension] = Math.round((sum / (values.length * 5)) * 100)
  }
  return result
}

function calcFitScore(perfilEsperado: Record<string, number>): number {
  const values = Object.values(perfilEsperado || {})
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round((sum / (values.length * 5)) * 100)
}

export async function POST(request: Request) {
  let json: Payload
  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const empresa = normalize(json.empresa)
  const gestorNome = normalize(json.gestorNome)
  const gestorEmail = normalize(json.gestorEmail)
  const supervisorNome = normalize(json.supervisorNome)

  if (!empresa) return NextResponse.json({ error: 'Empresa obrigatória.' }, { status: 400 })
  if (!gestorNome) return NextResponse.json({ error: 'Nome do gestor obrigatório.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gestorEmail))
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  if (!supervisorNome)
    return NextResponse.json({ error: 'Nome do supervisor obrigatório.' }, { status: 400 })

  const admin = createAdminClient()

  // Persist
  const qtdLiderados = json.qtdLiderados ? parseInt(json.qtdLiderados, 10) || null : null
  const discScores = calcDiscScores(json.perfilComportamentalDesejado || {})
  const fitScore = calcFitScore(json.perfilLiderancaEsperado || {})

  let diagnosticoId: string | null = null
  try {
    const { data, error } = await admin
      .from('b2b_diagnostics')
      .insert({
        empresa,
        unidade_filial: normalize(json.unidadeFilial) || null,
        segmento: normalize(json.segmento) || null,
        gestor_nome: gestorNome,
        gestor_cargo: normalize(json.gestorCargo) || null,
        gestor_email: gestorEmail,
        gestor_whatsapp: normalize(json.gestorWhatsapp) || null,
        supervisor_nome: supervisorNome,
        supervisor_cargo: normalize(json.supervisorCargo) || null,
        supervisor_whatsapp: normalize(json.supervisorWhatsapp) || null,
        tempo_na_funcao: normalize(json.tempoNaFuncao) || null,
        qtd_liderados: qtdLiderados,
        data_avaliacao: normalize(json.dataAvaliacao) || new Date().toISOString().slice(0, 10),
        perfil_lideranca_esperado: json.perfilLiderancaEsperado || {},
        perfil_comportamental_desejado: json.perfilComportamentalDesejado || {},
        diagnostico_atual: json.diagnosticoAtual || {},
        modulos_lidera: json.modulos || {},
        expectativas: json.expectativas || {},
        espaco_aberto: {
          fortalecer: normalize(json.comportamentosFortalecer) || null,
          eliminar: normalize(json.comportamentosEliminar) || null,
          excelente: normalize(json.oQueSeriaExcelente) || null,
          objetivo_carreira_supervisor: {
            proximo_passo: normalize(json.proximoPasso) || null,
            prazo_evolucao: normalize(json.prazoEvolucao) || null,
            plano_sucessao: normalize(json.planoSucessao) || null,
            maior_bloqueio: normalize(json.maiorBloqueio) || null,
          },
          kpis_operacionais: json.kpis || {},
        },
        disc_scores: discScores,
        fit_score: fitScore,
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      })
      .select('id')
      .single()

    if (error) throw error
    diagnosticoId = data?.id ?? null
    logger.info('diagnostico_empresa_created', {
      diagnosticoId,
      empresa,
      gestorEmail: maskEmail(gestorEmail),
      fitScore,
      discScores,
    })
  } catch (e) {
    logger.error('diagnostico_empresa_failed', {
      empresa,
      gestorEmail: maskEmail(gestorEmail),
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json({ error: 'Falha ao registrar diagnóstico.' }, { status: 500 })
  }

  // Cross-link com CRM prospect (best-effort, não bloqueia)
  try {
    const { data: existingProspect } = await admin
      .from('crm_prospects')
      .select('id')
      .eq('email', gestorEmail)
      .limit(1)
      .maybeSingle()

    const notes = `Diagnóstico empresa enviado. Empresa: ${empresa}. Supervisor avaliado: ${supervisorNome}. Fit: ${fitScore}/100. DISC: D${discScores.D} I${discScores.I} S${discScores.S} C${discScores.C}.`

    if (existingProspect) {
      await admin
        .from('crm_prospects')
        .update({
          full_name: gestorNome,
          phone: normalize(json.gestorWhatsapp) || undefined,
          outreach_status: 'qualified',
          notes,
          last_outreach_at: new Date().toISOString(),
        })
        .eq('id', existingProspect.id)

      if (diagnosticoId) {
        await admin
          .from('b2b_diagnostics')
          .update({ prospect_id: existingProspect.id })
          .eq('id', diagnosticoId)
      }
    } else {
      const { data: newProspect } = await admin
        .from('crm_prospects')
        .insert({
          full_name: gestorNome,
          job_title: normalize(json.gestorCargo) || 'Não informado',
          job_function: 'rh_td',
          company_name: empresa,
          email: gestorEmail,
          phone: normalize(json.gestorWhatsapp) || null,
          outreach_status: 'qualified',
          notes,
          last_outreach_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (newProspect?.id && diagnosticoId) {
        await admin
          .from('b2b_diagnostics')
          .update({ prospect_id: newProspect.id })
          .eq('id', diagnosticoId)
      }
    }
  } catch (e) {
    logger.warn('diagnostico_empresa_crm_link_failed', {
      diagnosticoId,
      error: e instanceof Error ? e.message : 'unknown',
    })
  }

  // Trabalho lento roda depois da response, mas dentro do ciclo de vida que a
  // plataforma mantém vivo. Um fire-and-forget (`void (async () => {})()`) era
  // descartado assim que a response saía — o PDI nunca chegava a ser gravado.
  // Ordem importa: o PDI é gerado ANTES do e-mail, porque o e-mail carrega o link dele.
  after(async () => {
    if (diagnosticoId) {
      const diagId = diagnosticoId
      try {
        const { data: full } = await admin
          .from('b2b_diagnostics')
          .select(
            'empresa, gestor_nome, supervisor_nome, supervisor_cargo, tempo_na_funcao, qtd_liderados, fit_score, disc_scores, perfil_lideranca_esperado, perfil_comportamental_desejado, diagnostico_atual, modulos_lidera, expectativas, espaco_aberto',
          )
          .eq('id', diagId)
          .single()

        if (!full) {
          throw new Error(`diagnóstico ${diagId} não encontrado para geração de PDI`)
        }

        const espacoAberto = (full.espaco_aberto as Record<string, unknown>) || {}
        const objetivoCarreira =
          (espacoAberto.objetivo_carreira_supervisor as Record<string, string | null>) || {}
        const kpisOperacionais = (espacoAberto.kpis_operacionais as Record<string, string>) || {}

        const pdiReport = await generatePdiEmpresa({
          empresa: (full.empresa as string) || empresa,
          gestorNome: (full.gestor_nome as string) || gestorNome,
          supervisorNome: (full.supervisor_nome as string) || supervisorNome,
          supervisorCargo: (full.supervisor_cargo as string) || null,
          tempoNaFuncao: (full.tempo_na_funcao as string) || null,
          qtdLiderados: (full.qtd_liderados as number) || null,
          fitScore: (full.fit_score as number) || fitScore,
          discScores: (full.disc_scores as Record<string, number>) || discScores,
          perfilLiderancaEsperado:
            (full.perfil_lideranca_esperado as Record<string, number>) || {},
          perfilComportamentalDesejado:
            (full.perfil_comportamental_desejado as Record<string, Record<string, number>>) || {},
          diagnosticoAtual: (full.diagnostico_atual as Record<string, number>) || {},
          modulos: (full.modulos_lidera as Record<string, string>) || {},
          expectativas: (full.expectativas as Record<string, number>) || {},
          espacoAberto: {
            fortalecer: (espacoAberto.fortalecer as string) || undefined,
            eliminar: (espacoAberto.eliminar as string) || undefined,
            excelente: (espacoAberto.excelente as string) || undefined,
          },
          objetivoCarreira,
          kpisOperacionais,
        })

        const updatedEspacoAberto = { ...espacoAberto, pdi_generated: pdiReport }
        await admin
          .from('b2b_diagnostics')
          .update({ espaco_aberto: updatedEspacoAberto })
          .eq('id', diagId)

        logger.info('pdi_empresa_persisted', {
          diagnosticoId: diagId,
          provider: pdiReport.meta.provider,
          model: pdiReport.meta.model,
          tokens:
            (pdiReport.meta.promptTokens ?? 0) + (pdiReport.meta.completionTokens ?? 0),
        })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'unknown'
        logger.error('pdi_empresa_generation_failed', { diagnosticoId: diagId, error: message })

        // Marca a falha no próprio registro: a página do PDI precisa distinguir
        // "ainda gerando" de "falhou", e o reprocessamento precisa saber quem recuperar.
        const { data: row } = await admin
          .from('b2b_diagnostics')
          .select('espaco_aberto')
          .eq('id', diagId)
          .maybeSingle()

        await admin
          .from('b2b_diagnostics')
          .update({
            espaco_aberto: {
              ...((row?.espaco_aberto as Record<string, unknown>) || {}),
              pdi_error: { message, at: new Date().toISOString() },
            },
          })
          .eq('id', diagId)
      }
    }

    // E-mail por último: ele carrega o link do PDI, então só faz sentido depois
    // que o PDI existe. Falha aqui não pode derrubar o resto — apenas registra.
    try {
      const emailResult = await sendEmailWithRetry(
        gestorEmail,
        'diagnostico-empresa-recebido',
        {
          gestorNome,
          empresa,
          supervisorNome,
          fitScore,
          discScores,
          diagnosticoId,
        },
        { leadId: diagnosticoId ?? undefined, origin: 'diagnostico_empresa' },
      )

      if (!emailResult.success) {
        logger.error('diagnostico_empresa_email_failed', {
          diagnosticoId,
          email: maskEmail(gestorEmail),
          error: emailResult.error,
        })
      }
    } catch (e) {
      logger.error('diagnostico_empresa_email_failed', {
        diagnosticoId,
        email: maskEmail(gestorEmail),
        error: e instanceof Error ? e.message : 'unknown',
      })
    }
  })

  return NextResponse.json({
    success: true,
    diagnosticoId,
    pdiStatus: 'processing',
  })
}
