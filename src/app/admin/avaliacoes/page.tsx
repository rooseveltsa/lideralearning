import { ClipboardList } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import AvaliacoesClient from './AvaliacoesClient'

export const metadata = {
  title: 'Avaliacoes | Lidera Admin',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SelfAssessment = {
  id: string
  user_id: string
  perfil_lideranca: string | null
  media_dimensoes: number | null
  created_at: string
}

type ExecAssessment = {
  id: string
  user_id: string
  supervisor_user_id: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  nome_empresa: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  created_at: string
  respostas: Record<string, unknown> | null
}

type PdiRow = {
  id: string
  aluno_user_id: string
  plano: Record<string, unknown> | null
  alignment_score: number | null
  created_at: string
}

type ProfileMap = Record<string, string>

type AuthUser = {
  id: string
  email: string
}

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function fetchAvaliacoesData() {
  const admin = createAdminClient()

  try {
    // Fetch all three assessment tables in parallel
    const [selfRes, execRes, pdiRes] = await Promise.all([
      admin
        .from('leadership_self_assessments')
        .select('id, user_id, perfil_lideranca, media_dimensoes, created_at')
        .order('created_at', { ascending: false }),
      admin
        .from('leadership_executive_assessments')
        .select(
          'id, user_id, supervisor_user_id, nome_supervisor, cargo_supervisor, nome_avaliador, nome_empresa, media_dimensoes, pdi_type, created_at, respostas'
        )
        .order('created_at', { ascending: false }),
      admin
        .from('leadership_pdi')
        .select('id, aluno_user_id, plano, alignment_score, created_at')
        .order('created_at', { ascending: false }),
    ])

    const selfAssessments = (selfRes.data ?? []) as SelfAssessment[]
    const execAssessments = (execRes.data ?? []) as ExecAssessment[]
    const pdis = (pdiRes.data ?? []) as PdiRow[]

    // Collect all user IDs to resolve names
    const userIds = new Set<string>()
    for (const s of selfAssessments) userIds.add(s.user_id)
    for (const e of execAssessments) {
      userIds.add(e.user_id)
      if (e.supervisor_user_id) userIds.add(e.supervisor_user_id)
    }
    for (const p of pdis) userIds.add(p.aluno_user_id)

    // Fetch profiles for all user IDs
    const profileMap: ProfileMap = {}
    if (userIds.size > 0) {
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(userIds))

      if (profiles) {
        for (const p of profiles) {
          profileMap[p.id] = p.full_name ?? 'Sem nome'
        }
      }
    }

    // Fetch auth users for email fallback
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const authUsers: AuthUser[] = (authData?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? '',
    }))

    // Fill missing names from auth emails
    for (const u of authUsers) {
      if (!profileMap[u.id] && userIds.has(u.id)) {
        profileMap[u.id] = u.email || 'Sem nome'
      }
    }

    return { selfAssessments, execAssessments, pdis, profileMap, authUsers }
  } catch (error) {
    console.error('Error fetching avaliacoes data:', error)
    return {
      selfAssessments: [] as SelfAssessment[],
      execAssessments: [] as ExecAssessment[],
      pdis: [] as PdiRow[],
      profileMap: {} as ProfileMap,
      authUsers: [] as AuthUser[],
    }
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AvaliacoesPage() {
  const { selfAssessments, execAssessments, pdis, profileMap, authUsers } =
    await fetchAvaliacoesData()

  const totalRespostas = selfAssessments.length + execAssessments.length
  const totalPdis = pdis.length
  const pendingLinks = execAssessments.filter((e) => !e.supervisor_user_id).length

  return (
    <div className="space-y-0">
      {/* Compact Header */}
      <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1565C0]/10">
            <ClipboardList className="h-5 w-5 text-[#1565C0]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold leading-tight text-[#0F172A]">
              Avaliacoes
            </h1>
            <p className="text-xs text-[#64748B]">
              Respostas, links e planos de desenvolvimento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
            {totalRespostas} respostas
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B1FA2]" />
            {totalPdis} PDIs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700">
            {pendingLinks} pendentes
          </span>
        </div>
      </div>

      <AvaliacoesClient
        selfAssessments={selfAssessments}
        execAssessments={execAssessments}
        pdis={pdis}
        profileMap={profileMap}
        authUsers={authUsers}
      />
    </div>
  )
}
