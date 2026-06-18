import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { normalizeOrgCode } from '@/lib/surveys/orgs'
import {
  FORMACAO_TODOS_ITENS,
  FORMACAO_MODULOS,
  computeModuleScores,
  rankModules,
  topModulos,
  type FormacaoRespostas,
  type FormacaoFiltros,
} from '@/lib/formacao/formacao-data'

type Payload = {
  userId?: string
  org?: string
  nome?: string
  email?: string
  empresa?: string
  setor?: string
  tempoFuncao?: string
  qtdLiderados?: string
  respostas?: Record<string, unknown>
  filtros?: Record<string, unknown>
  abertas?: Record<string, unknown>
  consentimento?: unknown
}

const ITEM_IDS = new Set(FORMACAO_TODOS_ITENS.map((i) => i.id))
const MODULO_IDS = new Set(FORMACAO_MODULOS.map((m) => m.id))

function isValidScale(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5
}

// Mantém só itens conhecidos e notas válidas (1..5 ou null) nos dois eixos.
function sanitizeRespostas(raw: Record<string, unknown> | undefined): FormacaoRespostas {
  const out: FormacaoRespostas = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw)) {
    if (!ITEM_IDS.has(k) || !v || typeof v !== 'object') continue
    const obj = v as Record<string, unknown>
    out[k] = {
      competencia: isValidScale(obj.competencia) ? (obj.competencia as number) : null,
      prioridade: isValidScale(obj.prioridade) ? (obj.prioridade as number) : null,
    }
  }
  return out
}

function sanitizeFiltros(raw: Record<string, unknown> | undefined): FormacaoFiltros {
  const out: FormacaoFiltros = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw)) {
    if (MODULO_IDS.has(k)) out[k] = v === true
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

function str(v: unknown, max = 200): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(request: Request) {
  let json: Payload
  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  // Instrumento IDENTIFICADO + LGPD: consentimento e identificação são obrigatórios.
  if (json.consentimento !== true) {
    return NextResponse.json(
      { error: 'É preciso aceitar o uso dos dados (LGPD) para continuar.' },
      { status: 400 },
    )
  }

  const nome = str(json.nome, 160)
  const email = str(json.email, 160)
  if (!nome || !email) {
    return NextResponse.json({ error: 'Nome e e-mail/matrícula são obrigatórios.' }, { status: 400 })
  }

  const respostas = sanitizeRespostas(json.respostas)
  const filtros = sanitizeFiltros(json.filtros)
  if (Object.keys(respostas).length === 0 && Object.values(filtros).every((v) => !v)) {
    return NextResponse.json({ error: 'Responda ao menos um módulo antes de enviar.' }, { status: 400 })
  }

  // Scoring no servidor: Cm, Pm, Gap, IN, IN_norm por módulo + ranking + Top 3.
  const scores = computeModuleScores(respostas, filtros)
  const { ranked, tudoUrgente } = rankModules(scores)
  const top = topModulos(scores)

  const gaps = {
    modulos: scores,
    ranking: ranked.map((s, idx) => ({ posicao: idx + 1, id: s.id, titulo: s.titulo, inNorm: s.inNorm })),
    flags: { tudoUrgente },
  }

  // user_id é opcional: usado quando o supervisor está logado.
  const userId =
    typeof json.userId === 'string' && /^[0-9a-f-]{36}$/i.test(json.userId) ? json.userId : null

  // Segmentação multi-cliente via ?org=code na URL.
  const orgCode = normalizeOrgCode(json.org) || null

  const admin = createAdminClient()
  const { error } = await admin.from('training_needs_assessments').insert({
    user_id: userId,
    org_code: orgCode,
    nome,
    email,
    empresa: str(json.empresa, 160) || null,
    setor: str(json.setor, 120) || null,
    tempo_funcao: str(json.tempoFuncao, 60) || null,
    qtd_liderados: str(json.qtdLiderados, 60) || null,
    respostas,
    gaps,
    top_modulos: top,
    abertas: sanitizeAbertas(json.abertas),
    consentimento: true,
    user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
  })

  if (error) {
    console.error('[formacao] insert error:', error)
    return NextResponse.json({ error: 'Não foi possível salvar. Tente novamente.' }, { status: 500 })
  }

  // Top 3 (títulos dos módulos LIDERA) alimenta o motor de PDI de treinamento já existente.
  return NextResponse.json({ success: true, topModulos: top })
}
