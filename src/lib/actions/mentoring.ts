'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type { MentoringSession } from '@/types/management'

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

// ── Mentoring Constants ────────────────────────────────

const SESSION_TYPES = ['30_days', '60_days', 'extra'] as const
const SESSION_STATUSES = ['scheduled', 'completed', 'cancelled', 'no_show'] as const

type SessionType = (typeof SESSION_TYPES)[number]
type SessionStatus = (typeof SESSION_STATUSES)[number]

// ── Data Fetchers ─────────────────────────────────────

export async function getMentoringSessions(filters?: { alunoId?: string; status?: string }) {
  const { supabase } = await verifyAdmin()

  let query = supabase
    .from('mentoring_sessions')
    .select('*')
    .order('scheduled_date', { ascending: false })

  if (filters?.alunoId) {
    query = query.eq('aluno_user_id', filters.alunoId)
  }

  if (filters?.status && SESSION_STATUSES.includes(filters.status as SessionStatus)) {
    query = query.eq('status', filters.status)
  }

  const { data: sessions } = await query

  if (!sessions || sessions.length === 0) {
    return [] as Array<MentoringSession & { aluno_name: string }>
  }

  // Fetch aluno profiles for display names
  const alunoIds = [...new Set((sessions as MentoringSession[]).map((s) => s.aluno_user_id))]

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', alunoIds)

  const nameMap: Record<string, string> = {}
  for (const p of profiles ?? []) {
    nameMap[p.id] = p.full_name
  }

  return (sessions as MentoringSession[]).map((s) => ({
    ...s,
    aluno_name: nameMap[s.aluno_user_id] ?? '',
  }))
}

export async function getUpcomingMentoringSessions(days: number = 7) {
  const { supabase } = await verifyAdmin()

  const now = new Date()
  const future = new Date()
  future.setDate(future.getDate() + days)

  const { data: sessions } = await supabase
    .from('mentoring_sessions')
    .select('*')
    .eq('status', 'scheduled')
    .gte('scheduled_date', now.toISOString())
    .lte('scheduled_date', future.toISOString())
    .order('scheduled_date', { ascending: true })

  if (!sessions || sessions.length === 0) {
    return [] as Array<MentoringSession & { aluno_name: string }>
  }

  const alunoIds = [...new Set((sessions as MentoringSession[]).map((s) => s.aluno_user_id))]

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', alunoIds)

  const nameMap: Record<string, string> = {}
  for (const p of profiles ?? []) {
    nameMap[p.id] = p.full_name
  }

  return (sessions as MentoringSession[]).map((s) => ({
    ...s,
    aluno_name: nameMap[s.aluno_user_id] ?? '',
  }))
}

// ── Session CRUD ──────────────────────────────────────

export async function createMentoringSession(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const alunoUserId = str(formData, 'aluno_user_id')
  const mentorName = str(formData, 'mentor_name')
  const sessionType = str(formData, 'session_type') as SessionType

  if (!alunoUserId || !mentorName || !SESSION_TYPES.includes(sessionType)) return

  const { error } = await supabase.from('mentoring_sessions').insert({
    aluno_user_id: alunoUserId,
    training_id: str(formData, 'training_id') || null,
    mentor_name: mentorName,
    session_type: sessionType,
    scheduled_date: str(formData, 'scheduled_date') || null,
    status: 'scheduled' as SessionStatus,
    notes: str(formData, 'notes') || null,
    kpis_discussed: str(formData, 'kpis_discussed') || null,
  })

  if (error) {
    console.error('Error creating mentoring session:', error)
    return
  }

  revalidatePath('/admin/mentoring')
}

export async function updateMentoringSession(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const payload: Record<string, unknown> = {}

  const mentorName = str(formData, 'mentor_name')
  if (mentorName) payload.mentor_name = mentorName

  const sessionType = str(formData, 'session_type') as SessionType
  if (sessionType && SESSION_TYPES.includes(sessionType)) payload.session_type = sessionType

  const scheduledDate = str(formData, 'scheduled_date')
  if (scheduledDate) payload.scheduled_date = scheduledDate

  const notes = str(formData, 'notes')
  payload.notes = notes || null

  const kpisDiscussed = str(formData, 'kpis_discussed')
  payload.kpis_discussed = kpisDiscussed || null

  const trainingId = str(formData, 'training_id')
  if (trainingId) payload.training_id = trainingId

  const { error } = await supabase.from('mentoring_sessions').update(payload).eq('id', id)

  if (error) {
    console.error('Error updating mentoring session:', error)
    return
  }

  revalidatePath('/admin/mentoring')
}

export async function completeMentoringSession(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const payload: Record<string, unknown> = {
    status: 'completed' as SessionStatus,
    completed_date: new Date().toISOString(),
  }

  // Allow notes and kpis to be set on completion
  const notes = str(formData, 'notes')
  if (notes) payload.notes = notes

  const kpisDiscussed = str(formData, 'kpis_discussed')
  if (kpisDiscussed) payload.kpis_discussed = kpisDiscussed

  const { error } = await supabase.from('mentoring_sessions').update(payload).eq('id', id)

  if (error) {
    console.error('Error completing mentoring session:', error)
    return
  }

  revalidatePath('/admin/mentoring')
}

export async function cancelMentoringSession(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const id = str(formData, 'id')
  if (!id) return

  const { error } = await supabase
    .from('mentoring_sessions')
    .update({ status: 'cancelled' as SessionStatus })
    .eq('id', id)

  if (error) {
    console.error('Error cancelling mentoring session:', error)
    return
  }

  revalidatePath('/admin/mentoring')
}
