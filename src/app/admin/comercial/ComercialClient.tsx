'use client'

import { useState, useMemo, useTransition } from 'react'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Loader2,
  MessageSquare,
  MessageSquarePlus,
  Phone,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
  XCircle,
} from 'lucide-react'

import {
  addActivity,
  convertProspectToLead,
  createLead,
  createProspect,
  deleteProspect,
  updateLeadPipeline,
  updateProspectStatus,
  type CrmActivity,
  type CrmLeadScore,
  type CrmProspect,
  type EnhancedLead,
} from '@/lib/actions/crm'

// ── Constants ────────────────────────────────────────────

type Tab = 'pipeline' | 'leads' | 'propostas' | 'metricas'

const TABS: { key: Tab; label: string }[] = [
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'leads', label: 'Leads' },
  { key: 'propostas', label: 'Propostas' },
  { key: 'metricas', label: 'Metricas' },
]

const KANBAN_COLUMNS = [
  {
    key: 'novo',
    label: 'Novo',
    color: '#64748B',
    bg: '#f8fafc',
    border: '#e2e8f0',
    stages: ['prospecting', 'first_contact'],
  },
  {
    key: 'qualificado',
    label: 'Qualificado',
    color: '#6366f1',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    stages: ['qualification', 'meeting'],
  },
  {
    key: 'proposta',
    label: 'Proposta',
    color: '#F57C00',
    bg: '#fff8f0',
    border: '#fed7aa',
    stages: ['proposal', 'negotiation'],
  },
  {
    key: 'fechado',
    label: 'Fechado',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    stages: ['won', 'lost'],
  },
] as const

const OUTREACH_STATUSES = [
  { value: 'not_contacted', label: 'Nao contatado', dot: '#94a3b8' },
  { value: 'connection_sent', label: 'Conexao enviada', dot: '#38bdf8' },
  { value: 'connected', label: 'Conectado', dot: '#3b82f6' },
  { value: 'message_sent', label: 'Msg enviada', dot: '#818cf8' },
  { value: 'replied', label: 'Respondeu', dot: '#a78bfa' },
  { value: 'meeting_scheduled', label: 'Reuniao', dot: '#34d399' },
  { value: 'converted', label: 'Convertido', dot: '#22c55e' },
  { value: 'not_interested', label: 'Sem interesse', dot: '#f87171' },
] as const

const JOB_FUNCTIONS = [
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'coordenador', label: 'Coordenador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'vp', label: 'VP' },
  { value: 'c_level', label: 'C-Level' },
  { value: 'rh', label: 'RH / People' },
  { value: 'treinamento', label: 'T&D / Treinamento' },
  { value: 'outro', label: 'Outro' },
] as const

const COMPANY_SIZES = [
  { value: '1-50', label: '1-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1000+', label: '1000+' },
] as const

const PIPELINE_LABELS: Record<string, string> = {
  prospecting: 'Prospeccao',
  first_contact: '1o Contato',
  qualification: 'Qualificacao',
  meeting: 'Reuniao',
  proposal: 'Proposta',
  negotiation: 'Negociacao',
  won: 'Ganho',
  lost: 'Perdido',
}

const FUNNEL_STAGES = [
  { key: 'prospecting', label: 'Lead', color: '#64748b' },
  { key: 'first_contact', label: '1o Contato', color: '#0ea5e9' },
  { key: 'qualification', label: 'Qualificacao', color: '#6366f1' },
  { key: 'meeting', label: 'Reuniao', color: '#8b5cf6' },
  { key: 'proposal', label: 'Proposta', color: '#F57C00' },
  { key: 'negotiation', label: 'Negociacao', color: '#1565C0' },
] as const

// ── Helpers ──────────────────────────────────────────────

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

function daysSince(dateStr: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000))
}

// ── Props ────────────────────────────────────────────────

type Props = {
  leads: EnhancedLead[]
  prospects: CrmProspect[]
  scores: CrmLeadScore[]
  activities: CrmActivity[]
}

