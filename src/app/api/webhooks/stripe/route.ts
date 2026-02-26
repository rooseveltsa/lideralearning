import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/service"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const headerPayload = await headers()
    const signature = headerPayload.get("stripe-signature")

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Webhook Secret or Signature Missing", { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // Retrieve the metadata we passed when creating the checkout session
        const userId = session.metadata?.userId
        const courseId = session.metadata?.courseId

        if (userId && courseId) {
            console.log(`Fulfilling purchase for user ${userId} and course ${courseId}`)

            try {
                // Insert into enrollments overriding RLS using the Admin Client
                const { error } = await supabaseAdmin
                    .from('enrollments')
                    .upsert({
                        user_id: userId,
                        course_id: courseId,
                        status: 'active'
                    }, {
                        onConflict: 'user_id, course_id'
                    })

                if (error) throw error

                console.log(`Enrollment successful for ${userId}`)
            } catch (err) {
                console.error('Failed to grant enrollment via webhook', err)
                return new NextResponse("Database Error fulfilling purchase", { status: 500 })
            }
        } else {
            console.warn('Checkout session completed but missing required metadata.')
        }
    }

    return new NextResponse(null, { status: 200 })
}
