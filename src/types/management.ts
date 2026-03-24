export type PresentialTraining = {
  id: string
  title: string
  description: string | null
  training_date_start: string
  training_date_end: string
  location: string | null
  max_participants: number
  mentor_name: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  company_name: string | null
  created_at: string
  updated_at: string
}

export type TrainingParticipant = {
  id: string
  training_id: string
  user_id: string | null
  gestor_id: string | null
  participant_name: string
  participant_email: string | null
  company_name: string | null
  status: 'registered' | 'confirmed' | 'attended' | 'no_show'
  created_at: string
}

export type GestorAlunoRelationship = {
  id: string
  gestor_user_id: string
  aluno_user_id: string
  company_name: string | null
  relationship_type: 'direct_manager' | 'hr' | 'director'
  created_at: string
}

export type MentoringSession = {
  id: string
  aluno_user_id: string
  training_id: string | null
  mentor_name: string
  session_type: '30_days' | '60_days' | 'extra'
  scheduled_date: string | null
  completed_date: string | null
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes: string | null
  kpis_discussed: string | null
  created_at: string
}

// Joined types for queries
export type ParticipantWithProfile = TrainingParticipant & {
  profile?: { full_name: string; role: string } | null
  gestor_profile?: { full_name: string } | null
}

export type TrainingWithParticipantCount = PresentialTraining & {
  participant_count: number
  attended_count: number
}

export type AlunoCompleteProfile = {
  profile: { id: string; full_name: string; role: string; created_at: string }
  gestor?: { id: string; full_name: string; company_name: string | null } | null
  selfAssessments: Array<{ id: string; pontuacao_total: number; perfil: string; created_at: string }>
  executiveAssessments: Array<{ id: string; created_at: string; [key: string]: unknown }>
  pdis: Array<{ id: string; media_dimensoes: number | null; created_at: string }>
  trainings: Array<{ id: string; training_title: string; training_date: string; status: string }>
  mentoringSessions: Array<MentoringSession>
  onlineCourses: Array<{ course_id: string; course_title: string; status: string; progress_pct: number }>
}
