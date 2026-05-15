import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { sendMetaEvent } from '@/lib/meta/capi'
import { logger, maskEmail } from '@/lib/logger/structured'

type Payload = {
  // Campos do form curto
  nome?: string
  email?: string
  whatsapp?: string
  empresa?: string
  cargo?: string
  // Funil
  origem?: 'lp_empresarial' | 'lp_pessoal'
  // Deduplicação com Pixel client
  eventId?: string
  // UTMs (preenchidos no client a partir da URL)
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  // Cookies Meta (lidos no client)
  fbc?: string
  fbp?: string
  // Referrer
  pageUrl?: string
}

function normalize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 0) return { first: '', last: '' }
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

export async function POST(request: Request) {
  let json: Payload
  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const nome = normalize(json.nome)
  const email = normalize(json.email)
  const whatsapp = normalize(json.whatsapp)
  const empresa = normalize(json.empresa)
  const cargo = normalize(json.cargo)
  const origem = json.origem === 'lp_pessoal' ? 'lp_pessoal' : 'lp_empresarial'

  if (!nome) return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })
  if (!whatsapp) return NextResponse.json({ error: 'WhatsApp obrigatório.' }, { status: 400 })
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const utmNotes = [
    json.utmSource && `source=${json.utmSource}`,
    json.utmMedium && `medium=${json.utmMedium}`,
    json.utmCampaign && `campaign=${json.utmCampaign}`,
    json.utmContent && `content=${json.utmContent}`,
    json.utmTerm && `term=${json.utmTerm}`,
  ]
    .filter(Boolean)
    .join(' · ')

  const notes = `Lead via ${origem}${utmNotes ? ` · ${utmNotes}` : ''}`

  // Upsert em crm_prospects pelo email (ou cria sem email)
  let prospectId: string | null = null
  try {
    if (email) {
      const { data: existing } = await admin
        .from('crm_prospects')
        .select('id, notes')
        .eq('email', email)
        .limit(1)
        .maybeSingle()

      if (existing) {
        await admin
          .from('crm_prospects')
          .update({
            full_name: nome,
            phone: whatsapp,
            company_name: empresa || undefined,
            job_title: cargo || undefined,
            outreach_status: 'cold_inbound',
            notes: existing.notes ? `${existing.notes}\n---\n${notes}` : notes,
            last_outreach_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
        prospectId = existing.id as string
      }
    }

    if (!prospectId) {
      const { data: inserted } = await admin
        .from('crm_prospects')
        .insert({
          full_name: nome,
          email: email || null,
          phone: whatsapp,
          company_name: empresa || 'Não informado',
          job_title: cargo || 'Não informado',
          job_function: origem === 'lp_empresarial' ? 'rh_td' : 'outro',
          outreach_status: 'cold_inbound',
          notes,
          last_outreach_at: new Date().toISOString(),
        })
        .select('id')
        .single()
      prospectId = (inserted?.id as string) ?? null
    }
  } catch (e) {
    logger.error('lp_lead_persist_failed', {
      origem,
      error: e instanceof Error ? e.message : 'unknown',
    })
  }

  // Dispara Conversions API (server-side, deduplica com fbq client via eventId)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null
  const userAgent = request.headers.get('user-agent') || null
  const { first, last } = splitName(nome)

  void sendMetaEvent({
    eventName: 'Lead',
    eventId: json.eventId,
    eventSourceUrl: json.pageUrl ?? null,
    actionSource: 'website',
    userData: {
      email,
      phone: whatsapp,
      firstName: first,
      lastName: last,
      country: 'br',
      externalId: prospectId,
      clientIpAddress: ip,
      clientUserAgent: userAgent,
      fbc: json.fbc ?? null,
      fbp: json.fbp ?? null,
    },
    customData: {
      currency: 'BRL',
      value: origem === 'lp_empresarial' ? 50 : 20, // valor estimado/lead para otimização
      contentName: origem === 'lp_empresarial' ? 'Diagnóstico Empresa' : 'Diagnóstico Pessoal',
      contentCategory: origem,
      utmSource: json.utmSource ?? null,
      utmMedium: json.utmMedium ?? null,
      utmCampaign: json.utmCampaign ?? null,
      utmContent: json.utmContent ?? null,
      utmTerm: json.utmTerm ?? null,
    },
  })

  logger.info('lp_lead_captured', {
    origem,
    prospectId,
    email: email ? maskEmail(email) : null,
    hasUtm: !!json.utmCampaign,
  })

  return NextResponse.json({ success: true, prospectId })
}
