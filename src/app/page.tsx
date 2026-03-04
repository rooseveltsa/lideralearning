import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Users2,
} from 'lucide-react'

import SiteFooter from '@/components/site/Footer'
import SiteHeader from '@/components/site/Header'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import { createClient } from '@/lib/supabase/server'

type Course = {
  id: string
  title: string
  description: string | null
  price: number
  thumbnail_url: string | null
}

const ecosystem = [
  {
    icon: Sparkles,
    title: 'Lidera Academy',
    description: 'Biblioteca digital com cursos curtos, trilhas extensas e continuidade por progresso individual.',
    bullets: ['Aulas on-demand', 'Trilhas com certificação', 'Masterclasses ao vivo'],
  },
  {
    icon: Users2,
    title: 'Imersões Presenciais',
    description: 'Eventos de alta intensidade para consolidar comportamento de liderança e execução em grupo.',
    bullets: ['Experiências de 1 ou 2 dias', 'Turmas abertas e in-company', 'Material pós-evento'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Corporativo B2B',
    description: 'Diagnóstico, desenho de programa e acompanhamento de resultados para RH e diretoria.',
    bullets: ['Pipeline comercial interno', 'Propostas estruturadas', 'Governança por etapas'],
  },
]

const executionSteps = [
  {
    title: 'Diagnóstico',
    detail: 'Mapeamento de cenário, maturidade de liderança e prioridade do negócio.',
  },
  {
    title: 'Arquitetura da Jornada',
    detail: 'Composição de trilhas digitais, workshops e rituais de aplicação.',
  },
  {
    title: 'Operação Assistida',
    detail: 'Execução com checkpoints, engajamento e acompanhamento da adesão.',
  },
  {
    title: 'Medição de Resultado',
    detail: 'Leitura de indicadores de evolução individual e impacto operacional.',
  },
]

const testimonials = [
  {
    name: 'Carlos Mendes',
    role: 'Diretor de RH • Grupo Industrial Alfa',
    quote: 'Em 90 dias o treinamento deixou de ser ação isolada e virou sistema de execução gerencial.',
    result: '43% de redução de turnover',
  },
  {
    name: 'Fernanda Pacheco',
    role: 'CEO • TechBR Soluções',
    quote: 'A operação ganhou clareza de liderança e os times passaram a executar com mais consistência.',
    result: 'Meta subiu de 62% para 91%',
  },
  {
    name: 'Ricardo Albuquerque',
    role: 'COO • Rede Varejista Nacional',
    quote: 'Conseguimos ligar formação e performance com dados de aplicação, não apenas presença em aula.',
    result: 'T&D integrado ao painel executivo',
  },
]

const faqs = [
  {
    q: 'A Lidera é somente plataforma digital?',
    a: 'Não. O modelo é híbrido: academy digital, eventos presenciais e projetos corporativos no mesmo ecossistema.',
  },
  {
    q: 'A empresa consegue contratar algo personalizado?',
    a: 'Sim. O diagnóstico inicial define trilhas, formatos e metas de implementação para cada contexto.',
  },
  {
    q: 'Existe certificação para os alunos?',
    a: 'Sim. Trilhas elegíveis liberam certificado conforme critérios de conclusão definidos pela jornada.',
  },
  {
    q: 'Quanto tempo leva para começar um projeto B2B?',
    a: 'Após o diagnóstico comercial, a proposta inicial costuma ser enviada rapidamente para início da implantação.',
  },
]

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function HomePage() {
  const supabase = await createClient()

  const [featuredCoursesRes, publishedCountRes, enrollmentsCountRes, leadsCountRes] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, description, price, thumbnail_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('b2b_leads').select('id', { count: 'exact', head: true }),
  ])

  const featuredCourses = (Array.isArray(featuredCoursesRes.data) ? featuredCoursesRes.data : []) as Course[]

  const publishedPrograms = publishedCountRes.count ?? 0
  const activeEnrollments = enrollmentsCountRes.count ?? 0
  const registeredLeads = leadsCountRes.count ?? 0

  const indicators = [
    {
      value: `${publishedPrograms}`,
      label: 'Programas publicados',
      detail: 'Catálogo ativo de formações na Academy.',
    },
    {
      value: `${activeEnrollments}`,
      label: 'Matrículas em andamento',
      detail: 'Jornadas ativas dentro da plataforma.',
    },
    {
      value: `${registeredLeads}`,
      label: 'Leads corporativos',
      detail: 'Empresas registradas no funil B2B.',
    },
    {
      value: '4h úteis',
      label: 'SLA comercial',
      detail: 'Prazo médio para resposta de diagnóstico.',
    },
  ]

  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="border-b border-[#1A2438] px-6 pb-24 pt-36">
          <div className="mx-auto grid w-full max-w-[1280px] gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D4466] bg-[#0D1728] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
                <CalendarClock className="h-3.5 w-3.5" />
                Lidera Treinamentos
              </p>

              <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Plataforma híbrida para <span className="text-[#8CC1F7]">elevar líderes</span> e acelerar resultado em escala.
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
                A Lidera conecta streaming de treinamentos, trilhas com certificação e projetos corporativos em um só sistema. A proposta é transformar desenvolvimento em execução mensurável.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
                >
                  Explorar Academy
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#diagnostico"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#335077] px-6 py-3.5 text-sm font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
                >
                  Diagnóstico corporativo
                </Link>
              </div>
            </div>

            <article className="rounded-3xl border border-[#243A59] bg-[#0A1324] p-6 shadow-[0_24px_52px_rgba(2,6,23,0.5)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#87A6C8]">Sistema Lidera</p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">Arquitetura de entrega híbrida</h2>

              <div className="mt-6 space-y-3">
                {[
                  {
                    label: 'Digital',
                    value: 'Academy com progressão por trilha',
                    icon: PlayCircle,
                  },
                  {
                    label: 'Presencial',
                    value: 'Imersões e workshops de aprofundamento',
                    icon: Users2,
                  },
                  {
                    label: 'Corporativo',
                    value: 'Pipeline B2B com proposta estruturada',
                    icon: Building2,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-[#253B5A] bg-[#0F1B30] px-4 py-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#162845] text-[#9EC6F1]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9CB4CF]">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-b border-[#1A2438] bg-[#060D1A] px-6 py-14">
          <div className="mx-auto grid w-full max-w-[1280px] gap-6 md:grid-cols-2 xl:grid-cols-4">
            {indicators.map((item) => (
              <article key={item.label} className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-5">
                <p className="text-3xl font-extrabold text-white">{item.value}</p>
                <p className="mt-1 text-sm font-bold text-[#D8E4F5]">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#8FA8C5]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Ecossistema</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">
                Três módulos integrados para desenvolvimento individual e performance corporativa.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {ecosystem.map(({ icon: Icon, title, description, bullets }) => (
                <article key={title} className="rounded-2xl border border-[#D8E2EF] bg-white p-7 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECF3FC] text-[#0B4A8F]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{description}</p>
                  <ul className="mt-5 space-y-2">
                    {bullets.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#334155]">
                        <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {featuredCourses.length > 0 ? (
          <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
            <div className="mx-auto w-full max-w-[1280px]">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Academy</p>
                  <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-white">
                    Stream de treinamentos com foco em aplicação prática.
                  </h2>
                </div>
                <Link href="/cursos" className="inline-flex items-center gap-2 text-sm font-bold text-[#A9C7E8] hover:text-white">
                  Ver catálogo completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/curso/${course.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2A3E5D] bg-[#0A1324] transition-all hover:border-[#1E88E5] hover:shadow-[0_18px_38px_rgba(16,42,84,0.45)]"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#0F1B30]">
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-[#9AB2CE]">{course.title}</div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 text-lg font-bold text-white">{course.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#9AB2CE]">
                        {course.description || 'Formação estruturada para evolução prática de liderança e comunicação.'}
                      </p>
                      <div className="mt-5 flex items-end justify-between border-t border-[#20314B] pt-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7FA0C2]">Acesso</p>
                          <p className="text-base font-extrabold text-white">{priceFormatter.format(course.price)}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#D6E6F8]">
                          Abrir
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Operação B2B</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">Fluxo estruturado para empresas que precisam de escala.</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {executionSteps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-[#D8E2EF] bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Etapa {index + 1}</p>
                  <h3 className="mt-2 text-lg font-extrabold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Resultados aplicados</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold text-white">Organizações que implementaram a jornada Lidera.</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.name} className="rounded-2xl border border-[#23344E] bg-[#0A1324] p-7">
                  <p className="text-base leading-relaxed text-[#D6E3F5]">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#15223A] px-3 py-1 text-xs font-bold text-[#9EC6F1]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {item.result}
                  </p>
                  <div className="mt-5 border-t border-[#1E2F49] pt-4">
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-[#9FB2CB]">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="diagnostico" className="bg-[#050A14] px-6 py-24">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Diagnóstico corporativo</p>
              <h2 className="font-heading text-4xl font-extrabold leading-tight text-white">
                Estruture uma trilha robusta para liderança com plano de implantação.
              </h2>
              <p className="text-lg leading-relaxed text-[#A9BDD8]">
                Envie o cenário da sua empresa e retornamos com uma proposta inicial de arquitetura de treinamento e execução.
              </p>
              <div className="space-y-2 text-sm text-[#9AB2CE]">
                <p className="flex items-center gap-2">
                  <ChartNoAxesCombined className="h-4 w-4 text-[#1E88E5]" />
                  Modelo híbrido digital + presencial.
                </p>
                <p className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-[#1E88E5]" />
                  Foco em RH, líderes e business partners.
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#1E88E5]" />
                  Pipeline comercial com histórico auditável.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-7 shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
              <LeadFormB2B />
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A2438] bg-[#050A14] px-6 py-20">
          <div className="mx-auto w-full max-w-[980px]">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">FAQ</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">Perguntas comuns antes de iniciar</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details key={item.q} className="group overflow-hidden rounded-xl border border-[#23334D] bg-[#0A1324]">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#8FA8C5] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="border-t border-[#1D2D45] px-5 py-4 text-sm leading-relaxed text-[#A9BDD8]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
