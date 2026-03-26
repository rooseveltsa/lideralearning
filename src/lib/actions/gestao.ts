'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type { AlunoCompleteProfile, MentoringSession } from '@/types/management'

// ── Helpers ────────────────────────────────────────────

async function verifyAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return { supabase, userId: user.id }
}

function str(fd: FormData, key: string): string {
  const val = fd.get(key)
  return typeof val === 'string' ? val.trim() : ''
}

// ── Relationship Constants ─────────────────────────────

const RELATIONSHIP_TYPES = ['direct_manager', 'hr', 'director'] as const
type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]

// ── Gestores List ─────────────────────────────────────

export async function getGestoresList() {
  const { supabase } = await verifyAdmin()

  const { data: gestores } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('role', 'hr_manager')
    .order('full_name', { ascending: true })

  if (!gestores || gestores.length === 0) {
    return [] as Array<{
      id: string
      full_name: string
      role: string
      created_at: string
      alunos_count: number
    }>
  }

  const gestorIds = gestores.map((g: { id: string }) => g.id)

  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('gestor_user_id')
    .in('gestor_user_id', gestorIds)

  const countMap: Record<string, number> = {}
  for (const r of relationships ?? []) {
    countMap[r.gestor_user_id] = (countMap[r.gestor_user_id] || 0) + 1
  }

  return gestores.map((g: { id: string; full_name: string; role: string; created_at: string }) => ({
    ...g,
    alunos_count: countMap[g.id] ?? 0,
  }))
}

// ── Gestor with Alunos ────────────────────────────────

