import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Flame,
  Phone,
  Target,
} from 'lucide-react'

import { addActivity, getLeadsForCloser, qualifyLead, updateLeadPipeline } from '@/lib/actions/crm'

const PIPELINE_STAGES = [
  { value: 'prospecting', label: 'Prospecção' },
  { value: 'first_contact', label: '1º Contato' },
  { value: 'qualification', label: 'Qualificação' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
] as const

const TEMPERATURES = [
  { value: 'cold', label: 'Frio', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: '❄️' },
  { value: 'warm', label: 'Morno', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🔥' },
  { value: 'hot', label: 'Quente', color: 'bg-red-50 text-red-700 border-red-200', icon: '🔥🔥' },
] as const

const BANT_LABELS = {
  budget: { label: 'Budget', description: 'Tem orçamento disponível para investir em treinamento?' },
  authority: { label: 'Authority', description: 'É o decisor ou tem acesso direto a quem decide?' },
  need: { label: 'Need', description: 'Tem necessidade real e reconhecida de desenvolvimento?' },
  timeline: { label: 'Timeline', description: 'Tem prazo definido para implementar?' },
}

export default async function CloserWorkspacePage() {
  const { leads, scores, activities } = await getLeadsForCloser()

  const scoresByLead = new Map(scores.map((s) => [s.lead_id, s]))
  const activitiesByLead = new Map<string, typeof activities>()
  for (const a of activities) {
    if (!a.lead_id) continue
    const list = activitiesByLead.get(a.lead_id) ?? []
    list.push(a)
    activitiesByLead.set(a.lead_id, list)
  }

  const pendingLeads = leads.filter((l) => !scoresByLead.has(l.id) || scoresByLead.get(l.id)?.qualification_status === 'pending')
  const qualifiedLeads = leads.filter((l) => scoresByLead.get(l.id)?.qualification_status === 'qualified')
  const nurturingLeads = leads.filter((l) => scoresByLead.get(l.id)?.qualification_status === 'nurturing')

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-[90px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
              <Target className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Closer Workspace</p>
              <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
                Qualificação de Leads
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
            Aplique scoring BANT, qualifique leads e avance no pipeline. Cada lead precisa ser classificado antes de receber proposta.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Aguardando qualificação</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-900">{pendingLeads.length}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Qualificados</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{qualifiedLeads.length}</p>
        </article>
        <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">Nurturing</p>
          <p className="mt-2 text-3xl font-extrabold text-violet-900">{nurturingLeads.length}</p>
        </article>
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total no pipeline</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{leads.length}</p>
        </article>
      </section>

      {/* Pending Qualification */}
      {pendingLeads.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            <h2 className="text-lg font-extrabold text-[#0F172A]">Leads aguardando qualificação</h2>
          </div>

          <div className="space-y-4">
            {pendingLeads.map((lead) => {
              const existing = scoresByLead.get(lead.id)
              const leadActivities = activitiesByLead.get(lead.id) ?? []

              return (
                <article key={lead.id} className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Lead Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B4A8F]/10 text-sm font-bold text-[#0B4A8F]">
                          {lead.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-base font-bold text-[#0F172A]">{lead.full_name}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-[#64748B]">
                            <Building2 className="h-3.5 w-3.5" /> {lead.company_name}
                            <span>•</span>
                            <Phone className="h-3.5 w-3.5" /> {lead.whatsapp}
                          </div>
                        </div>
                      </div>

                      {lead.notes && (
                        <p className="mt-2 rounded-lg bg-[#F7FAFE] px-3 py-2 text-xs text-[#334155]">{lead.notes}</p>
                      )}

                      {/* Activity Timeline */}
                      {leadActivities.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">Histórico</p>
                          {leadActivities.slice(0, 3).map((a) => (
                            <div key={a.id} className="flex items-center gap-2 text-xs text-[#64748B]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#1E88E5]" />
                              <span className="font-semibold">{a.title}</span>
                              <span className="text-[10px]">{new Date(a.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* BANT Qualification Form */}
                    <div className="w-full rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] p-4 lg:w-[400px]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B4A8F]">Scoring BANT</p>

                      <form action={qualifyLead} className="mt-3 space-y-3">
                        <input type="hidden" name="lead_id" value={lead.id} />

                        {Object.entries(BANT_LABELS).map(([key, { label, description }]) => (
                          <div key={key}>
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-[#334155]">{label}</label>
                              <p className="text-[10px] text-[#94A3B8]">{description}</p>
                            </div>
                            <div className="mt-1 flex gap-1">
                              {[0, 1, 2, 3, 4, 5].map((score) => (
                                <label key={score} className="relative">
                                  <input
                                    type="radio"
                                    name={`${key}_score`}
                                    value={score}
                                    defaultChecked={existing ? (existing as unknown as Record<string, number>)[`${key}_score`] === score : score === 0}
                                    className="peer sr-only"
                                  />
                                  <span className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#D8E2EF] bg-white text-xs font-bold text-[#64748B] transition-all peer-checked:border-[#1E88E5] peer-checked:bg-[#1E88E5] peer-checked:text-white">
                                    {score}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <textarea
                          name="closer_notes"
                          placeholder="Observações do closer..."
                          defaultValue={existing?.closer_notes ?? ''}
                          rows={2}
                          className="w-full rounded-xl border border-[#D8E2EF] bg-white px-3 py-2 text-xs text-[#334155] outline-none focus:border-[#1E88E5]"
                        />

                        <button
                          type="submit"
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1E88E5] text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          Qualificar lead
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Qualified Leads */}
      {qualifiedLeads.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
            <h2 className="text-lg font-extrabold text-[#0F172A]">Leads qualificados</h2>
          </div>

          <div className="space-y-3">
            {qualifiedLeads.map((lead) => {
              const score = scoresByLead.get(lead.id)
              const tempConfig = TEMPERATURES.find((t) => t.value === lead.temperature)

              return (
                <article key={lead.id} className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                        {score?.total_score ?? 0}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{lead.full_name}</p>
                        <p className="text-xs text-[#64748B]">{lead.company_name} • {lead.managers_range}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {tempConfig && (
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${tempConfig.color}`}>
                          {tempConfig.icon} {tempConfig.label}
                        </span>
                      )}
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        BANT: {score?.total_score ?? 0}/20
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">
                        {PIPELINE_STAGES.find((s) => s.value === lead.pipeline_stage)?.label}
                      </span>

                      <form action={updateLeadPipeline} className="flex items-center gap-1">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="temperature" value={lead.temperature} />
                        <select
                          name="pipeline_stage"
                          defaultValue={lead.pipeline_stage}
                          className="h-8 rounded-lg border border-[#D8E2EF] px-2 text-[11px] font-semibold text-[#334155] outline-none"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <button type="submit" className="h-8 rounded-lg border border-[#D8E2EF] bg-white px-2 text-[10px] font-bold uppercase text-[#334155] hover:bg-slate-50">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Nurturing */}
      {nurturingLeads.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-4.5 w-4.5 text-amber-500" />
            <h2 className="text-lg font-extrabold text-[#0F172A]">Nurturing (em aquecimento)</h2>
          </div>

          <div className="space-y-3">
            {nurturingLeads.map((lead) => {
              const score = scoresByLead.get(lead.id)

              return (
                <article key={lead.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
                        {score?.total_score ?? 0}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{lead.full_name}</p>
                        <p className="text-xs text-[#64748B]">{lead.company_name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        BANT: {score?.total_score ?? 0}/20
                      </span>

                      <form action={addActivity} className="flex items-center gap-1">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="activity_type" value="note" />
                        <input
                          name="title"
                          placeholder="Adicionar nota..."
                          className="h-8 w-48 rounded-lg border border-[#D8E2EF] px-2 text-[11px] text-[#334155] outline-none"
                        />
                        <button type="submit" className="h-8 rounded-lg bg-amber-500 px-3 text-[10px] font-bold uppercase text-white hover:bg-amber-600">
                          Salvar
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Empty */}
      {leads.length === 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-10 w-10 text-[#94A3B8]" />
          <h2 className="mt-4 text-xl font-extrabold text-[#0F172A]">Nenhum lead no pipeline</h2>
          <p className="mt-2 text-sm text-[#64748B]">Converta prospects do SDR ou aguarde leads do formulário B2B.</p>
        </section>
      )}
    </div>
  )
}
