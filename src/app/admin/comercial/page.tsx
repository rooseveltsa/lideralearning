import { createAdminClient } from '@/lib/supabase/service'

import ComercialClient from './ComercialClient'

import type { EnhancedLead, CrmProspect, CrmLeadScore, CrmActivity } from '@/lib/actions/crm'

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

  return (
    <ComercialClient
      leads={leads}
      prospects={prospects}
      scores={scores}
      activities={activities}
    />
  )
}
