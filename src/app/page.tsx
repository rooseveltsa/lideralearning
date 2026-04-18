import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Flame,
  MessageCircle,
  PlayCircle,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import SiteFooter from '@/components/site/Footer'
import SiteHeader from '@/components/site/Header'
import TypewriterText from '@/components/site/TypewriterText'
import { CourseShelf } from '@/components/premium/course/CourseShelf'
import { ActivityFeed, CommunityStats } from '@/components/premium/community/ActivityFeed'
import { Streak, XPBadge } from '@/components/premium/course/CourseProgressBar'
import { AvatarStack } from '@/components/premium/community/AvatarStack'

// ── Mock data for premium components ─────────────────────────────────────────

const mockCourses = [
  {
    id: '1',
    title: 'Liderança de Alta Performance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&q=80',
    instructor: { name: 'Claudemir Ferreira', avatarUrl: null },
    category: 'Liderança',
    duration: '18h 30min',
    totalLessons: 24,
    rating: 4.9,
    studentsCount: 3847,
    badge: 'bestseller' as const,
    price: { current: 497 },
    href: '/cursos/lideranca-alta-performance',
  },
  {
    id: '2',
    title: 'Gestão de Equipes Remotas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&q=80',
    instructor: { name: 'Ana Paula Santos', avatarUrl: null },
    category: 'Gestão',
    duration: '12h 15min',
    totalLessons: 18,
    rating: 4.8,
    studentsCount: 2103,
    badge: 'new' as const,
    price: { current: 347 },
    href: '/cursos/gestao-equipes-remotas',
  },
  {
    id: '3',
    title: 'Comunicação Assertiva para Líderes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=80',
    instructor: { name: 'Roberto Mendes', avatarUrl: null },
    category: 'Comunicação',
    duration: '8h 45min',
    totalLessons: 12,
    rating: 4.7,
    studentsCount: 1542,
    price: { current: 297 },
    href: '/cursos/comunicacao-assertiva',
  },
  {
    id: '4',
    title: 'Tomada de Decisão sob Pressão',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=640&q=80',
    instructor: { name: 'Fernanda Pacheco', avatarUrl: null },
    category: 'Estratégia',
    duration: '6h 20min',
    totalLessons: 10,
    rating: 4.9,
    studentsCount: 987,
    badge: 'updated' as const,
    price: { current: 247 },
    href: '/cursos/decisao-pressao',
  },
  {
    id: '5',
    title: 'Feedback que Transforma',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=640&q=80',
    instructor: { name: 'Marcos Vinícius', avatarUrl: null },
    category: 'Liderança',
    duration: '5h 10min',
    totalLessons: 8,
    rating: 4.8,
    studentsCount: 2311,
    price: { current: 197 },
    href: '/cursos/feedback-transforma',
  },
]

const mockActivities = [
  {
    id: '1',
    type: 'course_completed' as const,
    user: { id: '1', name: 'Renata Oliveira', avatarUrl: null },
    target: { type: 'course' as const, id: '1', title: 'Liderança de Alta Performance' },
    meta: {},
    timestamp: new Date(Date.now() - 12 * 60000),
    reactions: { count: 14, userReacted: false },
    comments: { count: 3 },
  },
  {
    id: '2',
    type: 'xp_milestone' as const,
    user: { id: '2', name: 'Gabriel Santos', avatarUrl: null },
    meta: { xpGained: 5000, tier: 'Diamante' },
    timestamp: new Date(Date.now() - 45 * 60000),
    reactions: { count: 28, userReacted: true },
  },
  {
    id: '3',
    type: 'course_started' as const,
    user: { id: '3', name: 'Carla Rodrigues', avatarUrl: null },
    target: { type: 'course' as const, id: '2', title: 'Gestão de Equipes Remotas' },
    meta: {},
    timestamp: new Date(Date.now() - 2 * 3600000),
    reactions: { count: 7, userReacted: false },
  },
  {
    id: '4',
    type: 'badge_earned' as const,
    user: { id: '4', name: 'Bruno Lima', avatarUrl: null },
    target: { type: 'badge' as const, id: '1', title: 'Super Mentoring' },
    meta: {},
    timestamp: new Date(Date.now() - 4 * 3600000),
    reactions: { count: 42, userReacted: false },
    comments: { count: 8 },
  },
  {
    id: '5',
    type: 'course_completed' as const,
    user: { id: '5', name: 'Patrícia Alves', avatarUrl: null },
    target: { type: 'course' as const, id: '3', title: 'Comunicação Assertiva' },
    meta: {},
    timestamp: new Date(Date.now() - 6 * 3600000),
    reactions: { count: 19, userReacted: true },
    comments: { count: 2 },
  },
]

