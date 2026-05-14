// Knowledge Base — 14 literaturas que fundamentam o método LIDERA de PDI.
// Curado com base no briefing do owner (8 pilares teóricos).
// Cada literatura tem aplicação prática mapeada ao LIDERA.

import type { DiscDim } from './disc-strategies'
import type { NivelLiderId } from './niveis-lider'

export type PilarTeorico =
  | 'comportamental'
  | 'lideranca_desenvolvimento'
  | 'feedback_conflitos'
  | 'performance_operacional'
  | 'mudanca_habitos'
  | 'inteligencia_emocional'
  | 'seguranca_psicologica'
  | 'ia_supervisao_moderna'

export type Literatura = {
  id: string
  titulo: string
  autor: string
  ano?: number
  pilar: PilarTeorico
  // Conexão com o sistema LIDERA
  aplicacaoLidera: string
  // Tags pra busca contextual
  ferramentasRelacionadas: string[] // ids de FERRAMENTAS
  modulosLideraRelacionados: string[] // ids de MODULOS_LIDERA / MODULOS_PESSOAL
  discRelacionado: DiscDim[] // pra perfis DISC onde esta literatura ajuda mais
  niveisRelacionados: NivelLiderId[]
  // Texto curto pra citar no PDI
  insightCentral: string
}

