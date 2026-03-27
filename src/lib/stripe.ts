import Stripe from 'stripe'

const isProduction = process.env.NODE_ENV === 'production'
const rawKey = process.env.STRIPE_SECRET_KEY

if (isProduction && (!rawKey || rawKey.includes('dummy'))) {
  throw new Error(
    'STRIPE_SECRET_KEY is missing or invalid in production. Payments will NOT work.'
  )
}

const apiKey = rawKey || 'sk_test_dummy_key_for_ui_showcase'

export const stripe = new Stripe(apiKey, {
  apiVersion: '2026-02-25.clover',
  appInfo: {
    name: 'Lidera Treinamentos',
    version: '0.1.0',
  },
})
