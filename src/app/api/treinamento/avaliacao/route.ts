import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

type AvaliacaoPayload = {
  nome: string
  whatsapp: string
  empresa?: string
  cargo?: string
  respostas: Array<{ perguntaId: number; valor: number }>
  resultado: { media: number; categorias: Record<string, number> }
  treinamento: string
}

function normalize(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function POST(request: Request) {
  let json: AvaliacaoPayload

  try {
    json = (await request.json()) as AvaliacaoPayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const nome = normalize(json.nome)
  const whatsapp = normalize(json.whatsapp)

  if (!nome || !whatsapp || !json.respostas?.length || !json.resultado) {
    return NextResponse.json({ error: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('training_assessments')
    .insert({
      full_name: nome,
      whatsapp,
      company_name: normalize(json.empresa) || null,
      role: normalize(json.cargo) || null,
      answers: json.respostas,
      result_summary: json.resultado,
      overall_score: json.resultado.media,
      training_id: normalize(json.treinamento),
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting training assessment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, assessmentId: data.id })
}
