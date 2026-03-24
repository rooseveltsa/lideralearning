import Link from 'next/link'
import { ChevronRight, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function AdminAlunosPage() {
  const supabase = await createClient()

  // Fetch students
  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .in('role', ['student', 'hr_manager'])
    .order('created_at', { ascending: false })

  // Fetch self-assessment counts per user
  const { data: assessmentData } = await supabase
    .from('leadership_self_assessments')
    .select('user_id, perfil')

  const assessmentMap = new Map<string, { count: number; perfil: string }>()
  if (assessmentData) {
    for (const row of assessmentData) {
      assessmentMap.set(row.user_id, {
        count: (assessmentMap.get(row.user_id)?.count ?? 0) + 1,
        perfil: row.perfil,
      })
    }
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Gestão de pessoas
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Alunos e Supervisores
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Acesse a ficha completa de cada aluno: formulários, turmas presenciais,
            mentorias e progresso nos cursos online.
          </p>
        </div>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Total cadastrados
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{students?.length ?? 0}</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            Com autoavaliação
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{assessmentMap.size}</p>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Vinculados a empresa
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-900">{companyMap.size}</p>
        </article>
      </section>

      {/* Table */}
      {!students || students.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <span className="text-4xl">👨‍🎓</span>
          </div>
          <h3 className="mb-2 font-heading text-xl font-extrabold text-[#111827]">
            Nenhum aluno encontrado
          </h3>
          <p className="font-medium text-[#64748B]">
            Os alunos cadastrados aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Perfil
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {students.map((student) => {
                  const assessment = assessmentMap.get(student.id)
                  const company = companyMap.get(student.id)
                  const perfilColors: Record<string, { bg: string; text: string; label: string }> = {
                    reativo: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reativo' },
                    transicao: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Em Transição' },
                    lider_valor: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Líder de Valor' },
                  }
                  const perfil = assessment ? perfilColors[assessment.perfil] : null

                  return (
                    <tr key={student.id} className="transition-colors hover:bg-[#F8FAFC]">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#EEF2F6] text-lg font-bold text-[#64748B] shadow-sm">
                            {student.full_name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <span className="text-base font-bold text-[#111827]">
                            {student.full_name ?? 'Sem nome'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#334155]">
                        {company || '—'}
                      </td>
                      <td className="px-6 py-5">
                        {perfil ? (
                          <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${perfil.bg} ${perfil.text}`}>
                            {perfil.label}
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">Pendente</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                          student.role === 'hr_manager'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {student.role === 'hr_manager' ? 'Gestor' : 'Aluno'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#64748B]">
                        {new Date(student.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/alunos/${student.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                        >
                          Ver ficha
                          <ChevronRight className="h-3.5 w-3.5" />
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
