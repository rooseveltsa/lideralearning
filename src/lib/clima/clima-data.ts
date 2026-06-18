// Instrumento: Pesquisa de Clima Organizacional (anônimo + setor).
// Gerado a partir de docs/formularios/instrumentos.json (revisão multi-agente).
// Fonte de verdade do conteúdo do formulário, da escala e da pontuação.

export type ClimaScaleType = 'concordancia' | 'frequencia'

export type ClimaItem = {
  id: string
  texto: string
  scale: ClimaScaleType
  critico: boolean
}

export type ClimaDimensao = {
  id: string
  nome: string
  descricao: string
  itens: ClimaItem[]
}

export type ClimaFaixa = { min: number; max: number; rotulo: string; acao: string }

// Rótulos da escala (índice 0 = valor 1 … índice 4 = valor 5).
export const CLIMA_ESCALA: Record<ClimaScaleType, string[]> = {
  concordancia: [
    'Discordo totalmente',
    'Discordo em parte',
    'Mais ou menos / Neutro',
    'Concordo em parte',
    'Concordo totalmente',
  ],
  frequencia: ['Nunca', 'Raramente', 'Às vezes', 'Quase sempre', 'Sempre'],
}

export const CLIMA_NS_NA = 'Não sei / Não se aplica'

// Setores padrão (editável). "Outro" libera campo livre no formulário.
export const CLIMA_SETORES: string[] = [
  'Produção',
  'Manutenção',
  'Logística',
  'Qualidade',
  'Administrativo / Apoio',
  'Comercial',
  'Outro',
]

export const CLIMA_PERGUNTAS_ABERTAS: { id: string; texto: string }[] = [
  { id: 'motiva', texto: 'O que mais te motiva a trabalhar aqui?' },
  { id: 'mudaria', texto: 'Se você pudesse mudar UMA coisa no seu setor ou na empresa, o que mudaria?' },
]

export const CLIMA_ENPS_PERGUNTA =
  'De 0 a 10, o quanto você recomendaria esta empresa para um amigo ou parente vir trabalhar?'

// Privacidade: só divulgar resultado de setor com este mínimo de respostas.
export const CLIMA_MIN_CELULA = 5

// Limiar de alerta no nível do item (média < 50 = predominam respostas 1 e 2).
export const CLIMA_LIMIAR_ALERTA = 50