export async function getGestorWithAlunos(gestorId: string) {
  const { supabase } = await verifyAdmin()

  const { data: gestorProfile } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', gestorId)
    .single()

  if (!gestorProfile) return null

  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('*')
    .eq('gestor_user_id', gestorId)

  const alunoIds = (relationships ?? []).map(
    (r: { aluno_user_id: string }) => r.aluno_user_id
  )

  if (alunoIds.length === 0) {
    return { gestor: gestorProfile, alunos: [] }
  }

  const { data: alunoProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .in('id', alunoIds)

  // Fetch summary data for each aluno
  const [
    { data: selfAssessments },
    { data: executiveAssessments },
    { data: trainingParticipants },
    { data: mentoringSessions },
  ] = await Promise.all([
    supabase
      .from('leadership_self_assessments')
      .select('id, user_id')
      .in('user_id', alunoIds),
    supabase
      .from('leadership_executive_assessments')
      .select('id, user_id')
      .in('user_id', alunoIds),
    supabase
      .from('presential_training_participants')
      .select('user_id, status')
      .in('user_id', alunoIds),
    supabase
      .from('mentoring_sessions')
      .select('aluno_user_id, status')
      .in('aluno_user_id', alunoIds),
  ])

  const selfMap: Record<string, number> = {}
  for (const sa of selfAssessments ?? []) {
    selfMap[sa.user_id] = (selfMap[sa.user_id] || 0) + 1
  }

  const execMap: Record<string, number> = {}
  for (const ea of executiveAssessments ?? []) {
    execMap[ea.user_id] = (execMap[ea.user_id] || 0) + 1
  }

  const trainingMap: Record<string, { total: number; attended: number }> = {}
  for (const tp of trainingParticipants ?? []) {
    if (!tp.user_id) continue
    if (!trainingMap[tp.user_id]) trainingMap[tp.user_id] = { total: 0, attended: 0 }
    trainingMap[tp.user_id].total++
    if (tp.status === 'attended') trainingMap[tp.user_id].attended++
  }

  const mentoringMap: Record<string, { total: number; completed: number }> = {}
  for (const ms of mentoringSessions ?? []) {
    if (!mentoringMap[ms.aluno_user_id]) mentoringMap[ms.aluno_user_id] = { total: 0, completed: 0 }
    mentoringMap[ms.aluno_user_id].total++
    if (ms.status === 'completed') mentoringMap[ms.aluno_user_id].completed++
  }

  const alunos = (alunoProfiles ?? []).map(
    (a: { id: string; full_name: string; role: string; created_at: string }) => {
      const rel = (relationships ?? []).find(
        (r: { aluno_user_id: string }) => r.aluno_user_id === a.id
      )
      return {
        ...a,
        company_name: rel?.company_name ?? null,
        relationship_type: rel?.relationship_type ?? null,
        self_assessments_count: selfMap[a.id] ?? 0,
        executive_assessments_count: execMap[a.id] ?? 0,
        trainings_attended: trainingMap[a.id]?.attended ?? 0,
        trainings_total: trainingMap[a.id]?.total ?? 0,
        mentoring_completed: mentoringMap[a.id]?.completed ?? 0,
        mentoring_total: mentoringMap[a.id]?.total ?? 0,
      }
    }
  )

  return { gestor: gestorProfile, alunos }
}

// ── Aluno Complete Profile ────────────────────────────

export async function getAlunoCompleteProfile(alunoId: string): Promise<AlunoCompleteProfile | null> {
  const { supabase } = await verifyAdmin()

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', alunoId)
    .single()

  if (!profile) return null

  // Fetch all related data in parallel
  const [
    { data: gestorRel },
    { data: selfAssessments },
    { data: executiveAssessments },
    { data: pdis },
    { data: trainingParticipants },
    { data: mentoringSessions },
    { data: enrollments },
  ] = await Promise.all([
    supabase
      .from('gestor_aluno_relationships')
      .select('gestor_user_id, company_name')
      .eq('aluno_user_id', alunoId)
      .limit(1),
    supabase
      .from('leadership_self_assessments')
      .select('id, pontuacao_total, perfil, created_at')
      .eq('user_id', alunoId)
      .order('created_at', { ascending: false }),
    supabase
      .from('leadership_executive_assessments')
      .select('*')
      .eq('user_id', alunoId)
      .order('created_at', { ascending: false }),
    supabase
      .from('leadership_pdi')
      .select('id, media_dimensoes, created_at')
      .eq('user_id', alunoId)
      .order('created_at', { ascending: false }),
    supabase
      .from('presential_training_participants')
      .select('id, training_id, status')
      .eq('user_id', alunoId),
    supabase
      .from('mentoring_sessions')
      .select('*')
      .eq('aluno_user_id', alunoId)
      .order('scheduled_date', { ascending: false }),
    supabase
      .from('enrollments')
      .select('id, course_id, status')
      .eq('user_id', alunoId),
  ])

  // Resolve gestor profile if exists
  let gestor: AlunoCompleteProfile['gestor'] = null
  const gestorRelData = (gestorRel ?? [])[0]
  if (gestorRelData) {
    const { data: gestorProfile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', gestorRelData.gestor_user_id)
      .single()

    if (gestorProfile) {
      gestor = {
        id: gestorProfile.id,
        full_name: gestorProfile.full_name,
        company_name: gestorRelData.company_name,
      }
    }
  }

  // Resolve training details
  const trainingIds = (trainingParticipants ?? [])
    .map((tp: { training_id: string }) => tp.training_id)
    .filter(Boolean)

  let trainingsData: Array<{ id: string; training_title: string; training_date: string; status: string }> = []
  if (trainingIds.length > 0) {
    const { data: trainings } = await supabase
      .from('presential_trainings')
      .select('id, title, training_date_start')
      .in('id', trainingIds)

    const participantStatusMap: Record<string, string> = {}
    for (const tp of trainingParticipants ?? []) {
      participantStatusMap[tp.training_id] = tp.status
    }

    trainingsData = (trainings ?? []).map(
      (t: { id: string; title: string; training_date_start: string }) => ({
        id: t.id,
        training_title: t.title,
        training_date: t.training_date_start,
        status: participantStatusMap[t.id] ?? 'registered',
      })
    )
  }

  // Resolve online courses
  const courseIds = (enrollments ?? []).map((e: { course_id: string }) => e.course_id)
  let onlineCourses: AlunoCompleteProfile['onlineCourses'] = []

  if (courseIds.length > 0) {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title')
      .in('id', courseIds)

    const courseMap: Record<string, string> = {}
    for (const c of courses ?? []) {
      courseMap[c.id] = c.title
    }

    // Calculate progress for each enrollment
    const enrollmentIds = (enrollments ?? []).map((e: { id: string }) => e.id)

    let progressData: Array<{ enrollment_id: string; is_completed: boolean }> = []
    if (enrollmentIds.length > 0) {
      const { data: progress } = await supabase
        .from('progress')
        .select('enrollment_id, is_completed')
        .in('enrollment_id', enrollmentIds)

      progressData = (progress ?? []) as Array<{ enrollment_id: string; is_completed: boolean }>
    }

    const progressMap: Record<string, { total: number; completed: number }> = {}
    for (const p of progressData) {
      if (!progressMap[p.enrollment_id]) progressMap[p.enrollment_id] = { total: 0, completed: 0 }
      progressMap[p.enrollment_id].total++
      if (p.is_completed) progressMap[p.enrollment_id].completed++
    }

    onlineCourses = (enrollments ?? []).map(
      (e: { id: string; course_id: string; status: string }) => {
        const prog = progressMap[e.id]
        const progressPct = prog && prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0
        return {
          course_id: e.course_id,
          course_title: courseMap[e.course_id] ?? '',
          status: e.status,
          progress_pct: progressPct,
        }
      }
    )
  }

  return {
    profile,
    gestor,
    selfAssessments: (selfAssessments ?? []) as AlunoCompleteProfile['selfAssessments'],
    executiveAssessments: (executiveAssessments ?? []) as AlunoCompleteProfile['executiveAssessments'],
    pdis: (pdis ?? []) as AlunoCompleteProfile['pdis'],
    trainings: trainingsData,
    mentoringSessions: (mentoringSessions ?? []) as MentoringSession[],
    onlineCourses,
  }
}

// ── Relationship CRUD ─────────────────────────────────

export async function createRelationship(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const gestorUserId = str(formData, 'gestor_user_id')
  const alunoUserId = str(formData, 'aluno_user_id')
  const relationshipType = str(formData, 'relationship_type') as RelationshipType

  if (!gestorUserId || !alunoUserId || !RELATIONSHIP_TYPES.includes(relationshipType)) return

  const { error } = await supabase.from('gestor_aluno_relationships').insert({
    gestor_user_id: gestorUserId,
    aluno_user_id: alunoUserId,
    company_name: str(formData, 'company_name') || null,
    relationship_type: relationshipType,
  })

  if (error) {
    console.error('Error creating relationship:', error)
    return
  }

  revalidatePath('/admin/gestao')
}

export async function removeRelationship(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const relationshipId = str(formData, 'relationship_id')
  if (!relationshipId) return

  await supabase.from('gestor_aluno_relationships').delete().eq('id', relationshipId)

  revalidatePath('/admin/gestao')
}

// ── PDI Classification & Linking ─────────────────────

/**
 * Get all executive assessments that are NOT yet linked to a supervisor user.
 */
export async function getUnlinkedExecAssessments() {
  const { supabase } = await verifyAdmin()

  const { data } = await supabase
    .from('leadership_executive_assessments')
    .select('id, user_id, nome_empresa, nome_supervisor, cargo_supervisor, nome_avaliador, media_dimensoes, pdi_type, created_at')
    .is('supervisor_user_id', null)
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) return []

  // Resolve who filled each assessment
  const userIds = [...new Set(data.map((d) => d.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)

  const profileMap = new Map<string, string>()
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p.full_name ?? 'Sem nome')
  }

  return data.map((d) => ({
    ...d,
    filled_by_name: profileMap.get(d.user_id) ?? 'Desconhecido',
  }))
}

/**
 * Get all executive assessments that ARE linked to a supervisor user.
 */
export async function getLinkedExecAssessments() {
  const { supabase } = await verifyAdmin()

  const { data } = await supabase
    .from('leadership_executive_assessments')
    .select('id, user_id, supervisor_user_id, nome_empresa, nome_supervisor, cargo_supervisor, nome_avaliador, media_dimensoes, pdi_type, created_at')
    .not('supervisor_user_id', 'is', null)
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) return []

  // Resolve user names
  const allUserIds = [...new Set([
    ...data.map((d) => d.user_id),
    ...data.map((d) => d.supervisor_user_id).filter(Boolean),
  ])]

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', allUserIds as string[])

  const profileMap = new Map<string, string>()
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p.full_name ?? 'Sem nome')
  }

  // Check if PDI exists for linked supervisor
  const supervisorIds = data.map((d) => d.supervisor_user_id).filter(Boolean) as string[]
  const { data: selfAssessments } = await supabase
    .from('leadership_self_assessments')
    .select('user_id')
    .in('user_id', supervisorIds)

  const hasSelfSet = new Set((selfAssessments ?? []).map((sa) => sa.user_id))

  return data.map((d) => ({
    ...d,
    filled_by_name: profileMap.get(d.user_id) ?? 'Desconhecido',
    supervisor_name: d.supervisor_user_id ? profileMap.get(d.supervisor_user_id) ?? 'Desconhecido' : null,
    has_pdi: d.supervisor_user_id ? hasSelfSet.has(d.supervisor_user_id) : false,
  }))
}

