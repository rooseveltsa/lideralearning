// Knowledge Base — 5 níveis de maturidade do líder no modelo LIDERA.
// Classificação progressiva: Operacional Técnico → Alta Gestão.

export type NivelLiderId =
  | 'operacional_tecnico'
  | 'supervisor_executor'
  | 'lider_facilitador'
  | 'supervisor_estrategico'
  | 'potencial_alta_gestao'

export type NivelLider = {
  id: NivelLiderId
  ordem: number
  nome: string
  descricao: string
  caracteristicas: string[]
  proximoNivel: NivelLiderId | null
  trilhaProgressao: string[]
}

export const NIVEIS_LIDER: Record<NivelLiderId, NivelLider> = {
  operacional_tecnico: {
    id: 'operacional_tecnico',
    ordem: 1,
    nome: 'Operacional Técnico',
    descricao:
      'Domina a parte técnica mas atua majoritariamente na execução. Liderança é incidental, não intencional.',
    caracteristicas: [
      'Resolve tudo sozinho (gargalo recorrente)',
      'Equipe depende dele para decisões básicas',
      'Pouca delegação efetiva',
      'Foco em "apagar incêndios" diários',
      'Sem visão de médio/longo prazo',
    ],
    proximoNivel: 'supervisor_executor',
    trilhaProgressao: [
      'Implementar 5W2H para organizar entregas',
      'Iniciar reuniões 1:1 quinzenais com método GROW',
      'Identificar e treinar 1 backup técnico para liberar capacidade',
    ],
  },

  supervisor_executor: {
    id: 'supervisor_executor',
    ordem: 2,
    nome: 'Supervisor Executor',
    descricao:
      'Já organiza a equipe e cumpre metas, mas ainda atua mais como "gerente de tarefas" do que líder de pessoas.',
    caracteristicas: [
      'Acompanha indicadores e rotinas operacionais',
      'Delegação ainda baseada em "fazer por mim"',
      'Feedback dado de forma genérica ou esporádica',
      'Pouco investimento em formação da equipe',
      'Reage bem mas antecipa pouco',
    ],
    proximoNivel: 'lider_facilitador',
    trilhaProgressao: [
      'Aplicar Matriz de Eisenhower para liberar tempo estratégico',
      'Adotar Feedback SBI estruturado (1 por semana mínimo)',
      'Mapear equipe com 9Box e iniciar plano de desenvolvimento dos top 3',
    ],
  },

  lider_facilitador: {
    id: 'lider_facilitador',
    ordem: 3,
    nome: 'Líder Facilitador (Em Formação)',
    descricao:
      'Já desenvolve a equipe e busca autonomia coletiva. Tem visão de liderança mas ainda lhe falta sistematização e visão estratégica.',
    caracteristicas: [
      'Desenvolve pessoas ativamente',
      'Equipe ganha autonomia progressiva',
      'Feedback estruturado virou rotina',
      'Já pensa em sucessão',
      'Falta consolidar visão de dono e gestão por indicadores',
    ],
    proximoNivel: 'supervisor_estrategico',
    trilhaProgressao: [
      'Implementar dashboard de KPIs diários (gestão por dados)',
      'Aplicar PDCA em pelo menos 1 processo crítico por trimestre',
      'Estabelecer rituais de planejamento estratégico (manhã de segunda)',
    ],
  },

  supervisor_estrategico: {
    id: 'supervisor_estrategico',
    ordem: 4,
    nome: 'Supervisor Estratégico',
    descricao:
      'Atua com visão de negócio, antecipa problemas, lê dados e forma a próxima geração. Já é referência operacional.',
    caracteristicas: [
      'Antecipa problemas via KPIs e leitura de cenário',
      'Tem sucessores em desenvolvimento ativo',
      'Lidera com dados, não com palpite',
      'Equipe roda mesmo sem ele estar presente',
      'Foco em resultado consistente e cultura',
    ],
    proximoNivel: 'potencial_alta_gestao',
    trilhaProgressao: [
      'Desenvolver visão de portfolio (gerir múltiplas áreas/equipes)',
      'Construir narrativa estratégica para o board',
      'Mentoria reversa: ouvir geração mais jovem e adaptar liderança',
    ],
  },

  potencial_alta_gestao: {
    id: 'potencial_alta_gestao',
    ordem: 5,
    nome: 'Potencial para Alta Gestão',
    descricao:
      'Pronto para assumir responsabilidades de coordenação, gerência ou direção. Pensa como dono do negócio.',
    caracteristicas: [
      'Visão sistêmica do negócio',
      'Forma outros líderes (não só executores)',
      'Toma decisões com impacto financeiro consciente',
      'Reputação interna sólida',
      'Maturidade emocional para liderar líderes',
    ],
    proximoNivel: null,
    trilhaProgressao: [
      'Programa de aceleração executiva (mentoria com gestor sênior)',
      'Projetos cross-funcionais que exijam negociação política',
      'Construção de plano de sucessão para sua própria posição',
    ],
  },
} as const

export function getNivelLider(id: NivelLiderId): NivelLider {
  return NIVEIS_LIDER[id]
}

/**
 * Classifica o líder com base no score de autoavaliação + módulos LIDERA.
 * Regra: score 0-100 + análise dos módulos respondidos.
 */
export function classifyLider(input: {
  selfScore: number
  modulos: Record<string, string>
}): NivelLiderId {
  const { selfScore, modulos } = input

  // Sinais fortes que puxam pra cima
  const formadorDeLideres =
    modulos.funcao_estrategica === 'formador' || modulos.desenvolvimento_sucessao === 'sucessores'
  const estrategista = modulos.funcao_estrategica === 'estrategista'
  const equilibrio =
    modulos.inteligencia_comportamental === 'equilibrio' ||
    modulos.inteligencia_comportamental === 'organizacao'
  const senso_dono =
    modulos.senso_dono === 'frequentemente' || modulos.senso_dono === 'constantemente'
  const usa_dados = modulos.dados_ia === 'moderado' || modulos.dados_ia === 'frequente'
  const plano_carreira = modulos.estrategia_carreira === 'sim' || modulos.estrategia_carreira === 'executando'

  // Sinais que puxam pra baixo
  const bombeiro = modulos.funcao_estrategica === 'bombeiro'
  const reage_emocional =
    modulos.inteligencia_comportamental === 'emocional' ||
    modulos.inteligencia_comportamental === 'me_fecho'

  // Pontuação composta
  let nivelScore = selfScore // base 0-100

  if (formadorDeLideres) nivelScore += 15
  if (estrategista) nivelScore += 10
  if (equilibrio) nivelScore += 8
  if (senso_dono) nivelScore += 7
  if (usa_dados) nivelScore += 5
  if (plano_carreira) nivelScore += 5

  if (bombeiro) nivelScore -= 15
  if (reage_emocional) nivelScore -= 10

  // Mapeamento por faixa
  if (nivelScore >= 110) return 'potencial_alta_gestao'
  if (nivelScore >= 85) return 'supervisor_estrategico'
  if (nivelScore >= 60) return 'lider_facilitador'
  if (nivelScore >= 35) return 'supervisor_executor'
  return 'operacional_tecnico'
}
