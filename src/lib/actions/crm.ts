'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

// ── Types ──────────────────────────────────────────────

const JOB_FUNCTIONS = [
  'supervisor', 'coordenador', 'gerente', 'diretor', 'vp', 'c_level', 'rh', 'treinamento', 'outro',
] as const

const OUTREACH_STATUSES = [
  'not_contacted', 'connection_sent', 'connected', 'message_sent', 'replied', 'meeting_scheduled', 'converted', 'not_interested',
] as const

const PIPELINE_STAGES = [
  'prospecting', 'first_contact', 'qualification', 'meeting', 'proposal', 'negotiation', 'won', 'lost',
] as const

const TEMPERATURES = ['cold', 'warm', 'hot'] as const

const ACTIVITY_TYPES = ['note', 'call', 'email', 'linkedin_message', 'meeting', 'proposal', 'status_change', 'qualification'] as const

type JobFunction = (typeof JOB_FUNCTIONS)[number]
type OutreachStatus = (typeof OUTREACH_STATUSES)[number]
type PipelineStage = (typeof PIPELINE_STAGES)[number]
type Temperature = (typeof TEMPERATURES)[number]
type QualificationStatus = 'pending' | 'qualified' | 'unqualified' | 'nurturing'
type ActivityType = (typeof ACTIVITY_TYPES)[number]

export type CrmProspect = {
  id: string
  full_name: string
  job_title: string
  job_function: JobFunction
  company_name: string
  company_size: string | null
  linkedin_url: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  outreach_status: OutreachStatus
  sdr_owner_id: string | null
  notes: string | null
  converted_lead_id: string | null
  last_outreach_at: string | null
  created_at: string
  updated_at: string
}

export type CrmActivity = {
  id: string
  lead_id: string | null
  prospect_id: string | null
  activity_type: ActivityType
  title: string
  description: string | null
  outcome: string | null
  scheduled_at: string | null
  completed_at: string | null
  created_by: string | null
  created_at: string
}

export type CrmLeadScore = {
  id: string
  lead_id: string
  budget_score: number
  authority_score: number
  need_score: number
  timeline_score: number
  total_score: number
  qualification_status: QualificationStatus
  closer_notes: string | null
  qualified_by: string | null
  qualified_at: string | null
  created_at: string
  updated_at: string
}

