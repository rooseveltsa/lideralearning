import Link from 'next/link'
import {
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react'

import { classificarUsuario, getInscritos } from '@/lib/actions/inscritos'

type FilterTab = 'todos' | 'leads' | 'alunos' | 'gestores'

export default async function AdminInscritosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const activeTab = (params.tab as FilterTab) || 'todos'
  const inscritos = await getInscritos()

  // Filter by tab
  const filtered = inscritos.filter((u) => {
    if (activeTab === 'leads') return u.role === 'student' && u.source === 'site'
    if (activeTab === 'alunos') return u.role === 'student' && u.source !== 'site'
    if (activeTab === 'gestores') return u.role === 'hr_manager'
    return true
  })

  // Stats
  const totalCount = inscritos.length
  const leadsCount = inscritos.filter((u) => u.role === 'student' && u.source === 'site').length
  const studentsCount = inscritos.filter((u) => u.role === 'student' && u.source !== 'site').length
  const managersCount = inscritos.filter((u) => u.role === 'hr_manager').length

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: totalCount },
    { key: 'leads', label: 'Leads (site)', count: leadsCount },
    { key: 'alunos', label: 'Alunos (presencial)', count: studentsCount },
    { key: 'gestores', label: 'Gestores', count: managersCount },
  ]

  const sourceBadge: Record<string, { bg: string; text: string; label: string }> = {
    site: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Site' },
    presencial: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Presencial' },
    admin: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Admin' },
  }

  const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
    admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
    hr_manager: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Gestor' },
    student: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Aluno' },
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-[#8CB8E7]" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
              Gestao de leads
            </p>
            <h1 className="font-heading text-2xl font-extrabold">
              Inscritos e Leads{' '}
              <span className="text-base font-medium text-[#5A7A9E]">({totalCount})</span>
            </h1>
          </div>
        </div>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          Todos que se cadastraram no site, com status de formularios e classificacao.
        </p>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Total</p>
          <p className="text-2xl font-extrabold text-[#0F172A]">{totalCount}</p>
        </article>
        <article className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Leads Site</p>
          <p className="text-2xl font-extrabold text-blue-900">{leadsCount}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Alunos</p>
          <p className="text-2xl font-extrabold text-emerald-900">{studentsCount}</p>
        </article>
        <article className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Gestores</p>
          <p className="text-2xl font-extrabold text-purple-900">{managersCount}</p>
        </article>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/inscritos${tab.key === 'todos' ? '' : `?tab=${tab.key}`}`}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#334155]'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-1 text-[10px] opacity-60">{tab.count}</span>
          </Link>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8E2EF] bg-white py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <p className="mt-3 text-sm font-bold text-[#0F172A]">Nenhum inscrito encontrado</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Novos cadastros aparecerao aqui automaticamente.
          </p>
        </div>
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
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Origem
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Auto
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Exec
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    PDI
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Classificacao
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((u) => {
                  const source = sourceBadge[u.source] ?? sourceBadge.site
                  const role = roleBadge[u.role] ?? roleBadge.student
                  const whatsappLink = u.whatsapp
                    ? `https://wa.me/${u.whatsapp.replace(/\D/g, '')}`
                    : null

                  return (
                    <tr key={u.id} className="transition-colors hover:bg-[#F8FAFC]">
                      {/* Nome */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/alunos/${u.id}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F6] text-xs font-bold text-[#64748B]">
                            {u.full_name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <span className="font-semibold text-[#111827] group-hover:text-[#1565C0]">
                            {u.full_name ?? 'Sem nome'}
                          </span>
                        </Link>
                      </td>

                      {/* Email */}
                      <td className="max-w-[180px] truncate px-4 py-3 text-xs text-[#64748B]">
                        {u.email}
                      </td>

                      {/* Empresa */}
                      <td className="px-4 py-3 text-xs text-[#64748B]">
                        {u.company || '--'}
                      </td>

                      {/* Origem */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${source.bg} ${source.text}`}
                        >
                          {source.label}
                        </span>
                      </td>

                      {/* Auto */}
                      <td className="px-4 py-3 text-center">
                        {u.hasAutoavaliacao ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>

                      {/* Exec */}
                      <td className="px-4 py-3 text-center">
                        {u.hasExec ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>

                      {/* PDI */}
                      <td className="px-4 py-3 text-center">
                        {u.hasPdi ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </td>

                      {/* Classificacao inline form */}
                      <td className="px-4 py-3">
                        <form action={classificarUsuario} className="flex items-center gap-1.5">
                          <input type="hidden" name="userId" value={u.id} />
                          <select
                            name="role"
                            defaultValue={u.role}
                            className="rounded-md border border-[#D8E2EF] bg-white px-2 py-1 text-[11px] font-medium text-[#334155] focus:border-[#1565C0] focus:outline-none"
                          >
                            <option value="student">Aluno</option>
                            <option value="hr_manager">Gestor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            type="submit"
                            className="rounded-md bg-[#1565C0] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0B4A8F]"
                          >
                            OK
                          </button>
                        </form>
                        <span
                          className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${role.bg} ${role.text}`}
                        >
                          {role.label}
                        </span>
                      </td>

                      {/* Acoes */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 transition-colors hover:bg-emerald-100"
                              title="WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <Link
                            href={`/admin/alunos/${u.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                          >
                            Ficha
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
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
