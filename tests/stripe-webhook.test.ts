import assert from 'node:assert/strict'
import test from 'node:test'

process.env.STRIPE_SECRET_KEY = 'sk_test_51LideraWebhookSignatureOnly'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_for_signature_check'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:9'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key-not-dummy'

const ready = Promise.all([import('stripe'), import('../src/lib/stripe-webhook')])

const payload = JSON.stringify({
  id: 'evt_test_checkout',
  object: 'event',
  type: 'checkout.session.completed',
  data: { object: { id: 'cs_test', object: 'checkout.session' } },
})

test('webhook sem assinatura é recusado', async () => {
  const { handleStripeWebhook } = (await ready)[1]
  const response = await handleStripeWebhook({ body: payload, signature: null })
  assert.equal(response.status, 400)
  assert.match(await response.text(), /signature missing|Webhook secret/i)
})

test('webhook com assinatura inválida é recusado antes de gravar pagamento', async () => {
  const { handleStripeWebhook } = (await ready)[1]
  const response = await handleStripeWebhook({ body: payload, signature: 't=1,v1=deadbeef' })
  assert.equal(response.status, 400)
  const text = await response.text()
  assert.match(text, /Webhook Error/)
  assert.doesNotMatch(text, /enroll/i)
})

test('webhook com assinatura válida passa da verificação', async () => {
  const [{ default: Stripe }, { handleStripeWebhook }] = await ready
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  })
  const response = await handleStripeWebhook({ body: payload, signature })
  assert.notEqual(response.status, 400)
})
