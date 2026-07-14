import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { requireAdmin } from '@/lib/auth/require-admin'

/**
 * POST /api/admin/generate-missing-pdis
 *
 * One-time (or repeatable) endpoint to generate PDI records for all
 * self-assessments that don't have a corresponding PDI yet.
 */
export async function POST() {
  // Estava exposta: aceitava POST de qualquer origem, sem sessão nem role.
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const admin = createAdminClient()

  // Fetch all self-assessments
  const { data: selfAssessments, error: saErr } = await admin
    .from('leadership_self_assessments')
    .select('id, user_id, q_percepcao, q_gestao, q_comunicacao, q_tecnologia, q_etica, q_dor, pontuacao_total, perfil')
    .order('created_at', { ascending: false })

  if (saErr) {
    return NextResponse.json({ error: saErr.message }, { status: 500 })
  }

  // Fetch all existing PDIs
  const { data: existingPdis } = await admin
    .from('leadership_pdi')
    .select('user_id')

  const pdiUserIds = new Set((existingPdis ?? []).map((p) => p.user_id))

  // Deduplicate: keep only the latest assessment per user
  const latestByUser = new Map<string, (typeof selfAssessments)[0]>()
  for (const sa of selfAssessments ?? []) {
    if (!latestByUser.has(sa.user_id)) {
      latestByUser.set(sa.user_id, sa)
    }
  }

  const mapScore = (v: number | null) => Math.max(1, Math.min(5, Math.round(((v ?? 0) / 3) * 5)))
  const mapAvg = (a: number | null, b: number | null) =>
    Math.max(1, Math.min(5, Math.round((((a ?? 0) + (b ?? 0)) / 6) * 5)))

  function getPerfilPhase(perfil: string | null): number {
    if (perfil === 'reativo') return 1
    if (perfil === 'transicao') return 2
    return 3
  }

  let generated = 0
  const errors: string[] = []

  for (const [userId, sa] of latestByUser) {
    if (pdiUserIds.has(userId)) continue // Already has PDI

    const pdiData = {
      user_id: userId,
      cargo: '',
      tempo_funcao: '',
      departamento: '',
      dim_facilitador: mapScore(sa.q_gestao),
      dim_orientador: mapScore(sa.q_comunicacao),
      dim_garantidor: mapScore(sa.q_etica),
      dim_estrategista: mapScore(sa.q_percepcao),
      dim_mentor: mapAvg(sa.q_gestao, sa.q_comunicacao),
      hs_execucao: mapScore(sa.q_percepcao),
      hs_processos: mapScore(sa.q_gestao),
      hs_ferramentas: mapScore(sa.q_tecnologia),
      hs_padroes: mapScore(sa.q_etica),
      ss_inteligencia_emocional: mapScore(sa.q_comunicacao),
      ss_feedback: mapScore(sa.q_comunicacao),
      ss_conflitos_geracionais: mapScore(sa.q_gestao),
      ss_visao_futuro: mapScore(sa.q_percepcao),
      fase_atual: getPerfilPhase(sa.perfil),
      media_dimensoes: parseFloat((((sa.pontuacao_total ?? 0) / 18) * 5).toFixed(1)),
    }

    const { error: insertErr } = await admin.from('leadership_pdi').insert(pdiData)

    if (insertErr) {
      errors.push(`User ${userId}: ${insertErr.message}`)
    } else {
      generated++
    }
  }

  return NextResponse.json({
    success: true,
    totalAssessments: latestByUser.size,
    alreadyHadPdi: pdiUserIds.size,
    generated,
    errors,
  })
}
