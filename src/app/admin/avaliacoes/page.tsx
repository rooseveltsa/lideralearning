import { ClipboardList } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import AvaliacoesClient from './AvaliacoesClient'
import type { SelfAssessment, ExecAssessment, PdiRow } from './types'

export const metadata = {
  title: 'Avaliacoes | Lidera Admin',
}

// ---------------------------------------------------------------------------
// Types matching real DB columns
// ---------------------------------------------------------------------------

type DbSelfAssessment = {
  id: string
  user_id: string
  q_percepcao: number | null
  q_gestao: number | null
  q_comunicacao: number | null
  q_tecnologia: number | null
  q_etica: number | null
  q_dor: number | null
  pontuacao_total: number
  perfil: string
  texto_dor_atual: string | null
  texto_custo_futuro: string | null
  created_at: string
}

type DbExecAssessment = {
  id: string
  user_id: string
  supervisor_user_id: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  nome_empresa: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  dim_comunicacao: number | null
  dim_tomada_decisao: number | null
  dim_gestao_equipe: number | null
  dim_orientacao_resultados: number | null
  dim_adaptabilidade: number | null
  dim_lideranca_estrategica: number | null
  dim_desenvolvimento_pessoas: number | null
  dim_inovacao: number | null
  dim_etica_integridade: number | null
  dim_gestao_crise: number | null
  ponto_forte: string | null
  area_melhoria: string | null
  impacto_equipe: string | null
  recomendacao: string | null
  comentario_adicional: string | null
  recomendacao_geral: string | null
  nivel_confianca: number | null
  created_at: string
}

