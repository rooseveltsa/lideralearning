import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

type PDIPayload = {
  userId: string
  cargo: string
  tempoFuncao: string
  departamento: string
  dimensoes: {
    facilitador: number
    orientador: number
    garantidor: number
    estrategista: number
    mentor: number
  }
  hardSkills: {
    execucao: number
    processos: number
    ferramentas: number
    padroes: number
  }
  softSkills: {
    inteligenciaEmocional: number
    feedback: number
    conflitosGeracionais: number
    visaoFuturo: number
  }
  faseAtual: number
  compromissos: {
    comportamento: string
    dados: string
    sucessao: string
  }
  competencias40: string[]
  textoTriade: string
}

function normalize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function clamp(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number') return null
  if (value < min || value > max) return null
  return value
}

function calcMediaDimensoes(dim: PDIPayload['dimensoes']): number {
  const values = [
    dim.facilitador,
    dim.orientador,
    dim.garantidor,
    dim.estrategista,
    dim.mentor,
  ]
  const valid = values.filter((v) => typeof v === 'number' && v >= 1 && v <= 5)
  if (valid.length === 0) return 0
  const sum = valid.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / valid.length) * 10) / 10
}

export async function POST(request: Request) {
  let json: PDIPayload

  try {
    json = (await request.json()) as PDIPayload
  } catch {
    return NextResponse.json({ error: 'Payload invalido.' }, { status: 400 })
  }

  if (!json.userId || !json.dimensoes) {
    return NextResponse.json(
      { error: 'Dados obrigatorios ausentes.' },
      { status: 400 },
    )
  }

  const mediaDimensoes = calcMediaDimensoes(json.dimensoes)

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('leadership_pdi')
    .insert({
      user_id: json.userId,
      // identification
      cargo: normalize(json.cargo) || null,
      tempo_funcao: normalize(json.tempoFuncao) || null,
      departamento: normalize(json.departamento) || null,
      // 5 dimensions
      dim_facilitador: clamp(json.dimensoes?.facilitador, 1, 5),
      dim_orientador: clamp(json.dimensoes?.orientador, 1, 5),
      dim_garantidor: clamp(json.dimensoes?.garantidor, 1, 5),
      dim_estrategista: clamp(json.dimensoes?.estrategista, 1, 5),
      dim_mentor: clamp(json.dimensoes?.mentor, 1, 5),
      // hard skills
      hs_execucao: clamp(json.hardSkills?.execucao, 1, 5),
      hs_processos: clamp(json.hardSkills?.processos, 1, 5),
      hs_ferramentas: clamp(json.hardSkills?.ferramentas, 1, 5),
      hs_padroes: clamp(json.hardSkills?.padroes, 1, 5),
      // soft skills
      ss_inteligencia_emocional: clamp(json.softSkills?.inteligenciaEmocional, 1, 5),
      ss_feedback: clamp(json.softSkills?.feedback, 1, 5),
      ss_conflitos_geracionais: clamp(json.softSkills?.conflitosGeracionais, 1, 5),
      ss_visao_futuro: clamp(json.softSkills?.visaoFuturo, 1, 5),
      // 12 week plan
      fase_atual: clamp(json.faseAtual, 1, 3),
      compromisso_comportamento: normalize(json.compromissos?.comportamento) || null,
      compromisso_dados: normalize(json.compromissos?.dados) || null,
      compromisso_sucessao: normalize(json.compromissos?.sucessao) || null,
      // 4.0 competencies
      competencias_40: json.competencias40 ?? [],
      texto_triade: normalize(json.textoTriade) || null,
      // calculated
      media_dimensoes: mediaDimensoes,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting leadership PDI:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, pdiId: data.id })
}
