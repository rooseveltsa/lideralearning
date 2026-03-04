import { headers } from 'next/headers'

import { handleStripeWebhook } from '@/lib/stripe-webhook'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  // Backward-compatible alias. Prefer /api/webhooks/stripe.
  return handleStripeWebhook({ body, signature })
}
