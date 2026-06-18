// Instrumento: Diagnóstico de Necessidade de Formação de Supervisores (DNFS-LIDERA) — v2.
// IDENTIFICADO (não anônimo) + consentimento LGPD obrigatório.
// Gerado a partir de docs/formularios/instrumentos.json (key 'formacao').
// Fonte de verdade do conteúdo, da escala (competência × prioridade) e da pontuação.
//
// As 8 dimensões = os 8 MÓDULOS LIDERA. Os ids (m1..m8) estão alinhados a
// src/lib/diagnostico/pdi-knowledge/modulos-lidera.ts (MODULOS_LIDERA): o Top 3
// ranqueado aqui alimenta o motor de PDI de treinamento já existente.

export type FormacaoItem = {
  id: string
  texto: string
  // Item reverso: descreve um comportamento ruim; a nota de competência é
  // invertida no cálculo (nota_corrigida = 6 − nota_respondida).
  reverso: boolean
}

export type FormacaoModulo = {
  // Chave estável m1..m8 (alinhada a MODULOS_LIDERA).
  id: string
  numero: number
  // Título completo do módulo (ex.: "Módulo 1 — Função Estratégica").
  titulo: string
  // Rótulo curto exibido no formulário (ex.: "M1 — Função Estratégica do Supervisor").
  rotulo: string
  descricao: string
  itens: FormacaoItem[]
}

// ── Escala de 5 pontos, dois eixos por item (régua sempre visível) ──

// EIXO A (competência): frequência com que o líder faz o comportamento hoje.
export const FORMACAO_ESCALA_COMPETENCIA: string[] = [
  'Nunca ou quase nunca',
  'Poucas vezes',
  'Às vezes (mais ou menos na metade)',
  'Quase sempre',
  'Sempre ou quase sempre',
]

// EIXO B (prioridade): urgência de melhorar, com referência de tempo concreta.
export const FORMACAO_ESCALA_PRIORIDADE: string[] = [
  'Não precisa melhorar nisso agora',
  'Pode melhorar, mas dá para deixar para depois',
  'Bom melhorar este ano',
  'Precisa entrar na formação deste semestre',
  'Precisa começar a melhorar já, nas próximas semanas',
]

// Filtro por módulo (fora da régua): "não sei fazer (nunca aprendi)".
export const FORMACAO_FILTRO_LABEL =
  'Nesse assunto, você diria que NÃO SABE fazer (nunca aprendeu)?'

// Texto de abertura obrigatório do instrumento (antes da primeira pergunta).
export const FORMACAO_ABERTURA =
  'Aqui não tem certo ou errado e isso não é prova nem avaliação do seu desempenho. ' +
  'Quanto mais sincero você for, melhor vai ser o seu plano de treinamento. Suas respostas ' +
  'vão direto para montar a sua trilha de formação com a Lidera. ATENÇÃO (leia antes de ' +
  'responder): algumas respostas sobre segurança e conduta (por exemplo, regras de segurança ' +
  'e respeito com a equipe) podem ser repassadas ao seu RH ou ao consultor da Lidera, porque ' +
  'envolvem o cuidado com você e com a equipe. O objetivo nunca é punir, e sim apoiar e proteger.'

// Bloco LGPD — itens informativos exibidos antes do consentimento.
export const FORMACAO_LGPD: string[] = [
  'Finalidade: suas respostas serão usadas só para montar e acompanhar o seu plano de desenvolvimento (trilha de treinamento) com a Lidera Treinamentos e a sua empresa.',
  'Quais dados: nome, e-mail/matrícula, empresa/unidade, setor, suas respostas e o que você escrever nas perguntas abertas.',
  'Quem vê: a Lidera Treinamentos (consultor responsável) e as pessoas autorizadas do RH/gestão da sua empresa.',
  'Base legal: tratamento para execução do programa de desenvolvimento contratado pela sua empresa e, no que se aplicar, mediante o seu consentimento (LGPD, Lei 13.709/2018).',
  'Por quanto tempo: seus dados ficam guardados durante o programa e por até 24 meses após a última formação, para comparar a sua evolução; depois disso são apagados ou anonimizados.',
  'Seus direitos: você pode pedir para ver, corrigir ou apagar seus dados, e tirar dúvidas, pelo contato da Lidera Treinamentos.',
]

