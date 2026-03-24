import Link from 'next/link'
import {
  ArrowRight,
  DollarSign,
  Flame,
  Linkedin,
  Target,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'

import { getCrmDashboardData } from '@/lib/actions/crm'

const PIPELINE_LABELS: Record<string, string> = {
  prospecting: 'Prospecção',
  first_contact: '1º Contato',
  qualification: 'Qualificação',
  meeting: 'Reunião',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganho',
  lost: 'Perdido',
}

const STAGE_COLORS: Record<string, string> = {
  prospecting: 'from-slate-500 to-slate-600',
  first_contact: 'from-sky-500 to-sky-600',
  qualification: 'from-indigo-500 to-indigo-600',
  meeting: 'from-violet-500 to-violet-600',
  proposal: 'from-amber-500 to-amber-600',
  negotiation: 'from-orange-500 to-orange-600',
  won: 'from-emerald-500 to-emerald-600',
  lost: 'from-rose-500 to-rose-600',
}

const TEMP_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  cold: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700', icon: '❄️' },
  warm: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: '🔥' },
  hot: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: '🔥🔥' },
}

export default async function CrmDashboardPage() {
  const { leads, prospects, scores, activities, proposals } = await getCrmDashboardData()

  const totalProspects = prospects.length
  const activeProspects = prospects.filter((p) => !['converted', 'not_interested'].includes(p.outreach_status)).length
  const convertedProspects = prospects.filter((p) => p.outreach_status === 'converted').length
  const conversionRate = totalProspects > 0 ? Math.round((convertedProspects / totalProspects) * 100) : 0

  const totalLeads = leads.length
  const qualifiedLeads = scores.filter((s) => s.qualification_status === 'qualified').length
  const hotLeads = leads.filter((l) => l.temperature === 'hot').length
  const wonLeads = leads.filter((l) => l.pipeline_stage === 'won').length

  const totalPipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.pipeline_stage))
    .reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  const wonValue = leads
    .filter((l) => l.pipeline_stage === 'won')
    .reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  const stageGroups = new Map<string, typeof leads>()
  for (const stage of Object.keys(PIPELINE_LABELS)) {
    stageGroups.set(stage, leads.filter((l) => l.pipeline_stage === stage))
  }

  const funnelStages = ['prospecting', 'first_contact', 'qualification', 'meeting', 'proposal', 'negotiation']
  const maxStageCount = Math.max(1, ...funnelStages.map((s) => stageGroups.get(s)?.length ?? 0))

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-violet-600/10 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">CRM Lidera</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Central de Vendas
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
            Pipeline completo — da prospecção LinkedIn ao fechamento. SDR, Closer e funil de vendas em um único painel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/crm/sdr"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
            >
              <Linkedin className="h-4 w-4" />
              SDR Workspace
            </Link>
            <Link
              href="/admin/crm/closer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#35517A] px-5 py-3 text-sm font-bold text-[#D0E1F4] transition-colors hover:border-[#4E78AF] hover:text-white"
            >
              <Target className="h-4 w-4" />
              Closer
            </Link>
            <Link
              href="/admin/crm/funil"
              className="inline-flex items-center gap-2 rounded-xl border border-[#35517A] px-5 py-3 text-sm font-bold text-[#D0E1F4] transition-colors hover:border-[#4E78AF] hover:text-white"
            >
              <TrendingUp className="h-4 w-4" />
              Funil Visual
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <UserPlus className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Prospects</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{totalProspects}</p>
          <p className="mt-1 text-xs text-[#64748B]">{activeProspects} ativos • {conversionRate}% conversão</p>
        </article>

        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Leads</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{totalLeads}</p>
          <p className="mt-1 text-xs text-[#64748B]">{qualifiedLeads} qualificados • {hotLeads} hot</p>
        </article>

        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Fechados</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{wonLeads}</p>
          <p className="mt-1 text-xs text-[#64748B]">
            {wonValue > 0 ? `R$ ${wonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sem valor estimado'}
          </p>
        </article>

        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <DollarSign className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Pipeline</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">
            {totalPipelineValue > 0
              ? `R$ ${(totalPipelineValue / 1000).toFixed(0)}k`
              : '—'}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">{proposals.length} propostas criadas</p>
        </article>
      </section>

      {/* Visual Funnel */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Funil de vendas</p>
            <p className="mt-1 text-sm text-[#64748B]">Distribuição por estágio do pipeline</p>
          </div>
          <Link
            href="/admin/crm/funil"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E88E5] hover:underline"
          >
            Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {funnelStages.map((stage) => {
            const count = stageGroups.get(stage)?.length ?? 0
            const widthPercent = Math.max(20, (count / maxStageCount) * 100)

            return (
              <div key={stage} className="w-full" style={{ maxWidth: `${widthPercent}%`, minWidth: '180px' }}>
                <div
                  className={`relative mx-auto flex items-center justify-between rounded-xl bg-gradient-to-r px-4 py-3 text-white ${STAGE_COLORS[stage]}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">{PIPELINE_LABELS[stage]}</span>
                  <span className="text-lg font-extrabold">{count}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Ganhos</span>
            <span className="text-lg font-extrabold text-emerald-800">{stageGroups.get('won')?.length ?? 0}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-rose-700">Perdidos</span>
            <span className="text-lg font-extrabold text-rose-800">{stageGroups.get('lost')?.length ?? 0}</span>
          </div>
        </div>
      </section>

      {/* Two-column: Hot Leads + Activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Hot Leads */}
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-4.5 w-4.5 text-orange-500" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Leads quentes</p>
          </div>

          <div className="mt-4 space-y-3">
            {leads
              .filter((l) => l.temperature === 'hot' || l.pipeline_stage === 'proposal' || l.pipeline_stage === 'negotiation')
              .slice(0, 6)
              .map((lead) => {
                const temp = TEMP_CONFIG[lead.temperature] ?? TEMP_CONFIG.cold

                return (
                  <div key={lead.id} className="flex items-center justify-between rounded-xl border border-[#E5ECF6] bg-[#FAFCFF] px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0F172A]">{lead.full_name}</p>
                      <p className="text-xs text-[#64748B]">{lead.company_name}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${temp.bg} ${temp.text}`}>
                        {temp.icon} {lead.temperature}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">
                        {PIPELINE_LABELS[lead.pipeline_stage]}
                      </span>
                    </div>
                  </div>
                )
              })}

            {leads.filter((l) => l.temperature === 'hot').length === 0 && (
              <p className="py-4 text-center text-sm text-[#94A3B8]">Nenhum lead quente no momento</p>
            )}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-violet-500" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Atividade recente</p>
          </div>

          <div className="mt-4 space-y-3">
            {activities.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-[#E5ECF6] bg-[#FAFCFF] px-4 py-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1E88E5]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A]">{activity.title}</p>
                  {activity.description && (
                    <p className="mt-0.5 truncate text-xs text-[#64748B]">{activity.description}</p>
                  )}
                  <p className="mt-1 text-[10px] text-[#94A3B8]">
                    {new Date(activity.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="py-4 text-center text-sm text-[#94A3B8]">Nenhuma atividade registrada</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
