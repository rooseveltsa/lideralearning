import { headers } from 'next/headers'

import { handleStripeWebhook } from '@/lib/stripe-webhook'

/**
 * @deprecated Prefer /api/webhooks/stripe as the canonical endpoint.
 * This alias is kept only for backward compatibility with existing
 * Stripe dashboard configurations. The handler is idempotent via
 * webhook_events, so duplicate deliveries to both URLs are safe.
 */
export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')
  return handleStripeWebhook({ body, signature })
}