/**
 * Link an executive assessment to a supervisor user.
 * Also creates a gestor_aluno_relationships entry if not already present.
 */
export async function linkExecToSupervisor(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const assessmentId = str(formData, 'assessment_id')
  const supervisorUserId = str(formData, 'supervisor_user_id')

  if (!assessmentId || !supervisorUserId) return

  // Update the executive assessment
  const { error } = await supabase
    .from('leadership_executive_assessments')
    .update({
      supervisor_user_id: supervisorUserId,
      pdi_type: 'corporate',
    })
    .eq('id', assessmentId)

  if (error) {
    console.error('Error linking exec to supervisor:', error)
    return
  }

  // Get the assessment to find the gestor (user_id = the person who filled it)
  const { data: assessment } = await supabase
    .from('leadership_executive_assessments')
    .select('user_id, nome_empresa')
    .eq('id', assessmentId)
    .single()

  if (assessment) {
    // Check if relationship already exists
    const { data: existing } = await supabase
      .from('gestor_aluno_relationships')
      .select('id')
      .eq('gestor_user_id', assessment.user_id)
      .eq('aluno_user_id', supervisorUserId)
      .limit(1)
      .maybeSingle()

    if (!existing) {
      await supabase.from('gestor_aluno_relationships').insert({
        gestor_user_id: assessment.user_id,
        aluno_user_id: supervisorUserId,
        company_name: assessment.nome_empresa || null,
        relationship_type: 'direct_manager',
      })
    }
  }

  revalidatePath('/admin/classificacao')
}

