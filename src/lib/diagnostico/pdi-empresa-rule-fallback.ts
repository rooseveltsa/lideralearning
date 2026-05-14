// Fallback rule-based: gera PDI empresarial estruturado sem LLM.
// Tom: executivo, terceira pessoa, voltado pro gestor.

import { DISC_STRATEGIES, NIVEIS_LIDER, FERRAMENTAS } from './pdi-knowledge'
import type { PdiReport, PdiConvergenciaPoint, PdiFase } from './pdi-types'
import type { EmpresaAnalyzerOutput } from './pdi-empresa-analyzer'

export function buildRuleBasedPdiEmpresa(
  analyzer: EmpresaAnalyzerOutput,
  context: { empresa: string; supervisorNome: string; gestorNome: string },
): PdiReport {
  const discStrat = DISC_STRATEGIES[analyzer.discPrimary]
  const nivelAtual = NIVEIS_LIDER[analyzer.nivelAtual]
  const nivelAlvo = NIVEIS_LIDER[analyzer.nivelAlvo]

  // ───── CONVERGÊNCIA ─────
  const convergencia = {
    resumo: `${context.supervisorNome} se enquadra hoje no perfil "${nivelAtual.nome}". A empresa precisa que ele evolua para "${nivelAlvo.nome}" em 90 dias. Gargalo principal: ${analyzer.gargaloPrincipal}.`,
    pontos: [
      {
        analise: 'Função atual vs. esperada',
        percepcaoPessoal: nivelAtual.nome,
        percepcaoExterna: `A empresa espera ${nivelAlvo.nome}`,
        convergencia: 'Média',
        comentario:
          'Há um gap claro a ser fechado. Sem plano estruturado, a evolução natural não acontece.',
      } as PdiConvergenciaPoint,
      {
        analise: 'Top competência esperada',
        percepcaoPessoal: 'Em desenvolvimento',
        percepcaoExterna:
          analyzer.topCompetenciasEsperadas[0]?.label ?? 'a definir',
        convergencia: 'Alta',
        comentario:
          'Esta é a competência de maior alavancagem para o ROI esperado pela empresa.',
      } as PdiConvergenciaPoint,
      {
        analise: 'Desafio crítico atual',
        percepcaoPessoal: `Operação enfrenta: ${analyzer.topDesafiosCriticos[0]?.label ?? 'não identificado'}`,
        percepcaoExterna: 'Resolução depende do desenvolvimento da liderança',
        convergencia: 'Alta',
        comentario:
          'Este é o ponto onde o desenvolvimento gera impacto imediato em indicadores operacionais.',
      } as PdiConvergenciaPoint,
    ],
  }

  // ───── FASE 1 — Estruturação e organização (1-30 dias) ─────
  const fase1Ferramentas = discStrat.ferramentasRecomendadas.slice(0, 2)
  const fase1: PdiFase = {
    numero: 1,
    titulo: 'Fase 1: Estruturação Operacional',
    periodo: 'Dias 1-30',
    objetivo: `Atacar o gargalo "${analyzer.gargaloPrincipal}" e estruturar rotina executiva mínima do supervisor.`,
    acoes: fase1Ferramentas.map((id) => {
      const f = FERRAMENTAS[id]
      return {
        descricao: `Supervisor implementa ${f.sigla} sob acompanhamento do gestor`,
        ferramentaId: id,
        comoExecutar: `${f.exemploAplicacao} Gestor cobra evidência semanalmente em 1:1.`,
      }
    }),
    kpiSucesso: `Redução de 25% nas horas dedicadas a tarefas operacionais reativas. Supervisor com agenda estruturada e indicadores operacionais visíveis ao gestor.`,
  }

  // ───── FASE 2 — Desenvolvimento da equipe (31-60 dias) ─────
  const fase2: PdiFase = {
    numero: 2,
    titulo: 'Fase 2: Formação de Equipe e Sucessão',
    periodo: 'Dias 31-60',
    objetivo:
      'Reduzir dependência da empresa em uma única pessoa. Iniciar formação de backups e melhorar clima.',
    acoes: [
      {
        descricao: 'Supervisor mapeia equipe com 9Box e identifica sucessores',
        ferramentaId: '9box',
        comoExecutar:
          'Reunião mensal com gestor para revisar 9Box. Os top 2-3 potenciais recebem responsabilidades crescentes nas próximas 4 semanas.',
      },
      {
        descricao: 'Implementar 1:1 quinzenal com método GROW com cada liderado',
        ferramentaId: 'grow',
        comoExecutar:
          'Supervisor faz 1:1 de 30 min com cada direto. Gestor audita 1 dessas reuniões por mês para calibrar a aplicação do método.',
      },
    ],
    kpiSucesso: `Pelo menos 2 backups treinados em processos antes dependentes apenas do supervisor. Redução mensurável em turnover ou aumento em retenção da equipe.`,
  }

  // ───── FASE 3 — Gestão por indicadores (61-90 dias) ─────
  const fase3: PdiFase = {
    numero: 3,
    titulo: 'Fase 3: Gestão por Indicadores e Estratégia',
    periodo: 'Dias 61-90',
    objetivo:
      'Supervisor passa a antecipar problemas via dados, conectando comportamento com resultado operacional.',
    acoes: [
      {
        descricao: 'Implementar dashboard de KPIs operacionais diários',
        ferramentaId: 'pdca',
        comoExecutar:
          'Supervisor define 3-5 KPIs (turnover, retrabalho, produtividade). Leitura matinal de 10 min. Desvio detectado vira ciclo PDCA com prazo definido.',
      },
      {
        descricao: 'Aplicar PDCA em pelo menos 1 processo gargalo da operação',
        ferramentaId: 'pdca',
        comoExecutar:
          'Gestor + supervisor escolhem juntos o processo. Rodar Plan-Do-Check-Act em 30 dias. Apresentação executiva do resultado ao final.',
      },
    ],
    kpiSucesso: `Indicador operacional crítico escolhido com evolução positiva mensurável. Operação rodando sem dependência diária do supervisor para decisões táticas.`,
  }

  // ───── PRÓXIMOS PASSOS ─────
  const proximosPassos = [
    {
      titulo: 'Feedback SBI semanal (do gestor para o supervisor)',
      descricao:
        'Gestor aplica técnica Situação-Comportamento-Impacto em 1 conversa semanal com o supervisor — positiva ou corretiva. Modelo a ser replicado pelo supervisor com sua equipe.',
    },
    {
      titulo: 'Ritual de planejamento conjunto',
      descricao:
        'Segunda-feira de manhã (30 min): supervisor apresenta plano da semana ao gestor com base no que está em "Importante + Não Urgente" da Matriz de Eisenhower.',
    },
    {
      titulo: 'Revisão executiva de fase',
      descricao:
        'Ao final de cada fase de 30 dias, gestor e supervisor revisam KPIs e ajustam plano se necessário. Documentação curta (1 página).',
    },
  ]

  // ───── NOTA CRÍTICA ─────
  const notaCritica = `Para a ${context.empresa}, o risco principal de não executar este plano é duplo: (1) ${context.supervisorNome.split(' ')[0]} pode entrar em saturação operacional, gerando desmotivação e risco de saída (perda de talento e custo de reposição); (2) a operação continua dependente de uma única pessoa, gerando gargalo crônico e impacto direto nos indicadores de turnover, retrabalho e segurança. A execução das primeiras 4 semanas é o ponto de inflexão.`

  return {
    convergencia,
    fases: [fase1, fase2, fase3],
    proximosPassos,
    notaCritica,
    classificacao: {
      atual: analyzer.nivelAtual,
      alvo90Dias: analyzer.nivelAlvo,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      provider: 'rule-based-fallback',
      version: '1.0',
    },
  }
}
