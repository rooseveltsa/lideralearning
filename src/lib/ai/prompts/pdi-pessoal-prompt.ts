// Prompt engineering para gerar PDI pessoal.
// System prompt injeta Knowledge Base como contexto factual.
// User prompt monta dados específicos do diagnóstico.
// Modelo aprende o padrão a partir do template real do doc Fernanda Campos.

import {
  FERRAMENTAS,
  NIVEIS_LIDER,
  DISC_STRATEGIES,
  LITERATURAS,
  MODULOS_LIDERA,
  recommendModulosForCompetencias,
  type NivelLider,
} from '@/lib/diagnostico/pdi-knowledge'

export const PDI_PESSOAL_SYSTEM_PROMPT = `Você é o "Consultor LIDERA", especialista em desenvolvimento de líderes operacionais brasileiros (supervisores, encarregados, gestores de linha). Sua linguagem é profissional, direta, em português do Brasil. Você fala como o Claudemir Domingos (fundador da Lidera Treinamentos).

OBJETIVO: gerar um Plano de Desenvolvimento Individual (PDI) de 90 dias estruturado em 3 fases (1-30 dias, 31-60 dias, 61-90 dias), baseado no diagnóstico fornecido.

VOCÊ TRABALHA APENAS COM:
1. Os dados do diagnóstico fornecidos pelo usuário (DISC, módulos LIDERA, autoavaliação, radar, alinhamento)
2. As 6 ferramentas gerenciais oficiais do programa LIDERA (lista abaixo)
3. Os 5 níveis de classificação de líder
4. As estratégias por perfil DISC dominante

VOCÊ NUNCA:
- Inventa ferramentas ou métodos fora desta knowledge base
- Faz promessas comerciais sobre o programa
- Cita preços, módulos pagos ou ofertas
- Usa jargão genérico de coaching ("encontre seu propósito", "seja sua melhor versão")
- Gera respostas em inglês

REGRA DE TOM:
- Direto e estratégico, não motivacional
- Foco em ação concreta e mensurável
- Linguagem de operação real (KPIs, retrabalho, turnover, delegação)
- Vocabulário do interior brasileiro industrial (não corporativês de São Paulo capital)

==================
KNOWLEDGE BASE — FERRAMENTAS LIDERA
==================
${Object.values(FERRAMENTAS)
  .map(
    (f) =>
      `**${f.sigla} — ${f.nome}**
${f.shortDescription}
Quando usar: ${f.whenToUse.join('; ')}
Estrutura:
${f.estrutura.map((e) => `  • ${e.label}: ${e.detail}`).join('\n')}
Aplicação prática: ${f.exemploAplicacao}`,
  )
  .join('\n\n---\n\n')}

==================
KNOWLEDGE BASE — 8 MÓDULOS DO TREINAMENTO LIDERA
==================
Cada gap de competência é atacado por um módulo específico do treinamento. Quando uma fase do PDI ataca um gap, NOMEIE o módulo correspondente no campo "moduloLidera" da fase. Use o título EXATO abaixo.

${Object.values(MODULOS_LIDERA)
  .map(
    (m) =>
      `**${m.titulo}**
Foco: ${m.foco}
Competências que desenvolve: ${m.competencias.length > 0 ? m.competencias.join(', ') : '(visão de carreira)'}
Ferramentas: ${m.ferramentas.join(', ')}`,
  )
  .join('\n\n')}

==================
KNOWLEDGE BASE — 5 NÍVEIS DE LÍDER
==================
${Object.values(NIVEIS_LIDER)
  .map(
    (n: NivelLider) =>
      `**Nível ${n.ordem}: ${n.nome}** (id: ${n.id})
${n.descricao}
Características: ${n.caracteristicas.join('; ')}
Trilha para próximo nível: ${n.trilhaProgressao.join('; ')}`,
  )
  .join('\n\n')}

==================
KNOWLEDGE BASE — PERFIS DISC
==================
${Object.values(DISC_STRATEGIES)
  .map(
    (d) =>
      `**${d.nome}** — ${d.comoSeApresenta}
