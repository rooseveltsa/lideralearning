import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Target } from 'lucide-react'

import type { UserCourseProgressSummary } from '@/lib/actions/lms'

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

function getContinueHref(course: UserCourseProgressSummary) {
  if (course.nextLessonId) return `/dashboard/cursos/${course.courseId}/aula/${course.nextLessonId}`
  return `/dashboard/cursos/${course.courseId}`
}

function getLastAccessLabel(lastAccessedAt: string | null) {
  if (!lastAccessedAt) return 'Ainda não iniciado'
  return `Último acesso em ${shortDate.format(new Date(lastAccessedAt))}`
}

export default function CourseShelfCard({
  course,
  tone = 'dark',
}: {
  course: UserCourseProgressSummary
  tone?: 'dark' | 'light'
}) {
  const href = getContinueHref(course)
  const completedLabel =
    course.totalLessons > 0
      ? `${course.completedLessons} de ${course.totalLessons} aulas`
      : `${course.completedLessons} aulas concluídas`

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5 ${
        tone === 'dark'
          ? 'border-[#1E2E48] bg-[#0A1322] hover:border-[#2C486E] hover:shadow-[0_18px_34px_rgba(3,8,19,0.45)]'
          : 'border-[#D9E3F0] bg-white hover:border-[#C0D3E8] hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#101A2D]">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full items-center justify-center ${tone === 'dark' ? 'text-[#6E89AB]' : 'text-[#40638A]'}`}>
            <Target className="h-10 w-10" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-[#1E88E5]" style={{ width: `${course.progressPercent}%` }} />
          </div>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white">{course.progressPercent}% concluído</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className={`line-clamp-2 text-lg font-extrabold ${tone === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>{course.title}</h3>
        <p className={`mt-2 text-xs ${tone === 'dark' ? 'text-[#95A9C5]' : 'text-[#64748B]'}`}>{completedLabel}</p>
        <p className={`mt-1 text-xs ${tone === 'dark' ? 'text-[#95A9C5]' : 'text-[#64748B]'}`}>{getLastAccessLabel(course.lastAccessedAt)}</p>
        <span
          className={`mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.13em] ${
            tone === 'dark' ? 'text-[#A8C5E7]' : 'text-[#0B4A8F]'
          }`}
        >
          Retomar
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
