// Knowledge Base — Trilha de POTENCIALIZAÇÃO por dimensão forte.
//
// Contraparte de DESENVOLVIMENTO_POR_DIMENSAO. Enquanto aquele ataca o gap
// ("fraco em comunicação → cursar o módulo de comunicação"), este alavanca a
// força ("forte em gestão → ferramentas avançadas + virar multiplicador do time").
//
// Tese LIDERA: a força reconhecida não é só elogio — é capital. O líder forte
// numa dimensão deve (1) ganhar ferramentas mais avançadas para ir além do básico
// e (2) assumir um papel de multiplicador, transformando a competência individual
// em padrão da equipe.
//
// As chaves correspondem EXATAMENTE a PDIDimension.name em utils/pdi-generator.ts
// (mesmas chaves de DESENVOLVIMENTO_POR_DIMENSAO).
// IDs de ferramentas → FERRAMENTAS (ferramentas.ts).

export type ForcaPrescription = {
  /** Nome da dimensão avaliada (igual a PDIDimension.name) */
  dimensao: string
  /** Por que vale a pena alavancar esta força — conecta ao resultado de negócio */
  comoAlavancar: string
  /** IDs de ferramentas oficiais LIDERA para ir ALÉM do básico (ver FERRAMENTAS) */
  ferramentasAvancadas: string[]
  /** Como transformar a força individual em padrão da equipe (papel de multiplicador) */
  papelMultiplicador: string
  /** Ações concretas para extrair mais valor da força */
  acoes: string[]
  /** Indicador objetivo de que a força virou alavanca em 90 dias */
  comoMedir: string
}

