import { createAdminClient } from '@/lib/supabase/service'
import AnalyticsClient from './AnalyticsClient'

// ── Types ──

type ProfileRow = {
  id: string
  role: string | null
  created_at: string
}

type EnrollmentRow = {
  id: string
  user_id: string
  course_id: string
  status: string
  enrolled_at: string
}

type ProgressRow = {
  id: string
  enrollment_id: string
  lesson_id: string
  is_completed: boolean
  last_accessed_at: string
}

type CourseRow = {
  id: string
  title: string
  is_published: boolean
}

type LessonRow = {
  id: string
  module_id: string
  title: string
}

type ModuleRow = {
  id: string
  course_id: string
  title: string
}

type SelfAssessmentRow = {
  id: string
  user_id: string
  q_percepcao: number | null
  q_gestao: number | null
  q_comunicacao: number | null
  q_tecnologia: number | null
  q_etica: number | null
  q_dor: number | null
  pontuacao_total: number | null
  perfil: string | null
  created_at: string
}

type ExecAssessmentRow = {
  id: string
  user_id: string
  nome_empresa: string | null
  dim_comunicacao: number | null
  dim_tomada_decisao: number | null
  dim_gestao_equipe: number | null
  dim_orientacao_resultados: number | null
  dim_adaptabilidade: number | null
  dim_lideranca_estrategica: number | null
  dim_desenvolvimento_pessoas: number | null
  dim_inovacao: number | null
  dim_etica_integridade: number | null
  dim_gestao_crise: number | null
  media_dimensoes: number | null
  created_at: string
}

type PDIRow = {
  id: string
  user_id: string
  fase_atual: number | null
  dim_facilitador: number | null
  dim_orientador: number | null
  dim_garantidor: number | null
  dim_estrategista: number | null
  dim_mentor: number | null
  media_dimensoes: number | null
  created_at: string
}

type TrainingRow = {
  id: string
  title: string
  training_date_start: string
  training_date_end: string
  location: string | null
  max_participants: number
  status: string
  company_name: string | null
}

type ParticipantRow = {
  id: string
  training_id: string
  participant_name: string
  status: string
}

type CertificateRow = {
  id: string
  user_id: string
  course_id: string
  issued_at: string
}

// ── Data fetching ──

