'use client'

import { ArrowRight, CheckCircle2, Clock3, Navigation, ShieldCheck } from 'lucide-react'

import { createCheckoutSession } from '@/app/curso/[course_id]/actions'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { Button } from '@/components/ui/button'

type ShowcaseLesson = {
  id: string
  title: string
  duration_seconds: number
  order_index: number
}

type ShowcaseModule = {
  id: string
  title: string
  order_index: number
  lessons: ShowcaseLesson[]
}

type ShowcaseCourse = {
  id: string
  title: string
  description: string | null
  price: number
  modules: ShowcaseModule[]
}

interface CourseProps {
  course: ShowcaseCourse
  totalLessons: number
  totalDuration: number
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}min`
}

export default function CourseShowcaseClient({ course, totalLessons, totalDuration }: CourseProps) {
  const sortedModules = [...course.modules]
    .sort((a, b) => a.order_index - b.order_index)
    .map((moduleItem) => ({
      ...moduleItem,
      lessons: [...moduleItem.lessons].sort((a, b) => a.order_index - b.order_index),
    }))

  return (
    <div className="min-h-screen bg-[#040812] text-[#E7EDF8]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-[#1A2438] px-6 pb-24 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(30,136,229,0.22),transparent_42%),radial-gradient(circle_at_86%_20%,rgba(76,175,53,0.16),transparent_46%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          <div className="relative mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D4364] bg-[#0A1426] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
                <Navigation className="h-3.5 w-3.5" />
                Formação executiva Lidera
              </p>

              <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
                {course.description || 'Jornada completa para estruturar liderança, elevar execução e sustentar resultado no ambiente corporativo.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#274364] bg-[#0A1426] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A9C7E8]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4CAF35]" />
                  {totalLessons} aulas práticas
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#274364] bg-[#0A1426] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A9C7E8]">
                  <Clock3 className="h-3.5 w-3.5 text-[#8CC1F7]" />
                  {formatDuration(totalDuration)} de conteúdo
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#274364] bg-[#0A1426] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A9C7E8]">
                  <Navigation className="h-3.5 w-3.5 text-[#8CC1F7]" />
                  {sortedModules.length} módulos
                </span>
              </div>
            </div>

            <aside className="rounded-3xl border border-[#263A59] bg-[#0A1324] p-7 shadow-[0_28px_58px_rgba(2,6,23,0.6)]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Acesso à formação</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white">{currencyFormatter.format(Number(course.price || 0))}</h2>
              <p className="mt-2 text-sm text-[#9AB2CE]">Pagamento único com liberação imediata da trilha.</p>

              <form action={() => createCheckoutSession(course.id)} className="mt-6">
                <Button className="h-12 w-full rounded-xl bg-[#1E88E5] text-sm font-bold text-white hover:bg-[#1565C0]">
                  Desbloquear formação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 space-y-2.5 rounded-2xl border border-[#273B5A] bg-[#0E1B31] p-4">
                {[
                  'Pagamento seguro via Stripe',
                  'Garantia incondicional de 7 dias',
                  'Acesso por 12 meses',
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-xs font-semibold text-[#D5E5F7]">
                    <ShieldCheck className="h-4 w-4 text-[#4CAF35]" />
                    {item}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Ementa da formação</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">
                Conteúdo estruturado para aplicação imediata na rotina de liderança.
              </h2>
            </div>

            <div className="space-y-4">
              {sortedModules.map((moduleItem, index) => (
                <article key={moduleItem.id} className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FC] text-sm font-extrabold text-[#0B4A8F]">
                      {index + 1}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#0F172A]">{moduleItem.title}</h3>
                  </div>

                  <div className="space-y-2">
                    {moduleItem.lessons.map((lessonItem) => (
                      <div
                        key={lessonItem.id}
                        className="flex items-center justify-between rounded-xl border border-[#E6EDF7] bg-[#FAFCFF] px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-[#0F172A]">{lessonItem.title}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDuration(lessonItem.duration_seconds)}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
