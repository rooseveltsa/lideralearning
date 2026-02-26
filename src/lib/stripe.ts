import Stripe from 'stripe'

// For development/showcase purposes, we don't throw if the key is missing or dummy.
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_ui_showcase'

export const stripe = new Stripe(apiKey, {
    apiVersion: '2026-02-25.clover', // Use the latest stable API version or match your account
    appInfo: {
        name: 'Lidera Treinamentos',
        version: '0.1.0',
    },
})
