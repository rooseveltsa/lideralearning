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

  const perfil = getPerfilLabel(json.pontuacaoTotal)

  // Update CRM prospect status - they completed a form
  if (json.userEmail) {
    try {
      await admin
        .from('crm_prospects')
        .update({
          outreach_status: 'replied',
          notes: `Preencheu autoavaliacao. Perfil: ${perfil}. Score: ${json.pontuacaoTotal}/21`,
        })
        .eq('email', json.userEmail)
    } catch (e) {
      console.error('[autoavaliacao] CRM update failed:', e)
    }
  }

  // ── AUTO-GENERATE PDI from self-assessment ──
  const respostas = {
    percepcao: json.respostas.percepcao ?? 0,
    gestao: json.respostas.gestao ?? 0,
    comunicacao: json.respostas.comunicacao ?? 0,
    tecnologia: json.respostas.tecnologia ?? 0,
    etica: json.respostas.etica ?? 0,
    dor: json.respostas.dor ?? 0,
  }

  try {
    // Map self-assessment scores to PDI dimensions (normalize 1-3 to 1-5 scale)
    const mapScore = (v: number) => Math.max(1, Math.min(5, Math.round((v / 3) * 5)))
    const mapAvg = (a: number, b: number) => Math.max(1, Math.min(5, Math.round(((a + b) / 6) * 5)))

    const pdiData = {
      user_id: json.userId,
      cargo: '',
      tempo_funcao: '',
      departamento: '',
      dim_facilitador: mapScore(respostas.gestao),
      dim_orientador: mapScore(respostas.comunicacao),
      dim_garantidor: mapScore(respostas.etica),
      dim_estrategista: mapScore(respostas.percepcao),
      dim_mentor: mapAvg(respostas.gestao, respostas.comunicacao),
      hs_execucao: mapScore(respostas.percepcao),
      hs_processos: mapScore(respostas.gestao),
      hs_ferramentas: mapScore(respostas.tecnologia),
      hs_padroes: mapScore(respostas.etica),
      ss_inteligencia_emocional: mapScore(respostas.comunicacao),
      ss_feedback: mapScore(respostas.comunicacao),
      ss_conflitos_geracionais: mapScore(respostas.gestao),
      ss_visao_futuro: mapScore(respostas.percepcao),
      fase_atual: perfil === 'reativo' ? 1 : perfil === 'transicao' ? 2 : 3,
      media_dimensoes: parseFloat(((json.pontuacaoTotal / 18) * 5).toFixed(1)),
    }

    // Check if PDI already exists for this user, then update or insert
    const { data: existingPdi } = await admin
      .from('leadership_pdi')
      .select('id')
      .eq('user_id', json.userId)
      .limit(1)
      .maybeSingle()

    if (existingPdi) {
      await admin.from('leadership_pdi').update(pdiData).eq('id', existingPdi.id)
    } else {
      await admin.from('leadership_pdi').insert(pdiData)
    }
    console.log('[autoavaliacao] PDI auto-generated for user:', json.userId)
  } catch (pdiErr) {
    console.error('[autoavaliacao] PDI auto-generation failed:', pdiErr)
  }

  // Generate partial PDI report and send email (non-blocking — errors are logged, not thrown)
  if (json.userEmail) {
    const selfAssessment: Record<string, unknown> = {
      q_percepcao: respostas.percepcao,
      q_gestao: respostas.gestao,
      q_comunicacao: respostas.comunicacao,
      q_tecnologia: respostas.tecnologia,
      q_etica: respostas.etica,
      q_dor: respostas.dor,
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
