'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  PlayCircle,
  RotateCcw,
} from 'lucide-react'

import { getCourseDetails, markLessonAccess, markLessonCompleted } from '@/lib/actions/lms'
import type { CourseDetails } from '@/lib/actions/lms'
import { Progress } from '@/types/database'

type CourseModule = CourseDetails['course']['modules'][number]
type CourseLesson = CourseModule['lessons'][number]

type LessonEntry = CourseLesson & {
  moduleId: string
  moduleTitle: string
}

function formatMinutes(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`
}

export default function AulaPage({ params }: { params: Promise<{ course_id: string; lesson_id: string }> }) {
  const { course_id, lesson_id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [notFoundState, setNotFoundState] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseDetails | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    setNotFoundState(false)

    try {
      const data = await getCourseDetails(course_id)
      if (!data) {
        setNotFoundState(true)
        return
      }

      const { getInitialAssessment } = await import('@/lib/actions/assessment')
      const assessment = await getInitialAssessment(data.enrollmentId)

      if (!assessment) {
        router.replace(`/dashboard/cursos/${course_id}/avaliacao-inicial`)
        return
      }

      setCourseData(data)
      void markLessonAccess(data.enrollmentId, lesson_id)
    } catch (error) {
      console.error('Error loading lesson page:', error)
      setLoadError('Não foi possível carregar a aula. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [course_id, lesson_id, router])

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (notFoundState) return notFound()

  if (loading && !courseData) {
    return (
      <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
        <div className="h-16 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
        <div className="h-40 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
            <div className="h-28 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
          </div>
          <div className="h-[560px] animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
        </div>
      </div>
    )
  }

  if (!courseData && loadError) {
    return (
      <div className="mx-auto flex min-h-[55vh] w-full max-w-[860px] items-center p-4 lg:p-8">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-7">
          <p className="text-lg font-bold text-red-800">Falha ao carregar esta aula</p>
          <p className="mt-2 text-sm text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!courseData) return null

  const { course, progress, enrollmentId } = courseData

  const sortedModules = [...course.modules]
    .sort((a, b) => a.order_index - b.order_index)
    .map((moduleItem) => ({
      ...moduleItem,
      lessons: [...moduleItem.lessons].sort((a, b) => a.order_index - b.order_index),
    }))

  const lessons: LessonEntry[] = sortedModules.flatMap((moduleItem) =>
    moduleItem.lessons.map((lessonItem) => ({
      ...lessonItem,
      moduleId: moduleItem.id,
      moduleTitle: moduleItem.title,
    }))
  )

  const currentIndex = lessons.findIndex((item) => item.id === lesson_id)
  if (currentIndex < 0) return notFound()

  const currentLesson = lessons[currentIndex]
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  const isCompleted = progress.some((item: Progress) => item.lesson_id === lesson_id && item.is_completed)
  const completedLessons = lessons.filter((item) =>
    progress.some((progressItem: Progress) => progressItem.lesson_id === item.id && progressItem.is_completed)
  ).length
  const startedLessons = lessons.filter((item) => progress.some((progressItem: Progress) => progressItem.lesson_id === item.id)).length
  const progressPercent = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0

  const handleMarkComplete = async () => {
    setMarking(true)
    setLoadError(null)

    const result = await markLessonCompleted(enrollmentId, lesson_id, !isCompleted)
    if (!result.success) {
      setLoadError(result.error || 'Falha ao atualizar o progresso da aula.')
      setMarking(false)
      return
    }

    const updated = await getCourseDetails(course_id)
    if (!updated) {
      setNotFoundState(true)
      setMarking(false)
      return
    }

    setCourseData(updated)
    void markLessonAccess(updated.enrollmentId, lesson_id)
    setMarking(false)
  }

  const moduleCompletedCount = sortedModules.filter((moduleItem) => {
    const moduleCompleted = moduleItem.lessons.filter((lessonItem) =>
      progress.some((progressItem: Progress) => progressItem.lesson_id === lessonItem.id && progressItem.is_completed)
    ).length
    return moduleCompleted === moduleItem.lessons.length && moduleItem.lessons.length > 0
  }).length

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/cursos/${course_id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F9FE]"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para trilha
        </Link>

        <div className="flex items-center gap-2">
          {previousLesson ? (
            <Link
              href={`/dashboard/cursos/${course.id}/aula/${previousLesson.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-[#D8E2EF] bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B] transition-colors hover:bg-[#F5F9FE]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </Link>
          ) : null}
          {nextLesson ? (
            <Link
              href={`/dashboard/cursos/${course.id}/aula/${nextLesson.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-[#D8E2EF] bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B] transition-colors hover:bg-[#F5F9FE]"
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-7 text-white shadow-[0_20px_45px_rgba(2,6,23,0.5)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1E88E5]/20 blur-[80px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8CB8E7]">
            Episódio {currentIndex + 1} de {lessons.length} • {currentLesson.moduleTitle}
          </p>
          <h1 className="mt-2 max-w-4xl text-3xl font-extrabold leading-tight">{currentLesson.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#9AB2CE]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatMinutes(currentLesson.duration_seconds)}
            </span>
            <span className="rounded-full border border-[#2F4A6D] bg-[#10213A] px-2.5 py-1">
              {isCompleted ? 'Concluída' : 'Em andamento'}
            </span>
          </div>
        </div>
      </section>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#1A2B46] bg-[#060D1A] shadow-[0_20px_40px_rgba(2,6,23,0.45)]">
            {currentLesson.video_url ? (
              <VideoPlayerInline url={currentLesson.video_url} thumbnail={course.thumbnail_url} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#9AB2CE]">
                <PlayCircle className="h-14 w-14 opacity-35" />
                <p className="text-sm font-semibold">Vídeo não disponível no momento.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Status da aula</p>
                <p className={`mt-1 text-sm font-bold ${isCompleted ? 'text-[#2E7D32]' : 'text-[#0B4A8F]'}`}>
                  {isCompleted ? 'Aula marcada como concluída' : 'Aula em andamento'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                    isCompleted ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#DCF1DE]' : 'bg-[#1E88E5] text-white hover:bg-[#1565C0]'
                  }`}
                >
                  {marking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluída'}
                </button>

                {nextLesson ? (
                  <Link
                    href={`/dashboard/cursos/${course.id}/aula/${nextLesson.id}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-5 text-sm font-bold text-[#334155] transition-colors hover:bg-[#F5F9FE]"
                  >
                    Próxima aula
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0F172A]">Material complementar</h2>
            {currentLesson.content_text ? (
              <div className="prose prose-slate mt-4 max-w-none text-sm leading-relaxed text-[#334155]">
                <p>{currentLesson.content_text}</p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-4 text-sm text-[#64748B]">
                Esta aula ainda não possui material complementar cadastrado.
              </div>
            )}
          </article>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Painel de progresso</p>
            <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{progressPercent}% concluído</p>
            <p className="mt-1 text-xs text-[#64748B]">
              {completedLessons} de {lessons.length} aulas concluídas • {startedLessons} iniciadas
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EEF7]">
              <div className="h-full rounded-full bg-[#1E88E5] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: 'Módulos concluídos', value: `${moduleCompletedCount}/${sortedModules.length}` },
                { label: 'Aulas concluídas', value: `${completedLessons}/${lessons.length}` },
                { label: 'Aulas iniciadas', value: `${startedLessons}/${lessons.length}` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#E2EAF5] bg-[#F8FBFF] px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{item.label}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#0F172A]">{item.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-4 shadow-sm">
            <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">Episódios da trilha</p>
            <div className="mt-3 max-h-[58vh] space-y-3 overflow-y-auto pr-1">
              {sortedModules.map((moduleItem, moduleIndex) => (
                <div key={moduleItem.id} className="rounded-xl border border-[#E2EAF5] bg-[#FAFCFF] p-2">
                  <p className="px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                    Módulo {moduleIndex + 1} • {moduleItem.title}
                  </p>
                  <div className="space-y-1.5">
                    {moduleItem.lessons.map((lessonItem) => {
                      const lessonDone = progress.some((item: Progress) => item.lesson_id === lessonItem.id && item.is_completed)
                      const lessonStarted = progress.some((item: Progress) => item.lesson_id === lessonItem.id)
                      const lessonActive = lessonItem.id === lesson_id

                      return (
                        <Link
                          key={lessonItem.id}
                          href={`/dashboard/cursos/${course.id}/aula/${lessonItem.id}`}
                          className={`flex items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition-all ${
                            lessonActive ? 'border border-[#C4D8F0] bg-[#EAF3FC] text-[#0B4A8F]' : 'text-[#334155] hover:bg-white'
                          }`}
                        >
                          <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${lessonDone ? 'text-[#4CAF35]' : lessonStarted ? 'text-[#1E88E5]' : 'text-[#B1C0D4]'}`} />
                          <span className="line-clamp-2">{lessonItem.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}

function VideoPlayerInline({ url, thumbnail }: { url: string; thumbnail?: string | null }) {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)

  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&color=white&iv_load_policy=3&playsinline=1`}
        title="Aula"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    )
  }

  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}?color=1E88E5&portrait=0`}
        title="Aula"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    )
  }

  return (
    <video src={url} controls poster={thumbnail ?? undefined} className="absolute inset-0 h-full w-full object-cover" preload="metadata">
      Seu navegador não suporta este vídeo.
    </video>
  )
}