export const FORMACAO_CONSENTIMENTO_LABEL =
  'Li e concordo que minhas respostas sejam usadas para montar o meu plano de desenvolvimento, conforme explicado acima.'

// Opções dos campos de contexto (não pontuam).
export const FORMACAO_TEMPO_FUNCAO: string[] = [
  'Menos de 1 ano',
  '1 a 3 anos',
  '3 a 5 anos',
  'Mais de 5 anos',
]

export const FORMACAO_QTD_LIDERADOS: string[] = ['1 a 5', '6 a 15', '16 a 30', 'Mais de 30']

export const FORMACAO_PERGUNTAS_ABERTAS: { id: string; texto: string }[] = [
  { id: 'desafio', texto: 'Qual é o seu maior desafio como líder hoje? (escreva com suas palavras)' },
  { id: 'aprender', texto: 'O que você mais quer aprender ou melhorar como supervisor?' },
  {
    id: 'situacao',
    texto:
      'Tem alguma situação difícil com a equipe que você gostaria de saber lidar melhor? (opcional) — Aviso: se você relatar algo grave (conflito sério, risco à segurança ou denúncia), isso será encaminhado ao consultor da Lidera ou ao RH antes de seguir com a trilha automática, para te apoiar.',
  },
]

export const FORMACAO_MODULOS: FormacaoModulo[] = [
  {
    id: 'm1',
    numero: 1,
    titulo: 'Módulo 1 — Função Estratégica',
    rotulo: 'M1 — Função Estratégica do Supervisor',
    descricao:
      'O supervisor enxerga o papel além de "tocar a produção": mostra à equipe como o trabalho do turno ajuda a bater a meta, organiza prioridades, planeja em vez de só apagar incêndio e decide com foco em resultado.',
    itens: [
      { id: 'm1_i1', texto: 'Eu mostro para a equipe como o trabalho do nosso turno ajuda a bater a meta da fábrica.', reverso: false },
      { id: 'm1_i2', texto: 'Antes de a equipe começar, eu já deixei claro o que é mais importante fazer primeiro.', reverso: false },
      { id: 'm1_i3', texto: 'Quando aparece um problema, eu decido pensando no resultado, e não só em apagar o fogo.', reverso: false },
      { id: 'm1_i4', texto: 'Eu explico para a equipe o porquê das tarefas, não só o que tem que fazer.', reverso: false },
      { id: 'm1_i5', texto: 'Eu só consigo trabalhar reagindo ao que aparece na hora; quase nunca consigo planejar a semana.', reverso: true },
    ],
  },
  {
    id: 'm2',
    numero: 2,
    titulo: 'Módulo 2 — Inteligência Comportamental',
    rotulo: 'M2 — Inteligência Comportamental',
    descricao:
      'Como o líder lida com gente: controla o próprio nervoso, dá feedback com respeito, conversa o assunto difícil sem briga e escuta antes de cobrar.',
    itens: [
      { id: 'm2_i1', texto: 'Eu mantenho a calma quando a pressão aumenta no chão de fábrica.', reverso: false },
      { id: 'm2_i2', texto: 'Eu dou feedback para a pessoa de forma respeitosa.', reverso: false },
      { id: 'm2_i3', texto: 'Eu escuto o lado do colaborador antes de cobrar.', reverso: false },
      { id: 'm2_i4', texto: 'Eu consigo conversar um assunto difícil com a pessoa sem virar briga.', reverso: false },
      { id: 'm2_i5', texto: 'Quando me irrito, acabo levantando a voz ou falando algo que magoa a equipe.', reverso: true },
    ],
  },
  {
    id: 'm3',
    numero: 3,
    titulo: 'Módulo 3 — Ética e Responsabilidade',
    rotulo: 'M3 — Ética e Responsabilidade',
    descricao:
      'O líder dá o exemplo: cumpre regra e segurança, é justo com todos, assume os próprios erros e corrige o que está errado.',
    itens: [
      { id: 'm3_i1', texto: 'Eu cumpro as regras de segurança no meu trabalho.', reverso: false },
      { id: 'm3_i2', texto: 'Eu trato todo mundo da equipe com o mesmo critério, sem panelinha.', reverso: false },
      { id: 'm3_i3', texto: 'Eu assumo quando erro, em vez de jogar a culpa nos outros.', reverso: false },
      { id: 'm3_i4', texto: 'Eu corrijo o que está errado mesmo quando dá trabalho.', reverso: false },
      { id: 'm3_i5', texto: 'Quando estou com pressa para entregar, acabo deixando passar alguma regra de segurança.', reverso: true },
    ],
  },
  {
    id: 'm4',
    numero: 4,
    titulo: 'Módulo 4 — Gestão Geracional',
    rotulo: 'M4 — Gestão Geracional',
    descricao:
      'Liderar gente de idades e tempos de casa diferentes, ajustando o estilo sem perder o padrão.',
    itens: [
      { id: 'm4_i1', texto: 'Eu ajusto o meu jeito de falar conforme a idade de cada pessoa (mais novo, mais velho).', reverso: false },
      { id: 'm4_i2', texto: 'Eu ajusto o meu jeito de falar conforme o perfil de cada um (mais quieto, mais falante, mais experiente).', reverso: false },
      { id: 'm4_i3', texto: 'Eu aproveito a experiência dos mais antigos da equipe.', reverso: false },
      { id: 'm4_i4', texto: 'Eu dou espaço para os mais novos mostrarem o que sabem.', reverso: false },
      { id: 'm4_i5', texto: 'Eu faço a turma mais nova e a mais velha trabalharem junto e ensino quem chega.', reverso: false },
    ],
  },
  {
    id: 'm5',
    numero: 5,
    titulo: 'Módulo 5 — Desenvolvimento e Sucessão',
    rotulo: 'M5 — Desenvolvimento e Sucessão',
    descricao:
      'O líder forma gente: treina, prepara substituto, delega e acompanha o crescimento.',
    itens: [
      { id: 'm5_i1', texto: 'Eu treino minha equipe para fazer as tarefas sem depender de mim.', reverso: false },
      { id: 'm5_i2', texto: 'Eu venho preparando alguém da equipe para me substituir quando eu faltar ou sair.', reverso: false },
      { id: 'm5_i3', texto: 'Eu delego tarefas e confio no trabalho da equipe.', reverso: false },
      { id: 'm5_i4', texto: 'Eu acompanho o crescimento de cada pessoa da equipe.', reverso: false },
      { id: 'm5_i5', texto: 'Eu ensino o que sei para a equipe.', reverso: false },
    ],
  },
  {
    id: 'm6',
    numero: 6,
    titulo: 'Módulo 6 — Dados e IA',
    rotulo: 'M6 — Dados e IA no Dia a Dia',
    descricao:
      'Usar números e ferramentas para liderar melhor: acompanhar indicadores do setor e decidir com base neles, não no achismo.',
    itens: [
      { id: 'm6_i1', texto: 'Eu acompanho os números do meu setor (por exemplo: peças por hora, refugo, retrabalho, paradas de máquina).', reverso: false },
      { id: 'm6_i2', texto: "Eu uso esses números para decidir, e não só o 'achismo'.", reverso: false },
      { id: 'm6_i3', texto: 'Eu sei explicar para a equipe o que esses números estão dizendo.', reverso: false },
      { id: 'm6_i4', texto: 'Eu uso o sistema ou a planilha do setor para registrar e acompanhar a produção.', reverso: false },
      { id: 'm6_i5', texto: 'Eu estou aberto e busco aprender as ferramentas e sistemas novos que a empresa adota (incluindo IA).', reverso: false },
    ],
  },
  {
    id: 'm7',
    numero: 7,
    titulo: 'Módulo 7 — Senso de Dono',
    rotulo: 'M7 — Senso de Dono',
    descricao:
      'O líder cuida da operação: evita desperdício, resolve o problema sem empurrar, cobra qualidade e puxa melhoria.',
    itens: [
      { id: 'm7_i1', texto: 'Eu cuido dos recursos e evito desperdício no meu setor.', reverso: false },
      { id: 'm7_i2', texto: 'Eu resolvo o problema em vez de empurrar para outro setor.', reverso: false },
      { id: 'm7_i3', texto: 'Eu cobro qualidade do trabalho da minha equipe.', reverso: false },
      { id: 'm7_i4', texto: 'Eu trago ideias de melhoria sem esperar mandarem.', reverso: false },
      { id: 'm7_i5', texto: 'Quando o equipamento ou o material não é meu, eu acabo cuidando menos.', reverso: true },
    ],
  },
  {
    id: 'm8',
    numero: 8,
    titulo: 'Módulo 8 — Estratégia de Carreira',
    rotulo: 'M8 — Estratégia de Carreira',
    descricao:
      'O líder pensa no próprio futuro: sabe onde quer chegar, busca aprender, pede feedback sobre si e cuida do próprio desenvolvimento.',
    itens: [
      { id: 'm8_i1', texto: 'Eu sei onde quero chegar na minha carreira.', reverso: false },
      { id: 'm8_i2', texto: 'Eu busco aprender coisas novas por conta própria.', reverso: false },
      { id: 'm8_i3', texto: 'Eu peço feedback sobre o meu trabalho como líder.', reverso: false },
      { id: 'm8_i4', texto: 'Eu reservo tempo para cuidar do meu próprio desenvolvimento.', reverso: false },
      { id: 'm8_i5', texto: 'Eu tenho clareza dos passos que preciso dar para crescer.', reverso: false },
    ],
  },
]

