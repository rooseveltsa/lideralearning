import { NextResponse } from 'next/server'

import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`checkin:${getRateLimitKey(request)}`, { maxRequests: 30, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
  }

  let body: { ticketCode: string; checkedInBy?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const code = body.ticketCode?.trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Ticket code is required.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: ticket, error } = await admin
    .from('event_tickets')
    .select('id, status, attendee_name, event_id, checked_in_at, events(title, start_date)')
    .eq('ticket_code', code)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket não encontrado.' }, { status: 404 })
  }

  if (ticket.status === 'checked_in') {
    return NextResponse.json({
      error: 'Ticket já foi utilizado.',
      checkedInAt: ticket.checked_in_at,
      attendeeName: ticket.attendee_name,
    }, { status: 409 })
  }

  if (ticket.status === 'canceled') {
    return NextResponse.json({ error: 'Ticket cancelado.' }, { status: 400 })
  }

  const { error: updateError } = await admin
    .from('event_tickets')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
      checked_in_by: body.checkedInBy || null,
    })
    .eq('id', ticket.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const event = ticket.events as unknown as { title: string; start_date: string } | null

  return NextResponse.json({
    success: true,
    attendeeName: ticket.attendee_name,
    eventTitle: event?.title || 'Evento',
    checkedInAt: new Date().toISOString(),
  })
}