export const LITERATURAS: Record<string, Literatura> = {
  // ───── 1. COMPORTAMENTAL / PERFIL ─────
  marston_emotions: {
    id: 'marston_emotions',
    titulo: 'Emotions of Normal People',
    autor: 'William Moulton Marston',
    ano: 1928,
    pilar: 'comportamental',
    aplicacaoLidera:
      'Base teórica original do modelo DISC. Fundamenta a leitura comportamental, tendências sob pressão e adaptação de liderança ao perfil.',
    ferramentasRelacionadas: [],
    modulosLideraRelacionados: ['inteligencia_comportamental'],
    discRelacionado: ['D', 'I', 'S', 'C'],
    niveisRelacionados: [],
    insightCentral:
      'Comportamento sob pressão revela mais sobre o líder do que comportamento em situação confortável.',
  },

  covey_trust: {
    id: 'covey_trust',
    titulo: 'The Speed of Trust',
    autor: 'Stephen M. R. Covey',
    ano: 2006,
    pilar: 'comportamental',
    aplicacaoLidera:
      'Conecta ética, credibilidade e confiança como aceleradores de cultura organizacional. Base do Módulo 3 LIDERA (Ética e Responsabilidade).',
    ferramentasRelacionadas: ['sbi'],
    modulosLideraRelacionados: ['etica_responsabilidade'],
    discRelacionado: ['D', 'C'],
    niveisRelacionados: ['lider_facilitador', 'supervisor_estrategico'],
    insightCentral:
      'Confiança não é soft skill — é multiplicador econômico. Equipes que confiam movem 5x mais rápido.',
  },

  // ───── 2. LIDERANÇA E DESENVOLVIMENTO ─────
  maxwell_5levels: {
    id: 'maxwell_5levels',
    titulo: 'The 5 Levels of Leadership',
    autor: 'John C. Maxwell',
    ano: 2011,
    pilar: 'lideranca_desenvolvimento',
    aplicacaoLidera:
      'Espelha diretamente os 5 níveis de maturidade do LIDERA. Trilha evolutiva de "supervisor técnico" a "líder estratégico que forma outros líderes".',
    ferramentasRelacionadas: ['grow', '9box'],
    modulosLideraRelacionados: ['funcao_estrategica', 'estrategia_carreira'],
    discRelacionado: ['D', 'I', 'S', 'C'],
    niveisRelacionados: [
      'operacional_tecnico',
      'supervisor_executor',
      'lider_facilitador',
      'supervisor_estrategico',
      'potencial_alta_gestao',
    ],
    insightCentral:
      'Liderança não é cargo — é uma escada de 5 níveis. Cada nível exige investimento intencional, não evolução natural.',
  },

  sinek_leaderslast: {
    id: 'sinek_leaderslast',
    titulo: 'Leaders Eat Last',
    autor: 'Simon Sinek',
    ano: 2014,
    pilar: 'lideranca_desenvolvimento',
    aplicacaoLidera:
      'Segurança psicológica, pertencimento e cultura humana. Base para retenção e clima — KPIs operacionais críticos do LIDERA.',
    ferramentasRelacionadas: ['sbi', 'grow'],
    modulosLideraRelacionados: ['etica_responsabilidade', 'inteligencia_comportamental'],
    discRelacionado: ['S', 'I'],
    niveisRelacionados: ['lider_facilitador', 'supervisor_estrategico'],
    insightCentral:
      'Líderes que comem por último constroem times que correm na frente. Pertencimento gera engajamento sustentável.',
  },

  wiseman_multipliers: {
    id: 'wiseman_multipliers',
    titulo: 'Multipliers',
    autor: 'Liz Wiseman',
    ano: 2010,
    pilar: 'lideranca_desenvolvimento',
    aplicacaoLidera:
      'Diferencia líderes que sufocam (Diminishers) de líderes que multiplicam capacidade da equipe. Fundamenta o módulo de sucessão LIDERA.',
    ferramentasRelacionadas: ['9box', 'grow'],
    modulosLideraRelacionados: ['desenvolvimento_sucessao', 'sucessao_desenvolvimento'],
    discRelacionado: ['D', 'C'],
    niveisRelacionados: ['supervisor_estrategico', 'potencial_alta_gestao'],
    insightCentral:
      'Líderes Multipliers extraem 2x mais inteligência das mesmas pessoas. O ponto cego comum é se ver como "facilitador" quando ainda é "diminisher".',
  },

  // ───── 3. FEEDBACK / CONFLITOS ─────
  patterson_crucial: {
    id: 'patterson_crucial',
    titulo: 'Crucial Conversations',
    autor: 'Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler',
    ano: 2002,
    pilar: 'feedback_conflitos',
    aplicacaoLidera:
      'Método para conduzir conversas difíceis sob pressão emocional. Base do Módulo 2 LIDERA (Inteligência Comportamental) e ferramenta SBI.',
    ferramentasRelacionadas: ['sbi', 'grow'],
    modulosLideraRelacionados: ['inteligencia_comportamental'],
    discRelacionado: ['S', 'I'],
    niveisRelacionados: ['supervisor_executor', 'lider_facilitador'],
    insightCentral:
      'Quando o assunto importa, as emoções estão altas e as opiniões divergem — você está numa Crucial Conversation. Treinável.',
  },

  stone_feedback: {
    id: 'stone_feedback',
    titulo: 'Thanks for the Feedback',
    autor: 'Douglas Stone, Sheila Heen',
    ano: 2014,
    pilar: 'feedback_conflitos',
    aplicacaoLidera:
      'Entende por que pessoas resistem a feedback e como criar maturidade emocional para recebê-lo. Fundamental para mentorias 1:1 LIDERA.',
    ferramentasRelacionadas: ['sbi', 'grow'],
    modulosLideraRelacionados: ['inteligencia_comportamental'],
    discRelacionado: ['D', 'I'],
    niveisRelacionados: ['operacional_tecnico', 'supervisor_executor'],
    insightCentral:
      'A habilidade de receber feedback é mais rara — e mais valiosa — do que a habilidade de darlo.',
  },

  // ───── 4. PERFORMANCE OPERACIONAL ─────
  goldratt_thegoal: {
    id: 'goldratt_thegoal',
    titulo: 'The Goal',
    autor: 'Eliyahu M. Goldratt',
    ano: 1984,
    pilar: 'performance_operacional',
    aplicacaoLidera:
      'Conecta liderança, gargalos, produtividade e fluxo. Leitura obrigatória para supervisores que querem ler indicadores e tomar decisão operacional.',
    ferramentasRelacionadas: ['pdca', '5w2h'],
    modulosLideraRelacionados: ['dados_ia', 'funcao_estrategica'],
    discRelacionado: ['C', 'D'],
    niveisRelacionados: ['lider_facilitador', 'supervisor_estrategico'],
    insightCentral:
      'A meta de qualquer operação é ganhar dinheiro. Tudo que não está conectado a isso é desperdício. Identifique o gargalo — ele dita o ritmo de tudo.',
  },

  collins_goodtogreat: {
    id: 'collins_goodtogreat',
    titulo: 'Good to Great',
    autor: 'Jim Collins',
    ano: 2001,
    pilar: 'performance_operacional',
    aplicacaoLidera:
      'Liderança nível 5, disciplina e cultura de excelência. Conecta diretamente ao "Senso de Dono" do LIDERA.',
    ferramentasRelacionadas: ['9box', 'pdca'],
    modulosLideraRelacionados: ['senso_dono', 'padroes_senso_dono', 'estrategia_carreira'],
    discRelacionado: ['C', 'D'],
    niveisRelacionados: ['supervisor_estrategico', 'potencial_alta_gestao'],
    insightCentral:
      'A diferença entre bom e excelente não é estratégia — é disciplina nas pessoas certas, no ônibus certo, nos lugares certos.',
  },

  // ───── 5. MUDANÇA DE HÁBITOS ─────
  clear_atomichabits: {
    id: 'clear_atomichabits',
    titulo: 'Atomic Habits',
    autor: 'James Clear',
    ano: 2018,
    pilar: 'mudanca_habitos',
    aplicacaoLidera:
      'Transforma PDI em execução prática. Sistema de mudança comportamental por micro-ações. Base dos planos 30/60/90 dias do LIDERA.',
    ferramentasRelacionadas: ['5w2h', 'eisenhower', 'pdca'],
    modulosLideraRelacionados: ['funcao_estrategica'],
    discRelacionado: ['I', 'S'],
    niveisRelacionados: [
      'operacional_tecnico',
      'supervisor_executor',
      'lider_facilitador',
    ],
    insightCentral:
      'Mudança não vem de motivação — vem de sistemas. 1% melhor por dia = 37x melhor em um ano. Foque no processo, não na meta.',
  },

  dweck_mindset: {
    id: 'dweck_mindset',
    titulo: 'Mindset',
    autor: 'Carol S. Dweck',
    ano: 2006,
    pilar: 'mudanca_habitos',
    aplicacaoLidera:
      'Diferencia mindset fixo (defensivo) de mindset de crescimento (evolutivo). Fundamental para acompanhamento de mentoria LIDERA.',
    ferramentasRelacionadas: ['grow'],
    modulosLideraRelacionados: ['estrategia_carreira'],
    discRelacionado: ['D', 'C'],
    niveisRelacionados: ['operacional_tecnico', 'supervisor_executor', 'lider_facilitador'],
    insightCentral:
      'Mindset fixo: "Não sou bom nisso". Mindset de crescimento: "Ainda não sou bom nisso". Diferença de 1 palavra muda toda a carreira.',
  },

  // ───── 6. INTELIGÊNCIA EMOCIONAL ─────
  goleman_emotional: {
    id: 'goleman_emotional',
    titulo: 'Emotional Intelligence',
    autor: 'Daniel Goleman',
    ano: 1995,
    pilar: 'inteligencia_emocional',
    aplicacaoLidera:
      'Base obrigatória do Módulo 2 LIDERA. Autoconsciência, autocontrole, empatia e gestão de relacionamentos sob pressão.',
    ferramentasRelacionadas: ['sbi', 'grow'],
    modulosLideraRelacionados: ['inteligencia_comportamental'],
    discRelacionado: ['D', 'I'],
    niveisRelacionados: ['operacional_tecnico', 'supervisor_executor', 'lider_facilitador'],
    insightCentral:
      'QI te coloca na cadeira. EQ te mantém nela. Líderes operacionais perdem cargo por comportamento, não por competência técnica.',
  },

  // ───── 7. SEGURANÇA PSICOLÓGICA ─────
  edmondson_fearless: {
    id: 'edmondson_fearless',
    titulo: 'The Fearless Organization',
    autor: 'Amy C. Edmondson',
    ano: 2018,
    pilar: 'seguranca_psicologica',
    aplicacaoLidera:
      'Segurança psicológica como precondição para aprendizado, inovação e retenção. Conecta retenção de talento ao comportamento do líder direto.',
    ferramentasRelacionadas: ['sbi', 'grow'],
    modulosLideraRelacionados: ['etica_responsabilidade', 'inteligencia_comportamental'],
    discRelacionado: ['D', 'C'],
    niveisRelacionados: ['lider_facilitador', 'supervisor_estrategico'],
    insightCentral:
      'Pessoas não pedem demissão de empresas. Pedem demissão de líderes. Segurança psicológica é o maior preditor de equipes de alta performance.',
  },

  // ───── 8. IA / SUPERVISÃO MODERNA ─────
  iansiti_ai: {
    id: 'iansiti_ai',
    titulo: 'Competing in the Age of AI',
    autor: 'Marco Iansiti, Karim R. Lakhani',
    ano: 2020,
    pilar: 'ia_supervisao_moderna',
    aplicacaoLidera:
      'Como liderança operacional precisa evoluir num mundo onde dados e IA decidem. Base do Módulo 6 LIDERA (Dados e IA).',
    ferramentasRelacionadas: ['pdca'],
    modulosLideraRelacionados: ['dados_ia'],
    discRelacionado: ['C'],
    niveisRelacionados: ['supervisor_estrategico', 'potencial_alta_gestao'],
    insightCentral:
      'Empresas digitais não competem com produtos — competem com arquitetura de decisão baseada em dados. Supervisor que não lê indicador vai virar custo.',
  },
} as const

