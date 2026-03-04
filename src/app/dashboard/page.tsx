import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Flame, PlayCircle, Sparkles, Trophy } from 'lucide-react'

import { getUserLearningSnapshot } from '@/lib/actions/lms'
import CourseShelfCard from '@/components/dashboard/CourseShelfCard'
import { createClient } from '@/lib/supabase/server'

function getContinueHref(courseId: string, nextLessonId: string | null) {
  if (nextLessonId) return `/dashboard/cursos/${courseId}/aula/${nextLessonId}`
  return `/dashboard/cursos/${courseId}`
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const snapshot = await getUserLearningSnapshot()

  const rankedCourses = snapshot.courses
    .slice()
    .sort((a, b) => {
      if (a.lastAccessedAt && b.lastAccessedAt) return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      if (a.lastAccessedAt) return -1
      if (b.lastAccessedAt) return 1
      return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    })

  const inProgressCourses = rankedCourses.filter((course) => course.progressPercent < 100)
  const completedCourses = rankedCourses.filter((course) => course.progressPercent === 100)
  const continueCourse = inProgressCourses[0] ?? rankedCourses[0] ?? null

  const totalXp = snapshot.totals.completedLessons * 45 + snapshot.activityDaysLast30 * 20 + snapshot.totals.activeCourses * 30
  const level = Math.max(1, Math.floor(totalXp / 500) + 1)
  const xpInLevel = totalXp - (level - 1) * 500
  const xpProgress = Math.max(0, Math.min(100, Math.round((xpInLevel / 500) * 100)))

  const badges = [
    {
      title: 'Primeiro Marco',
      hint: 'Concluir a primeira aula.',
      unlocked: snapshot.totals.completedLessons >= 1,
    },
    {
      title: 'Ritmo Constante',
      hint: 'Estudar em pelo menos 7 dias no mês.',
      unlocked: snapshot.activityDaysLast30 >= 7,
    },
    {
      title: 'Execução Forte',
      hint: 'Finalizar 20 aulas acumuladas.',
      unlocked: snapshot.totals.completedLessons >= 20,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1260px] space-y-8 p-4 lg:p-8">
      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-8 text-white shadow-[0_22px_48px_rgba(2,6,23,0.55)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(30,136,229,0.22),transparent_40%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#90B6DD]">Controle da jornada</p>
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              Plataforma de aprendizagem com dinâmica de stream e progresso real por trilha.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#A9BDD8]">
              Você tem {snapshot.totals.activeCourses} {snapshot.totals.activeCourses === 1 ? 'formação ativa' : 'formações ativas'} e{' '}
              {snapshot.totals.completedLessons} aulas concluídas.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={continueCourse ? getContinueHref(continueCourse.courseId, continueCourse.nextLessonId) : '/dashboard/cursos'}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                {continueCourse ? 'Retomar agora' : 'Abrir biblioteca'}
                <PlayCircle className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/cursos"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2E4467] px-5 py-3 text-sm font-bold text-[#D3E1F2] transition-colors hover:border-[#496A97] hover:text-white"
              >
                Ver todas as trilhas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Gamificação</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#0F172A]">Nível {level}</h2>
          <p className="mt-1 text-sm text-[#64748B]">{totalXp} XP acumulado</p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E4ECF7]">
            <div className="h-full rounded-full bg-[#1E88E5]" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="mt-2 text-xs text-[#64748B]">{500 - xpInLevel} XP para o próximo nível.</p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F7FAFE] px-3 py-2.5 text-xs font-semibold text-[#334155]">
              <Flame className="h-4 w-4 text-[#F57C00]" />
              {snapshot.activityDaysLast30} dias com estudo nos últimos 30 dias
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F7FAFE] px-3 py-2.5 text-xs font-semibold text-[#334155]">
              <Sparkles className="h-4 w-4 text-[#0B4A8F]" />
              Progresso geral: {snapshot.totals.overallPercent}%
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Trilhas ativas', value: snapshot.totals.activeCourses.toString(), detail: 'programas em andamento' },
          { label: 'Aulas concluídas', value: snapshot.totals.completedLessons.toString(), detail: 'conteúdo finalizado' },
          { label: 'Carga da biblioteca', value: snapshot.totals.totalLessons.toString(), detail: 'aulas disponíveis' },
          { label: 'Aulas em progresso', value: snapshot.totals.trackedLessons.toString(), detail: 'itens com registro' },
        ].map((card) => (
          <article key={card.label} className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{card.value}</p>
            <p className="mt-1 text-xs text-[#64748B]">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-6 shadow-[0_18px_40px_rgba(2,6,23,0.5)] md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#90B6DD]">Continue assistindo</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">Trilhas em execução</h2>
          </div>
          <Link href="/dashboard/cursos" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.13em] text-[#A8C5E7] hover:text-white">
            Abrir biblioteca completa
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {inProgressCourses.length === 0 ? (
          <div className="rounded-2xl border border-[#293E5E] bg-[#0C1729] px-6 py-10 text-center">
            <p className="text-lg font-bold text-white">Nenhuma trilha em andamento no momento.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#9AB2CE]">Escolha um programa para iniciar o fluxo de aprendizagem e destravar novos níveis.</p>
            <Link
              href="/cursos"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
            >
              Explorar catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {inProgressCourses.slice(0, 3).map((course) => (
              <CourseShelfCard key={course.enrollmentId} course={course} tone="dark" />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#0B4A8F]" />
            <h2 className="text-xl font-extrabold text-[#0F172A]">Conquistas da jornada</h2>
          </div>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className={`rounded-xl border px-4 py-3 ${
                  badge.unlocked ? 'border-[#CFE6D2] bg-[#F1FAF2]' : 'border-[#E5ECF6] bg-[#F8FAFD]'
                }`}
              >
                <p className={`text-sm font-bold ${badge.unlocked ? 'text-[#2E7D32]' : 'text-[#475569]'}`}>{badge.title}</p>
                <p className="mt-1 text-xs text-[#64748B]">{badge.hint}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Concluídas</p>
              <h2 className="mt-2 text-xl font-extrabold text-[#0F172A]">Trilhas finalizadas</h2>
            </div>
            <Link href="/dashboard/cursos" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.13em] text-[#0B4A8F] hover:text-[#08376B]">
              Ver todas
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {completedCourses.length === 0 ? (
            <div className="rounded-xl border border-[#E5ECF6] bg-[#F8FAFD] px-4 py-5 text-sm text-[#64748B]">
              Conclua uma trilha para liberar certificado e histórico de conclusão nesta área.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {completedCourses.slice(0, 2).map((course) => (
                <CourseShelfCard key={course.enrollmentId} course={course} tone="light" />
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
