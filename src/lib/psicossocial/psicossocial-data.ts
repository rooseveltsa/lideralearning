// Instrumento: Indicadores Psicossociais no Trabalho (NR-1 / ISO 45003).
// ANÔNIMO, com recorte por SETOR e TURNO. Gerado a partir de
// docs/formularios/instrumentos.json (objeto key="psicossocial").
// Fonte de verdade do conteúdo, da escala e da pontuação DE RISCO.
//
// SCORING DE RISCO (NOTA ALTA = MAIS RISCO):
// - Escala única de FREQUÊNCIA de 5 pontos (Nunca…Sempre).
// - Item de RISCO: score = valueToScore(v)        (Nunca=0 risco … Sempre=100).
// - Item POSITIVO: score = 100 - valueToScore(v)  (Sempre proteção = baixo risco).
// - Nota da dimensão = média dos itens (0–100). Overall = média simples das
//   dimensões (peso igual), para um fator carregado não esconder os outros.
// - PARTE 2 (itens críticos): NÃO entra na média. Qualquer resposta diferente de
//   "Nunca" (>= Raramente, valor >= 2) nos últimos 12 meses dispara ALERTA.

export type PsicossocialItem = {
  id: string
  texto: string
  risco: boolean // true = item de risco; false = item positivo (invertido no scoring)
}

export type PsicossocialDimensao = {
  id: string
  nome: string
  descricao: string
  itens: PsicossocialItem[]
}

export type PsicossocialCritico = {
  id: string
  texto: string
  relato: boolean // tem campo de relato livre opcional
}

export type PsicossocialFaixa = { min: number; max: number; rotulo: string; acao: string }

// Escala de FREQUÊNCIA (índice 0 = valor 1 … índice 4 = valor 5).
export const PSICOSSOCIAL_ESCALA: string[] = [
  'Nunca',
  'Raramente',
  'Às vezes',
  'Quase sempre',
  'Sempre',
]

export const PSICOSSOCIAL_NS_NA = 'Não sei / Não se aplica'

// Setores padrão (editável). "Outro" libera campo livre no formulário.
export const PSICOSSOCIAL_SETORES: string[] = [
  'Produção',
  'Manutenção',
  'Logística',
  'Qualidade',
  'Administrativo / Apoio',
  'Comercial',
  'Outro',
]

// Turnos padrão (recorte de risco, sem identificar a pessoa).
export const PSICOSSOCIAL_TURNOS: string[] = [
  'Manhã',
  'Tarde',
  'Noite',
  'Comercial / Administrativo',
  'Turno único',
]

// Privacidade: só divulgar célula setor×turno com este mínimo de respostas.
export const PSICOSSOCIAL_MIN_CELULA = 5

// Parte 2 — qualquer resposta >= este valor (Raramente) dispara alerta crítico.
export const PSICOSSOCIAL_GATILHO_CRITICO = 2

// Texto de LGPD/sigilo exibido no topo da página pública (dado sensível).
export const PSICOSSOCIAL_ANONIMATO =
  'Totalmente ANÔNIMO. Não pedimos nome, matrícula, CPF nem crachá. Coletamos apenas o seu ' +
  'SETOR e TURNO para permitir o recorte de risco. O resultado só é divulgado por grupo com 5 ' +
  'ou mais respostas — se o seu grupo for menor, ele é juntado a outro maior antes de qualquer ' +
  'divulgação, para que ninguém seja identificado. As respostas sobre saúde mental, assédio, ' +
  'violência e discriminação são DADO PESSOAL SENSÍVEL (LGPD, Lei 13.709/2018), tratadas de ' +
  'forma agregada e sigilosa (RH / SESMT / segurança do trabalho), usadas apenas para gestão de ' +
  'risco psicossocial (NR-1 / GRO / PGR) — NUNCA para avaliar, punir, demitir ou expor pessoas. ' +
  'Os relatos livres da Parte 2 são opcionais e lidos só por profissional de saúde/segurança, ' +
  'sob sigilo. Esta pesquisa não avalia você e não é canal de denúncia individual.'

export const PSICOSSOCIAL_PARTE2_NOME =
  'Situações graves (assédio, violência, discriminação e saúde)'