const mockAvatars = [
  { id: '1', name: 'Renata Oliveira' },
  { id: '2', name: 'Gabriel Santos' },
  { id: '3', name: 'Carla Rodrigues' },
  { id: '4', name: 'Bruno Lima' },
  { id: '5', name: 'Patrícia Alves' },
]

const faqs = [
  {
    q: 'A Lidera é somente plataforma digital?',
    a: 'Não. O modelo é híbrido: academy digital, imersões presenciais e projetos corporativos no mesmo ecossistema.',
  },
  {
    q: 'A empresa consegue contratar algo personalizado?',
    a: 'Sim. O diagnóstico inicial define trilhas, formatos e metas de implementação para cada contexto.',
  },
  {
    q: 'Existe certificação?',
    a: 'Sim. Trilhas elegíveis liberam certificado verificável conforme critérios de conclusão.',
  },
  {
    q: 'Quanto tempo leva para começar?',
    a: 'Após o diagnóstico, a proposta é enviada em até 48h para início da implantação.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#030712] text-[#E5ECF8] selection:bg-indigo-500/30">
      <SiteHeader />

      {/* ── Premium Header Bar — gamificação + status ── */}
      <div className="border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-4">
            <Streak days={7} />
            <XPBadge xp={2450} tier="Ouro" size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="hidden sm:inline">247 pessoas online</span>
            </span>
          </div>
        </div>
      </div>

      <main className="overflow-hidden">
        {/* ── HERO — autoridade + preview da plataforma ── */}
        <section className="relative px-6 pb-28 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]" />

          <div className="relative mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            {/* Left: Copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                <Flame className="h-3 w-3" />
                500+ supervisores certificados
              </div>

              <h1 className="max-w-[600px] font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                <TypewriterText text="Formamos os líderes que sua" speed={50} delay={300} />{' '}
                <span className="text-indigo-400">
                  <TypewriterText text="operação precisa." speed={50} delay={1750} cursorColor="#6366F1" />
                </span>
              </h1>

              <p className="mt-7 max-w-[480px] text-lg leading-relaxed text-white/60">
                Diagnóstico individualizado, treinamento presencial de alto impacto
                e 60 dias de acompanhamento.{' '}
                <strong className="text-white">Resultado real.</strong>
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/treinamento/autoavaliacao"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-400 hover:shadow-indigo-400/35"
                >
                  Fazer diagnóstico gratuito
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/empresas"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-base font-bold text-white/70 transition-all hover:border-white/20 hover:text-white"
                >
                  Soluções para empresas
                </Link>
              </div>
            </div>

            {/* Right: Platform Preview Card */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                {/* Fake platform UI */}
                <div className="flex items-center gap-3 border-b border-white/5 bg-white/[0.02] px-5 py-3">
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="ml-2 h-2 w-24 rounded-full bg-white/5" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Aulas', value: '128', color: 'indigo' },
                      { label: 'Horas', value: '64h', color: 'violet' },
                      { label: 'Alunos', value: '2.4k', color: 'emerald' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                        <span className="text-lg font-bold text-white">{stat.value}</span>
                        <span className="text-[10px] uppercase tracking-wide text-white/40">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <AvatarStack avatars={mockAvatars} max={3} size="sm" />
                    <span className="text-xs text-white/50">estão aprendendo agora</span>
                  </div>
                </div>
              </div>
              {/* Glow behind card */}
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-indigo-500/[0.06] blur-2xl" />
            </div>
          </div>
        </section>

        {/* ── PROVA SOCIAL — números que importam ── */}
        <section className="border-y border-white/5 bg-[#050A12] px-6 py-14">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-12 sm:gap-16">
            {[
              { value: '500+', label: 'Supervisores treinados', icon: Users, color: '#6366F1' },
              { value: '79%', label: 'Aumento em engajamento', icon: TrendingUp, color: '#10B981' },
              { value: '98%', label: 'Recomendam o programa', icon: BadgeCheck, color: '#F59E0B' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-white">{item.value}</p>
                  <p className="text-xs font-medium text-white/40">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATÁLOGO — prateleiras Netflix-style ── */}
        <section className="px-0 py-20">
          <CourseShelf
            title="Continue aprendendo"
            subtitle="Sua jornada de desenvolvimento"
            variant="continue"
            courses={mockCourses.slice(0, 3).map((c) => ({ ...c, progressPercent: 35 }))}
            showLiveCount
            liveCount={247}
            seeAllHref="/cursos/meu-aprendizado"
            seeAllLabel="Ver progresso"
          />

          <div className="mt-8">
            <CourseShelf
              title="Em alta na comunidade"
              subtitle="Os cursos mais feitos pelos líderes"
              variant="trending"
              courses={mockCourses}
              showLiveCount
              liveCount={189}
              seeAllHref="/cursos"
              seeAllLabel="Ver todos"
            />
          </div>
        </section>

        {/* ── COMUNIDADE — activity feed + stats ── */}
        <section className="border-y border-white/5 bg-[#050A12] px-6 py-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                  </span>
                  Tempo real
                </div>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  O que está acontecendo
                </h2>
                <p className="mt-2 text-sm text-white/50">Atividade da comunidade de líderes</p>
              </div>
              <Link
                href="/comunidade"
                className="hidden items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300 sm:flex"
              >
                Ver toda comunidade
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* Activity Feed */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <ActivityFeed
                  activities={mockActivities}
                  variant="full"
                  showTime
                  maxItems={5}
                />
              </div>

              {/* Sidebar: Stats + Top learners */}
              <div className="space-y-6">
                <CommunityStats
                  totalStudents={2847}
                  activeNow={247}
                  coursesCompleted={892}
                />

                {/* Top learners this week */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Top líderes da semana</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: 'Gabriel Santos', xp: 2450, avatar: null },
                      { rank: 2, name: 'Renata Oliveira', xp: 1890, avatar: null },
                      { rank: 3, name: 'Bruno Lima', xp: 1640, avatar: null },
                    ].map((user) => (
                      <div key={user.rank} className="flex items-center gap-3">
                        <span className="w-5 text-center text-sm font-bold text-white/40">#{user.rank}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-xs font-bold text-indigo-300">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{user.name}</p>
                          <p className="text-[10px] text-amber-400">{user.xp.toLocaleString('pt-BR')} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MÉTODO — 3 etapas, visual limpo ── */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-16 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
                Nosso método
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Diagnóstico, treinamento e resultado.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: Target,
                  title: 'Diagnóstico',
                  desc: 'Autoavaliação de liderança com PDI gerado automaticamente. Você sabe exatamente onde está e o que desenvolver.',
                  color: '#F59E0B',
                },
                {
                  step: '02',
                  icon: BookOpen,
                  title: 'Treinamento Direcionado',
                  desc: 'Academy digital + imersão presencial. 8 módulos focados no que realmente precisa ser desenvolvido.',
                  color: '#6366F1',
                },
                {
                  step: '03',
                  icon: BadgeCheck,
                  title: 'Acompanhamento 60 dias',
                  desc: 'Mentoria pós-treinamento para certificar que o resultado aconteceu na prática. Sem isso, é só teoria.',
                  color: '#10B981',
                },
              ].map(({ step, icon: Icon, title, desc, color }) => (
                <div
                  key={step}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-heading text-4xl font-extrabold text-white/5">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── O QUE VOCÊ RECEBE — lista de valor ── */}
        <section className="border-y border-white/5 bg-[#050A12] px-6 py-24">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
                Programa completo
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Tudo incluso no treinamento
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Diagnóstico individualizado de liderança',
                'PDI — Plano de Desenvolvimento Individual',
                '8 módulos presenciais (16h de imersão)',
                'Autoavaliação das 5 Dimensões',
                'Ferramentas práticas para aplicar no dia seguinte',
                'Certificado verificável',
                'Mentoria de acompanhamento 30 e 60 dias',
                'Acesso à Academy digital',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS — curtos, com resultado ── */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Resultados reais
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Quem já passou pelo programa
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  quote: 'Em 90 dias o treinamento virou sistema de execução gerencial.',
                  name: 'Carlos Mendes',
                  role: 'Diretor de RH · Grupo Industrial Alfa',
                  result: '43% menos turnover',
                  initial: 'C',
                },
                {
                  quote: 'A operação ganhou clareza e os times passaram a executar com consistência.',
                  name: 'Fernanda Pacheco',
                  role: 'CEO · TechBR Soluções',
                  result: 'Meta de 62% para 91%',
                  initial: 'F',
                },
                {
                  quote: 'Conseguimos ligar formação e performance com dados reais de aplicação.',
                  name: 'Ricardo Albuquerque',
                  role: 'COO · Rede Varejista Nacional',
                  result: 'T&D integrado ao painel',
                  initial: 'R',
                },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/5 bg-white/[0.02] p-7">
                  <p className="text-base leading-relaxed text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    {t.result}
                  </div>
                  <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-sm font-bold text-indigo-300">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOIS CAMINHOS — B2C e B2B lado a lado ── */}
        <section className="border-y border-white/5 bg-[#050A12] px-6 py-24">
          <div className="mx-auto grid max-w-[1080px] gap-6 lg:grid-cols-2">
            {/* Para você */}
            <div className="rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent p-8 transition-all hover:border-amber-500/20">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <PlayCircle className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-400">Para você</p>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-white">
                Treinamento Individual
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Workshop presencial, autoavaliação, PDI personalizado e acesso à Academy digital.
              </p>
              <Link
                href="/treinamento/modulo-1"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400"
              >
                Ver próxima turma
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Para sua empresa */}
            <div className="rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-transparent p-8 transition-all hover:border-indigo-500/20">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Users className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400">Para empresas</p>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-white">
                Programa Corporativo
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Diagnóstico, trilha personalizada, dashboard de acompanhamento e mentoria dedicada.
              </p>
              <Link
                href="/empresas"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400"
              >
                Solicitar proposta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-[700px] text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-indigo-500/10 p-4">
              <div className="rounded-full bg-indigo-500/20 p-3">
                <Flame className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Descubra seu perfil de liderança em 5 minutos.
            </h2>
            <p className="mx-auto mt-5 max-w-[500px] text-base leading-relaxed text-white/50">
              Autoavaliação gratuita com diagnóstico e Plano de Desenvolvimento Individual gerado na hora.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-400 hover:shadow-indigo-400/35"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/5564996099020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-base font-bold text-white/70 transition-all hover:border-white/20 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-t border-white/5 bg-[#050A12] px-6 py-20">
          <div className="mx-auto max-w-[700px]">
            <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-white">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-white/40 transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="border-t border-white/5 px-5 py-4 text-sm leading-relaxed text-white/50">
                    {item.a}
                  </p>
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