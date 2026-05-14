// Knowledge Base — 4 perfis DISC com riscos comportamentais e estratégias de desenvolvimento.
// DISC define tendência e estilo natural, não competência. PDI deve compensar excessos.

export type DiscDim = 'D' | 'I' | 'S' | 'C'

export type DiscStrategy = {
  dimensao: DiscDim
  nome: string
  comoSeApresenta: string
  pontosFortes: string[]
  riscos: string[]
  desenvolvimento: string[]
  ferramentasRecomendadas: string[] // ids das ferramentas
}

export const DISC_STRATEGIES: Record<DiscDim, DiscStrategy> = {
  D: {
    dimensao: 'D',
    nome: 'Dominância (D)',
    comoSeApresenta: 'Decisivo, competitivo, focado em metas, executor.',
    pontosFortes: [
      'Toma decisões rápidas sob pressão',
      'Foco em resultado e meta',
      'Não tem medo de confronto',
      'Engaja equipe em desafios ambiciosos',
    ],
    riscos: [
      'Impulsividade na decisão (decide antes de ouvir)',
      'Pode parecer agressivo ou intimidador',
      'Baixa paciência com processos lentos',
      'Foco no resultado em detrimento das pessoas',
    ],
    desenvolvimento: [
      'Desenvolver inteligência emocional e escuta ativa',
      'Pausar antes de reagir a feedbacks difíceis',
      'Investir em desenvolvimento de pessoas (não só performance)',
      'Praticar liderança consultiva, não autoritária',
    ],
    ferramentasRecomendadas: ['sbi', 'grow', 'eisenhower'],
  },

  I: {
    dimensao: 'I',
    nome: 'Influência (I)',
    comoSeApresenta: 'Comunicativo, motivador, persuasivo, sociável.',
    pontosFortes: [
      'Inspira e motiva equipe naturalmente',
      'Constrói relacionamentos fortes',
      'Comunica visão com entusiasmo',
      'Adapta-se bem a mudanças',
    ],
    riscos: [
      'Baixa organização e disciplina',
      'Foca em ser querido, evita conflitos necessários',
      'Dispersão de prioridades',
      'Otimismo excessivo (subestima riscos)',
    ],
    desenvolvimento: [
      'Implementar rotinas de planejamento e organização',
      'Dar feedback corretivo com método estruturado (SBI)',
      'Aprender a dizer "não" a pedidos não-prioritários',
      'Trabalhar disciplina de execução de prazos',
    ],
    ferramentasRecomendadas: ['5w2h', 'eisenhower', 'sbi'],
  },

  S: {
    dimensao: 'S',
    nome: 'Estabilidade (S)',
    comoSeApresenta: 'Paciente, colaborativo, leal, equilibrado.',
    pontosFortes: [
      'Cria ambiente seguro e estável para a equipe',
      'Excelente ouvinte e mediador',
      'Construtor de relacionamentos de longo prazo',
      'Calmo sob pressão',
    ],
    riscos: [
      'Evita confronto e decisões difíceis',
      'Resistência a mudanças',
      'Pode ser visto como passivo ou indeciso',
      'Acumula problemas por adiar conversas duras',
    ],
    desenvolvimento: [
      'Praticar tomada de decisão sob pressão',
      'Dar feedback corretivo sem amenizar (técnica SBI)',
      'Liderar mudanças em vez de apenas se adaptar',
      'Estabelecer prazos firmes e cobrá-los',
    ],
    ferramentasRecomendadas: ['sbi', 'grow', 'pdca'],
  },

  C: {
    dimensao: 'C',
    nome: 'Conformidade (C)',
    comoSeApresenta: 'Analítico, organizado, detalhista, disciplinado.',
    pontosFortes: [
      'Excelência em processos e qualidade',
      'Decisões baseadas em dados',
      'Reduz erros e retrabalho',
      'Constrói sistemas escaláveis',
    ],
    riscos: [
      'Perfeccionismo paralisa execução',
      'Pode parecer crítico ou frio',
      'Demora em delegar (não confia no padrão dos outros)',
      'Foco em controle pode sufocar inovação',
    ],
    desenvolvimento: [
      'Praticar agilidade — "feito é melhor que perfeito"',
      'Delegar sabendo que vai ter variação no padrão',
      'Desenvolver comunicação empática (não só técnica)',
      'Aceitar feedback emocional, não só lógico',
    ],
    ferramentasRecomendadas: ['eisenhower', 'grow', '9box'],
  },
} as const

export function getDiscStrategy(dim: DiscDim): DiscStrategy {
  return DISC_STRATEGIES[dim]
}

/**
 * Identifica o DISC dominante a partir dos scores percentuais.
 * Retorna o de maior score; em empate, prioridade D > I > S > C.
 */
export function dominantDisc(scores: Record<string, number>): DiscDim {
  const order: DiscDim[] = ['D', 'I', 'S', 'C']
  let winner: DiscDim = 'D'
  let max = -1
  for (const dim of order) {
    const v = scores[dim] ?? 0
    if (v > max) {
      max = v
      winner = dim
    }
  }
  return winner
}

/**
 * Retorna o DISC secundário (segundo mais alto). Útil pra perfis mistos.
 */
export function secondaryDisc(scores: Record<string, number>, primary: DiscDim): DiscDim {
  const order: DiscDim[] = ['D', 'I', 'S', 'C']
  let winner: DiscDim = primary === 'D' ? 'I' : 'D'
  let max = -1
  for (const dim of order) {
    if (dim === primary) continue
    const v = scores[dim] ?? 0
    if (v > max) {
      max = v
      winner = dim
    }
  }
  return winner
}
