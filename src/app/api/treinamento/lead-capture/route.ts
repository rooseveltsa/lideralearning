import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

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
    } else {
      await admin.from('crm_prospects').insert({
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
    }
  } catch (e) {
    console.error('[lead-capture] CRM upsert failed:', e)
    return NextResponse.json({ error: 'Falha ao registrar lead.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