/**
 * Unlink an executive assessment from a supervisor.
 */
export async function unlinkExecFromSupervisor(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const assessmentId = str(formData, 'assessment_id')
  if (!assessmentId) return

  const { error } = await supabase
    .from('leadership_executive_assessments')
    .update({
      supervisor_user_id: null,
    })
    .eq('id', assessmentId)

  if (error) {
    console.error('Error unlinking exec from supervisor:', error)
  }

  revalidatePath('/admin/classificacao')
}

/**
 * Search users (profiles) by name for the linking UI.
 */
export async function searchUsers(query: string) {
  const { supabase } = await verifyAdmin()

  if (!query || query.length < 2) return []

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .ilike('full_name', `%${query}%`)
    .order('full_name')
    .limit(10)

  return data ?? []
}

/**
 * Get KPI counts for the classification page.
 */
export async function getClassificacaoKPIs() {
  const { supabase } = await verifyAdmin()

  // Count individual PDIs (exec assessments without supervisor_user_id)
  const { count: pendingCount } = await supabase
    .from('leadership_executive_assessments')
    .select('id', { count: 'exact', head: true })
    .is('supervisor_user_id', null)

  // Count corporate PDIs (exec assessments with supervisor_user_id)
  const { count: corporateCount } = await supabase
    .from('leadership_executive_assessments')
    .select('id', { count: 'exact', head: true })
    .not('supervisor_user_id', 'is', null)

  // Count individual PDIs: users with self-assessment but no exec linked to them
  const { data: selfOnly } = await supabase
    .from('leadership_self_assessments')
    .select('user_id')

  const selfUserIds = [...new Set((selfOnly ?? []).map((s) => s.user_id))]

  let individualCount = 0
  if (selfUserIds.length > 0) {
    const { count } = await supabase
      .from('leadership_executive_assessments')
      .select('supervisor_user_id', { count: 'exact', head: true })
      .in('supervisor_user_id', selfUserIds)

    // Individual = selfUserIds that do NOT have a corporate exec linked
    const linkedSupervisorIds = new Set<string>()
    const { data: linkedExecs } = await supabase
      .from('leadership_executive_assessments')
      .select('supervisor_user_id')
      .not('supervisor_user_id', 'is', null)
      .in('supervisor_user_id', selfUserIds)

    for (const le of linkedExecs ?? []) {
      if (le.supervisor_user_id) linkedSupervisorIds.add(le.supervisor_user_id)
    }

    individualCount = selfUserIds.filter((uid) => !linkedSupervisorIds.has(uid)).length
  }

  return {
    individual: individualCount,
    corporate: corporateCount ?? 0,
    pending: pendingCount ?? 0,
  }
}

