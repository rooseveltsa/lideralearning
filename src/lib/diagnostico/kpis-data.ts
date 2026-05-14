// Dados estáticos do step "KPIs Operacionais".
// Versão empresa: gestor preenche números reais (opcionais).
// Versão pessoal: percepção do líder (escala 1-5 - quão crítico).

export type KpiField = {
  id: string
  label: string
  unit: string
  placeholder: string
  hint?: string
}

export const KPIS_EMPRESA: KpiField[] = [
  {
    id: 'turnover',
    label: 'Turnover anual',
    unit: '% / ano',
    placeholder: 'Ex: 28',
    hint: 'Percentual de saídas de colaboradores liderados por ele no último ano',
  },
  {
    id: 'absenteismo',
    label: 'Absenteísmo médio',
    unit: '% / mês',
    placeholder: 'Ex: 6',
    hint: 'Faltas e atrasos sobre total de jornada esperada',
  },
  {
    id: 'retrabalho',
    label: 'Retrabalho',
    unit: '% das entregas',
    placeholder: 'Ex: 12',
    hint: 'Percentual de trabalhos que precisaram ser refeitos',
  },
  {
    id: 'horas_extras',
    label: 'Horas extras médias',
    unit: 'h / mês / pessoa',
    placeholder: 'Ex: 25',
    hint: 'Horas extras médias por liderado por mês',
  },
  {
    id: 'acidentes',
    label: 'Acidentes (últimos 12 meses)',
    unit: 'qtd',
    placeholder: 'Ex: 2',
    hint: 'Total de acidentes na operação dele no último ano',
  },
  {
    id: 'cumprimento_metas',
    label: 'Cumprimento de metas',
    unit: '%',
    placeholder: 'Ex: 78',
    hint: 'Percentual médio de metas operacionais atingidas',
  },
  {
    id: 'reclamacoes',
    label: 'Reclamações de clientes/internos',
    unit: 'qtd / mês',
    placeholder: 'Ex: 3',
    hint: 'Volume mensal médio de reclamações sobre a área dele',
  },
  {
    id: 'clima',
    label: 'Clima da equipe (se medido)',
    unit: '0-10',
    placeholder: 'Ex: 7',
    hint: 'Última nota de pesquisa de clima (deixe vazio se não medir)',
  },
]

export type KpiPercebidoField = {
  id: string
  label: string
  description: string
}

export const KPIS_PESSOAL_PERCEBIDOS: KpiPercebidoField[] = [
  {
    id: 'turnover',
    label: 'Turnover na minha equipe',
    description: 'Quão crítica é a rotatividade hoje?',
  },
  {
    id: 'engajamento',
    label: 'Engajamento da equipe',
    description: 'Pessoas estão presentes e motivadas?',
  },
  {
    id: 'produtividade',
    label: 'Produtividade do time',
    description: 'Estamos entregando o que precisa, sem heroísmo?',
  },
  {
    id: 'retrabalho',
    label: 'Retrabalho operacional',
    description: 'Frequência com que tarefas precisam ser refeitas',
  },
  {
    id: 'pressao_chefia',
    label: 'Pressão vinda da chefia',
    description: 'Cobrança sobre você como líder direto',
  },
  {
    id: 'horas_extras',
    label: 'Horas extras / sobrecarga',
    description: 'Você e equipe trabalham além do esperado?',
  },
  {
    id: 'clima',
    label: 'Clima emocional do time',
    description: 'Como está a saúde psicológica do grupo?',
  },
  {
    id: 'cumprimento_metas',
    label: 'Cumprimento de metas',
    description: 'Atingindo metas com consistência?',
  },
]
