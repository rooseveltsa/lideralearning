import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CheckCircle2, LibraryBig, PlayCircle, Sparkles } from 'lucide-react'

import CourseShelfCard from '@/components/dashboard/CourseShelfCard'
import { getUserLearningSnapshot } from '@/lib/actions/lms'
import { createClient } from '@/lib/supabase/server'

export default async function CursosPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const snapshot = await getUserLearningSnapshot()
  const { success } = await searchParams

  const orderedCourses = snapshot.courses
    .slice()
    .sort((a, b) => {
      if (a.lastAccessedAt && b.lastAccessedAt) return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      if (a.lastAccessedAt) return -1
      if (b.lastAccessedAt) return 1
      return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    })

  const continueWatching = orderedCourses.filter((course) => course.trackedLessons > 0 && course.progressPercent < 100)
  const readyToStart = orderedCourses.filter((course) => course.trackedLessons === 0)
  const completed = orderedCourses.filter((course) => course.progressPercent === 100)

  return (
    <div className="mx-auto w-full max-w-[1260px] space-y-8 p-4 lg:p-8">
      {success === 'true' ? (
        <div className="rounded-2xl border border-[#4CAF35]/30 bg-[#4CAF35]/10 px-5 py-4 text-[#0F172A]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF35] text-white">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold">Pagamento confirmado e acesso liberado.</p>
              <p className="text-xs text-[#334155]">Seu programa já está disponível na biblioteca.</p>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(30,136,229,0.2),transparent_38%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Biblioteca do aluno</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Stream de treinamentos com progressão por trilha.</h1>
            <p className="mt-4 text-sm leading-relaxed text-[#A9BDD8]">
              {snapshot.totals.activeCourses} formações ativas, {snapshot.totals.completedLessons} aulas concluídas e {snapshot.totals.overallPercent}% de progresso global.
            </p>
          </div>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 rounded-xl border border-[#2E4467] px-5 py-3 text-sm font-bold text-[#D3E1F2] transition-colors hover:border-[#496A97] hover:text-white"
          >
            Adquirir nova formação
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {orderedCourses.length === 0 ? (
        <section className="rounded-3xl border border-[#D8E2EF] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D8E2EF] bg-[#F3F8FE] text-[#0B4A8F]">
            <LibraryBig className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-[#0F172A]">Sua biblioteca está vazia</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#64748B]">
            Escolha um programa no catálogo para iniciar sua jornada e liberar progresso, certificação e recomendações.
          </p>
          <Link
            href="/cursos"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            Ir para o catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Continue assistindo</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Em andamento</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                <PlayCircle className="h-3.5 w-3.5" />
                {continueWatching.length} trilhas
              </span>
            </div>

            {continueWatching.length === 0 ? (
              <div className="rounded-2xl border border-[#D8E2EF] bg-white px-5 py-6 text-sm text-[#64748B]">
                Nenhuma trilha iniciada ainda. Selecione um programa abaixo para começar.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {continueWatching.map((course) => (
                  <CourseShelfCard key={course.enrollmentId} course={course} tone="light" />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Prontas para iniciar</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Sua fila de início</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                <Sparkles className="h-3.5 w-3.5" />
                {readyToStart.length} trilhas
              </span>
            </div>

            {readyToStart.length === 0 ? (
              <div className="rounded-2xl border border-[#D8E2EF] bg-white px-5 py-6 text-sm text-[#64748B]">
                Todas as trilhas já foram iniciadas.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {readyToStart.map((course) => (
                  <CourseShelfCard key={course.enrollmentId} course={course} tone="light" />
                ))}
              </div>
            )}
          </section>

          {completed.length > 0 ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Concluídas</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Trilhas finalizadas</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {completed.length} trilhas
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {completed.map((course) => (
                  <CourseShelfCard key={course.enrollmentId} course={course} tone="light" />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
