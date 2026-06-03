/**
 * PDI Generator Engine
 *
 * Generates a complete Plano de Desenvolvimento Individual (PDI) report
 * by comparing the self-assessment (autoavaliacao) with the executive
 * assessment (avaliacao executiva).
 *
 * The PDI is NOT a form — it is an auto-generated analytical report.
 */

import {
  buildComparison,
  calculateAlignment,
  normalizeScore,
} from '@/lib/utils/assessment-comparison'
import { DESENVOLVIMENTO_POR_DIMENSAO } from '@/lib/diagnostico/pdi-knowledge/desenvolvimento-por-dimensao'
import { FERRAMENTAS } from '@/lib/diagnostico/pdi-knowledge/ferramentas'
import { LITERATURAS } from '@/lib/diagnostico/pdi-knowledge/fundamentos'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PDIDimension = {
  name: string
  selfScore: number       // normalized 0-100
  execScore: number       // normalized 0-100
  gap: number             // absolute difference
  priority: 'critical' | 'high' | 'medium' | 'low'
  recommendation: string
}

export type PDIPlanPhase = {
  title: string
  weeks: string
  focus: string
  actions: string[]
}

export type PDIKPI = {
  name: string
  current: string
  target: string
  timeline: string
}

/**
 * Trilha de desenvolvimento por gap — o "plano de ação" real do PDI.
 * Liga cada dimensão fraca ao conteúdo do método LIDERA (módulo, ferramentas,
 * apostila, leitura), com ações concretas e como medir.
 */
export type DevelopmentTrack = {
  dimensao: string
  priority: PDIDimension['priority']
  selfScore: number
  execScore: number
  gap: number
  moduloLidera: string
  porQueImporta: string
  ferramentas: { sigla: string; nome: string; shortDescription: string }[]
  apostila: string
  leitura: { titulo: string; autor: string }[]
  acoes: string[]
  externo: string[]
  comoMedir: string
}

export type PDIReport = {
  alunoId: string
  alunoName: string
  company: string | null
  generatedAt: string
  mode: 'full' | 'partial' // partial = only self-assessment, full = both assessments

  // Scores
  selfAssessment: {
    total: number
    perfil: string
    details: Record<string, number>
  }
  execAssessment: {
    details: Record<string, number>
    nivelAtual: string
    nivelEsperado: string
  } | null // null when mode = partial

  // Analysis
  overallAlignment: number // 0-100%
  dimensions: PDIDimension[]

  // Strengths & Gaps
  strengths: string[]
  criticalGaps: string[]
  blindSpots: string[]      // high self but low exec (overconfidence)
  hiddenStrengths: string[] // low self but high exec (undervalued)

  // Development Plan (auto-generated)
  developmentPlan: {
    phase1: PDIPlanPhase
    phase2: PDIPlanPhase
    phase3: PDIPlanPhase
  }

  // Trilhas de desenvolvimento por gap (plano de ação baseado no método LIDERA)
  developmentTracks: DevelopmentTrack[]

  // KPIs to track
  kpisToTrack: PDIKPI[]

  // Mentoring focus
  mentoringFocus: {
    session30days: string[]
    session60days: string[]
  }

  // User context (from open-ended text fields)
  userContext?: {
    dorAtual: string | null
    custoFuturo: string | null
  } | null
}

export type PDIStatus = 'ready' | 'waiting_self' | 'waiting_exec' | 'waiting_both'

// ---------------------------------------------------------------------------
// Internal mappings
// ---------------------------------------------------------------------------

type SelfFields = {
  q_percepcao?: number | null
  q_gestao?: number | null
  q_comunicacao?: number | null
  q_tecnologia?: number | null
  q_etica?: number | null
  q_dor?: number | null
  pontuacao_total?: number | null
  perfil?: string | null
  texto_dor_atual?: string | null
  texto_custo_futuro?: string | null
  [key: string]: unknown
}

type ExecFields = {
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
  nivel_atual?: string | null
  nivel_esperado?: string | null
  equipe_gargalo?: string | null
  maturidade_atual?: string | null
  [key: string]: unknown
}

/**
 * All dimensions we track in the PDI. Each entry maps a human-readable name
 * to the self-assessment key (1-3 scale) and the exec-assessment key (1-5).
 * Some dimensions are exec-only (selfKey = null) or self-only (execKey = null).
 */
