import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  DollarSign,
  Phone,
  TrendingUp,
} from 'lucide-react'

import { getCrmDashboardData, updateLeadPipeline } from '@/lib/actions/crm'

const FUNNEL_STAGES = [
  { key: 'prospecting', label: 'Prospecção', color: 'border-t-slate-400', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-700' },
  { key: 'first_contact', label: '1º Contato', color: 'border-t-sky-400', bg: 'bg-sky-50', badge: 'bg-sky-100 text-sky-700' },
  { key: 'qualification', label: 'Qualificação', color: 'border-t-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700' },
  { key: 'meeting', label: 'Reunião', color: 'border-t-violet-400', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700' },
  { key: 'proposal', label: 'Proposta', color: 'border-t-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  { key: 'negotiation', label: 'Negociação', color: 'border-t-orange-400', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  { key: 'won', label: 'Fechado ✓', color: 'border-t-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  { key: 'lost', label: 'Perdido ✗', color: 'border-t-rose-400', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700' },
] as const

const TEMP_ICONS: Record<string, string> = {
  cold: '❄️',
  warm: '🔥',
  hot: '🔥🔥',
}

const ALL_STAGES = FUNNEL_STAGES.map((s) => s.key)

export default async function FunilPage() {
  const { leads, scores } = await getCrmDashboardData()

  const scoresByLead = new Map(scores.map((s) => [s.lead_id, s]))

  const stageGroups = new Map<string, typeof leads>()
  for (const stage of ALL_STAGES) {
    stageGroups.set(stage, leads.filter((l) => l.pipeline_stage === stage))
  }

  const activeStages = FUNNEL_STAGES.filter((s) => !['won', 'lost'].includes(s.key))
  const pipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.pipeline_stage))
    .reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  const wonValue = leads
    .filter((l) => l.pipeline_stage === 'won')
    .reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  const totalActive = leads.filter((l) => !['won', 'lost'].includes(l.pipeline_stage)).length
  const now = new Date()
  const avgDaysInPipeline = leads.length > 0
    ? Math.round(
        leads
          .filter((l) => !['won', 'lost'].includes(l.pipeline_stage))
          .reduce((acc, l) => {
            const days = Math.round((now.getTime() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24))
            return acc + days
          }, 0) / Math.max(1, totalActive)
      )
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <TrendingUp className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Pipeline Visual</p>
              <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
                Funil de Vendas
              </h1>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Deals ativos</p>
              <p className="mt-1 text-xl font-extrabold text-white">{totalActive}</p>
            </article>
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Pipeline</p>
              <p className="mt-1 text-xl font-extrabold text-white">
                {pipelineValue > 0 ? `R$ ${(pipelineValue / 1000).toFixed(0)}k` : '—'}
              </p>
            </article>
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Receita fechada</p>
              <p className="mt-1 text-xl font-extrabold text-white">
                {wonValue > 0 ? `R$ ${(wonValue / 1000).toFixed(0)}k` : '—'}
              </p>
            </article>
            <article className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">Tempo médio</p>
              <p className="mt-1 text-xl font-extrabold text-white">{avgDaysInPipeline}d</p>
            </article>
          </div>

          <div className="mt-4">
            <Link
              href="/admin/crm"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#8CB8E7] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao CRM
            </Link>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: `${FUNNEL_STAGES.length * 280}px` }}>
          {FUNNEL_STAGES.map((stage) => {
            const stageLeads = stageGroups.get(stage.key) ?? []
            const stageValue = stageLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0)

            return (
              <div key={stage.key} className="w-[280px] shrink-0">
                {/* Stage Header */}
                <div className={`rounded-t-xl border-t-4 ${stage.color} border border-b-0 border-[#D8E2EF] bg-white px-4 py-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold ${stage.badge}`}>
                        {stageLeads.length}
                      </span>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#334155]">{stage.label}</p>
                    </div>
                    {stageValue > 0 && (
                      <span className="text-[10px] font-bold text-[#64748B]">
                        R$ {stageValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div className={`min-h-[200px] space-y-2 rounded-b-xl border border-t-0 border-[#D8E2EF] ${stage.bg} p-2`}>
                  {stageLeads.length === 0 && (
                    <div className="flex h-[180px] items-center justify-center">
                      <p className="text-xs text-[#94A3B8]">Nenhum deal</p>
                    </div>
                  )}

                  {stageLeads.map((lead) => {
                    const score = scoresByLead.get(lead.id)
                    const daysSinceCreated = Math.round(
                      (now.getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
                    )

                    return (
                      <div key={lead.id} className="rounded-xl border border-[#D8E2EF] bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-[#0F172A]">{lead.full_name}</p>
                          <span className="text-[10px]">{TEMP_ICONS[lead.temperature] ?? ''}</span>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#64748B]">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{lead.company_name}</span>
                        </div>

                        {lead.whatsapp && lead.whatsapp !== 'Não informado' && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#94A3B8]">
                            <Phone className="h-3 w-3" />
                            <span>{lead.whatsapp}</span>
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {lead.estimated_value && lead.estimated_value > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              <DollarSign className="h-2.5 w-2.5" />
                              {lead.estimated_value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                            </span>
                          )}

                          {score && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                              BANT: {score.total_score}/20
                            </span>
                          )}

                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-[#64748B]">
                            {daysSinceCreated}d
                          </span>
                        </div>

                        {lead.next_action && (
                          <div className="mt-2 flex items-center gap-1 rounded-lg bg-[#F7FAFE] px-2 py-1 text-[10px] text-[#334155]">
                            <CalendarClock className="h-3 w-3 text-[#1E88E5]" />
                            <span className="truncate">{lead.next_action}</span>
                          </div>
                        )}

                        {/* Move buttons */}
                        {!['won', 'lost'].includes(stage.key) && (
                          <div className="mt-2 flex gap-1">
                            <form action={updateLeadPipeline} className="flex-1">
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <input type="hidden" name="temperature" value={lead.temperature} />
                              {(() => {
                                const currentIdx = ALL_STAGES.indexOf(stage.key)
                                const nextStage = ALL_STAGES[currentIdx + 1]
                                if (!nextStage || nextStage === 'lost') return null
                                return (
                                  <>
                                    <input type="hidden" name="pipeline_stage" value={nextStage} />
                                    <button
                                      type="submit"
                                      className="h-7 w-full rounded-lg bg-[#1E88E5] text-[10px] font-bold text-white hover:bg-[#1565C0]"
                                    >
                                      Avançar →
                                    </button>
                                  </>
                                )
                              })()}
                            </form>
                            <form action={updateLeadPipeline}>
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <input type="hidden" name="pipeline_stage" value="lost" />
                              <input type="hidden" name="temperature" value="cold" />
                              <button
                                type="submit"
                                className="h-7 rounded-lg border border-rose-200 bg-rose-50 px-2 text-[10px] font-bold text-rose-600 hover:bg-rose-100"
                              >
                                ✗
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Conversion Metrics */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Métricas de conversão</p>
        <div className="mt-4 overflow-x-auto">
          <div className="flex items-end gap-1">
            {activeStages.map((stage) => {
              const count = stageGroups.get(stage.key)?.length ?? 0
              const maxCount = Math.max(1, ...activeStages.map((s) => stageGroups.get(s.key)?.length ?? 0))
              const height = Math.max(24, (count / maxCount) * 160)

              return (
                <div key={stage.key} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-extrabold text-[#0F172A]">{count}</span>
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t ${stage.key === 'prospecting' ? 'from-slate-300 to-slate-400' : stage.key === 'first_contact' ? 'from-sky-300 to-sky-400' : stage.key === 'qualification' ? 'from-indigo-300 to-indigo-400' : stage.key === 'meeting' ? 'from-violet-300 to-violet-400' : stage.key === 'proposal' ? 'from-amber-300 to-amber-400' : 'from-orange-300 to-orange-400'}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-center text-[9px] font-bold uppercase text-[#64748B]">{stage.label}</span>
                </div>
              )
            })}
          </div>

          {/* Conversion arrows */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {activeStages.slice(0, -1).map((stage, idx) => {
              const current = stageGroups.get(stage.key)?.length ?? 0
              const next = stageGroups.get(activeStages[idx + 1].key)?.length ?? 0
              const rate = current > 0 ? Math.round((next / current) * 100) : 0

              return (
                <div key={stage.key} className="flex items-center gap-1">
                  <span className="rounded bg-[#F0F4FA] px-1.5 py-0.5 text-[10px] font-bold text-[#334155]">
                    {rate}%
                  </span>
                  {idx < activeStages.length - 2 && <span className="text-[10px] text-[#94A3B8]">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
