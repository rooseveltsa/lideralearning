import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import test from 'node:test'

function walk(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (entry === 'route.ts') files.push(full)
  }
  return files
}

const root = path.resolve(import.meta.dirname, '..')

test('rotas /api/admin checam papel no servidor', () => {
  const routes = walk(path.join(root, 'src/app/api/admin'))
  assert.ok(routes.length >= 7, `esperava as rotas admin existentes, achei ${routes.length}`)
  for (const file of routes) {
    const source = readFileSync(file, 'utf8')
    const guarded = source.includes('requireAdmin(') || source.includes("role !== 'admin'") || source.includes('role !== "admin"')
    assert.equal(guarded, true, `${path.relative(root, file)} não checa admin`)
  }
})

test('layout do admin recusa usuário sem role admin', () => {
  const source = readFileSync(path.join(root, 'src/app/admin/layout.tsx'), 'utf8')
  assert.match(source, /profile\.role !== 'admin'/)
  assert.match(source, /redirect\('\/auth\/login'\)/)
})

test('middleware manda anônimo de /admin e /dashboard para o login', () => {
  const source = readFileSync(path.join(root, 'src/lib/supabase/middleware.ts'), 'utf8')
  assert.match(source, /pathname\.startsWith\('\/admin'\)/)
  assert.match(source, /pathname\.startsWith\('\/dashboard'\)/)
  assert.match(source, /auth\/login/)
})

test('webhook Stripe verifica a assinatura com o segredo', () => {
  const source = readFileSync(path.join(root, 'src/lib/stripe-webhook.ts'), 'utf8')
  assert.match(source, /constructEvent\(/)
  assert.match(source, /STRIPE_WEBHOOK_SECRET/)
  const route = readFileSync(path.join(root, 'src/app/api/webhooks/stripe/route.ts'), 'utf8')
  assert.match(route, /stripe-signature/)
})
