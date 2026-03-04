import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

type LeadPayload = {
  fullName: string
  companyName: string
  managersRange: string
  whatsapp: string
  email?: string
  sourcePage?: string
}

function normalizeText(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function isValidEmail(value: string) {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validatePayload(payload: LeadPayload) {
  const fullName = normalizeText(payload.fullName)
  const companyName = normalizeText(payload.companyName)
  const managersRange = normalizeText(payload.managersRange)
  const whatsapp = normalizeText(payload.whatsapp)
  const email = normalizeText(payload.email)
  const sourcePage = normalizeText(payload.sourcePage) || 'homepage'

  if (!fullName || !companyName || !managersRange || !whatsapp) {
    return { ok: false, message: 'Campos obrigatórios não preenchidos.' as const }
  }

  if (fullName.length < 3) {
    return { ok: false, message: 'Nome inválido.' as const }
  }

  if (companyName.length < 2) {
    return { ok: false, message: 'Empresa inválida.' as const }
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: 'E-mail inválido.' as const }
  }

  return {
    ok: true,
    data: {
      full_name: fullName,
      company_name: companyName,
      managers_range: managersRange,
      whatsapp,
      email: email || null,
      source_page: sourcePage,
    },
  }
}

export async function POST(request: Request) {
  let json: LeadPayload

  try {
    json = (await request.json()) as LeadPayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const parsed = validatePayload(json)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('b2b_leads')
    .insert({
      ...parsed.data,
      status: 'new',
    })
    .select('id, created_at')
    .single()

  if (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: string }).code) : undefined
    if (code === '42P01') {
      return NextResponse.json({ error: 'Tabela b2b_leads não encontrada. Execute docs/database/04_b2b_pipeline.sql.' }, { status: 500 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    leadId: data.id,
    createdAt: data.created_at,
  })
}
