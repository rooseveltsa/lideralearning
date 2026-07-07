'use server'

import { randomUUID } from 'crypto'

import { redirect, unstable_rethrow } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/service'
import { PDI_PRICE_CENTS, PDI_PRODUCT_NAME } from '@/lib/funnel'

const MIGRATION_HINT = 'Infra do funil PDI ausente. Execute docs/database/58_pdi_checkout.sql.'

function isStripeBypassEnabled(stripeKey: string) {
  if (process.env.NODE_ENV === 'production') return false
  return !stripeKey || stripeKey.includes('dummy') || stripeKey === 'sk_test_...'
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Unknown error'
}

function getPgCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: string }).code)
  }
  return undefined
}

function throwIfCriticalDbError(error: unknown, context: string) {
  if (!error) return
  if (getPgCode(error) === '42P01' || getPgCode(error) === '42703') {
    throw new Error(MIGRATION_HINT)
  }
  throw new Error(`${context}: ${getErrorMessage(error)}`)
}

/** Cria a sessão de checkout do PDI (valor simbólico — tripwire do funil). */
export async function createPdiCheckoutSession(diagnosticoId: string) {
  const admin = createAdminClient()

  const { data: diag, error: diagError } = await admin
    .from('personal_diagnostics')
    .select('id, nome_completo, email, pdi_paid_at')
    .eq('id', diagnosticoId)
    .maybeSingle()

  throwIfCriticalDbError(diagError, 'Falha ao carregar diagnóstico')
  if (!diag) throw new Error('Diagnóstico não encontrado')

  const pdiPath = `/diagnostico/pessoal/pdi/${diagnosticoId}`
  if (diag.pdi_paid_at) redirect(pdiPath)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  const amount = PDI_PRICE_CENTS / 100
  const orderId = randomUUID()

  const { error: orderError } = await admin.from('orders').insert({
    id: orderId,
    user_id: null,
    status: 'pending',
    currency: 'BRL',
    subtotal_amount: amount,
    total_amount: amount,
  })
  throwIfCriticalDbError(orderError, 'Falha ao criar pedido do PDI')

  const { error: itemError } = await admin.from('order_items').insert({
    order_id: orderId,
    product_type: 'pdi',
    course_id: null,
    title: PDI_PRODUCT_NAME,
    unit_amount: amount,
    quantity: 1,
    line_total: amount,
  })
  throwIfCriticalDbError(itemError, 'Falha ao criar item do pedido do PDI')

  if (isStripeBypassEnabled(stripeKey)) {
    const now = new Date().toISOString()
    await admin
      .from('personal_diagnostics')
      .update({ pdi_paid_at: now, pdi_order_id: orderId })
      .eq('id', diagnosticoId)
    await admin.from('orders').update({ status: 'paid' }).eq('id', orderId)
    await admin.from('payments').insert({
      order_id: orderId,
      provider: 'internal_bypass',
      provider_event_id: `bypass_${orderId}`,
      amount,
      currency: 'BRL',
      status: 'succeeded',
      raw_payload: { bypass: true, reason: 'stripe_key_missing_or_dummy', diagnosticoId, productType: 'pdi' },
    })
    redirect(`${pdiPath}?paid=1`)
  }

  try {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        customer_email: diag.email || undefined,
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: PDI_PRODUCT_NAME,
                description: 'Plano personalizado de 90 dias com fases, ferramentas e rituais de liderança.',
              },
              unit_amount: PDI_PRICE_CENTS,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: orderId,
        success_url: `${appUrl}${pdiPath}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/diagnostico/pessoal/resultado/${diagnosticoId}?checkout=cancelado`,
        metadata: {
          productType: 'pdi',
          diagnosticoId,
          orderId,
        },
      },
      { idempotencyKey: `pdi_checkout_${orderId}` }
    )

    await admin.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', orderId)

    if (!session.url) throw new Error('Stripe não retornou URL de checkout')
    redirect(session.url)
  } catch (error: unknown) {
    unstable_rethrow(error)
    await admin.from('orders').update({ status: 'failed' }).eq('id', orderId)
    throw new Error(`Falha ao criar checkout do PDI: ${getErrorMessage(error)}`)
  }
}

/**
 * Fallback anti-race: quando o comprador volta do Stripe antes de o webhook
 * chegar, confirma a sessão direto na API e desbloqueia o PDI.
 */
export async function verifyPdiCheckoutSession(diagnosticoId: string, sessionId: string): Promise<boolean> {
  if (!sessionId || sessionId.length > 200) return false
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  if (isStripeBypassEnabled(stripeKey)) return false

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return false
    if (session.metadata?.productType !== 'pdi' || session.metadata?.diagnosticoId !== diagnosticoId) {
      return false
    }

    const admin = createAdminClient()
    await admin
      .from('personal_diagnostics')
      .update({
        pdi_paid_at: new Date().toISOString(),
        pdi_order_id: session.metadata?.orderId ?? null,
      })
      .eq('id', diagnosticoId)
      .is('pdi_paid_at', null)

    if (session.metadata?.orderId) {
      await admin
        .from('orders')
        .update({ status: 'paid', stripe_checkout_session_id: session.id })
        .eq('id', session.metadata.orderId)
        .eq('status', 'pending')
    }

    return true
  } catch {
    return false
  }
}
