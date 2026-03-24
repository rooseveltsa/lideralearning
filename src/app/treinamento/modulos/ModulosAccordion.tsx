'use client'

import { useState } from 'react'
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Lightbulb,
  Rocket,
  Shield,
  Target,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react'

type ModuleContent = {
  id: number
  title: string
  subtitle: string
  day: number
  period: string
  icon: typeof Target
  color: string
  objective: string
  takeaway: string
  concepts: { label: string; detail: string }[]
  exercises: string[]
  tool: { name: string; description: string }
}

const modules: ModuleContent[] = [
  {
    id: 1,
    title: 'A Função Estratégica do Supervisor',
    subtitle: 'O Elo entre Diretoria e Chão de Fábrica',
    day: 1,
    period: 'Manhã',
    icon: Target,
    color: '#1565C0',
    objective:
      'Compreender o papel estratégico do supervisor e identificar as 5 dimensões de liderança para evolução pessoal.',
    takeaway:
      'Você sai sabendo exatamente onde está e para onde precisa ir como líder.',
    concepts: [
      {
        label: '5 Dimensões da Liderança',
        detail:
          'Facilitador (remove obstáculos), Orientador (desenvolve pessoas), Garantidor (assegura qualidade), Estrategista (conecta operação à visão), Mentor (forma sucessores).',
      },
      {
        label: 'Ciclo de Sucessão e Promoção Sustentável',
        detail:
          'Modelo estruturado para garantir que promoções gerem líderes preparados, não apenas técnicos deslocados.',
      },
      {
        label: 'Armadilha Estatística',
        detail:
          '65% dos supervisores são promovidos por competência técnica, mas apenas 30% recebem formação em liderança antes de assumir o cargo.',
      },
      {
        label: 'Do "Homer Simpson" ao Líder Estratégico',
        detail:
          'Abandonar vícios reativos do dia a dia e adotar postura estratégica com visão de futuro.',
      },
    ],
    exercises: [
      'Reflexão guiada sobre sua trajetória de promoção',
      'Mapeamento das 5 dimensões na sua rotina atual',
    ],
    tool: {
      name: 'Autoavaliação das 5 Dimensões',
      description:
        'Questionário prático para mapear seu nível atual em cada dimensão e definir prioridades de desenvolvimento.',
    },
  },
  {
    id: 2,
    title: 'Inteligência Comportamental e Comunicação',
    subtitle: 'Postura, escuta ativa e feedback assertivo',
    day: 1,
    period: 'Manhã',
    icon: Brain,
    color: '#1565C0',
    objective:
      'Dominar técnicas de comunicação e inteligência emocional para construir confiança e resolver conflitos.',
    takeaway:
      'Você aplica a Fórmula E.I.A. já na segunda-feira com sua equipe.',
    concepts: [
      {
        label: 'Fórmula E.I.A.',
        detail:
          'Evento (descrever o fato sem julgamento) → Impacto (explicar a consequência) → Ação (propor a solução futura). Estrutura poderosa para feedback assertivo.',
      },
      {
        label: 'Escuta Ativa — 3 Níveis',
        detail:
          'Nível 1: ouvir as palavras. Nível 2: entender a emoção por trás. Nível 3: agir sobre o não-dito. Líderes operam no nível 3.',
      },
      {
        label: 'Postura Assertiva vs Passiva vs Agressiva',
        detail:
          'Assertividade é defender sua posição respeitando o outro. Passividade cede sempre; agressividade impõe. O supervisor precisa do equilíbrio.',
      },
      {
        label: 'Comunicação Não-Violenta no Chão de Fábrica',
        detail:
          'Adaptar os princípios da CNV para o ambiente operacional: observação sem julgamento, sentimentos, necessidades e pedidos claros.',
      },
    ],
    exercises: [
      'Role-play de feedback usando a Fórmula E.I.A.',
      'Prática de escuta ativa em duplas com cenários reais',
    ],
    tool: {
      name: 'Role-play de Feedback com E.I.A.',
      description:
        'Dinâmica em duplas onde cada participante pratica dar e receber feedback usando a fórmula Evento-Impacto-Ação com situações reais do trabalho.',
    },
  },
  {
    id: 3,
    title: 'Alicerce Ético e Responsabilidade',
    subtitle: 'Virtudes, integridade e segurança psicológica',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    color: '#F57C00',
    objective:
      'Desenvolver base ética sólida que sustente decisões sob pressão e crie segurança psicológica na equipe.',
    takeaway:
      'Sua equipe vai respeitar suas decisões porque confia no seu caráter.',
    concepts: [
      {
        label: 'Tribunal das Virtudes',
        detail:
          'Dinâmica interativa de dilemas éticos onde os participantes debatem e julgam situações reais de liderança.',
      },
      {
        label: '7 Virtudes do Líder',
        detail:
          'Integridade, Justiça, Coragem, Temperança, Prudência, Humildade e Compaixão — os pilares que sustentam a autoridade moral.',
      },
      {
        label: 'Ética vs Resultado',
        detail:
          'Como agir quando metas de produção colidem com valores éticos. Frameworks para tomar decisões difíceis sem comprometer princípios.',
      },
      {
        label: 'Segurança Psicológica',
        detail:
          'Criar um ambiente onde erros são tratados como aprendizado, não como punição. Equipes psicologicamente seguras inovam mais e erram menos.',
      },
      {
        label: 'Compliance e Cultura Ética',
        detail:
          'A ética como vantagem competitiva: empresas éticas retêm mais talentos e constroem reputação sustentável.',
      },
    ],
    exercises: [
      'Dinâmica do Tribunal das Virtudes com dilemas reais',
      'Análise de caso prático: decisão ética sob pressão de metas',
    ],
    tool: {
      name: 'Caso Prático do Tribunal das Virtudes',
      description:
        'Simulação de julgamento ético onde cada grupo defende uma posição diante de um dilema real de liderança, usando as 7 virtudes como referência.',
    },
  },
  {
    id: 4,
    title: 'Gestão da Diversidade Geracional',
    subtitle: 'Liderando Baby Boomers, X, Millennials e Z',
    day: 1,
    period: 'Tarde',
    icon: Users,
    color: '#F57C00',
    objective:
      'Transformar diversidade geracional em vantagem competitiva, adaptando estilo de liderança a cada perfil.',
    takeaway:
      'Você para de reclamar das gerações e começa a usar cada perfil a seu favor.',
    concepts: [
      {
        label: 'Baby Boomers',
        detail:
          'Valores: lealdade, estabilidade, hierarquia. Motivação: reconhecimento pela experiência. Liderança: respeitar senioridade, dar autonomia.',
      },
      {
        label: 'Geração X',
        detail:
          'Valores: independência, pragmatismo. Motivação: equilíbrio trabalho-vida. Liderança: objetividade, resultados claros, menos reuniões.',
      },
      {
        label: 'Millennials (Geração Y)',
        detail:
          'Valores: propósito, colaboração, feedback constante. Motivação: crescimento e impacto. Liderança: mentoria, transparência, flexibilidade.',
      },
      {
        label: 'Geração Z',
        detail:
          'Valores: autenticidade, tecnologia, diversidade. Motivação: autonomia e inovação. Liderança: comunicação digital, microlearning, feedback instantâneo.',
      },
      {
        label: 'Mentoria Reversa',
        detail:
          'Conceito onde a Geração Z ensina tecnologia e tendências digitais para a Geração X e Boomers, criando troca de valor bidirecional.',
      },
      {
        label: 'Equidade vs Igualdade',
        detail:
          'Igualdade é tratar todos da mesma forma. Equidade é dar a cada um o que precisa. Na gestão de gerações, equidade gera engajamento.',
      },
    ],
    exercises: [
      'Mapeamento geracional da sua equipe atual',
      'Criação de estratégias de engajamento por geração',
    ],
    tool: {
      name: 'Matriz de Engajamento por Geração',
      description:
        'Ferramenta visual para mapear cada membro da equipe por geração e definir estratégias personalizadas de motivação, comunicação e desenvolvimento.',
    },
  },
  {
    id: 5,
    title: 'Engenharia de Equipes, Mapeamento e Sucessão',
    subtitle: 'Matriz Competência x Compromisso e delegação eficaz',
    day: 2,
    period: 'Manhã',
    icon: BriefcaseBusiness,
    color: '#1565C0',
    objective:
      'Mapear sua equipe nos 4 quadrantes e aplicar a estratégia certa de liderança para cada perfil.',
    takeaway:
      'Você vai saber exatamente quem treinar, delegar, apoiar ou substituir.',
    concepts: [
      {
        label: 'Iniciante Motivado → Direcionar',
        detail:
          'Alto compromisso, baixa competência. Precisa de mentoria técnica intensa, direcionamento claro e acompanhamento próximo.',
      },
      {
        label: 'O Estrela → Delegar',
        detail:
          'Alta competência, alto compromisso. Dar desafios estratégicos, autonomia e prepará-lo para sucessão.',
      },
      {
        label: 'O Questionador → Apoiar',
        detail:
          'Alta competência, baixo compromisso. Precisa de feedback comportamental, entender motivação e reconquistar engajamento.',
      },
      {
        label: 'O Problema → Treinar ou Substituir',
        detail:
          'Baixa competência, baixo compromisso. Último investimento em treinamento com prazo definido. Se não evoluir, substituição planejada.',
      },
      {
        label: 'Plano de Sucessão',
        detail:
          'Preparar quem vem depois de você. Identificar potenciais sucessores, criar plano de desenvolvimento e garantir continuidade.',
      },
      {
        label: 'Delegação Eficaz',
        detail:
          'O que delegar (tarefas estratégicas, não só operacionais), quando delegar (conforme maturidade) e para quem (perfil certo para cada desafio).',
      },
    ],
    exercises: [
      'Mapeamento real da sua equipe nos 4 quadrantes',
      'Plano de ação para cada membro baseado no quadrante',
    ],
    tool: {
      name: 'Mapeamento da Equipe nos 4 Quadrantes',
      description:
        'Planilha prática para posicionar cada membro da equipe na Matriz Competência x Compromisso e definir ações de desenvolvimento individuais.',
    },
  },
  {
    id: 6,
    title: 'O Supervisor 4.0 (Tecnologia e IA)',
    subtitle: 'IA como copiloto e dados como bússola',
    day: 2,
    period: 'Manhã',
    icon: Cpu,
    color: '#1565C0',
    objective:
      'Integrar IA e análise de dados ao seu fluxo de trabalho para tomar decisões mais rápidas e precisas.',
    takeaway:
      'Você vai usar IA para resolver problemas reais do seu setor em minutos.',
    concepts: [
      {
        label: 'O Supervisor Cientista',
        detail:
          'Evolução de "fazer o gráfico" para "saber o que fazer com a informação". Interpretar dados, não apenas coletá-los.',
      },
      {
        label: 'Prompt Mágico',
        detail:
          'Fórmula: Contexto (quem sou, cenário) + Dados (números, fatos) + Objetivo (o que quero). Estrutura que transforma qualquer interação com IA em resultado útil.',
      },
      {
        label: 'Tríade da Maestria',
        detail:
          'Reconhecimento (identificar padrões nos dados), Criação (gerar insights novos) e Utilização (aplicar na prática). O ciclo completo da inteligência de dados.',
      },
      {
        label: 'KPI Autópsia vs KPI Bússola',
        detail:
          'Autópsia: indicador reativo que olha para trás (o que aconteceu). Bússola: indicador preditivo que olha para frente (o que vai acontecer). Líderes usam os dois.',
      },
      {
        label: 'Análise de Causa Raiz',
        detail:
          'Três origens: Humana (comportamento/treinamento), Máquina (equipamento/tecnologia) ou Processo (fluxo/procedimento). Identificar a raiz correta evita retrabalho.',
      },
      {
        label: 'Anonimização de Dados e Ética em IA',
        detail:
          'Como usar IA sem expor dados sensíveis da empresa ou dos colaboradores. Práticas éticas no uso de inteligência artificial.',
      },
    ],
    exercises: [
      'Criar um Prompt Mágico para um problema real do seu setor',
      'Classificar seus KPIs atuais em Autópsia ou Bússola',
    ],
    tool: {
      name: 'Prompt Mágico Aplicado a um Caso Real',
      description:
        'Exercício prático onde cada participante cria um prompt estruturado (Contexto + Dados + Objetivo) para resolver um problema real usando Gemini ou ChatGPT.',
    },
  },
  {
    id: 7,
    title: 'Padrões de Sucesso',
    subtitle: 'Reconhecer, criar e replicar resultados de alta performance',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    color: '#F57C00',
    objective:
      'Sistematizar processos de alta performance e transformar resultados positivos em padrões replicáveis.',
    takeaway:
      'Sucesso não é sorte, é padrão — e você vai criar os seus.',
    concepts: [
      {
        label: 'Tríade da Maestria Aplicada',
        detail:
          'Reconhecimento: identificar o que funciona na sua equipe. Criação: inovar sobre o padrão existente. Utilização: replicar boas práticas como Standard operacional.',
      },
      {
        label: 'KPIs S.M.A.R.T.',
        detail:
          'Específicos (o quê), Mensuráveis (quanto), Atingíveis (é possível), Relevantes (faz diferença) e Temporais (até quando). Framework para metas que funcionam.',
      },
      {
        label: 'De Resultado a Procedimento',
        detail:
          'Transformar resultados positivos isolados em procedimentos documentados e replicáveis por toda a equipe.',
      },
      {
        label: 'Benchmarking Interno',
        detail:
          'Aprender com os melhores da própria empresa. Identificar quem já resolve o problema que você enfrenta e adaptar a solução.',
      },
    ],
    exercises: [
      'Identificar um resultado positivo recente e documentar o processo',
      'Criar um KPI S.M.A.R.T. para sua principal meta atual',
    ],
    tool: {
      name: 'Criação de um Padrão de Sucesso Real',
      description:
        'Template estruturado para documentar uma boa prática da sua área, transformando-a em um procedimento replicável com indicadores de acompanhamento.',
    },
  },
  {
    id: 8,
    title: 'Estratégia de Carreira e Plano Futuro',
    subtitle: 'PDI, roteiro de aceleração e mentoria pós-treinamento',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    color: '#F57C00',
    objective:
      'Sair com um plano concreto de evolução profissional para os próximos 60 dias e além.',
    takeaway:
      'Você sai com data, nome do sucessor e plano de carreira na mão.',
    concepts: [
      {
        label: 'PDI — Plano de Desenvolvimento Individual',
        detail:
          'Documento personalizado com metas de curto, médio e longo prazo, ações específicas e indicadores de progresso para sua evolução como líder.',
      },
      {
        label: 'Roteiro de Aceleração 12 Semanas',
        detail:
          'Semanas 1-4: Comportamental (construir confiança, praticar escuta ativa). Semanas 5-8: Processual (implementar KPIs, otimizar rotinas). Semanas 9-12: Estratégico (inovação, plano de sucessão).',
      },
      {
        label: 'Autocoaching: Metodologia de Sabedoria',
        detail:
          'Técnicas para ser seu próprio coach no dia a dia: perguntas poderosas, journaling de liderança e reflexão estruturada.',
      },
      {
        label: 'Mentoria 30/60 Dias',
        detail:
          'Garantia de implementação: acompanhamento em 30 dias (revisão do PDI, ajustes) e 60 dias (certificação, resultados, próximos passos).',
      },
      {
        label: 'Certificado e Próximos Passos',
        detail:
          'Certificação de conclusão do programa com compromisso público de aplicação e plano de continuidade do desenvolvimento.',
      },
    ],
    exercises: [
      'Preenchimento guiado do PDI com metas reais',
      'Definição do compromisso público de liderança',
    ],
    tool: {
      name: 'Preenchimento do PDI e Compromisso Público',
      description:
        'Construção do seu Plano de Desenvolvimento Individual com metas SMART, cronograma de 12 semanas e compromisso público com a turma.',
    },
  },
]

