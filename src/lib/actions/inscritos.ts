'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'

// ── Types ──────────────────────────────────────────────

export type InscritoRow = {
  id: string
  full_name: string | null
  email: string
  whatsapp: string | null
  company: string | null
  role: string
  created_at: string
  source: 'site' | 'presencial' | 'admin'
  hasAutoavaliacao: boolean
  hasExec: boolean
  hasPdi: boolean
  prospectId: string | null
  prospectStatus: string | null
}

export type InscritosStats = {
  total: number
  leads: number
  students: number
  managers: number
}

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

// ── Data Fetchers ─────────────────────────────────────

export async function getInscritos(): Promise<InscritoRow[]> {
  await verifyAdmin()

  const admin = createAdminClient()

  // Fetch all auth users with admin client (to get emails)
  const { data: authUsers, error: authError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  })

  if (authError || !authUsers?.users) {
    console.error('[inscritos] Failed to list auth users:', authError)
    return []
  }

  // Fetch all profiles
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  )

  // Fetch assessment data
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('user_id')

  const selfSet = new Set((selfAssessments ?? []).map((s) => s.user_id))

  // Fetch PDI data
  let pdiSet = new Set<string>()
  try {
    const { data: pdiData } = await admin.from('leadership_pdi').select('user_id')
    pdiSet = new Set((pdiData ?? []).map((p) => p.user_id))
  } catch {
    // Table may not exist
  }

  // Fetch exec assessment data
  let execSet = new Set<string>()
  try {
    const { data: execData } = await admin.from('leadership_executive_assessments').select('user_id')
    execSet = new Set((execData ?? []).map((e) => e.user_id))
  } catch {
    // Table may not exist
  }

  // Fetch CRM prospects to match by email
  const { data: prospects } = await admin
    .from('crm_prospects')
    .select('id, email, outreach_status')

  const prospectByEmail = new Map<string, { id: string; status: string }>()
  if (prospects) {
    for (const p of prospects) {
      if (p.email) {
        prospectByEmail.set(p.email.toLowerCase(), { id: p.id, status: p.outreach_status })
      }
    }
  }

  // Build rows combining auth users with profile data
  const rows: InscritoRow[] = []

  for (const authUser of authUsers.users) {
    const profile = profileMap.get(authUser.id)
    const email = authUser.email ?? ''
    const meta = authUser.user_metadata ?? {}
    const prospect = prospectByEmail.get(email.toLowerCase())

    // Determine source
    let source: InscritoRow['source'] = 'site'
    if (meta.created_by_admin) source = 'admin'
    else if (meta.source === 'presencial') source = 'presencial'

    rows.push({
      id: authUser.id,
      full_name: profile?.full_name ?? meta.full_name ?? null,
      email,
      whatsapp: meta.whatsapp ?? null,
      company: meta.company ?? null,
      role: profile?.role ?? 'student',
      created_at: profile?.created_at ?? authUser.created_at ?? '',
      source,
      hasAutoavaliacao: selfSet.has(authUser.id),
      hasExec: execSet.has(authUser.id),
      hasPdi: pdiSet.has(authUser.id),
      prospectId: prospect?.id ?? null,
      prospectStatus: prospect?.status ?? null,
    })
  }

  // Sort by created_at descending
  rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return rows
}

export async function getInscritosStats(): Promise<InscritosStats> {
  await verifyAdmin()

  const admin = createAdminClient()

  const { data: profiles } = await admin
    .from('profiles')
    .select('role')

  const roles = (profiles ?? []).map((p) => p.role)

  return {
    total: roles.length,
    leads: roles.filter((r) => r === 'student' || !r).length,
    students: roles.filter((r) => r === 'student').length,
    managers: roles.filter((r) => r === 'hr_manager').length,
  }
}

// ── Mutations ─────────────────────────────────────────

export async function classificarUsuario(formData: FormData) {
  const { supabase } = await verifyAdmin()
  const admin = createAdminClient()

  const userId = formData.get('userId') as string
  const newRole = formData.get('role') as string

  if (!userId || !newRole) return

  const validRoles = ['student', 'hr_manager', 'admin']
  if (!validRoles.includes(newRole)) return

  // Update profile role
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('[inscritos] Error updating role:', error)
    return
  }

  // If classified as student, create enrollment in the first available course
  if (newRole === 'student') {
    try {
      const { data: course } = await admin
        .from('courses')
        .select('id')
        .eq('is_published', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (course) {
        // Check if enrollment already exists
        const { data: existing } = await admin
          .from('enrollments')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', course.id)
          .maybeSingle()

        if (!existing) {
          await admin.from('enrollments').insert({
            user_id: userId,
            course_id: course.id,
            status: 'active',
          })
        }
      }
    } catch (e) {
      console.error('[inscritos] Enrollment creation failed:', e)
    }
  }

  revalidatePath('/admin/inscritos')
  revalidatePath('/admin/alunos')
  revalidatePath('/admin/gestores')
}
