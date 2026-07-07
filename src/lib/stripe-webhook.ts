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
  const productType = session.metadata?.productType
  const orderId = session.metadata?.orderId ?? session.client_reference_id ?? null

  if (productType === 'pdi') {
    // Funil PDI: desbloqueia o plano pago no diagnóstico (sem matrícula)
    const diagnosticoId = session.metadata?.diagnosticoId
    if (!diagnosticoId) {
      return 'ignored'
    }

    const { error: unlockError } = await admin
      .from('personal_diagnostics')
      .update({
        pdi_paid_at: new Date().toISOString(),
        pdi_order_id: orderId,
      })
      .eq('id', diagnosticoId)
      .is('pdi_paid_at', null)

    await assertNoCriticalDbError(unlockError, 'Failed to unlock paid PDI')
  } else {
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
  }

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

async function processSubscriptionChange(
  admin: ReturnType<typeof createAdminClient>,
  event: Stripe.Event
): Promise<WebhookOutcome> {
  const sub = event.data.object as unknown as Record<string, unknown>

  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
    trialing: 'trialing',
    paused: 'paused',
  }

  const stripeStatus = String(sub.status || 'active')
  const toIso = (ts: unknown) =>
    typeof ts === 'number' ? new Date(ts * 1000).toISOString() : null

  const { error } = await admin
    .from('subscriptions')
    .update({
      status: statusMap[stripeStatus] || stripeStatus,
      current_period_start: toIso(sub.current_period_start),
      current_period_end: toIso(sub.current_period_end),
      canceled_at: toIso(sub.canceled_at),
      cancel_at: toIso(sub.cancel_at),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', String(sub.id))

  if (error) {
    if (getPgCode(error) === '42P01') return 'ignored'
    await assertNoCriticalDbError(error, 'Failed to update subscription')
  }

  return 'processed'
}

async function processInvoicePaymentFailed(
  admin: ReturnType<typeof createAdminClient>,
  event: Stripe.Event
): Promise<WebhookOutcome> {
  const invoice = event.data.object as unknown as Record<string, unknown>
  const rawSub = invoice.subscription
  const subscriptionId = typeof rawSub === 'string'
    ? rawSub
    : typeof rawSub === 'object' && rawSub !== null && 'id' in rawSub
      ? String((rawSub as { id: unknown }).id)
      : null

  if (!subscriptionId) return 'ignored'

  const { error } = await admin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error && getPgCode(error) === '42P01') return 'ignored'
  if (error) await assertNoCriticalDbError(error, 'Failed to mark subscription past_due')

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
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      outcome = await processSubscriptionChange(admin, event)
    } else if (event.type === 'invoice.payment_failed') {
      outcome = await processInvoicePaymentFailed(admin, event)
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