export default function ModulosAccordion() {
  const [openId, setOpenId] = useState<number | null>(1)

  const day1 = modules.filter((m) => m.day === 1)
  const day2 = modules.filter((m) => m.day === 2)

  function toggle(id: number) {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="space-y-10">
      {/* Dia 1 */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1565C0] text-xs font-extrabold text-white">
            D1
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-[#0F172A]">
              O Elo e o Alicerce Ético
            </h2>
            <p className="text-xs text-[#64748B]">4 módulos · 8h · Manhã e Tarde</p>
          </div>
        </div>
        <div className="space-y-2">
          {day1.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              isOpen={openId === mod.id}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>

      {/* Dia 2 */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F57C00] text-xs font-extrabold text-white">
            D2
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-[#0F172A]">
              Tecnologia e Futuro
            </h2>
            <p className="text-xs text-[#64748B]">4 módulos · 8h · Manhã e Tarde</p>
          </div>
        </div>
        <div className="space-y-2">
          {day2.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              isOpen={openId === mod.id}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ModuleCard({
  module: mod,
  isOpen,
  onToggle,
}: {
  module: ModuleContent
  isOpen: boolean
  onToggle: (id: number) => void
}) {
  const Icon = mod.icon

  return (
    <div className="overflow-hidden rounded-xl border border-[#D8E2EF] bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        onClick={() => onToggle(mod.id)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F7FAFE]"
      >
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: mod.color }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider"
              style={{ color: mod.color }}
            >
              Módulo {String(mod.id).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[#94A3B8]">&bull;</span>
            <span className="text-[10px] font-medium text-[#64748B]">{mod.period}</span>
          </div>
          <p className="text-sm font-bold text-[#0F172A] leading-snug">{mod.title}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{mod.subtitle}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#94A3B8] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-[#E5ECF6] px-5 py-5 space-y-5">
          {/* Objetivo */}
          <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-[#0B4A8F]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B4A8F]">
                Objetivo do Módulo
              </p>
            </div>
            <p className="text-sm text-[#334155]">{mod.objective}</p>
          </div>

          {/* Conceitos-chave */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-3.5 w-3.5 text-[#F59E0B]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Conceitos-Chave
              </p>
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {mod.concepts.map((concept, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#E5ECF6] bg-white px-4 py-3"
                >
                  <p className="text-xs font-bold text-[#0F172A] mb-1">
                    {concept.label}
                  </p>
                  <p className="text-xs leading-relaxed text-[#64748B]">
                    {concept.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Exercícios */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Exercícios Práticos
              </p>
            </div>
            <ul className="space-y-1.5">
              {mod.exercises.map((ex, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7C3AED]"
                  />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ferramenta destaque */}
          <div
            className="rounded-xl px-4 py-4 border"
            style={{
              backgroundColor: `${mod.color}08`,
              borderColor: `${mod.color}25`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-4 w-4" style={{ color: mod.color }} />
              <p
                className="text-xs font-extrabold uppercase tracking-wider"
                style={{ color: mod.color }}
              >
                Ferramenta Prática
              </p>
            </div>
            <p className="text-sm font-bold text-[#0F172A]">{mod.tool.name}</p>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              {mod.tool.description}
            </p>
          </div>

          {/* Takeaway */}
          <div className="flex items-start gap-3 rounded-lg bg-[#0F172A] px-4 py-3">
            <span className="mt-0.5 text-lg">&#127919;</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F57C00]">
                Resultado Prático
              </p>
              <p className="text-sm font-medium text-white mt-0.5">{mod.takeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
