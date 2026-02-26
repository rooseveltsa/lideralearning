'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(courseId: string) {
    const supabase = await createClient()

    // Require authentication to purchase
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Redirect to login but save the return URL
        redirect(`/auth/login?next=/curso/${courseId}`)
    }

    // Fetch course details securely
    const { data: course, error } = await supabase
        .from('courses')
        .select('id, title, description, price, thumbnail_url')
        .eq('id', courseId)
        .single()

    if (error || !course) {
        throw new Error('Course not found')
    }

    // Prevent double purchases
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

    // --- STRIPE BYPASS FOR LOCAL SHOWCASE ---
    const stripeKey = process.env.STRIPE_SECRET_KEY || ''
    if (!stripeKey || stripeKey.includes('dummy') || stripeKey === 'sk_test_...') {
        console.log('Stripe key missing or dummy. Bypassing Stripe and enrolling directly.')

        // Note: We bypass RLS using the service role just for this demo mock
        const { createAdminClient } = await import('@/lib/supabase/service')
        const adminAuth = createAdminClient()

        await adminAuth.from('enrollments').upsert({
            user_id: user.id,
            course_id: courseId,
            status: 'active'
        }, { onConflict: 'user_id, course_id' })

        redirect(`/dashboard/cursos?success=true&bypassed=true`)
    }
    // -----------------------------------------

    try {
        const session = await stripe.checkout.sessions.create({
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
                        unit_amount: Math.round(course.price * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${appUrl}/dashboard/cursos?success=true`,
            cancel_url: `${appUrl}/curso/${courseId}?canceled=true`,
            metadata: {
                userId: user.id,
                courseId: course.id,
            },
        })

        if (session.url) {
            redirect(session.url)
        } else {
            throw new Error('Failed to create stripe session url')
        }

    } catch (err: any) {
        console.error('Error creating checkout session:', err)
        // In server actions, redirecting in a try-catch is tricky. 
        // This is a simplified approach. 
        // Ideally, return the URL to the client component and route there.
        throw err
    }
}
