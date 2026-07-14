// Guard de admin para route handlers.
//
// As rotas sob /api/admin operam sobre a base inteira de leads e disparam geração
// de PDI (que custa LLM). Sem esse guard, qualquer pessoa que descubra a URL executa.

import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export type AdminGuard = { ok: true } | { ok: false; response: NextResponse }

export async function requireAdmin(): Promise<AdminGuard> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Acesso negado.' }, { status: 403 }) }
  }

  return { ok: true }
}
