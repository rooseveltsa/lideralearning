import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowRight, Award, CheckCircle2, Clock3, Lock, PlayCircle } from 'lucide-react'

import { getInitialAssessment } from '@/lib/actions/assessment'
import { getCourseDetails } from '@/lib/actions/lms'

type CourseLesson = {
  id: string
  title: string
  duration_seconds: number
  order_index: number
}

type CourseModule = {
  id: string
  title: string
  order_index: number
  lessons: CourseLesson[]
}

type CourseWithLessons = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  modules: CourseModule[]
}

function formatMinutes(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`
}

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours <= 0) return `${minutes} min`
  if (remainingMinutes <= 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}min`
}

export default async function CoursePage({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params
  const courseData = await getCourseDetails(course_id)

  if (!courseData) notFound()

  const { course, progress, enrollmentId } = courseData
  const typedCourse = course as CourseWithLessons

  const assessment = await getInitialAssessment(enrollmentId)
  if (!assessment) redirect(`/dashboard/cursos/${course_id}/avaliacao-inicial`)

  const sortedModules = typedCourse.modules
    .map((moduleItem) => ({
      ...moduleItem,
      lessons: [...moduleItem.lessons].sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => a.order_index - b.order_index)

  const allLessons = sortedModules.flatMap((moduleItem) => moduleItem.lessons)
  const completedLessonIds = new Set(progress.filter((item) => item.is_completed).map((item) => item.lesson_id))
  const accessedLessonIds = new Set(progress.map((item) => item.lesson_id))
  const lessonOrderMap = new Map(allLessons.map((lesson, index) => [lesson.id, index + 1]))

  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
  const accessedLessons = allLessons.filter((lesson) => accessedLessonIds.has(lesson.id)).length
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const nextLesson = allLessons.find((lesson) => !completedLessonIds.has(lesson.id)) ?? null
  const firstLesson = allLessons[0] ?? null
  const totalDurationSeconds = allLessons.reduce((acc, lesson) => acc + lesson.duration_seconds, 0)

  const continueHref = nextLesson
    ? `/dashboard/cursos/${typedCourse.id}/aula/${nextLesson.id}`
    : firstLesson
      ? `/dashboard/cursos/${typedCourse.id}/aula/${firstLesson.id}`
      : '#'

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-8 p-4 lg:p-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        {typedCourse.thumbnail_url ? (
          <Image
            src={typedCourse.thumbnail_url}
            alt={typedCourse.title}
            fill
            sizes="100vw"
            unoptimized
            className="absolute inset-0 object-cover opacity-30"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(6,13,26,0.96),rgba(6,13,26,0.88)_52%,rgba(6,13,26,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(30,136,229,0.22),transparent_38%)]" />

        <div className="relative p-8 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Trilha de treinamento</p>
          <h1 className="mt-3 max-w-4xl font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">{typedCourse.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#A9BDD8]">
            {typedCourse.description || 'Jornada estruturada para evolução prática de liderança com aplicação direta em contexto profissional.'}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Módulos', value: sortedModules.length.toString() },
              { label: 'Aulas', value: totalLessons.toString() },
              { label: 'Carga estimada', value: formatDuration(totalDurationSeconds) },
              { label: 'Progresso', value: `${progressPercentage}%` },
            ].map((item) => (
              <article key={item.label} className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">{item.label}</p>
                <p className="mt-1 text-xl font-extrabold text-white">{item.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {firstLesson ? (
              <Link
                href={continueHref}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                {progressPercentage === 100 ? 'Revisitar formação' : 'Continuar trilha'}
                <PlayCircle className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href="/dashboard/cursos"
              className="inline-flex items-center gap-2 rounded-xl border border-[#35517A] px-5 py-3 text-sm font-bold text-[#D0E1F4] transition-colors hover:border-[#4E78AF] hover:text-white"
            >
              Voltar à biblioteca
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="space-y-5">
          {sortedModules.map((moduleItem, moduleIndex) => {
            const moduleCompleted = moduleItem.lessons.filter((lessonItem) => completedLessonIds.has(lessonItem.id)).length
            const moduleProgress = moduleItem.lessons.length > 0 ? Math.round((moduleCompleted / moduleItem.lessons.length) * 100) : 0

            return (
              <article key={moduleItem.id} className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">Módulo {moduleIndex + 1}</p>
                    <h2 className="mt-1 text-xl font-extrabold text-[#0F172A]">{moduleItem.title}</h2>
                  </div>
                  <div className="rounded-xl border border-[#DFE8F4] bg-[#F7FAFE] px-3 py-2 text-xs font-semibold text-[#334155]">
                    {moduleCompleted}/{moduleItem.lessons.length} aulas • {moduleProgress}%
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E6EEF8]">
                  <div className="h-full rounded-full bg-[#1E88E5] transition-all duration-700" style={{ width: `${moduleProgress}%` }} />
                </div>

                <div className="mt-4 space-y-2.5">
                  {moduleItem.lessons.map((lessonItem) => {
                    const completed = completedLessonIds.has(lessonItem.id)
                    const isNext = nextLesson?.id === lessonItem.id
                    const watched = accessedLessonIds.has(lessonItem.id)
                    const lessonOrder = lessonOrderMap.get(lessonItem.id)

                    return (
                      <Link
                        key={lessonItem.id}
                        href={`/dashboard/cursos/${typedCourse.id}/aula/${lessonItem.id}`}
                        className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                          isNext
                            ? 'border-[#BFD4EC] bg-[#ECF4FD] hover:border-[#9FBFE4] hover:bg-[#E5F0FB]'
                            : 'border-[#E6EDF7] bg-[#FAFCFF] hover:border-[#C6D9F0] hover:bg-white'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D1DCEB] bg-white text-[11px] font-bold text-[#4B5F7D]">
                            {lessonOrder}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0F172A] group-hover:text-[#0B4A8F]">{lessonItem.title}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-[#64748B]">
                              {completed ? 'Concluída' : watched ? 'Em andamento' : isNext ? 'Próxima recomendada' : 'Não iniciada'}
                            </p>
                          </div>
                        </div>

                        <div className="ml-4 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatMinutes(lessonItem.duration_seconds)}
                          </span>
                          {completed ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-[#4CAF35]" />
                          ) : (
                            <PlayCircle className={`h-4.5 w-4.5 ${isNext ? 'text-[#0B4A8F]' : 'text-[#9BB0C9]'}`} />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Painel da trilha</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#0F172A]">{progressPercentage}% concluído</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {completedLessons} de {totalLessons} aulas concluídas • {accessedLessons} iniciadas
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EEF7]">
              <div className="h-full rounded-full bg-[#1E88E5] transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#DCE7F4] bg-[#F7FBFF] px-3 py-2.5 text-xs font-semibold text-[#334155]">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" />
                Autoavaliação inicial concluída
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#DCE7F4] bg-[#F7FBFF] px-3 py-2.5 text-xs font-semibold text-[#334155]">
                <Lock className="h-4 w-4 text-[#0B4A8F]" />
                Trilha liberada para execução
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Próxima ação</p>
            {progressPercentage === 100 ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-800">
                  Formação concluída. Seu certificado está disponível para emissão.
                </div>
                <Link
                  href={`/dashboard/certificado/${typedCourse.id}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-bold text-yellow-950 transition-colors hover:bg-yellow-500"
                >
                  <Award className="h-4 w-4" />
                  Emitir certificado
                </Link>
              </div>
            ) : nextLesson ? (
              <Link
                href={`/dashboard/cursos/${typedCourse.id}/aula/${nextLesson.id}`}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                Continuar trilha
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mt-4 text-sm text-[#64748B]">Ainda não há aulas cadastradas para esta trilha.</p>
            )}
          </article>
        </aside>
      </div>
    </div>
  )
}
