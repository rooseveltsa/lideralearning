// Knowledge Base — Trilha de desenvolvimento por dimensão avaliada.
//
// Liga cada GAP identificado no diagnóstico (autoavaliação x avaliação executiva)
// ao conteúdo real do método LIDERA: módulo do treinamento, ferramentas oficiais,
// seção da apostila, literatura de fundamento, ações concretas, recursos externos
// e como medir a evolução.
//
// As chaves correspondem EXATAMENTE a PDIDimension.name em utils/pdi-generator.ts.
// IDs de ferramentas → FERRAMENTAS (ferramentas.ts); IDs de leitura → LITERATURAS (fundamentos.ts).

export type DevPrescription = {
  /** Nome da dimensão avaliada (igual a PDIDimension.name) */
  dimensao: string
  /** Módulo do treinamento LIDERA que ataca este gap */
  moduloLidera: string
  /** Por que isso importa para um líder — conecta o gap ao resultado de negócio */
  porQueImporta: string
  /** IDs de ferramentas oficiais LIDERA (ver FERRAMENTAS em ferramentas.ts) */
  ferramentas: string[]
  /** Seção da apostila "Supervisor: da Operação à Liderança" */
  apostila: string
  /** IDs de literatura de fundamento (ver LITERATURAS em fundamentos.ts) */
  leitura: string[]
  /** Ações concretas e esmiuçadas — o "como desenvolver" */
  acoes: string[]
  /** Recursos externos sugeridos (cursos, práticas, rituais fora do material LIDERA) */
  externo: string[]
  /** Indicador objetivo de evolução em 90 dias */
  comoMedir: string
}