export type FormacaoFaixa = { min: number; max: number; rotulo: string; acao: string }

// Faixas de interpretação por IN_norm (0–100). Limites contínuos, sem buracos.
export const FORMACAO_INTERPRETACAO: FormacaoFaixa[] = [
  {
    min: 0,
    max: 25,
    rotulo: 'Ponto forte — manter',
    acao: 'O líder já manda bem aqui ou não vê necessidade agora. Não entra na trilha prioritária; pode virar mentor da equipe nesse tema.',
  },
  {
    min: 25,
    max: 50,
    rotulo: 'Atenção — desenvolver no médio prazo',
    acao: 'Há espaço de melhoria, mas não é o mais urgente. Entra como módulo de segunda onda, depois do Top 3.',
  },
  {
    min: 50,
    max: 75,
    rotulo: 'Prioridade — desenvolver agora',
    acao: 'Lacuna importante com urgência percebida. Forte candidato ao Top 3, com ações concretas e prazo curto.',
  },
  {
    min: 75,
    max: 100,
    rotulo: 'Crítico — formar com urgência',
    acao: 'O líder reconhece que não faz e que precisa muito. Vai para o topo da trilha LIDERA e o consultor é alertado.',
  },
]

// ── Pontuação por módulo: IN = (5 − Cm) × Pm, normalizado a 0–100 ──