export default async function AnalyticsPage() {
  const admin = createAdminClient()

  // Profiles
  let profiles: ProfileRow[] = []
  try {
    const { data } = await admin
      .from('profiles')
      .select('id, role, created_at')
    if (data) profiles = data as ProfileRow[]
  } catch { /* table may not exist */ }

  // Enrollments
  let enrollments: EnrollmentRow[] = []
  try {
    const { data } = await admin
      .from('enrollments')
      .select('id, user_id, course_id, status, enrolled_at')
    if (data) enrollments = data as EnrollmentRow[]
  } catch { /* */ }

  // Progress
  let progressRecords: ProgressRow[] = []
  try {
    const { data } = await admin
      .from('progress')
      .select('id, enrollment_id, lesson_id, is_completed, last_accessed_at')
    if (data) progressRecords = data as ProgressRow[]
  } catch { /* */ }

  // Courses
  let courses: CourseRow[] = []
  try {
    const { data } = await admin
      .from('courses')
      .select('id, title, is_published')
    if (data) courses = data as CourseRow[]
  } catch { /* */ }

  // Modules
  let modules: ModuleRow[] = []
  try {
    const { data } = await admin
      .from('modules')
      .select('id, course_id, title')
    if (data) modules = data as ModuleRow[]
  } catch { /* */ }

  // Lessons
  let lessons: LessonRow[] = []
  try {
    const { data } = await admin
      .from('lessons')
      .select('id, module_id, title')
    if (data) lessons = data as LessonRow[]
  } catch { /* */ }

  // Self Assessments
  let selfAssessments: SelfAssessmentRow[] = []
  try {
    const { data } = await admin
      .from('leadership_self_assessments')
      .select('id, user_id, q_percepcao, q_gestao, q_comunicacao, q_tecnologia, q_etica, q_dor, pontuacao_total, perfil, created_at')
      .order('created_at', { ascending: false })
    if (data) selfAssessments = data as SelfAssessmentRow[]
  } catch { /* */ }

  // Executive Assessments
  let execAssessments: ExecAssessmentRow[] = []
  try {
    const { data } = await admin
      .from('leadership_executive_assessments')
      .select('id, user_id, nome_empresa, dim_comunicacao, dim_tomada_decisao, dim_gestao_equipe, dim_orientacao_resultados, dim_adaptabilidade, dim_lideranca_estrategica, dim_desenvolvimento_pessoas, dim_inovacao, dim_etica_integridade, dim_gestao_crise, media_dimensoes, created_at')
      .order('created_at', { ascending: false })
    if (data) execAssessments = data as ExecAssessmentRow[]
  } catch { /* */ }

  // PDIs
  let pdis: PDIRow[] = []
  try {
    const { data } = await admin
      .from('leadership_pdi')
      .select('id, user_id, fase_atual, dim_facilitador, dim_orientador, dim_garantidor, dim_estrategista, dim_mentor, media_dimensoes, created_at')
      .order('created_at', { ascending: false })
    if (data) pdis = data as PDIRow[]
  } catch { /* */ }

  // Presential Trainings
  let trainings: TrainingRow[] = []
  try {
    const { data } = await admin
      .from('presential_trainings')
      .select('id, title, training_date_start, training_date_end, location, max_participants, status, company_name')
      .order('training_date_start', { ascending: false })
    if (data) trainings = data as TrainingRow[]
  } catch { /* */ }

  // Participants
  let participants: ParticipantRow[] = []
  try {
    const { data } = await admin
      .from('presential_training_participants')
      .select('id, training_id, participant_name, status')
    if (data) participants = data as ParticipantRow[]
  } catch { /* */ }

  // Certificates
  let certificates: CertificateRow[] = []
  try {
    const { data } = await admin
      .from('certificates')
      .select('id, user_id, course_id, issued_at')
    if (data) certificates = data as CertificateRow[]
  } catch { /* */ }

  // Auth users for signup trend (last 30 days)
  let signupsByDay: Record<string, number> = {}
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { data } = await admin
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })
    if (data) {
      for (const row of data as { created_at: string }[]) {
        const day = row.created_at.slice(0, 10)
        signupsByDay[day] = (signupsByDay[day] ?? 0) + 1
      }
    }
  } catch { /* */ }

  // Build last 30 days array
  const signupTrend: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    signupTrend.push({ date: key, count: signupsByDay[key] ?? 0 })
  }

  // ── Compute derived data ──

  // Lesson count per course (via modules)
  const moduleByCourse: Record<string, string[]> = {}
  for (const m of modules) {
    if (!moduleByCourse[m.course_id]) moduleByCourse[m.course_id] = []
    moduleByCourse[m.course_id].push(m.id)
  }

  const lessonByModule: Record<string, string[]> = {}
  for (const l of lessons) {
    if (!lessonByModule[l.module_id]) lessonByModule[l.module_id] = []
    lessonByModule[l.module_id].push(l.id)
  }

  const lessonsByCourse: Record<string, string[]> = {}
  for (const [courseId, moduleIds] of Object.entries(moduleByCourse)) {
    const courseLessons: string[] = []
    for (const mId of moduleIds) {
      courseLessons.push(...(lessonByModule[mId] ?? []))
    }
    lessonsByCourse[courseId] = courseLessons
  }

  // Progress by enrollment
  const progressByEnrollment: Record<string, { total: number; completed: number }> = {}
  for (const e of enrollments) {
    const courseLessonIds = lessonsByCourse[e.course_id] ?? []
    const totalLessons = courseLessonIds.length
    const completedLessons = progressRecords.filter(
      (p) => p.enrollment_id === e.id && p.is_completed
    ).length
    progressByEnrollment[e.id] = { total: totalLessons, completed: completedLessons }
  }

  // Completion rate per course
  const courseCompletionRates: { courseId: string; title: string; rate: number; enrolled: number }[] = []
  for (const course of courses) {
    const courseEnrollments = enrollments.filter((e) => e.course_id === course.id)
    if (courseEnrollments.length === 0) continue
    const totalLessons = (lessonsByCourse[course.id] ?? []).length
    if (totalLessons === 0) continue
    let sumRates = 0
    for (const e of courseEnrollments) {
      const prog = progressByEnrollment[e.id]
      if (prog && prog.total > 0) {
        sumRates += prog.completed / prog.total
      }
    }
    const avgRate = Math.round((sumRates / courseEnrollments.length) * 100)
    courseCompletionRates.push({
      courseId: course.id,
      title: course.title,
      rate: avgRate,
      enrolled: courseEnrollments.length,
    })
  }

  // Progress distribution buckets
  const progressBuckets = { '0-25': 0, '25-50': 0, '50-75': 0, '75-100': 0 }
  for (const e of enrollments) {
    const prog = progressByEnrollment[e.id]
    if (!prog || prog.total === 0) {
      progressBuckets['0-25']++
      continue
    }
    const pct = (prog.completed / prog.total) * 100
    if (pct <= 25) progressBuckets['0-25']++
    else if (pct <= 50) progressBuckets['25-50']++
    else if (pct <= 75) progressBuckets['50-75']++
    else progressBuckets['75-100']++
  }

  // Lesson completion counts
  const lessonCompletionCounts: Record<string, number> = {}
  for (const p of progressRecords) {
    if (p.is_completed) {
      lessonCompletionCounts[p.lesson_id] = (lessonCompletionCounts[p.lesson_id] ?? 0) + 1
    }
  }

  const lessonCompletionList = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    completions: lessonCompletionCounts[l.id] ?? 0,
  })).sort((a, b) => b.completions - a.completions)

  // Students at risk (enrolled but no progress in 7+ days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const studentsAtRisk: { enrollmentId: string; userId: string; courseTitle: string; daysSinceActivity: number }[] = []
  for (const e of enrollments) {
    if (e.status !== 'active') continue
    const prog = progressByEnrollment[e.id]
    if (prog && prog.total > 0 && prog.completed === 0) {
      const enrollProgress = progressRecords.filter((p) => p.enrollment_id === e.id)
      let lastActivity = new Date(e.enrolled_at)
      for (const p of enrollProgress) {
        const d = new Date(p.last_accessed_at)
        if (d > lastActivity) lastActivity = d
      }
      if (lastActivity < sevenDaysAgo) {
        const course = courses.find((c) => c.id === e.course_id)
        const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        studentsAtRisk.push({
          enrollmentId: e.id,
          userId: e.user_id,
          courseTitle: course?.title ?? 'Curso',
          daysSinceActivity: daysSince,
        })
      }
    }
  }

  // Overall KPIs
  const totalUsers = profiles.length
  const activeStudents = enrollments.filter((e) => e.status === 'active').length
  const totalEnrollments = enrollments.length
  const overallCompletionRate = totalEnrollments > 0
    ? Math.round(
        enrollments.reduce((sum, e) => {
          const prog = progressByEnrollment[e.id]
          if (!prog || prog.total === 0) return sum
          return sum + (prog.completed / prog.total) * 100
        }, 0) / totalEnrollments
      )
    : 0
  const avgScore = selfAssessments.length > 0
    ? Math.round(
        selfAssessments.reduce((s, a) => s + (a.pontuacao_total ?? 0), 0) / selfAssessments.length * 10
      ) / 10
    : 0
  const totalCertificates = certificates.length

  // Funnel data
  const usersWithSelfAssessment = new Set(selfAssessments.map((s) => s.user_id)).size
  const usersWithPDI = new Set(pdis.map((p) => p.user_id)).size
  const usersWithEnrollment = new Set(enrollments.map((e) => e.user_id)).size
  const usersWithCertificate = new Set(certificates.map((c) => c.user_id)).size

  const funnel = [
    { label: 'Cadastro', count: totalUsers },
    { label: 'Autoavaliacao', count: usersWithSelfAssessment },
    { label: 'PDI', count: usersWithPDI },
    { label: 'Curso', count: usersWithEnrollment },
    { label: 'Certificado', count: usersWithCertificate },
  ]

  // Self-assessment perfil distribution
  const perfilDistribution: Record<string, number> = { reativo: 0, transicao: 0, lider_valor: 0 }
  for (const sa of selfAssessments) {
    const p = sa.perfil ?? 'reativo'
    perfilDistribution[p] = (perfilDistribution[p] ?? 0) + 1
  }

  // Self-assessment dimension averages
  const selfDimKeys = ['q_percepcao', 'q_gestao', 'q_comunicacao', 'q_tecnologia', 'q_etica', 'q_dor'] as const
  const selfDimLabels: Record<string, string> = {
    q_percepcao: 'Percepcao da Funcao',
    q_gestao: 'Gestao de Equipes',
    q_comunicacao: 'Comunicacao e Postura',
    q_tecnologia: 'Tecnologia e KPIs',
    q_etica: 'Alicerce Etico',
    q_dor: 'Dor Atual',
  }

  const selfDimAverages: { key: string; label: string; avg: number }[] = selfDimKeys.map((key) => {
    const vals = selfAssessments.map((s) => s[key]).filter((v): v is number => v !== null)
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { key, label: selfDimLabels[key], avg: Math.round(avg * 100) / 100 }
  })

  // Score histogram (buckets of 0.5 from 0 to max)
  const scoreHistogram: { bucket: string; count: number }[] = []
  const scoreBucketMap: Record<string, number> = {}
  for (const sa of selfAssessments) {
    const score = sa.pontuacao_total ?? 0
    const bucketStart = Math.floor(score / 2) * 2
    const label = `${bucketStart}-${bucketStart + 2}`
    scoreBucketMap[label] = (scoreBucketMap[label] ?? 0) + 1
  }
  const sortedBuckets = Object.entries(scoreBucketMap).sort((a, b) => {
    const aNum = parseInt(a[0].split('-')[0])
    const bNum = parseInt(b[0].split('-')[0])
    return aNum - bNum
  })
  for (const [bucket, count] of sortedBuckets) {
    scoreHistogram.push({ bucket, count })
  }

  // Exec assessment dimension averages
  const execDimKeys = [
    'dim_comunicacao', 'dim_tomada_decisao', 'dim_gestao_equipe',
    'dim_orientacao_resultados', 'dim_adaptabilidade', 'dim_lideranca_estrategica',
    'dim_desenvolvimento_pessoas', 'dim_inovacao', 'dim_etica_integridade', 'dim_gestao_crise',
  ] as const
  const execDimLabels: Record<string, string> = {
    dim_comunicacao: 'Comunicacao',
    dim_tomada_decisao: 'Tomada de Decisao',
    dim_gestao_equipe: 'Gestao de Equipe',
    dim_orientacao_resultados: 'Orientacao a Resultados',
    dim_adaptabilidade: 'Adaptabilidade',
    dim_lideranca_estrategica: 'Lideranca Estrategica',
    dim_desenvolvimento_pessoas: 'Desenv. de Pessoas',
    dim_inovacao: 'Inovacao',
    dim_etica_integridade: 'Etica e Integridade',
    dim_gestao_crise: 'Gestao de Crise',
  }

  const execDimAverages: { key: string; label: string; avg: number }[] = execDimKeys.map((key) => {
    const vals = execAssessments.map((e) => e[key]).filter((v): v is number => v !== null)
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { key, label: execDimLabels[key], avg: Math.round(avg * 100) / 100 }
  })

  // Exec by company
  const execByCompany: Record<string, { count: number; avgScore: number }> = {}
  for (const ea of execAssessments) {
    const company = ea.nome_empresa ?? 'Sem empresa'
    if (!execByCompany[company]) execByCompany[company] = { count: 0, avgScore: 0 }
    execByCompany[company].count++
    execByCompany[company].avgScore += ea.media_dimensoes ?? 0
  }
  const execCompanyBreakdown = Object.entries(execByCompany).map(([name, data]) => ({
    company: name,
    count: data.count,
    avgScore: data.count > 0 ? Math.round((data.avgScore / data.count) * 10) / 10 : 0,
  })).sort((a, b) => b.count - a.count)

  // PDI phase distribution
  const pdiPhaseDistribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, 'null': 0 }
  for (const pdi of pdis) {
    const phase = pdi.fase_atual !== null ? String(pdi.fase_atual) : 'null'
    pdiPhaseDistribution[phase] = (pdiPhaseDistribution[phase] ?? 0) + 1
  }

  // PDI dimension averages
  const pdiDimKeys = ['dim_facilitador', 'dim_orientador', 'dim_garantidor', 'dim_estrategista', 'dim_mentor'] as const
  const pdiDimLabels: Record<string, string> = {
    dim_facilitador: 'Facilitador',
    dim_orientador: 'Orientador',
    dim_garantidor: 'Garantidor',
    dim_estrategista: 'Estrategista',
    dim_mentor: 'Mentor',
  }
  const pdiDimAverages: { key: string; label: string; avg: number }[] = pdiDimKeys.map((key) => {
    const vals = pdis.map((p) => p[key]).filter((v): v is number => v !== null)
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { key, label: pdiDimLabels[key], avg: Math.round(avg * 100) / 100 }
  })

  // Gap analysis: strongest vs weakest across self-assessment dimensions
  const sortedSelfDims = [...selfDimAverages].sort((a, b) => b.avg - a.avg)
  const strongestDim = sortedSelfDims[0] ?? null
  const weakestDim = sortedSelfDims[sortedSelfDims.length - 1] ?? null

  // Training analytics
  const trainingStats = trainings.map((t) => {
    const trainingParticipants = participants.filter((p) => p.training_id === t.id)
    const attended = trainingParticipants.filter((p) => p.status === 'attended').length
    const total = trainingParticipants.length
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0
    const statusCounts: Record<string, number> = { registered: 0, confirmed: 0, attended: 0, no_show: 0 }
    for (const p of trainingParticipants) {
      statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1
    }
    return {
      id: t.id,
      title: t.title,
      dateStart: t.training_date_start,
      dateEnd: t.training_date_end,
      location: t.location,
      maxParticipants: t.max_participants,
      status: t.status,
      company: t.company_name,
      totalParticipants: total,
      attendanceRate,
      statusCounts,
    }
  })

  // Upcoming turmas
  const now = new Date()
  const upcomingTurmas = trainingStats
    .filter((t) => new Date(t.dateStart) >= now && t.status !== 'cancelled')
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())

  // Participant status global distribution
  const globalParticipantStatus: Record<string, number> = { registered: 0, confirmed: 0, attended: 0, no_show: 0 }
  for (const p of participants) {
    globalParticipantStatus[p.status] = (globalParticipantStatus[p.status] ?? 0) + 1
  }

  return (
    <AnalyticsClient
      kpis={{
        totalUsers,
        activeStudents,
        overallCompletionRate,
        avgScore,
        totalCertificates,
      }}
      signupTrend={signupTrend}
      funnel={funnel}
      courseCompletionRates={courseCompletionRates}
      progressBuckets={progressBuckets}
      lessonCompletionList={lessonCompletionList}
      studentsAtRisk={studentsAtRisk}
      perfilDistribution={perfilDistribution}
      selfDimAverages={selfDimAverages}
      scoreHistogram={scoreHistogram}
      execDimAverages={execDimAverages}
      execCompanyBreakdown={execCompanyBreakdown}
      pdiPhaseDistribution={pdiPhaseDistribution}
      pdiDimAverages={pdiDimAverages}
      strongestDim={strongestDim}
      weakestDim={weakestDim}
      trainingStats={trainingStats}
      upcomingTurmas={upcomingTurmas}
      globalParticipantStatus={globalParticipantStatus}
      totalSelfAssessments={selfAssessments.length}
      totalExecAssessments={execAssessments.length}
      totalPDIs={pdis.length}
    />
  )
}
