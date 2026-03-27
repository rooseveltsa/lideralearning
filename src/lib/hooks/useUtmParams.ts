'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export type UtmParams = {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  referrer: string | null
  landing_page: string | null
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const STORAGE_KEY = 'lidera_utm'

function getStoredUtm(): UtmParams | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : null
  } catch {
    return null
  }
}

function storeUtm(params: UtmParams) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params))
  } catch {
    // silent
  }
}

function buildUtmFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): UtmParams {
  const hasNewUtm = UTM_KEYS.some((key) => searchParams.get(key))

  if (hasNewUtm) {
    const params: UtmParams = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      landing_page: typeof window !== 'undefined' ? window.location.pathname : null,
    }
    storeUtm(params)
    return params
  }

  const existing = getStoredUtm()
  if (existing) return existing

  const params: UtmParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    landing_page: typeof window !== 'undefined' ? window.location.pathname : null,
  }
  storeUtm(params)
  return params
}

export function useUtmParams(): UtmParams {
  const searchParams = useSearchParams()

  return useMemo(
    () => buildUtmFromSearchParams(searchParams),
    [searchParams]
  )
}