export type FormacaoRespostaItem = {
  // Eixo A (competência) — 1..5 ou null se em branco.
  competencia: number | null
  // Eixo B (prioridade) — 1..5 ou null se em branco.
  prioridade: number | null
}

// itemId -> { competencia, prioridade }
export type FormacaoRespostas = Record<string, FormacaoRespostaItem>
// moduloId -> "não sei fazer" marcado
export type FormacaoFiltros = Record<string, boolean>

export type FormacaoModuloScore = {
  id: string
  numero: number
  titulo: string
  cm: number | null // competência média 1..5 (reversos já corrigidos)
  pm: number | null // prioridade média 1..5
  gap: number | null // 5 − Cm (0..4)
  in: number | null // Gap × Pm (0..20)
  inNorm: number | null // (IN / 20) × 100 (0..100)
  etiqueta: 'repertorio' | 'execucao' | null // falta de repertório vs. execução
  semDados: boolean
}

const round2 = (v: number) => Math.round(v * 100) / 100
const round1 = (v: number) => Math.round(v * 10) / 10

/** Calcula Cm, Pm, Gap, IN e IN_norm de cada módulo a partir das respostas. */
export function computeModuleScores(
  respostas: FormacaoRespostas,
  filtros: FormacaoFiltros,
): FormacaoModuloScore[] {
  return FORMACAO_MODULOS.map((mod) => {
    const naoSabe = filtros[mod.id] === true

    // Eixo A — competência (reversos invertidos: 6 − nota).
    const comps: number[] = []
    const prios: number[] = []
    for (const it of mod.itens) {
      const r = respostas[it.id]
      if (r && typeof r.competencia === 'number') {
        comps.push(it.reverso ? 6 - r.competencia : r.competencia)
      }
      if (r && typeof r.prioridade === 'number') {
        prios.push(r.prioridade)
      }
    }

    // Módulo inteiro sem competência respondida e sem filtro → sem dados.
    if (comps.length === 0 && !naoSabe) {
      return {
        id: mod.id, numero: mod.numero, titulo: mod.titulo,
        cm: null, pm: null, gap: null, in: null, inNorm: null,
        etiqueta: null, semDados: true,
      }
    }

    // Filtro "não sei fazer" → competência tratada como gap máximo (Cm = 1).
    const cm = naoSabe ? 1 : round2(comps.reduce((a, v) => a + v, 0) / comps.length)
    const pm = prios.length ? round2(prios.reduce((a, v) => a + v, 0) / prios.length) : 0
    const gap = round2(5 - cm)
    const inVal = round2(gap * pm)
    const inNorm = round1((inVal / 20) * 100)

    return {
      id: mod.id, numero: mod.numero, titulo: mod.titulo,
      cm, pm, gap, in: inVal, inNorm,
      etiqueta: naoSabe ? 'repertorio' : 'execucao',
      semDados: false,
    }
  })
}

