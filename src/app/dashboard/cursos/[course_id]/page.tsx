import { getCourseDetails } from '@/lib/actions/lms'
import { getInitialAssessment } from '@/lib/actions/assessment'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PlayCircle, CheckCircle2, Award, Lock, ClipboardList } from 'lucide-react'
import { Progress } from '@/types/database'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default async function CoursePage({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params
  const courseData = await getCourseDetails(course_id)

  if (!courseData) notFound()

  const { course, progress, enrollmentId } = courseData

  // Verifica se a autoavaliação inicial foi concluída
  const assessment = await getInitialAssessment(enrollmentId)
  const isAssessed = assessment !== null

  // Progresso de aulas
  const isLessonCompleted = (lessonId: string) =>
    progress.some((p: Progress) => p.lesson_id === lessonId && p.is_completed)

  let totalLessons = 0
  let completedLessons = 0

  course.modules.forEach((mod: any) => {
    mod.lessons.forEach((lesson: any) => {
      totalLessons++
      if (isLessonCompleted(lesson.id)) completedLessons++
    })
  })

  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 lg:p-8">

      {/* ── Gate: Autoavaliação obrigatória ── */}
      {!isAssessed && (
        <div className="rounded-2xl border-2 border-[#1565C0] bg-[#1565C0]/[0.03] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-12 h-12 rounded-xl bg-[#1565C0]/10 flex items-center justify-center shrink-0">
            <ClipboardList className="h-6 w-6 text-[#1565C0]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1565C0]">Passo 1 de 2 — Obrigatório</span>
            </div>
            <h3 className="text-lg font-heading font-extrabold text-[#111827] mb-1 tracking-tight">
              Autoavaliação Inicial
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Antes de iniciar as aulas, faça sua autoavaliação nos 7 contextos de liderança do programa.
              Leva cerca de 5 minutos e define seu ponto de partida oficial.
            </p>
          </div>
          <Link href={`/dashboard/cursos/${course.id}/avaliacao-inicial`}>
            <Button className="bg-[#1565C0] hover:bg-[#1043A0] text-white font-bold rounded-xl px-6 py-3 h-auto whitespace-nowrap shadow-lg shadow-[#1565C0]/20 border-none">
              Fazer Autoavaliação →
            </Button>
          </Link>
        </div>
      )}

      {/* ── Conteúdo principal ── */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* Trilha de aprendizado */}
        <div className="w-full lg:w-2/3">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight mb-4">
              {course.title}
            </h1>
            <p className="text-[#64748B] text-lg font-medium leading-relaxed max-w-2xl">
              {course.description}
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-extrabold text-[#111827]">
              Trilha de Aprendizado
            </h2>
            {/* Badge de status do passo 2 */}
            {!isAssessed && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-full">
                <Lock className="h-3 w-3" />
                Passo 2 — Disponível após autoavaliação
              </span>
            )}
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full border border-[#E5E7EB] rounded-2xl bg-white shadow-sm overflow-hidden"
          >
            {course.modules
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((mod: any, index: number) => (
                <AccordionItem
                  key={mod.id}
                  value={mod.id}
                  className="border-b border-[#E5E7EB] last:border-0 px-2"
                >
                  <AccordionTrigger className="hover:no-underline px-4 py-5 hover:bg-[#F8FAFC] transition-colors rounded-xl font-heading font-bold text-lg text-[#111827]">
                    <div className="flex items-center gap-4 text-left">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#475569] text-sm">
                        {index + 1}
                      </span>
                      {mod.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="flex flex-col gap-2 px-4">
                      {mod.lessons
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((lesson: any) => {
                          const completed = isLessonCompleted(lesson.id)

                          // Lição bloqueada se avaliação não foi feita
                          if (!isAssessed) {
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-transparent opacity-50 cursor-not-allowed select-none"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                                    <Lock className="h-4 w-4 text-[#94A3B8]" />
                                  </div>
                                  <span className="font-semibold text-[#94A3B8]">
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-[#94A3B8] hidden sm:inline-block bg-[#F8FAFC] px-3 py-1 rounded-md border border-[#F1F5F9]">
                                  {Math.round(lesson.duration_seconds / 60)} min
                                </span>
                              </div>
                            )
                          }

                          // Lição desbloqueada
                          return (
                            <Link
                              key={lesson.id}
                              href={`/dashboard/cursos/${course.id}/aula/${lesson.id}`}
                              className="group flex items-center justify-between p-4 rounded-xl hover:bg-[#F8FAFC] transition-all duration-300 border border-transparent hover:border-[#E5E7EB]"
                            >
                              <div className="flex items-center gap-4">
                                {completed ? (
                                  <div className="w-8 h-8 rounded-full bg-[#4CAF35]/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 text-[#4CAF35]" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-[#1E88E5]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E88E5]/20 transition-colors">
                                    <PlayCircle className="h-5 w-5 text-[#1E88E5]" />
                                  </div>
                                )}
                                <span className="font-semibold text-[#111827] group-hover:text-[#1E88E5] transition-colors">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-[#94A3B8] hidden sm:inline-block bg-[#F8FAFC] px-3 py-1 rounded-md border border-[#F1F5F9]">
                                {Math.round(lesson.duration_seconds / 60)} min
                              </span>
                            </Link>
                          )
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>

        {/* Sidebar de progresso */}
        <div className="w-full lg:w-1/3 bg-white border border-[#E5E7EB] rounded-2xl p-8 sticky top-24 shadow-xl shadow-[#111827]/[0.02]">
          <h3 className="font-heading font-extrabold text-[#111827] text-xl mb-6 tracking-tight">
            Seu Progresso
          </h3>

          {/* Etapas */}
          <div className="space-y-4 mb-8">
            {/* Passo 1: Autoavaliação */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${isAssessed ? 'border-[#4CAF35]/30 bg-[#4CAF35]/5' : 'border-[#1565C0]/30 bg-[#1565C0]/5'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isAssessed ? 'bg-[#4CAF35] text-white' : 'bg-[#1565C0] text-white'}`}>
                {isAssessed ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">1</span>}
              </div>
              <div>
                <p className={`text-sm font-bold ${isAssessed ? 'text-[#4CAF35]' : 'text-[#1565C0]'}`}>
                  Autoavaliação Inicial
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {isAssessed ? 'Concluída' : 'Pendente — obrigatória'}
                </p>
              </div>
            </div>

            {/* Passo 2: Aulas */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${!isAssessed ? 'border-[#E5E7EB] bg-[#F8FAFC] opacity-60' : 'border-[#E5E7EB] bg-white'}`}>
              <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[#94A3B8]">2</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">Trilha de Aulas</p>
                <p className="text-xs text-[#94A3B8]">
                  {isAssessed ? `${progressPercentage}% concluído` : 'Disponível após autoavaliação'}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progresso de aulas */}
          {isAssessed && (
            <>
              <div className="w-full bg-[#EEF2F6] rounded-full h-3 mb-3 overflow-hidden">
                <div
                  className="bg-[#4CAF35] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-[#64748B] font-bold mb-8 uppercase tracking-wider">
                {progressPercentage}% concluído ({completedLessons} de {totalLessons} aulas)
              </p>

              {progressPercentage === 100 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-yellow-600 text-sm font-bold bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <Award className="h-5 w-5 flex-shrink-0" />
                    Parabéns! Formação concluída.
                  </div>
                  <Link href={`/dashboard/certificado/${course.id}`}>
                    <Button className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-base rounded-xl transition-all">
                      🎓 Emitir Certificado
                    </Button>
                  </Link>
                </div>
              ) : totalLessons > 0 ? (
                (() => {
                  let nextLesson = null
                  for (const mod of course.modules) {
                    for (const l of mod.lessons) {
                      if (!isLessonCompleted(l.id)) { nextLesson = l; break }
                    }
                    if (nextLesson) break
                  }
                  return nextLesson ? (
                    <Link href={`/dashboard/cursos/${course.id}/aula/${nextLesson.id}`}>
                      <Button className="w-full h-14 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold text-base rounded-xl shadow-lg shadow-[#1E88E5]/20 transition-all border-none">
                        Continuar Assistindo
                      </Button>
                    </Link>
                  ) : null
                })()
              ) : null}
            </>
          )}

          {/* CTA de avaliação se pendente */}
          {!isAssessed && (
            <Link href={`/dashboard/cursos/${course.id}/avaliacao-inicial`}>
              <Button className="w-full h-14 bg-[#1565C0] hover:bg-[#1043A0] text-white font-bold text-base rounded-xl shadow-lg shadow-[#1565C0]/20 border-none">
                Iniciar Autoavaliação →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
