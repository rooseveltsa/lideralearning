import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarClock, Flame, History, PlayCircle, Sparkles } from 'lucide-react'

type Course = {
  id: string
  title: string
  description: string | null
  price: number | null
  thumbnail_url: string | null
  created_at: string
}

type EnrollmentLesson = {
  id: string
  title: string
  duration_seconds: number
  order_index: number
}

type EnrollmentModule = {
  id: string
  order_index: number
  lessons: EnrollmentLesson[] | null
}

type EnrollmentCourse = Course & {
  modules: EnrollmentModule[] | null
}

type EnrollmentRecord = {
  id: string
  enrolled_at: string
  courses: EnrollmentCourse | EnrollmentCourse[] | null
}

type ProgressRecord = {
  enrollment_id: string
  lesson_id: string
  is_completed: boolean
  last_accessed_at: string
}

type ContinueWatchingItem = {
  enrollmentId: string
  course: Course
  progressPercent: number
  completedLessons: number
  totalLessons: number
  targetLessonId: string | null
  lastAccessedAt: string
}

const currencyBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const shortDateBR = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

const NEW_RELEASE_DAYS = 21

function isNewRelease(isoDate: string) {
  const createdAt = new Date(isoDate).getTime()
  const now = Date.now()
  const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))

  return diffInDays <= NEW_RELEASE_DAYS
}

function normalizeCourses(data: Course[] | null | undefined) {
  return Array.isArray(data) ? data : []
}

function normalizeEnrollments(data: EnrollmentRecord[] | null | undefined) {
  return Array.isArray(data) ? data : []
}

function normalizeProgress(data: ProgressRecord[] | null | undefined) {
  return Array.isArray(data) ? data : []
}

function orderedLessons(modules: EnrollmentModule[] | null) {
  const safeModules = Array.isArray(modules) ? modules : []

  return safeModules
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .flatMap((moduleItem) => (Array.isArray(moduleItem.lessons) ? moduleItem.lessons.slice() : []).sort((a, b) => a.order_index - b.order_index))
}

function pickEnrollmentCourse(course: EnrollmentRecord['courses']) {
  if (!course) return null
  if (Array.isArray(course)) return course[0] ?? null
  return course
}

function computeContinueWatching(enrollments: EnrollmentRecord[], progress: ProgressRecord[]) {
  const progressByEnrollment = new Map<string, ProgressRecord[]>()

  progress.forEach((item) => {
    const list = progressByEnrollment.get(item.enrollment_id) ?? []
    list.push(item)
    progressByEnrollment.set(item.enrollment_id, list)
  })

  const items: ContinueWatchingItem[] = []

  enrollments.forEach((enrollment) => {
    const enrollmentCourse = pickEnrollmentCourse(enrollment.courses)
    if (!enrollmentCourse) return

    const lessons = orderedLessons(enrollmentCourse.modules)
    const totalLessons = lessons.length
    if (totalLessons === 0) return

    const progressList = progressByEnrollment.get(enrollment.id) ?? []
    const completedLessonIds = new Set(progressList.filter((item) => item.is_completed).map((item) => item.lesson_id))
    const completedLessons = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
    const progressPercent = Math.round((completedLessons / totalLessons) * 100)
    if (progressPercent >= 100) return

    const latestProgress = progressList
      .slice()
      .sort((a, b) => new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime())[0]

    const firstUnfinished = lessons.find((lesson) => !completedLessonIds.has(lesson.id))

    let targetLessonId = firstUnfinished?.id ?? lessons[0]?.id ?? null
    if (latestProgress && !completedLessonIds.has(latestProgress.lesson_id)) {
      targetLessonId = latestProgress.lesson_id
    }

    items.push({
      enrollmentId: enrollment.id,
      course: {
        id: enrollmentCourse.id,
        title: enrollmentCourse.title,
        description: enrollmentCourse.description,
        price: enrollmentCourse.price,
        thumbnail_url: enrollmentCourse.thumbnail_url,
        created_at: enrollmentCourse.created_at,
      },
      progressPercent,
      completedLessons,
      totalLessons,
      targetLessonId,
      lastAccessedAt: latestProgress?.last_accessed_at ?? enrollment.enrolled_at,
    })
  })

  return items.sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
}