export const POTENCIALIZACAO_POR_FORCA: Record<string, ForcaPrescription> = {
  'Comunicacao e Postura': {
    dimensao: 'Comunicacao e Postura',
    comoAlavancar:
      'Comunicação clara é o ativo que mais acelera uma equipe. Quem já comunica bem deve subir o nível: dar feedback que desenvolve (não só corrige) e virar referência de clareza no setor.',
    ferramentasAvancadas: ['sbi', 'grow'],
    papelMultiplicador:
      'Conduzir uma roda mensal de feedback com pares para ensinar a Fórmula E.I.A. / SBI — o time inteiro passa a comunicar no mesmo padrão.',
    acoes: [
      'Usar o SBI também para reconhecimento (não só correção): 1 feedback positivo estruturado por semana eleva engajamento sem custo.',
      'Adotar o GROW em conversas de desenvolvimento, não só de problema — transformar bons comunicadores da equipe em multiplicadores.',
      'Padronizar a abertura de reuniões (pauta + objetivo em 2 minutos) e ensinar o ritual a outro líder.',
    ],
    comoMedir:
      'Nº de liderados que passam a dar feedback estruturado sozinhos e queda de ruído/retrabalho por desalinhamento.',
  },

  'Gestao de Equipes': {
    dimensao: 'Gestao de Equipes',
    comoAlavancar:
      'Quem já gere bem a equipe é candidato natural a escalar: deixar de gerir tarefas e passar a gerir sistemas e outros líderes. A força vira alavanca quando você delega a própria forma de gerir.',
    ferramentasAvancadas: ['9box', 'eisenhower', 'grow'],
    papelMultiplicador:
      'Formar um segundo líder na equipe replicando seus rituais (1:1, delegação, Eisenhower) — testar a operação rodando 2 dias sem sua intervenção direta.',
    acoes: [
      'Aplicar a Matriz 9Box e investir deliberadamente nos 2-3 de alto potencial, delegando responsabilidades crescentes.',
      'Migrar de "delegar tarefas" para "delegar decisões": definir alçadas claras do que o time decide sem você.',
      'Documentar seus rituais de gestão num playbook de 1 página e passar para outro supervisor.',
    ],
    comoMedir:
      'Nº de decisões tomadas pela equipe sem o líder e existência de pelo menos 1 sucessor pronto para a função.',
  },

  'Desenvolvimento de Pessoas': {
    dimensao: 'Desenvolvimento de Pessoas',
    comoAlavancar:
      'Desenvolver pessoas é o que separa o executor do multiplicador — e é a competência mais valorizada para promoção à alta gestão. Quem já faz isso bem deve formalizar e escalar.',
    ferramentasAvancadas: ['9box', 'grow'],
    papelMultiplicador:
      'Virar mentor de referência: assumir o desenvolvimento de talentos de outras áreas e ensinar outros líderes a conduzir PDIs.',
    acoes: [
      'Criar um plano de desenvolvimento simples (1 página) para cada liderado direto e revisá-lo trimestralmente.',
      'Preparar formalmente 1 sucessor para função crítica nos próximos 90 dias, com delegação progressiva.',
      'Conduzir mentoria mensal via GROW e abrir o método para um colega líder acompanhar e replicar.',
    ],
    comoMedir:
      'Nº de sucessores prontos e % da equipe com plano de desenvolvimento ativo.',
  },

  'Percepcao da Funcao / Resultados': {
    dimensao: 'Percepcao da Funcao / Resultados',
    comoAlavancar:
      'Quem já enxerga a função além do operacional e entrega resultado deve transformar essa clareza em método replicável — conectar cada rotina a um KPI e ensinar a equipe a fazer o mesmo.',
    ferramentasAvancadas: ['pdca', '5w2h'],
    papelMultiplicador:
      'Tornar visível o painel de resultados da equipe e usá-lo para alinhar prioridades com o gestor e com pares — virar referência de gestão orientada a resultado.',
    acoes: [
      'Definir KPIs por membro da equipe e revisar semanalmente, deixando o "porquê" de cada meta explícito.',
      'Rodar PDCA no gargalo mais crítico e provar o ganho com números para apresentar ao gestor.',
      'Padronizar o uso de 5W2H em novas entregas e ensinar o ritual a outro líder.',
    ],
    comoMedir:
      'Evolução positiva e mensurável do indicador operacional escolhido em 30/60/90 dias.',
  },

  'Etica e Integridade': {
    dimensao: 'Etica e Integridade',
    comoAlavancar:
      'Integridade é multiplicador econômico: equipes que confiam no líder andam mais rápido. Quem já é coerente deve tornar essa confiança um ativo explícito da cultura, não algo implícito.',
    ferramentasAvancadas: ['sbi'],
    papelMultiplicador:
      'Modelar segurança psicológica: assumir publicamente os próprios erros e reconhecer (SBI positivo) quem age com integridade sob pressão — virar guardião dos inegociáveis do setor.',
    acoes: [
      'Formalizar o próprio Código de Conduta (7 Virtudes) e usá-lo para arbitrar decisões difíceis de forma transparente.',
      'Combinar com a equipe os "inegociáveis" do setor e torná-los visíveis.',
      'Dar reconhecimento estruturado quando alguém escolhe ética sobre atalho — reforça a cultura.',
    ],
    comoMedir:
      'Índice de confiança/clima da equipe (pesquisa simples) e coerência percebida pelo gestor.',
  },

  'Tecnologia e Decisao por Dados': {
    dimensao: 'Tecnologia e Decisao por Dados',
    comoAlavancar:
      'Decidir por dados (e usar IA como alavanca) é o que diferencia o supervisor moderno. Quem já faz isso deve elevar a régua do setor e ensinar a equipe a abandonar o "achismo".',
    ferramentasAvancadas: ['pdca', '5w2h'],
    papelMultiplicador:
      'Implantar cultura data-driven: criar um painel de 3-5 KPIs que a equipe lê sozinha e ensinar o Prompt Mágico (IA) a outros líderes.',
    acoes: [
      'Subir o nível dos indicadores acompanhados — sair de operacional para indicadores que antecipam problema.',
      'Aplicar IA (Prompt Mágico) em relatórios e análises e abrir o método para a equipe replicar.',
      'Usar PDCA com dados em 1 gargalo recorrente e transformar o ganho em case interno.',
    ],
    comoMedir:
      'Nº de decisões da equipe tomadas com base em dados (vs intuição) e ganho mensurável no gargalo escolhido.',
  },

  'Lideranca Estrategica': {
    dimensao: 'Lideranca Estrategica',
    comoAlavancar:
      'Visão estratégica é pré-requisito para alta gestão. Quem já pensa no longo prazo deve tornar isso visível para quem decide promoções — e conectar a operação à estratégia da empresa.',
    ferramentasAvancadas: ['eisenhower', 'pdca'],
    papelMultiplicador:
      'Apresentar propostas estratégicas ao gestor com regularidade e ajudar pares a conectar suas metas operacionais ao objetivo maior da empresa.',
    acoes: [
      'Proteger 1 bloco semanal de planejamento (importante/não urgente) e usá-lo para pensar 1 trimestre à frente.',
      'Elaborar e apresentar 1 proposta de melhoria estratégica ao gestor por trimestre.',
      'Conectar publicamente cada meta da equipe a um objetivo maior — deixar o "porquê" explícito.',
    ],
    comoMedir:
      'Proposta estratégica entregue e aceita, e % do tempo dedicado a planejamento vs operação.',
  },

  Inovacao: {
    dimensao: 'Inovacao',
    comoAlavancar:
      'Quem já experimenta e melhora processos deve institucionalizar a inovação na equipe — sair de iniciativas pontuais para um ritmo previsível de melhoria, sem caos.',
    ferramentasAvancadas: ['pdca'],
    papelMultiplicador:
      'Criar e curar um canal de sugestões da equipe, reconhecer boas ideias e rodar pilotos via PDCA — virar referência de melhoria contínua para outras áreas.',
    acoes: [
      'Reservar tempo fixo para ideação e rodar 1 projeto-piloto pequeno por mês via PDCA.',
      'Testar IA em 1 processo repetitivo e compartilhar o ganho de tempo com outros líderes.',
      'Observar como outro setor/empresa resolve um problema parecido e adaptar.',
    ],
    comoMedir:
      'Nº de melhorias implementadas e ganho de tempo/qualidade gerado e sustentado.',
  },

  'Gestao de Crise': {
    dimensao: 'Gestao de Crise',
    comoAlavancar:
      'É na crise que a liderança aparece. Quem mantém a equipe firme sob pressão deve transformar a calma individual em protocolo de equipe — para não depender só da sua presença.',
    ferramentasAvancadas: ['eisenhower', 'pdca', 'sbi'],
    papelMultiplicador:
      'Documentar planos de contingência e treinar a equipe para decidir sob pressão sem você — virar referência de gestão de crise no setor.',
    acoes: [
      'Mapear os 3 cenários de crise mais prováveis e escrever um plano de contingência de 1 página para cada.',
      'Após cada incidente, rodar mini-PDCA de lições aprendidas com a equipe (não só com você).',
      'Treinar 1 liderado para conduzir a triagem (Eisenhower) na sua ausência.',
    ],
    comoMedir:
      'Tempo de resposta a incidentes e nº de crises conduzidas pela equipe sem o líder.',
  },

  Adaptabilidade: {
    dimensao: 'Adaptabilidade',
    comoAlavancar:
      'Liderar gerações e mudanças diferentes com flexibilidade sustenta engajamento. Quem já adapta o estilo sem perder o padrão deve ensinar a equipe a fazer o mesmo e conduzir mudanças maiores.',
    ferramentasAvancadas: ['grow', 'pdca'],
    papelMultiplicador:
      'Conduzir mudanças de processo de forma participativa e ajudar outros líderes a aplicar a lógica de equidade (cada um recebe o que precisa) com suas equipes.',
    acoes: [
      'Mapear a equipe por geração/perfil e ajustar comunicação e reconhecimento para cada um.',
      'Rodar PDCA em 1 mudança de processo, ajustando conforme a reação da equipe.',
      'Tornar-se ponto de apoio para outro líder numa mudança difícil.',
    ],
    comoMedir:
      'Engajamento/retenção por perfil e adesão às mudanças que você conduziu.',
  },

  'Clareza da Dor / Urgencia': {
    dimensao: 'Clareza da Dor / Urgencia',
    comoAlavancar:
      'Quem nomeia a própria dor com clareza prioriza certo. Essa lucidez deve virar vantagem estratégica: direcionar o esforço (e o investimento em desenvolvimento) para o que mais move o resultado.',
    ferramentasAvancadas: ['5w2h', 'eisenhower'],
    papelMultiplicador:
      'Ajudar a equipe a transformar incômodos difusos em problemas específicos e priorizados — ensinar o time a separar o urgente do importante.',
    acoes: [
      'Transformar cada dor relatada em um 5W2H com prazo e responsável.',
      'Alinhar com o gestor as 2 urgências mais críticas e proteger o foco nelas.',
      'Revisar prioridades a cada 30 dias com a equipe, ajustando o plano.',
    ],
    comoMedir:
      'Evolução percebida na dor priorizada (escala 0-10) e foco mantido nas urgências certas.',
  },
}

export function getPotencializacao(dimensao: string): ForcaPrescription | undefined {
  return POTENCIALIZACAO_POR_FORCA[dimensao]
}