export const PSICOSSOCIAL_PARTE2_DESCRICAO =
  'Pense nos ÚLTIMOS 12 MESES. Aqui qualquer resposta diferente de "Nunca" já é levada a sério e ' +
  'aciona encaminhamento, com sigilo — porque mesmo um único episódio precisa ser tratado. O ' +
  'campo de relato livre é opcional e lido apenas por profissional de saúde/segurança.'

export const PSICOSSOCIAL_RELATO_PLACEHOLDER = 'Se quiser, conte o que aconteceu — opcional.'

export const PSICOSSOCIAL_DIMENSOES: PsicossocialDimensao[] = [
  {
    id: 'd1',
    nome: 'Carga e ritmo de trabalho',
    descricao:
      'Quanto a quantidade de tarefas, a velocidade exigida e o tempo disponível pressionam o trabalhador. Fator de demanda/carga e ritmo (NR-1 e ISO 45003).',
    itens: [
      { id: 'd1_i1', texto: 'Tenho que trabalhar muito rápido para dar conta do que me pedem.', risco: true },
      { id: 'd1_i2', texto: 'A quantidade de tarefas que me passam é maior do que dá para fazer no tempo que tenho.', risco: true },
      { id: 'd1_i3', texto: 'Consigo fazer pausas quando preciso durante o turno.', risco: false },
      { id: 'd1_i4', texto: 'Termino o turno sem precisar levar TAREFA de trabalho para casa.', risco: false },
      { id: 'd1_i5', texto: 'Termino o turno sem ficar com a cabeça presa em PREOCUPAÇÃO do trabalho.', risco: false },
      { id: 'd1_i6', texto: 'Trabalho sob pressão de meta ou de tempo o dia inteiro.', risco: true },
    ],
  },
  {
    id: 'd2',
    nome: 'Controle e autonomia sobre o trabalho',
    descricao:
      'O quanto a pessoa pode decidir como fazer, em que ordem e em que ritmo. Fator de controle/autonomia (NR-1 e ISO 45003).',
    itens: [
      { id: 'd2_i1', texto: 'Posso decidir a melhor maneira de fazer o meu serviço.', risco: false },
      { id: 'd2_i2', texto: 'Tenho voz para opinar sobre mudanças que afetam o meu trabalho.', risco: false },
      { id: 'd2_i3', texto: 'A ordem das minhas tarefas é decidida por outra pessoa, sem me consultar.', risco: true },
      { id: 'd2_i4', texto: 'Posso ajustar meu ritmo quando o serviço aperta.', risco: false },
    ],
  },
  {
    id: 'd3',
    nome: 'Apoio da chefia',
    descricao:
      'Se o líder direto orienta, ajuda em dificuldades e dá retorno com respeito. Fator de apoio da chefia/liderança (NR-1 e ISO 45003).',
    itens: [
      { id: 'd3_i1', texto: 'Quando tenho um problema no trabalho, meu líder me ajuda a resolver.', risco: false },
      { id: 'd3_i2', texto: 'Meu líder me orienta com clareza sobre o que precisa ser feito.', risco: false },
      { id: 'd3_i3', texto: 'Meu líder me trata com respeito.', risco: false },
      { id: 'd3_i4', texto: 'Quando erro, meu líder me corrige sem me humilhar.', risco: false },
      { id: 'd3_i5', texto: 'Quando tenho uma dificuldade, meu líder dá atenção ao que eu preciso.', risco: false },
    ],
  },
  {
    id: 'd4',
    nome: 'Apoio dos colegas',
    descricao:
      'Se a equipe coopera e ampara quem precisa. Fator de apoio social entre pares (NR-1 e ISO 45003).',
    itens: [
      { id: 'd4_i1', texto: 'Meus colegas me ajudam quando o serviço aperta.', risco: false },
      { id: 'd4_i2', texto: 'Trabalho em um grupo onde as pessoas cooperam entre si.', risco: false },
      { id: 'd4_i3', texto: 'Posso contar com alguém da equipe quando preciso.', risco: false },
      { id: 'd4_i4', texto: 'No meu setor, quem precisa de ajuda costuma ficar sozinho.', risco: true },
    ],
  },
  {
    id: 'd5',
    nome: 'Clareza do que é esperado de mim',
    descricao:
      'Se a pessoa sabe quais são suas tarefas, responsabilidades e limites. Fator de clareza de papel (NR-1 e ISO 45003).',
    itens: [
      { id: 'd5_i1', texto: 'Sei exatamente quais são as minhas tarefas e responsabilidades.', risco: false },
      { id: 'd5_i2', texto: 'Sei o que esperam de mim no dia a dia.', risco: false },
      { id: 'd5_i3', texto: 'Recebo ordens diferentes de pessoas diferentes sobre a mesma coisa.', risco: true },
      { id: 'd5_i4', texto: 'Fico em dúvida sobre até onde vai a minha responsabilidade.', risco: true },
    ],
  },
  {
    id: 'd6',
    nome: 'Respeito e convivência',
    descricao:
      'Se há respeito no trato do dia a dia entre as pessoas do setor. Fator de relações no trabalho (NR-1 e ISO 45003). Atenção: as situações graves de assédio, violência e discriminação ficam na Parte 2 (itens críticos), com janela de 12 meses.',
    itens: [
      { id: 'd6_i1', texto: 'No meu setor as pessoas se tratam com respeito.', risco: false },
      { id: 'd6_i2', texto: 'No meu setor há gritaria, deboche ou clima pesado entre as pessoas.', risco: true },
    ],
  },
  {
    id: 'd7',
    nome: 'Ambiente físico e segurança',
    descricao:
      'Como o ambiente físico do chão de fábrica pesa na saúde e na cabeça do trabalhador: calor, ruído, esforço e sensação de risco de acidente. Fator de ambiente e exigências físicas como gerador de carga psicossocial (ISO 45003), relevante para a indústria.',
    itens: [
      { id: 'd7_i1', texto: 'O calor, o frio ou a falta de ventilação no meu posto me atrapalham para trabalhar.', risco: true },
      { id: 'd7_i2', texto: 'O barulho no meu setor é tão alto que me cansa ou atrapalha.', risco: true },
      { id: 'd7_i3', texto: 'O esforço físico do meu trabalho (peso, posição, repetição) me deixa dolorido ou esgotado.', risco: true },
      { id: 'd7_i4', texto: 'Sinto que posso me acidentar no meu trabalho.', risco: true },
      { id: 'd7_i5', texto: 'Tenho os equipamentos e as condições de segurança que preciso para trabalhar protegido.', risco: false },
    ],
  },
  {
    id: 'd8',
    nome: 'Mudanças no trabalho',
    descricao:
      'Se as mudanças (turno, função, máquina, equipe, regras) são avisadas e explicadas a tempo. Fator de gestão de mudanças (NR-1 e ISO 45003).',
    itens: [
      { id: 'd8_i1', texto: 'Quando vai mudar algo no meu trabalho, sou avisado com antecedência.', risco: false },
      { id: 'd8_i2', texto: 'As mudanças no meu setor são explicadas de um jeito que eu entendo.', risco: false },
      { id: 'd8_i3', texto: 'As mudanças aqui chegam de repente, sem ninguém avisar.', risco: true },
    ],
  },
  {
    id: 'd9',
    nome: 'Segurança no emprego',
    descricao:
      'Se a pessoa sente firmeza ou medo quanto a continuar no emprego e ganhar o suficiente. Fator de insegurança no trabalho (job insecurity) tratado como fator próprio na ISO 45003.',
    itens: [
      { id: 'd9_i1', texto: 'Sinto firmeza de que vou continuar no meu emprego.', risco: false },
      { id: 'd9_i2', texto: 'Vivo com medo de perder o meu emprego.', risco: true },
      { id: 'd9_i3', texto: 'Fico inseguro sobre o futuro do meu trabalho.', risco: true },
    ],
  },
  {
    id: 'd10',
    nome: 'Reconhecimento e recompensa',
    descricao:
      'Se o esforço é reconhecido e se a pessoa sente que recebe um retorno justo pelo que faz. Fator de reconhecimento e recompensa (NR-1 e ISO 45003).',
    itens: [
      { id: 'd10_i1', texto: 'Meu esforço é reconhecido por quem é meu superior.', risco: false },
      { id: 'd10_i2', texto: 'Sinto que recebo um tratamento justo pelo trabalho que faço.', risco: false },
      { id: 'd10_i3', texto: 'Me esforço bastante e meu trabalho passa sem ninguém valorizar.', risco: true },
      { id: 'd10_i4', texto: 'Quando faço um bom trabalho, alguém percebe e reconhece.', risco: false },
    ],
  },
  {
    id: 'd11',
    nome: 'Trabalho e vida pessoal',
    descricao:
      'Se a jornada, horas extras e cobranças invadem o descanso e a família. Fator de interface trabalho-vida (NR-1 e ISO 45003).',
    itens: [
      { id: 'd11_i1', texto: 'Minha jornada me deixa tempo de sobra para descansar e ficar com a família.', risco: false },
      { id: 'd11_i2', texto: 'Sou chamado para hora extra de última hora, sem aviso.', risco: true },
      { id: 'd11_i3', texto: 'Sou cobrado fora do horário de trabalho por mensagem ou ligação.', risco: true },
      { id: 'd11_i4', texto: 'O trabalho atrapalha a minha vida fora dele.', risco: true },
      { id: 'd11_i5', texto: 'Consigo desligar do trabalho quando vou para casa.', risco: false },
    ],
  },
  {
    id: 'd12',
    nome: 'Desgaste emocional do trabalho',
    descricao:
      'Se a tarefa exige segurar emoção e lidar com situações pesadas. Fator de demanda emocional (NR-1 e ISO 45003). Os sinais de adoecimento ficam na Parte 2 (item crítico).',
    itens: [
      { id: 'd12_i1', texto: 'Meu trabalho me deixa esgotado emocionalmente.', risco: true },
      { id: 'd12_i2', texto: 'Tenho que esconder o que sinto ou aguentar calado para fazer meu serviço.', risco: true },
      { id: 'd12_i3', texto: 'Lido com situações tensas ou pesadas no trabalho.', risco: true },
    ],
  },
]

