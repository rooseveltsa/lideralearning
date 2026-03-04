import { notFound, redirect } from 'next/navigation'
import { CheckCircle2, ClipboardCheck, Timer } from 'lucide-react'

import AvaliacaoInicialForm from '@/components/dashboard/AvaliacaoInicialForm'
import { getInitialAssessment } from '@/lib/actions/assessment'
import { getCourseDetails } from '@/lib/actions/lms'

export default async function AvaliacaoInicialPage({
  params,
}: {
  params: Promise<{ course_id: string }>
}) {
  const { course_id } = await params
  const courseData = await getCourseDetails(course_id)

  if (!courseData) notFound()

  const { course, enrollmentId } = courseData
  const totalLessons = course.modules.reduce((acc, moduleItem) => acc + moduleItem.lessons.length, 0)

  const assessment = await getInitialAssessment(enrollmentId)
  if (assessment) redirect(`/dashboard/cursos/${course_id}`)

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-7 p-4 lg:p-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)] md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(30,136,229,0.22),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">{course.title}</p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">Passo 1: Autoavaliação inicial de liderança</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#A9BDD8]">
            Antes de iniciar a trilha, vamos mapear seu ponto de partida em 7 competências críticas de gestão. Isso orienta sua execução durante o programa.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Competências</p>
              <p className="mt-1 text-xl font-extrabold text-white">7 contextos</p>
            </article>
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Duração estimada</p>
              <p className="mt-1 text-xl font-extrabold text-white">~ 5 minutos</p>
            </article>
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Carga da trilha</p>
              <p className="mt-1 text-xl font-extrabold text-white">{totalLessons} aulas</p>
            </article>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <section className="rounded-3xl border border-[#D8E2EF] bg-white p-5 shadow-sm md:p-7">
          <AvaliacaoInicialForm enrollmentId={enrollmentId} courseId={course_id} />
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <article className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Como funciona</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-3 py-2.5 text-sm text-[#334155]">
                <ClipboardCheck className="mt-0.5 h-4 w-4 text-[#0B4A8F]" />
                Responda de 1 a 5 para cada cenário de liderança.
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-3 py-2.5 text-sm text-[#334155]">
                <Timer className="mt-0.5 h-4 w-4 text-[#0B4A8F]" />
                Você pode voltar e editar respostas antes de finalizar.
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-3 py-2.5 text-sm text-[#334155]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#4CAF35]" />
                Após concluir, a trilha é liberada para consumo completo.
              </div>
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}
