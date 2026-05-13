import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { sendEmailWithRetry } from '@/lib/email/send-with-retry'
import { logger, maskEmail } from '@/lib/logger/structured'

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

  // Send confirmation email to gestor (await — but errors don't block the response)
  const emailResult = await sendEmailWithRetry(
    gestorEmail,
    'diagnostico-empresa-recebido',
    {
      gestorNome,
      empresa,
      supervisorNome,
      fitScore,
      discScores,
    },
    { leadId: diagnosticoId ?? undefined, origin: 'diagnostico_empresa' },
  )

  return NextResponse.json({
    success: true,
    diagnosticoId,
    emailSent: emailResult.success,
    ...(emailResult.success ? {} : { emailError: emailResult.error }),
  })
}
