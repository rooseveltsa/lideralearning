// Meta Conversions API — server-side event tracking
// Complementa o Pixel client-side para resiliência a iOS 14+/ad blockers.
//
// Setup: NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_TOKEN nas envs.
// O token é gerado no Events Manager > Configurações > Conversions API.

import { createHash } from 'crypto'
import { logger } from '@/lib/logger/structured'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE // opcional, p/ debug

const API_VERSION = 'v21.0'

export type MetaEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'Schedule'

export type MetaUserData = {
  email?: string | null
  phone?: string | null // E.164 sem '+', ex: 5564996099020
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null // sigla minúscula 'sp'
  country?: string | null // 'br'
  externalId?: string | null // user_id interno, prospect_id, etc
  clientUserAgent?: string | null
  clientIpAddress?: string | null
  fbc?: string | null // _fbc cookie
  fbp?: string | null // _fbp cookie
}

export type MetaCustomData = {
  value?: number
  currency?: string
  contentName?: string
  contentCategory?: string
  contentIds?: string[]
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  utmTerm?: string | null
}

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function hashIfPresent(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return undefined
  return sha256(trimmed)
}

function onlyDigits(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const digits = value.replace(/\D/g, '')
  return digits || undefined
}

function normalizeBrazilianPhone(value: string | null | undefined): string | undefined {
  const digits = onlyDigits(value)
  if (!digits) return undefined
  if (digits.startsWith('55')) return digits
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`
  return digits
}

export const isCapiEnabled = !!(META_PIXEL_ID && META_CAPI_TOKEN)

type SendArgs = {
  eventName: MetaEventName
  eventId?: string // deduplica com o evento client-side (mesmo id no fbq + capi)
  eventSourceUrl?: string | null
  actionSource?: 'website' | 'system_generated' | 'physical_store'
  userData?: MetaUserData
  customData?: MetaCustomData
}

export async function sendMetaEvent({
  eventName,
  eventId,
  eventSourceUrl,
  actionSource = 'website',
  userData = {},
  customData = {},
}: SendArgs): Promise<{ success: boolean; error?: string }> {
  if (!isCapiEnabled) {
    return { success: false, error: 'capi_disabled' }
  }

  const phone = normalizeBrazilianPhone(userData.phone)

  const hashedUserData: Record<string, string | string[] | undefined> = {
    em: hashIfPresent(userData.email),
    ph: phone ? sha256(phone) : undefined,
    fn: hashIfPresent(userData.firstName),
    ln: hashIfPresent(userData.lastName),
    ct: hashIfPresent(userData.city),
    st: hashIfPresent(userData.state),
    country: hashIfPresent(userData.country) ?? sha256('br'),
    external_id: userData.externalId ? sha256(userData.externalId) : undefined,
    // Não hashear: ip + user agent + fbc + fbp
    client_ip_address: userData.clientIpAddress ?? undefined,
    client_user_agent: userData.clientUserAgent ?? undefined,
    fbc: userData.fbc ?? undefined,
    fbp: userData.fbp ?? undefined,
  }

  // Remove undefined
  const cleanedUserData = Object.fromEntries(
    Object.entries(hashedUserData).filter(([, v]) => v !== undefined),
  )

  const customDataPayload: Record<string, unknown> = {}
  if (customData.value !== undefined) customDataPayload.value = customData.value
  if (customData.currency) customDataPayload.currency = customData.currency
  if (customData.contentName) customDataPayload.content_name = customData.contentName
  if (customData.contentCategory) customDataPayload.content_category = customData.contentCategory
  if (customData.contentIds?.length) customDataPayload.content_ids = customData.contentIds
  // UTMs como custom params (ficam disponíveis em colunas customizadas)
  if (customData.utmSource) customDataPayload.utm_source = customData.utmSource
  if (customData.utmMedium) customDataPayload.utm_medium = customData.utmMedium
  if (customData.utmCampaign) customDataPayload.utm_campaign = customData.utmCampaign
  if (customData.utmContent) customDataPayload.utm_content = customData.utmContent
  if (customData.utmTerm) customDataPayload.utm_term = customData.utmTerm

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: actionSource,
    user_data: cleanedUserData,
  }
  if (eventId) event.event_id = eventId
  if (eventSourceUrl) event.event_source_url = eventSourceUrl
  if (Object.keys(customDataPayload).length > 0) event.custom_data = customDataPayload

  const body: Record<string, unknown> = {
    data: [event],
    access_token: META_CAPI_TOKEN,
  }
  if (META_TEST_EVENT_CODE) body.test_event_code = META_TEST_EVENT_CODE

  const url = `https://graph.facebook.com/${API_VERSION}/${META_PIXEL_ID}/events`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const errText = await res.text().catch(() => 'unknown')
      logger.warn('meta_capi_send_failed', {
        eventName,
        status: res.status,
        error: errText.slice(0, 200),
      })
      return { success: false, error: `http_${res.status}` }
    }

    logger.info('meta_capi_sent', { eventName, eventId })
    return { success: true }
  } catch (e) {
    logger.warn('meta_capi_send_exception', {
      eventName,
      error: e instanceof Error ? e.message : 'unknown',
    })
    return { success: false, error: e instanceof Error ? e.message : 'unknown' }
  }
}
