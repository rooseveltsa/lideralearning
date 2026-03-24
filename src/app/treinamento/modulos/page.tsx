import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Cpu,
  Heart,
  MessageCircle,
  Phone,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata: Metadata = {
  title: 'Programa Completo — Supervisor: Da Operação à Liderança | LIDERA',
  description:
    '8 módulos em 16 horas de imersão presencial. Conheça o conteúdo completo do programa que transforma supervisores operacionais em líderes estratégicos.',
  openGraph: {
    title: 'Programa Completo — Supervisor: Da Operação à Liderança | LIDERA',
    description:
      '8 módulos, 2 dias de imersão, mentoria individual. Veja o conteúdo completo do treinamento presencial.',
  },
}

type ModuleData = {
  id: number
  title: string
  subtitle: string
  day: number
  period: string
  icon: typeof BookOpen
  color: string
  topics: string[]
  objective: string
}

const modules: ModuleData[] = [
  {
    id: 1,
    title: 'A Função Estratégica',
    subtitle: 'O supervisor como "Elo" entre diretoria e operação',
    day: 1,
    period: 'Manhã',
    icon: Target,
    color: '#1565C0',
    topics: [
      'O papel do supervisor como ponte entre estratégia e operação',
      'As 5 dimensões da liderança: Facilitador, Orientador, Garantidor, Estrategista e Mentor',
      'Transição de executor para líder: o que muda na prática',
      'Diagnóstico da sua maturidade como líder',
    ],
    objective:
      'Compreender o papel estratégico do supervisor e identificar em qual das 5 dimensões você mais precisa evoluir.',
  },
  {
    id: 2,
    title: 'Inteligência Comportamental',
    subtitle: 'Postura, comunicação e inteligência emocional',
    day: 1,
    period: 'Manhã',
    icon: Brain,
    color: '#1565C0',
    topics: [
      'Postura profissional e comunicação assertiva no dia a dia',
      'Inteligência emocional aplicada à gestão de pessoas',
      'Feedback assertivo com a Fórmula E.I.A (Evento, Impacto, Ação)',
      'Técnicas de escuta ativa e mediação de conflitos',
    ],
    objective:
      'Dominar técnicas de comunicação e inteligência emocional para construir relações de confiança com a equipe.',
  },
  {
    id: 3,
    title: 'Alicerce Ético',
    subtitle: 'Virtudes, integridade e responsabilidade na liderança',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    color: '#F57C00',
    topics: [
      'As virtudes essenciais para o exercício da liderança',
      'Dinâmica prática: Tribunal das Virtudes',
      'Equilíbrio entre integridade e cumprimento de metas',
      'Construção de autoridade moral com a equipe',
    ],
    objective:
      'Desenvolver uma base ética sólida que sustente suas decisões como líder, mesmo sob pressão.',
  },
  {
    id: 4,
    title: 'Diversidade Geracional',
    subtitle: 'Liderando equipes multigeracionais',
    day: 1,
    period: 'Tarde',
    icon: Users,
    color: '#F57C00',
    topics: [
      'Características das Gerações X, Y (Millennials) e Z no trabalho',
      'Como liderar cada perfil geracional sem conflitos',
      'Mediação de conflitos entre gerações diferentes',
      'Mentoria reversa: o que as gerações mais novas podem ensinar',
    ],
    objective:
      'Aprender a extrair o melhor de cada geração e transformar a diversidade em vantagem competitiva.',
  },
  {
    id: 5,
    title: 'Engenharia de Equipes',
    subtitle: 'Mapeamento de competências, delegação e sucessão',
    day: 2,
    period: 'Manhã',
    icon: BriefcaseBusiness,
    color: '#1565C0',
    topics: [
      'Matriz de Competência vs Compromisso: Iniciante Motivado, O Estrela, O Questionador, O Problema',
      'Técnicas de delegação eficaz por perfil comportamental',
      'Planejamento de sucessão: preparando seu substituto',
      'Como desenvolver talentos dentro da equipe',
    ],
    objective:
      'Mapear sua equipe na Matriz e aplicar a estratégia certa de liderança para cada perfil.',
  },
  {
    id: 6,
    title: 'O Supervisor 4.0',
    subtitle: 'Tecnologia e Inteligência Artificial na gestão',
    day: 2,
    period: 'Manhã',
    icon: Cpu,
    color: '#1565C0',
    topics: [
      'IA na prática: como usar Gemini e ChatGPT no dia a dia do líder',
      'Prompt Mágico: Contexto + Dados + Objetivo para resultados assertivos',
      'Análise de causa raiz com apoio de tecnologia',
      'KPI Autópsia (passado) vs KPI Bússola (futuro): medir para liderar',
    ],
    objective:
      'Integrar ferramentas de IA ao seu fluxo de trabalho e tomar decisões baseadas em dados reais.',
  },
  {
    id: 7,
    title: 'Padrões de Sucesso',
    subtitle: 'Reconhecendo e replicando resultados consistentes',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    color: '#F57C00',
    topics: [
      'Tríade da Maestria: Reconhecimento, Criação e Utilização de padrões',
      'Construção de KPIs S.M.A.R.T. para sua área',
      'Padrões de execução que geram resultados previsíveis',
      'Como documentar e transferir boas práticas para a equipe',
    ],
    objective:
      'Identificar padrões de sucesso na operação e sistematizar processos de alta performance.',
  },
  {
    id: 8,
    title: 'Estratégia e Plano Futuro',
    subtitle: 'PDI individual, sucessão e autocoaching',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    color: '#F57C00',
    topics: [
      'Construção do PDI — Plano de Desenvolvimento Individual personalizado',
      'Estratégia de carreira: de supervisor a gestor',
      'Plano de sucessão: garantindo continuidade dos resultados',
      'Compromisso de autocoaching e acompanhamento pós-treinamento',
    ],
    objective:
      'Sair com um plano concreto de evolução profissional e compromisso de implementação nos próximos 60 dias.',
  },
]

