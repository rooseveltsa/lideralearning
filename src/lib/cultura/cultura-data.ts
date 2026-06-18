// Instrumento: Termômetro da Cultura Preventiva (anônimo + setor).
// Gerado a partir de docs/formularios/instrumentos.json (key: cultura_preventiva).
// Fonte de verdade do conteúdo do formulário, da escala e da pontuação.
//
// PARTICULARIDADES vs clima:
// - Escala única de CONCORDÂNCIA (5 pontos). Maior = cultura mais madura.
// - Itens "reverso" (CRÍTICOS invertidos): concordar é sinal RUIM. No scoring a
//   nota é virada: score = 100 - valueToScore(v). Há pelo menos 1 por dimensão.
// - Interpretação em ESTÁGIOS DE MATURIDADE (reativo → em desenvolvimento →
//   proativo → cultura madura), índice 0–100 onde maior = mais maduro.

export type CulturaItem = {
  id: string
  texto: string
  critico: boolean // item invertido/crítico: concordar é sinal ruim
  reverso: boolean // alias semântico — true quando a nota deve ser invertida
}

export type CulturaDimensao = {
  id: string
  nome: string
  descricao: string
  itens: CulturaItem[]
}

export type CulturaFaixa = { min: number; max: number; rotulo: string; acao: string }

// Escala única de concordância (índice 0 = valor 1 … índice 4 = valor 5).
export const CULTURA_ESCALA: string[] = [
  'Discordo totalmente',
  'Discordo mais do que concordo',
  'Concordo em parte',
  'Concordo bastante',
  'Concordo totalmente',
]

export const CULTURA_NS_NA = 'Não sei / não vivi essa situação'

// Setores padrão (editável). "Outro" libera campo livre no formulário.
export const CULTURA_SETORES: string[] = [
  'Produção',
  'Manutenção',
  'Logística / Expedição',
  'Qualidade',
  'Administrativo / Apoio',
  'Comercial',
  'Outro',
]

// Pergunta aberta de RED-FLAG / encaminhamento (lida só pelo responsável pelo
// tratamento, em sigilo). Não soma índice.
export const CULTURA_PERGUNTAS_ABERTAS: { id: string; texto: string }[] = [
  {
    id: 'relato_grave',
    texto:
      'Se você quiser relatar algo grave que esta pesquisa não perguntou — assédio, ameaça, violência, sofrimento intenso ou risco de vida —, escreva aqui. Isto será lido só pelo responsável pelo tratamento, em sigilo.',
  },
]

// Privacidade: só divulgar resultado de setor com este mínimo de respostas.
export const CULTURA_MIN_CELULA = 5

// Limiar de alerta no nível do item crítico (score já normalizado < 50).
export const CULTURA_LIMIAR_ALERTA = 50

// Âncora D5 (segurança psicológica): abaixo deste limiar os demais índices podem
// estar inflados por medo (ver PASSO 7 da pontuação).
export const CULTURA_ANCORA_D5_LIMIAR = 50

// Acima deste % de questionários inconsistentes, tratar o setor com cautela.
export const CULTURA_LIMIAR_INCONSISTENCIA = 20

