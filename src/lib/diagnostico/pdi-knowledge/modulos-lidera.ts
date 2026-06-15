// Knowledge Base — 8 Módulos do treinamento LIDERA.
//
// É a ponte entre a TAXONOMIA da autoavaliação (20 competências, ids como
// 'comunicacao', 'delegacao'…) e o CONTEÚDO do treinamento (os 8 módulos).
// Sem este mapa, o motor de IA (pdi-pessoal-prompt) sabe recomendar ferramentas
// e literatura, mas não consegue dizer "curse o Módulo X" para um gap específico.
//
// Source of truth dos títulos: MODULOS_PESSOAL em pessoal-data.ts.
// IDs de competências → COMPETENCIA_LABELS em pdi-analyzer.ts.
// IDs de ferramentas → FERRAMENTAS em ferramentas.ts.

export type ModuloLidera = {
  /** Chave estável (m1..m8) */
  id: string
  numero: number
  titulo: string
  /** O que o módulo desenvolve — usado para fundamentar a recomendação */
  foco: string
  /** IDs de competências (autoavaliação) que este módulo ataca */
  competencias: string[]
  /** IDs de ferramentas LIDERA mais usadas no módulo */
  ferramentas: string[]
}

export const MODULOS_LIDERA: Record<string, ModuloLidera> = {
  m1: {
    id: 'm1',
    numero: 1,
    titulo: 'Módulo 1 — Função Estratégica',
    foco: 'Enxergar a função além do operacional: planejar, organizar e conectar a rotina ao resultado que a empresa cobra.',
    competencias: ['lideranca', 'planejamento', 'organizacao'],
    ferramentas: ['5w2h', 'eisenhower', 'pdca'],
  },
  m2: {
    id: 'm2',
    numero: 2,
    titulo: 'Módulo 2 — Inteligência Comportamental',
    foco: 'Comunicar com clareza, ouvir de verdade, dar feedback e manter o equilíbrio emocional sob pressão.',
    competencias: [
      'comunicacao',
      'escuta_ativa',
      'inteligencia_emocional',
      'gestao_pressao',
      'gestao_conflitos',
    ],
    ferramentas: ['sbi', 'grow'],
  },
  m3: {
    id: 'm3',
    numero: 3,
    titulo: 'Módulo 3 — Ética e Responsabilidade',
    foco: 'Construir confiança por coerência entre discurso e prática e por padrões inegociáveis de conduta e segurança.',
    competencias: ['etica_coerencia', 'seguranca_operacional'],
    ferramentas: ['sbi'],
  },
  m4: {
    id: 'm4',
    numero: 4,
    titulo: 'Módulo 4 — Gestão Geracional',
    foco: 'Adaptar o estilo de liderança a diferentes gerações e perfis sem perder o padrão — equidade no lugar de igualdade cega.',
    competencias: ['adaptabilidade', 'trabalho_equipe'],
    ferramentas: ['grow'],
  },
  m5: {
    id: 'm5',
    numero: 5,
    titulo: 'Módulo 5 — Desenvolvimento e Sucessão',
    foco: 'Formar pessoas, delegar com autonomia e preparar sucessores — sair de executor para multiplicador.',
    competencias: ['desenvolvimento_pessoas', 'delegacao'],
    ferramentas: ['9box', 'grow'],
  },
  m6: {
    id: 'm6',
    numero: 6,
    titulo: 'Módulo 6 — Dados e IA',
    foco: 'Decidir com base em indicadores (não em achismo) e usar IA como alavanca de produtividade e análise.',
    competencias: ['gestao_indicadores', 'uso_ia', 'capacidade_analitica', 'tomada_decisao'],
    ferramentas: ['pdca', '5w2h'],
  },
  m7: {
    id: 'm7',
    numero: 7,
    titulo: 'Módulo 7 — Senso de Dono',
    foco: 'Agir como dono da operação: assumir responsabilidade pelo resultado e sustentar a entrega sob adversidade.',
    competencias: ['senso_dono', 'resiliencia'],
    ferramentas: ['pdca', '5w2h'],
  },
  m8: {
    id: 'm8',
    numero: 8,
    titulo: 'Módulo 8 — Estratégia de Carreira',
    foco: 'Construir um plano claro de crescimento profissional e visão de longo prazo para a própria trajetória.',
    competencias: [],
    ferramentas: ['eisenhower', 'pdca'],
  },
}

// Índice reverso competência → módulo (construído uma vez).
const COMPETENCIA_TO_MODULO: Record<string, ModuloLidera> = (() => {
  const map: Record<string, ModuloLidera> = {}
  for (const modulo of Object.values(MODULOS_LIDERA)) {
    for (const comp of modulo.competencias) map[comp] = modulo
  }
  return map
})()

export function getModuloForCompetencia(competenciaId: string): ModuloLidera | undefined {
  return COMPETENCIA_TO_MODULO[competenciaId]
}

/**
 * Dada uma lista de competências (ex: os maiores gaps), retorna os módulos
 * LIDERA que as atacam, sem repetição e preservando a ordem de prioridade.
 */
export function recommendModulosForCompetencias(competenciaIds: string[]): ModuloLidera[] {
  const seen = new Set<string>()
  const result: ModuloLidera[] = []
  for (const comp of competenciaIds) {
    const modulo = COMPETENCIA_TO_MODULO[comp]
    if (modulo && !seen.has(modulo.id)) {
      seen.add(modulo.id)
      result.push(modulo)
    }
  }
  return result
}
