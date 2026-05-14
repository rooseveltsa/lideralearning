// Knowledge Base — 6 ferramentas gerenciais oficiais do Programa LIDERA.
// Source of truth: Documento "Alinhamento Estratégico Fernanda Campos.docx"
// Cada ferramenta tem: id, nome, descrição, quando usar, estrutura completa.

export type FerramentaItem = {
  label: string
  detail: string
}

export type Ferramenta = {
  id: string
  sigla: string
  nome: string
  shortDescription: string
  whenToUse: string[]
  estrutura: FerramentaItem[]
  exemploAplicacao: string
}

export const FERRAMENTAS: Record<string, Ferramenta> = {
  '5w2h': {
    id: '5w2h',
    sigla: '5W2H',
    nome: 'Plano de Ação 5W2H',
    shortDescription:
      'Checklist administrativo para garantir que nenhuma ponta fique solta em um projeto.',
    whenToUse: [
      'Implantar novas metas e atividades de forma estruturada',
      'Garantir clareza de escopo, motivo, responsáveis e prazo',
      'Quando há histórico de execução desorganizada ou retrabalho',
    ],
    estrutura: [
      { label: 'What (O quê)', detail: 'Qual a ação ou objetivo específico?' },
      { label: 'Why (Por quê)', detail: 'Qual o motivo / benefício esperado?' },
      { label: 'Who (Quem)', detail: 'Quem é o responsável pela execução?' },
      { label: 'Where (Onde)', detail: 'Em qual local / setor / sistema?' },
      { label: 'When (Quando)', detail: 'Qual o prazo e marcos de checkpoint?' },
      { label: 'How (Como)', detail: 'Qual o método / passo a passo?' },
      { label: 'How Much (Quanto custa)', detail: 'Qual o orçamento ou recurso necessário?' },
    ],
    exemploAplicacao:
      'Antes de iniciar qualquer nova entrega da equipe, preencher o 5W2H em uma reunião de 15 min — evita 70% dos retrabalhos por escopo mal definido.',
  },

  eisenhower: {
    id: 'eisenhower',
    sigla: 'Eisenhower',
    nome: 'Matriz de Eisenhower',
    shortDescription:
      'Ajuda a priorizar tarefas com base na Urgência e Importância.',
    whenToUse: [
      'Sobrecarga operacional (líder fazendo tudo)',
      'Dificuldade em delegar',
      'Tempo gasto em interrupções vs planejamento estratégico',
    ],
    estrutura: [
      { label: 'Importante + Urgente', detail: 'Faça agora (crises e prazos críticos).' },
      {
        label: 'Importante + Não Urgente',
        detail: 'Agende (planejamento, prevenção, desenvolvimento de equipe).',
      },
      {
        label: 'Não Importante + Urgente',
        detail: 'Delegue (interrupções, reuniões operacionais).',
      },
      {
        label: 'Não Importante + Não Urgente',
        detail: 'Elimine (distrações, retrabalho administrativo).',
      },
    ],
    exemploAplicacao:
      'Toda segunda-feira de manhã, classificar a agenda da semana nas 4 categorias. Meta: 60% do tempo em "Importante + Não Urgente" (foco estratégico).',
  },

  '9box': {
    id: '9box',
    sigla: '9Box',
    nome: 'Matriz 9Box de Talentos',
    shortDescription:
      'Ferramenta visual para avaliar capital humano cruzando Desempenho atual × Potencial futuro.',
    whenToUse: [
      'Identificar sucessores e talentos prontos',
      'Mapear quem precisa de treinamento ou recolocação',
      'Decidir investimentos de desenvolvimento por colaborador',
      'Antes de promoções, revisões salariais ou planos de carreira',
    ],
    estrutura: [
      {
        label: 'Eixo Horizontal: Desempenho',
        detail: 'O que a pessoa entrega hoje (baixo / médio / alto).',
      },
      {
        label: 'Eixo Vertical: Potencial',
        detail: 'O quanto ela pode crescer amanhã (baixo / médio / alto).',
      },
      {
        label: '9 quadrantes',
        detail:
          'Combinações vão de "saída programada" (baixo/baixo) até "sucessor imediato" (alto/alto).',
      },
    ],
    exemploAplicacao:
      'Trimestre: aplicar 9Box em toda a equipe. Os 2-3 colaboradores de alto potencial recebem mentoria mensal e responsabilidades crescentes.',
  },

  grow: {
    id: 'grow',
    sigla: 'GROW',
    nome: 'Método GROW de Coaching',
    shortDescription:
      'Modelo de conversa para desenvolver liderados em vez de apenas dar ordens. Ideal para 1:1.',
    whenToUse: [
      'Reuniões 1:1 quinzenais com liderados',
      'Quando equipe não tem autonomia para decidir',
      'Desenvolver protagonismo em vez de criar dependência',
    ],
    estrutura: [
      { label: 'G — Goal (Meta)', detail: 'O que você quer alcançar nesta conversa / período?' },
      {
        label: 'R — Reality (Realidade)',
        detail: 'O que está acontecendo agora? Quais obstáculos reais?',
      },
      { label: 'O — Options (Opções)', detail: 'O que você poderia fazer? Quais alternativas?' },
      { label: 'W — Will (Vontade)', detail: 'O que você vai fazer de fato? Qual o primeiro passo?' },
    ],
    exemploAplicacao:
      'Reunião 1:1 quinzenal de 30 min com cada liderado direto, seguindo a estrutura GROW. Em 3 meses, equipe traz soluções (não problemas).',
  },

  pdca: {
    id: 'pdca',
    sigla: 'PDCA',
    nome: 'Ciclo PDCA de Melhoria Contínua',
    shortDescription:
      'Ciclo de solução de problemas e melhoria contínua de processos. Nunca termina.',
    whenToUse: [
      'Processos com gargalos recorrentes',
      'Quando indicadores não evoluem',
      'Implementar mudanças sustentáveis (não pontuais)',
    ],
    estrutura: [
      {
        label: 'P — Plan (Planejar)',
        detail: 'Identifique o problema, estabeleça metas, defina plano de ação.',
      },
      { label: 'D — Do (Executar)', detail: 'Coloque o plano em prática e colete dados.' },
      {
        label: 'C — Check (Verificar)',
        detail: 'Compare os resultados com o planejado. O que funcionou? O que não?',
      },
      {
        label: 'A — Act (Agir)',
        detail: 'Se deu certo, padronize. Se não, analise causas e recomece o ciclo.',
      },
    ],
    exemploAplicacao:
      'Aplicar PDCA mensal no gargalo operacional mais crítico. Em 6 meses, a metodologia vira cultura — equipe começa a usar sozinha.',
  },

  sbi: {
    id: 'sbi',
    sigla: 'SBI',
    nome: 'Feedback SBI (Situação · Comportamento · Impacto)',
    shortDescription:
      'Método para dar feedbacks estruturados, evitando que a pessoa se sinta atacada pessoalmente.',
    whenToUse: [
      'Corrigir comportamentos de equipe sem gerar resistência',
      'Falta de responsabilidade ou disciplina recorrente',
      'Quando líder evita conflitos por medo de "ser duro"',
      'Reconhecimento estruturado de boas atitudes',
    ],
    estrutura: [
      {
        label: 'S — Situação',
        detail: 'Contextualize o momento exato (ex: "Na reunião de ontem com o cliente...").',
      },
      {
        label: 'B — Behavior (Comportamento)',
        detail: 'Descreva a ação observável, sem julgar (ex: "...você interrompeu três vezes...").',
      },
      {
        label: 'I — Impacto',
        detail: 'Explique o resultado gerado (ex: "...isso passou a impressão de que não estávamos ouvindo").',
      },
    ],
    exemploAplicacao:
      'Aplicar 1 feedback SBI por semana (positivo ou corretivo) com cada liderado. Em 90 dias, a cultura de feedback assertivo se instala naturalmente.',
  },
} as const

export function getFerramenta(id: string): Ferramenta | undefined {
  return FERRAMENTAS[id]
}

export function listAllFerramentas(): Ferramenta[] {
  return Object.values(FERRAMENTAS)
}
