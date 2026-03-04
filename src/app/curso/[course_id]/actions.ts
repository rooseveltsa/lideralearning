'use server'

import { randomUUID } from 'crypto'

import { redirect, unstable_rethrow } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'

const MIGRATION_HINT = 'Commerce infrastructure missing. Execute docs/database/03_commerce_orders.sql.'

type CourseCheckoutPayload = {
  id: string
  title: string
  description: string | null
  price: number
  thumbnail_url: string | null
}

function isStripeBypassEnabled(stripeKey: string) {
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

  const pgCode = getPgCode(error)
  if (pgCode === '42P01') {
    throw new Error(MIGRATION_HINT)
  }

  throw new Error(`${context}: ${getErrorMessage(error)}`)
}

async function createPendingOrder(
  userId: string,
  course: CourseCheckoutPayload
) {
  const admin = createAdminClient()
  const orderId = randomUUID()
  const amount = Number(course.price ?? 0)

  const { error: orderError } = await admin.from('orders').insert({
    id: orderId,
    user_id: userId,
    status: 'pending',
    currency: 'BRL',
    subtotal_amount: amount,
    total_amount: amount,
  })

  throwIfCriticalDbError(orderError, 'Failed to create order')

  const { error: orderItemError } = await admin.from('order_items').insert({
    order_id: orderId,
    product_type: 'course',
    course_id: course.id,
    title: course.title,
    unit_amount: amount,
    quantity: 1,
    line_total: amount,
  })

  throwIfCriticalDbError(orderItemError, 'Failed to create order item')

  return { orderId, amount, admin }
}

async function markBypassPurchaseAsPaid(
  admin: ReturnType<typeof createAdminClient>,
  orderId: string,
  userId: string,
  courseId: string,
  amount: number
) {
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

  throwIfCriticalDbError(enrollmentError, 'Failed to grant enrollment in bypass mode')

  const { error: orderError } = await admin
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', orderId)

  throwIfCriticalDbError(orderError, 'Failed to update order status in bypass mode')

  const { error: paymentError } = await admin.from('payments').insert({
    order_id: orderId,
    provider: 'internal_bypass',
    provider_event_id: `bypass_${orderId}`,
    amount,
    currency: 'BRL',
    status: 'succeeded',
    raw_payload: {
      bypass: true,
      reason: 'stripe_key_missing_or_dummy',
      userId,
      courseId,
    },
  })

  throwIfCriticalDbError(paymentError, 'Failed to register bypass payment')
}

export async function createCheckoutSession(courseId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/curso/${courseId}`)
  }

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, description, price, thumbnail_url')
    .eq('id', courseId)
    .single()

  if (courseError || !course) {
    throw new Error('Course not found')
  }

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single()

  if (enrollment) {
    redirect(`/dashboard/cursos/${courseId}`)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''

  const { orderId, amount, admin } = await createPendingOrder(user.id, {
    id: course.id,
    title: course.title,
    description: course.description,
    price: Number(course.price ?? 0),
    thumbnail_url: course.thumbnail_url,
  })

  if (isStripeBypassEnabled(stripeKey)) {
    await markBypassPurchaseAsPaid(admin, orderId, user.id, course.id, amount)
    redirect(`/dashboard/cursos?success=true&bypassed=true&order=${orderId}`)
  }

  try {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: course.title,
                description: course.description || undefined,
                images: course.thumbnail_url ? [course.thumbnail_url] : [],
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: orderId,
        success_url: `${appUrl}/dashboard/cursos?success=true&order=${orderId}`,
        cancel_url: `${appUrl}/curso/${courseId}?canceled=true&order=${orderId}`,
        metadata: {
          orderId,
          userId: user.id,
          courseId: course.id,
        },
      },
      {
        idempotencyKey: `checkout_session_${orderId}`,
      }
    )

    const { error: orderUpdateError } = await admin
      .from('orders')
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq('id', orderId)

    throwIfCriticalDbError(orderUpdateError, 'Failed to attach checkout session to order')

    if (!session.url) {
      throw new Error('Failed to create Stripe checkout URL')
    }

    redirect(session.url)
  } catch (error: unknown) {
    unstable_rethrow(error)
    await admin.from('orders').update({ status: 'failed' }).eq('id', orderId)
    throw new Error(`Failed to create checkout session: ${getErrorMessage(error)}`)
  }
}