export const DESENVOLVIMENTO_POR_DIMENSAO: Record<string, DevPrescription> = {
  'Comunicacao e Postura': {
    dimensao: 'Comunicacao e Postura',
    moduloLidera: 'Módulo 2 — Inteligência Comportamental',
    porQueImporta:
      'Comunicação fraca gera ruído, retrabalho e equipes que não sabem o que se espera delas. É o gap que mais corrói confiança e velocidade no chão de fábrica.',
    ferramentas: ['sbi', 'grow'],
    apostila:
      'Ferramenta 02 — Fórmula E.I.A. (Feedback que Funciona) + os 3 Níveis de Escuta Ativa',
    leitura: ['patterson_crucial', 'stone_feedback'],
    acoes: [
      'Estruturar todo feedback difícil na ferramenta SBI (Situação · Comportamento · Impacto) — meta de 1 feedback estruturado por semana com cada liderado direto.',
      'Aplicar os 3 Níveis de Escuta Ativa (apostila) nas reuniões 1:1: ouvir para entender, não para responder.',
      'Antes de conversas tensas, escrever a Situação e o Impacto em 2 linhas para não reagir no impulso.',
    ],
    externo: [
      'Curso de oratória / comunicação assertiva para liderança',
      'Ritual de reunião semanal de 15 min com pauta fixa (alinhamento de prioridades)',
    ],
    comoMedir:
      'Queda em retrabalho/erros por falha de comunicação e nº de feedbacks estruturados dados — checkpoint 30/60/90 dias.',
  },

  'Gestao de Equipes': {
    dimensao: 'Gestao de Equipes',
    moduloLidera: 'Módulo 1 — Função Estratégica',
    porQueImporta:
      'Sem rituais e delegação, o líder vira gargalo: faz tudo, não desenvolve ninguém e a equipe não decide nada sozinha.',
    ferramentas: ['grow', 'eisenhower', '5w2h'],
    apostila: 'Ferramenta 05 — Matriz Competência × Compromisso (mapear e liderar cada perfil)',
    leitura: ['wiseman_multipliers', 'maxwell_5levels'],
    acoes: [
      'Implantar reuniões 1:1 quinzenais de 30 min usando o método GROW (Meta · Realidade · Opções · Vontade) — equipe traz soluções, não problemas.',
      'Mapear a equipe na Matriz Competência × Compromisso e definir uma estratégia de condução por quadrante.',
      'Usar a Matriz de Eisenhower toda segunda para separar o que delegar do que é realmente seu — meta: 60% do tempo em "importante, não urgente".',
    ],
    externo: [
      'Definir e publicar os acordos de equipe (o que se espera de cada papel)',
      'Treino de delegação: escolher 1 responsabilidade por mês para transferir com autonomia',
    ],
    comoMedir:
      'Nº de decisões tomadas pela equipe sem o líder e horas/semana do líder em tarefas operacionais (deve cair).',
  },

  'Desenvolvimento de Pessoas': {
    dimensao: 'Desenvolvimento de Pessoas',
    moduloLidera: 'Módulo 5 — Sucessão e Desenvolvimento',
    porQueImporta:
      'Líder que não forma sucessores trava a própria carreira e deixa a operação refém de si. Desenvolver pessoas é o que separa "executor" de "multiplicador".',
    ferramentas: ['9box', 'grow'],
    apostila: 'Ferramenta 05 — Matriz Competência × Compromisso',
    leitura: ['wiseman_multipliers', 'maxwell_5levels'],
    acoes: [
      'Aplicar a Matriz 9Box na equipe (desempenho × potencial) e identificar 2-3 talentos de alto potencial.',
      'Preparar pelo menos 1 sucessor para uma função crítica nos próximos 90 dias, com plano de delegação progressiva.',
      'Conduzir mentoria mensal com os talentos usando GROW, com responsabilidades crescentes.',
    ],
    externo: [
      'Criar um plano de desenvolvimento individual simples (1 página) para cada liderado direto',
    ],
    comoMedir:
      'Nº de sucessores prontos e % da equipe com plano de desenvolvimento ativo.',
  },

  'Percepcao da Funcao / Resultados': {
    dimensao: 'Percepcao da Funcao / Resultados',
    moduloLidera: 'Módulo 1 — Função Estratégica',
    porQueImporta:
      'Quem não enxerga a própria função além do operacional fica "apagando incêndio" e nunca conecta a rotina com o resultado que a empresa cobra.',
    ferramentas: ['5w2h', 'pdca'],
    apostila: 'Ferramenta 01 — Autoavaliação das 5 Dimensões da Liderança',
    leitura: ['maxwell_5levels', 'goldratt_thegoal'],
    acoes: [
      'Definir KPIs claros por membro da equipe, com metas semanais visíveis.',
      'Usar o 5W2H em toda nova entrega (reunião de 15 min) para eliminar retrabalho por escopo mal definido.',
      'Rodar o ciclo PDCA mensal no gargalo operacional mais crítico.',
    ],
    externo: [
      'Painel simples de acompanhamento de resultados (planilha ou quadro visual) atualizado semanalmente',
    ],
    comoMedir:
      'Evolução dos KPIs operacionais definidos (produtividade, retrabalho, prazo) em 30/60/90 dias.',
  },

  'Etica e Integridade': {
    dimensao: 'Etica e Integridade',
    moduloLidera: 'Módulo 3 — Ética e Responsabilidade',
    porQueImporta:
      'Confiança é multiplicador econômico: equipes que confiam no líder andam mais rápido. Incoerência entre discurso e prática destrói cultura silenciosamente.',
    ferramentas: ['sbi'],
    apostila: 'Ferramenta 03 — As 7 Virtudes do Líder (seu Código de Conduta) + o dilema Ética vs Resultado',
    leitura: ['covey_trust', 'sinek_leaderslast'],
    acoes: [
      'Escrever o próprio Código de Conduta a partir das 7 Virtudes (apostila) e revisar decisões difíceis por ele.',
      'Assumir publicamente 1 erro por mês perante a equipe — modela responsabilidade e segurança psicológica.',
      'Dar reconhecimento estruturado (SBI positivo) quando alguém age com integridade sob pressão.',
    ],
    externo: [
      'Combinar com a equipe os "inegociáveis" do setor e torná-los visíveis',
    ],
    comoMedir:
      'Índice de confiança/clima da equipe (pesquisa simples) e coerência percebida pelo gestor.',
  },

  'Tecnologia e Decisao por Dados': {
    dimensao: 'Tecnologia e Decisao por Dados',
    moduloLidera: 'Módulo 6 — Dados e IA',
    porQueImporta:
      'Decisão no "achismo" custa caro. Ler indicadores e usar IA como alavanca é o que diferencia o supervisor moderno do que ficou no passado.',
    ferramentas: ['pdca', '5w2h'],
    apostila: 'Ferramenta 06 — Prompt Mágico (IA para Supervisores)',
    leitura: ['goldratt_thegoal'],
    acoes: [
      'Escolher 3 indicadores do setor e acompanhá-los semanalmente — começar a decidir com base neles.',
      'Aplicar a fórmula do Prompt Mágico (apostila) para usar IA em relatórios, análises e comunicação.',
      'Usar PDCA com dados para atacar 1 gargalo recorrente e provar o ganho com números.',
    ],
    externo: [
      'Curso introdutório de indicadores/BI ou de IA aplicada à gestão',
    ],
    comoMedir:
      'Nº de decisões tomadas com base em dados (vs intuição) e ganho mensurável no gargalo escolhido.',
  },

  'Lideranca Estrategica': {
    dimensao: 'Lideranca Estrategica',
    moduloLidera: 'Módulo 1 — Função Estratégica + Módulo 8 — Estratégia de Carreira',
    porQueImporta:
      'Sem visão estratégica, o líder fica preso no curto prazo e não é visto como candidato a crescer. Pensamento de longo prazo é pré-requisito para alta gestão.',
    ferramentas: ['eisenhower', 'pdca'],
    apostila: 'Ferramenta 01 — Autoavaliação das 5 Dimensões (visão de função)',
    leitura: ['maxwell_5levels', 'collins_goodtogreat'],
    acoes: [
      'Reservar 1 bloco semanal de planejamento (importante/não urgente na Eisenhower) protegido de interrupções.',
      'Elaborar 1 proposta de melhoria estratégica para apresentar ao gestor no trimestre.',
      'Conectar cada meta operacional da equipe com um objetivo maior da empresa (deixar o "porquê" explícito).',
    ],
    externo: [
      'Participar de fórum/benchmarking externo do setor para ampliar repertório',
    ],
    comoMedir:
      'Proposta estratégica entregue e % do tempo dedicado a planejamento vs operação.',
  },

  Inovacao: {
    dimensao: 'Inovacao',
    moduloLidera: 'Módulo 6 — Dados e IA',
    porQueImporta:
      'Equipe que não experimenta estagna. Inovação incremental e segura é o que mantém a operação competitiva sem caos.',
    ferramentas: ['pdca'],
    apostila: 'Ferramenta 06 — Prompt Mágico (IA para Supervisores)',
    leitura: ['clear_atomichabits', 'goldratt_thegoal'],
    acoes: [
      'Reservar tempo fixo para ideação e rodar 1 projeto-piloto pequeno por mês via PDCA.',
      'Criar um canal simples para a equipe sugerir melhorias e reconhecer as boas ideias.',
      'Testar IA (Prompt Mágico) em 1 processo repetitivo para ganhar tempo.',
    ],
    externo: [
      'Visitar/observar como outro setor ou empresa resolve um problema parecido',
    ],
    comoMedir:
      'Nº de melhorias implementadas e ganho de tempo/qualidade gerado.',
  },

  'Gestao de Crise': {
    dimensao: 'Gestao de Crise',
    moduloLidera: 'Módulo 2 — Inteligência Comportamental (decisão sob pressão)',
    porQueImporta:
      'É na crise que a liderança aparece. Reagir no impulso espalha pânico; ter protocolo e comunicação clara mantém a equipe firme.',
    ferramentas: ['eisenhower', 'pdca', 'sbi'],
    apostila: 'Ferramenta 02 — Escuta Ativa e comunicação sob pressão',
    leitura: ['patterson_crucial'],
    acoes: [
      'Mapear os 3 cenários de crise mais prováveis do setor e escrever um plano de contingência de 1 página para cada.',
      'Em crise, classificar rápido na Eisenhower (o que é agora x o que pode esperar) antes de agir.',
      'Documentar lições aprendidas após cada incidente (mini-PDCA) para não repetir o erro.',
    ],
    externo: [
      'Treino de tomada de decisão sob pressão com cenários simulados',
    ],
    comoMedir:
      'Tempo de resposta a incidentes e nº de planos de contingência prontos.',
  },

  Adaptabilidade: {
    dimensao: 'Adaptabilidade',
    moduloLidera: 'Módulo 4 — Gestão Geracional',
    porQueImporta:
      'Liderar gerações e mudanças diferentes com a mesma régua gera atrito. Adaptar o estilo sem perder o padrão é o que sustenta engajamento.',
    ferramentas: ['grow', 'pdca'],
    apostila: 'Ferramenta 04 — Matriz de Engajamento por Geração (equidade vs igualdade)',
    leitura: ['clear_atomichabits'],
    acoes: [
      'Mapear a equipe por geração (apostila) e ajustar a forma de comunicar e reconhecer para cada perfil.',
      'Adotar a lógica de equidade (cada um recebe o que precisa) no lugar de igualdade cega.',
      'Rodar PDCA em 1 mudança de processo, ajustando conforme a reação da equipe.',
    ],
    externo: [
      'Conversar individualmente para entender o que motiva cada liderado',
    ],
    comoMedir:
      'Engajamento/retenção por perfil e adesão às mudanças implementadas.',
  },

  'Clareza da Dor / Urgencia': {
    dimensao: 'Clareza da Dor / Urgencia',
    moduloLidera: 'Módulo 1 — Função Estratégica',
    porQueImporta:
      'Quem não nomeia a própria dor não prioriza a mudança certa. Transformar incômodo difuso em problema específico é o primeiro passo do plano.',
    ferramentas: ['5w2h'],
    apostila: 'Ferramenta 01 — Autoavaliação das 5 Dimensões',
    leitura: ['clear_atomichabits'],
    acoes: [
      'Transformar a dor relatada em um problema específico e um 5W2H com prazo e responsável.',
      'Alinhar com o gestor as 2 urgências mais críticas para focar esforço.',
      'Definir 1 micro-hábito por semana ligado à dor (sistema, não força de vontade).',
    ],
    externo: [
      'Revisar a prioridade a cada 30 dias e ajustar o plano',
    ],
    comoMedir:
      'Evolução percebida na dor relatada (escala 0-10) ao longo dos 90 dias.',
  },
}

export function getDesenvolvimento(dimensao: string): DevPrescription | undefined {
  return DESENVOLVIMENTO_POR_DIMENSAO[dimensao]
}