function ModuleCard({ module }: { module: ModuleData }) {
  const Icon = module.icon
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#D8E2EF] bg-white shadow-sm transition-all hover:border-[#93B5DC] hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-[#E5ECF6] px-6 py-4">
        <div
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${module.color}14` }}
        >
          <Icon className="h-5 w-5" style={{ color: module.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: module.color }}>
            Módulo {String(module.id).padStart(2, '0')}
          </p>
          <h3 className="truncate text-lg font-extrabold text-[#0F172A]">{module.title}</h3>
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2.5 py-1 font-bold">
            <CalendarDays className="h-3 w-3" />
            Dia {module.day}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2.5 py-1 font-bold">
            <Clock className="h-3 w-3" />
            {module.period}
          </span>
        </div>

        <p className="text-sm font-medium text-[#334155]">{module.subtitle}</p>

        <ul className="space-y-2">
          {module.topics.map((topic, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1565C0]" />
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0B4A8F]">Objetivo</p>
          <p className="mt-1 text-sm leading-relaxed text-[#334155]">{module.objective}</p>
        </div>
      </div>
    </div>
  )
}

export default function ModulosPage() {
  const whatsappUrl =
    'https://wa.me/5564999686668?text=Ol%C3%A1%20Claudemir%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20programa%20de%20lideran%C3%A7a.'

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F8FD]">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#060D1A] py-20 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(30,136,229,0.18),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,124,0,0.10),transparent_40%)]" />
          <div className="relative mx-auto max-w-5xl px-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F57C00]">
              Programa Completo
            </p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Supervisor: Da Operação
              <br />
              <span className="text-[#1E88E5]">à Liderança</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
              16 horas de imersão presencial, divididas em 2 dias intensivos com 8 módulos.
              Metodologia prática com dinâmicas, exercícios reais e plano de desenvolvimento individual.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4467] bg-[#0E1E35] px-4 py-2 font-bold text-[#D3E1F2]">
                <CalendarDays className="h-4 w-4 text-[#1E88E5]" />
                2 dias presenciais
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4467] bg-[#0E1E35] px-4 py-2 font-bold text-[#D3E1F2]">
                <BookOpen className="h-4 w-4 text-[#1E88E5]" />
                8 módulos
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4467] bg-[#0E1E35] px-4 py-2 font-bold text-[#D3E1F2]">
                <Clock className="h-4 w-4 text-[#1E88E5]" />
                16 horas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4467] bg-[#0E1E35] px-4 py-2 font-bold text-[#D3E1F2]">
                <Heart className="h-4 w-4 text-[#F57C00]" />
                Mentoria 30/60 dias
              </span>
            </div>
          </div>
        </section>

        {/* Schedule Overview */}
        <section className="mx-auto max-w-5xl px-5 py-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              Estrutura do Programa
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">Dois dias de imersão total</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Day 1 */}
            <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1565C0]/10">
                  <span className="text-lg font-extrabold text-[#1565C0]">D1</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">O Elo e o Alicerce Ético</h3>
                  <p className="text-sm text-[#64748B]">Fundamentos de liderança e comportamento</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#1565C0]/10 text-[10px] font-extrabold text-[#1565C0]">
                    01
                  </span>
                  <span className="font-medium text-[#334155]">A Função Estratégica</span>
                  <span className="ml-auto text-xs text-[#64748B]">Manhã</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#1565C0]/10 text-[10px] font-extrabold text-[#1565C0]">
                    02
                  </span>
                  <span className="font-medium text-[#334155]">Inteligência Comportamental</span>
                  <span className="ml-auto text-xs text-[#64748B]">Manhã</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#F57C00]/10 text-[10px] font-extrabold text-[#F57C00]">
                    03
                  </span>
                  <span className="font-medium text-[#334155]">Alicerce Ético</span>
                  <span className="ml-auto text-xs text-[#64748B]">Tarde</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#F57C00]/10 text-[10px] font-extrabold text-[#F57C00]">
                    04
                  </span>
                  <span className="font-medium text-[#334155]">Diversidade Geracional</span>
                  <span className="ml-auto text-xs text-[#64748B]">Tarde</span>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F57C00]/10">
                  <span className="text-lg font-extrabold text-[#F57C00]">D2</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Tecnologia e Futuro</h3>
                  <p className="text-sm text-[#64748B]">Gestão avançada e planejamento de carreira</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#1565C0]/10 text-[10px] font-extrabold text-[#1565C0]">
                    05
                  </span>
                  <span className="font-medium text-[#334155]">Engenharia de Equipes</span>
                  <span className="ml-auto text-xs text-[#64748B]">Manhã</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#1565C0]/10 text-[10px] font-extrabold text-[#1565C0]">
                    06
                  </span>
                  <span className="font-medium text-[#334155]">O Supervisor 4.0</span>
                  <span className="ml-auto text-xs text-[#64748B]">Manhã</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#F57C00]/10 text-[10px] font-extrabold text-[#F57C00]">
                    07
                  </span>
                  <span className="font-medium text-[#334155]">Padrões de Sucesso</span>
                  <span className="ml-auto text-xs text-[#64748B]">Tarde</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#F57C00]/10 text-[10px] font-extrabold text-[#F57C00]">
                    08
                  </span>
                  <span className="font-medium text-[#334155]">Estratégia e Plano Futuro</span>
                  <span className="ml-auto text-xs text-[#64748B]">Tarde</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module Cards */}
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              Conteúdo Detalhado
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">
              O que você vai aprender em cada módulo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B]">
              Cada módulo combina teoria aplicada, dinâmicas em grupo e exercícios práticos extraídos de
              cenários reais de liderança.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </section>

        {/* Garantia de Implementação */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-5">
            <div className="rounded-2xl border border-[#D8E2EF] bg-[#F7FAFE] p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1565C0]/10">
                  <Sparkles className="h-6 w-6 text-[#1565C0]" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0F172A]">
                    Garantia de Implementação
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    O treinamento vai muito além dos 2 dias presenciais. Cada participante recebe
                    acompanhamento individual para garantir que o aprendizado se transforme em resultado real.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#1565C0]">30 dias</p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">Primeira mentoria</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Sessão individual para revisar o PDI e ajustar o plano de ação conforme os primeiros
                    resultados.
                  </p>
                </div>
                <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#F57C00]">60 dias</p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">Segunda mentoria</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Certificação dos resultados, análise de evolução e definição de próximos passos para
                    crescimento contínuo.
                  </p>
                </div>
                <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#0F172A]">Certificado</p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">De conclusão</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Certificado emitido após conclusão do treinamento presencial e participação nas mentorias
                    de acompanhamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="bg-[#060D1A] py-16 text-white">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-3xl font-extrabold">Pronto para transformar sua liderança?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#A9BDD8]">
              Comece pelo diagnóstico gratuito de liderança e descubra seus pontos de desenvolvimento.
              Ou fale diretamente com Claudemir para tirar suas dúvidas.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                <Target className="h-4 w-4" />
                Fazer Diagnóstico Gratuito
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2E4467] bg-[#0E1E35] px-6 py-3.5 text-sm font-bold text-[#D3E1F2] transition-colors hover:border-[#496A97] hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                Falar com Claudemir
              </a>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#5A7A9E]">
              <Phone className="h-3.5 w-3.5" />
              (64) 99968-6668
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