export const CULTURA_DIMENSOES: CulturaDimensao[] = [
  {
    id: 'd1',
    nome: '1. Liderança que dá o exemplo na prevenção',
    descricao:
      'Mede o comprometimento visível da liderança com a segurança — se o líder pratica o que cobra, vai a campo e trata segurança como prioridade de verdade, não só quando há auditoria olhando.',
    itens: [
      {
        id: 'd1_i1',
        texto: 'Meu líder direto usa os EPIs corretamente, do mesmo jeito que cobra da gente.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd1_i2',
        texto:
          "Quando aparece um risco, concordo que meu líder para o serviço para resolver, mesmo que isso atrase a produção. (marque 'Não sei' se você nunca presenciou uma situação assim)",
        critico: false,
        reverso: false,
      },
      {
        id: 'd1_i3',
        texto:
          'Meu líder reserva tempo no dia a dia para falar de segurança com a equipe, além da DDS obrigatória.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd1_i4',
        texto: 'Para a chefia daqui, segurança vale tanto quanto bater a meta de produção.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd1_i5',
        texto: 'Aqui o líder só cobra segurança quando tem auditoria, cliente ou fiscalização por perto.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd2',
    nome: '2. Comunicação de riscos e quase-acidentes',
    descricao:
      "Mede se os riscos e os quase-acidentes (o 'foi por pouco') são falados e registrados abertamente, ou se ficam escondidos. Quase-acidente avisado é acidente evitado.",
    itens: [
      {
        id: 'd2_i1',
        texto: 'Aqui as pessoas avisam quando veem um risco, mesmo que ainda não tenha acontecido nada.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd2_i2',
        texto:
          "Quando alguém quase se acidenta — o famoso 'foi por pouco' ou 'quase deu' — isso é falado e registrado, não escondido.",
        critico: false,
        reverso: false,
      },
      {
        id: 'd2_i3',
        texto: 'Recebo informação clara sobre os riscos da minha função e do meu setor.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd2_i4',
        texto: 'Aqui a gente prefere ficar calado sobre um risco para não arrumar confusão.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd3',
    nome: '3. Voz e participação do time',
    descricao:
      'Mede se as pessoas se sentem à vontade para sugerir melhorias de segurança e se essas sugestões são levadas a sério. Time que tem voz cuida do processo.',
    itens: [
      {
        id: 'd3_i1',
        texto: 'Eu me sinto à vontade para sugerir melhorias na segurança do meu trabalho.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd3_i2',
        texto:
          'As ideias de segurança que vêm da equipe são ouvidas e, quando dá, são colocadas em prática.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd3_i3',
        texto: 'Quem aponta um problema de segurança é valorizado aqui, não visto como encrenqueiro.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd3_i4',
        texto: 'Aqui dar ideia de segurança é perda de tempo, porque nada muda.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd4',
    nome: '4. Aprender com o erro — cultura justa, não cultura de culpa',
    descricao:
      'Mede se, quando acontece um incidente, a empresa investiga para corrigir e aprender, ou se sai procurando culpado para punir. Cultura de culpa faz todo mundo esconder erro.',
    itens: [
      {
        id: 'd4_i1',
        texto:
          'Quando acontece um acidente ou incidente aqui, a preocupação principal é descobrir a causa e corrigir, não achar um culpado para punir.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd4_i2',
        texto:
          'Quando alguém comete um erro de segurança, a primeira reação da chefia é procurar culpado para punir.',
        critico: true,
        reverso: true,
      },
      {
        id: 'd4_i3',
        texto:
          'Aqui as lições de acidentes e quase-acidentes são passadas para a equipe, para não acontecer de novo.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd4_i4',
        texto: 'Tenho medo de admitir que cometi um erro porque sei que vou ser punido ou exposto.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd5',
    nome: '5. Segurança psicológica (admitir erro e pedir ajuda)',
    descricao:
      "Baseada em Amy Edmondson: mede se as pessoas se sentem seguras para admitir um erro, pedir ajuda, dizer 'não sei' ou discordar do chefe sem medo de humilhação. É a base de tudo.",
    itens: [
      {
        id: 'd5_i1',
        texto: 'Posso admitir que errei sem medo de ser humilhado na frente dos outros.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd5_i2',
        texto: 'Quando não sei fazer algo com segurança, me sinto à vontade para pedir ajuda.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd5_i3',
        texto:
          'Posso discordar do meu líder sobre uma forma mais segura de fazer o serviço, sem ser mal visto.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd5_i4',
        texto: 'Se eu disser que uma tarefa está perigosa demais, vão me tratar como covarde ou corpo mole.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd6',
    nome: '6. Antecipar o problema (proativo) em vez de só apagar incêndio (reativo)',
    descricao:
      'Mede se o setor age ANTES do acidente — inspeção, manutenção em dia, análise de risco da tarefa — ou só corre atrás depois que o problema estoura.',
    itens: [
      {
        id: 'd6_i1',
        texto: 'Concordo que, no meu setor, a gente identifica e corrige os riscos antes de virar acidente.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd6_i2',
        texto:
          'Concordo que as inspeções e manutenções de segurança ficam em dia, e não só depois que algo dá errado.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd6_i3',
        texto: 'Antes de uma tarefa de risco, a gente para e pensa no que pode dar errado.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd6_i4',
        texto: 'Aqui a segurança só recebe atenção depois que acontece um acidente ou uma fiscalização.',
        critico: true,
        reverso: true,
      },
    ],
  },
  {
    id: 'd7',
    nome: '7. Discurso x prática (a segurança é de verdade?)',
    descricao:
      'Mede a consistência entre o que a empresa fala sobre segurança e o que de fato acontece na produção — se o procedimento é seguido no dia a dia ou vira letra morta quando aperta o prazo.',
    itens: [
      {
        id: 'd7_i1',
        texto: 'O que a empresa fala sobre segurança bate com o que acontece de verdade na produção.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd7_i2',
        texto:
          'Os procedimentos de segurança são seguidos no dia a dia, e não só quando tem visita, auditoria ou cliente na fábrica.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd7_i3',
        texto: 'Quando o prazo aperta, a regra de segurança é deixada de lado para entregar a produção.',
        critico: true,
        reverso: true,
      },
      {
        id: 'd7_i4',
        texto: 'Tenho os EPIs que preciso para trabalhar com segurança.',
        critico: false,
        reverso: false,
      },
      {
        id: 'd7_i5',
        texto:
          'As máquinas e instalações onde trabalho oferecem condições seguras (proteções, sinalização, espaço, iluminação).',
        critico: false,
        reverso: false,
      },
    ],
  },
]

export const CULTURA_INTERPRETACAO: CulturaFaixa[] = [
  {
    min: 0,
    max: 39,
    rotulo: 'Reativo (só apaga incêndio)',
    acao:
      'A segurança aqui só anda quando estoura acidente ou fiscalização. Provável cultura de culpa e medo de falar. Ação do gestor: comece pela base — segurança psicológica e cultura justa. Pare de caçar culpado e passe a investigar causa. Líder vai a campo, ouve a equipe sem punir o mensageiro e age na primeira sugestão recebida. Trabalhar módulos LIDERA de ética/responsabilidade e inteligência comportamental. Sinal grave nos itens críticos → acionar RH/SESMT/canal independente, prioridade sobre a média.',
  },
  {
    min: 40,
    max: 59,
    rotulo: 'Em desenvolvimento (já se mexe, mas inconsistente)',
    acao:
      'Existe estrutura e intenção, mas a prática oscila — some quando o prazo aperta. Ação do gestor: focar na dimensão mais baixa do setor. Padronizar registro de quase-acidentes, dar retorno visível às sugestões e cobrar consistência entre discurso e prática. Criar rotina fixa de conversa de segurança que não caia quando a produção aperta.',
  },
  {
    min: 60,
    max: 79,
    rotulo: 'Proativo (se antecipa ao risco)',
    acao:
      'A equipe já identifica e corrige risco antes do acidente e tem espaço para falar. Ação do gestor: consolidar o que funciona, espalhar as boas práticas deste setor para os outros e fechar os pontos fracos restantes. Reconhecer publicamente quem aponta risco e quem traz melhoria.',
  },
  {
    min: 80,
    max: 100,
    rotulo: 'Cultura madura (confirmar antes de comemorar)',
    acao:
      'À primeira vista, prevenção virou o jeito natural de trabalhar. ATENÇÃO — checagem obrigatória: índice alto também aparece em cultura de medo (todos marcam 5 por desejabilidade social). Só considere maduro se: (1) D5 também alta (65+); (2) Índice de Inconsistência baixo (até ~20%); (3) itens invertidos coerentes com os positivos. Se não baterem, NÃO classifique como maduro — provável teto falso por medo. Quando confirmado: manter o nível, usar o setor como referência e seguir medindo.',
  },
]

// ── Pontuação (0–100), NS/NA descartado, piso de itens válidos por dimensão ──

export const CULTURA_PISO_ITENS_DIMENSAO = 3

/** Converte resposta 1–5 em nota 0–100 (item direto: maior = melhor). */
export function valueToScore(v: number): number {
  return Math.round(((v - 1) / 4) * 100)
}

/** Nota 0–100 de um item, já tratando itens reversos (concordar = sinal ruim). */
export function itemScore(value: number, reverso: boolean): number {
  return reverso ? 100 - valueToScore(value) : valueToScore(value)
}

export type CulturaRespostas = Record<string, number | null> // itemId -> 1..5 ou null (NS/NA)

export type CulturaDimensaoScore = {
  id: string
  nome: string
  score: number | null // null = sem base suficiente
  itensValidos: number
  semBase: boolean
}

/** Calcula a nota 0–100 de cada dimensão (NS/NA = null, descartado; reversos invertidos). */
export function computeDimensionScores(respostas: CulturaRespostas): CulturaDimensaoScore[] {
  return CULTURA_DIMENSOES.map((dim) => {
    const notas = dim.itens
      .map((it) => {
        const v = respostas[it.id]
        return typeof v === 'number' ? itemScore(v, it.reverso) : null
      })
      .filter((s): s is number => s !== null)
    const itensValidos = notas.length
    if (itensValidos < CULTURA_PISO_ITENS_DIMENSAO) {
      return { id: dim.id, nome: dim.nome, score: null, itensValidos, semBase: true }
    }
    const media = notas.reduce((a, s) => a + s, 0) / itensValidos
    return { id: dim.id, nome: dim.nome, score: Math.round(media), itensValidos, semBase: false }
  })
}

/** Índice geral: média simples dos índices das dimensões com base suficiente (PASSO 4). */
export function computeOverall(scores: CulturaDimensaoScore[]): number | null {
  const validas = scores.filter((s) => !s.semBase && s.score !== null)
  if (validas.length === 0) return null
  const soma = validas.reduce((a, s) => a + (s.score as number), 0)
  return Math.round(soma / validas.length)
}

/**
 * Teste de consistência por respondente (PASSO 6): em cada dimensão compara a
 * média dos itens positivos com a nota CRUA do item invertido. Se a pessoa
 * concorda com o positivo E também com o oposto, é incoerente. Retorna true se
 * o questionário for considerado inconsistente.
 */
export function isInconsistente(respostas: CulturaRespostas): boolean {
  for (const dim of CULTURA_DIMENSOES) {
    const reverso = dim.itens.find((i) => i.reverso)
    if (!reverso) continue
    const rawReverso = respostas[reverso.id]
    if (typeof rawReverso !== 'number') continue
    const positivos = dim.itens
      .filter((i) => !i.reverso)
      .map((i) => respostas[i.id])
      .filter((v): v is number => typeof v === 'number')
    if (positivos.length === 0) continue
    const mediaPos = positivos.reduce((a, v) => a + v, 0) / positivos.length
    // Concordou com positivo (>=4) E concordou com o oposto/crítico (>=4) = incoerente.
    if (mediaPos >= 4 && rawReverso >= 4) return true
  }
  return false
}

export function faixaDe(score: number): CulturaFaixa | undefined {
  return CULTURA_INTERPRETACAO.find((f) => score >= f.min && score <= f.max)
}

export const CULTURA_TODOS_ITENS: CulturaItem[] = CULTURA_DIMENSOES.flatMap((d) => d.itens)
export const CULTURA_ITENS_CRITICOS: CulturaItem[] = CULTURA_TODOS_ITENS.filter((i) => i.critico)
