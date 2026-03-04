'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'] as const

type LeadStatus = (typeof LEAD_STATUSES)[number]

async function verifyAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return { supabase, userId: user.id }
}

function normalizeStatus(value: FormDataEntryValue | null): LeadStatus | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim() as LeadStatus
  if (!LEAD_STATUSES.includes(normalized)) return null
  return normalized
}

export async function updateLeadStatus(formData: FormData): Promise<void> {
  const { supabase } = await verifyAdmin()

  const leadId = typeof formData.get('lead_id') === 'string' ? (formData.get('lead_id') as string).trim() : ''
  const nextStatus = normalizeStatus(formData.get('status'))

  if (!leadId || !nextStatus) {
    return
  }

  const payload: { status: LeadStatus; last_contact_at?: string } = {
    status: nextStatus,
  }

  if (nextStatus !== 'new') {
    payload.last_contact_at = new Date().toISOString()
  }

  const { error } = await supabase.from('b2b_leads').update(payload).eq('id', leadId)

  if (error) {
    return
  }

  revalidatePath('/admin/leads')
}

export async function createDraftProposal(formData: FormData): Promise<void> {
  const { supabase, userId } = await verifyAdmin()

  const leadId = typeof formData.get('lead_id') === 'string' ? (formData.get('lead_id') as string).trim() : ''
  const companyName = typeof formData.get('company_name') === 'string' ? (formData.get('company_name') as string).trim() : ''

  if (!leadId) {
    return
  }

  const title = companyName ? `Proposta comercial - ${companyName}` : 'Proposta comercial'

  const { error: proposalError } = await supabase.from('proposals').insert({
    lead_id: leadId,
    title,
    status: 'draft',
    created_by: userId,
  })

  if (proposalError) {
    return
  }

  const { error: leadError } = await supabase
    .from('b2b_leads')
    .update({ status: 'proposal_sent', last_contact_at: new Date().toISOString() })
    .eq('id', leadId)

  if (leadError) {
    return
  }

  revalidatePath('/admin/leads')
}