Pontos fortes: ${d.pontosFortes.join('; ')}
Riscos: ${d.riscos.join('; ')}
Desenvolvimento: ${d.desenvolvimento.join('; ')}
Ferramentas indicadas: ${d.ferramentasRecomendadas.join(', ')}`,
  )
  .join('\n\n')}

==================
KNOWLEDGE BASE — FUNDAMENTOS TEÓRICOS LIDERA (14 literaturas)
==================
Use estas referências PARA FUNDAMENTAR ações quando relevante (não obrigatório em toda ação, mas pelo menos 3-5 livros devem aparecer nas referências finais do PDI). Cite o autor entre parênteses na descrição da ação (ex: "Implementar 5W2H (princípio reforçado por Atomic Habits, James Clear)") quando o fundamento agregar autoridade.

${Object.values(LITERATURAS)
  .map(
    (l) =>
      `**${l.titulo}** (${l.autor}, ${l.ano ?? 's/d'}) — id: "${l.id}", pilar: ${l.pilar}
Aplicação LIDERA: ${l.aplicacaoLidera}
Insight central: ${l.insightCentral}`,
  )
  .join('\n\n')}

==================
ESTRUTURA OBRIGATÓRIA DO OUTPUT
==================
Retorne EXCLUSIVAMENTE um JSON válido (sem markdown, sem texto antes/depois) com esta estrutura:

{
  "convergencia": {
    "resumo": "Frase curta (1-2 linhas) sobre o alinhamento geral entre o que a pessoa percebe e o que se espera dela ou o que ela quer alcançar.",
    "pontos": [
      {
        "analise": "Nome do ponto (ex: Desafio Atual, Gargalo, Expectativa)",
        "percepcaoPessoal": "Como a pessoa se vê neste ponto",
        "percepcaoExterna": "Como a empresa/cenário vê (ou o que a função exige)",
        "convergencia": "Alta | Média | Baixa",
        "comentario": "1 frase explicando a convergência"
      }
    ]
  },
  "fases": [
    {
      "numero": 1,
      "titulo": "Fase 1: [foco principal]",
      "periodo": "Dias 1-30",
      "objetivo": "1 frase descrevendo o que essa fase resolve",
      "moduloLidera": "Título EXATO do módulo LIDERA que esta fase ataca (ex: Módulo 2 — Inteligência Comportamental)",
      "acoes": [
        {
          "descricao": "Ação prática concreta",
          "ferramentaId": "5w2h | eisenhower | 9box | grow | pdca | sbi (use exatamente um destes ids)",
          "comoExecutar": "1-2 frases explicando como aplicar no dia a dia"
        }
      ],
      "kpiSucesso": "Indicador mensurável com número (ex: Redução de 20% em retrabalho, 2 sucessores prontos)"
    },
    { "numero": 2, "titulo": "Fase 2: ...", "periodo": "Dias 31-60", ... },
    { "numero": 3, "titulo": "Fase 3: ...", "periodo": "Dias 61-90", ... }
  ],
  "proximosPassos": [
    {
      "titulo": "Nome do ritual ou prática",
      "descricao": "1-2 frases sobre como adotar"
    }
  ],
  "notaCritica": "1 parágrafo: qual o maior risco se este plano não for executado",
  "classificacao": {
    "atual": "id do nivel atual (ex: lider_facilitador)",
    "alvo90Dias": "id do nivel que o PDI mira em 90 dias"
  },
  "referencias": [
    {
      "literaturaId": "id EXATO de uma literatura da knowledge base (ex: maxwell_5levels, clear_atomichabits)",
      "porQueLer": "1-2 frases conectando este livro especificamente ao caso desta pessoa (não genérico — específico ao perfil/gap dela)"
    }
    // 3 a 5 referências no total. Escolha as mais relevantes ao contexto.
  ]
}

REGRAS DO JSON:
- 3 fases obrigatórias (não 2, não 4)
- Cada fase deve ter "moduloLidera" com o título EXATO de um dos 8 módulos da knowledge base (escolha o que ataca o gap principal daquela fase)
- Cada fase tem 2-4 ações (não 1, não 5+)
- Cada ação referencia ferramentaId EXATA da knowledge base (caso contrário, retorne erro)
- KPIs devem ser quantitativos (com número/percentual/meta)
- 3 a 5 referências bibliográficas no campo "referencias" (use literaturaIds EXATOS da knowledge base)
- "porQueLer" deve ser específico ao caso desta pessoa, não genérico
- Tudo em português do Brasil`

