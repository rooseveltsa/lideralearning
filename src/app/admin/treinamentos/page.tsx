import { GraduationCap } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import TreinamentosClient from './TreinamentosClient'

export const metadata = {
  title: 'Treinamentos | Lidera Admin',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TrainingRow = {
  id: string
  title: string
  training_date_start: string
  training_date_end: string
  location: string | null
  status: string
  max_participants: number
  company_name: string | null
  created_at: string
}

type MentoringRow = {
  id: string
  aluno_user_id: string
  session_type: string
  scheduled_date: string | null
  completed_date: string | null
  status: string
  notes: string | null
  mentor_name: string | null
}

type CourseRow = {
  id: string
  title: string
  is_published: boolean
  created_at: string
  thumbnail_url: string | null
}

type ModuleRow = {
  id: string
  course_id: string
  title: string
  order_index: number
}

type EnrollmentRow = {
  id: string
  user_id: string
  course_id: string
  status: string
  created_at: string
}

type ProfileMap = Record<string, string>

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function fetchTreinamentosData() {
  const admin = createAdminClient()

  try {
    const [trainingsRes, mentoringsRes, coursesRes, modulesRes, enrollmentsRes] =
      await Promise.all([
        admin
          .from('presential_trainings')
          .select(
            'id, title, training_date_start, training_date_end, location, status, max_participants, company_name, created_at'
          )
          .order('training_date_start', { ascending: false }),
        admin
          .from('mentoring_sessions')
          .select(
            'id, aluno_user_id, session_type, scheduled_date, completed_date, status, notes, mentor_name'
          )
          .order('scheduled_date', { ascending: false }),
        admin
          .from('courses')
          .select('id, title, is_published, created_at, thumbnail_url')
          .order('created_at', { ascending: false }),
        admin.from('modules').select('id, course_id, title, order_index'),
        admin.from('enrollments').select('id, user_id, course_id, status'),
      ])

    const trainings = (trainingsRes.data ?? []) as TrainingRow[]
    const mentorings = (mentoringsRes.data ?? []) as MentoringRow[]
    const courses = (coursesRes.data ?? []) as CourseRow[]
    const modules = (modulesRes.data ?? []) as ModuleRow[]
    const enrollments = (enrollmentsRes.data ?? []) as EnrollmentRow[]

    // Fetch participant counts per training
    const trainingIds = trainings.map((t) => t.id)
    let participantCounts: Record<string, number> = {}
    if (trainingIds.length > 0) {
      const { data: participants } = await admin
        .from('training_participants')
        .select('training_id')
        .in('training_id', trainingIds)

      if (participants) {
        participantCounts = participants.reduce<Record<string, number>>((acc, p) => {
          acc[p.training_id] = (acc[p.training_id] ?? 0) + 1
          return acc
        }, {})
      }
    }

    // Fetch profiles for mentoring names
    const alunoIds = [...new Set(mentorings.map((m) => m.aluno_user_id))]
    const profileMap: ProfileMap = {}
    if (alunoIds.length > 0) {
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, full_name')
        .in('id', alunoIds)

      if (profiles) {
        for (const p of profiles) {
          profileMap[p.id] = p.full_name ?? 'Sem nome'
        }
      }
    }

    return {
      trainings,
      mentorings,
      courses,
      modules,
      enrollments,
      participantCounts,
      profileMap,
    }
  } catch (error) {
    console.error('Error fetching treinamentos data:', error)
    return {
      trainings: [] as TrainingRow[],
      mentorings: [] as MentoringRow[],
      courses: [] as CourseRow[],
      modules: [] as ModuleRow[],
      enrollments: [] as EnrollmentRow[],
      participantCounts: {} as Record<string, number>,
      profileMap: {} as ProfileMap,
    }
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TreinamentosPage() {
  const {
    trainings,
    mentorings,
    courses,
    modules,
    enrollments,
    participantCounts,
    profileMap,
  } = await fetchTreinamentosData()

  const turmasCount = trainings.length
  const mentoriasCount = mentorings.length
  const cursosCount = courses.length

  return (
    <div className="space-y-0">
      {/* Compact Header */}
      <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1565C0]/10">
            <GraduationCap className="h-5 w-5 text-[#1565C0]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold leading-tight text-[#0F172A]">
              Treinamentos
            </h1>
            <p className="text-xs text-[#64748B]">
              Turmas, mentorias, programa e cursos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
            {turmasCount} turmas
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B1FA2]" />
            {mentoriasCount} mentorias
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F57C00]" />
            {cursosCount} cursos
          </span>
        </div>
      </div>

      <TreinamentosClient
        trainings={trainings}
        mentorings={mentorings}
        courses={courses}
        modules={modules}
        enrollments={enrollments}
        participantCounts={participantCounts}
        profileMap={profileMap}
      />
    </div>
  )
}
