/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    gtag?: (...args: any[]) => void
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }

  // Google Ads / GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

export function trackLead(params?: { source?: string; value?: number; currency?: string }) {
  trackEvent('Lead', {
    content_name: params?.source || 'website',
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
  })
}

export function trackPurchase(params: { value: number; currency?: string; orderId?: string }) {
  trackEvent('Purchase', {
    value: params.value,
    currency: params.currency || 'BRL',
    transaction_id: params.orderId,
  })
}

export function trackRegistration(params?: { source?: string }) {
  trackEvent('CompleteRegistration', {
    content_name: params?.source || 'website',
  })
}
