import { BadgeCheck, Building2, Clock3, FileText, Phone } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { createDraftProposal, updateLeadStatus } from './actions'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contato feito' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal_sent', label: 'Proposta enviada' },
  { value: 'won', label: 'Fechado (ganho)' },
  { value: 'lost', label: 'Perdido' },
] as const

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-sky-50 text-sky-700 border-sky-200',
  contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  qualified: 'bg-violet-50 text-violet-700 border-violet-200',
  proposal_sent: 'bg-amber-50 text-amber-700 border-amber-200',
  won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-rose-50 text-rose-700 border-rose-200',
}

type Lead = {
  id: string
  full_name: string
  company_name: string
  managers_range: string
  whatsapp: string
  email: string | null
  status: string
  created_at: string
}

type ProposalRow = {
  lead_id: string
}

export default async function AdminLeadsPage() {
  const supabase = await createClient()

  const { data: leadsData, error: leadsError } = await supabase
    .from('b2b_leads')
    .select('id, full_name, company_name, managers_range, whatsapp, email, status, created_at')
    .order('created_at', { ascending: false })

  if (leadsError) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Erro ao carregar leads: {leadsError.message}</div>
  }

  const leads = (Array.isArray(leadsData) ? leadsData : []) as Lead[]
  const leadIds = leads.map((lead) => lead.id)

  const proposalsByLead = new Map<string, number>()
  if (leadIds.length > 0) {
    const { data: proposals } = await supabase.from('proposals').select('lead_id').in('lead_id', leadIds)
    for (const row of (proposals ?? []) as ProposalRow[]) {
      proposalsByLead.set(row.lead_id, (proposalsByLead.get(row.lead_id) ?? 0) + 1)
    }
  }

  const totalLeads = leads.length
  const newLeads = leads.filter((lead) => lead.status === 'new').length
  const activePipeline = leads.filter((lead) => ['contacted', 'qualified', 'proposal_sent'].includes(lead.status)).length
  const wonLeads = leads.filter((lead) => lead.status === 'won').length

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Funil comercial</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Pipeline B2B da Lidera</h1>
          <p className="mt-4 text-sm text-[#A9BDD8]">Central de qualificação, negociação e proposta para oportunidades corporativas.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Leads totais</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{totalLeads}</p>
        </article>
        <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700">Novos</p>
          <p className="mt-2 text-3xl font-extrabold text-sky-900">{newLeads}</p>
        </article>
        <article className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">Em negociação</p>
          <p className="mt-2 text-3xl font-extrabold text-indigo-900">{activePipeline}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Fechados</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{wonLeads}</p>
        </article>
      </section>

      {leads.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center shadow-sm">
          <BadgeCheck className="mx-auto h-10 w-10 text-[#94A3B8]" />
          <h2 className="mt-4 text-xl font-extrabold text-[#0F172A]">Nenhum lead recebido ainda</h2>
          <p className="mt-2 text-sm text-[#64748B]">Os leads do formulário corporativo aparecerão aqui automaticamente.</p>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-[#D8E2EF] bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="border-b border-[#E5ECF6] bg-[#F7FAFE]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Lead</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Contato</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Propostas</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECF6]">
              {leads.map((lead) => {
                const createdAt = new Date(lead.created_at).toLocaleString('pt-BR')
                const badgeClass = STATUS_BADGE[lead.status] ?? 'bg-slate-50 text-slate-700 border-slate-200'
                const proposalCount = proposalsByLead.get(lead.id) ?? 0

                return (
                  <tr key={lead.id} className="transition-colors hover:bg-[#F9FBFE]">
                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-bold text-[#0F172A]">{lead.full_name}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-[#64748B]">
                        <Building2 className="h-4 w-4" />
                        {lead.company_name}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B]">{lead.managers_range}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Clock3 className="h-3.5 w-3.5" />
                        {createdAt}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top text-sm text-[#334155]">
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {lead.whatsapp}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B]">{lead.email || 'Sem e-mail informado'}</p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${badgeClass}`}>
                        {STATUS_OPTIONS.find((status) => status.value === lead.status)?.label || lead.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-[#D8E2EF] bg-[#F7FAFE] px-3 py-2 text-sm text-[#334155]">
                        <FileText className="h-4 w-4 text-[#64748B]" />
                        {proposalCount}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex min-w-[260px] flex-col gap-2">
                        <form action={updateLeadStatus} className="flex items-center gap-2">
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <select
                            name="status"
                            defaultValue={lead.status}
                            className="h-10 rounded-lg border border-[#D8E2EF] px-3 text-sm font-semibold text-[#334155] outline-none focus:border-[#1E88E5]"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="h-10 rounded-lg border border-[#D8E2EF] bg-white px-3 text-xs font-bold uppercase tracking-[0.12em] text-[#334155] hover:bg-[#F7FAFE]"
                          >
                            Salvar
                          </button>
                        </form>

                        <form action={createDraftProposal}>
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <input type="hidden" name="company_name" value={lead.company_name} />
                          <button
                            type="submit"
                            className="h-10 rounded-lg bg-[#1E88E5] px-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#1565C0]"
                          >
                            Criar proposta rascunho
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