const ALL_DIMENSIONS: Array<{
  name: string
  selfKey: keyof SelfFields | null
  selfMax: number
  execKey: keyof ExecFields | null
  execMax: number
  category: 'behavioral' | 'processual' | 'strategic'
}> = [
  // Paired dimensions
  {
    name: 'Comunicacao e Postura',
    selfKey: 'q_comunicacao',
    selfMax: 3,
    execKey: 'dim_comunicacao',
    execMax: 5,
    category: 'behavioral',
  },
  {
    name: 'Etica e Integridade',
    selfKey: 'q_etica',
    selfMax: 3,
    execKey: 'dim_etica_integridade',
    execMax: 5,
    category: 'behavioral',
  },
  {
    name: 'Gestao de Equipes',
    selfKey: 'q_gestao',
    selfMax: 3,
    execKey: 'dim_gestao_equipe',
    execMax: 5,
    category: 'processual',
  },
  {
    name: 'Percepcao da Funcao / Resultados',
    selfKey: 'q_percepcao',
    selfMax: 3,
    execKey: 'dim_orientacao_resultados',
    execMax: 5,
    category: 'processual',
  },
  {
    name: 'Tecnologia e Decisao por Dados',
    selfKey: 'q_tecnologia',
    selfMax: 3,
    execKey: 'dim_tomada_decisao',
    execMax: 5,
    category: 'processual',
  },
  // Exec-only dimensions
  {
    name: 'Adaptabilidade',
    selfKey: null,
    selfMax: 3,
    execKey: 'dim_adaptabilidade',
    execMax: 5,
    category: 'behavioral',
  },
  {
    name: 'Lideranca Estrategica',
    selfKey: null,
    selfMax: 3,
    execKey: 'dim_lideranca_estrategica',
    execMax: 5,
    category: 'strategic',
  },
  {
    name: 'Desenvolvimento de Pessoas',
    selfKey: null,
    selfMax: 3,
    execKey: 'dim_desenvolvimento_pessoas',
    execMax: 5,
    category: 'processual',
  },
  {
    name: 'Inovacao',
    selfKey: null,
    selfMax: 3,
    execKey: 'dim_inovacao',
    execMax: 5,
    category: 'strategic',
  },
  {
    name: 'Gestao de Crise',
    selfKey: null,
    selfMax: 3,
    execKey: 'dim_gestao_crise',
    execMax: 5,
    category: 'strategic',
  },
  // Self-only dimension
  {
    name: 'Clareza da Dor / Urgencia',
    selfKey: 'q_dor',
    selfMax: 3,
    execKey: null,
    execMax: 5,
    category: 'behavioral',
  },
]

