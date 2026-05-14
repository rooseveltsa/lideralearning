import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { sendEmailWithRetry } from '@/lib/email/send-with-retry'
import { logger, maskEmail } from '@/lib/logger/structured'
import { generatePdiPessoal } from '@/lib/diagnostico/pdi-generator'

type Payload = {
  nomeCompleto?: string
  email?: string
  empresa?: string
  cargo?: string
  setor?: string
  tempoNaFuncao?: string
  qtdLiderados?: string
  idade?: string
  cidadeUF?: string
  dataAvaliacao?: string
  autoavaliacao?: Record<string, number>
  perfilComportamentalPessoal?: Record<string, Record<string, number>>
  modulos?: Record<string, string>
  pontosFortes?: string
  comportamentosPrejudicam?: string
  desejaDesenvolver?: Record<string, number>
  radar?: Record<string, number>
  comportamentoEliminar?: string
  habilidadeDesenvolver?: string
  acaoProximos7Dias?: string
  resultado90Dias?: string
  quemPodeApoiar?: string
  oQueEmpresaEspera?: string
  oQueEntregaMelhor?: string
  ondeMaiorDesalinhamento?: string
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

function calcRadarAverage(radar: Record<string, number>): number {
  const values = Object.values(radar || {})
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round((sum / values.length) * 100) / 100
}

function calcSelfAssessmentScore(auto: Record<string, number>): number {
  const values = Object.values(auto || {})
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

  const nomeCompleto = normalize(json.nomeCompleto)
  const email = normalize(json.email)

  if (!nomeCompleto) return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })

  const admin = createAdminClient()

  // Capture optional user_id se logado
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const qtdLiderados = json.qtdLiderados ? parseInt(json.qtdLiderados, 10) || null : null
  const idade = json.idade ? parseInt(json.idade, 10) || null : null
  const discScores = calcDiscScores(json.perfilComportamentalPessoal || {})
  const radarAverage = calcRadarAverage(json.radar || {})
  const selfScore = calcSelfAssessmentScore(json.autoavaliacao || {})

  // Tentar cross-link com b2b_diagnostics (mesma empresa + email do gestor)
  const empresa = normalize(json.empresa)
  let linkedB2bId: string | null = null
  if (empresa) {
    try {
      const { data: b2b } = await admin
        .from('b2b_diagnostics')
        .select('id')
        .ilike('empresa', empresa)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      linkedB2bId = b2b?.id ?? null
    } catch (e) {
      logger.warn('diagnostico_pessoal_cross_link_lookup_failed', {
        empresa,
        error: e instanceof Error ? e.message : 'unknown',
      })
    }
  }

  let diagnosticoId: string | null = null
  try {
    const { data, error } = await admin
      .from('personal_diagnostics')
      .insert({
        user_id: user?.id ?? null,
        nome_completo: nomeCompleto,
        email,
        empresa: empresa || null,
        cargo: normalize(json.cargo) || null,
        setor: normalize(json.setor) || null,
        tempo_na_funcao: normalize(json.tempoNaFuncao) || null,
        qtd_liderados: qtdLiderados,
        idade,
        cidade_uf: normalize(json.cidadeUF) || null,
        data_avaliacao: normalize(json.dataAvaliacao) || new Date().toISOString().slice(0, 10),
        autoavaliacao_comportamental: json.autoavaliacao || {},
        perfil_comportamental_pessoal: json.perfilComportamentalPessoal || {},
        modulos_lidera: json.modulos || {},
        reflexao_profissional: {
          pontos_fortes: normalize(json.pontosFortes) || null,
          comportamentos_prejudicam: normalize(json.comportamentosPrejudicam) || null,
          deseja_desenvolver: json.desejaDesenvolver || {},
        },
        radar_desenvolvimento: json.radar || {},
        pdi: {
          comportamento_eliminar: normalize(json.comportamentoEliminar) || null,
          habilidade_desenvolver: normalize(json.habilidadeDesenvolver) || null,
          acao_proximos_7_dias: normalize(json.acaoProximos7Dias) || null,
          resultado_90_dias: normalize(json.resultado90Dias) || null,
          quem_pode_apoiar: normalize(json.quemPodeApoiar) || null,
        },
        alinhamento_final: {
          o_que_empresa_espera: normalize(json.oQueEmpresaEspera) || null,
          o_que_entrega_melhor: normalize(json.oQueEntregaMelhor) || null,
          onde_maior_desalinhamento: normalize(json.ondeMaiorDesalinhamento) || null,
        },
        disc_scores: discScores,
        modulo_scores: { self_score: selfScore },
        radar_average: radarAverage,
        linked_b2b_diagnostic_id: linkedB2bId,
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      })
      .select('id')
      .single()

    if (error) throw error
    diagnosticoId = data?.id ?? null
    logger.info('diagnostico_pessoal_created', {
      diagnosticoId,
      email: maskEmail(email),
      empresa: empresa || null,
      selfScore,
      radarAverage,
      discScores,
      linkedToB2b: !!linkedB2bId,
    })
  } catch (e) {
    logger.error('diagnostico_pessoal_failed', {
      email: maskEmail(email),
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json({ error: 'Falha ao registrar diagnóstico.' }, { status: 500 })
  }

  // Cross-link com CRM prospect (best-effort)
  try {
    const { data: existing } = await admin
      .from('crm_prospects')
      .select('id, notes')
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    const notes = `Diagnóstico pessoal: autoavaliação ${selfScore}/100. Radar médio ${radarAverage}/10. DISC: D${discScores.D} I${discScores.I} S${discScores.S} C${discScores.C}.${linkedB2bId ? ' Vinculado a diagnóstico empresa.' : ''}`

    if (existing) {
      await admin
        .from('crm_prospects')
        .update({
          full_name: nomeCompleto,
          outreach_status: 'qualified',
          notes: existing.notes ? `${existing.notes}\n---\n${notes}` : notes,
          last_outreach_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (diagnosticoId) {
        await admin
          .from('personal_diagnostics')
          .update({ prospect_id: existing.id })
          .eq('id', diagnosticoId)
      }
    } else {
      const { data: newProspect } = await admin
        .from('crm_prospects')
        .insert({
          full_name: nomeCompleto,
          job_title: normalize(json.cargo) || 'Não informado',
          job_function: 'outro',
          company_name: empresa || 'Não informado',
          email,
          phone: null,
          outreach_status: 'qualified',
          notes,
          last_outreach_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (newProspect?.id && diagnosticoId) {
        await admin
          .from('personal_diagnostics')
          .update({ prospect_id: newProspect.id })
          .eq('id', diagnosticoId)
      }
    }
  } catch (e) {
    logger.warn('diagnostico_pessoal_crm_link_failed', {
      diagnosticoId,
      error: e instanceof Error ? e.message : 'unknown',
    })
  }

  // Send confirmation email (await — bloqueia para garantir entrega)
  const emailResult = await sendEmailWithRetry(
    email,
    'diagnostico-pessoal-recebido',
    {
      nomeCompleto,
      empresa,
      selfScore,
      radarAverage,
      discScores,
      diagnosticoId,
    },
    { leadId: diagnosticoId ?? undefined, origin: 'diagnostico_pessoal' },
  )

  // Geração do PDI em background (fire-and-forget — não bloqueia response).
  // PDI é gravado em personal_diagnostics.pdi.generated quando pronto.
  if (diagnosticoId) {
    const diagId = diagnosticoId
    void (async () => {
      try {
        // Recupera dados do diagnóstico (precisa de campos não preservados em variáveis)
        const { data: full } = await admin
          .from('personal_diagnostics')
          .select('autoavaliacao_comportamental, radar_desenvolvimento, reflexao_profissional, pdi, alinhamento_final, linked_b2b_diagnostic_id')
          .eq('id', diagId)
          .single()

        if (!full) return

        let comparativoEmpresa = null
        if (full.linked_b2b_diagnostic_id) {
          const { data: b2b } = await admin
            .from('b2b_diagnostics')
            .select('fit_score, disc_scores, perfil_lideranca_esperado, diagnostico_atual, espaco_aberto')
            .eq('id', full.linked_b2b_diagnostic_id as string)
            .maybeSingle()
          if (b2b) {
            const espaco = b2b.espaco_aberto as Record<string, string | null> | null
            comparativoEmpresa = {
              fitScore: b2b.fit_score as number | undefined,
              discScores: b2b.disc_scores as Record<string, number> | undefined,
              perfilEsperado: b2b.perfil_lideranca_esperado as Record<string, number> | undefined,
              diagnosticoAtual: b2b.diagnostico_atual as Record<string, number> | undefined,
              espacoAberto: espaco
                ? {
                    fortalecer: espaco.fortalecer ?? undefined,
                    eliminar: espaco.eliminar ?? undefined,
                    excelente: espaco.excelente ?? undefined,
                  }
                : undefined,
            }
          }
        }

        const reflexao = (full.reflexao_profissional as Record<string, unknown>) || {}
        const desejaDesenvolver =
          (reflexao.deseja_desenvolver as Record<string, number>) || {}

        const pdiReport = await generatePdiPessoal({
          nomeCompleto,
          empresa,
          cargo: null,
          tempoNaFuncao: null,
          qtdLiderados: null,
          selfScore,
          radarAverage,
          discScores,
          autoavaliacao: (full.autoavaliacao_comportamental as Record<string, number>) || {},
          modulos: json.modulos || {},
          pdiForm: (full.pdi as Record<string, string | null>) || {},
          alinhamento: (full.alinhamento_final as Record<string, string | null>) || {},
          radar: (full.radar_desenvolvimento as Record<string, number>) || {},
          desejaDesenvolver,
          comparativoEmpresa,
        })

        // Persiste o PDI dentro de pdi.generated (sem migration nova)
        const currentPdi = (full.pdi as Record<string, unknown>) || {}
        const updatedPdi = { ...currentPdi, generated: pdiReport }

        await admin
          .from('personal_diagnostics')
          .update({ pdi: updatedPdi })
          .eq('id', diagId)

        logger.info('pdi_persisted', {
          diagnosticoId: diagId,
          provider: pdiReport.meta.provider,
          model: pdiReport.meta.model,
          tokens:
            (pdiReport.meta.promptTokens ?? 0) + (pdiReport.meta.completionTokens ?? 0),
        })
      } catch (e) {
        logger.error('pdi_generation_failed', {
          diagnosticoId: diagId,
          error: e instanceof Error ? e.message : 'unknown',
        })
      }
    })()
  }

  return NextResponse.json({
    success: true,
    diagnosticoId,
    emailSent: emailResult.success,
    ...(emailResult.success ? {} : { emailError: emailResult.error }),
  })
}
