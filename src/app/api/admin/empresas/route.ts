import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { normalizeOrgCode, type SurveyOrgCanais } from '@/lib/surveys/orgs'

type Payload = {
  code?: string
  nome?: string
  canais?: Record<string, unknown>
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(request: Request) {
  // Gate de admin (rota fora do matcher do middleware /admin).
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso restrito.' }, { status: 403 })
  }

  let json: Payload
  try {
    json = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const code = normalizeOrgCode(json.code)
  const nome = str(json.nome, 160)
  if (!code || code.length < 2) {
    return NextResponse.json({ error: 'Código inválido (use letras minúsculas, números e hífen).' }, { status: 400 })
  }
  if (!nome) {
    return NextResponse.json({ error: 'Nome da empresa é obrigatório.' }, { status: 400 })
  }

  const rawCanais = (json.canais && typeof json.canais === 'object' ? json.canais : {}) as Record<string, unknown>
  const canais: SurveyOrgCanais = {
    ouvidoria: str(rawCanais.ouvidoria, 200) || undefined,
    cipa: str(rawCanais.cipa, 200) || undefined,
    sesmt: str(rawCanais.sesmt, 200) || undefined,
    rh: str(rawCanais.rh, 200) || undefined,
  }

  const admin = createAdminClient()
  const { error } = await admin.from('survey_orgs').insert({ code, nome, canais, ativo: true })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `Já existe empresa com o código "${code}".` }, { status: 409 })
    }
    console.error('[empresas] insert error:', error)
    return NextResponse.json({ error: 'Não foi possível criar a empresa.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, code })
}
