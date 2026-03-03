import { notFound, redirect } from 'next/navigation'
import { getCourseDetails } from '@/lib/actions/lms'
import { getInitialAssessment } from '@/lib/actions/assessment'
import AvaliacaoInicialForm from '@/components/dashboard/AvaliacaoInicialForm'

export default async function AvaliacaoInicialPage({
  params,
}: {
  params: Promise<{ course_id: string }>
}) {
  const { course_id } = await params
  const courseData = await getCourseDetails(course_id)

  if (!courseData) notFound()

  const { course, enrollmentId } = courseData

  // Se já respondeu, redireciona direto para o curso
  const assessment = await getInitialAssessment(enrollmentId)
  if (assessment) {
    redirect(`/dashboard/cursos/${course_id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header da avaliação */}
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">
            {course.title}
          </p>
          <h1 className="text-xl font-heading font-extrabold text-[#111827] tracking-tight">
            Passo 1 — Autoavaliação Inicial
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Leva cerca de 5 minutos · 7 contextos de liderança
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-6 py-12">
        <AvaliacaoInicialForm enrollmentId={enrollmentId} courseId={course_id} />
      </div>
    </div>
  )
}
