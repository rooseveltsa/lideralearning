/**
 * Runtime environment validation.
 * Import this module in layout.tsx to fail fast on missing configuration.
 */

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const requiredInProduction = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) missing.push(key)
  }

  if (process.env.NODE_ENV === 'production') {
    for (const key of requiredInProduction) {
      if (!process.env[key]) missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`
    )
  }
}
