import { NextResponse } from 'next/server'

import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/service'

type InscricaoPayload = {
  nome: string
  email?: string
  whatsapp: string
  empresa?: string
  cargo: string
  tempoLideranca: string
  tamanhEquipe?: string
  maiorDesafio?: string
  treinamento: string
  sourcePage?: string
}

function normalize(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`inscricao:${getRateLimitKey(request)}`, { maxRequests: 5, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um minuto.' }, { status: 429 })
  }

  let json: InscricaoPayload

  try {
    json = (await request.json()) as InscricaoPayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const nome = normalize(json.nome)
  const whatsapp = normalize(json.whatsapp)
  const cargo = normalize(json.cargo)
  const tempoLideranca = normalize(json.tempoLideranca)

  if (!nome || !whatsapp || !cargo || !tempoLideranca) {
    return NextResponse.json({ error: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('training_registrations')
    .insert({
      full_name: nome,
      email: normalize(json.email) || null,
      whatsapp,
      company_name: normalize(json.empresa) || null,
      role: cargo,
      leadership_time: tempoLideranca,
      team_size: normalize(json.tamanhEquipe) || null,
      main_challenge: normalize(json.maiorDesafio) || null,
      training_id: normalize(json.treinamento),
      source_page: normalize(json.sourcePage) || 'inscricao',
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting training registration:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Disparar email follow-up (fire-and-forget)
  const email = normalize(json.email)
  if (email) {
    import('@/lib/email/send').then(({ sendEmail }) => {
      sendEmail(email, 'workshop-followup', {
        name: nome,
        workshopName: normalize(json.treinamento) === 'modulo-1-funcao-estrategica'
          ? 'A Função Estratégica do Supervisor'
          : 'Treinamento LIDERA',
      }).catch(() => {})
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, registrationId: data.id })
}
