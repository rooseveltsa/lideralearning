import { expect, test } from '@playwright/test'

test('home institucional abre', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.ok()).toBeTruthy()
  await expect(page.getByRole('link', { name: /treinamento|academy|cursos/i }).first()).toBeVisible()
})

test('catálogo público não quebra sem sessão', async ({ page }) => {
  const response = await page.goto('/cursos')
  expect(response?.status()).toBeLessThan(500)
  await expect(page.getByRole('heading', { name: /stream de treinamentos|nenhum treinamento publicado/i })).toBeVisible()
})

test('login e cadastro exibem o formulário da jornada', async ({ page }) => {
  await page.goto('/auth/login?redirect=/cursos')
  await expect(page.getByLabel('E-mail')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
  await expect(page.locator('input[name="redirectTo"]')).toHaveValue('/cursos')

  await page.goto('/auth/register?next=/curso/demo')
  await expect(page.getByLabel(/nome completo/i)).toBeVisible()
  await expect(page.locator('input[name="redirectTo"]')).toHaveValue('/curso/demo')
})

test('área do aluno e admin exigem login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/auth\/login/)

  await page.goto('/admin/cursos')
  await expect(page).toHaveURL(/\/auth\/login/)
})

test('webhook Stripe recusa chamada sem assinatura', async ({ request }) => {
  const response = await request.post('/api/webhooks/stripe', {
    data: { id: 'evt_e2e', type: 'checkout.session.completed' },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toMatch(/signature|Webhook/i)
})

test('webhook Stripe recusa assinatura forjada', async ({ request }) => {
  const response = await request.post('/api/webhooks/stripe', {
    headers: { 'stripe-signature': 't=1,v1=deadbeef' },
    data: '{"id":"evt_e2e"}',
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toMatch(/Webhook Error/)
})
