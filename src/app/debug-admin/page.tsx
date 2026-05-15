// Rota TEMPORÁRIA de debug do problema de acesso admin.
// Acesse /debug-admin estando logado para ver o estado real.
// REMOVER após resolver o bug.

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DebugAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  let profile: { role?: string; full_name?: string } | null = null
  let profileError: string | null = null

  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle()
    profile = data
    profileError = error?.message ?? null
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div style={{ fontFamily: 'monospace', padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>🔍 Debug Admin Access</h1>
      <p style={{ color: '#64748B', marginBottom: 24 }}>
        Esta página é temporária — usada para diagnosticar problema de acesso admin. Tire um print
        e mande para a Uma.
      </p>

      <div style={{ background: '#F8FAFD', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Sessão atual</h2>
        {userError && (
          <p style={{ color: '#EF4444' }}>
            <strong>Erro auth.getUser:</strong> {userError.message}
          </p>
        )}
        {!user ? (
          <p style={{ color: '#EF4444' }}>
            ❌ <strong>Não há usuário logado nesta sessão!</strong> Faça login antes.
          </p>
        ) : (
          <>
            <p>
              ✅ <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Criado em:</strong> {user.created_at}
            </p>
            <p>
              <strong>Último login:</strong> {user.last_sign_in_at ?? '—'}
            </p>
            <p>
              <strong>Confirmado:</strong> {user.email_confirmed_at ? 'sim' : 'não'}
            </p>
          </>
        )}
      </div>

      <div style={{ background: '#F8FAFD', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Profile (public.profiles)</h2>
        {profileError && (
          <p style={{ color: '#EF4444' }}>
            <strong>Erro query profiles:</strong> {profileError}
          </p>
        )}
        {!profile ? (
          <p style={{ color: '#EF4444' }}>
            ❌ <strong>Profile não existe!</strong> O usuário precisa ter um registro em
            public.profiles. Rode o SQL de fallback INSERT.
          </p>
        ) : (
          <>
            <p>
              <strong>Role:</strong>{' '}
              <span
                style={{
                  background: isAdmin ? '#22C55E' : '#EF4444',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                {profile.role ?? 'null'}
              </span>
            </p>
            <p>
              <strong>Nome:</strong> {profile.full_name ?? '—'}
            </p>
          </>
        )}
      </div>

      <div style={{ background: '#F8FAFD', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Diagnóstico</h2>
        {!user ? (
          <p>👉 Faça login primeiro.</p>
        ) : !profile ? (
          <p>
            👉 Profile não existe. Rode SQL:
            <br />
            <code style={{ background: '#0F172A', color: '#A7F3D0', padding: 8, display: 'block', marginTop: 8 }}>
              INSERT INTO public.profiles (id, full_name, role) VALUES (&apos;{user.id}&apos;,
              &apos;{user.email}&apos;, &apos;admin&apos;);
            </code>
          </p>
        ) : !isAdmin ? (
          <p>
            👉 Role é &quot;{profile.role}&quot;, precisa ser &quot;admin&quot;. Rode SQL:
            <br />
            <code style={{ background: '#0F172A', color: '#A7F3D0', padding: 8, display: 'block', marginTop: 8 }}>
              UPDATE public.profiles SET role = &apos;admin&apos; WHERE id = &apos;{user.id}&apos;;
            </code>
          </p>
        ) : (
          <p style={{ color: '#22C55E', fontWeight: 700 }}>
            ✅ Tudo OK no banco! Role = admin. O problema é provavelmente sessão antiga.
            <br />
            <br />
            👉 Faça LOGOUT + LIMPAR COOKIES + LOGIN novamente.
            <br />
            <br />
            Após login, deve cair em /admin automaticamente. Se ainda não, o problema é no
            middleware — me reporta.
          </p>
        )}
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: '#94A3B8' }}>
        Após resolver, lembre de remover esta rota: <code>src/app/debug-admin/page.tsx</code>
      </p>
    </div>
  )
}
