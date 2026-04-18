'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, List, X, ChevronRight, PlayCircle } from 'lucide-react'

type Lesson = {
  id: string
  title: string
  video_url: string | null
  duration_seconds: number
}

type Module = {
  id: string
  title: string
  lessons: Lesson[]
}

type Progress = {
  lesson_id: string
  is_completed: boolean
}

interface PremiumVideoPlayerProps {
  videoUrl: string
  thumbnail?: string | null
  currentLessonId: string
  courseId: string
  modules: Module[]
  progress: Progress[]
}

function formatDuration(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`
}

function getYouTubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&color=white&iv_load_policy=3&playsinline=1` : null
}

function getVimeoEmbed(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? `https://player.vimeo.com/video/${match[1]}?color=6366F1&portrait=0&title=0&byline=0` : null
}

export function PremiumVideoPlayer({
  videoUrl,
  thumbnail,
  currentLessonId,
  courseId,
  modules,
  progress,
}: PremiumVideoPlayerProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const sortedModules = [...modules].sort((a, b) => {
    const moduleOrder: Record<string, number> = {}
    modules.forEach((m, i) => { moduleOrder[m.id] = i })
    return (moduleOrder[a.id] || 0) - (moduleOrder[b.id] || 0)
  })

  const allLessons = sortedModules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  )
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const isLessonCompleted = (lessonId: string) =>
    progress.some((p) => p.lesson_id === lessonId && p.is_completed)
  const isLessonStarted = (lessonId: string) =>
    progress.some((p) => p.lesson_id === lessonId)

  const youtubeEmbed = getYouTubeEmbed(videoUrl)
  const vimeoEmbed = getVimeoEmbed(videoUrl)

  return (
    <div className="relative flex h-full flex-col lg:flex-row">
      {/* Mobile panel toggle */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-xl bg-black/60 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm lg:hidden"
        aria-label="Abrir lista de aulas"
      >
        <List className="h-4 w-4" />
        Aulas
      </button>

      {/* Mobile overlay backdrop */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Mobile slide-in panel */}
      <aside
        className={`fixed bottom-0 right-0 top-0 z-40 w-full max-w-sm overflow-y-auto border-l border-white/10 bg-[#0A0F1E] transition-transform duration-300 lg:hidden ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0A0F1E] p-4">
          <p className="text-sm font-bold text-white">Conteúdo do curso</p>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Fechar painel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          {sortedModules.map((module, moduleIndex) => (
            <div key={module.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400">
                Módulo {moduleIndex + 1} • {module.title}
              </p>
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const done = isLessonCompleted(lesson.id)
                  const started = isLessonStarted(lesson.id)
                  const active = lesson.id === currentLessonId
                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/cursos/${courseId}/aula/${lesson.id}`}
                      onClick={() => setIsPanelOpen(false)}
                      className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        active
                          ? 'bg-indigo-500/15 text-indigo-200'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          done ? 'text-emerald-400' : started ? 'text-indigo-400' : 'text-white/20'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2">{lesson.title}</span>
                        {lesson.duration_seconds > 0 && (
                          <span className="mt-0.5 block text-[10px] text-white/30">
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        )}
                      </div>
                      {active && <ChevronRight className="h-4 w-4 shrink-0 text-indigo-400" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Video area */}
      <div className="relative flex-1">
        <div className="relative aspect-video overflow-hidden bg-black">
          {youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title="Aula em vídeo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : vimeoEmbed ? (
            <iframe
              src={vimeoEmbed}
              title="Aula em vídeo"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              poster={thumbnail ?? undefined}
              className="absolute inset-0 h-full w-full object-cover"
              preload="metadata"
            >
              Seu navegador não suporta este formato de vídeo.
            </video>
          )}

          {/* Fallback for no video */}
          {!videoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
              <PlayCircle className="h-14 w-14" />
              <p className="text-sm font-semibold">Vídeo não disponível</p>
            </div>
          )}
        </div>

        {/* Lesson navigation below video */}
        <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-[#030712] px-4 py-3">
          {previousLesson ? (
            <Link
              href={`/dashboard/cursos/${courseId}/aula/${previousLesson.id}`}
              className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : (
            <div />
          )}
          <span className="text-[10px] text-white/30">
            {currentIndex + 1} / {allLessons.length}
          </span>
          {nextLesson ? (
            <Link
              href={`/dashboard/cursos/${courseId}/aula/${nextLesson.id}`}
              className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-white/50 hover:text-white transition-colors"
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Desktop persistent side panel */}
      <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-white/5 bg-[#0A0F1E] lg:block">
        <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0A0F1E] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400">Episódios da trilha</p>
        </div>
        <div className="space-y-3 p-4">
          {sortedModules.map((module, moduleIndex) => (
            <div key={module.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                Módulo {moduleIndex + 1} • {module.title}
              </p>
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const done = isLessonCompleted(lesson.id)
                  const started = isLessonStarted(lesson.id)
                  const active = lesson.id === currentLessonId
                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/cursos/${courseId}/aula/${lesson.id}`}
                      className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        active
                          ? 'bg-indigo-500/15 text-indigo-200'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          done ? 'text-emerald-400' : started ? 'text-indigo-400' : 'text-white/20'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2">{lesson.title}</span>
                        {lesson.duration_seconds > 0 && (
                          <span className="mt-0.5 block text-[10px] text-white/30">
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        )}
                      </div>
                      {active && <ChevronRight className="h-4 w-4 shrink-0 text-indigo-400" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default PremiumVideoPlayer