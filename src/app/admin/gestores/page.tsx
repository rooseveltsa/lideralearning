import Link from 'next/link'
import { Briefcase, ChevronRight, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function AdminGestoresPage() {
  const supabase = await createClient()

  // Fetch all hr_manager profiles
  const { data: gestores } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('role', 'hr_manager')
    .order('created_at', { ascending: false })

  // Fetch relationship counts
  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('gestor_user_id, company_name')

  const gestorStats = new Map<string, { count: number; company: string }>()
  if (relationships) {
    for (const rel of relationships) {
      const existing = gestorStats.get(rel.gestor_user_id)
      gestorStats.set(rel.gestor_user_id, {
        count: (existing?.count ?? 0) + 1,
        company: rel.company_name ?? existing?.company ?? '',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Empresas contratantes
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Gestores e RH
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Visualize os gestores que contrataram o treinamento e acompanhe
            o progresso dos supervisores vinculados.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7B1FA2]/10">
            <Briefcase className="h-4.5 w-4.5 text-[#7B1FA2]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total gestores</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{gestores?.length ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Supervisores vinculados</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">
            {Array.from(gestorStats.values()).reduce((sum, g) => sum + g.count, 0)}
          </p>
        </article>
      </section>

      {/* List */}
      {!gestores || gestores.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <Briefcase className="h-8 w-8 text-[#94A3B8]" />
          </div>
          <h3 className="mb-2 font-heading text-xl font-extrabold text-[#111827]">Nenhum gestor cadastrado</h3>
          <p className="font-medium text-[#64748B]">
            Para vincular um gestor, altere o role do perfil para &quot;hr_manager&quot; no Supabase.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {gestores.map((gestor) => {
            const stats = gestorStats.get(gestor.id)
            return (
              <article
                key={gestor.id}
                className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7B1FA2]/10 text-lg font-extrabold text-[#7B1FA2]">
                      {gestor.full_name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#0F172A]">{gestor.full_name}</h3>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {stats?.company || 'Sem empresa vinculada'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/gestores/${gestor.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                  >
                    Ver
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1565C0]/10 px-2.5 py-1 text-xs font-bold text-[#1565C0]">
                    <Users className="h-3 w-3" />
                    {stats?.count ?? 0} supervisores
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    Desde {new Date(gestor.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
