// Recomendações textuais mapeadas por dimensão da autoavaliação de liderança.
// Source-of-truth do conteúdo dos top-gaps no email de resultado.

export type DimensaoId =
  | 'percepcao'
  | 'gestao'
  | 'comunicacao'
  | 'tecnologia'
  | 'etica'
  | 'dor'

export type Dimensoes = Record<DimensaoId, number>

export type TopGap = {
  id: DimensaoId
  titulo: string
  nota: number
  maxNota: number
  recomendacao: string
}

const DIMENSAO_INFO: Record<
  DimensaoId,
  { titulo: string; maxNota: number; recomendacao: string }
> = {
  percepcao: {
    titulo: 'Percepção da Função',
    maxNota: 3,
    recomendacao:
      'Pratique antecipação proativa: mapeie semanalmente os 3 riscos da operação e prepare contingências antes de apagar incêndios.',
  },
  gestao: {
    titulo: 'Gestão de Equipes',
    maxNota: 3,
    recomendacao:
      'Estruture a matriz de competência do time e use delegação por nível de autonomia — comece com 1 atividade central por semana.',
  },
  comunicacao: {
    titulo: 'Comunicação e Postura',
    maxNota: 3,
    recomendacao:
      'Adote o modelo SBI (Situação-Comportamento-Impacto) para feedbacks. Pratique 1 feedback estruturado por semana.',
  },
  tecnologia: {
    titulo: 'Tecnologia, Dados e KPIs',
    maxNota: 3,
    recomendacao:
      'Implemente acompanhamento diário de 2-3 KPIs operacionais com leitura matinal de 10 minutos — antecipa desvios sem custo extra.',
  },
  etica: {
    titulo: 'Alicerce Ético',
    maxNota: 3,
    recomendacao:
      'Defina um padrão público de conduta da equipe e cobre primeiro de si mesmo. Exemplo consistente vale mais que regra escrita.',
  },
  dor: {
    titulo: 'Clareza do Desafio',
    maxNota: 3,
    recomendacao:
      'Escreva em uma frase qual é seu maior gargalo hoje e defina 1 ação concreta para os próximos 7 dias. Clareza vence intenção.',
  },
}

export function getDimensaoInfo(id: DimensaoId) {
  return DIMENSAO_INFO[id]
}

export function getAllDimensoes(dimensoes: Dimensoes) {
  return (Object.entries(DIMENSAO_INFO) as Array<[DimensaoId, (typeof DIMENSAO_INFO)[DimensaoId]]>).map(
    ([id, info]) => ({
      id,
      titulo: info.titulo,
      nota: dimensoes[id] ?? 0,
      maxNota: info.maxNota,
      pct: Math.round(((dimensoes[id] ?? 0) / info.maxNota) * 100),
    }),
  )
}

export function computeTopGaps(dimensoes: Dimensoes, limit = 3): TopGap[] {
  return (Object.keys(DIMENSAO_INFO) as DimensaoId[])
    .map((id) => ({
      id,
      titulo: DIMENSAO_INFO[id].titulo,
      nota: dimensoes[id] ?? 0,
      maxNota: DIMENSAO_INFO[id].maxNota,
      recomendacao: DIMENSAO_INFO[id].recomendacao,
    }))
    // menor ratio (nota/maxNota) = maior gap
    .sort((a, b) => a.nota / a.maxNota - b.nota / b.maxNota)
    .slice(0, limit)
}
