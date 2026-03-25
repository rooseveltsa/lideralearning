'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Cpu,
  FileText,
  Lightbulb,
  MessageSquare,
  Mic,
  Pencil,
  Presentation,
  Rocket,
  Save,
  Shield,
  StickyNote,
  Target,
  Trophy,
  Users,
  Wrench,
  FolderOpen,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type ModuleData = {
  id: number
  title: string
  shortTitle: string
  day: number
  period: string
  icon: typeof Target
  color: string
  resumo: string
  objetivos: string[]
  conteudo: { title: string; text: string }[]
  ferramentas: { name: string; description: string; duration?: string }[]
  roteiro: { opening: string; transitions: string; closing: string; timing: string }
  exercicios: { name: string; objective: string; instructions: string; duration: string }[]
  slidesChave: string[]
}

type MaterialItem = {
  code: string
  name: string
  category: string
  description: string
  status: 'completo' | 'em_revisao' | 'rascunho' | 'pendente'
}

// ─── Module Data ────────────────────────────────────────────────────────────

const MODULES: ModuleData[] = [
  {
    id: 1,
    title: 'A Funcao Estrategica do Supervisor',
    shortTitle: 'Funcao Estrategica',
    day: 1,
    period: 'Manha',
    icon: Target,
    color: '#1565C0',
    resumo:
      'O supervisor e o "Elo" entre a diretoria e o chao de fabrica. A ruptura desse elo gera ruido de comunicacao e ineficiencia. 65% dos supervisores sao promovidos exclusivamente por desempenho tecnico, mas apenas 30% possuem formacao especifica em lideranca.\n\nO modulo estabelece as 5 Dimensoes da Lideranca como framework de evolucao. O supervisor precisa entender que seu papel vai muito alem da execucao tecnica — ele e o tradutor da visao corporativa para a realidade operacional.',
    objetivos: [
      'Compreender o papel estrategico do supervisor como tradutor da visao corporativa',
      'Identificar as 5 Dimensoes da Lideranca e autoavaliar-se',
      'Reconhecer a diferenca entre lider operacional ("Homer") e lider estrategico',
      'Mapear o ciclo de sucessao e promocao sustentavel',
    ],
    conteudo: [
      {
        title: 'O Supervisor como Elo Estrategico',
        text: 'Conecta a visao da diretoria com a execucao operacional. Quando esse elo se rompe, surgem ruidos de comunicacao e ineficiencias. O supervisor e o unico profissional que transita entre os dois mundos — ele precisa dominar tanto a linguagem estrategica quanto a operacional.\n\nSem esse elo forte, a diretoria perde o pulso da operacao e a equipe perde o sentido do trabalho. O resultado: retrabalho, desmotivacao e perda de produtividade.',
      },
      {
        title: 'As 5 Dimensoes da Lideranca',
        text: 'Facilitador — remove obstaculos, cria ambiente produtivo. Se negligenciado: burocracia e desmotivacao.\n\nOrientador — desenvolve competencias da equipe. Se negligenciado: dependencia do lider para tudo.\n\nGarantidor — assegura qualidade, seguranca e etica. Se negligenciado: retrabalho e acidentes.\n\nEstrategista — traduz metas em planos de acao. Se negligenciado: reatividade constante.\n\nMentor — prepara sucessores e desenvolve futuros lideres. Se negligenciado: vacuo de lideranca.',
      },
      {
        title: 'Armadilha Estatistica',
        text: '65% dos supervisores sao promovidos por competencia tecnica, mas apenas 30% recebem formacao em lideranca. A transicao de "bom tecnico" para "lider" exige desenvolvimento intencional.\n\nIsso significa que a maioria dos supervisores esta aprendendo a liderar por tentativa e erro — um custo altissimo para a empresa e para as pessoas.',
      },
      {
        title: 'Do "Homer" ao Lider Estrategico',
        text: 'Homer = reativo, apaga incendios, foca exclusivamente no dia a dia. Estrategico = planeja o futuro enquanto o presente acontece.\n\nEvolucao: Junior (faz o dia rodar), Pleno (indicadores e eficiencia), Senior (cultura e visao de longo prazo). Cada nivel exige competencias diferentes.',
      },
      {
        title: 'Ciclo de Sucessao',
        text: 'Modelo que equilibra desempenho tecnico com competencias de lideranca. Sem ele, o "Prata da Casa" estagna — otimo tecnico preso em cargo de gestao sem preparacao.',
      },
      {
        title: 'Senso de Dono',
        text: 'Postura de autorresponsabilidade onde cada decisao e pautada como se o prejuizo ou lucro da operacao fossem seus. Nao e sobre ser dono literal — e sobre assumir a responsabilidade pelo resultado.',
      },
    ],
    ferramentas: [
      {
        name: 'Autoavaliacao das 5 Dimensoes',
        description:
          'Formulario 1.4.1 da plataforma. Cada participante avalia seu nivel atual em cada uma das 5 dimensoes de lideranca e identifica gaps prioritarios.',
        duration: '~10 min',
      },
      {
        name: 'Mapa de Evolucao',
        description:
          'Ferramenta visual Junior > Pleno > Senior para o participante mapear onde esta e definir proximos passos.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com a pergunta provocativa: "Voce foi promovido por ser bom tecnico ou por ser bom lider?" Deixar o silencio trabalhar.',
      transitions:
        'Usar a estatistica dos 65% como gancho para as 5 Dimensoes. Transicionar do Homer para o Estrategico com humor.',
      closing:
        'Fechar com a frase-chave: "O supervisor e o garantidor da cultura e dos resultados futuros."',
      timing: 'Abertura: 15min | Conteudo: 60min | Autoavaliacao: 15min | Discussao: 30min',
    },
    exercicios: [
      {
        name: 'Autoavaliacao Individual',
        objective: 'Cada participante mapeia seu nivel nas 5 dimensoes',
        instructions:
          'Distribuir formulario 1.4.1. Cada pessoa preenche individualmente, refletindo sobre exemplos concretos de cada dimensao no dia a dia.',
        duration: '15 min',
      },
      {
        name: 'Discussao em Grupo',
        objective: 'Compartilhar perspectivas e ampliar visao',
        instructions:
          'Em grupos de 4-5, cada um compartilha sua autoavaliacao. Pergunta guia: "Cite um exemplo de plano de longo prazo iniciado por voce."',
        duration: '30 min',
      },
    ],
    slidesChave: [
      'O supervisor e o garantidor da cultura e dos resultados futuros',
      'O sucesso nao e sorte, e padrao',
      'Investimentos em planos estruturados aumentam o engajamento em 79%',
    ],
  },
  {
    id: 2,
    title: 'Inteligencia Comportamental e Comunicacao',
    shortTitle: 'Intel. Comportamental',
    day: 1,
    period: 'Manha',
    icon: Brain,
    color: '#1565C0',
    resumo:
      'A transicao do Supervisor Autoritario (comando e controle) para o Supervisor Coach (inspiracao e empoderamento) aumenta o engajamento em 79% e reduz burnout significativamente.\n\nO modulo ensina postura, inteligencia emocional e a Formula E.I.A. de feedback assertivo — ferramentas praticas que o supervisor pode aplicar ja na segunda-feira.',
    objetivos: [
      'Desenvolver inteligencia emocional aplicada a gestao',
      'Dominar a Formula E.I.A. de feedback',
      'Praticar escuta ativa e comunicacao nao-violenta',
      'Transitar de comando/controle para inspiracao/empoderamento',
    ],
    conteudo: [
      {
        title: 'Supervisor Autoritario vs Supervisor Coach',
        text: 'Autoritario foca no erro e no controle. Coach foca na solucao e no empoderamento. Dados: engajamento +79%, burnout reduzido significativamente.\n\nA mudanca nao e sobre ser "bonzinho" — e sobre ser estrategico. O lider coach consegue mais resultado com menos desgaste porque a equipe trabalha COM ele, nao POR MEDO dele.',
      },
      {
        title: 'Inteligencia Emocional na Gestao',
        text: 'Autoconsciencia (reconhecer suas emocoes), Autogestao (controlar reacoes), Empatia (entender o outro), Habilidade social (influenciar positivamente).\n\nO lider que nao gerencia suas emocoes contamina o clima da equipe. Uma reacao explosiva do supervisor num momento de pressao pode destruir semanas de confianca construida.',
      },
      {
        title: 'Formula E.I.A. (Evento, Impacto, Acao)',
        text: 'Evento = fato sem julgamento: "Percebi que o relatorio foi entregue 2 dias apos o prazo."\n\nImpacto = consequencia no resultado/clima: "Isso atrasou a decisao do diretor e gerou retrabalho para a equipe."\n\nAcao = sugestao de futuro: "Para as proximas entregas, que tal alinharmos um checkpoint no meio do caminho?"\n\nCHAVES: Neutralidade (foco no problema, nao na pessoa), Escuta Ativa (ouvir a resposta antes de concluir).',
      },
      {
        title: 'Escuta Ativa — 3 Niveis',
        text: 'Nivel 1: Ouvir (captar som). Nivel 2: Escutar (entender conteudo). Nivel 3: Escuta Ativa (captar emocao e intencao por tras das palavras).\n\nTecnicas: parafrasear ("Entao voce esta dizendo que..."), perguntar para aprofundar ("O que te levou a pensar isso?"), validar o sentimento ("Faz sentido voce se sentir assim").',
      },
      {
        title: 'Comunicacao Assertiva',
        text: 'Nem agressiva (impoe) nem passiva (omite). Assertiva = expressa com clareza, respeito e firmeza.\n\nModelo: "Eu percebo que... Isso me impacta porque... O que sugiro e..." A assertividade e a comunicacao do lider maduro — defende sua posicao sem atacar o outro.',
      },
    ],
    ferramentas: [
      {
        name: 'Formula E.I.A. (Template)',
        description:
          'Template impresso com os 3 campos (Evento, Impacto, Acao) para o participante preencher com situacoes reais do trabalho.',
        duration: '~15 min',
      },
      {
        name: 'Roda da Escuta Ativa',
        description:
          'Ferramenta visual com os 3 niveis de escuta e tecnicas praticas para cada nivel.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com a pergunta: "Quando foi a ultima vez que voce deu um feedback que realmente mudou o comportamento de alguem?" Deixar refletirem.',
      transitions:
        'Do Autoritario vs Coach, usar exemplos reais do chao de fabrica. Na E.I.A., fazer uma demonstracao ao vivo antes do exercicio.',
      closing:
        'Fechar com: "Liderar e inspirar, nao controlar. Feedback e presente, nao punicao."',
      timing: 'Abertura: 10min | Conteudo: 50min | Role-play: 30min | Debrief: 30min',
    },
    exercicios: [
      {
        name: 'Role-play com E.I.A.',
        objective: 'Praticar feedback assertivo em cenario real',
        instructions:
          'Em duplas, cada participante recebe um cenario do setor e aplica a Formula E.I.A. O parceiro avalia se foi neutro (Evento), claro (Impacto) e construtivo (Acao).',
        duration: '30 min',
      },
      {
        name: 'Exercicio de Escuta Ativa',
        objective: 'Desenvolver escuta de nivel 3',
        instructions:
          'Em duplas, um conta uma situacao dificil do trabalho (3 min). O outro apenas escuta, depois parafraseia e identifica a emocao por tras. Trocar papeis.',
        duration: '20 min',
      },
      {
        name: 'Autoavaliacao Coach vs Autoritario',
        objective: 'Identificar perfil predominante',
        instructions:
          'Questionario rapido: "Sou mais autoritario ou coach?" com 10 perguntas situacionais. Reflexao individual seguida de compartilhamento.',
        duration: '10 min',
      },
    ],
    slidesChave: [
      'Liderar e inspirar, nao controlar',
      'Feedback e presente, nao punicao',
      '79% mais engajamento com lideranca coaching',
    ],
  },
  {
    id: 3,
    title: 'Alicerce Etico e Responsabilidade',
    shortTitle: 'Alicerce Etico',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    color: '#F57C00',
    resumo:
      'O alicerce etico une Integridade e Justica com Equidade. Este modulo utiliza a dinamica do Tribunal das Virtudes para vivenciar dilemas eticos reais do chao de fabrica e construir um codigo de conduta pessoal.\n\nA etica nao e teoria abstrata — e a base da confianca que a equipe deposita no lider. Sem ela, nenhuma tecnica de gestao funciona.',
    objetivos: [
      'Compreender a diferenca entre etica, moral e valores',
      'Vivenciar dilemas eticos atraves da dinamica Tribunal das Virtudes',
      'Construir um alicerce etico pessoal como lider',
      'Entender seguranca psicologica como base da confianca',
    ],
    conteudo: [
      {
        title: 'Etica vs Moral vs Valores',
        text: 'Etica = principios universais de conduta. Moral = costumes e normas sociais. Valores = crencas individuais que guiam comportamento.\n\nO lider precisa alinhar os tres. Quando ha desalinhamento, surgem decisoes inconsistentes que minam a credibilidade.',
      },
      {
        title: 'As 4 Virtudes do Lider',
        text: 'Justica — tratar com equidade, nao igualdade. Dar a cada um o que precisa, nao a mesma coisa para todos.\n\nCoragem — tomar decisoes dificeis mesmo quando impopulares. O lider covarde posterga e o problema cresce.\n\nTemperanca — equilibrio entre firmeza e flexibilidade. Nem rigido demais, nem permissivo demais.\n\nPrudencia — decidir com sabedoria e visao de longo prazo. Considerar consequencias antes de agir.',
      },
      {
        title: 'Tribunal das Virtudes (Dinamica)',
        text: 'Exercicio vivencial onde o grupo julga dilemas eticos reais. Participantes assumem papeis de promotor, defensor, juiz e juri.\n\nDilemas do chao de fabrica: funcionario que mente sobre producao, lider que favorece amigos, seguranca vs meta de producao. Cada dilema forca o grupo a aplicar as virtudes na pratica.',
      },
      {
        title: 'Integridade vs Metas',
        text: 'O que fazer quando a meta pressiona para atalhos antieticos? O lider etico mantem o padrao mesmo quando ninguem esta olhando.\n\n"O carater e o que voce faz quando ninguem esta vendo." Essa frase define a essencia da integridade no ambiente corporativo.',
      },
      {
        title: 'Seguranca Psicologica',
        text: 'Ambiente onde as pessoas podem errar, perguntar e discordar sem medo de retaliacao. Dados: times com seguranca psicologica tem 40% menos erros e 76% mais inovacao.\n\nO lider e o principal construtor ou destruidor da seguranca psicologica. Uma reacao negativa a um erro honesto pode calar a equipe por meses.',
      },
    ],
    ferramentas: [
      {
        name: 'Tribunal das Virtudes',
        description:
          'Roteiro completo da dinamica com 3 casos praticos, papeis definidos e criterios de julgamento baseados nas 4 virtudes.',
        duration: '60 min',
      },
      {
        name: 'Codigo de Etica Pessoal',
        description:
          'Template para cada participante escrever seus 3-5 principios eticos inegociaveis como lider.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com a pergunta: "Voce ja teve que escolher entre bater a meta e fazer o certo?" Coletar respostas rapidas.',
      transitions:
        'Das virtudes para o Tribunal — transformar a teoria em vivencia. Do Tribunal para Seguranca Psicologica — mostrar como etica cria confianca.',
      closing:
        'Fechar com: "Integridade nao e negociavel. E o alicerce de tudo que construimos."',
      timing: 'Abertura: 10min | Virtudes: 30min | Tribunal: 60min | Codigo Pessoal: 20min',
    },
    exercicios: [
      {
        name: 'Tribunal das Virtudes',
        objective: 'Vivenciar dilemas eticos em grupo',
        instructions:
          'Dividir em grupos. Cada grupo recebe um dilema e define promotor, defensor e juri. O grupo debate e "julga" usando as 4 virtudes como criterio.',
        duration: '60 min',
      },
      {
        name: 'Principios Inegociaveis',
        objective: 'Construir base etica pessoal',
        instructions:
          'Individualmente, cada participante escreve 3 principios eticos que nunca comprometeria. Compartilhar com o grupo e explicar o porque.',
        duration: '20 min',
      },
      {
        name: 'Debate: Meta vs Seguranca',
        objective: 'Refletir sobre prioridades eticas',
        instructions:
          'Debate aberto: "Quando a meta entra em conflito com a seguranca, o que prevalece?" Dois grupos defendem posicoes opostas.',
        duration: '15 min',
      },
    ],
    slidesChave: [
      'Integridade nao e negociavel',
      'Equidade nao e igualdade',
      'Seguranca psicologica reduz erros em 40%',
    ],
  },
  {
    id: 4,
    title: 'Gestao da Diversidade Geracional',
    shortTitle: 'Diversidade Geracional',
    day: 1,
    period: 'Tarde',
    icon: Users,
    color: '#F57C00',
    resumo:
      'O chao de fabrica moderno reune ate 4 geracoes trabalhando juntas. Cada uma tem motivacoes, comunicacao e expectativas diferentes. O supervisor precisa ser um mediador geracional, nao um juiz.\n\n68% dos conflitos em equipes multigeracionais sao por diferencas de comunicacao, nao de competencia. Entender isso muda completamente a abordagem do lider.',
    objetivos: [
      'Mapear as caracteristicas de cada geracao',
      'Identificar fontes de conflito geracional',
      'Desenvolver estrategias de mediacao',
      'Implementar mentoria reversa',
    ],
    conteudo: [
      {
        title: 'Mapa Geracional',
        text: 'Baby Boomers (1946-64): lealdade, hierarquia, estabilidade. Valorizam reconhecimento pela experiencia e respeito a senioridade.\n\nGeracao X (1965-80): independencia, pragmatismo, work-life balance. Querem objetividade e resultados claros.\n\nMillennials/Y (1981-96): proposito, tecnologia, feedback constante. Buscam crescimento e impacto.\n\nGeracao Z (1997+): velocidade, diversidade, autonomia. Querem comunicacao digital e feedback instantaneo.\n\nCada geracao tem um "idioma" de motivacao diferente. O lider precisa ser poliglota.',
      },
      {
        title: 'Fontes de Conflito',
        text: 'BB vs Z — velocidade vs processo. O Boomer quer seguir o protocolo, o Z quer resolver rapido.\n\nX vs Y — pragmatismo vs idealismo. O X quer resultado pratico, o Y quer significado.\n\nBB vs Y — hierarquia vs horizontalidade. O Boomer espera respeito pela posicao, o Y quer merito.\n\n68% dos conflitos em equipes multigeracionais sao por diferencas de comunicacao, nao de competencia.',
      },
      {
        title: 'Estrategias de Mediacao',
        text: '(1) Nao rotular — "Esse jovem nao quer nada" / "Esse velho nao aceita mudanca" sao julgamentos que travam a equipe.\n\n(2) Criar pares intergeracionais em projetos — forca a colaboracao.\n\n(3) Adaptar a comunicacao — BB = reuniao formal, Z = mensagem rapida.\n\n(4) Valorizar a contribuicao unica de cada geracao — cada uma traz algo que as outras nao tem.',
      },
      {
        title: 'Mentoria Reversa',
        text: 'Z ensina X/BB sobre tecnologia, tendencias e novas formas de trabalho. X/BB ensina Z sobre resiliencia, politica organizacional e visao de longo prazo.\n\nQuebra hierarquias e constroi respeito mutuo. O resultado e uma equipe que aprende em todas as direcoes.',
      },
      {
        title: 'Engenharia de Equipes Diversas',
        text: 'Montar times com diversidade geracional intencional. O melhor time nao e homogeneo — e complementar.\n\nDiversidade geracional e vantagem competitiva quando bem gerida. O lider que sabe usar cada perfil multiplica resultados.',
      },
    ],
    ferramentas: [
      {
        name: 'Mapa Geracional da Equipe',
        description:
          'Template para mapear cada membro da equipe por geracao, identificar caracteristicas e definir estrategia de comunicacao.',
        duration: '~15 min',
      },
      {
        name: 'Plano de Mentoria Reversa',
        description:
          'Template para criar pares de mentoria entre geracoes, definir temas e agendar sessoes.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com: "Levante a mao quem ja pensou: esse jovem nao quer nada? Ou: esse velho nao muda?" Criar identificacao.',
      transitions:
        'Do Mapa para os Conflitos — mostrar que sao previsiveis. Dos Conflitos para Mentoria Reversa — a solucao.',
      closing:
        'Fechar com: "Diversidade geracional e vantagem competitiva quando o lider sabe usar."',
      timing: 'Abertura: 10min | Mapa: 30min | Conflitos: 20min | Mentoria: 30min | Exercicio: 30min',
    },
    exercicios: [
      {
        name: 'Mapeamento Geracional',
        objective: 'Mapear equipe real por geracao',
        instructions:
          'Cada participante mapeia sua equipe por geracao e identifica conflitos latentes. Preencher o template do Mapa Geracional.',
        duration: '15 min',
      },
      {
        name: 'Par de Mentoria Reversa',
        objective: 'Criar plano concreto de mentoria',
        instructions:
          'Identificar um par de mentoria reversa na sua equipe (Z+BB ou Z+X). Definir tema, frequencia e primeiro encontro.',
        duration: '15 min',
      },
      {
        name: 'Simulacao de Comunicacao',
        objective: 'Adaptar mensagem por geracao',
        instructions:
          'Cenario: comunicar a mesma meta para um BB e um Z. Cada participante escreve as duas versoes e compartilha.',
        duration: '20 min',
      },
    ],
    slidesChave: [
      '68% dos conflitos sao de comunicacao, nao competencia',
      'Diversidade geracional e vantagem competitiva',
      'Mentoria reversa: Z ensina X',
    ],
  },
  {
    id: 5,
    title: 'Engenharia de Equipes, Mapeamento e Sucessao',
    shortTitle: 'Eng. de Equipes',
    day: 2,
    period: 'Manha',
    icon: BriefcaseBusiness,
    color: '#1565C0',
    resumo:
      'Baseado na Matriz de Competencia x Compromisso, o modulo ensina a mapear cada membro da equipe em 4 quadrantes e aplicar a acao de lideranca correta para cada perfil.\n\nTambem aborda delegacao eficaz e plano de sucessao — o lider que nao prepara sucessor esta preso no cargo.',
    objetivos: [
      'Mapear cada colaborador na Matriz Competencia x Compromisso',
      'Aplicar a acao correta para cada quadrante',
      'Dominar delegacao eficaz',
      'Criar plano de sucessao',
    ],
    conteudo: [
      {
        title: 'Matriz Competencia x Compromisso — 4 Quadrantes',
        text: '(1) Iniciante Motivado (baixa competencia, alto compromisso): Acao = Direcionar com mentoria tecnica intensiva. E o novato empolgado — precisa de guia, nao de autonomia.\n\n(2) O Estrela (alta competencia, alto compromisso): Acao = Delegar desafios estrategicos. E seu futuro sucessor — de espaco e desafio.\n\n(3) O Questionador (alta competencia, baixo compromisso): Acao = Apoiar com feedback comportamental. Sabe fazer mas perdeu a motivacao — descubra o porque.\n\n(4) O Problema (baixa competencia, baixo compromisso): Acao = Treinar com prazo ou substituir. Ultimo recurso apos investimento genuino.',
      },
      {
        title: 'Delegacao Eficaz',
        text: 'Nao e "jogar tarefa". E um processo estruturado:\n\n(1) Escolher a pessoa certa pelo perfil\n(2) Dar contexto do porque, nao so do que\n(3) Definir checkpoint intermediario\n(4) Permitir erro controlado\n(5) Reconhecer publicamente o resultado\n\nDelegacao bem feita desenvolve a equipe. Delegacao mal feita e abandono.',
      },
      {
        title: 'Plano de Sucessao',
        text: 'Quem assume se voce sai amanha? Se a resposta e "ninguem", voce e o gargalo. O lider que nao prepara sucessor esta preso no cargo.\n\nModelo: identificar 2-3 potenciais, criar trilha de desenvolvimento para cada, fazer job shadowing gradual. O sucessor nao nasce pronto — e desenvolvido.',
      },
      {
        title: 'Autonomia do Time',
        text: 'De equipe dependente (tudo passa pelo lider) para equipe autonoma (processos permitem execucao independente).\n\nIndicador: quanto tempo voce pode ficar ausente sem que nada pare? Se a resposta e "nem um dia", voce precisa trabalhar a autonomia.',
      },
    ],
    ferramentas: [
      {
        name: 'Matriz de Mapeamento (2x2)',
        description:
          'Template visual com os 4 quadrantes para posicionar cada membro da equipe e definir acao especifica.',
        duration: '~20 min',
      },
      {
        name: 'Plano de Sucessao',
        description:
          'Template para identificar potenciais sucessores, definir trilha de desenvolvimento e cronograma.',
      },
      {
        name: 'Checklist de Delegacao',
        description:
          'Lista de verificacao com os 5 passos da delegacao eficaz para usar no dia a dia.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com: "Quem assume se voce sai amanha?" Deixar o desconforto trabalhar.',
      transitions:
        'Da Matriz para Delegacao — mostrar que o quadrante define o tipo de delegacao. Da Delegacao para Sucessao — fechar o ciclo.',
      closing:
        'Fechar com: "Voce so cresce se preparar quem vem depois."',
      timing: 'Abertura: 10min | Matriz: 40min | Delegacao: 25min | Sucessao: 25min | Exercicio: 20min',
    },
    exercicios: [
      {
        name: 'Mapeamento da Equipe',
        objective: 'Posicionar cada membro nos 4 quadrantes',
        instructions:
          'Individualmente, mapear toda a equipe na Matriz Competencia x Compromisso. Para cada pessoa, definir a acao de lideranca correta.',
        duration: '20 min',
      },
      {
        name: 'Identificar Sucessor',
        objective: 'Definir plano de sucessao concreto',
        instructions:
          'Identificar seu potencial sucessor e definir 3 acoes de desenvolvimento que comecam esta semana.',
        duration: '15 min',
      },
      {
        name: 'Exercicio de Delegacao',
        objective: 'Praticar delegacao estruturada',
        instructions:
          'Escolher uma tarefa real e delegar usando o Checklist de Delegacao. Apresentar para o grupo.',
        duration: '15 min',
      },
    ],
    slidesChave: [
      'Voce so cresce se preparar quem vem depois',
      'Delegacao nao e abandono',
      'Se ninguem pode te substituir, voce e o gargalo',
    ],
  },
  {
    id: 6,
    title: 'O Supervisor 4.0 (Tecnologia e IA)',
    shortTitle: 'Supervisor 4.0',
    day: 2,
    period: 'Manha',
    icon: Cpu,
    color: '#1565C0',
    resumo:
      'No modelo de Operacoes 4.0, o valor migra do "fazer o grafico" para o "saber o que fazer com a informacao". O Supervisor Cientista utiliza IA como copiloto e dados como bussola, mantendo a decisao humana como centro.\n\nNao e sobre ser programador — e sobre usar dados e tecnologia para decidir melhor.',
    objetivos: [
      'Utilizar IA generativa como ferramenta pratica de gestao',
      'Dominar o Prompt Magico (Contexto + Dados + Objetivo)',
      'Realizar analise de causa raiz com dados',
      'Diferenciar KPI Autopsia de KPI Bussola',
    ],
    conteudo: [
      {
        title: 'O Supervisor Cientista',
        text: 'Evolucao do perfil. Nao e sobre ser programador — e sobre usar dados e tecnologia para decidir melhor.\n\nTriade da Maestria: Reconhecimento (identificar o que funciona), Criacao (inovar o padrao), Utilizacao (replicar boas praticas). O supervisor que domina essa triade se torna indispensavel.',
      },
      {
        title: 'Prompt Magico — Contexto + Dados + Objetivo',
        text: 'A formula para usar IA de forma eficaz:\n\nExemplo: "Sou supervisor de producao [CONTEXTO], tenho dados de retrabalho dos ultimos 3 meses [DADOS], preciso identificar a causa raiz e propor acoes [OBJETIVO]."\n\nSem contexto, a IA da resposta generica. Com dados, ela da resposta acionavel. A qualidade do resultado depende 100% da qualidade do prompt.',
      },
      {
        title: 'Analise de Causa Raiz com IA',
        text: 'A falha e Humana, de Maquina ou de Processo? Usar dados do ERP/Excel para correlacao de variaveis.\n\nIA ajuda a cruzar dados que o humano demoraria semanas. Mas ATENCAO: anonimizacao obrigatoria — remover nomes e dados sensiveis antes de inserir na IA.',
      },
      {
        title: 'KPI Autopsia vs KPI Bussola',
        text: 'Autopsia = olha para o passado (o que deu errado). Bussola = olha para o futuro (para onde estamos indo). O supervisor deve usar ambos mas priorizar Bussola.\n\nKPIs S.M.A.R.T.: Especificos, Mensuraveis, Atingiveis, Relevantes, Temporais. "Reduzir retrabalho em 15% ate o final do trimestre" vs "Melhorar a qualidade" (vago).',
      },
      {
        title: '3 Analises com IA',
        text: '(1) Analise de Tendencias/Previsao: sazonalidade, escalas inteligentes, antecipacao de demanda.\n\n(2) Analise de Causa Raiz: cruzar variaveis para encontrar padrao — a IA ve correlacoes que o olho humano perde.\n\n(3) Analise de Sentimento: transformar pesquisas de clima em acao — a IA categoriza respostas abertas em temas acionaveis.',
      },
      {
        title: 'O 70/30',
        text: 'Tome decisoes com 70% de dados e 30% de intuicao. Esperar 100% dos dados e paralisia. Menos de 70% e achismo.\n\nO lider experiente calibra essa balanca. A IA fornece os 70% — a experiencia do lider completa os 30%.',
      },
    ],
    ferramentas: [
      {
        name: 'Template de Prompt Magico',
        description:
          'Formulario com campos: Contexto (quem sou, cenario), Dados (numeros, fatos), Objetivo (o que quero). Com exemplos por area.',
        duration: '~10 min por prompt',
      },
      {
        name: 'Planilha de KPI Bussola',
        description:
          'Template para classificar KPIs existentes em Autopsia ou Bussola e criar novos KPIs preditivos.',
      },
      {
        name: 'Checklist de Anonimizacao',
        description:
          'Lista de verificacao para garantir que dados inseridos na IA nao contem informacoes sensiveis.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com: "Quem aqui ja usou ChatGPT ou Gemini?" Mapear nivel de familiaridade. "Agora, quem ja usou para resolver um problema real do trabalho?"',
      transitions:
        'Do Supervisor Cientista para o Prompt Magico — "A IA e tao boa quanto seu prompt." Do Prompt para KPIs — "Agora que voce sabe perguntar, precisa saber o que medir."',
      closing:
        'Fechar com: "IA e o copiloto, voce e o piloto. Decisao: 70% dados + 30% intuicao."',
      timing: 'Abertura: 10min | Conceitos: 35min | Pratica com IA: 40min | KPIs: 25min | Fechamento: 10min',
    },
    exercicios: [
      {
        name: 'Criar 3 Prompts Magicos',
        objective: 'Dominar a formula Contexto + Dados + Objetivo',
        instructions:
          'Cada participante identifica 3 problemas reais do setor e cria um Prompt Magico para cada. Testar ao vivo com IA se possivel.',
        duration: '30 min',
      },
      {
        name: 'Classificar KPIs',
        objective: 'Diferenciar Autopsia de Bussola',
        instructions:
          'Listar 5 KPIs do setor e classificar cada um como Autopsia ou Bussola. Propor pelo menos 2 novos KPIs Bussola.',
        duration: '15 min',
      },
      {
        name: 'Analise de Causa Raiz',
        objective: 'Usar dados para encontrar padrao',
        instructions:
          'Pegar um problema recente do setor, organizar dados e usar IA para identificar causa raiz. Apresentar conclusao.',
        duration: '25 min',
      },
    ],
    slidesChave: [
      'IA e o copiloto, voce e o piloto',
      'Decisao: 70% dados + 30% intuicao',
      'De fazer graficos para saber o que fazer com a informacao',
    ],
  },
  {
    id: 7,
    title: 'Padroes de Sucesso',
    shortTitle: 'Padroes de Sucesso',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    color: '#F57C00',
    resumo:
      'O sucesso nao e sorte — e padrao. Este modulo ensina a identificar, documentar e replicar resultados positivos usando a Triade da Maestria e KPIs S.M.A.R.T.\n\nA maioria dos lideres foca so em corrigir erros. O lider de alta performance tambem estuda os acertos.',
    objetivos: [
      'Aplicar a Triade da Maestria em resultados do setor',
      'Criar KPIs S.M.A.R.T. para a equipe',
      'Transformar resultados positivos em procedimentos replicaveis',
      'Construir cultura de melhoria continua',
    ],
    conteudo: [
      {
        title: 'Triade da Maestria',
        text: 'Reconhecimento — identificar o que funciona: "Por que esse turno produziu 20% mais?"\n\nCriacao — inovar o padrao: "Como melhorar o que ja funciona?"\n\nUtilizacao — replicar: "Como transformar em procedimento para todos?"\n\nA maioria dos lideres foca so em corrigir erros. O lider de alta performance tambem estuda os acertos.',
      },
      {
        title: 'Do Acerto Isolado ao Padrao',
        text: 'Quando algo da certo, pergunte: "O que fizemos diferente?" Entao: Documente > Replique > Meca.\n\nO Standard (padrao documentado) e o piso minimo de qualidade. Sem standard, cada turno inventa seu proprio jeito — e a qualidade vira loteria.',
      },
      {
        title: 'KPIs S.M.A.R.T.',
        text: 'Especifico (O que exatamente?), Mensuravel (Como vou medir?), Atingivel (E realista?), Relevante (Importa para o negocio?), Temporal (Ate quando?).\n\nExemplo: "Reduzir retrabalho da linha 3 em 15% ate o final do trimestre" vs "Melhorar a qualidade" (vago e imensuravel).',
      },
      {
        title: 'Dashboard do Lider',
        text: 'Quais numeros voce precisa ver todo dia? Producao, qualidade, seguranca, absenteismo, clima.\n\nSe nao esta medindo, nao esta gerenciando. O dashboard e o painel de bordo do supervisor — sem ele, voce voa as cegas.',
      },
      {
        title: 'Melhoria Continua (Kaizen)',
        text: 'Pequenas melhorias diarias > grandes transformacoes esporadicas. Envolver a equipe nas melhorias aumenta o engajamento.\n\nCiclo: Identificar > Planejar > Executar > Verificar > Padronizar. Cada melhoria vira novo standard.',
      },
    ],
    ferramentas: [
      {
        name: 'Template de Standard Operacional',
        description:
          'Modelo para documentar uma boa pratica com: descricao do processo, indicadores, responsavel e frequencia de revisao.',
        duration: '~15 min',
      },
      {
        name: 'Planilha de KPIs S.M.A.R.T.',
        description:
          'Template para criar KPIs com todos os 5 criterios preenchidos e plano de acompanhamento.',
      },
      {
        name: 'Dashboard do Lider (modelo)',
        description:
          'Modelo de dashboard diario com os indicadores essenciais para o supervisor: producao, qualidade, seguranca, absenteismo.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com: "Me contem um resultado muito bom que aconteceu no setor de voces nos ultimos 3 meses." Depois: "Voces documentaram como fizeram?"',
      transitions:
        'Da Triade para KPIs — "Agora que voce sabe reconhecer, precisa medir." Dos KPIs para Dashboard — "E ver todo dia."',
      closing:
        'Fechar com: "O sucesso nao e sorte, e padrao. Estude seus acertos, nao so seus erros."',
      timing: 'Abertura: 10min | Triade: 30min | KPIs: 25min | Dashboard: 20min | Exercicios: 35min',
    },
    exercicios: [
      {
        name: 'Aplicar a Triade',
        objective: 'Identificar acerto recente e sistematizar',
        instructions:
          'Identificar 1 acerto recente do setor. Aplicar: Reconhecimento (o que deu certo?), Criacao (como melhorar?), Utilizacao (como replicar?).',
        duration: '15 min',
      },
      {
        name: 'Criar KPIs S.M.A.R.T.',
        objective: 'Construir metas mensuravels',
        instructions:
          'Criar 3 KPIs S.M.A.R.T. para seu setor. Cada KPI deve ter os 5 criterios preenchidos. Validar com o grupo.',
        duration: '15 min',
      },
      {
        name: 'Dashboard Pessoal',
        objective: 'Montar painel de gestao diaria',
        instructions:
          'Definir os 5 indicadores que voce precisa ver todo dia. Montar seu Dashboard do Lider pessoal usando o modelo.',
        duration: '15 min',
      },
    ],
    slidesChave: [
      'O sucesso nao e sorte, e padrao',
      'Estude seus acertos, nao so seus erros',
      'Sem standard, cada turno inventa seu jeito',
    ],
  },
  {
    id: 8,
    title: 'Estrategia de Carreira e Plano Futuro',
    shortTitle: 'Estrategia & Futuro',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    color: '#F57C00',
    resumo:
      'Modulo de encerramento que integra tudo em um PDI individual. O supervisor sai com seu plano de 12 semanas, compromisso de autocoaching e agenda de mentoria pos-treinamento.\n\nSem acompanhamento, 70% do conteudo e esquecido em 1 semana. O PDI e a garantia de implementacao.',
    objetivos: [
      'Construir o PDI individual de 12 semanas',
      'Definir compromisso de autocoaching',
      'Planejar sessoes de mentoria 30/60 dias',
      'Assumir protagonismo sobre a propria carreira',
    ],
    conteudo: [
      {
        title: 'Roteiro de Aceleracao de 12 Semanas',
        text: 'Fase 1 — Comportamental (Sem. 1-4): Escuta ativa, confianca, etica. Ferramenta: Tribunal das Virtudes.\n\nFase 2 — Processual (Sem. 5-8): Otimizacao, padronizacao, KPIs. Ferramenta: Triade da Maestria.\n\nFase 3 — Estrategico (Sem. 9-12): Inovacao, sucessao, visao de futuro. Ferramenta: Mentoria Reversa.\n\nCada fase constroi sobre a anterior. Nao pule fases.',
      },
      {
        title: 'Compromisso de Autocoaching',
        text: '3 perguntas-chave que o supervisor deve se fazer regularmente:\n\n(1) "O que eu mudarei no meu comportamento diario para que minha equipe se torne autonoma?"\n\n(2) "Como utilizarei dados e IA para antecipar gargalos?"\n\n(3) "Qual acao de treinamento iniciarei hoje para preparar meu sucessor?"\n\nAutocoaching e a disciplina de se desenvolver sem depender de alguem cobrando.',
      },
      {
        title: 'Garantia de Implementacao',
        text: 'Sessao 30 dias: revisao de desafios, KPIs, conflitos geracionais. O que funcionou? O que travou?\n\nSessao 60 dias: preparacao para gerencia, revisao do plano de sucessao. Proximos passos.\n\nPara vencer a "Curva do Esquecimento" — sem acompanhamento, 70% do conteudo e esquecido em 1 semana.',
      },
      {
        title: 'De Executor a Protagonista',
        text: 'A responsabilidade pela carreira e do proprio lider. O PDI nao e do RH — e seu.\n\nVisibilidade: o PDI projeta o talento para os niveis estrategicos. Quem tem plano e acompanha tem mais chance de ser lembrado para oportunidades.\n\n"Voce so cresce se preparar quem vem depois."',
      },
      {
        title: 'Encerramento e Certificacao',
        text: 'Compromisso formal com assinaturas: Supervisor (autodeclaracao de protagonismo), Gerente/Diretor (alinhamento estrategico).\n\nData das sessoes de mentoria definidas antes de sair. Sem data marcada, nao acontece.',
      },
    ],
    ferramentas: [
      {
        name: 'PDI Individual',
        description:
          'Plano de Desenvolvimento Individual gerado na plataforma com metas de curto, medio e longo prazo, acoes especificas e indicadores.',
        duration: '~30 min',
      },
      {
        name: 'Compromisso de Autocoaching',
        description:
          'Template com as 3 perguntas-chave e espaco para respostas e comprometimento publico.',
      },
      {
        name: 'Agenda de Mentoria',
        description:
          'Calendario com datas das sessoes de 30 e 60 dias, objetivos de cada sessao e preparacao necessaria.',
      },
    ],
    roteiro: {
      opening:
        'Abrir com: "Tudo que aprendemos nos ultimos 2 dias so vale se voce aplicar. Sem acao, e apenas entretenimento."',
      transitions:
        'Do Roteiro para o PDI — "Agora e a sua vez de construir." Do PDI para o Compromisso — "Assine embaixo."',
      closing:
        'Fechar com: "Liderar e inspirar. Transforme dados em decisoes e pessoas em talentos. A responsabilidade pela carreira e sua."',
      timing: 'Abertura: 10min | Roteiro: 20min | PDI: 30min | Compromisso: 15min | Encerramento: 15min',
    },
    exercicios: [
      {
        name: 'Preencher PDI Completo',
        objective: 'Construir plano de desenvolvimento concreto',
        instructions:
          'Usando o template, preencher o PDI individual com: metas por fase (12 semanas), acoes especificas, indicadores de progresso e cronograma.',
        duration: '30 min',
      },
      {
        name: 'Compromisso de Autocoaching',
        objective: 'Firmar comprometimento pessoal',
        instructions:
          'Escrever respostas para as 3 perguntas-chave. Compartilhar com um parceiro de accountability da turma.',
        duration: '15 min',
      },
      {
        name: 'Agendar Mentorias',
        objective: 'Garantir acompanhamento pos-treinamento',
        instructions:
          'Definir datas concretas para sessoes de mentoria com gestor: 30 dias e 60 dias. Registrar na Agenda de Mentoria.',
        duration: '10 min',
      },
    ],
    slidesChave: [
      'Liderar e inspirar. Transforme dados em decisoes e pessoas em talentos',
      'A responsabilidade pela carreira e sua',
      '70% e esquecido em 1 semana sem acompanhamento',
    ],
  },
]

// ─── Materials Data ─────────────────────────────────────────────────────────

const MATERIALS: MaterialItem[] = [
  { code: '1.1.1', name: 'Proposta Presencial 16h', category: 'Propostas', description: 'Proposta comercial para treinamento presencial de 2 dias (16h)', status: 'completo' },
  { code: '1.1.2', name: 'Proposta Online', category: 'Propostas', description: 'Proposta comercial para formato online/hibrido', status: 'completo' },
  { code: '1.2.1', name: 'Carta de Apresentacao', category: 'Cartas', description: 'Carta institucional Lidera Treinamentos para prospecao', status: 'completo' },
  { code: '1.3.1', name: 'Formulario de Briefing', category: 'Formularios', description: 'Formulario de levantamento de necessidades pre-treinamento', status: 'completo' },
  { code: '1.4.1', name: 'Autoavaliacao 5 Dimensoes', category: 'Formularios', description: 'Formulario de autoavaliacao das 5 Dimensoes da Lideranca', status: 'completo' },
  { code: '1.6.1', name: 'Apostila Mod. 1 — Funcao Estrategica', category: 'Apostilas', description: 'Material de apoio completo do Modulo 1', status: 'completo' },
  { code: '1.6.2', name: 'Apostila Mod. 2 — Intel. Comportamental', category: 'Apostilas', description: 'Material de apoio completo do Modulo 2', status: 'completo' },
  { code: '1.6.3', name: 'Apostila Mod. 3 — Alicerce Etico', category: 'Apostilas', description: 'Material de apoio completo do Modulo 3', status: 'completo' },
  { code: '1.6.4', name: 'Apostila Mod. 4 — Diversidade Geracional', category: 'Apostilas', description: 'Material de apoio completo do Modulo 4', status: 'completo' },
  { code: '1.6.5', name: 'Apostila Mod. 5 — Eng. de Equipes', category: 'Apostilas', description: 'Material de apoio completo do Modulo 5', status: 'completo' },
  { code: '1.6.6', name: 'Apostila Mod. 6 — Supervisor 4.0', category: 'Apostilas', description: 'Material de apoio completo do Modulo 6', status: 'completo' },
  { code: '1.6.7', name: 'Apostila Mod. 7 — Padroes de Sucesso', category: 'Apostilas', description: 'Material de apoio completo do Modulo 7', status: 'completo' },
  { code: '1.6.8', name: 'Apostila Mod. 8 — Estrategia e Futuro', category: 'Apostilas', description: 'Material de apoio completo do Modulo 8', status: 'completo' },
  { code: '1.6.9', name: 'Apostila Consolidada', category: 'Apostilas', description: 'Compilacao de todas as apostilas em documento unico', status: 'em_revisao' },
  { code: '2.1', name: 'Apresentacao Dia 1 — Manha', category: 'Apresentacoes', description: 'Slides dos modulos 1 e 2', status: 'completo' },
  { code: '2.2', name: 'Apresentacao Dia 1 — Tarde', category: 'Apresentacoes', description: 'Slides dos modulos 3 e 4', status: 'completo' },
  { code: '2.3', name: 'Apresentacao Dia 2 — Manha', category: 'Apresentacoes', description: 'Slides dos modulos 5 e 6', status: 'completo' },
  { code: '2.4', name: 'Apresentacao Dia 2 — Tarde', category: 'Apresentacoes', description: 'Slides dos modulos 7 e 8', status: 'completo' },
  { code: '3.1', name: 'Termo de Compromisso PDI', category: 'Termos', description: 'Termo de compromisso assinado pelo supervisor e gestor', status: 'completo' },
  { code: '3.2', name: 'Certificado de Conclusao', category: 'Termos', description: 'Modelo de certificado para participantes', status: 'completo' },
  { code: '3.3', name: 'Lista de Presenca', category: 'Termos', description: 'Formulario de controle de presenca por dia', status: 'completo' },
]

const STATUS_CONFIG = {
  completo: { label: 'Completo', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  em_revisao: { label: 'Em revisao', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  rascunho: { label: 'Rascunho', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500' },
  pendente: { label: 'Pendente', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ConteudoStudio() {
  const [activeTab, setActiveTab] = useState<'modulos' | 'materiais' | 'notas'>('modulos')
  const [selectedModule, setSelectedModule] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    resumo: true,
    objetivos: true,
    conteudo: true,
    ferramentas: false,
    roteiro: false,
    exercicios: false,
    slides: false,
    apoio: false,
  })
  const [moduleNotes, setModuleNotes] = useState<Record<number, string>>({})
  const [generalNotes, setGeneralNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)
  const [mobileModuleOpen, setMobileModuleOpen] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const notes: Record<number, string> = {}
    for (let i = 1; i <= 8; i++) {
      const saved = localStorage.getItem(`lidera_conteudo_notes_${i}`)
      if (saved) notes[i] = saved
    }
    setModuleNotes(notes)
    const gn = localStorage.getItem('lidera_conteudo_notes_general')
    if (gn) setGeneralNotes(gn)
  }, [])

  const saveModuleNote = useCallback(
    (moduleId: number, value: string) => {
      setModuleNotes((prev) => ({ ...prev, [moduleId]: value }))
      localStorage.setItem(`lidera_conteudo_notes_${moduleId}`, value)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 1500)
    },
    []
  )

  const saveGeneralNotes = useCallback((value: string) => {
    setGeneralNotes(value)
    localStorage.setItem('lidera_conteudo_notes_general', value)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 1500)
  }, [])

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const mod = MODULES.find((m) => m.id === selectedModule)!

  const tabs = [
    { key: 'modulos' as const, label: 'Modulos', icon: BookOpen },
    { key: 'materiais' as const, label: 'Materiais', icon: FolderOpen },
    { key: 'notas' as const, label: 'Notas', icon: StickyNote },
  ]

  return (
    <div className="pt-4">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#D8E2EF] mb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-[#1565C0] text-[#1565C0]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#D8E2EF]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
        {notesSaved && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-pulse">
            <Save className="h-3.5 w-3.5" />
            Salvo
          </span>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'modulos' && (
        <div className="flex flex-col lg:flex-row gap-0 mt-0">
          {/* Mobile module selector */}
          <div className="lg:hidden border-b border-[#D8E2EF] bg-white">
            <button
              onClick={() => setMobileModuleOpen(!mobileModuleOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-[#0F172A]"
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: mod.color }}
                >
                  {mod.id}
                </span>
                {mod.shortTitle}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[#64748B] transition-transform ${mobileModuleOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileModuleOpen && (
              <div className="border-t border-[#E5ECF6] pb-2">
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModule(m.id)
                      setMobileModuleOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      selectedModule === m.id
                        ? 'bg-[#1565C0]/5 text-[#1565C0] font-bold'
                        : 'text-[#64748B] hover:bg-[#F7FAFE]'
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-extrabold text-white`}
                      style={{ backgroundColor: selectedModule === m.id ? m.color : '#94A3B8' }}
                    >
                      {m.id}
                    </span>
                    <span className="truncate">{m.shortTitle}</span>
                    <span
                      className="ml-auto text-[10px] font-bold rounded px-1.5 py-0.5 text-white"
                      style={{ backgroundColor: m.day === 1 ? '#1565C0' : '#F57C00' }}
                    >
                      D{m.day}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 border-r border-[#D8E2EF] bg-[#FAFBFD]">
            <div className="sticky top-0 overflow-y-auto max-h-[calc(100vh-140px)] py-3">
              {[1, 2].map((day) => (
                <div key={day} className="mb-1">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-extrabold text-white"
                      style={{ backgroundColor: day === 1 ? '#1565C0' : '#F57C00' }}
                    >
                      D{day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      Dia {day}
                    </span>
                  </div>
                  {MODULES.filter((m) => m.day === day).map((m) => {
                    const Icon = m.icon
                    const isSelected = selectedModule === m.id
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModule(m.id)}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-all ${
                          isSelected
                            ? 'bg-white border-r-2 shadow-sm'
                            : 'hover:bg-white/60'
                        }`}
                        style={isSelected ? { borderRightColor: m.color } : undefined}
                      >
                        <div
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: isSelected ? `${m.color}15` : '#F1F5F9' }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: isSelected ? m.color : '#94A3B8' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[11px] font-extrabold truncate ${
                              isSelected ? 'text-[#0F172A]' : 'text-[#64748B]'
                            }`}
                          >
                            {String(m.id).padStart(2, '0')}. {m.shortTitle}
                          </p>
                          <p className="text-[10px] text-[#94A3B8]">{m.period}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Panel */}
          <main className="flex-1 min-w-0 bg-white">
            <div className="px-5 py-4 border-b border-[#E5ECF6]">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ color: mod.color }}
                >
                  Modulo {String(mod.id).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#94A3B8]">&bull;</span>
                <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
                  <Clock className="h-3 w-3" />
                  Dia {mod.day} — {mod.period}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0F172A]">{mod.title}</h2>
            </div>

            <div className="divide-y divide-[#E5ECF6]">
              {/* Resumo Executivo */}
              <CollapsibleSection
                id="resumo"
                icon={ClipboardList}
                label="Resumo Executivo"
                color="#1565C0"
                expanded={expandedSections.resumo}
                onToggle={toggleSection}
              >
                <div className="text-sm leading-relaxed text-[#334155] whitespace-pre-line">
                  {mod.resumo}
                </div>
              </CollapsibleSection>

              {/* Objetivos */}
              <CollapsibleSection
                id="objetivos"
                icon={Target}
                label="Objetivos de Aprendizagem"
                color="#16A34A"
                expanded={expandedSections.objetivos}
                onToggle={toggleSection}
              >
                <ol className="space-y-2">
                  {mod.objetivos.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#334155]">
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                        style={{ backgroundColor: mod.color }}
                      >
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ol>
              </CollapsibleSection>

              {/* Conteudo Programatico */}
              <CollapsibleSection
                id="conteudo"
                icon={BookOpen}
                label="Conteudo Programatico"
                color="#7C3AED"
                expanded={expandedSections.conteudo}
                onToggle={toggleSection}
              >
                <div className="space-y-3">
                  {mod.conteudo.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-[#E5ECF6] bg-[#FAFBFD] px-4 py-3"
                    >
                      <h4 className="text-sm font-bold text-[#0F172A] mb-1.5">{item.title}</h4>
                      <p className="text-xs leading-relaxed text-[#64748B] whitespace-pre-line">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Ferramentas */}
              <CollapsibleSection
                id="ferramentas"
                icon={Wrench}
                label="Ferramentas e Dinamicas"
                color="#F57C00"
                expanded={expandedSections.ferramentas}
                onToggle={toggleSection}
              >
                <div className="space-y-2.5">
                  {mod.ferramentas.map((tool, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-[#F57C00]/20 bg-[#F57C00]/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-[#0F172A]">{tool.name}</p>
                        {tool.duration && (
                          <span className="text-[10px] font-bold text-[#F57C00] bg-[#F57C00]/10 rounded-full px-2 py-0.5">
                            {tool.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#64748B]">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Roteiro do Facilitador */}
              <CollapsibleSection
                id="roteiro"
                icon={Mic}
                label="Roteiro do Facilitador"
                color="#DC2626"
                expanded={expandedSections.roteiro}
                onToggle={toggleSection}
              >
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#E5ECF6] bg-[#FAFBFD] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] mb-1">
                      Abertura
                    </p>
                    <p className="text-xs leading-relaxed text-[#334155]">{mod.roteiro.opening}</p>
                  </div>
                  <div className="rounded-lg border border-[#E5ECF6] bg-[#FAFBFD] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F57C00] mb-1">
                      Transicoes
                    </p>
                    <p className="text-xs leading-relaxed text-[#334155]">
                      {mod.roteiro.transitions}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E5ECF6] bg-[#FAFBFD] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] mb-1">
                      Fechamento
                    </p>
                    <p className="text-xs leading-relaxed text-[#334155]">{mod.roteiro.closing}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5">
                    <Clock className="h-3.5 w-3.5 text-[#F57C00]" />
                    <p className="text-xs font-bold text-white">{mod.roteiro.timing}</p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Exercicios */}
              <CollapsibleSection
                id="exercicios"
                icon={Pencil}
                label="Exercicios Praticos"
                color="#7C3AED"
                expanded={expandedSections.exercicios}
                onToggle={toggleSection}
              >
                <div className="space-y-3">
                  {mod.exercicios.map((ex, i) => (
                    <div key={i} className="rounded-lg border border-[#E5ECF6] bg-white px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-[#0F172A]">{ex.name}</h4>
                        <span className="text-[10px] font-bold text-[#7C3AED] bg-[#7C3AED]/10 rounded-full px-2 py-0.5">
                          {ex.duration}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-0.5">
                        Objetivo
                      </p>
                      <p className="text-xs text-[#334155] mb-2">{ex.objective}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-0.5">
                        Instrucoes
                      </p>
                      <p className="text-xs leading-relaxed text-[#64748B]">{ex.instructions}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Slides-chave */}
              <CollapsibleSection
                id="slides"
                icon={Presentation}
                label="Slides-Chave"
                color="#0369A1"
                expanded={expandedSections.slides}
                onToggle={toggleSection}
              >
                <div className="space-y-2">
                  {mod.slidesChave.map((slide, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-[#0F172A] px-4 py-3"
                    >
                      <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[#F57C00]" />
                      <p className="text-sm font-bold text-white">
                        &ldquo;{slide}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Material de Apoio / Notes */}
              <CollapsibleSection
                id="apoio"
                icon={MessageSquare}
                label="Material de Apoio (Notas)"
                color="#64748B"
                expanded={expandedSections.apoio}
                onToggle={toggleSection}
              >
                <div>
                  <p className="text-xs text-[#64748B] mb-2">
                    Adicione notas, links e referencias para este modulo. Salvo automaticamente no navegador.
                  </p>
                  <textarea
                    value={moduleNotes[mod.id] || ''}
                    onChange={(e) => saveModuleNote(mod.id, e.target.value)}
                    placeholder="Digite suas notas para este modulo..."
                    className="w-full rounded-lg border border-[#D8E2EF] bg-[#FAFBFD] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0]/20 min-h-[120px] resize-y"
                  />
                </div>
              </CollapsibleSection>
            </div>
          </main>
        </div>
      )}

      {activeTab === 'materiais' && <MateriaisTab />}
      {activeTab === 'notas' && (
        <NotasTab value={generalNotes} onChange={saveGeneralNotes} />
      )}
    </div>
  )
}

// ─── Collapsible Section ────────────────────────────────────────────────────

function CollapsibleSection({
  id,
  icon: Icon,
  label,
  color,
  expanded,
  onToggle,
  children,
}: {
  id: string
  icon: typeof Target
  label: string
  color: string
  expanded: boolean
  onToggle: (id: string) => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={() => onToggle(id)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-[#F7FAFE] transition-colors"
      >
        <div
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}12` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="flex-1 text-sm font-bold text-[#0F172A]">{label}</span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
        )}
      </button>
      {expanded && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}

// ─── Materials Tab ──────────────────────────────────────────────────────────

function MateriaisTab() {
  const categories = Array.from(new Set(MATERIALS.map((m) => m.category)))

  return (
    <div className="py-4 space-y-6">
      {categories.map((cat) => {
        const items = MATERIALS.filter((m) => m.category === cat)
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-[#1565C0]" />
              <h3 className="text-sm font-extrabold text-[#0F172A]">{cat}</h3>
              <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {items.map((item) => {
                const status = STATUS_CONFIG[item.status]
                return (
                  <div
                    key={item.code}
                    className="flex items-center gap-3 rounded-lg border border-[#E5ECF6] bg-white px-4 py-3 hover:border-[#1565C0]/20 transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-[#1565C0] bg-[#1565C0]/5 rounded px-2 py-1 shrink-0">
                      {item.code}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0F172A] truncate">{item.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{item.description}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.bg} ${status.border} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Notes Tab ──────────────────────────────────────────────────────────────

function NotasTab({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#F57C00]" />
        <h3 className="text-sm font-extrabold text-[#0F172A]">Notas de Desenvolvimento</h3>
      </div>
      <p className="text-xs text-[#64748B]">
        Use este espaco para anotacoes gerais sobre o programa, ideias de melhoria, pendencias e planejamento. Salvo automaticamente no navegador.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`# Notas Gerais do Programa\n\n## Pendencias\n- ...\n\n## Ideias de Melhoria\n- ...\n\n## Proximos Passos\n- ...`}
        className="w-full rounded-lg border border-[#D8E2EF] bg-[#FAFBFD] px-5 py-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0]/20 min-h-[500px] resize-y font-mono"
      />
    </div>
  )
}
