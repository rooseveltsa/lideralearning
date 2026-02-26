import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// We need an admin supabase client to bypass RLS when fulfilling purchases via webhook
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
        if (!webhookSecret) {
            throw new Error('Webhook secret is not defined.')
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any

        const userId = session.metadata?.userId
        const courseId = session.metadata?.courseId

        if (userId && courseId) {
            // Fulfill the purchase: update or create an active enrollment
            console.log(`Fulfilling purchase for user ${userId} and course ${courseId}`)
            const { error } = await supabase
                .from('enrollments')
                .upsert({
                    user_id: userId,
                    course_id: courseId,
                    status: 'active'
                }, { onConflict: 'user_id, course_id' })

            if (error) {
                console.error('Error fulfilling purchase in Supabase:', error)
                return NextResponse.json({ error: 'Supabase Error' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