// Recommendations keyed by dimension name
const RECOMMENDATIONS: Record<string, { low: string; medium: string; high: string }> = {
  'Comunicacao e Postura': {
    low: 'Investir em tecnicas de feedback estruturado (SBI) e comunicacao nao-violenta. Praticar escuta ativa em reunioes semanais.',
    medium: 'Aprimorar comunicacao assertiva e alinhar postura de lideranca com equipe. Solicitar feedback 360 periodicamente.',
    high: 'Manter consistencia na comunicacao. Tornar-se referencia de postura para a equipe.',
  },
  'Etica e Integridade': {
    low: 'Revisar codigo de conduta e alinhar decisoes com valores organizacionais. Buscar mentoria sobre dilemas eticos.',
    medium: 'Fortalecer tomada de decisao etica em cenarios complexos. Documentar criterios de decisao.',
    high: 'Consolidar como exemplo de conduta etica. Mentorear outros lideres neste tema.',
  },
  'Gestao de Equipes': {
    low: 'Implementar reunioes 1:1 semanais, delegar tarefas com acompanhamento e definir expectativas claras por papel.',
    medium: 'Otimizar delegacao com mais autonomia. Desenvolver rituais de equipe e feedbacks regulares.',
    high: 'Focar em desenvolvimento de sucessores e empowerment da equipe.',
  },
  'Percepcao da Funcao / Resultados': {
    low: 'Clarificar papel de lider vs executor. Definir KPIs mensuráveis e revisar semanalmente.',
    medium: 'Alinhar entregas com metas estrategicas. Aumentar foco em resultados de medio prazo.',
    high: 'Expandir visao para impacto organizacional. Conectar resultados da equipe com estrategia corporativa.',
  },
  'Tecnologia e Decisao por Dados': {
    low: 'Capacitar-se em ferramentas de BI basicas. Comecar a tomar decisoes baseadas em dados simples.',
    medium: 'Aprofundar uso de dashboards e metricas. Implementar cultura data-driven na equipe.',
    high: 'Liderar iniciativas de transformacao digital. Ser referencia em decisao por dados.',
  },
  'Adaptabilidade': {
    low: 'Desenvolver flexibilidade diante de mudancas. Praticar cenarios de contingencia e gestao de ambiguidade.',
    medium: 'Aprimorar resiliencia e capacidade de pivotar. Liderar equipe em contextos de mudanca.',
    high: 'Tornar-se agente de mudanca organizacional. Inspirar adaptabilidade na equipe.',
  },
  'Lideranca Estrategica': {
    low: 'Participar de planejamento estrategico. Desenvolver visao de medio/longo prazo e pensamento sistemico.',
    medium: 'Conectar acoes operacionais com estrategia. Desenvolver capacidade de antecipacao de cenarios.',
    high: 'Liderar iniciativas estrategicas. Influenciar direcao organizacional.',
  },
  'Desenvolvimento de Pessoas': {
    low: 'Implementar PDIs individuais para a equipe. Investir tempo em coaching e desenvolvimento de talentos.',
    medium: 'Criar trilhas de desenvolvimento por competencia. Aplicar mentoria estruturada.',
    high: 'Tornar-se formador de lideres. Criar cultura de aprendizado continuo.',
  },
  'Inovacao': {
    low: 'Estimular experimentacao segura. Reservar tempo para ideacao e projetos piloto.',
    medium: 'Estruturar processos de inovacao incremental. Premiar iniciativas inovadoras da equipe.',
    high: 'Liderar transformacao e inovacao disruptiva. Ser embaixador de inovacao.',
  },
  'Gestao de Crise': {
    low: 'Desenvolver planos de contingencia. Treinar tomada de decisao sob pressao com cenarios simulados.',
    medium: 'Aprimorar comunicacao em crise e protocolos de escalonamento. Documentar lições aprendidas.',
    high: 'Ser referencia em gestao de crise. Mentorar equipe para autonomia em situacoes criticas.',
  },
  'Clareza da Dor / Urgencia': {
    low: 'Diagnosticar com clareza os problemas da equipe. Priorizar dores com impacto no resultado.',
    medium: 'Estruturar plano de acao para dores identificadas. Alinhar urgencias com gestor.',
    high: 'Usar clareza de dor como vantagem estrategica para priorizar investimentos em desenvolvimento.',
  },
}

// ---------------------------------------------------------------------------
// Priority classification
// ---------------------------------------------------------------------------

function classifyPriority(gap: number): PDIDimension['priority'] {
  if (gap > 40) return 'critical'
  if (gap > 25) return 'high'
  if (gap > 15) return 'medium'
  return 'low'
}

function getRecommendation(dimensionName: string, gap: number, selfScore: number, execScore: number): string {
  const rec = RECOMMENDATIONS[dimensionName]
  if (!rec) return 'Monitorar evolucao e buscar feedback continuo.'

  // Use the lower of the two scores to determine recommendation level
  const avgScore = (selfScore + execScore) / 2
  if (avgScore < 40) return rec.low
  if (avgScore < 70) return rec.medium
  return rec.high
}

// ---------------------------------------------------------------------------
// Perfil labels
// ---------------------------------------------------------------------------

const PERFIL_LABELS: Record<string, string> = {
  reativo: 'Supervisor Reativo',
  transicao: 'Supervisor em Transicao',
  lider_valor: 'Lider de Valor',
}

// ---------------------------------------------------------------------------
// Phase generation
// ---------------------------------------------------------------------------