export function getLiteratura(id: string): Literatura | undefined {
  return LITERATURAS[id]
}

export function listAllLiteraturas(): Literatura[] {
  return Object.values(LITERATURAS)
}

/**
 * Seleciona 3-5 literaturas mais relevantes para um contexto específico.
 * Pontua cada livro pela aderência ao perfil/ferramentas/módulos/nível.
 */
export function selectRelevantLiteraturas(input: {
  discPrimary: string
  ferramentaIds: string[]
  moduloIds: string[]
  nivelAtual: string
  nivelAlvo: string
  limit?: number
}): Literatura[] {
  const { discPrimary, ferramentaIds, moduloIds, nivelAtual, nivelAlvo, limit = 4 } = input

  const ferramentaSet = new Set(ferramentaIds)
  const moduloSet = new Set(moduloIds)

  const scored = Object.values(LITERATURAS).map((lit) => {
    let score = 0

    // Bonus por ferramentas em comum
    for (const id of lit.ferramentasRelacionadas) {
      if (ferramentaSet.has(id)) score += 3
    }
    // Bonus por módulos em comum
    for (const id of lit.modulosLideraRelacionados) {
      if (moduloSet.has(id)) score += 3
    }
    // Bonus por DISC dominante
    if (lit.discRelacionado.includes(discPrimary as DiscDim)) score += 2
    // Bonus por nível atual / alvo
    if (lit.niveisRelacionados.includes(nivelAtual as NivelLiderId)) score += 2
    if (lit.niveisRelacionados.includes(nivelAlvo as NivelLiderId)) score += 1
    // Bonus base por relevância (todas literaturas têm valor mínimo)
    score += 1

    return { lit, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.lit)
}