function getContinueHref(item: ContinueWatchingItem) {
  return item.targetLessonId
    ? `/dashboard/cursos/${item.course.id}/aula/${item.targetLessonId}`
    : `/dashboard/cursos/${item.course.id}`
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

function buildRails(courses: Course[]) {
  if (courses.length === 0) return []

  if (courses.length <= 2) {
    return [
      {
        id: 'catalogo',
        title: 'Catálogo Lidera',
        description: 'Programas disponíveis para iniciar sua jornada agora.',
        icon: PlayCircle,
        items: courses,
      },
    ]
  }

  const usedCourseIds = new Set<string>()
  const sortedByPrice = [...courses].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0))
  const alphabetic = [...courses].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
  const newReleases = courses.filter((course) => isNewRelease(course.created_at))

  const pickUnique = (list: Course[], limit = 12) => {
    const unique = list.filter((course) => !usedCourseIds.has(course.id)).slice(0, limit)
    unique.forEach((course) => usedCourseIds.add(course.id))
    return unique
  }

  const rails = []

  const launchItems = pickUnique(newReleases.length > 0 ? newReleases : courses)
  if (launchItems.length > 0) {
    rails.push({
      id: 'lancamentos',
      title: 'Lançamentos da Semana',
      description: 'Programas recém-publicados para evolução contínua.',
      icon: Flame,
      items: launchItems,
    })
  }

  const certifiedItems = pickUnique(sortedByPrice)
  if (certifiedItems.length > 0) {
    rails.push({
      id: 'trilhas-certificadas',
      title: 'Trilhas Certificadas',
      description: 'Formações estruturadas para quem precisa de profundidade.',
      icon: Sparkles,
      items: certifiedItems,
    })
  }

  const academyItems = pickUnique(alphabetic)
  if (academyItems.length > 0) {
    rails.push({
      id: 'academy',
      title: 'Lidera Academy',
      description: 'Catálogo completo para maratonar treinamentos.',
      icon: PlayCircle,
      items: academyItems,
    })
  }

  return rails
}

