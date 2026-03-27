import { NextResponse } from 'next/server'

// Deprecated alias. All webhooks should use /api/webhooks/stripe.
// Keeping this route to return a clear error if Stripe is still configured to hit the old URL.
export async function POST() {
  return NextResponse.json(
    {
      error: 'This webhook endpoint is deprecated. Update your Stripe dashboard to use /api/webhooks/stripe.',
    },
    { status: 410 }
  )
}
