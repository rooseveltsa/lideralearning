import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/service'

const MIGRATION_HINT = 'Commerce infrastructure missing. Execute docs/database/03_commerce_orders.sql.'

type WebhookOutcome = 'processed' | 'ignored'

type HandleStripeWebhookInput = {
  body: string
  signature: string | null
}

function toMajorUnit(amountInMinor: number | null | undefined) {
  return Number(((amountInMinor ?? 0) / 100).toFixed(2))
}

function getPgCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: string }).code)
  }

  return undefined
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Unknown webhook processing error'
}

function getPaymentIntentId(paymentIntent: string | Stripe.PaymentIntent | null) {
  if (!paymentIntent) return null
  if (typeof paymentIntent === 'string') return paymentIntent
  return paymentIntent.id
}

function normalizeCurrency(currency: string | null | undefined) {
  return (currency ?? 'brl').toUpperCase()
}

async function assertNoCriticalDbError(error: unknown, context: string) {
  if (!error) return

  const pgCode = getPgCode(error)
  if (pgCode === '42P01') {
    throw new Error(MIGRATION_HINT)
  }

  const message = getErrorMessage(error)
  throw new Error(`${context}: ${message}`)
}

async function registerEvent(
  admin: ReturnType<typeof createAdminClient>,
  event: Stripe.Event
): Promise<'registered' | 'duplicate'> {
  const { error } = await admin.from('webhook_events').insert({
    provider: 'stripe',
    provider_event_id: event.id,
    event_type: event.type,
    status: 'received',
    payload: event as unknown as Record<string, unknown>,
  })

  if (!error) return 'registered'

  if (getPgCode(error) === '23505') {
    return 'duplicate'
  }

  await assertNoCriticalDbError(error, 'Could not register webhook event')
  return 'registered'
}

async function finalizeEvent(
  admin: ReturnType<typeof createAdminClient>,
  eventId: string,
  status: 'processed' | 'ignored' | 'error',
  errorMessage?: string
) {
  await admin
    .from('webhook_events')
    .update({
      status,
      processed_at: new Date().toISOString(),
      error_message: errorMessage ?? null,
    })
    .eq('provider_event_id', eventId)
}

async function processCheckoutCompleted(
  admin: ReturnType<typeof createAdminClient>,
  event: Stripe.Event
): Promise<WebhookOutcome> {
  const session = event.data.object as Stripe.Checkout.Session

  const userId = session.metadata?.userId
  const courseId = session.metadata?.courseId
  const orderId = session.metadata?.orderId ?? session.client_reference_id ?? null

  if (!userId || !courseId) {
    return 'ignored'
  }

  const { error: enrollmentError } = await admin.from('enrollments').upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: 'active',
    },
    {
      onConflict: 'user_id, course_id',
    }
  )

  await assertNoCriticalDbError(enrollmentError, 'Failed to grant enrollment')

  const paymentIntentId = getPaymentIntentId(session.payment_intent)
  const amount = toMajorUnit(session.amount_total)
  const currency = normalizeCurrency(session.currency)

  if (orderId) {
    const { error: orderUpdateError } = await admin
      .from('orders')
      .update({
        status: 'paid',
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
      })
      .eq('id', orderId)

    await assertNoCriticalDbError(orderUpdateError, 'Failed to update order status')
  }

  const { error: paymentError } = await admin.from('payments').insert({
    order_id: orderId,
    provider: 'stripe',
    provider_event_id: event.id,
    provider_checkout_session_id: session.id,
    provider_payment_intent_id: paymentIntentId,
    amount,
    currency,
    status: 'succeeded',
    raw_payload: event as unknown as Record<string, unknown>,
  })

  await assertNoCriticalDbError(paymentError, 'Failed to register payment')

  return 'processed'
}

async function processCheckoutExpired(
  admin: ReturnType<typeof createAdminClient>,
  event: Stripe.Event
): Promise<WebhookOutcome> {
  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.orderId ?? session.client_reference_id ?? null

  if (!orderId) {
    return 'ignored'
  }

  const { error } = await admin
    .from('orders')
    .update({ status: 'canceled', stripe_checkout_session_id: session.id })
    .eq('id', orderId)

  await assertNoCriticalDbError(error, 'Failed to mark order as canceled')
  return 'processed'
}

export async function handleStripeWebhook({ body, signature }: HandleStripeWebhookInput) {
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Webhook secret or signature missing', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    const registration = await registerEvent(admin, event)
    if (registration === 'duplicate') {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }

    let outcome: WebhookOutcome = 'ignored'

    if (event.type === 'checkout.session.completed') {
      outcome = await processCheckoutCompleted(admin, event)
    } else if (event.type === 'checkout.session.expired') {
      outcome = await processCheckoutExpired(admin, event)
    }

    await finalizeEvent(admin, event.id, outcome)
    return NextResponse.json({ received: true, status: outcome }, { status: 200 })
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    try {
      await finalizeEvent(admin, event.id, 'error', message)
    } catch {
      // Ignore finalize failures to preserve original processing error.
    }
    console.error('Stripe webhook processing error:', error)
    return new NextResponse(message, { status: 500 })
  }
}
