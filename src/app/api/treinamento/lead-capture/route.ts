import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { sendEmailWithRetry } from '@/lib/email/send-with-retry'
import { logger, maskEmail } from '@/lib/logger/structured'
import { computeTopGaps, type Dimensoes } from '@/lib/treinamento/recomendacoes'

type Payload = {
  nome?: string
  email?: string
  telefone?: string
  origem?: string
  score?: number
  perfil?: string
  respostas?: Record<string, number>
  textos?: Record<string, string>
  userId?: string | null
}

function normalize(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function POST(request: Request) {
  let json: Payload

  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const nome = normalize(json.nome)
  const email = normalize(json.email)
  const telefone = normalize(json.telefone)

  if (nome.length < 2) {
    return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }
  if (telefone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Telefone inválido.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const dorAtual = normalize(json.textos?.dorAtual)
  const custoFuturo = normalize(json.textos?.custoFuturo)
  const origem = normalize(json.origem) || 'autoavaliacao'

  const notes = [
    `Origem: ${origem}`,
    json.perfil ? `Perfil: ${json.perfil}` : null,
    typeof json.score === 'number' ? `Score: ${json.score}/21` : null,
    dorAtual ? `Dor atual: ${dorAtual}` : null,
    custoFuturo ? `Custo se persistir: ${custoFuturo}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  let leadId: string | null = null

  try {
    const { data: existing } = await admin
      .from('crm_prospects')
      .select('id, notes')
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    const now = new Date().toISOString()

    if (existing) {
      await admin
        .from('crm_prospects')
        .update({
          full_name: nome,
          phone: telefone,
          outreach_status: 'replied',
          notes: existing.notes ? `${existing.notes}\n---\n${notes}` : notes,
          last_outreach_at: now,
        })
        .eq('id', existing.id)
      leadId = existing.id
    } else {
      const { data: inserted } = await admin
        .from('crm_prospects')
        .insert({
          full_name: nome,
          job_title: 'Não informado',
          job_function: 'outro',
          company_name: 'Não informado',
          email,
          phone: telefone,
          outreach_status: 'replied',
          notes,
          last_outreach_at: now,
        })
        .select('id')
        .single()
      leadId = inserted?.id ?? null
    }

    logger.info('lead_captured', {
      leadId,
      email: maskEmail(email),
      origem,
      score: json.score,
      perfil: json.perfil,
    })
  } catch (e) {
    logger.error('lead_capture_failed', {
      email: maskEmail(email),
      origem,
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json({ error: 'Falha ao registrar lead.' }, { status: 500 })
  }

  // Send assessment-complete email synchronously when origin is autoavaliacao
  // Lead is already saved; email failure does not roll back the lead.
  let emailSent = false
  let emailError: string | undefined

  const shouldSendAssessmentEmail =
    origem === 'autoavaliacao' && typeof json.score === 'number' && !!json.perfil

  if (shouldSendAssessmentEmail) {
    const respostas = json.respostas
    const hasAllDimensoes =
      respostas &&
      typeof respostas.percepcao === 'number' &&
      typeof respostas.gestao === 'number' &&
      typeof respostas.comunicacao === 'number' &&
      typeof respostas.tecnologia === 'number' &&
      typeof respostas.etica === 'number' &&
      typeof respostas.dor === 'number'

    const dimensoes: Dimensoes | undefined = hasAllDimensoes
      ? {
          percepcao: respostas.percepcao,
          gestao: respostas.gestao,
          comunicacao: respostas.comunicacao,
          tecnologia: respostas.tecnologia,
          etica: respostas.etica,
          dor: respostas.dor,
        }
      : undefined

    const topGaps = dimensoes ? computeTopGaps(dimensoes, 3) : undefined

    const result = await sendEmailWithRetry(
      email,
      'assessment-complete',
      {
        name: nome,
        perfil: json.perfil,
        score: json.score,
        dimensoes,
        topGaps,
      },
      { leadId: leadId ?? undefined, origin: origem },
    )

    emailSent = result.success
    if (!result.success) {
      emailError = result.error
    }

    logger.info('autoavaliacao_email_sent', {
      leadId,
      email: maskEmail(email),
      success: result.success,
      attempts: result.attempts,
      latencyMs: result.latencyMs,
      template: 'assessment-complete',
    })
  }

  return NextResponse.json({
    success: true,
    leadId,
    emailSent,
    ...(emailError ? { emailError } : {}),
  })
}