// Parte 2 — itens críticos (janela de 12 meses). Tratados em bloco separado.
export const PSICOSSOCIAL_CRITICOS: PsicossocialCritico[] = [
  { id: 'c_i1', texto: 'Nos últimos 12 meses, fui xingado, humilhado ou ofendido por alguém no trabalho.', relato: true },
  { id: 'c_i2', texto: 'Nos últimos 12 meses, sofri ameaça, agressão ou violência dentro do trabalho.', relato: true },
  { id: 'c_i3', texto: 'Nos últimos 12 meses, recebi cantada, toque ou proposta de cunho sexual sem querer no trabalho.', relato: true },
  { id: 'c_i4', texto: 'Nos últimos 12 meses, fui tratado de forma diferente ou pior por causa de quem eu sou (cor, sexo, idade, religião, origem ou outra característica).', relato: true },
  { id: 'c_i5', texto: 'Nos últimos 12 meses, vi um colega ser maltratado, humilhado ou assediado no trabalho.', relato: true },
  { id: 'c_i6', texto: 'Nos últimos meses, ando mais ANSIOSO ou tenso por causa do trabalho.', relato: false },
  { id: 'c_i7', texto: 'Nos últimos meses, ando DORMINDO MAL por causa do trabalho.', relato: false },
  { id: 'c_i8', texto: 'Nos últimos meses, ando SEM ÂNIMO ou para baixo por causa do trabalho.', relato: false },
  { id: 'c_i9', texto: 'Já pensei que este trabalho está me adoecendo.', relato: true },
]

