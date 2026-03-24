'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type {
  TrainingWithParticipantCount,
  PresentialTraining,
  ParticipantWithProfile,
} from '@/types/management'

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

// ── Training Constants ─────────────────────────────────

const TRAINING_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const
const PARTICIPANT_STATUSES = ['registered', 'confirmed', 'attended', 'no_show'] as const

type TrainingStatus = (typeof TRAINING_STATUSES)[number]
type ParticipantStatus = (typeof PARTICIPANT_STATUSES)[number]

// ── Data Fetchers ─────────────────────────────────────

export async function getTurmas() {
  const { supabase } = await verifyAdmin()

  const { data: trainings } = await supabase
    .from('presential_trainings')
    .select('*')
    .order('training_date_start', { ascending: false })

  if (!trainings || trainings.length === 0) {
    return [] as TrainingWithParticipantCount[]
  }

  const trainingIds = trainings.map((t: { id: string }) => t.id)

  const { data: participants } = await supabase
    .from('presential_training_participants')
    .select('training_id, status')
    .in('training_id', trainingIds)

  const countMap: Record<string, { total: number; attended: number }> = {}
  for (const p of participants ?? []) {
    if (!countMap[p.training_id]) countMap[p.training_id] = { total: 0, attended: 0 }
    countMap[p.training_id].total++
    if (p.status === 'attended') countMap[p.training_id].attended++
  }

  return trainings.map((t: PresentialTraining) => ({
    ...t,
    participant_count: countMap[t.id]?.total ?? 0,
    attended_count: countMap[t.id]?.attended ?? 0,
  })) as TrainingWithParticipantCount[]
}

export async function getTurmaById(id: string) {
  const { supabase } = await verifyAdmin()

  const { data: training } = await supabase
    .from('presential_trainings')
    .select('*')
    .eq('id', id)
    .single()

  if (!training) return null

  const { data: participants } = await supabase
    .from('presential_training_participants')
    .select('*')
    .eq('training_id', id)
    .order('created_at', { ascending: false })

  const participantList = participants ?? []

  const userIds = participantList
    .filter((p: { user_id: string | null }) => p.user_id)
    .map((p: { user_id: string | null }) => p.user_id as string)

  const gestorIds = participantList
    .filter((p: { gestor_id: string | null }) => p.gestor_id)
    .map((p: { gestor_id: string | null }) => p.gestor_id as string)

  const allProfileIds = [...new Set([...userIds, ...gestorIds])]

  let profilesMap: Record<string, { full_name: string; role: string }> = {}
  if (allProfileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('id', allProfileIds)

    for (const p of profiles ?? []) {
      profilesMap[p.id] = { full_name: p.full_name, role: p.role }
    }
  }

  const enrichedParticipants: ParticipantWithProfile[] = participantList.map(
    (p: { user_id: string | null; gestor_id: string | null }) => ({
      ...p,
      profile: p.user_id ? profilesMap[p.user_id] ?? null : null,
      gestor_profile: p.gestor_id
        ? { full_name: profilesMap[p.gestor_id]?.full_name ?? '' }
        : null,
    })
  ) as ParticipantWithProfile[]

  return {
    training: training as PresentialTraining,
    participants: enrichedParticipants,
  }
}

// ── Training CRUD ─────────────────────────────────────

export async function createTurma(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const title = str(formData, 'title')
  const mentorName = str(formData, 'mentor_name')
  const dateStart = str(formData, 'training_date_start')
  const dateEnd = str(formData, 'training_date_end')

  if (!title || !mentorName || !dateStart || !dateEnd) return

  const maxParticipants = parseInt(str(formData, 'max_participants')) || 30

  const { error } = await supabase.from('presential_trainings').insert({
    title,
    description: str(formData, 'description') || null,
    training_date_start: dateStart,
    training_date_end: dateEnd,
    location: str(formData, 'location') || null,
    max_participants: maxParticipants,
    mentor_name: mentorName,
    status: 'scheduled' as TrainingStatus,
    company_name: str(formData, 'company_name') || null,
  })

  if (error) {
    console.error('Error creating turma:', error)
    return
  }

  revalidatePath('/admin/turmas')
}

