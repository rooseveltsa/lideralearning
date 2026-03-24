/**
 * Assessment Comparison Utilities
 *
 * Compares self-assessment (autoavaliacao) with executive assessment
 * (avaliacao executiva) to produce a unified view of leadership dimensions.
 *
 * Self-assessment dimensions (scored 1-3):
 *   - percepcao  (Funcao/Atuacao)
 *   - gestao     (Gestao de Equipes)
 *   - comunicacao (Comunicacao/Feedback)
 *   - tecnologia (Tecnologia/KPIs)
 *   - etica      (Etica)
 *   - dor        (Clareza/Urgencia)
 *
 * Executive assessment dimensions (scored 1-5):
 *   - dim_comunicacao
 *   - dim_tomada_decisao
 *   - dim_gestao_equipe
 *   - dim_orientacao_resultados
 *   - dim_adaptabilidade
 *   - dim_lideranca_estrategica
 *   - dim_desenvolvimento_pessoas
 *   - dim_inovacao
 *   - dim_etica_integridade
 *   - dim_gestao_crise
 */

export type ComparisonDimension = {
  label: string
  selfScore: number | null   // raw score on 1-3 scale
  selfMax: number
  execScore: number | null   // raw score on 1-5 scale
  execMax: number
  gap: number               // absolute difference normalized to 0-100
  alignment: 'aligned' | 'divergent' | 'no_data'
}

export type ExecOnlyDimension = {
  label: string
  score: number | null
  max: number
}

export type ComparisonResult = {
  paired: ComparisonDimension[]
  selfOnly: { label: string; score: number | null; max: number }[]
  execOnly: ExecOnlyDimension[]
}

// ---------------------------------------------------------------------------
// Self-assessment field mapping
// ---------------------------------------------------------------------------

type SelfAssessmentData = {
  q_percepcao?: number | null
  q_gestao?: number | null
  q_comunicacao?: number | null
  q_tecnologia?: number | null
  q_etica?: number | null
  q_dor?: number | null
  [key: string]: unknown
}

type ExecAssessmentData = {
  dim_comunicacao?: number | null
  dim_tomada_decisao?: number | null
  dim_gestao_equipe?: number | null
  dim_orientacao_resultados?: number | null
  dim_adaptabilidade?: number | null
  dim_lideranca_estrategica?: number | null
  dim_desenvolvimento_pessoas?: number | null
  dim_inovacao?: number | null
  dim_etica_integridade?: number | null
  dim_gestao_crise?: number | null
  [key: string]: unknown
}

// Paired dimensions: self field -> exec field -> display label
const PAIRED_DIMENSIONS: Array<{
  label: string
  selfKey: keyof SelfAssessmentData
  selfMax: number
  execKey: keyof ExecAssessmentData
  execMax: number
}> = [
  {
    label: 'Percepcao da Funcao',
    selfKey: 'q_percepcao',
    selfMax: 3,
    execKey: 'dim_orientacao_resultados',
    execMax: 5,
  },
  {
    label: 'Gestao de Equipes',
    selfKey: 'q_gestao',
    selfMax: 3,
    execKey: 'dim_gestao_equipe',
    execMax: 5,
  },
  {
    label: 'Comunicacao e Postura',
    selfKey: 'q_comunicacao',
    selfMax: 3,
    execKey: 'dim_comunicacao',
    execMax: 5,
  },
  {
    label: 'Tecnologia e Dados',
    selfKey: 'q_tecnologia',
    selfMax: 3,
    execKey: 'dim_tomada_decisao',
    execMax: 5,
  },
  {
    label: 'Etica e Integridade',
    selfKey: 'q_etica',
    selfMax: 3,
    execKey: 'dim_etica_integridade',
    execMax: 5,
  },
]

// Self-only dimension (no direct exec counterpart)
const SELF_ONLY_DIMENSIONS: Array<{
  label: string
  key: keyof SelfAssessmentData
  max: number
}> = [
  { label: 'Clareza da Dor / Urgencia', key: 'q_dor', max: 3 },
]

// Exec-only dimensions (no direct self counterpart)
const EXEC_ONLY_DIMENSIONS: Array<{
  label: string
  key: keyof ExecAssessmentData
  max: number
}> = [
  { label: 'Adaptabilidade', key: 'dim_adaptabilidade', max: 5 },
  { label: 'Lideranca Estrategica', key: 'dim_lideranca_estrategica', max: 5 },
  { label: 'Desenvolvimento de Pessoas', key: 'dim_desenvolvimento_pessoas', max: 5 },
  { label: 'Inovacao', key: 'dim_inovacao', max: 5 },
  { label: 'Gestao de Crise', key: 'dim_gestao_crise', max: 5 },
]

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a raw score to a 0-100 percentage.
 */
export function normalizeScore(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((score / max) * 100)
}

/**
 * Build a full comparison result from raw assessment data.
 *
 * Accepts the DB row shapes (snake_case fields) or null when an
 * assessment has not been completed.
 */
