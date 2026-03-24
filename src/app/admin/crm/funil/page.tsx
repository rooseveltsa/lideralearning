import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Plus,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import { getCrmDashboardData } from '@/lib/actions/crm'

const FUNNEL_STAGES = [
  { key: 'prospecting', label: 'Lead', color: '#64748b' },
  { key: 'first_contact', label: '1o Contato', color: '#0ea5e9' },
  { key: 'qualification', label: 'Qualificacao', color: '#6366f1' },
  { key: 'meeting', label: 'Reuniao', color: '#8b5cf6' },
  { key: 'proposal', label: 'Proposta', color: '#F57C00' },
  { key: 'negotiation', label: 'Negociacao', color: '#1565C0' },
] as const

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

export default async function FunilPage() {
  const { leads } = await getCrmDashboardData()

  const totalLeads = leads.length
  const wonLeads = leads.filter((l) => l.pipeline_stage === 'won')
  const lostLeads = leads.filter((l) => l.pipeline_stage === 'lost')
  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.pipeline_stage))

  const wonValue = wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const pipelineValue = activeLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const avgDealValue = wonLeads.length > 0
    ? wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0) / wonLeads.length
    : 0

  const now = Date.now()
  const avgTimeToClose = wonLeads.length > 0
    ? Math.round(
        wonLeads.reduce((a, l) => {
          return a + (new Date(l.updated_at).getTime() - new Date(l.created_at).getTime()) / 86400000
        }, 0) / wonLeads.length
      )
    : 0

  // Stage counts
  const stageCounts = new Map<string, number>()
  for (const lead of leads) {
    const count = stageCounts.get(lead.pipeline_stage) ?? 0
    stageCounts.set(lead.pipeline_stage, count + 1)
  }

  const maxFunnelCount = Math.max(1, ...FUNNEL_STAGES.map((s) => stageCounts.get(s.key) ?? 0))

  // Conversion rates between stages
  const conversions = FUNNEL_STAGES.slice(0, -1).map((stage, idx) => {
    const current = stageCounts.get(stage.key) ?? 0
    const next = stageCounts.get(FUNNEL_STAGES[idx + 1].key) ?? 0
    // Include all stages ahead to compute "passed through" rate
    const passed = FUNNEL_STAGES.slice(idx + 1).reduce((a, s) => a + (stageCounts.get(s.key) ?? 0), 0)
      + wonLeads.length + lostLeads.length
    const total = current + passed
    return {
      from: stage.label,
      to: FUNNEL_STAGES[idx + 1].label,
      rate: total > 0 ? Math.round((passed / total) * 100) : 0,
    }
  })

  const overallWinRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0

  // No data state
  if (totalLeads === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/crm" className="text-[#64748b] hover:text-[#0f172a]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-[#0f172a]">Funil de Vendas</h1>
        </div>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-12 py-16 text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-[#94a3b8]" />
            <h2 className="mt-4 text-lg font-bold text-[#0f172a]">Sem dados ainda</h2>
            <p className="mt-1 text-sm text-[#64748b]">Adicione leads ao pipeline para visualizar o funil.</p>
            <Link
              href="/admin/crm"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d47a1]"
            >
              <Plus className="h-4 w-4" />
              Ir para o pipeline
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/crm" className="text-[#64748b] hover:text-[#0f172a]">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-[#0f172a]">Funil de Vendas</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard icon={<Users className="h-4 w-4" />} label="Total leads" value={String(totalLeads)} color="#1565C0" />
        <KpiCard icon={<Target className="h-4 w-4" />} label="Propostas" value={String(stageCounts.get('proposal') ?? 0)} color="#F57C00" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Ganhos" value={`${wonLeads.length} (${overallWinRate}%)`} color="#16a34a" />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} label="Ticket medio" value={avgDealValue > 0 ? formatCurrency(avgDealValue) : '--'} color="#7c3aed" />
        <KpiCard icon={<Clock className="h-4 w-4" />} label="Tempo medio" value={avgTimeToClose > 0 ? `${avgTimeToClose}d` : '--'} color="#0891b2" />
      </div>

      {/* Funnel visualization */}
      <div className="rounded-lg border border-[#e2e8f0] bg-white p-5">
        <h2 className="text-sm font-bold text-[#0f172a]">Pipeline por estagio</h2>
        <div className="mt-4 space-y-2">
          {FUNNEL_STAGES.map((stage) => {
            const count = stageCounts.get(stage.key) ?? 0
            const widthPercent = Math.max(8, (count / maxFunnelCount) * 100)

            return (
              <div key={stage.key} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-right text-xs font-medium text-[#64748b]">{stage.label}</span>
                <div className="relative h-8 flex-1">
                  <div
                    className="flex h-full items-center rounded-r-md px-3"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: stage.color,
                      minWidth: '40px',
                    }}
                  >
                    <span className="text-xs font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {/* Won/Lost */}
          <div className="mt-1 flex items-center gap-3">
            <span className="w-24 shrink-0 text-right text-xs font-medium text-[#16a34a]">Ganhos</span>
            <div className="relative h-8 flex-1">
              <div
                className="flex h-full items-center rounded-r-md bg-[#16a34a] px-3"
                style={{
                  width: `${Math.max(8, (wonLeads.length / maxFunnelCount) * 100)}%`,
                  minWidth: '40px',
                }}
              >
                <span className="text-xs font-bold text-white">{wonLeads.length}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-right text-xs font-medium text-[#dc2626]">Perdidos</span>
            <div className="relative h-8 flex-1">
              <div
                className="flex h-full items-center rounded-r-md bg-[#dc2626] px-3"
                style={{
                  width: `${Math.max(8, (lostLeads.length / maxFunnelCount) * 100)}%`,
                  minWidth: '40px',
                }}
              >
                <span className="text-xs font-bold text-white">{lostLeads.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion rates */}
      <div className="rounded-lg border border-[#e2e8f0] bg-white p-5">
        <h2 className="text-sm font-bold text-[#0f172a]">Taxa de conversao entre estagios</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {conversions.map((c, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="rounded bg-[#f1f5f9] px-2 py-1 text-xs font-semibold text-[#374151]">{c.from}</span>
              <div className="flex flex-col items-center">
                <ArrowRight className="h-3 w-3 text-[#94a3b8]" />
                <span className={`text-[10px] font-bold ${c.rate >= 50 ? 'text-[#16a34a]' : c.rate >= 25 ? 'text-[#f59e0b]' : 'text-[#dc2626]'}`}>
                  {c.rate}%
                </span>
              </div>
              {idx === conversions.length - 1 && (
                <span className="rounded bg-[#f1f5f9] px-2 py-1 text-xs font-semibold text-[#374151]">{c.to}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox label="Leads ativos" value={String(activeLeads.length)} sub="no pipeline" />
        <StatBox label="Pipeline total" value={pipelineValue > 0 ? formatCurrency(pipelineValue) : '--'} sub="valor em aberto" />
        <StatBox label="Receita fechada" value={wonValue > 0 ? formatCurrency(wonValue) : '--'} sub={`${wonLeads.length} contratos`} />
        <StatBox label="Perdidos" value={String(lostLeads.length)} sub={totalLeads > 0 ? `${Math.round((lostLeads.length / totalLeads) * 100)}% do total` : '--'} />
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-[#0f172a]">{value}</p>
    </div>
  )
}

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">{label}</p>
      <p className="mt-1 text-base font-bold text-[#0f172a]">{value}</p>
      <p className="text-[11px] text-[#94a3b8]">{sub}</p>
    </div>
  )
}