export const CLIMA_DIMENSOES: ClimaDimensao[] = [
  {
    "id": "d1",
    "nome": "Liderança e gestão imediata",
    "descricao": "Como a pessoa percebe o chefe direto (supervisor/encarregado): se orienta, dá exemplo, é justo e está presente no dia a dia. É o coração de uma pesquisa de clima na operação.",
    "itens": [
      {
        "id": "d1_i1",
        "texto": "Meu líder direto deixa claro o que ele espera do meu trabalho.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i2",
        "texto": "Meu líder trata todo mundo da equipe com respeito.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i3",
        "texto": "Quando tenho um problema no trabalho, meu líder me ajuda a resolver.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i4",
        "texto": "Meu líder faz o que cobra da gente (dá o exemplo).",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i5",
        "texto": "Meu líder cobra de si mesmo o que cobra da equipe.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i6",
        "texto": "Meu líder é justo nas decisões, sem proteger uns e perseguir outros.",
        "scale": "concordancia",
        "critico": true
      },
      {
        "id": "d1_i7",
        "texto": "Confio nas decisões que meu líder toma.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d1_i8",
        "texto": "Meu líder está presente no dia a dia quando a equipe precisa.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d2",
    "nome": "Comunicação",
    "descricao": "Se as informações chegam, são claras e na hora certa, e se há espaço para tirar dúvida sem ruído nem boato.",
    "itens": [
      {
        "id": "d2_i1",
        "texto": "Recebo as informações que preciso para fazer meu trabalho direito.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i2",
        "texto": "As mudanças no setor são explicadas de forma clara.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i3",
        "texto": "As mudanças no setor são avisadas com antecedência (a tempo).",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i4",
        "texto": "Quando tenho uma dúvida sobre o trabalho, sei a quem perguntar.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i5",
        "texto": "As reuniões e os avisos do dia a dia são fáceis de entender.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i6",
        "texto": "As reuniões e os avisos do dia a dia são úteis para o meu trabalho.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d2_i7",
        "texto": "Aqui as informações importantes são ditas de forma aberta pela liderança.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d3",
    "nome": "Reconhecimento e valorização",
    "descricao": "Se o esforço é notado, se o feedback existe e se a pessoa sente que o trabalho dela tem valor.",
    "itens": [
      {
        "id": "d3_i1",
        "texto": "Quando faço um bom trabalho, alguém reconhece.",
        "scale": "frequencia",
        "critico": false
      },
      {
        "id": "d3_i2",
        "texto": "Sinto que meu trabalho é importante para o resultado da empresa.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d3_i3",
        "texto": "Recebo retorno (feedback) sobre como estou indo no trabalho.",
        "scale": "frequencia",
        "critico": false
      },
      {
        "id": "d3_i4",
        "texto": "Quando recebo feedback, ele não vem só quando erro — também vem quando acerto.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d3_i5",
        "texto": "O reconhecimento aqui é pelo que a pessoa faz, não por amizade.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d3_i6",
        "texto": "Sinto que sou tratado como gente, não como número.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d4",
    "nome": "Remuneração e benefícios",
    "descricao": "Se a pessoa entende como é paga, se considera o pagamento justo pelo que faz e se os benefícios atendem — fator de higiene clássico, sentido na operação.",
    "itens": [
      {
        "id": "d4_i1",
        "texto": "Entendo como meu salário e meus adicionais são calculados.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d4_i2",
        "texto": "Considero meu pagamento justo pelo trabalho que faço.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d4_i3",
        "texto": "Os benefícios da empresa (ex.: transporte, refeição, plano) atendem minhas necessidades básicas.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d4_i4",
        "texto": "Recebo o que me é devido em dia e sem erro.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d5",
    "nome": "Relacionamento e trabalho em equipe",
    "descricao": "Se a equipe se ajuda, se há respeito entre colegas e se o clima entre as pessoas é bom.",
    "itens": [
      {
        "id": "d5_i1",
        "texto": "No meu setor, os colegas se ajudam quando o trabalho aperta.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d5_i2",
        "texto": "Existe respeito entre os colegas do meu setor.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d5_i3",
        "texto": "Quando alguém erra, o time ajuda a corrigir.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d5_i4",
        "texto": "No meu setor, o erro de um colega não vira motivo de zoação ou humilhação.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d5_i5",
        "texto": "Me sinto parte da equipe.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d5_i6",
        "texto": "Os setores que dependem um do outro trabalham bem juntos.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d6",
    "nome": "Desenvolvimento e carreira",
    "descricao": "Se a pessoa aprende, é treinada e enxerga chance de crescer ali dentro.",
    "itens": [
      {
        "id": "d6_i1",
        "texto": "Recebo treinamento suficiente para fazer meu trabalho com segurança.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d6_i2",
        "texto": "Aprendo coisas novas no meu trabalho.",
        "scale": "frequencia",
        "critico": false
      },
      {
        "id": "d6_i3",
        "texto": "Vejo chance de crescer aqui dentro se eu me esforçar.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d6_i4",
        "texto": "Quem tem vontade de aprender encontra apoio aqui.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d6_i5",
        "texto": "Sei o que preciso melhorar para chegar onde quero na empresa.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d7",
    "nome": "Orgulho e pertencimento",
    "descricao": "Se a pessoa tem orgulho de onde trabalha, recomendaria a empresa e pretende ficar.",
    "itens": [
      {
        "id": "d7_i1",
        "texto": "Tenho orgulho de trabalhar nesta empresa.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d7_i2",
        "texto": "Recomendaria esta empresa para um amigo ou parente vir trabalhar.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d7_i3",
        "texto": "Os valores da empresa combinam com os meus.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d7_i4",
        "texto": "Pretendo continuar trabalhando aqui no próximo ano.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d7_i5",
        "texto": "Me dedico à empresa porque quero, não só por obrigação.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  },
  {
    "id": "d8",
    "nome": "Segurança psicológica",
    "descricao": "Se a pessoa pode falar a verdade, apontar problema, errar e discordar sem medo de retaliação. Dimensão crítica: clima em que o medo cala esconde problema.",
    "itens": [
      {
        "id": "d8_i1",
        "texto": "Posso falar o que penso aqui sem medo de ser prejudicado depois.",
        "scale": "concordancia",
        "critico": true
      },
      {
        "id": "d8_i2",
        "texto": "Quando vejo um problema ou um risco, me sinto à vontade para avisar.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d8_i3",
        "texto": "Posso discordar do meu líder sem ser punido por isso.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d8_i4",
        "texto": "Quando erro e aviso, sou ajudado a corrigir, em vez de só ser punido.",
        "scale": "concordancia",
        "critico": false
      },
      {
        "id": "d8_i5",
        "texto": "Acredito que esta pesquisa é mesmo anônima.",
        "scale": "concordancia",
        "critico": true
      },
      {
        "id": "d8_i6",
        "texto": "Acredito que o resultado desta pesquisa vai ser levado a sério pela empresa.",
        "scale": "concordancia",
        "critico": false
      }
    ]
  }
]

export const CLIMA_INTERPRETACAO: ClimaFaixa[] = [
  {
    "min": 0,
    "max": 49,
    "rotulo": "Crítico (vermelho)",
    "acao": "Sinal de alerta. Algo está prejudicando o time de verdade. Ação: o gestor, junto com o RH (e SESMT/CIPA quando o tema for segurança, jornada ou assédio), deve conversar com a equipe (roda de conversa ou pequenos grupos) para entender o que está por trás da nota, montar um plano de 2 ou 3 ações concretas com prazo e dono, e dar retorno ao time em até 30 dias. Priorizar dimensões críticas como Segurança psicológica, Respeito/assédio, Condições de trabalho e Jornada. Toda dimensão ou item crítico nesta faixa deve virar entrada no gerenciamento de riscos psicossociais (PGR/GRO)."
  },
  {
    "min": 50,
    "max": 64,
    "rotulo": "Atenção (amarelo)",
    "acao": "O básico existe, mas tem problema rondando. Ação: o gestor escolhe os 2 itens de menor nota da dimensão e ataca eles primeiro, com uma melhoria visível em 60 dias. Combinar com o time o que vai mudar e cobrar acompanhamento na próxima pesquisa."
  },
  {
    "min": 65,
    "max": 79,
    "rotulo": "Saudável (verde)",
    "acao": "Clima bom, no caminho certo. Ação: manter o que funciona, reconhecer publicamente os pontos fortes do time e cuidar para não deixar cair. Buscar pequenos ajustes nos itens medianos para subir de faixa."
  },
  {
    "min": 80,
    "max": 100,
    "rotulo": "Excelente (verde escuro)",
    "acao": "Time engajado e ambiente forte. Ação: descobrir o que esse setor faz de certo e usar como exemplo (boas práticas) para os outros setores. Manter o líder e o time motivados, reconhecer e celebrar."
  }
]

// ── Pontuação (0–100), NS/NA descartado, piso de 3 itens válidos por dimensão ──

export const CLIMA_PISO_ITENS_DIMENSAO = 3

/** Converte resposta 1–5 em nota 0–100. NS/NA deve ser passado como null e é descartado fora daqui. */
export function valueToScore(v: number): number {
  return Math.round(((v - 1) / 4) * 100)
}

export type ClimaRespostas = Record<string, number | null> // itemId -> 1..5 ou null (NS/NA)

export type ClimaDimensaoScore = {
  id: string
  nome: string
  score: number | null // null = sem base suficiente
  itensValidos: number
  semBase: boolean
}

/** Calcula a nota 0–100 de cada dimensão a partir das respostas (NS/NA = null, descartado). */
export function computeDimensionScores(respostas: ClimaRespostas): ClimaDimensaoScore[] {
  return CLIMA_DIMENSOES.map((dim) => {
    const valores = dim.itens
      .map((it) => respostas[it.id])
      .filter((v): v is number => typeof v === 'number')
    const itensValidos = valores.length
    if (itensValidos < CLIMA_PISO_ITENS_DIMENSAO) {
      return { id: dim.id, nome: dim.nome, score: null, itensValidos, semBase: true }
    }
    const media = valores.reduce((a, v) => a + valueToScore(v), 0) / itensValidos
    return { id: dim.id, nome: dim.nome, score: Math.round(media), itensValidos, semBase: false }
  })
}

/** Nota geral: média das dimensões com base, ponderada pelo nº de itens válidos. */
export function computeOverall(scores: ClimaDimensaoScore[]): number | null {
  const validas = scores.filter((s) => !s.semBase && s.score !== null)
  if (validas.length === 0) return null
  const somaPeso = validas.reduce((a, s) => a + s.itensValidos, 0)
  const soma = validas.reduce((a, s) => a + (s.score as number) * s.itensValidos, 0)
  return Math.round(soma / somaPeso)
}

/** eNPS de uma lista de notas 0–10: %promotores(9-10) − %detratores(0-6). */
export function computeEnps(notas: number[]): number | null {
  if (notas.length === 0) return null
  const prom = notas.filter((n) => n >= 9).length
  const det = notas.filter((n) => n <= 6).length
  return Math.round(((prom - det) / notas.length) * 100)
}

export function faixaDe(score: number): ClimaFaixa | undefined {
  return CLIMA_INTERPRETACAO.find((f) => score >= f.min && score <= f.max)
}

export const CLIMA_TODOS_ITENS: ClimaItem[] = CLIMA_DIMENSOES.flatMap((d) => d.itens)
export const CLIMA_ITENS_CRITICOS: ClimaItem[] = CLIMA_TODOS_ITENS.filter((i) => i.critico)
