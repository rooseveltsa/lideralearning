// PdiEmpresaAnalyzer: análise rule-based do diagnóstico empresarial.
// Avalia: classificação do supervisor avaliado, DISC esperado, top desafios críticos.

import {
  classifyLider,
  dominantDisc,
  secondaryDisc,
  type DiscDim,
  type NivelLiderId,
} from './pdi-knowledge'

export type EmpresaAnalyzerOutput = {
  fitScore: number
  discPrimary: DiscDim
  discSecondary: DiscDim
  nivelAtual: NivelLiderId
  nivelAlvo: NivelLiderId
  topCompetenciasEsperadas: Array<{ id: string; label: string; value: number }>
  topDesafiosCriticos: Array<{ id: string; label: string; value: number }>
  topExpectativas: Array<{ id: string; label: string; value: number }>
  gargaloPrincipal: string
}

const COMPETENCIA_LABELS: Record<string, string> = {
  organizacao: 'Organização',
  comunicacao_clara: 'Comunicação clara',
  inteligencia_emocional: 'Inteligência emocional',
  postura_etica: 'Postura ética',
  gestao_conflitos: 'Gestão de conflitos',
  lideranca_exemplo: 'Liderança pelo exemplo',
  disciplina: 'Disciplina',
  planejamento: 'Planejamento',
  tomada_decisao: 'Tomada de decisão',
  foco_resultado: 'Foco em resultado',
  desenvolvimento_pessoas: 'Desenvolvimento de pessoas',
  gestao_indicadores: 'Gestão de indicadores',
  seguranca_operacional: 'Segurança operacional',
  adaptabilidade: 'Adaptabilidade',
  tecnologia_ia: 'Uso de tecnologia e IA',
  capacidade_analitica: 'Capacidade analítica',
  senso_dono: 'Senso de dono',
  capacidade_delegar: 'Capacidade de delegar',
  formacao_sucessores: 'Formação de sucessores',
  resiliencia: 'Resiliência sob pressão',
}

const DESAFIO_LABELS: Record<string, string> = {
  comunicacao: 'Comunicação',
  engajamento: 'Engajamento da equipe',
  turnover: 'Turnover',
  disciplina_operacional: 'Disciplina operacional',
  seguranca: 'Segurança',
  conflitos_internos: 'Conflitos internos',
  delegacao: 'Delegação',
  falta_autonomia: 'Falta de autonomia da equipe',
  retrabalho: 'Retrabalho',
  gestao_emocional: 'Gestão emocional',
  resistencia_mudanca: 'Resistência à mudança',
  gestao_geracoes: 'Gestão de gerações',
  planejamento: 'Planejamento',
  organizacao: 'Organização',
  uso_dados: 'Uso de dados / indicadores',
}

const EXPECTATIVA_LABELS: Record<string, string> = {
  produtividade: 'Melhorar produtividade',
  turnover: 'Reduzir turnover',
  clima: 'Melhorar clima',
  seguranca: 'Melhorar segurança',
  retrabalho: 'Reduzir retrabalho',
  sucessores: 'Desenvolver sucessores',
  comunicacao: 'Melhorar comunicação',
  indicadores: 'Melhorar indicadores',
  lideranca_estrategica: 'Desenvolver liderança estratégica',
  relacionamento: 'Melhorar relacionamento entre setores',
}

const PROXIMO_NIVEL_PROGRESSAO: Record<NivelLiderId, NivelLiderId> = {
  operacional_tecnico: 'supervisor_executor',
  supervisor_executor: 'lider_facilitador',
  lider_facilitador: 'supervisor_estrategico',
  supervisor_estrategico: 'potencial_alta_gestao',
  potencial_alta_gestao: 'potencial_alta_gestao',
}

export function analyzeEmpresa(input: {
  fitScore: number
  discScores: Record<string, number>
  perfilLiderancaEsperado: Record<string, number>
  diagnosticoAtual: Record<string, number>
  modulos: Record<string, string>
  expectativas: Record<string, number>
}): EmpresaAnalyzerOutput {
  const { fitScore, discScores, perfilLiderancaEsperado, diagnosticoAtual, modulos, expectativas } = input

  const discPrimary = dominantDisc(discScores)
  const discSecondary = secondaryDisc(discScores, discPrimary)

  // Classificar nível com base nos módulos (perfil avaliado pelo gestor)
  // Usa fitScore como proxy do "selfScore" do analyzer pessoal
  const nivelAtual = classifyLider({ selfScore: fitScore, modulos })
  const nivelAlvo = PROXIMO_NIVEL_PROGRESSAO[nivelAtual]

  // Top competências esperadas (maior demanda)
  const topCompetenciasEsperadas = Object.entries(perfilLiderancaEsperado)
    .map(([id, value]) => ({ id, label: COMPETENCIA_LABELS[id] ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Top desafios atuais (mais críticos)
  const topDesafiosCriticos = Object.entries(diagnosticoAtual)
    .map(([id, value]) => ({ id, label: DESAFIO_LABELS[id] ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Top expectativas
  const topExpectativas = Object.entries(expectativas)
    .map(([id, value]) => ({ id, label: EXPECTATIVA_LABELS[id] ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Identifica gargalo principal pela combinação de módulos + desafio crítico #1
  let gargaloPrincipal = 'desenvolvimento técnico e operacional'
  if (modulos.funcao_estrategica === 'executor')
    gargaloPrincipal = 'supervisor atua apenas como executor, sem visão estratégica'
  else if (modulos.sucessao_desenvolvimento === 'nao_existe' || modulos.sucessao_desenvolvimento === 'muito_pouco')
    gargaloPrincipal = 'ausência de formação de sucessores (risco de retenção)'
  else if (modulos.inteligencia_comportamental === 'impulsivo')
    gargaloPrincipal = 'reação impulsiva sob pressão (risco de clima e turnover)'
  else if (modulos.dados_ia === 'nao_utiliza' || modulos.dados_ia === 'pouco')
    gargaloPrincipal = 'gestão sem leitura de indicadores'
  else if (topDesafiosCriticos[0]?.value >= 4)
    gargaloPrincipal = `desafio crítico operacional: ${topDesafiosCriticos[0].label}`

  return {
    fitScore,
    discPrimary,
    discSecondary,
    nivelAtual,
    nivelAlvo,
    topCompetenciasEsperadas,
    topDesafiosCriticos,
    topExpectativas,
    gargaloPrincipal,
  }
}