export async function updateTurma(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const payload: Record<string, unknown> = {}

  const title = str(formData, 'title')
  if (title) payload.title = title

  const description = str(formData, 'description')
  payload.description = description || null

  const dateStart = str(formData, 'training_date_start')
  if (dateStart) payload.training_date_start = dateStart

  const dateEnd = str(formData, 'training_date_end')
  if (dateEnd) payload.training_date_end = dateEnd

  const location = str(formData, 'location')
  payload.location = location || null

  const maxParticipants = str(formData, 'max_participants')
  if (maxParticipants) payload.max_participants = parseInt(maxParticipants)

  const mentorName = str(formData, 'mentor_name')
  if (mentorName) payload.mentor_name = mentorName

  const status = str(formData, 'status') as TrainingStatus
  if (status && TRAINING_STATUSES.includes(status)) payload.status = status

  const companyName = str(formData, 'company_name')
  payload.company_name = companyName || null

  const { error } = await supabase.from('presential_trainings').update(payload).eq('id', id)

  if (error) {
    console.error('Error updating turma:', error)
    return
  }

  revalidatePath('/admin/turmas')
}

export async function cancelTurma(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const { error } = await supabase
    .from('presential_trainings')
    .update({ status: 'cancelled' as TrainingStatus })
    .eq('id', id)

  if (error) {
    console.error('Error cancelling turma:', error)
    return
  }

  revalidatePath('/admin/turmas')
}

export async function completeTurma(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const { error } = await supabase
    .from('presential_trainings')
    .update({ status: 'completed' as TrainingStatus })
    .eq('id', id)

  if (error) {
    console.error('Error completing turma:', error)
    return
  }

  revalidatePath('/admin/turmas')
}

// ── Participant Management ────────────────────────────

export async function addParticipant(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const trainingId = str(formData, 'training_id')
  const participantName = str(formData, 'participant_name')

  if (!trainingId || !participantName) return

  const userId = str(formData, 'user_id') || null
  const gestorId = str(formData, 'gestor_id') || null

  const { error } = await supabase.from('presential_training_participants').insert({
    training_id: trainingId,
    user_id: userId,
    gestor_id: gestorId,
    participant_name: participantName,
    participant_email: str(formData, 'participant_email') || null,
    company_name: str(formData, 'company_name') || null,
    status: 'registered' as ParticipantStatus,
  })

  if (error) {
    console.error('Error adding participant:', error)
    return
  }

  // Create gestor-aluno relationship if both user_id and gestor_id are provided
  if (userId && gestorId) {
    const relationshipType = str(formData, 'relationship_type') || 'direct_manager'
    const companyName = str(formData, 'company_name') || null

    await supabase.from('gestor_aluno_relationships').upsert(
      {
        gestor_user_id: gestorId,
        aluno_user_id: userId,
        company_name: companyName,
        relationship_type: relationshipType,
      },
      { onConflict: 'gestor_user_id,aluno_user_id' }
    )
  }

  revalidatePath('/admin/turmas')
}

export async function removeParticipant(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const participantId = str(formData, 'participant_id')
  if (!participantId) return

  await supabase.from('presential_training_participants').delete().eq('id', participantId)

  revalidatePath('/admin/turmas')
}

export async function updateParticipantStatus(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const participantId = str(formData, 'participant_id')
  const status = str(formData, 'status') as ParticipantStatus

  if (!participantId || !PARTICIPANT_STATUSES.includes(status)) return

  const { error } = await supabase
    .from('presential_training_participants')
    .update({ status })
    .eq('id', participantId)

  if (error) {
    console.error('Error updating participant status:', error)
    return
  }

  revalidatePath('/admin/turmas')
}
