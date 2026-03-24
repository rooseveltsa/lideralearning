import Link from 'next/link'
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Cpu,
  ExternalLink,
  Eye,
  Rocket,
  Shield,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

type ModuleInfo = {
  id: number
  title: string
  fullTitle: string
  day: number
  period: string
  icon: typeof BookOpen
  description: string
  published: boolean
}

const programModules: ModuleInfo[] = [
  {
    id: 1,
    title: 'A Função Estratégica',
    fullTitle: 'Módulo 1 — A Função Estratégica do Supervisor',
    day: 1,
    period: 'Manhã',
    icon: Target,
    description:
      'O supervisor como "Elo" entre diretoria e operação. As 5 dimensões da liderança: Facilitador, Orientador, Garantidor, Estrategista e Mentor.',
    published: true,
  },
  {
    id: 2,
    title: 'Inteligência Comportamental',
    fullTitle: 'Módulo 2 — Inteligência Comportamental e Comunicação',
    day: 1,
    period: 'Manhã',
    icon: Brain,
    description:
      'Postura e comunicação assertiva, inteligência emocional aplicada, feedback com a Fórmula E.I.A (Evento, Impacto, Ação).',
    published: true,
  },
  {
    id: 3,
    title: 'Alicerce Ético',
    fullTitle: 'Módulo 3 — Alicerce Ético e Responsabilidade',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    description:
      'Virtudes no trabalho, dinâmica do Tribunal das Virtudes, equilíbrio entre integridade e cumprimento de metas.',
    published: true,
  },
  {
    id: 4,
    title: 'Diversidade Geracional',
    fullTitle: 'Módulo 4 — Gestão da Diversidade Geracional',
    day: 1,
    period: 'Tarde',
    icon: Users,
    description:
      'Gerações X, Y (Millennials) e Z no ambiente de trabalho. Mediação de conflitos geracionais e mentoria reversa.',
    published: true,
  },
  {
    id: 5,
    title: 'Engenharia de Equipes',
    fullTitle: 'Módulo 5 — Engenharia de Equipes, Mapeamento e Sucessão',
    day: 2,
    period: 'Manhã',
    icon: BriefcaseBusiness,
    description:
      'Matriz de Competência vs Compromisso, técnicas de delegação por perfil, planejamento de sucessão.',
    published: true,
  },
  {
    id: 6,
    title: 'O Supervisor 4.0',
    fullTitle: 'Módulo 6 — O Supervisor 4.0 (Tecnologia e IA)',
    day: 2,
    period: 'Manhã',
    icon: Cpu,
    description:
      'IA na prática com Gemini/ChatGPT, Prompt Mágico (Contexto + Dados + Objetivo), KPI Autópsia vs KPI Bússola.',
    published: true,
  },
  {
    id: 7,
    title: 'Padrões de Sucesso',
    fullTitle: 'Módulo 7 — Padrões de Sucesso',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    description:
      'Tríade da Maestria (Reconhecimento, Criação, Utilização), KPIs S.M.A.R.T., padrões de execução replicáveis.',
    published: true,
  },
  {
    id: 8,
    title: 'Estratégia e Plano Futuro',
    fullTitle: 'Módulo 8 — Estratégia de Carreira e Plano Futuro',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    description:
      'PDI individual personalizado, plano de sucessão, compromisso de autocoaching e acompanhamento pós-treinamento.',
    published: true,
  },
]

export default function AdminConteudoPage() {
  const publishedCount = programModules.filter((m) => m.published).length

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
              Gestão de conteúdo
            </p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              Conteúdo do Programa
            </h1>
            <p className="mt-4 text-sm text-[#A9BDD8]">
              Total: <strong className="text-white">8 módulos</strong> em 2 dias
              {' '}&bull;{' '}Publicados: <strong className="text-white">{publishedCount}</strong>
            </p>
          </div>

          <Link
            href="/treinamento/modulos"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2E4467] px-5 py-3 text-sm font-bold text-[#D3E1F2] transition-colors hover:border-[#496A97] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Ver página pública
          </Link>
        </div>
      </section>

      {/* Day 1 */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              Dia 1 — O Elo e o Alicerce Ético
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Módulos 1 a 4</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
            <CalendarDays className="h-3.5 w-3.5" />
            4 módulos
          </span>
        </div>

        <div className="space-y-3">
          {programModules
            .filter((m) => m.day === 1)
            .map((mod) => {
              const Icon = mod.icon
              return (
                <div
                  key={mod.id}
                  className="flex items-start gap-4 rounded-2xl border border-[#D8E2EF] bg-white px-6 py-5 shadow-sm transition-colors hover:border-[#93B5DC]"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1565C0]/10">
                    <Icon className="h-5 w-5 text-[#1565C0]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1565C0]">
                        Módulo {String(mod.id).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-[#94A3B8]">&bull;</span>
                      <span className="flex items-center gap-1 text-xs text-[#64748B]">
                        <Clock className="h-3 w-3" />
                        {mod.period}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-extrabold text-[#0F172A]">{mod.fullTitle}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">{mod.description}</p>
                  </div>
                  <div className="shrink-0">
                    {mod.published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <Eye className="h-3.5 w-3.5" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </section>

      {/* Day 2 */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              Dia 2 — Tecnologia e Futuro
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Módulos 5 a 8</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
            <CalendarDays className="h-3.5 w-3.5" />
            4 módulos
          </span>
        </div>

        <div className="space-y-3">
          {programModules
            .filter((m) => m.day === 2)
            .map((mod) => {
              const Icon = mod.icon
              return (
                <div
                  key={mod.id}
                  className="flex items-start gap-4 rounded-2xl border border-[#D8E2EF] bg-white px-6 py-5 shadow-sm transition-colors hover:border-[#93B5DC]"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F57C00]/10">
                    <Icon className="h-5 w-5 text-[#F57C00]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#F57C00]">
                        Módulo {String(mod.id).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-[#94A3B8]">&bull;</span>
                      <span className="flex items-center gap-1 text-xs text-[#64748B]">
                        <Clock className="h-3 w-3" />
                        {mod.period}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-extrabold text-[#0F172A]">{mod.fullTitle}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">{mod.description}</p>
                  </div>
                  <div className="shrink-0">
                    {mod.published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <Eye className="h-3.5 w-3.5" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </section>
    </div>
  )
}
