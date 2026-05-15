import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { resend, isEmailEnabled, EMAIL_FROM, EMAIL_REPLY_TO } from '@/lib/email/resend'
import { logger, maskEmail } from '@/lib/logger/structured'

type Payload = {
  tipo?: 'pessoal' | 'empresa'
  to?: string
  subject?: string
  body?: string
}

function normalize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const linkified = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#1565C0;text-decoration:underline;">$1</a>',
  )
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;font-size:14px;line-height:1.65;color:#0F172A;white-space:pre-wrap;">${linkified}</div>`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Auth: somente admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }

  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const tipo = payload.tipo
  const to = normalize(payload.to)
  const subject = normalize(payload.subject)
  const body = typeof payload.body === 'string' ? payload.body : ''

  if (tipo !== 'pessoal' && tipo !== 'empresa') {
    return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }
  if (!subject) return NextResponse.json({ error: 'Assunto obrigatório.' }, { status: 400 })
  if (!body.trim()) return NextResponse.json({ error: 'Mensagem obrigatória.' }, { status: 400 })

  if (!isEmailEnabled || !resend) {
    return NextResponse.json(
      { error: 'Email não configurado no servidor (RESEND_API_KEY ausente).' },
      { status: 503 },
    )
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      replyTo: EMAIL_REPLY_TO,
      subject,
      text: body,
      html: textToHtml(body),
    })

    if (result.error) {
      logger.error('admin_send_pdi_email_failed', {
        diagnosticoId: id,
        tipo,
        to: maskEmail(to),
        error: result.error.message,
      })
      return NextResponse.json({ error: result.error.message }, { status: 502 })
    }

    // Atualiza pdi_enviado_em
    const admin = createAdminClient()
    const table = tipo === 'pessoal' ? 'personal_diagnostics' : 'b2b_diagnostics'
    await admin
      .from(table)
      .update({ pdi_enviado_em: new Date().toISOString() })
      .eq('id', id)

    logger.info('admin_send_pdi_email_ok', {
      diagnosticoId: id,
      tipo,
      to: maskEmail(to),
      sentBy: user.id,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    logger.error('admin_send_pdi_email_exception', {
      diagnosticoId: id,
      tipo,
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao enviar email.' },
      { status: 500 },
    )
  }
}
