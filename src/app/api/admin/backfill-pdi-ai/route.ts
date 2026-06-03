import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { generatePDI } from '@/lib/utils/pdi-generator'
import { generateAiTrackPatches } from '@/lib/diagnostico/pdi-ai-enricher'

/**
 * POST /api/admin/backfill-pdi-ai
 *
 * Gera o plano de ação por IA (action_plan_ai) para PDIs JÁ prontos
 * (participantes com autoavaliação + avaliação executiva). Útil porque a
 * geração automática só dispara em novas avaliações executivas.
 *
 * Body opcional: { "userId": "<uuid>" } para processar um único participante
 * (recomendado para validar antes de rodar em todos).
 *
 * Protegido por role=admin (rode logado no painel, ex. via console do navegador:
 *   fetch('/api/admin/backfill-pdi-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(r=>r.json()).then(console.log)
 * )
 */
export async function POST(request: Request) {
  // Auth: somente admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!me || me.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }

  let targetUserId: string | null = null
  try {
    const body = (await request.json()) as { userId?: string }
    if (body && typeof body.userId === 'string' && body.userId.trim()) {
      targetUserId = body.userId.trim()
    }
  } catch {
    // sem body → processa todos
  }

  const admin = createAdminClient()

  // Descobre participantes com PDI pronto (self + exec)
  const { data: selfs } = await admin.from('leadership_self_assessments').select('user_id')
  const { data: execs } = await admin.from('leadership_executive_assessments').select('user_id')
  const selfSet = new Set((selfs ?? []).map((s) => s.user_id))
  const execSet = new Set((execs ?? []).map((e) => e.user_id))

  let readyIds = [...selfSet].filter((id) => execSet.has(id))
  if (targetUserId) readyIds = readyIds.filter((id) => id === targetUserId)

  let processed = 0
  let enriched = 0
  let skippedNoPatches = 0
  let skippedNoPdiRow = 0
  const errors: string[] = []

  for (const userId of readyIds) {
    processed++
    try {
      const { data: selfRows } = await admin
        .from('leadership_self_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      const { data: execRows } = await admin
        .from('leadership_executive_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!selfRows?.length || !execRows?.length) continue

      const { data: prof } = await admin
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle()

      const { data: rel } = await admin
        .from('gestor_aluno_relationships')
        .select('company_name')
        .eq('aluno_user_id', userId)
        .limit(1)
        .maybeSingle()

      const report = generatePDI(
        userId,
        prof?.full_name ?? 'Participante',
        rel?.company_name ?? null,
        selfRows[0] as Record<string, unknown>,
        execRows[0] as Record<string, unknown>,
      )

      const patches = await generateAiTrackPatches(report)
      if (!patches) {
        skippedNoPatches++
        continue
      }

      const { data: updated, error: updErr } = await admin
        .from('leadership_pdi')
        .update({ action_plan_ai: patches })
        .eq('user_id', userId)
        .select('user_id')

      if (updErr) {
        errors.push(`User ${userId}: ${updErr.message}`)
      } else if (!updated || updated.length === 0) {
        skippedNoPdiRow++
      } else {
        enriched++
      }
    } catch (e) {
      errors.push(`User ${userId}: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  return NextResponse.json({
    success: true,
    targetUserId,
    readyCount: readyIds.length,
    processed,
    enriched,
    skippedNoPatches,
    skippedNoPdiRow,
    errors,
  })
}
