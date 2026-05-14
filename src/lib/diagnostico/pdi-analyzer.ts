// PdiAnalyzer: análise rule-based pura.
// Identifica nível, gargalo principal, DISC dominante, top gaps.
// Usado como fallback E para enriquecer o prompt da LLM.

import {
  classifyLider,
  dominantDisc,
  secondaryDisc,
  type DiscDim,
  type NivelLiderId,
} from './pdi-knowledge'

export type AnalyzerOutput = {
  selfScore: number
  radarAverage: number
  discPrimary: DiscDim
  discSecondary: DiscDim
  nivelAtual: NivelLiderId
  nivelAlvo: NivelLiderId
  topGaps: Array<{ id: string; label: string; value: number }>
  topForcas: Array<{ id: string; label: string; value: number }>
  pilaresRadarBaixos: Array<{ id: string; label: string; value: number }>
  gargaloPrincipal: string
}

const COMPETENCIA_LABELS: Record<string, string> = {
  comunicacao: 'Comunicação',
  escuta_ativa: 'Escuta ativa',
  inteligencia_emocional: 'Inteligência emocional',
  lideranca: 'Liderança',
  planejamento: 'Planejamento',
  organizacao: 'Organização',
  gestao_conflitos: 'Gestão de conflitos',
  tomada_decisao: 'Tomada de decisão',
  delegacao: 'Delegação',
  capacidade_analitica: 'Capacidade analítica',
  gestao_pressao: 'Gestão sob pressão',
  senso_dono: 'Senso de dono',
  desenvolvimento_pessoas: 'Desenvolvimento de pessoas',
  etica_coerencia: 'Ética e coerência',
  seguranca_operacional: 'Segurança operacional',
  adaptabilidade: 'Adaptabilidade',
  gestao_indicadores: 'Gestão de indicadores',
  uso_ia: 'Uso de IA e tecnologia',
  trabalho_equipe: 'Trabalho em equipe',
  resiliencia: 'Resiliência',
}

const PILAR_LABELS: Record<string, string> = {
  emocional: 'Emocional',
  familiar: 'Familiar',
  social: 'Social',
  profissional: 'Profissional',
  financeiro: 'Financeiro',
  saude: 'Saúde',
  intelectual: 'Intelectual',
  espiritual: 'Espiritual',
  lideranca: 'Liderança',
  equilibrio: 'Equilíbrio vida/trabalho',
}

const PROXIMO_NIVEL_PROGRESSAO: Record<NivelLiderId, NivelLiderId> = {
  operacional_tecnico: 'supervisor_executor',
  supervisor_executor: 'lider_facilitador',
  lider_facilitador: 'supervisor_estrategico',
  supervisor_estrategico: 'potencial_alta_gestao',
  potencial_alta_gestao: 'potencial_alta_gestao',
}

export function analyzePessoal(input: {
  selfScore: number
  radarAverage: number
  discScores: Record<string, number>
  autoavaliacao: Record<string, number>
  modulos: Record<string, string>
  radar: Record<string, number>
}): AnalyzerOutput {
  const { selfScore, radarAverage, discScores, autoavaliacao, modulos, radar } = input

  const discPrimary = dominantDisc(discScores)
  const discSecondary = secondaryDisc(discScores, discPrimary)
  const nivelAtual = classifyLider({ selfScore, modulos })
  const nivelAlvo = PROXIMO_NIVEL_PROGRESSAO[nivelAtual]

  const competenciaEntries = Object.entries(autoavaliacao).map(([id, value]) => ({
    id,
    label: COMPETENCIA_LABELS[id] ?? id,
    value,
  }))

  const topGaps = [...competenciaEntries].sort((a, b) => a.value - b.value).slice(0, 5)
  const topForcas = [...competenciaEntries].sort((a, b) => b.value - a.value).slice(0, 5)

  const pilaresRadarBaixos = Object.entries(radar)
    .map(([id, value]) => ({ id, label: PILAR_LABELS[id] ?? id, value }))
    .filter((p) => p.value <= 5)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)

  // Identifica gargalo principal (heurística)
  let gargaloPrincipal = 'desenvolvimento técnico e operacional'
  if (modulos.funcao_estrategica === 'bombeiro')
    gargaloPrincipal = 'sobrecarga operacional e dependência da liderança'
  else if (modulos.desenvolvimento_sucessao === 'nao' || modulos.desenvolvimento_sucessao === 'pouco')
    gargaloPrincipal = 'ausência de sucessão e dependência centralizada'
  else if (
    modulos.inteligencia_comportamental === 'emocional' ||
    modulos.inteligencia_comportamental === 'me_fecho'
  )
    gargaloPrincipal = 'gestão emocional sob pressão'
  else if (modulos.dados_ia === 'nao_uso' || modulos.dados_ia === 'pouco')
    gargaloPrincipal = 'gestão baseada em palpite ao invés de dados'
  else if (modulos.senso_dono === 'raramente' || modulos.senso_dono === 'as_vezes')
    gargaloPrincipal = 'visão tática limitada (falta senso de dono)'
  else if (topGaps[0]?.value <= 2)
    gargaloPrincipal = `competência crítica defasada: ${topGaps[0].label}`

  return {
    selfScore,
    radarAverage,
    discPrimary,
    discSecondary,
    nivelAtual,
    nivelAlvo,
    topGaps,
    topForcas,
    pilaresRadarBaixos,
    gargaloPrincipal,
  }
}
