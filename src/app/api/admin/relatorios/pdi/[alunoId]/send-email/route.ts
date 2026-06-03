import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { generatePDI, getPDIStatus } from '@/lib/utils/pdi-generator'
import { sendPDIEmail } from '@/lib/email/send-pdi'
import { logger, maskEmail } from '@/lib/logger/structured'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ alunoId: string }> },
) {
  const { alunoId } = await params

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

  const admin = createAdminClient()

  // Perfil do participante
  const { data: profile } = await admin
    .from('profiles')
    .select('id, full_name')
    .eq('id', alunoId)
    .single()
  if (!profile) {
    return NextResponse.json({ error: 'Participante não encontrado.' }, { status: 404 })
  }

  // Email vem de auth.users (não existe coluna email em profiles)
  const { data: authData, error: authError } = await admin.auth.admin.getUserById(alunoId)
  const email = authData?.user?.email
  if (authError || !email) {
    return NextResponse.json(
      { error: 'Participante sem email cadastrado.' },
      { status: 422 },
    )
  }

  // Empresa vinculada (para o relatório)
  const { data: relationship } = await admin
    .from('gestor_aluno_relationships')
    .select('company_name')
    .eq('aluno_user_id', alunoId)
    .limit(1)
    .maybeSingle()

  // Avaliações mais recentes
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('*')
    .eq('user_id', alunoId)
    .order('created_at', { ascending: false })
    .limit(1)

  const { data: execAssessments } = await admin
    .from('leadership_executive_assessments')
    .select('*')
    .eq('user_id', alunoId)
    .order('created_at', { ascending: false })
    .limit(1)

  const hasSelf = (selfAssessments?.length ?? 0) > 0
  const hasExec = (execAssessments?.length ?? 0) > 0
  const status = getPDIStatus(alunoId, hasSelf, hasExec)

  if (status !== 'ready') {
    return NextResponse.json(
      { error: 'PDI ainda não disponível — faltam avaliações.' },
      { status: 422 },
    )
  }

  const report = generatePDI(
    alunoId,
    profile.full_name ?? 'Participante',
    relationship?.company_name ?? null,
    selfAssessments![0] as Record<string, unknown>,
    execAssessments![0] as Record<string, unknown>,
  )

  try {
    const result = await sendPDIEmail(email, report)
    if (!result.success) {
      logger.error('admin_send_training_pdi_email_failed', {
        alunoId,
        to: maskEmail(email),
        error: result.error,
      })
      return NextResponse.json(
        { error: result.error ?? 'Falha ao enviar email.' },
        { status: 502 },
      )
    }

    logger.info('admin_send_training_pdi_email_ok', {
      alunoId,
      to: maskEmail(email),
      sentBy: user.id,
    })

    return NextResponse.json({ success: true, to: email })
  } catch (e) {
    logger.error('admin_send_training_pdi_email_exception', {
      alunoId,
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao enviar email.' },
      { status: 500 },
    )
  }
}
