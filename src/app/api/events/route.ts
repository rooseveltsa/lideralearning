import { NextResponse } from 'next/server'

import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`events:${getRateLimitKey(request)}`, { maxRequests: 10, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const startDate = typeof body.start_date === 'string' ? body.start_date : ''

  if (!title || !startDate) {
    return NextResponse.json({ error: 'Title and start_date are required.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('events')
    .insert({
      title,
      description: body.description || null,
      event_type: body.event_type || 'workshop',
      location: body.location || null,
      city: body.city || null,
      state: body.state || 'GO',
      start_date: startDate,
      end_date: body.end_date || null,
      max_capacity: typeof body.max_capacity === 'number' ? body.max_capacity : 10,
      price: typeof body.price === 'number' ? body.price : null,
      mentor_name: body.mentor_name || 'Claudemir Domingos',
      status: body.status || 'draft',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, eventId: data.id })
}
