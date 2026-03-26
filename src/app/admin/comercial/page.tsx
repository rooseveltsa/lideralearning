import { createAdminClient } from '@/lib/supabase/service'

import ComercialClient from './ComercialClient'

import type { EnhancedLead, CrmProspect, CrmLeadScore, CrmActivity } from '@/lib/actions/crm'

export type AssessmentStatusMap = Record<string, { hasAutoavaliacao: boolean; hasPdi: boolean }>

export default async function ComercialPage() {
  const admin = createAdminClient()

  let leads: EnhancedLead[] = []
  let prospects: CrmProspect[] = []
  let scores: CrmLeadScore[] = []
  let activities: CrmActivity[] = []

  try {
    const [leadsRes, prospectsRes, scoresRes, activitiesRes] = await Promise.all([
      admin.from('b2b_leads').select('*').order('created_at', { ascending: false }),
      admin.from('crm_prospects').select('*').order('created_at', { ascending: false }),
      admin.from('crm_lead_scores').select('*'),
      admin.from('crm_activities').select('*').order('created_at', { ascending: false }).limit(100),
    ])

    leads = (leadsRes.data ?? []) as EnhancedLead[]
    prospects = (prospectsRes.data ?? []) as CrmProspect[]
    scores = (scoresRes.data ?? []) as CrmLeadScore[]
    activities = (activitiesRes.data ?? []) as CrmActivity[]
  } catch (err) {
    console.error('Error fetching comercial data:', err)
  }

  // ── Cross-reference assessments and PDIs by email ──
  const assessmentStatusByEmail: AssessmentStatusMap = {}

  try {
    // Get all auth users with emails
    const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const emailToUserId = new Map<string, string>()
    for (const u of authUsers?.users ?? []) {
      if (u.email) emailToUserId.set(u.email.toLowerCase(), u.id)
    }

    // Get self-assessments user_ids
    const { data: saData } = await admin
      .from('leadership_self_assessments')
      .select('user_id')
    const saUserIds = new Set((saData ?? []).map((s) => s.user_id))

    // Get PDI user_ids
    const { data: pdiData } = await admin
      .from('leadership_pdi')
      .select('user_id')
    const pdiUserIds = new Set((pdiData ?? []).map((p) => p.user_id))

    // Map by email
    for (const [email, userId] of emailToUserId) {
      if (saUserIds.has(userId) || pdiUserIds.has(userId)) {
        assessmentStatusByEmail[email] = {
          hasAutoavaliacao: saUserIds.has(userId),
          hasPdi: pdiUserIds.has(userId),
        }
      }
    }
  } catch (err) {
    console.error('Error fetching assessment status for CRM:', err)
  }

  return (
    <ComercialClient
      leads={leads}
      prospects={prospects}
      scores={scores}
      activities={activities}
      assessmentStatus={assessmentStatusByEmail}
    />
  )
}
