// Fallback rule-based: gera PDI estruturado sem usar LLM.
// Usado quando NVIDIA NIM falhar (timeout, key inválida, free tier esgotado).
// Output: PdiReport válido seguindo a mesma interface da geração LLM.

import {
  DISC_STRATEGIES,
  NIVEIS_LIDER,
  FERRAMENTAS,
  selectRelevantLiteraturas,
} from './pdi-knowledge'
import type { PdiReport, PdiConvergenciaPoint, PdiFase, PdiReferencia } from './pdi-types'
import type { AnalyzerOutput } from './pdi-analyzer'

export function buildRuleBasedPdi(
  analyzer: AnalyzerOutput,
  context: { nomeCompleto: string; empresa?: string | null },
): PdiReport {
  const discStrat = DISC_STRATEGIES[analyzer.discPrimary]
  const nivelAtual = NIVEIS_LIDER[analyzer.nivelAtual]
  const nivelAlvo = NIVEIS_LIDER[analyzer.nivelAlvo]

  // ───── CONVERGÊNCIA ─────
  const convergencia = {
    resumo: `Você se classifica como "${nivelAtual.nome}" e o objetivo dos próximos 90 dias é evoluir para "${nivelAlvo.nome}". O gargalo principal identificado é: ${analyzer.gargaloPrincipal}.`,
    pontos: [
      {
        analise: 'Nível Atual',
        percepcaoPessoal: nivelAtual.nome,
        percepcaoExterna: 'Função exige nível imediatamente superior',
        convergencia: 'Média',
        comentario:
          'Há espaço para evolução. O PDI foi desenhado para acelerar essa transição.',
      },
      {
        analise: 'Perfil DISC dominante',
        percepcaoPessoal: discStrat.nome,
        percepcaoExterna: 'Pontos fortes naturais + riscos comportamentais identificados',
        convergencia: 'Alta',
        comentario: `Tendência natural: ${discStrat.pontosFortes[0]?.toLowerCase()}. Cuidado com: ${discStrat.riscos[0]?.toLowerCase()}.`,
      },
      {
        analise: 'Top gap a desenvolver',
        percepcaoPessoal: analyzer.topGaps[0]?.label ?? 'a definir',
        percepcaoExterna: 'Competência crítica para o próximo nível',
        convergencia: 'Alta',
        comentario:
          'Este é o ponto de maior alavancagem no curto prazo.',
      },
    ] as PdiConvergenciaPoint[],
  }

  // ───── FASE 1 — Organização e fundação (1-30 dias) ─────
  const fase1Ferramentas = discStrat.ferramentasRecomendadas.slice(0, 2)
  const fase1: PdiFase = {
    numero: 1,
    titulo: 'Fase 1: Fundação e Organização',
    periodo: 'Dias 1-30',
    objetivo: `Estruturar rotina, reduzir sobrecarga e atacar o gargalo principal (${analyzer.gargaloPrincipal}).`,
    acoes: fase1Ferramentas.map((id) => {
      const f = FERRAMENTAS[id]
      return {
        descricao: `Implementar ${f.sigla} (${f.nome})`,
        ferramentaId: id,
        comoExecutar: f.exemploAplicacao,
      }
    }),
    kpiSucesso: `Reduzir em 25% o tempo gasto em tarefas operacionais reativas. Identificar 1 backup direto para sua função.`,
  }

  // ───── FASE 2 — Desenvolvimento de equipe (31-60 dias) ─────
  const fase2: PdiFase = {
    numero: 2,
    titulo: 'Fase 2: Desenvolvimento de Equipe e Sucessão',
    periodo: 'Dias 31-60',
    objetivo: 'Formar equipe autônoma e iniciar plano de sucessão.',
    acoes: [
      {
        descricao: 'Mapear equipe com 9Box (Desempenho × Potencial)',
        ferramentaId: '9box',
        comoExecutar:
          'Reservar 1h no fim do mês para classificar cada liderado. Os 2-3 de alto potencial recebem investimento dedicado.',
      },
      {
        descricao: 'Implementar 1:1 quinzenais com método GROW',
        ferramentaId: 'grow',
        comoExecutar:
          'Reuniões de 30 minutos seguindo Goal-Reality-Options-Will. Sair com 1 ação clara assumida pelo liderado.',
      },
    ],
    kpiSucesso: `Pelo menos 2 liderados executando processos que antes dependiam apenas de você. Pelo menos 6 feedbacks SBI aplicados.`,
  }

  // ───── FASE 3 — Gestão estratégica (61-90 dias) ─────
  const fase3: PdiFase = {
    numero: 3,
    titulo: 'Fase 3: Gestão por Indicadores',
    periodo: 'Dias 61-90',
    objetivo: 'Atuar de forma preventiva e estratégica, antecipando problemas via dados.',
    acoes: [
      {
        descricao: 'Estabelecer dashboard de KPIs diários',
        ferramentaId: 'pdca',
        comoExecutar:
          'Definir 3-5 KPIs operacionais críticos. Leitura matinal de 10 minutos. Desvio detectado vira ciclo PDCA.',
      },
      {
        descricao: 'Aplicar PDCA em pelo menos 1 processo gargalo',
        ferramentaId: 'pdca',
        comoExecutar:
          'Escolher o processo que mais gera retrabalho. Rodar Plan-Do-Check-Act ciclo completo em 30 dias.',
      },
    ],
    kpiSucesso: `Indicador operacional escolhido com evolução positiva mensurável. Operação rodando 2 dias sem sua intervenção direta.`,
  }

  // ───── PRÓXIMOS PASSOS ─────
  const proximosPassos = [
    {
      titulo: 'Feedback SBI Semanal',
      descricao:
        'Aplicar a técnica SBI (Situação-Behavior-Impacto) em pelo menos 1 conversa por semana — positiva ou corretiva.',
    },
    {
      titulo: 'Ritual de Planejamento',
      descricao:
        'Reservar segunda-feira de manhã (ou sexta à tarde) exclusivamente para planejamento estratégico da semana.',
    },
  ]

  // ───── NOTA CRÍTICA ─────
  const notaCritica = `O maior risco identificado é que a sobrecarga operacional + ausência de plano estruturado pode gerar desmotivação e estresse acumulado. Sem execução deste PDI, o cenário tende a piorar nos próximos 6 meses. A retenção do seu talento e a evolução da operação dependem da execução dos primeiros 30 dias.`

  // ───── REFERÊNCIAS BIBLIOGRÁFICAS ─────
  const ferramentaIdsUsadas = [fase1, fase2, fase3].flatMap((f) =>
    f.acoes.map((a) => a.ferramentaId),
  )
  const literaturasRelevantes = selectRelevantLiteraturas({
    discPrimary: analyzer.discPrimary,
    ferramentaIds: ferramentaIdsUsadas,
    moduloIds: [],
    nivelAtual: analyzer.nivelAtual,
    nivelAlvo: analyzer.nivelAlvo,
    limit: 4,
  })
  const referencias: PdiReferencia[] = literaturasRelevantes.map((lit) => ({
    literaturaId: lit.id,
    porQueLer: lit.aplicacaoLidera,
  }))

  return {
    convergencia,
    fases: [fase1, fase2, fase3],
    proximosPassos,
    notaCritica,
    classificacao: {
      atual: analyzer.nivelAtual,
      alvo90Dias: analyzer.nivelAlvo,
    },
    referencias,
    meta: {
      generatedAt: new Date().toISOString(),
      provider: 'rule-based-fallback',
      version: '1.0',
    },
  }
}