// ── Alunos List with Status ───────────────────────────

export async function getAlunosWithStatus() {
  const { supabase } = await verifyAdmin()

  const { data: alunos } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('role', 'student')
    .order('full_name', { ascending: true })

  if (!alunos || alunos.length === 0) return []

  const alunoIds = alunos.map((a: { id: string }) => a.id)

  // Fetch all summary data in parallel
  const [
    { data: relationships },
    { data: selfAssessments },
    { data: executiveAssessments },
    { data: pdis },
    { data: trainingParticipants },
    { data: mentoringSessions },
  ] = await Promise.all([
    supabase
      .from('gestor_aluno_relationships')
      .select('aluno_user_id, company_name')
      .in('aluno_user_id', alunoIds),
    supabase
      .from('leadership_self_assessments')
      .select('user_id, created_at')
      .in('user_id', alunoIds),
    supabase
      .from('leadership_executive_assessments')
      .select('user_id, created_at')
      .in('user_id', alunoIds),
    supabase
      .from('leadership_pdi')
      .select('user_id, created_at')
      .in('user_id', alunoIds),
    supabase
      .from('presential_training_participants')
      .select('user_id, created_at')
      .in('user_id', alunoIds),
    supabase
      .from('mentoring_sessions')
      .select('aluno_user_id, created_at')
      .in('aluno_user_id', alunoIds),
  ])

  // Build company map from relationships
  const companyMap: Record<string, string> = {}
  for (const r of relationships ?? []) {
    if (r.company_name) companyMap[r.aluno_user_id] = r.company_name
  }

  // Count forms per aluno
  const formsCountMap: Record<string, number> = {}
  for (const sa of selfAssessments ?? []) {
    formsCountMap[sa.user_id] = (formsCountMap[sa.user_id] || 0) + 1
  }
  for (const ea of executiveAssessments ?? []) {
    formsCountMap[ea.user_id] = (formsCountMap[ea.user_id] || 0) + 1
  }
  for (const pdi of pdis ?? []) {
    formsCountMap[pdi.user_id] = (formsCountMap[pdi.user_id] || 0) + 1
  }

  // Find last activity per aluno
  const lastActivityMap: Record<string, string> = {}

  const allActivities = [
    ...(selfAssessments ?? []).map((sa: { user_id: string; created_at: string }) => ({
      user_id: sa.user_id,
      date: sa.created_at,
    })),
    ...(executiveAssessments ?? []).map((ea: { user_id: string; created_at: string }) => ({
      user_id: ea.user_id,
      date: ea.created_at,
    })),
    ...(pdis ?? []).map((p: { user_id: string; created_at: string }) => ({
      user_id: p.user_id,
      date: p.created_at,
    })),
    ...(trainingParticipants ?? [])
      .filter((tp: { user_id: string | null }) => tp.user_id)
      .map((tp: { user_id: string | null; created_at: string }) => ({
        user_id: tp.user_id as string,
        date: tp.created_at,
      })),
    ...(mentoringSessions ?? []).map((ms: { aluno_user_id: string; created_at: string }) => ({
      user_id: ms.aluno_user_id,
      date: ms.created_at,
    })),
  ]

  for (const activity of allActivities) {
    if (!lastActivityMap[activity.user_id] || activity.date > lastActivityMap[activity.user_id]) {
      lastActivityMap[activity.user_id] = activity.date
    }
  }

  return alunos.map((a: { id: string; full_name: string; role: string; created_at: string }) => ({
    ...a,
    company_name: companyMap[a.id] ?? null,
    forms_count: formsCountMap[a.id] ?? 0,
    last_activity: lastActivityMap[a.id] ?? null,
  }))
}