function generatePhase1(weakDimensions: PDIDimension[]): PDIPlanPhase {
  const behavioral = weakDimensions.filter((d) => {
    const dim = ALL_DIMENSIONS.find((ad) => ad.name === d.name)
    return dim?.category === 'behavioral'
  })

  const actions: string[] = [
    'Mapear 3 situacoes recentes de desafio de comunicacao e analisar o que poderia melhorar.',
  ]

  if (behavioral.length > 0) {
    for (const dim of behavioral.slice(0, 2)) {
      actions.push(`Trabalhar gap em "${dim.name}": ${dim.recommendation}`)
    }
  }

  actions.push('Implementar ritual de check-in semanal com equipe direta.')
  actions.push('Registrar diario de lideranca (3 entradas por semana).')

  return {
    title: 'Consciencia e Comportamento',
    weeks: 'Semanas 1-4',
    focus: 'Desenvolver autoconsciencia, alinhar postura de lideranca e estabelecer habitos basicos de gestao.',
    actions,
  }
}

function generatePhase2(weakDimensions: PDIDimension[]): PDIPlanPhase {
  const processual = weakDimensions.filter((d) => {
    const dim = ALL_DIMENSIONS.find((ad) => ad.name === d.name)
    return dim?.category === 'processual'
  })

  const actions: string[] = [
    'Definir KPIs claros para cada membro da equipe com metas semanais.',
  ]

  if (processual.length > 0) {
    for (const dim of processual.slice(0, 2)) {
      actions.push(`Trabalhar gap em "${dim.name}": ${dim.recommendation}`)
    }
  }

  actions.push('Implementar reunioes 1:1 quinzenais com pauta estruturada.')
  actions.push('Criar painel de acompanhamento de resultados da equipe.')

  return {
    title: 'Processos e Gestao',
    weeks: 'Semanas 5-8',
    focus: 'Estruturar processos de gestao, delegacao e acompanhamento de resultados da equipe.',
    actions,
  }
}

function generatePhase3(weakDimensions: PDIDimension[]): PDIPlanPhase {
  const strategic = weakDimensions.filter((d) => {
    const dim = ALL_DIMENSIONS.find((ad) => ad.name === d.name)
    return dim?.category === 'strategic'
  })

  const actions: string[] = [
    'Elaborar proposta de melhoria estrategica para apresentar ao gestor.',
  ]

  if (strategic.length > 0) {
    for (const dim of strategic.slice(0, 2)) {
      actions.push(`Trabalhar gap em "${dim.name}": ${dim.recommendation}`)
    }
  }

  actions.push('Identificar e preparar potencial sucessor para pelo menos 1 funcao critica.')
  actions.push('Participar de fórum de inovacao ou grupo de benchmarking externo.')

  return {
    title: 'Visao Estrategica e Inovacao',
    weeks: 'Semanas 9-12',
    focus: 'Desenvolver pensamento estrategico, capacidade de inovacao e visao de longo prazo.',
    actions,
  }
}

// ---------------------------------------------------------------------------
// KPI generation
// ---------------------------------------------------------------------------

function generateKPIs(dimensions: PDIDimension[], perfil: string): PDIKPI[] {
  const kpis: PDIKPI[] = []

  // Overall alignment KPI
  const avgScore = dimensions.length > 0
    ? Math.round(dimensions.reduce((s, d) => s + (d.selfScore + d.execScore) / 2, 0) / dimensions.length)
    : 0

  kpis.push({
    name: 'Score medio de lideranca',
    current: `${avgScore}%`,
    target: `${Math.min(100, avgScore + 15)}%`,
    timeline: '12 semanas',
  })

  // Critical gaps count
  const criticalCount = dimensions.filter((d) => d.priority === 'critical').length
  kpis.push({
    name: 'Gaps criticos',
    current: `${criticalCount} dimensoes`,
    target: '0 dimensoes',
    timeline: '12 semanas',
  })

  // Perfil evolution
  const perfilTarget = perfil === 'reativo' ? 'Em Transicao' : perfil === 'transicao' ? 'Lider de Valor' : 'Lider de Valor consolidado'
  kpis.push({
    name: 'Evolucao de perfil',
    current: PERFIL_LABELS[perfil] ?? perfil,
    target: perfilTarget,
    timeline: '90 dias',
  })

  // Specific KPIs based on weakest dimensions
  const topWeak = dimensions
    .filter((d) => d.priority === 'critical' || d.priority === 'high')
    .slice(0, 2)

  for (const dim of topWeak) {
    const lowerScore = Math.min(dim.selfScore, dim.execScore)
    kpis.push({
      name: `Dimensao: ${dim.name}`,
      current: `${lowerScore}%`,
      target: `${Math.min(100, lowerScore + 25)}%`,
      timeline: '12 semanas',
    })
  }

  return kpis
}

