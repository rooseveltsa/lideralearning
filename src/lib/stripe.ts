import Stripe from 'stripe'

const apiKey = process.env.STRIPE_SECRET_KEY

if (!apiKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is required in production.')
}

export const stripe = new Stripe(apiKey || 'sk_test_placeholder_for_dev', {
    appInfo: {
        name: 'Lidera Treinamentos',
        version: '0.1.0',
    },
})