type DbPdi = {
  id: string
  user_id: string
  cargo: string | null
  dim_facilitador: number | null
  dim_orientador: number | null
  dim_garantidor: number | null
  dim_estrategista: number | null
  dim_mentor: number | null
  hs_execucao: number | null
  hs_processos: number | null
  hs_ferramentas: number | null
  hs_padroes: number | null
  ss_inteligencia_emocional: number | null
  ss_feedback: number | null
  ss_conflitos_geracionais: number | null
  ss_visao_futuro: number | null
  fase_atual: number | null
  compromisso_comportamento: string | null
  compromisso_dados: string | null
  compromisso_sucessao: string | null
  competencias_40: unknown
  texto_triade: string | null
  media_dimensoes: number | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function fetchAvaliacoesData() {
  const admin = createAdminClient()

  try {
    const [selfRes, execRes, pdiRes] = await Promise.all([
      admin
        .from('leadership_self_assessments')
        .select(
          'id, user_id, q_percepcao, q_gestao, q_comunicacao, q_tecnologia, q_etica, q_dor, pontuacao_total, perfil, texto_dor_atual, texto_custo_futuro, created_at'
        )
        .order('created_at', { ascending: false }),
      admin
        .from('leadership_executive_assessments')
        .select(
          'id, user_id, supervisor_user_id, nome_supervisor, cargo_supervisor, nome_avaliador, nome_empresa, media_dimensoes, pdi_type, dim_comunicacao, dim_tomada_decisao, dim_gestao_equipe, dim_orientacao_resultados, dim_adaptabilidade, dim_lideranca_estrategica, dim_desenvolvimento_pessoas, dim_inovacao, dim_etica_integridade, dim_gestao_crise, ponto_forte, area_melhoria, impacto_equipe, recomendacao, comentario_adicional, recomendacao_geral, nivel_confianca, created_at'
        )
        .order('created_at', { ascending: false }),
      admin
        .from('leadership_pdi')
        .select('*')
        .order('created_at', { ascending: false }),
    ])

    // Map self-assessments: perfil → perfil_lideranca
    const selfAssessments: SelfAssessment[] = ((selfRes.data ?? []) as DbSelfAssessment[]).map(
      (s) => ({
        id: s.id,
        user_id: s.user_id,
        perfil_lideranca: s.perfil,
        pontuacao_total: s.pontuacao_total,
        q_percepcao: s.q_percepcao,
        q_gestao: s.q_gestao,
        q_comunicacao: s.q_comunicacao,
        q_tecnologia: s.q_tecnologia,
        q_etica: s.q_etica,
        q_dor: s.q_dor,
        texto_dor_atual: s.texto_dor_atual,
        texto_custo_futuro: s.texto_custo_futuro,
        created_at: s.created_at,
      })
    )

    // Exec assessments pass through with all dimension columns
    const execAssessments: ExecAssessment[] = ((execRes.data ?? []) as DbExecAssessment[]).map(
      (e) => ({
        id: e.id,
        user_id: e.user_id,
        supervisor_user_id: e.supervisor_user_id,
        nome_supervisor: e.nome_supervisor,
        cargo_supervisor: e.cargo_supervisor,
        nome_avaliador: e.nome_avaliador,
        nome_empresa: e.nome_empresa,
        media_dimensoes: e.media_dimensoes,
        pdi_type: e.pdi_type,
        dim_comunicacao: e.dim_comunicacao,
        dim_tomada_decisao: e.dim_tomada_decisao,
        dim_gestao_equipe: e.dim_gestao_equipe,
        dim_orientacao_resultados: e.dim_orientacao_resultados,
        dim_adaptabilidade: e.dim_adaptabilidade,
        dim_lideranca_estrategica: e.dim_lideranca_estrategica,
        dim_desenvolvimento_pessoas: e.dim_desenvolvimento_pessoas,
        dim_inovacao: e.dim_inovacao,
        dim_etica_integridade: e.dim_etica_integridade,
        dim_gestao_crise: e.dim_gestao_crise,
        ponto_forte: e.ponto_forte,
        area_melhoria: e.area_melhoria,
        impacto_equipe: e.impacto_equipe,
        recomendacao: e.recomendacao,
        comentario_adicional: e.comentario_adicional,
        recomendacao_geral: e.recomendacao_geral,
        nivel_confianca: e.nivel_confianca,
        created_at: e.created_at,
      })
    )

    // PDIs: user_id (not aluno_user_id)
    const pdis: PdiRow[] = ((pdiRes.data ?? []) as DbPdi[]).map((p) => ({
      id: p.id,
      user_id: p.user_id,
      cargo: p.cargo,
      dim_facilitador: p.dim_facilitador,
      dim_orientador: p.dim_orientador,
      dim_garantidor: p.dim_garantidor,
      dim_estrategista: p.dim_estrategista,
      dim_mentor: p.dim_mentor,
      hs_execucao: p.hs_execucao,
      hs_processos: p.hs_processos,
      hs_ferramentas: p.hs_ferramentas,
      hs_padroes: p.hs_padroes,
      ss_inteligencia_emocional: p.ss_inteligencia_emocional,
      ss_feedback: p.ss_feedback,
      ss_conflitos_geracionais: p.ss_conflitos_geracionais,
      ss_visao_futuro: p.ss_visao_futuro,
      fase_atual: p.fase_atual,
      compromisso_comportamento: p.compromisso_comportamento,
      compromisso_dados: p.compromisso_dados,
      compromisso_sucessao: p.compromisso_sucessao,
      competencias_40: p.competencias_40,
      texto_triade: p.texto_triade,
      media_dimensoes: p.media_dimensoes,
      created_at: p.created_at,
    }))

    // Collect all user IDs to resolve names
    const userIds = new Set<string>()
    for (const s of selfAssessments) userIds.add(s.user_id)
    for (const e of execAssessments) {
      userIds.add(e.user_id)
      if (e.supervisor_user_id) userIds.add(e.supervisor_user_id)
    }
    for (const p of pdis) userIds.add(p.user_id)

    // Fetch profiles for all user IDs
    const profileMap: Record<string, string> = {}
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
    const authUsers: { id: string; email: string }[] = (authData?.users ?? []).map((u) => ({
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
      profileMap: {} as Record<string, string>,
      authUsers: [] as { id: string; email: string }[],
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