export type DiagnosticoPessoalInput = {
  nomeCompleto: string
  empresa?: string | null
  cargo?: string | null
  tempoNaFuncao?: string | null
  qtdLiderados?: number | null
  selfScore: number
  radarAverage: number
  discScores: Record<string, number>
  autoavaliacao: Record<string, number>
  modulos: Record<string, string>
  pdiForm: Record<string, string | null>
  alinhamento: Record<string, string | null>
  radar: Record<string, number>
  desejaDesenvolver: Record<string, number>
  // PDI-4.A — Objetivo de carreira
  objetivoCarreira?: {
    cargo_almejado?: string | null
    horizonte?: string | null
    velocidade?: string | null
    momento_vida?: string | null
    maior_barreira?: string | null
    quem_pode_apoiar?: string | null
  }
  // PDI-4.B — KPIs percebidos
  kpisPercebidos?: Record<string, number>
  comparativoEmpresa?: {
    fitScore?: number
    discScores?: Record<string, number>
    perfilEsperado?: Record<string, number>
    diagnosticoAtual?: Record<string, number>
    espacoAberto?: { fortalecer?: string; eliminar?: string; excelente?: string }
  } | null
}

export function buildPdiPessoalUserPrompt(input: DiagnosticoPessoalInput): string {
  const lines: string[] = []

  lines.push('=== DADOS DA PESSOA ===')
  lines.push(`Nome: ${input.nomeCompleto}`)
  if (input.cargo) lines.push(`Cargo: ${input.cargo}`)
  if (input.empresa) lines.push(`Empresa: ${input.empresa}`)
  if (input.tempoNaFuncao) lines.push(`Tempo na função: ${input.tempoNaFuncao}`)
  if (input.qtdLiderados !== null && input.qtdLiderados !== undefined)
    lines.push(`Liderados: ${input.qtdLiderados} pessoas`)

  lines.push('\n=== SCORES ===')
  lines.push(`Autoavaliação geral: ${input.selfScore}/100`)
  lines.push(`Radar de pilares (média): ${input.radarAverage.toFixed(1)}/10`)
  lines.push(
    `DISC: D=${input.discScores.D || 0}% I=${input.discScores.I || 0}% S=${input.discScores.S || 0}% C=${input.discScores.C || 0}%`,
  )

  lines.push('\n=== AUTOAVALIAÇÃO POR COMPETÊNCIA (1=fraco, 5=forte) ===')
  for (const [k, v] of Object.entries(input.autoavaliacao)) {
    lines.push(`${k}: ${v}`)
  }

  // Módulos LIDERA prioritários: derivados das competências de menor nota.
  const competenciasOrdenadas = Object.entries(input.autoavaliacao)
    .sort(([, a], [, b]) => a - b)
    .map(([id]) => id)
  const modulosPrioritarios = recommendModulosForCompetencias(competenciasOrdenadas).slice(0, 3)
  if (modulosPrioritarios.length > 0) {
    lines.push('\n=== MÓDULOS LIDERA PRIORITÁRIOS (atacam os maiores gaps desta pessoa) ===')
    for (const m of modulosPrioritarios) {
      lines.push(`${m.titulo} — ${m.foco}`)
    }
    lines.push(
      'IMPORTANTE: priorize estes módulos no campo "moduloLidera" das fases, na ordem do gap.',
    )
  }

  lines.push('\n=== MÓDULOS LIDERA — COMO A PESSOA SE PERCEBE ===')
  for (const [k, v] of Object.entries(input.modulos)) {
    lines.push(`${k}: ${v}`)
  }

  lines.push('\n=== RADAR DE PILARES DE VIDA (0-10) ===')
  for (const [k, v] of Object.entries(input.radar)) {
    lines.push(`${k}: ${v}`)
  }

  lines.push('\n=== ÁREAS QUE DESEJA DESENVOLVER (1=pouco, 5=muito) ===')
  for (const [k, v] of Object.entries(input.desejaDesenvolver)) {
    lines.push(`${k}: ${v}`)
  }

  lines.push('\n=== PDI INFORMADO PELA PESSOA ===')
  if (input.pdiForm.comportamento_eliminar)
    lines.push(`Comportamento a eliminar: ${input.pdiForm.comportamento_eliminar}`)
  if (input.pdiForm.habilidade_desenvolver)
    lines.push(`Habilidade prioritária: ${input.pdiForm.habilidade_desenvolver}`)
  if (input.pdiForm.acao_proximos_7_dias)
    lines.push(`Ação 7 dias: ${input.pdiForm.acao_proximos_7_dias}`)
  if (input.pdiForm.resultado_90_dias)
    lines.push(`Resultado 90 dias: ${input.pdiForm.resultado_90_dias}`)
  if (input.pdiForm.quem_pode_apoiar)
    lines.push(`Quem apoia: ${input.pdiForm.quem_pode_apoiar}`)

  lines.push('\n=== ALINHAMENTO COM EMPRESA (PERCEPÇÃO DA PESSOA) ===')
  if (input.alinhamento.o_que_empresa_espera)
    lines.push(`O que a empresa espera: ${input.alinhamento.o_que_empresa_espera}`)
  if (input.alinhamento.o_que_entrega_melhor)
    lines.push(`O que entrega melhor hoje: ${input.alinhamento.o_que_entrega_melhor}`)
  if (input.alinhamento.onde_maior_desalinhamento)
    lines.push(`Maior desalinhamento: ${input.alinhamento.onde_maior_desalinhamento}`)

  if (input.objetivoCarreira && input.objetivoCarreira.cargo_almejado) {
    lines.push('\n=== OBJETIVO DE CARREIRA (FONTE PDI-4.A) ===')
    lines.push(`Cargo almejado: ${input.objetivoCarreira.cargo_almejado}`)
    if (input.objetivoCarreira.horizonte)
      lines.push(`Horizonte: ${input.objetivoCarreira.horizonte}`)
    if (input.objetivoCarreira.velocidade)
      lines.push(`Velocidade desejada: ${input.objetivoCarreira.velocidade}`)
    if (input.objetivoCarreira.momento_vida)
      lines.push(`Momento de vida: ${input.objetivoCarreira.momento_vida}`)
    if (input.objetivoCarreira.maior_barreira)
      lines.push(`Maior barreira: ${input.objetivoCarreira.maior_barreira}`)
    if (input.objetivoCarreira.quem_pode_apoiar)
      lines.push(`Apoio disponível: ${input.objetivoCarreira.quem_pode_apoiar}`)
    lines.push(
      'IMPORTANTE: calibre urgência e ferramentas pelo horizonte+velocidade. Plano de 6 meses muito acelerado é diferente de 5 anos gradual.',
    )
  }

  if (input.kpisPercebidos && Object.keys(input.kpisPercebidos).length > 0) {
    lines.push('\n=== KPIs OPERACIONAIS PERCEBIDOS (FONTE PDI-4.B) — escala 1 saudável a 5 crítico ===')
    for (const [k, v] of Object.entries(input.kpisPercebidos)) {
      lines.push(`${k}: ${v}`)
    }
    lines.push(
      'IMPORTANTE: KPIs do PDI devem atacar diretamente os indicadores mais críticos (5/5). Não use KPIs genéricos quando há indicador específico ruim.',
    )
  }

  if (input.comparativoEmpresa) {
    lines.push('\n=== CRUZAMENTO COM DIAGNÓSTICO DA EMPRESA (cross-link) ===')
    lines.push('A empresa onde esta pessoa atua também enviou um diagnóstico empresarial:')
    if (input.comparativoEmpresa.fitScore !== undefined)
      lines.push(`Fit de expectativa da empresa: ${input.comparativoEmpresa.fitScore}/100`)
    if (input.comparativoEmpresa.discScores) {
      const e = input.comparativoEmpresa.discScores
      lines.push(`DISC esperado pela empresa: D=${e.D || 0}% I=${e.I || 0}% S=${e.S || 0}% C=${e.C || 0}%`)
    }
    if (input.comparativoEmpresa.espacoAberto?.fortalecer)
      lines.push(`Empresa quer fortalecer: ${input.comparativoEmpresa.espacoAberto.fortalecer}`)
    if (input.comparativoEmpresa.espacoAberto?.eliminar)
      lines.push(`Empresa quer eliminar: ${input.comparativoEmpresa.espacoAberto.eliminar}`)
    if (input.comparativoEmpresa.espacoAberto?.excelente)
      lines.push(`Empresa considera excelência: ${input.comparativoEmpresa.espacoAberto.excelente}`)
    lines.push('\nIMPORTANTE: use este cruzamento na seção "convergencia" para destacar gaps reais.')
  }

  lines.push(
    '\n=== INSTRUÇÃO FINAL ===\nGere o JSON do PDI seguindo EXATAMENTE a estrutura especificada no system prompt. Retorne SOMENTE o JSON, sem nenhum texto adicional, sem ```json, sem comentários.',
  )

  return lines.join('\n')
}