/**
 * Ranqueia os módulos do maior para o menor IN.
 * Empate: maior Gap, depois maior Pm.
 * Cenário "tudo urgente" (Pm ≥ 4 em 6+ módulos): ordena por Gap primeiro.
 * Módulos sem dados ficam por último.
 */
export function rankModules(scores: FormacaoModuloScore[]): {
  ranked: FormacaoModuloScore[]
  tudoUrgente: boolean
} {
  const comDados = scores.filter((s) => !s.semDados)
  const semDados = scores.filter((s) => s.semDados)
  const tudoUrgente = comDados.filter((s) => (s.pm ?? 0) >= 4).length >= 6

  const cmp = (a: FormacaoModuloScore, b: FormacaoModuloScore) => {
    if (tudoUrgente) {
      if ((b.gap ?? 0) !== (a.gap ?? 0)) return (b.gap ?? 0) - (a.gap ?? 0)
      if ((b.in ?? 0) !== (a.in ?? 0)) return (b.in ?? 0) - (a.in ?? 0)
    } else {
      if ((b.in ?? 0) !== (a.in ?? 0)) return (b.in ?? 0) - (a.in ?? 0)
      if ((b.gap ?? 0) !== (a.gap ?? 0)) return (b.gap ?? 0) - (a.gap ?? 0)
    }
    return (b.pm ?? 0) - (a.pm ?? 0)
  }

  return { ranked: [...comDados.sort(cmp), ...semDados], tudoUrgente }
}

/** Top 3 módulos recomendados (ids + títulos), ignorando "sem dados". */
export function topModulos(scores: FormacaoModuloScore[]): { id: string; titulo: string; inNorm: number | null }[] {
  const { ranked } = rankModules(scores)
  return ranked
    .filter((s) => !s.semDados)
    .slice(0, 3)
    .map((s) => ({ id: s.id, titulo: s.titulo, inNorm: s.inNorm }))
}

export function faixaDe(inNorm: number): FormacaoFaixa | undefined {
  return FORMACAO_INTERPRETACAO.find((f) => inNorm > f.min && inNorm <= f.max) ?? FORMACAO_INTERPRETACAO[0]
}

export const FORMACAO_TODOS_ITENS: FormacaoItem[] = FORMACAO_MODULOS.flatMap((m) => m.itens)
