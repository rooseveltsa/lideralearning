import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { normalizeOrgCode } from '@/lib/surveys/orgs'
import {
  PSICOSSOCIAL_TODOS_ITENS,
  PSICOSSOCIAL_CRITICOS,
  computeDimensionScores,
  computeOverall,
  type PsicossocialRespostas,
  type PsicossocialCriticosMap,
} from '@/lib/psicossocial/psicossocial-data'

type Payload = {
  setor?: string
  setorOutro?: string
  turno?: string
  respostas?: Record<string, unknown>
  criticos?: Record<string, unknown>
  abertas?: Record<string, unknown>
  org?: string
}

const ITEM_IDS = new Set(PSICOSSOCIAL_TODOS_ITENS.map((i) => i.id))
const CRITICO_BY_ID = new Map(PSICOSSOCIAL_CRITICOS.map((c) => [c.id, c]))

// Mantém só itens conhecidos e valores válidos (1..5 ou null = NS/NA).
function sanitizeRespostas(raw: Record<string, unknown> | undefined): PsicossocialRespostas {
  const out: PsicossocialRespostas = {}
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

// Parte 2 (críticos): valor de frequência + relato livre opcional, só de itens conhecidos.
function sanitizeCriticos(raw: Record<string, unknown> | undefined): PsicossocialCriticosMap {
  const out: PsicossocialCriticosMap = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw)) {
    const def = CRITICO_BY_ID.get(k)
    if (!def) continue
    if (!v || typeof v !== 'object') continue
    const obj = v as Record<string, unknown>
    let value: number | null = null
    if (obj.value === null) {
      value = null
    } else if (
      typeof obj.value === 'number' &&
      Number.isInteger(obj.value) &&
      obj.value >= 1 &&
      obj.value <= 5
    ) {
      value = obj.value
    } else {
      continue
    }
    // Relato livre só é aceito em itens que o permitem (sigilo profissional).
    const relato =
      def.relato && typeof obj.relato === 'string' && obj.relato.trim()
        ? obj.relato.trim().slice(0, 2000)
        : undefined
    out[k] = relato ? { value, relato } : { value }
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

  const turno = typeof json.turno === 'string' ? json.turno.trim() : ''
  if (!turno) {
    return NextResponse.json({ error: 'Turno é obrigatório.' }, { status: 400 })
  }

  const respostas = sanitizeRespostas(json.respostas)
  const criticos = sanitizeCriticos(json.criticos)
  if (Object.keys(respostas).length === 0 && Object.keys(criticos).length === 0) {
    return NextResponse.json({ error: 'Responda ao menos uma pergunta.' }, { status: 400 })
  }

  const dimensionScores = computeDimensionScores(respostas)
  const overall = computeOverall(dimensionScores)
  const orgCode = normalizeOrgCode(typeof json.org === 'string' ? json.org : null)

  const admin = createAdminClient()
  const { error } = await admin.from('psychosocial_survey_responses').insert({
    org_code: orgCode || null,
    setor: setor.slice(0, 120),
    setor_outro:
      setor === 'Outro' && typeof json.setorOutro === 'string'
        ? json.setorOutro.trim().slice(0, 120) || null
        : null,
    turno: turno.slice(0, 60),
    respostas,
    dimension_scores: dimensionScores,
    overall_risk: overall,
    criticos,
    abertas: sanitizeAbertas(json.abertas),
    user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
  })

  if (error) {
    console.error('[psicossocial] insert error:', error)
    return NextResponse.json(
      { error: 'Não foi possível salvar. Tente novamente.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