// ── Main Component ───────────────────────────────────────

export default function ComercialClient({ leads, prospects, scores, activities }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline')
  const [showNewLead, setShowNewLead] = useState(false)
  const [noteLeadId, setNoteLeadId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Computed values
  const totalLeads = leads.length
  const proposalLeads = leads.filter((l) => ['proposal', 'negotiation', 'meeting'].includes(l.pipeline_stage))
  const pipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.pipeline_stage))
    .reduce((a, l) => a + (l.estimated_value || 0), 0)

  // ── Actions ──

  function handleCreateLead(fd: FormData) {
    startTransition(async () => {
      await createLead(fd)
      setShowNewLead(false)
    })
  }

  function handleAdvance(leadId: string, currentStage: string, temperature: string) {
    const order = ['prospecting', 'first_contact', 'qualification', 'meeting', 'proposal', 'negotiation', 'won']
    const idx = order.indexOf(currentStage)
    const nextStage = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null
    if (!nextStage) return

    const fd = new FormData()
    fd.set('lead_id', leadId)
    fd.set('pipeline_stage', nextStage)
    fd.set('temperature', temperature)
    startTransition(async () => {
      await updateLeadPipeline(fd)
    })
  }

  function handleMarkLost(leadId: string) {
    const fd = new FormData()
    fd.set('lead_id', leadId)
    fd.set('pipeline_stage', 'lost')
    fd.set('temperature', 'cold')
    startTransition(async () => {
      await updateLeadPipeline(fd)
    })
  }

  function handleMarkWon(leadId: string) {
    const fd = new FormData()
    fd.set('lead_id', leadId)
    fd.set('pipeline_stage', 'won')
    fd.set('temperature', 'hot')
    startTransition(async () => {
      await updateLeadPipeline(fd)
    })
  }

  function handleAddNote(fd: FormData) {
    startTransition(async () => {
      await addActivity(fd)
      setNoteLeadId(null)
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Comercial</h1>
          <div className="mt-0.5 flex items-center gap-4 text-xs text-[#64748b]">
            <span>{totalLeads} leads</span>
            <span>{proposalLeads.length} propostas</span>
            {pipelineValue > 0 && <span className="font-semibold text-[#1565C0]">{formatCurrency(pipelineValue)} pipeline</span>}
          </div>
        </div>
        <button
          onClick={() => setShowNewLead(!showNewLead)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d47a1]"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Lead
        </button>
      </div>

      {/* ── New Lead Form ── */}
      {showNewLead && (
        <NewLeadInlineForm onSubmit={handleCreateLead} onCancel={() => setShowNewLead(false)} isPending={isPending} />
      )}

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-[#1565C0] text-[#1565C0]'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'pipeline' && (
        <PipelineTab
          leads={leads}
          isPending={isPending}
          onAdvance={handleAdvance}
          onMarkLost={handleMarkLost}
          onAddNote={(id) => setNoteLeadId(id)}
        />
      )}

      {activeTab === 'leads' && (
        <LeadsTab prospects={prospects} isPending={isPending} />
      )}

      {activeTab === 'propostas' && (
        <PropostasTab
          leads={leads}
          scores={scores}
          activities={activities}
          isPending={isPending}
          onMarkWon={handleMarkWon}
          onMarkLost={handleMarkLost}
          onAddNote={(id) => setNoteLeadId(id)}
        />
      )}

      {activeTab === 'metricas' && (
        <MetricasTab leads={leads} />
      )}

      {/* ── Note Modal ── */}
      {noteLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0f172a]">Adicionar nota</h3>
              <button onClick={() => setNoteLeadId(null)} className="text-[#94a3b8] hover:text-[#64748b]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={handleAddNote} className="mt-3 space-y-3">
              <input type="hidden" name="lead_id" value={noteLeadId} />
              <input type="hidden" name="activity_type" value="note" />
              <input
                name="title"
                placeholder="Titulo da nota..."
                required
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#1565C0]"
              />
              <textarea
                name="description"
                placeholder="Detalhes (opcional)..."
                rows={3}
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#1565C0]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteLeadId(null)}
                  className="rounded-lg border border-[#d1d5db] px-4 py-2 text-xs font-semibold text-[#64748b] hover:bg-[#f9fafb]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// TAB: Pipeline (Kanban)
// ══════════════════════════════════════════════════════════

function PipelineTab({
  leads,
  isPending,
  onAdvance,
  onMarkLost,
  onAddNote,
}: {
  leads: EnhancedLead[]
  isPending: boolean
  onAdvance: (id: string, stage: string, temp: string) => void
  onMarkLost: (id: string) => void
  onAddNote: (id: string) => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, EnhancedLead[]>()
    for (const col of KANBAN_COLUMNS) map.set(col.key, [])

    for (const lead of leads) {
      let placed = false
      for (const col of KANBAN_COLUMNS) {
        if (col.stages.includes(lead.pipeline_stage as never)) {
          map.get(col.key)!.push(lead)
          placed = true
          break
        }
      }
      if (!placed) map.get('novo')!.push(lead)
    }
    return map
  }, [leads])

  if (leads.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center">
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-12 py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-[#94a3b8]" />
          <h2 className="mt-4 text-lg font-bold text-[#0f172a]">Nenhum lead cadastrado</h2>
          <p className="mt-1 text-sm text-[#64748b]">Comece adicionando o primeiro lead ao pipeline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: `${KANBAN_COLUMNS.length * 280}px` }}>
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = grouped.get(col.key) ?? []
          const colValue = colLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)

          return (
            <div key={col.key} className="flex w-[268px] shrink-0 flex-col">
              {/* Column header */}
              <div
                className="flex items-center justify-between rounded-t-xl border px-3 py-2"
                style={{ borderColor: col.border, backgroundColor: col.bg }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: col.color }}
                  >
                    {colLeads.length}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: col.color }}>
                    {col.label}
                  </span>
                </div>
                {colValue > 0 && (
                  <span className="text-[10px] font-semibold text-[#64748b]">{formatCurrency(colValue)}</span>
                )}
              </div>

              {/* Cards */}
              <div
                className="flex-1 space-y-2 rounded-b-xl border border-t-0 p-2"
                style={{ borderColor: col.border, backgroundColor: col.bg, minHeight: '120px' }}
              >
                {colLeads.length === 0 && (
                  <p className="py-6 text-center text-[11px] text-[#94a3b8]">Vazio</p>
                )}
                {colLeads.map((lead) => {
                  const isWon = lead.pipeline_stage === 'won'
                  const isLost = lead.pipeline_stage === 'lost'
                  const isTerminal = isWon || isLost

                  return (
                    <div
                      key={lead.id}
                      className={`rounded-lg border bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md ${
                        isLost ? 'border-[#fecaca] opacity-60' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#0f172a]">{lead.company_name}</p>
                          <p className="truncate text-[11px] text-[#64748b]">{lead.full_name}</p>
                        </div>
                        {lead.estimated_value && lead.estimated_value > 0 && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-bold text-[#065f46]">
                            <DollarSign className="h-2.5 w-2.5" />
                            {(lead.estimated_value / 1000).toFixed(0)}k
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#94a3b8]">
                        <span className="inline-flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {daysSince(lead.created_at)}d
                        </span>
                        {lead.next_action && (
                          <span className="inline-flex items-center gap-0.5 truncate">
                            <Calendar className="h-2.5 w-2.5" />
                            {lead.next_action}
                          </span>
                        )}
                        {isWon && (
                          <span className="inline-flex items-center gap-0.5 text-[#16a34a]">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Ganho
                          </span>
                        )}
                        {isLost && (
                          <span className="inline-flex items-center gap-0.5 text-[#dc2626]">
                            <XCircle className="h-2.5 w-2.5" />
                            Perdido
                          </span>
                        )}
                      </div>

                      {!isTerminal && (
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={() => onAdvance(lead.id, lead.pipeline_stage, lead.temperature)}
                            disabled={isPending}
                            className="inline-flex flex-1 items-center justify-center gap-0.5 rounded bg-[#1565C0] py-1 text-[10px] font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50"
                          >
                            <ChevronRight className="h-3 w-3" />
                            Avancar
                          </button>
                          <button
                            onClick={() => onAddNote(lead.id)}
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded border border-[#d1d5db] p-1 text-[#64748b] hover:bg-[#f3f4f6] disabled:opacity-50"
                            title="Adicionar nota"
                          >
                            <MessageSquarePlus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onMarkLost(lead.id)}
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded border border-[#fecaca] p-1 text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-50"
                            title="Marcar como perdido"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
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
  )
}

// ══════════════════════════════════════════════════════════
// TAB: Leads (SDR table)
// ══════════════════════════════════════════════════════════

function LeadsTab({ prospects, isPending: parentPending }: { prospects: CrmProspect[]; isPending: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  const pending = parentPending || isPending

  function handleCreate(fd: FormData) {
    startTransition(async () => {
      await createProspect(fd)
      setShowForm(false)
    })
  }

  function handleUpdateStatus(fd: FormData) {
    startTransition(async () => {
      await updateProspectStatus(fd)
    })
  }

  function handleConvert(fd: FormData) {
    startTransition(async () => {
      await convertProspectToLead(fd)
    })
  }

  function handleDelete(fd: FormData) {
    startTransition(async () => {
      await deleteProspect(fd)
    })
  }

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (filterStatus && p.outreach_status !== filterStatus) return false
      if (searchTerm) {
        const t = searchTerm.toLowerCase()
        if (
          !p.full_name.toLowerCase().includes(t) &&
          !p.company_name.toLowerCase().includes(t) &&
          !(p.job_title || '').toLowerCase().includes(t)
        )
          return false
      }
      return true
    })
  }, [prospects, filterStatus, searchTerm])

  return (
    <div className="space-y-3">
      {/* New Prospect Form */}
      {showForm && (
        <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1565C0]">Novo Lead (SDR)</p>
            <button onClick={() => setShowForm(false)} className="text-[#64748b] hover:text-[#0f172a]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form action={handleCreate} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input name="full_name" placeholder="Nome completo *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="job_title" placeholder="Cargo *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <select name="job_function" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]">
              <option value="">Funcao *</option>
              {JOB_FUNCTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <input name="company_name" placeholder="Empresa *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <select name="company_size" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]">
              <option value="">Porte</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <input name="linkedin_url" placeholder="URL LinkedIn" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="email" type="email" placeholder="Email" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="phone" placeholder="Telefone" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
              <button type="submit" disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 text-xs font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50">
                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Adicionar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#d1d5db] px-3 text-xs font-semibold text-[#64748b] hover:bg-white">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-[11px] font-semibold text-[#1565C0] hover:bg-[#dbeafe]"
        >
          <Plus className="h-3 w-3" />
          Novo Lead
        </button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-52 rounded-lg border border-[#d1d5db] bg-white pl-8 pr-3 text-xs outline-none focus:border-[#1565C0]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 appearance-none rounded-lg border border-[#d1d5db] bg-white pl-8 pr-8 text-xs font-medium outline-none focus:border-[#1565C0]"
          >
            <option value="">Todos os status</option>
            {OUTREACH_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#94a3b8]" />
        </div>
        {(filterStatus || searchTerm) && (
          <button
            onClick={() => { setFilterStatus(''); setSearchTerm('') }}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748b] hover:text-[#0f172a]"
          >
            <X className="h-3 w-3" /> Limpar
          </button>
        )}
        <span className="text-[11px] text-[#94a3b8]">{filtered.length} resultados</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#d1d5db] bg-white py-12 text-center">
          <p className="text-sm font-semibold text-[#64748b]">Nenhum prospect encontrado</p>
          <p className="mt-1 text-xs text-[#94a3b8]">Adicione prospects ou ajuste os filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Empresa</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Contato</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Telefone</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] lg:table-cell">Email</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Status</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((p) => {
                const status = OUTREACH_STATUSES.find((s) => s.value === p.outreach_status)
                const isConverted = p.outreach_status === 'converted'
                const isNotInterested = p.outreach_status === 'not_interested'
                const isTerminal = isConverted || isNotInterested

                return (
                  <tr key={p.id} className={`bg-white hover:bg-[#f8fafc] ${isNotInterested ? 'opacity-50' : ''}`}>
                    <td className="px-3 py-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{p.company_name}</p>
                      {p.company_size && <p className="text-[10px] text-[#94a3b8]">{p.company_size} func.</p>}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium text-[#0f172a]">{p.full_name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{p.job_title}</p>
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell">
                      {p.phone ? (
                        <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1 text-xs text-[#1565C0] hover:underline">
                          <Phone className="h-3 w-3" />
                          {p.phone}
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">--</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2 lg:table-cell">
                      {p.email ? (
                        <span className="text-xs text-[#64748b]">{p.email}</span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">--</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status?.dot ?? '#94a3b8' }} />
                        {status?.label ?? p.outreach_status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {!isTerminal && (
                          <>
                            {p.phone && (
                              <a
                                href={`https://wa.me/${p.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-7 items-center gap-1 rounded border border-[#d1fae5] bg-[#ecfdf5] px-2 text-[10px] font-semibold text-[#065f46] hover:bg-[#d1fae5]"
                                title="WhatsApp"
                              >
                                WhatsApp
                              </a>
                            )}
                            <form action={handleUpdateStatus} className="flex items-center gap-1">
                              <input type="hidden" name="prospect_id" value={p.id} />
                              <select
                                name="outreach_status"
                                defaultValue={p.outreach_status}
                                className="h-7 rounded border border-[#d1d5db] px-1 text-[10px] font-medium outline-none"
                              >
                                {OUTREACH_STATUSES.filter((s) => s.value !== 'converted').map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                              <button type="submit" disabled={pending} className="h-7 rounded border border-[#d1d5db] bg-white px-2 text-[10px] font-semibold text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-50">
                                OK
                              </button>
                            </form>
                            {['replied', 'meeting_scheduled'].includes(p.outreach_status) && (
                              <form action={handleConvert}>
                                <input type="hidden" name="prospect_id" value={p.id} />
                                <button
                                  type="submit"
                                  disabled={pending}
                                  className="inline-flex h-7 items-center gap-1 rounded bg-[#F57C00] px-2 text-[10px] font-bold text-white hover:bg-[#ef6c00] disabled:opacity-50"
                                  title="Converter para Lead"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                  Proposta
                                </button>
                              </form>
                            )}
                          </>
                        )}
                        {isConverted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a34a]">
                            <CheckCircle2 className="h-3 w-3" />
                            Convertido
                          </span>
                        )}
                        <form action={handleDelete}>
                          <input type="hidden" name="prospect_id" value={p.id} />
                          <button type="submit" disabled={pending} className="inline-flex h-7 w-7 items-center justify-center rounded text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#dc2626] disabled:opacity-50">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// TAB: Propostas (Closer)
// ══════════════════════════════════════════════════════════

function PropostasTab({
  leads,
  scores,
  activities,
  isPending,
  onMarkWon,
  onMarkLost,
  onAddNote,
}: {
  leads: EnhancedLead[]
  scores: CrmLeadScore[]
  activities: CrmActivity[]
  isPending: boolean
  onMarkWon: (id: string) => void
  onMarkLost: (id: string) => void
  onAddNote: (id: string) => void
}) {
  const closerStages = ['proposal', 'negotiation', 'meeting']
  const closerLeads = useMemo(() => leads.filter((l) => closerStages.includes(l.pipeline_stage)), [leads])
  const wonLeads = useMemo(() => leads.filter((l) => l.pipeline_stage === 'won'), [leads])
  const scoresByLead = useMemo(() => new Map(scores.map((s) => [s.lead_id, s])), [scores])

  const totalValue = closerLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const wonValue = wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)

  if (closerLeads.length === 0 && wonLeads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#d1d5db] bg-white py-12 text-center">
        <Target className="mx-auto h-8 w-8 text-[#94a3b8]" />
        <p className="mt-3 text-sm font-semibold text-[#64748b]">Nenhuma negociacao ativa</p>
        <p className="mt-1 text-xs text-[#94a3b8]">Avance leads no pipeline para que aparecam aqui.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-[#64748b]">
        <span>{closerLeads.length} em negociacao</span>
        {totalValue > 0 && <span>Pipeline: {formatCurrency(totalValue)}</span>}
        {wonValue > 0 && <span className="font-semibold text-[#16a34a]">Ganhos: {formatCurrency(wonValue)}</span>}
      </div>

      {/* Active negotiations table */}
      {closerLeads.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Empresa</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Valor</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Fase</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Dias</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Proxima Acao</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {closerLeads.map((lead) => {
                const days = daysSince(lead.created_at)
                const score = scoresByLead.get(lead.id)

                return (
                  <tr key={lead.id} className="bg-white hover:bg-[#f8fafc]">
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-[#0f172a]">{lead.company_name}</p>
                      <p className="text-[10px] text-[#94a3b8]">
                        {lead.full_name}
                        {lead.whatsapp !== 'Nao informado' ? ` | ${lead.whatsapp}` : ''}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      {lead.estimated_value && lead.estimated_value > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#065f46]">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(lead.estimated_value)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">--</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">
                      <span className="rounded bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                        {PIPELINE_LABELS[lead.pipeline_stage] ?? lead.pipeline_stage}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          days > 14 ? 'text-[#dc2626]' : days > 7 ? 'text-[#f59e0b]' : 'text-[#64748b]'
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {days}d
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">
                      {lead.next_action ? (
                        <span className="text-xs text-[#374151]">{lead.next_action}</span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onMarkWon(lead.id)}
                          disabled={isPending}
                          className="inline-flex h-7 items-center gap-1 rounded bg-[#16a34a] px-2 text-[10px] font-bold text-white hover:bg-[#15803d] disabled:opacity-50"
                          title="Fechar como ganho"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Ganho
                        </button>
                        <button
                          onClick={() => onMarkLost(lead.id)}
                          disabled={isPending}
                          className="inline-flex h-7 items-center gap-1 rounded border border-[#fecaca] bg-[#fef2f2] px-2 text-[10px] font-bold text-[#dc2626] hover:bg-[#fecaca] disabled:opacity-50"
                          title="Marcar como perdido"
                        >
                          <XCircle className="h-3 w-3" />
                          Perdido
                        </button>
                        <button
                          onClick={() => onAddNote(lead.id)}
                          disabled={isPending}
                          className="inline-flex h-7 items-center justify-center rounded border border-[#d1d5db] px-1.5 text-[#64748b] hover:bg-[#f3f4f6] disabled:opacity-50"
                          title="Adicionar nota"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Won deals */}
      {wonLeads.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-bold text-[#0f172a]">Fechados recentes ({wonLeads.length})</h2>
          <div className="overflow-x-auto rounded-lg border border-[#bbf7d0]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#bbf7d0] bg-[#f0fdf4]">
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Empresa</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Valor</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcfce7]">
                {wonLeads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="bg-white">
                    <td className="px-3 py-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{lead.company_name}</p>
                      <p className="text-[10px] text-[#64748b]">{lead.full_name}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-bold text-[#065f46]">
                        {lead.estimated_value ? formatCurrency(lead.estimated_value) : '--'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-[#64748b]">
                      {new Date(lead.updated_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// TAB: Metricas (Funnel)
// ══════════════════════════════════════════════════════════

function MetricasTab({ leads }: { leads: EnhancedLead[] }) {
  const totalLeads = leads.length
  const wonLeads = leads.filter((l) => l.pipeline_stage === 'won')
  const lostLeads = leads.filter((l) => l.pipeline_stage === 'lost')
  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.pipeline_stage))

  const wonValue = wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const pipelineValue = activeLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const avgDealValue = wonLeads.length > 0
    ? wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0) / wonLeads.length
    : 0

  const avgTimeToClose = wonLeads.length > 0
    ? Math.round(
        wonLeads.reduce((a, l) => {
          return a + (new Date(l.updated_at).getTime() - new Date(l.created_at).getTime()) / 86400000
        }, 0) / wonLeads.length
      )
    : 0

  const overallWinRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0

  // Stage counts
  const stageCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const lead of leads) {
      const count = map.get(lead.pipeline_stage) ?? 0
      map.set(lead.pipeline_stage, count + 1)
    }
    return map
  }, [leads])

  const maxFunnelCount = Math.max(1, ...FUNNEL_STAGES.map((s) => stageCounts.get(s.key) ?? 0))

  // Conversion rates
  const conversions = useMemo(() => {
    return FUNNEL_STAGES.slice(0, -1).map((stage, idx) => {
      const current = stageCounts.get(stage.key) ?? 0
      const passed = FUNNEL_STAGES.slice(idx + 1).reduce((a, s) => a + (stageCounts.get(s.key) ?? 0), 0)
        + wonLeads.length + lostLeads.length
      const total = current + passed
      return {
        from: stage.label,
        to: FUNNEL_STAGES[idx + 1].label,
        rate: total > 0 ? Math.round((passed / total) * 100) : 0,
      }
    })
  }, [stageCounts, wonLeads.length, lostLeads.length])

  if (totalLeads === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center">
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-12 py-16 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-[#94a3b8]" />
          <h2 className="mt-4 text-lg font-bold text-[#0f172a]">Sem dados ainda</h2>
          <p className="mt-1 text-sm text-[#64748b]">Adicione leads ao pipeline para visualizar o funil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard icon={<Users className="h-4 w-4" />} label="Total leads" value={String(totalLeads)} color="#1565C0" />
        <KpiCard icon={<Target className="h-4 w-4" />} label="Win rate" value={`${overallWinRate}%`} color="#16a34a" />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} label="Ticket medio" value={avgDealValue > 0 ? formatCurrency(avgDealValue) : '--'} color="#7c3aed" />
        <KpiCard icon={<Clock className="h-4 w-4" />} label="Tempo medio" value={avgTimeToClose > 0 ? `${avgTimeToClose}d` : '--'} color="#0891b2" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Ganhos" value={`${wonLeads.length} (${wonValue > 0 ? formatCurrency(wonValue) : '--'})`} color="#16a34a" />
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
                style={{ width: `${Math.max(8, (wonLeads.length / maxFunnelCount) * 100)}%`, minWidth: '40px' }}
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
                style={{ width: `${Math.max(8, (lostLeads.length / maxFunnelCount) * 100)}%`, minWidth: '40px' }}
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

// ══════════════════════════════════════════════════════════
// Shared subcomponents
// ══════════════════════════════════════════════════════════

function NewLeadInlineForm({
  onSubmit,
  onCancel,
  isPending,
}: {
  onSubmit: (fd: FormData) => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1565C0]">Novo Lead</p>
        <button onClick={onCancel} className="text-[#64748b] hover:text-[#0f172a]">
          <X className="h-4 w-4" />
        </button>
      </div>
      <form action={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          name="company_name"
          placeholder="Empresa *"
          required
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]"
        />
        <input
          name="full_name"
          placeholder="Contato (nome) *"
          required
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]"
        />
        <input
          name="whatsapp"
          placeholder="WhatsApp"
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]"
        />
        <input
          name="estimated_value"
          type="number"
          placeholder="Valor estimado (R$)"
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]"
        />
        <input
          name="notes"
          placeholder="Observacoes"
          className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0] sm:col-span-2 lg:col-span-2"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 text-xs font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Salvar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-lg border border-[#d1d5db] px-3 text-xs font-semibold text-[#64748b] hover:bg-white"
          >
            Cancelar
          </button>
        </div>
      </form>
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
