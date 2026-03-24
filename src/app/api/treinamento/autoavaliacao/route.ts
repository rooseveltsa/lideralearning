import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { generatePartialPDI } from '@/lib/utils/pdi-generator'
import { sendPDIEmail } from '@/lib/email/send-pdi'

type Payload = {
  userId: string
  userEmail?: string
  userName?: string
  respostas: Record<string, number>
  textos: Record<string, string>
  pontuacaoTotal: number
}

function normalize(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function getPerfilLabel(pontos: number) {
  if (pontos <= 10) return 'reativo'
  if (pontos <= 15) return 'transicao'
  return 'lider_valor'
}

export async function POST(request: Request) {
  let json: Payload

  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  if (!json.userId || !json.respostas || typeof json.pontuacaoTotal !== 'number') {
    return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('leadership_self_assessments')
    .insert({
      user_id: json.userId,
      q_percepcao: json.respostas.percepcao ?? null,
      q_gestao: json.respostas.gestao ?? null,
      q_comunicacao: json.respostas.comunicacao ?? null,
      q_tecnologia: json.respostas.tecnologia ?? null,
      q_etica: json.respostas.etica ?? null,
      q_dor: json.respostas.dor ?? null,
      texto_dor_atual: normalize(json.textos?.dorAtual) || null,
      texto_custo_futuro: normalize(json.textos?.custoFuturo) || null,
      pontuacao_total: json.pontuacaoTotal,
      perfil: getPerfilLabel(json.pontuacaoTotal),
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting leadership self-assessment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate partial PDI and send email (non-blocking — errors are logged, not thrown)
  if (json.userEmail) {
    const perfil = getPerfilLabel(json.pontuacaoTotal)

    const selfAssessment: Record<string, unknown> = {
      q_percepcao: json.respostas.percepcao ?? null,
      q_gestao: json.respostas.gestao ?? null,
      q_comunicacao: json.respostas.comunicacao ?? null,
      q_tecnologia: json.respostas.tecnologia ?? null,
      q_etica: json.respostas.etica ?? null,
      q_dor: json.respostas.dor ?? null,
      pontuacao_total: json.pontuacaoTotal,
      perfil,
    }

    try {
      const report = generatePartialPDI(
        json.userId,
        json.userName || 'Participante',
        null,
        selfAssessment,
      )

      const emailResult = await sendPDIEmail(json.userEmail, report)

      if (!emailResult.success) {
        console.error('[autoavaliacao] Email send failed:', emailResult.error)
      }
    } catch (emailErr) {
      console.error('[autoavaliacao] Email processing error:', emailErr)
    }
  }

  return NextResponse.json({ success: true, diagnosticoId: data.id })
}
