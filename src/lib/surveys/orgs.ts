// Empresas/clientes para segmentar os formulários (multi-cliente via ?org=code).
// Lookup feito no servidor com service role (não expõe a tabela ao público).

import { createAdminClient } from '@/lib/supabase/service'

export type SurveyOrgCanais = {
  ouvidoria?: string
  cipa?: string
  sesmt?: string
  rh?: string
}

export type SurveyOrg = {
  code: string
  nome: string
  canais: SurveyOrgCanais
}

/** Normaliza um code de empresa (slug): minúsculas, só [a-z0-9-]. */
export function normalizeOrgCode(raw: string | null | undefined): string {
  return (raw || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '').slice(0, 41)
}

/** Busca a empresa pelo code. Retorna null se não existir, inativa ou code vazio. */
export async function getOrg(code: string | null | undefined): Promise<SurveyOrg | null> {
  const c = normalizeOrgCode(code)
  if (!c) return null
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('survey_orgs')
      .select('code, nome, canais, ativo')
      .eq('code', c)
      .maybeSingle()
    if (!data || data.ativo === false) return null
    return { code: data.code, nome: data.nome, canais: (data.canais as SurveyOrgCanais) ?? {} }
  } catch {
    return null
  }
}

export type SurveyOrgRow = SurveyOrg & { ativo: boolean }

/** Lista todas as empresas (admin). */
export async function listOrgs(): Promise<SurveyOrgRow[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('survey_orgs')
      .select('code, nome, canais, ativo')
      .order('nome', { ascending: true })
    return (data as SurveyOrgRow[]) ?? []
  } catch {
    return []
  }
}