// Faixas de RISCO (0–100, MAIOR = PIOR). Derivadas das faixas em média 1–5 do JSON:
// 1,0–2,4 = baixo  → 0–34 ; 2,5–3,4 = médio → 35–59 ; 3,5–5,0 = alto → 60–100.
export const PSICOSSOCIAL_INTERPRETACAO: PsicossocialFaixa[] = [
  {
    min: 0,
    max: 34,
    rotulo: 'Risco baixo',
    acao:
      'Situação sob controle. Manter o que está funcionando, registrar no PGR como risco monitorado e reavaliar no próximo ciclo. Hierarquia de controle NR-1: manter as medidas de proteção que já existem.',
  },
  {
    min: 35,
    max: 59,
    rotulo: 'Risco médio (atenção)',
    acao:
      'Ponto de pressão a tratar. Investigar a causa com a equipe do setor, definir ação preventiva no PGR com responsável e prazo, e reavaliar em até 90 dias. Hierarquia de controle NR-1: agir na ORGANIZAÇÃO DO TRABALHO (rever metas, ritmo, escala, fluxo, papéis, ambiente físico) antes de tentar só "treinar a pessoa para aguentar".',
  },
  {
    min: 60,
    max: 100,
    rotulo: 'Risco alto (prioridade)',
    acao:
      'Risco psicossocial relevante. Entra como prioridade no PGR com plano de ação imediato e acompanhamento do SESMT/medicina do trabalho. Hierarquia de controle NR-1: ELIMINAR ou reduzir a fonte na origem (carga, ritmo, jornada, liderança, ambiente físico) — medidas coletivas e organizacionais primeiro; medidas individuais entram como complemento, não como solução única.',
  },
]

