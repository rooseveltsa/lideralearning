import Link from 'next/link'
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function AdminAlunosPage() {
  const supabase = await createClient()

  // Fetch ALL profiles — admins also fill forms during testing
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  // Fetch self-assessment data per user
  const { data: assessmentData } = await supabase
    .from('leadership_self_assessments')
    .select('user_id, perfil, pontuacao_total')

  const assessmentMap = new Map<string, { count: number; perfil: string; score: number }>()
  if (assessmentData) {
    for (const row of assessmentData) {
      assessmentMap.set(row.user_id, {
        count: (assessmentMap.get(row.user_id)?.count ?? 0) + 1,
        perfil: row.perfil,
        score: row.pontuacao_total,
      })
    }
  }

  // Fetch PDI data per user
  let pdiMap = new Map<string, number>()
  try {
    const { data: pdiData } = await supabase
      .from('leadership_pdi')
      .select('user_id')
    if (pdiData) {
      for (const row of pdiData) {
        pdiMap.set(row.user_id, (pdiMap.get(row.user_id) ?? 0) + 1)
      }
    }
  } catch {
    // Table may not exist
  }

  // Fetch executive assessment data per user
  let execMap = new Map<string, number>()
  try {
    const { data: execData } = await supabase
      .from('leadership_executive_assessments')
      .select('user_id')
    if (execData) {
      for (const row of execData) {
        execMap.set(row.user_id, (execMap.get(row.user_id) ?? 0) + 1)
      }
    }
  } catch {
    // Table may not exist
  }

  // Fetch gestor relationships
  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('aluno_user_id, company_name')

  const companyMap = new Map<string, string>()
  if (relationships) {
    for (const rel of relationships) {
      if (rel.company_name) companyMap.set(rel.aluno_user_id, rel.company_name)
    }
  }

  const totalProfiles = profiles?.length ?? 0
  const withAssessment = assessmentMap.size
  const withPdi = pdiMap.size
  const withExec = execMap.size

  const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
    admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
    hr_manager: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Gestor' },
    student: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Aluno' },
  }

  const perfilBadge: Record<string, { bg: string; text: string; label: string }> = {
    reativo: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reativo' },
    transicao: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Transicao' },
    lider_valor: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Lider de Valor' },
  }

  return (
    <div className="space-y-6">
      {/* Header — compact */}
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
          Gestao de pessoas
        </p>
        <h1 className="mt-1 font-heading text-2xl font-extrabold">Usuarios e Formularios</h1>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          Todos os perfis cadastrados com status de preenchimento de formularios.
        </p>
      </section>

      {/* KPIs — compact row */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Total</p>
          <p className="text-2xl font-extrabold text-[#0F172A]">{totalProfiles}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Autoavaliacao</p>
          <p className="text-2xl font-extrabold text-emerald-900">{withAssessment}</p>
        </article>
        <article className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">PDI</p>
          <p className="text-2xl font-extrabold text-purple-900">{withPdi}</p>
        </article>
        <article className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Exec.</p>
          <p className="text-2xl font-extrabold text-teal-900">{withExec}</p>
        </article>
      </section>

      {/* Table */}
      {!profiles || profiles.length === 0 ? (
        <p className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-8 text-center text-sm text-[#94A3B8]">
          Nenhum usuario cadastrado.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Auto
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    PDI
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Exec
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Perfil
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Score
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Acao
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {profiles.map((p) => {
                  const assessment = assessmentMap.get(p.id)
                  const hasPdi = pdiMap.has(p.id)
                  const hasExec = execMap.has(p.id)
                  const company = companyMap.get(p.id)
                  const role = roleBadge[p.role] ?? roleBadge.student
                  const perfil = assessment ? perfilBadge[assessment.perfil] : null

                  return (
                    <tr key={p.id} className="transition-colors hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/alunos/${p.id}`} className="flex items-center gap-3 group">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F6] text-xs font-bold text-[#64748B]">
                            {p.full_name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <span className="font-semibold text-[#111827] group-hover:text-[#1565C0]">
                            {p.full_name ?? 'Sem nome'}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">
                        {company || '--'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${role.bg} ${role.text}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {assessment ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {hasPdi ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {hasExec ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {perfil ? (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${perfil.bg} ${perfil.text}`}>
                            {perfil.label}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#CBD5E1]">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-[#334155]">
                        {assessment ? `${assessment.score} pts` : '--'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/alunos/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                        >
                          Ficha
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