export function buildComparison(
  selfAssessment: SelfAssessmentData | null,
  execAssessment: ExecAssessmentData | null,
): ComparisonResult {
  const paired: ComparisonDimension[] = PAIRED_DIMENSIONS.map((dim) => {
    const selfRaw = selfAssessment
      ? (selfAssessment[dim.selfKey] as number | null | undefined) ?? null
      : null
    const execRaw = execAssessment
      ? (execAssessment[dim.execKey] as number | null | undefined) ?? null
      : null

    const selfPct = selfRaw !== null ? normalizeScore(selfRaw, dim.selfMax) : null
    const execPct = execRaw !== null ? normalizeScore(execRaw, dim.execMax) : null

    let gap = 0
    let alignment: ComparisonDimension['alignment'] = 'no_data'

    if (selfPct !== null && execPct !== null) {
      gap = Math.abs(selfPct - execPct)
      alignment = gap <= 20 ? 'aligned' : 'divergent'
    }

    return {
      label: dim.label,
      selfScore: selfRaw,
      selfMax: dim.selfMax,
      execScore: execRaw,
      execMax: dim.execMax,
      gap,
      alignment,
    }
  })

  const selfOnly = SELF_ONLY_DIMENSIONS.map((dim) => ({
    label: dim.label,
    score: selfAssessment
      ? (selfAssessment[dim.key] as number | null | undefined) ?? null
      : null,
    max: dim.max,
  }))

  const execOnly: ExecOnlyDimension[] = EXEC_ONLY_DIMENSIONS.map((dim) => ({
    label: dim.label,
    score: execAssessment
      ? (execAssessment[dim.key] as number | null | undefined) ?? null
      : null,
    max: dim.max,
  }))

  return { paired, selfOnly, execOnly }
}

/**
 * Calculate overall alignment percentage across all paired dimensions.
 *
 * Returns a value from 0 to 100 where 100 means perfect alignment.
 * Only considers dimensions where both scores are available.
 */
export function calculateAlignment(dimensions: ComparisonDimension[]): number {
  const withData = dimensions.filter((d) => d.alignment !== 'no_data')
  if (withData.length === 0) return 0

  const totalGap = withData.reduce((sum, d) => sum + d.gap, 0)
  const maxPossibleGap = withData.length * 100
  const alignmentPct = Math.round(((maxPossibleGap - totalGap) / maxPossibleGap) * 100)

  return Math.max(0, Math.min(100, alignmentPct))
}

/**
 * Generate textual gap summary cards describing the most notable
 * divergences and alignments.
 */
export function getGapSummary(dimensions: ComparisonDimension[]): string[] {
  const summaries: string[] = []
  const withData = dimensions.filter((d) => d.alignment !== 'no_data')

  if (withData.length === 0) {
    summaries.push(
      'Nao ha dados suficientes para gerar uma analise comparativa. ' +
      'Aguardando ambas as avaliacoes serem concluidas.',
    )
    return summaries
  }

  // Sort by gap descending to highlight biggest divergences first
  const sorted = [...withData].sort((a, b) => b.gap - a.gap)

  const divergent = sorted.filter((d) => d.gap > 20)
  const aligned = sorted.filter((d) => d.gap <= 20)

  if (divergent.length > 0) {
    const top = divergent[0]
    const selfPct = top.selfScore !== null ? normalizeScore(top.selfScore, top.selfMax) : 0
    const execPct = top.execScore !== null ? normalizeScore(top.execScore, top.execMax) : 0

    summaries.push(
      `Maior divergencia em "${top.label}": ` +
      `autoavaliacao ${selfPct}% vs executiva ${execPct}% ` +
      `(gap de ${top.gap}pp). Pode indicar ponto cego ou percepcao desalinhada.`,
    )
  }

  if (divergent.length > 1) {
    const names = divergent.slice(1).map((d) => `"${d.label}"`).join(', ')
    summaries.push(
      `Outras dimensoes com divergencia significativa: ${names}. ` +
      'Recomendamos discutir estes pontos na mentoria.',
    )
  }

  if (aligned.length > 0) {
    const names = aligned.map((d) => `"${d.label}"`).join(', ')
    summaries.push(
      `Dimensoes alinhadas (gap <= 20pp): ${names}. ` +
      'A percepcao do lider esta coerente com a visao do gestor nestes aspectos.',
    )
  }

  // Overall verdict
  const alignment = calculateAlignment(dimensions)
  if (alignment >= 80) {
    summaries.push(
      `Alinhamento geral de ${alignment}%: excelente coerencia entre as percepcoes. ` +
      'Foco em potencializar os pontos fortes.',
    )
  } else if (alignment >= 60) {
    summaries.push(
      `Alinhamento geral de ${alignment}%: coerencia moderada. ` +
      'Ha oportunidades de calibracao entre a visao interna e externa.',
    )
  } else {
    summaries.push(
      `Alinhamento geral de ${alignment}%: divergencia significativa. ` +
      'Sugere-se sessao de feedback estruturado entre lider e gestor.',
    )
  }

  return summaries
}