// ── Pontuação de RISCO (0–100), NS/NA descartado, piso de itens válidos ──

export const PSICOSSOCIAL_PISO_ITENS_DIMENSAO = 3

/** Converte resposta de frequência 1–5 em nível de risco 0–100 (item de risco). */
export function valueToScore(v: number): number {
  return Math.round(((v - 1) / 4) * 100)
}

/** Nível de risco 0–100 de UM item, já invertendo os itens positivos. */
export function itemRiskScore(value: number, risco: boolean): number {
  const base = valueToScore(value)
  return risco ? base : 100 - base
}

export type PsicossocialRespostas = Record<string, number | null> // itemId -> 1..5 ou null (NS/NA)

export type PsicossocialDimensaoScore = {
  id: string
  nome: string
  score: number | null // null = sem base suficiente (NÍVEL DE RISCO; maior = pior)
  itensValidos: number
  semBase: boolean
}

/** Calcula o NÍVEL DE RISCO 0–100 de cada dimensão (NS/NA = null, descartado). */
export function computeDimensionScores(
  respostas: PsicossocialRespostas,
): PsicossocialDimensaoScore[] {
  return PSICOSSOCIAL_DIMENSOES.map((dim) => {
    const scores = dim.itens
      .map((it) => {
        const v = respostas[it.id]
        return typeof v === 'number' ? itemRiskScore(v, it.risco) : null
      })
      .filter((s): s is number => typeof s === 'number')
    const itensValidos = scores.length
    if (itensValidos < PSICOSSOCIAL_PISO_ITENS_DIMENSAO) {
      return { id: dim.id, nome: dim.nome, score: null, itensValidos, semBase: true }
    }
    const media = scores.reduce((a, s) => a + s, 0) / itensValidos
    return { id: dim.id, nome: dim.nome, score: Math.round(media), itensValidos, semBase: false }
  })
}

/** Índice geral de risco: média SIMPLES das dimensões com base (cada uma pesa igual). */
export function computeOverall(scores: PsicossocialDimensaoScore[]): number | null {
  const validas = scores.filter((s) => !s.semBase && s.score !== null)
  if (validas.length === 0) return null
  const soma = validas.reduce((a, s) => a + (s.score as number), 0)
  return Math.round(soma / validas.length)
}

export type PsicossocialCriticoResposta = {
  value: number | null // 1..5 ou null (NS/NA)
  relato?: string
}
export type PsicossocialCriticosMap = Record<string, PsicossocialCriticoResposta>

/** Um item crítico dispara quando respondido com algo >= "Raramente" (valor >= 2). */
export function criticoDisparado(value: number | null | undefined): boolean {
  return typeof value === 'number' && value >= PSICOSSOCIAL_GATILHO_CRITICO
}

export function faixaDe(score: number): PsicossocialFaixa | undefined {
  return PSICOSSOCIAL_INTERPRETACAO.find((f) => score >= f.min && score <= f.max)
}

export const PSICOSSOCIAL_TODOS_ITENS: PsicossocialItem[] = PSICOSSOCIAL_DIMENSOES.flatMap(
  (d) => d.itens,
)
