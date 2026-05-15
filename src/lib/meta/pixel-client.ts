// Helpers client-side para Meta Pixel.
// Dispara o mesmo eventId no fbq + Conversions API → Meta deduplica.

type FbqWindow = typeof window & {
  fbq?: (...args: unknown[]) => void
}

export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function trackPixel(
  eventName: 'Lead' | 'CompleteRegistration' | 'ViewContent' | 'Contact' | 'Schedule',
  eventId: string,
  customData?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return
  const w = window as FbqWindow
  if (typeof w.fbq !== 'function') return
  try {
    w.fbq('track', eventName, customData || {}, { eventID: eventId })
  } catch {
    // silent
  }
}

// Lê cookies _fbc / _fbp para enriquecer o evento server-side
export function readMetaCookies(): { fbc: string | null; fbp: string | null } {
  if (typeof document === 'undefined') return { fbc: null, fbp: null }
  const match = (name: string) => {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
    return m ? decodeURIComponent(m[1]) : null
  }
  return { fbc: match('_fbc'), fbp: match('_fbp') }
}

export type UtmParams = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export function readUtms(): UtmParams {
  if (typeof window === 'undefined') return {}
  const url = new URL(window.location.href)
  const utms: UtmParams = {}
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
  for (const key of keys) {
    const v = url.searchParams.get(key)
    if (v) utms[key] = v
  }
  return utms
}