function CourseCard({ course, showNewTag = false }: { course: Course; showNewTag?: boolean }) {
  return (
    <Link
      href={`/curso/${course.id}`}
      className="group min-w-[260px] max-w-[260px] shrink-0"
      aria-label={`Abrir programa ${course.title}`}
    >
      <article className="overflow-hidden rounded-xl border border-white/10 bg-[#0E1424] transition-all duration-300 group-hover:border-[#1E88E5] group-hover:shadow-[0_12px_32px_rgba(30,136,229,0.24)]">
          <div className="relative h-36 w-full overflow-hidden bg-[#090E1A]">
            {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              sizes="260px"
              unoptimized
              className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
            ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#102341] to-[#0A1220] px-5 text-center text-sm font-semibold text-[#BFD4EA]">
              {course.title}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />

          <div className="absolute left-3 top-3 flex items-center gap-2">
            {showNewTag && isNewRelease(course.created_at) ? (
              <span className="rounded-md bg-[#4CAF35] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Novo
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-white group-hover:text-[#8CC1F7]">
            {course.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-[#94A3B8]">
            {course.description || 'Programa com foco em aplicação prática e evolução de resultados.'}
          </p>

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7FA0C2]">Compra Avulsa</span>
            <strong className="text-sm font-bold text-[#E6F1FB]">{currencyBRL.format(Number(course.price ?? 0))}</strong>
          </div>
        </div>
      </article>
    </Link>
  )
}

function ContinueCourseCard({ item }: { item: ContinueWatchingItem }) {
  const href = getContinueHref(item)
  const widthPercent = item.progressPercent === 0 ? 3 : item.progressPercent

  return (
    <Link
      href={href}
      className="group min-w-[320px] max-w-[320px] shrink-0"
      aria-label={`Continuar ${item.course.title}`}
    >
      <article className="overflow-hidden rounded-xl border border-[#2B405F] bg-[#0B1222] transition-all duration-300 group-hover:border-[#1E88E5] group-hover:shadow-[0_14px_34px_rgba(16,64,120,0.4)]">
        <div className="relative h-40 w-full overflow-hidden bg-[#060B17]">
          {item.course.thumbnail_url ? (
            <Image
              src={item.course.thumbnail_url}
              alt={item.course.title}
              fill
              sizes="320px"
              unoptimized
              className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#102341] to-[#0A1220] px-5 text-center text-sm font-semibold text-[#BFD4EA]">
              {item.course.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040913] via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D9E9FB]">
            Em andamento
          </span>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-white group-hover:text-[#8CC1F7]">
            {item.course.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-[#9CB5D0]">
              <span>{item.progressPercent}% concluído</span>
              <span>
                {item.completedLessons}/{item.totalLessons} aulas
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#243754]">
              <div className="h-full rounded-full bg-[#1E88E5] transition-all duration-500" style={{ width: `${widthPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-[#8DA9C8]">Último acesso {shortDateBR.format(new Date(item.lastAccessedAt))}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4E8FC]">Continuar</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function CursosPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('courses')
    .select('id, title, description, price, thumbnail_url, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const courses = normalizeCourses(data as Course[])
  const featuredCourse = courses[0]
  const rails = buildRails(courses)

  let continueWatching: ContinueWatchingItem[] = []
  const enrolledCourseIds = new Set<string>()

  if (user) {
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        courses (
          id,
          title,
          description,
          price,
          thumbnail_url,
          created_at,
          modules (
            id,
            order_index,
            lessons (
              id,
              title,
              duration_seconds,
              order_index
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    const enrollments = normalizeEnrollments(enrollmentData as unknown as EnrollmentRecord[])
    const enrollmentIds = enrollments.map((item) => item.id)

    enrollments.forEach((item) => {
      const enrollmentCourse = pickEnrollmentCourse(item.courses)
      if (enrollmentCourse) {
        enrolledCourseIds.add(enrollmentCourse.id)
      }
    })

    let progressList: ProgressRecord[] = []

    if (enrollmentIds.length > 0) {
      const { data: progressData } = await supabase
        .from('progress')
        .select('enrollment_id, lesson_id, is_completed, last_accessed_at')
        .in('enrollment_id', enrollmentIds)

      progressList = normalizeProgress(progressData as ProgressRecord[])
    }

    continueWatching = computeContinueWatching(enrollments, progressList)
  }

  const recommendedCourses = user ? courses.filter((course) => !enrolledCourseIds.has(course.id)) : []
  const primaryContinue = continueWatching[0]
  const heroPrimaryHref = primaryContinue ? getContinueHref(primaryContinue) : featuredCourse ? `/curso/${featuredCourse.id}` : '/dashboard/cursos'
  const heroPrimaryLabel = primaryContinue ? 'Retomar última aula' : 'Assistir agora'
  const personalizedSummary = user
    ? `Você tem ${continueWatching.length} ${pluralize(continueWatching.length, 'programa', 'programas')} em andamento e ${recommendedCourses.length} ${pluralize(recommendedCourses.length, 'recomendação', 'recomendações')} para avançar.`
    : 'Assista no seu ritmo, avance por trilhas certificadas e leve o aprendizado digital para imersões presenciais e programas corporativos.'

  return (
    <div className="min-h-screen bg-[#040812] text-[#E7EDF8]">
      <SiteHeader />

      <main>
        {featuredCourse ? (
          <section className="relative isolate overflow-hidden border-b border-[#1A2438] pt-36">
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
              style={{
                backgroundImage: featuredCourse.thumbnail_url
                  ? `url(${featuredCourse.thumbnail_url})`
                  : 'linear-gradient(120deg, #11213F 0%, #0A1324 100%)',
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05080F] via-[#05080F]/85 to-[#05080F]/55" />

            <div className="mx-auto grid max-w-[1280px] gap-12 px-6 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2A3D63] bg-[#0B1222]/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9CC8F2]">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {user ? 'Seu Stream Personalizado' : 'Stream Lidera Academy'}
                </div>

                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                  Evolução contínua em formato de <span className="text-[#4EA1F0]">stream de treinamentos</span>
                </h1>

                <p className="max-w-2xl text-lg leading-relaxed text-[#BCD0E4]">
                  {personalizedSummary}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={heroPrimaryHref}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1E88E5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1565C0]"
                  >
                    {heroPrimaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={user ? '/dashboard/cursos' : '/empresas'}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#355583] bg-[#0B1222]/80 px-6 py-3 text-sm font-bold text-[#D9E9F9] transition hover:border-[#4EA1F0] hover:text-white"
                  >
                    {user ? 'Ver meus programas' : 'Soluções para empresas'}
                  </Link>
                </div>
              </div>

              <aside className="rounded-2xl border border-[#273B5A] bg-[#0B1222]/90 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7FA0C2]">Destaque da semana</p>
                <h2 className="mt-3 text-xl font-bold text-white">{featuredCourse.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#9DB5CF]">
                  {featuredCourse.description || 'Programa recomendado para acelerar desenvolvimento profissional e resultados aplicáveis.'}
                </p>
                <p className="mt-5 text-sm font-semibold text-[#CFE2F6]">
                  {user ? `${continueWatching.length} em andamento` : `A partir de ${currencyBRL.format(Number(featuredCourse.price ?? 0))}`}
                </p>
              </aside>
            </div>
          </section>
        ) : null}

        <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-12">
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2D3E5D] bg-[#0B1222] p-10 text-center">
              <h2 className="text-2xl font-bold text-white">Nenhum treinamento publicado no momento</h2>
              <p className="mx-auto mt-3 max-w-2xl text-[#9EB6D0]">
                O catálogo está em atualização. Enquanto isso, você pode solicitar uma proposta corporativa personalizada para seu time.
              </p>
              <Link
                href="/empresas"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1565C0] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1E88E5]"
              >
                Falar com time comercial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {user ? (
                <section className="space-y-4">
                  <header className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        <History className="h-5 w-5 text-[#4EA1F0]" />
                        Continuar assistindo
                      </h2>
                      <p className="mt-1 text-sm text-[#8DA9C8]">
                        Retome exatamente de onde parou com progresso sincronizado por aula.
                      </p>
                    </div>
                    <Link href="/dashboard/cursos" className="text-sm font-semibold text-[#9CC8F2] hover:text-[#D5E9FB]">
                      Abrir minha jornada
                    </Link>
                  </header>

                  {continueWatching.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#2D3E5D] bg-[#0B1222] p-8">
                      <p className="text-base font-semibold text-white">Nenhuma aula iniciada ainda</p>
                      <p className="mt-2 text-sm text-[#9EB6D0]">
                        Você já possui acesso a programas. Comece pela primeira aula para ativar esta trilha automática.
                      </p>
                      <Link
                        href="/dashboard/cursos"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1565C0] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#1E88E5]"
                      >
                        Ir para meus programas
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
                      {continueWatching.map((item) => (
                        <div key={`continue-${item.enrollmentId}`} className="snap-start">
                          <ContinueCourseCard item={item} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              {user && recommendedCourses.length > 0 ? (
                <section className="space-y-4">
                  <header className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Sparkles className="h-5 w-5 text-[#4EA1F0]" />
                        Recomendado para você
                      </h2>
                      <p className="mt-1 text-sm text-[#8DA9C8]">
                        Seleção automática do catálogo para ampliar sua trilha atual.
                      </p>
                    </div>
                  </header>

                  <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
                    {recommendedCourses.slice(0, 10).map((course) => (
                      <div key={`recommended-${course.id}`} className="snap-start">
                        <CourseCard course={course} showNewTag />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {rails.map((rail, index) => {
                const Icon = rail.icon

                return (
                  <section key={rail.id} className="space-y-4">
                    <header className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                          <Icon className="h-5 w-5 text-[#4EA1F0]" />
                          {rail.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#8DA9C8]">{rail.description}</p>
                      </div>
                      <Link href="/contato" className="text-sm font-semibold text-[#9CC8F2] hover:text-[#D5E9FB]">
                        Precisa de ajuda para escolher?
                      </Link>
                    </header>

                    <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
                      {rail.items.map((course) => (
                        <div key={`${rail.id}-${course.id}`} className="snap-start">
                          <CourseCard course={course} showNewTag={index === 0} />
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
