/**
 * Camada de IA (opcional) sobre o plano de ação determinístico do PDI.
 *
 * O plano de ação base (developmentTracks) é gerado por regra a partir do
 * método LIDERA — sempre funciona. Esta camada usa a IA (NVIDIA NIM) apenas
 * para dar TOM: reescreve o "porQueImporta" conectando à dor/custo relatados
 * e refina as ações, mantendo as ferramentas/módulo LIDERA prescritos.
 *
 * Tudo é defensivo: qualquer falha (sem API key, timeout, JSON inválido)
 * retorna null → o PDI mostra o plano determinístico. Nunca quebra a tela.
 */

import { nvidiaComplete } from '@/lib/ai/nvidia-client'
import { logger } from '@/lib/logger/structured'
import type { DevelopmentTrack, PDIReport } from '@/lib/utils/pdi-generator'

export type AiTrackPatch = {
  dimensao: string
  porQueImporta?: string
  acoes?: string[]
}

const MAX_ACOES = 6

function buildPrompt(report: PDIReport): { system: string; user: string } {
  const dor = report.userContext?.dorAtual?.trim() || null
  const custo = report.userContext?.custoFuturo?.trim() || null

  const tracks = report.developmentTracks.map((t) => ({
    dimensao: t.dimensao,
    moduloLidera: t.moduloLidera,
    ferramentas: t.ferramentas.map((f) => f.sigla),
    porQueImporta: t.porQueImporta,
    acoes: t.acoes,
  }))

  const system = [
    'Você é mentor de liderança do programa LIDERA Treinamentos.',
    'Recebe o plano de ação base de um líder (gaps + prescrições do método LIDERA).',
    'Sua tarefa: personalizar o TOM de cada trilha, sem inventar conteúdo novo.',
    'Regras rígidas:',
    '- NÃO troque o módulo nem as ferramentas LIDERA já prescritas. Mantenha-as.',
    '- Reescreva "porQueImporta" conectando o gap à dor/custo que o líder relatou (quando houver), em 1-2 frases diretas.',
    '- Refine "acoes" para ficarem concretas e específicas, sem perder as ferramentas citadas. Máx. 6 ações por trilha.',
    '- Português do Brasil, tom de quem quer ajudar de verdade. Sem jargão vazio.',
    'Responda SOMENTE com JSON válido no formato: {"tracks":[{"dimensao":"...","porQueImporta":"...","acoes":["..."]}]}.',
    'Use exatamente os mesmos valores de "dimensao" recebidos.',
  ].join('\n')

  const user = JSON.stringify({
    lider: report.alunoName,
    dorRelatada: dor,
    custoSeNadaMudar: custo,
    tracks,
  })

  return { system, user }
}

function sanitizePatch(raw: unknown, validDims: Set<string>): AiTrackPatch | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const dimensao = typeof r.dimensao === 'string' ? r.dimensao : null
  if (!dimensao || !validDims.has(dimensao)) return null

  const patch: AiTrackPatch = { dimensao }

  if (typeof r.porQueImporta === 'string' && r.porQueImporta.trim()) {
    patch.porQueImporta = r.porQueImporta.trim()
  }
  if (Array.isArray(r.acoes)) {
    const acoes = r.acoes
      .filter((a): a is string => typeof a === 'string' && a.trim().length > 0)
      .map((a) => a.trim())
      .slice(0, MAX_ACOES)
    if (acoes.length > 0) patch.acoes = acoes
  }

  // Só vale a pena se trouxe algo
  if (!patch.porQueImporta && !patch.acoes) return null
  return patch
}

/**
 * Gera os patches de IA para o plano de ação. Retorna null em qualquer falha.
 */
export async function generateAiTrackPatches(
  report: PDIReport,
): Promise<AiTrackPatch[] | null> {
  if (!process.env.NVIDIA_API_KEY) return null
  if (!report.developmentTracks?.length) return null

  try {
    const { system, user } = buildPrompt(report)
    const result = await nvidiaComplete(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      // Enriquecimento é opcional (só dá "tom" ao PDI) e roda inline numa rota sem
      // maxDuration estendido — por isso não herda os 50s do gerador de PDI.
      { jsonMode: true, temperature: 0.5, maxTokens: 2200, timeoutMs: 20_000 },
    )

    const parsed = JSON.parse(result.content) as { tracks?: unknown }
    if (!Array.isArray(parsed.tracks)) return null

    const validDims = new Set(report.developmentTracks.map((t) => t.dimensao))
    const patches = parsed.tracks
      .map((t) => sanitizePatch(t, validDims))
      .filter((p): p is AiTrackPatch => p !== null)

    return patches.length > 0 ? patches : null
  } catch (err) {
    logger.error('pdi_ai_enrich_failed', {
      alunoId: report.alunoId,
      error: err instanceof Error ? err.message : 'unknown',
    })
    return null
  }
}

/**
 * Valida e converte o valor armazenado (action_plan_ai) em patches utilizáveis.
 */
export function parseStoredPatches(value: unknown): AiTrackPatch[] | null {
  if (!Array.isArray(value)) return null
  const patches: AiTrackPatch[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    if (typeof r.dimensao !== 'string') continue
    const patch: AiTrackPatch = { dimensao: r.dimensao }
    if (typeof r.porQueImporta === 'string' && r.porQueImporta.trim()) {
      patch.porQueImporta = r.porQueImporta.trim()
    }
    if (Array.isArray(r.acoes)) {
      const acoes = r.acoes
        .filter((a): a is string => typeof a === 'string' && a.trim().length > 0)
        .map((a) => a.trim())
      if (acoes.length > 0) patch.acoes = acoes
    }
    if (patch.porQueImporta || patch.acoes) patches.push(patch)
  }
  return patches.length > 0 ? patches : null
}

/**
 * Aplica os patches de IA sobre as trilhas determinísticas (overlay por dimensão).
 */
export function applyAiTrackPatches(
  tracks: DevelopmentTrack[],
  patches: AiTrackPatch[] | null | undefined,
): DevelopmentTrack[] {
  if (!patches?.length) return tracks
  const byDim = new Map(patches.map((p) => [p.dimensao, p]))
  return tracks.map((t) => {
    const p = byDim.get(t.dimensao)
    if (!p) return t
    return {
      ...t,
      porQueImporta: p.porQueImporta ?? t.porQueImporta,
      acoes: p.acoes ?? t.acoes,
    }
  })
}

/**
 * Helper para read sites: aplica o plano de IA armazenado sobre o report,
 * caindo no determinístico se nada válido houver.
 */
export function withStoredAiPlan(report: PDIReport, storedAiPlan: unknown): PDIReport {
  const patches = parseStoredPatches(storedAiPlan)
  if (!patches) return report
  return {
    ...report,
    developmentTracks: applyAiTrackPatches(report.developmentTracks, patches),
  }
}
