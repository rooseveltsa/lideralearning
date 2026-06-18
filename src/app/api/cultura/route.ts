import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { normalizeOrgCode } from '@/lib/surveys/orgs'
import {
  CULTURA_TODOS_ITENS,
  computeDimensionScores,
  computeOverall,
  type CulturaRespostas,
} from '@/lib/cultura/cultura-data'

type Payload = {
  setor?: string
  setorOutro?: string
  respostas?: Record<string, unknown>
  abertas?: Record<string, unknown>
  org?: string
}

const ITEM_IDS = new Set(CULTURA_TODOS_ITENS.map((i) => i.id))

// Mantém só itens conhecidos e valores válidos (1..5 ou null = NS/NA).
function sanitizeRespostas(raw: Record<string, unknown> | undefined): CulturaRespostas {
  const out: CulturaRespostas = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw)) {
    if (!ITEM_IDS.has(k)) continue
    if (v === null) {
      out[k] = null
    } else if (typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5) {
      out[k] = v
    }
  }
  return out
}

function sanitizeAbertas(raw: Record<string, unknown> | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && v.trim()) out[k.slice(0, 40)] = v.trim().slice(0, 2000)
  }
  return out
}

export async function POST(request: Request) {
  let json: Payload
  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const setor = typeof json.setor === 'string' ? json.setor.trim() : ''
  if (!setor) {
    return NextResponse.json({ error: 'Setor é obrigatório.' }, { status: 400 })
  }

  const respostas = sanitizeRespostas(json.respostas)
  if (Object.keys(respostas).length === 0) {
    return NextResponse.json({ error: 'Responda ao menos uma pergunta.' }, { status: 400 })
  }

  const dimensionScores = computeDimensionScores(respostas)
  const overall = computeOverall(dimensionScores)

  const orgCode = normalizeOrgCode(typeof json.org === 'string' ? json.org : null)

  const admin = createAdminClient()
  const { error } = await admin.from('preventive_culture_responses').insert({
    setor: setor.slice(0, 120),
    org_code: orgCode || null,
    setor_outro:
      setor === 'Outro' && typeof json.setorOutro === 'string'
        ? json.setorOutro.trim().slice(0, 120) || null
        : null,
    respostas,
    dimension_scores: dimensionScores,
    overall_score: overall,
    abertas: sanitizeAbertas(json.abertas),
    user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
  })

  if (error) {
    console.error('[cultura] insert error:', error)
    return NextResponse.json({ error: 'Não foi possível salvar. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