// ---------------------------------------------------------------------------
// Mentoring focus generation
// ---------------------------------------------------------------------------

function generateMentoringFocus(dimensions: PDIDimension[], blindSpots: string[], hiddenStrengths: string[]) {
  const sorted = [...dimensions].sort((a, b) => b.gap - a.gap)

  const session30days: string[] = []
  const session60days: string[] = []

  // 30 days: focus on biggest gaps + blind spots
  if (sorted.length > 0) {
    session30days.push(`Alinhar percepcao sobre "${sorted[0].name}" (gap de ${sorted[0].gap}pp).`)
  }
  if (blindSpots.length > 0) {
    session30days.push(`Explorar pontos cegos: ${blindSpots.slice(0, 2).join(', ')}.`)
  }
  session30days.push('Validar progresso das acoes da Fase 1 (Comportamento).')
  session30days.push('Ajustar metas e KPIs com base nos primeiros 30 dias.')

  // 60 days: focus on hidden strengths + strategic growth
  if (hiddenStrengths.length > 0) {
    session60days.push(`Potencializar forcas ocultas: ${hiddenStrengths.slice(0, 2).join(', ')}.`)
  }
  if (sorted.length > 1) {
    session60days.push(`Revisar evolucao em "${sorted[1].name}" e "${sorted[0].name}".`)
  }
  session60days.push('Avaliar progresso das Fases 1 e 2. Ajustar plano da Fase 3.')
  session60days.push('Preparar plano de sustentacao pos-treinamento.')

  return { session30days, session60days }
}

// ---------------------------------------------------------------------------
// Development tracks generation (plano de ação por gap → conteúdo LIDERA)
// ---------------------------------------------------------------------------

const MAX_TRACKS = 5
const WEAK_THRESHOLD = 67

/**
 * Constrói as trilhas de desenvolvimento: para cada dimensão fraca, busca a
 * prescrição LIDERA (módulo, ferramentas, apostila, leitura, ações) e resolve
 * os nomes reais das ferramentas e literaturas a partir da base de conhecimento.
 *
 * "Fraco" = menor score entre auto e executiva (modo full) ou só auto (partial).
 * Garante pelo menos 2 trilhas mesmo quando o líder vai bem em tudo.
 */
