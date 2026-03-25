import { createAdminClient } from '@/lib/supabase/service'

import PessoasClient, { type PessoaRow } from './PessoasClient'

export default async function AdminPessoasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>
}) {
  const params = await searchParams
  const admin = createAdminClient()

  // ── Fetch all auth users ──
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const users = authUsers?.users ?? []

  // ── Fetch all profiles ──
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, role, whatsapp, company, created_at')

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p]),
  )

  // ── Self assessments ──
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('user_id, perfil, pontuacao_total, created_at')
    .order('created_at', { ascending: false })

  const selfMap = new Map<string, { perfil: string; score: number; date: string }>()
  for (const sa of selfAssessments ?? []) {
    if (!selfMap.has(sa.user_id)) {
      selfMap.set(sa.user_id, {
        perfil: sa.perfil,
        score: sa.pontuacao_total,
        date: sa.created_at,
      })
    }
  }

  // ── Executive assessments ──
  const { data: execAssessments } = await admin
    .from('leadership_executive_assessments')
    .select('user_id, supervisor_user_id, created_at')

  const execSet = new Set<string>()
  for (const ea of execAssessments ?? []) {
    execSet.add(ea.user_id)
    if (ea.supervisor_user_id) execSet.add(ea.supervisor_user_id)
  }

  // ── PDIs ──
  let pdiSet = new Set<string>()
  try {
    const { data: pdiData } = await admin.from('leadership_pdi').select('user_id')
    pdiSet = new Set((pdiData ?? []).map((p) => p.user_id))
  } catch {
    // Table may not exist
  }

  // ── CRM prospects ──
  const { data: prospects } = await admin
    .from('crm_prospects')
    .select('email, outreach_status')

  const prospectByEmail = new Map<string, string>()
  for (const p of prospects ?? []) {
    if (p.email) prospectByEmail.set(p.email.toLowerCase(), p.outreach_status)
  }

  // ── Gestor-aluno relationships ──
  const { data: relationships } = await admin
    .from('gestor_aluno_relationships')
    .select('gestor_user_id, aluno_user_id, company_name')

  const companyByUser = new Map<string, string>()
  const gestorAlunos = new Map<string, number>()
  for (const rel of relationships ?? []) {
    if (rel.company_name) companyByUser.set(rel.aluno_user_id, rel.company_name)
    gestorAlunos.set(rel.gestor_user_id, (gestorAlunos.get(rel.gestor_user_id) ?? 0) + 1)
  }

  // ── Presential training participants ──
  const { data: trainingParticipants } = await admin
    .from('presential_training_participants')
    .select('user_id')

  const trainingSet = new Set<string>()
  for (const tp of trainingParticipants ?? []) {
    if (tp.user_id) trainingSet.add(tp.user_id)
  }

  // ── Build rows ──
  const rows: PessoaRow[] = []

  for (const authUser of users) {
    const profile = profileMap.get(authUser.id)
    const email = authUser.email ?? ''
    const meta = authUser.user_metadata ?? {}

    let source: 'site' | 'presencial' | 'admin' = 'site'
    if (meta.created_by_admin) source = 'admin'
    else if (meta.source === 'presencial') source = 'presencial'

    const selfData = selfMap.get(authUser.id)

    rows.push({
      id: authUser.id,
      full_name: profile?.full_name ?? meta.full_name ?? null,
      email,
      whatsapp: profile?.whatsapp ?? meta.whatsapp ?? null,
      company: profile?.company ?? companyByUser.get(authUser.id) ?? meta.company ?? null,
      role: profile?.role ?? 'student',
      created_at: profile?.created_at ?? authUser.created_at ?? '',
      source,
      hasAutoavaliacao: selfMap.has(authUser.id),
      hasExec: execSet.has(authUser.id),
      hasPdi: pdiSet.has(authUser.id),
      hasTraining: trainingSet.has(authUser.id),
      prospectStatus: prospectByEmail.get(email.toLowerCase()) ?? null,
      selfPerfil: selfData?.perfil ?? null,
      selfScore: selfData?.score ?? null,
      alunosCount: gestorAlunos.get(authUser.id) ?? 0,
    })
  }

  // Sort by created_at descending
  rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <PessoasClient pessoas={rows} initialTab={params.tab} initialQuery={params.q} />
}