export type EnhancedLead = {
  id: string
  full_name: string
  company_name: string
  managers_range: string
  whatsapp: string
  email: string | null
  source_page: string
  notes: string | null
  status: string
  owner_user_id: string | null
  last_contact_at: string | null
  pipeline_stage: PipelineStage
  temperature: Temperature
  estimated_value: number | null
  next_action: string | null
  next_action_at: string | null
  lost_reason: string | null
  created_at: string
  updated_at: string
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

function str(fd: FormData, key: string): string {
  const val = fd.get(key)
  return typeof val === 'string' ? val.trim() : ''
}

// ── SDR: Prospect CRUD ────────────────────────────────

export async function createProspect(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const fullName = str(formData, 'full_name')
  const jobTitle = str(formData, 'job_title')
  const jobFunction = str(formData, 'job_function') as JobFunction
  const companyName = str(formData, 'company_name')

  if (!fullName || !jobTitle || !companyName || !JOB_FUNCTIONS.includes(jobFunction)) return

  const { error } = await supabase.from('crm_prospects').insert({
    full_name: fullName,
    job_title: jobTitle,
    job_function: jobFunction,
    company_name: companyName,
    company_size: str(formData, 'company_size') || null,
    linkedin_url: str(formData, 'linkedin_url') || null,
    email: str(formData, 'email') || null,
    phone: str(formData, 'phone') || null,
    city: str(formData, 'city') || null,
    state: str(formData, 'state') || null,
    sdr_owner_id: userId,
  })

  if (error) {
    console.error('Error creating prospect:', error)
    return
  }

  revalidatePath('/admin/crm/sdr')
}

export async function updateProspectStatus(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const prospectId = str(formData, 'prospect_id')
  const outreachStatus = str(formData, 'outreach_status') as OutreachStatus

  if (!prospectId || !OUTREACH_STATUSES.includes(outreachStatus)) return

  const { error } = await supabase
    .from('crm_prospects')
    .update({
      outreach_status: outreachStatus,
      last_outreach_at: outreachStatus !== 'not_contacted' ? new Date().toISOString() : undefined,
    })
    .eq('id', prospectId)

  if (error) {
    console.error('Error updating prospect status:', error)
    return
  }

  revalidatePath('/admin/crm/sdr')
}

export async function convertProspectToLead(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const prospectId = str(formData, 'prospect_id')
  if (!prospectId) return

  const { data: prospect } = await supabase
    .from('crm_prospects')
    .select('*')
    .eq('id', prospectId)
    .single()

  if (!prospect) return

  const { data: lead, error: leadError } = await supabase
    .from('b2b_leads')
    .insert({
      full_name: prospect.full_name,
      company_name: prospect.company_name,
      managers_range: 'LinkedIn',
      whatsapp: prospect.phone || 'Não informado',
      email: prospect.email,
      source_page: 'linkedin_sdr',
      notes: `Cargo: ${prospect.job_title} | LinkedIn: ${prospect.linkedin_url || 'N/A'}`,
      status: 'contacted',
      pipeline_stage: 'first_contact',
      temperature: 'warm',
      owner_user_id: userId,
    })
    .select('id')
    .single()

  if (leadError || !lead) {
    console.error('Error converting prospect to lead:', leadError)
    return
  }

  await supabase
    .from('crm_prospects')
    .update({ outreach_status: 'converted', converted_lead_id: lead.id })
    .eq('id', prospectId)

  await supabase.from('crm_activities').insert({
    lead_id: lead.id,
    prospect_id: prospectId,
    activity_type: 'status_change',
    title: 'Prospect convertido em lead',
    description: `Prospect ${prospect.full_name} (${prospect.job_title} @ ${prospect.company_name}) convertido de LinkedIn SDR.`,
    created_by: userId,
    completed_at: new Date().toISOString(),
  })

  revalidatePath('/admin/crm/sdr')
  revalidatePath('/admin/crm/closer')
  revalidatePath('/admin/crm')
}

export async function deleteProspect(formData: FormData) {
  const { supabase } = await verifyAdmin()

  const prospectId = str(formData, 'prospect_id')
  if (!prospectId) return

  await supabase.from('crm_prospects').delete().eq('id', prospectId)

  revalidatePath('/admin/crm/sdr')
}

// ── Closer: Qualification ─────────────────────────────

export async function qualifyLead(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const leadId = str(formData, 'lead_id')
  if (!leadId) return

  const budgetScore = parseInt(str(formData, 'budget_score')) || 0
  const authorityScore = parseInt(str(formData, 'authority_score')) || 0
  const needScore = parseInt(str(formData, 'need_score')) || 0
  const timelineScore = parseInt(str(formData, 'timeline_score')) || 0
  const closerNotes = str(formData, 'closer_notes')

  const totalScore = budgetScore + authorityScore + needScore + timelineScore
  let qualificationStatus: QualificationStatus = 'pending'

  if (totalScore >= 14) qualificationStatus = 'qualified'
  else if (totalScore >= 8) qualificationStatus = 'nurturing'
  else qualificationStatus = 'unqualified'

  const { error } = await supabase
    .from('crm_lead_scores')
    .upsert(
      {
        lead_id: leadId,
        budget_score: budgetScore,
        authority_score: authorityScore,
        need_score: needScore,
        timeline_score: timelineScore,
        qualification_status: qualificationStatus,
        closer_notes: closerNotes || null,
        qualified_by: userId,
        qualified_at: new Date().toISOString(),
      },
      { onConflict: 'lead_id' }
    )

  if (error) {
    console.error('Error qualifying lead:', error)
    return
  }

  const newStage: PipelineStage = qualificationStatus === 'qualified' ? 'meeting' : 'qualification'
  const newTemp: Temperature = qualificationStatus === 'qualified' ? 'hot' : qualificationStatus === 'nurturing' ? 'warm' : 'cold'

  await supabase
    .from('b2b_leads')
    .update({
      status: qualificationStatus === 'qualified' ? 'qualified' : 'contacted',
      pipeline_stage: newStage,
      temperature: newTemp,
      last_contact_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  await supabase.from('crm_activities').insert({
    lead_id: leadId,
    activity_type: 'qualification',
    title: `Lead qualificado: ${qualificationStatus.toUpperCase()}`,
    description: `BANT Score: B${budgetScore} A${authorityScore} N${needScore} T${timelineScore} = ${totalScore}/20. ${closerNotes || ''}`,
    outcome: qualificationStatus,
    created_by: userId,
    completed_at: new Date().toISOString(),
  })

  revalidatePath('/admin/crm/closer')
  revalidatePath('/admin/crm')
}

// ── Lead CRUD ─────────────────────────────────────────

export async function createLead(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const companyName = str(formData, 'company_name')
  const fullName = str(formData, 'full_name')
  const whatsapp = str(formData, 'whatsapp') || 'Nao informado'

  if (!companyName || !fullName) return

  const estimatedValue = str(formData, 'estimated_value')

  const { error } = await supabase.from('b2b_leads').insert({
    full_name: fullName,
    company_name: companyName,
    managers_range: str(formData, 'managers_range') || 'Nao informado',
    whatsapp,
    email: str(formData, 'email') || null,
    source_page: 'crm_manual',
    notes: str(formData, 'notes') || null,
    status: 'new',
    pipeline_stage: 'prospecting' as PipelineStage,
    temperature: 'cold' as Temperature,
    estimated_value: estimatedValue ? parseFloat(estimatedValue) : null,
    owner_user_id: userId,
  })

  if (error) {
    console.error('Error creating lead:', error)
    return
  }

  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/sdr')
  revalidatePath('/admin/crm/closer')
  revalidatePath('/admin/crm/funil')
}

// ── Pipeline: Stage management ────────────────────────

export async function updateLeadPipeline(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const leadId = str(formData, 'lead_id')
  const pipelineStage = str(formData, 'pipeline_stage') as PipelineStage
  const temperature = str(formData, 'temperature') as Temperature

  if (!leadId || !PIPELINE_STAGES.includes(pipelineStage)) return

  const payload: Record<string, unknown> = {
    pipeline_stage: pipelineStage,
    last_contact_at: new Date().toISOString(),
  }

  if (TEMPERATURES.includes(temperature)) {
    payload.temperature = temperature
  }

  const estimatedValue = str(formData, 'estimated_value')
  if (estimatedValue) payload.estimated_value = parseFloat(estimatedValue)

  const nextAction = str(formData, 'next_action')
  if (nextAction) payload.next_action = nextAction

  const nextActionAt = str(formData, 'next_action_at')
  if (nextActionAt) payload.next_action_at = nextActionAt

  const lostReason = str(formData, 'lost_reason')
  if (lostReason) payload.lost_reason = lostReason

  if (pipelineStage === 'won') payload.status = 'won'
  if (pipelineStage === 'lost') payload.status = 'lost'

  const { error } = await supabase.from('b2b_leads').update(payload).eq('id', leadId)

  if (error) {
    console.error('Error updating lead pipeline:', error)
    return
  }

  await supabase.from('crm_activities').insert({
    lead_id: leadId,
    activity_type: 'status_change',
    title: `Pipeline: ${pipelineStage}`,
    description: `Estágio atualizado para ${pipelineStage}. ${nextAction ? `Próxima ação: ${nextAction}` : ''}`,
    created_by: userId,
    completed_at: new Date().toISOString(),
  })

  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/closer')
}

// ── Activities ────────────────────────────────────────

export async function addActivity(formData: FormData) {
  const { supabase, userId } = await verifyAdmin()

  const leadId = str(formData, 'lead_id') || null
  const prospectId = str(formData, 'prospect_id') || null
  const activityType = str(formData, 'activity_type') as ActivityType
  const title = str(formData, 'title')

  if ((!leadId && !prospectId) || !title || !ACTIVITY_TYPES.includes(activityType)) return

  const { error } = await supabase.from('crm_activities').insert({
    lead_id: leadId,
    prospect_id: prospectId,
    activity_type: activityType,
    title,
    description: str(formData, 'description') || null,
    outcome: str(formData, 'outcome') || null,
    scheduled_at: str(formData, 'scheduled_at') || null,
    created_by: userId,
    completed_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error adding activity:', error)
    return
  }

  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/sdr')
  revalidatePath('/admin/crm/closer')
}

// ── Data Fetchers ─────────────────────────────────────

export async function getCrmDashboardData() {
  const { supabase } = await verifyAdmin()

  const [
    { data: leads },
    { data: prospects },
    { data: scores },
    { data: activities },
    { data: proposals },
  ] = await Promise.all([
    supabase.from('b2b_leads').select('*').order('created_at', { ascending: false }),
    supabase.from('crm_prospects').select('*').order('created_at', { ascending: false }),
    supabase.from('crm_lead_scores').select('*'),
    supabase.from('crm_activities').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('proposals').select('*'),
  ])

  return {
    leads: (leads ?? []) as EnhancedLead[],
    prospects: (prospects ?? []) as CrmProspect[],
    scores: (scores ?? []) as CrmLeadScore[],
    activities: (activities ?? []) as CrmActivity[],
    proposals: (proposals ?? []) as Array<{ id: string; lead_id: string; status: string; estimated_value: number | null }>,
  }
}

export async function getProspects(filters?: { jobFunction?: string; outreachStatus?: string }) {
  const { supabase } = await verifyAdmin()

  let query = supabase.from('crm_prospects').select('*').order('created_at', { ascending: false })

  if (filters?.jobFunction && JOB_FUNCTIONS.includes(filters.jobFunction as JobFunction)) {
    query = query.eq('job_function', filters.jobFunction)
  }

  if (filters?.outreachStatus && OUTREACH_STATUSES.includes(filters.outreachStatus as OutreachStatus)) {
    query = query.eq('outreach_status', filters.outreachStatus)
  }

  const { data } = await query

  return (data ?? []) as CrmProspect[]
}

export async function getLeadsForCloser() {
  const { supabase } = await verifyAdmin()

  const { data: leads } = await supabase
    .from('b2b_leads')
    .select('*')
    .not('status', 'eq', 'lost')
    .order('created_at', { ascending: false })

  const leadIds = (leads ?? []).map((l: { id: string }) => l.id)

  let scores: CrmLeadScore[] = []
  if (leadIds.length > 0) {
    const { data: scoresData } = await supabase
      .from('crm_lead_scores')
      .select('*')
      .in('lead_id', leadIds)

    scores = (scoresData ?? []) as CrmLeadScore[]
  }

  let activities: CrmActivity[] = []
  if (leadIds.length > 0) {
    const { data: activitiesData } = await supabase
      .from('crm_activities')
      .select('*')
      .in('lead_id', leadIds)
      .order('created_at', { ascending: false })
      .limit(50)

    activities = (activitiesData ?? []) as CrmActivity[]
  }

  return {
    leads: (leads ?? []) as EnhancedLead[],
    scores,
    activities,
  }
}