function generateDevelopmentTracks(
  dimensions: PDIDimension[],
  mode: 'full' | 'partial',
): DevelopmentTrack[] {
  const scored = dimensions
    .filter((d) => DESENVOLVIMENTO_POR_DIMENSAO[d.name])
    .map((d) => ({
      d,
      effective: mode === 'full' ? Math.min(d.selfScore, d.execScore) : d.selfScore,
    }))
    .sort((a, b) => a.effective - b.effective)

  let weak = scored.filter((s) => s.effective < WEAK_THRESHOLD).slice(0, MAX_TRACKS)
  if (weak.length === 0) weak = scored.slice(0, 2) // sempre entrega plano acionável

  return weak.map(({ d }) => {
    const map = DESENVOLVIMENTO_POR_DIMENSAO[d.name]
    const ferramentas = map.ferramentas
      .map((id) => FERRAMENTAS[id])
      .filter(Boolean)
      .map((f) => ({ sigla: f.sigla, nome: f.nome, shortDescription: f.shortDescription }))
    const leitura = map.leitura
      .map((id) => LITERATURAS[id])
      .filter(Boolean)
      .map((l) => ({ titulo: l.titulo, autor: l.autor }))

    return {
      dimensao: d.name,
      priority: d.priority,
      selfScore: d.selfScore,
      execScore: d.execScore,
      gap: d.gap,
      moduloLidera: map.moduloLidera,
      porQueImporta: map.porQueImporta,
      ferramentas,
      apostila: map.apostila,
      leitura,
      acoes: map.acoes,
      externo: map.externo,
      comoMedir: map.comoMedir,
    }
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Determine the PDI status for a given aluno.
 */
export function getPDIStatus(
  alunoId: string,
  hasSelf: boolean,
  hasExec: boolean,
): PDIStatus {
  if (hasSelf && hasExec) return 'ready'
  if (!hasSelf && !hasExec) return 'waiting_both'
  if (!hasSelf) return 'waiting_self'
  return 'waiting_exec'
}

/**
 * Generate a PARTIAL PDI report based only on the self-assessment.
 * Used for lead capture — the supervisor gets an initial diagnostic PDI
 * immediately after filling the autoavaliação (1.4.1).
 * When the executive assessment (1.3.1) is later added, the full PDI replaces this.
 */
export function generatePartialPDI(
  alunoId: string,
  alunoName: string,
  company: string | null,
  selfAssessment: Record<string, unknown>,
): PDIReport {
  const selfData = selfAssessment as SelfFields
  const perfil = (selfData.perfil as string) || 'transicao'
  const total = (selfData.pontuacao_total as number) || 0
  const dorAtual = (selfData.texto_dor_atual as string | null) || null
  const custoFuturo = (selfData.texto_custo_futuro as string | null) || null

  // Build dimensions from self-assessment only
  const selfDimensions = ALL_DIMENSIONS.filter((d) => d.selfKey !== null)
  const dimensions: PDIDimension[] = selfDimensions.map((dim) => {
    const selfRaw = dim.selfKey ? (selfData[dim.selfKey] as number | null | undefined) ?? null : null
    const selfNorm = selfRaw !== null ? normalizeScore(selfRaw, dim.selfMax) : 50

    // Without exec, we estimate gap based on distance from ideal (100)
    const gap = 100 - selfNorm
    const priority = classifyPriority(gap > 60 ? gap - 20 : gap) // adjust threshold for single-source
    const recommendation = getRecommendation(dim.name, gap, selfNorm, selfNorm)

    return {
      name: dim.name,
      selfScore: selfNorm,
      execScore: 0, // no exec data
      gap,
      priority,
      recommendation,
    }
  })

  // Self details
  const selfDetails: Record<string, number> = {}
  for (const dim of ALL_DIMENSIONS) {
    if (dim.selfKey) {
      const raw = selfData[dim.selfKey] as number | null | undefined
      if (raw !== null && raw !== undefined) selfDetails[dim.name] = raw
    }
  }

  // Strengths: score >= 67% (2/3 or 3/3)
  const strengths = dimensions.filter((d) => d.selfScore >= 67).map((d) => d.name)

  // Areas to develop: score < 50%
  const criticalGaps = dimensions.filter((d) => d.selfScore < 50).map((d) => d.name)

  const weakDimensions = [...dimensions].sort((a, b) => a.selfScore - b.selfScore).filter((d) => d.selfScore < 67)

  return {
    alunoId,
    alunoName,
    company,
    generatedAt: new Date().toISOString(),
    mode: 'partial',

    selfAssessment: { total, perfil, details: selfDetails },
    execAssessment: null,

    overallAlignment: 0, // no alignment without exec
    dimensions,

    strengths,
    criticalGaps,
    blindSpots: [],
    hiddenStrengths: [],

    developmentPlan: {
      phase1: generatePhase1(weakDimensions),
      phase2: generatePhase2(weakDimensions),
      phase3: generatePhase3(weakDimensions),
    },

    developmentTracks: generateDevelopmentTracks(dimensions, 'partial'),

    kpisToTrack: generateKPIs(dimensions, perfil),

    mentoringFocus: {
      session30days: [
        ...(dorAtual
          ? [`Endereçar diretamente o desafio relatado: "${dorAtual.length > 120 ? dorAtual.slice(0, 120) + '...' : dorAtual}"`]
          : []),
        'Validar autopercepção com feedback 360 da equipe.',
        'Identificar top 2 áreas de desenvolvimento prioritário.',
        'Alinhar expectativas com gestor direto.',
      ],
      session60days: [
        ...(custoFuturo
          ? [`Avaliar se o custo projetado foi mitigado: "${custoFuturo.length > 120 ? custoFuturo.slice(0, 120) + '...' : custoFuturo}"`]
          : []),
        'Revisar progresso nas áreas identificadas.',
        'Preparar plano de sustentação pós-treinamento.',
        'Definir metas para os próximos 90 dias.',
      ],
    },

    userContext: { dorAtual, custoFuturo },
  }
}

/**
 * Generate a complete PDI report from two assessments.
 */
export function generatePDI(
  alunoId: string,
  alunoName: string,
  company: string | null,
  selfAssessment: Record<string, unknown>,
  execAssessment: Record<string, unknown>,
): PDIReport {
  const selfData = selfAssessment as SelfFields
  const execData = execAssessment as ExecFields

  // Build comparison using existing utility (for alignment calc)
  const comparison = buildComparison(
    selfData as Record<string, unknown>,
    execData as Record<string, unknown>,
  )
  const overallAlignment = calculateAlignment(comparison.paired)

  // Build full dimension list with normalized scores
  const dimensions: PDIDimension[] = ALL_DIMENSIONS.map((dim) => {
    const selfRaw = dim.selfKey ? (selfData[dim.selfKey] as number | null | undefined) ?? null : null
    const execRaw = dim.execKey ? (execData[dim.execKey] as number | null | undefined) ?? null : null

    const selfNorm = selfRaw !== null ? normalizeScore(selfRaw, dim.selfMax) : 50 // default to midpoint if unavailable
    const execNorm = execRaw !== null ? normalizeScore(execRaw, dim.execMax) : 50

    const gap = Math.abs(selfNorm - execNorm)
    const priority = classifyPriority(gap)
    const recommendation = getRecommendation(dim.name, gap, selfNorm, execNorm)

    return {
      name: dim.name,
      selfScore: selfNorm,
      execScore: execNorm,
      gap,
      priority,
      recommendation,
    }
  })

  // Sort by gap descending for analysis
  const sorted = [...dimensions].sort((a, b) => b.gap - a.gap)

  // Identify strengths: both scores >= 65 and gap <= 15
  const strengths = dimensions
    .filter((d) => d.selfScore >= 65 && d.execScore >= 65 && d.gap <= 15)
    .map((d) => d.name)

  // Critical gaps: gap > 40
  const criticalGaps = sorted
    .filter((d) => d.priority === 'critical')
    .map((d) => d.name)

  // Blind spots: self > exec by > 30
  const blindSpots = dimensions
    .filter((d) => d.selfScore - d.execScore > 30)
    .map((d) => d.name)

  // Hidden strengths: exec > self by > 30
  const hiddenStrengths = dimensions
    .filter((d) => d.execScore - d.selfScore > 30)
    .map((d) => d.name)

  // Weak dimensions sorted by gap for plan generation
  const weakDimensions = sorted.filter((d) => d.priority !== 'low')

  // Self assessment details
  const selfDetails: Record<string, number> = {}
  for (const dim of ALL_DIMENSIONS) {
    if (dim.selfKey) {
      const raw = selfData[dim.selfKey] as number | null | undefined
      if (raw !== null && raw !== undefined) {
        selfDetails[dim.name] = raw
      }
    }
  }

  // Exec assessment details
  const execDetails: Record<string, number> = {}
  for (const dim of ALL_DIMENSIONS) {
    if (dim.execKey) {
      const raw = execData[dim.execKey] as number | null | undefined
      if (raw !== null && raw !== undefined) {
        execDetails[dim.name] = raw
      }
    }
  }

  const perfil = (selfData.perfil as string) || 'transicao'

  return {
    alunoId,
    alunoName,
    company,
    generatedAt: new Date().toISOString(),
    mode: 'full',

    selfAssessment: {
      total: (selfData.pontuacao_total as number) || 0,
      perfil,
      details: selfDetails,
    },
    execAssessment: {
      details: execDetails,
      nivelAtual: (execData.nivel_atual as string) || 'Nao informado',
      nivelEsperado: (execData.nivel_esperado as string) || 'Nao informado',
    },

    overallAlignment,
    dimensions,

    strengths,
    criticalGaps,
    blindSpots,
    hiddenStrengths,

    developmentPlan: {
      phase1: generatePhase1(weakDimensions),
      phase2: generatePhase2(weakDimensions),
      phase3: generatePhase3(weakDimensions),
    },

    developmentTracks: generateDevelopmentTracks(dimensions, 'full'),

    kpisToTrack: generateKPIs(dimensions, perfil),

    mentoringFocus: generateMentoringFocus(dimensions, blindSpots, hiddenStrengths),

    userContext: {
      dorAtual: (selfData.texto_dor_atual as string | null) || null,
      custoFuturo: (selfData.texto_custo_futuro as string | null) || null,
    },
  }
}
