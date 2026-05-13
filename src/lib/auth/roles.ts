// Helper para detectar role do usuário a partir da tabela `profiles`.
// Usado pelo middleware e actions de auth para redirecionar baseado em role.

import type { SupabaseClient, User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'hr_manager' | 'student'

const ADMIN_ROLES: UserRole[] = ['admin']

/**
 * Lê o role do usuário a partir da tabela `profiles`.
 * Retorna 'student' como default seguro se profile não existir ou query falhar.
 */
export async function getUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserRole> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    const role = data?.role as UserRole | undefined
    return role ?? 'student'
  } catch {
    return 'student'
  }
}

/**
 * Retorna o path padrão para redirecionar o usuário pós-login.
 * Admins vão para /admin, outros vão para /dashboard.
 */
export function defaultRedirectForRole(role: UserRole): string {
  return ADMIN_ROLES.includes(role) ? '/admin' : '/dashboard'
}

/**
 * Atalho que combina getUserRole + defaultRedirectForRole.
 */
export async function getDefaultRedirectForUser(
  supabase: SupabaseClient,
  user: User,
): Promise<string> {
  const role = await getUserRole(supabase, user.id)
  return defaultRedirectForRole(role)
}
