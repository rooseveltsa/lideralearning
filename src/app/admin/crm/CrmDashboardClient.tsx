'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Loader2,
  MessageSquarePlus,
  Plus,
  X,
  XCircle,
} from 'lucide-react'

import {
  addActivity,
  createLead,
  updateLeadPipeline,
  type EnhancedLead,
} from '@/lib/actions/crm'

type Props = {
  leads: EnhancedLead[]
}

const STAGES = [
  { key: 'prospecting', label: 'Lead', color: '#64748B', bg: '#f8fafc', border: '#e2e8f0' },
  { key: 'proposal', label: 'Proposta', color: '#F57C00', bg: '#fff8f0', border: '#fed7aa' },
  { key: 'negotiation', label: 'Negociacao', color: '#1565C0', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'won', label: 'Fechado Ganho', color: '#2e7d32', bg: '#f0fdf4', border: '#bbf7d0' },
  { key: 'lost', label: 'Perdido', color: '#c62828', bg: '#fef2f2', border: '#fecaca' },
] as const

function stageForDisplay(stage: string): string {
  if (['prospecting', 'first_contact', 'qualification', 'meeting'].includes(stage)) return 'prospecting'
  return stage
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

function daysSince(dateStr: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000))
}

export default function CrmDashboardClient({ leads }: Props) {
  const [showNewLead, setShowNewLead] = useState(false)
  const [noteLeadId, setNoteLeadId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const grouped = new Map<string, EnhancedLead[]>()
  for (const s of STAGES) grouped.set(s.key, [])
  for (const lead of leads) {
    const displayStage = stageForDisplay(lead.pipeline_stage)
    const list = grouped.get(displayStage)
    if (list) list.push(lead)
    else {
      const fallback = grouped.get('prospecting')!
      fallback.push(lead)
    }
  }

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

  function handleAddNote(fd: FormData) {
    startTransition(async () => {
      await addActivity(fd)
      setNoteLeadId(null)
    })
  }

  const totalLeads = leads.length
  const totalPipeline = leads
    .filter((l) => !['won', 'lost'].includes(l.pipeline_stage))
    .reduce((a, l) => a + (l.estimated_value || 0), 0)
  const totalWon = leads
    .filter((l) => l.pipeline_stage === 'won')
    .reduce((a, l) => a + (l.estimated_value || 0), 0)

  if (totalLeads === 0 && !showNewLead) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-12 py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-[#94a3b8]" />
          <h2 className="mt-4 text-lg font-bold text-[#0f172a]">Nenhum lead cadastrado</h2>
          <p className="mt-1 text-sm text-[#64748b]">Comece adicionando o primeiro lead ao pipeline.</p>
          <button
            onClick={() => setShowNewLead(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d47a1]"
          >
            <Plus className="h-4 w-4" />
            Adicionar primeiro lead
          </button>
        </div>
        {showNewLead && <NewLeadForm onSubmit={handleCreateLead} onCancel={() => setShowNewLead(false)} isPending={isPending} />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Compact header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Pipeline de Vendas</h1>
          <div className="mt-1 flex items-center gap-4 text-xs text-[#64748b]">
            <span>{totalLeads} leads</span>
            {totalPipeline > 0 && <span>Pipeline: {formatCurrency(totalPipeline)}</span>}
            {totalWon > 0 && <span className="text-green-700">Ganhos: {formatCurrency(totalWon)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/crm/sdr"
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#f9fafb]"
          >
            SDR
          </Link>
          <Link
            href="/admin/crm/closer"
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#f9fafb]"
          >
            Closer
          </Link>
          <Link
            href="/admin/crm/funil"
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#f9fafb]"
          >
            Funil
          </Link>
          <button
            onClick={() => setShowNewLead(!showNewLead)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d47a1]"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Lead
          </button>
        </div>
      </div>

      {/* New Lead Form */}
      {showNewLead && (
        <NewLeadForm onSubmit={handleCreateLead} onCancel={() => setShowNewLead(false)} isPending={isPending} />
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3" style={{ minWidth: `${STAGES.length * 260}px` }}>
          {STAGES.map((stage) => {
            const stageLeads = grouped.get(stage.key) ?? []
            const stageValue = stageLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)

            return (
              <div key={stage.key} className="flex w-[252px] shrink-0 flex-col">
                {/* Column header */}
                <div
                  className="flex items-center justify-between rounded-t-lg border px-3 py-2"
                  style={{ borderColor: stage.border, backgroundColor: stage.bg }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: stage.color }}
                    >
                      {stageLeads.length}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: stage.color }}>
                      {stage.label}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <span className="text-[10px] font-semibold text-[#64748b]">
                      {formatCurrency(stageValue)}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div
                  className="flex-1 space-y-2 rounded-b-lg border border-t-0 p-2"
                  style={{ borderColor: stage.border, backgroundColor: stage.bg, minHeight: '120px' }}
                >
                  {stageLeads.length === 0 && (
                    <p className="py-6 text-center text-[11px] text-[#94a3b8]">Vazio</p>
                  )}
                  {stageLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      stageKey={stage.key}
                      isPending={isPending}
                      onAdvance={() => handleAdvance(lead.id, lead.pipeline_stage, lead.temperature)}
                      onMarkLost={() => handleMarkLost(lead.id)}
                      onAddNote={() => setNoteLeadId(lead.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Note modal */}
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

// -- Subcomponents --

function LeadCard({
  lead,
  stageKey,
  isPending,
  onAdvance,
  onMarkLost,
  onAddNote,
}: {
  lead: EnhancedLead
  stageKey: string
  isPending: boolean
  onAdvance: () => void
  onMarkLost: () => void
  onAddNote: () => void
}) {
  const days = daysSince(lead.created_at)
  const isTerminal = stageKey === 'won' || stageKey === 'lost'

  return (
    <div className="rounded-lg border border-[#e2e8f0] bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
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
          {days}d
        </span>
        {lead.next_action && (
          <span className="inline-flex items-center gap-0.5 truncate">
            <Calendar className="h-2.5 w-2.5" />
            {lead.next_action}
          </span>
        )}
      </div>

      {!isTerminal && (
        <div className="mt-2 flex items-center gap-1">
          <button
            onClick={onAdvance}
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center gap-0.5 rounded bg-[#1565C0] py-1 text-[10px] font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50"
          >
            <ChevronRight className="h-3 w-3" />
            Avancar
          </button>
          <button
            onClick={onAddNote}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded border border-[#d1d5db] p-1 text-[#64748b] hover:bg-[#f3f4f6] disabled:opacity-50"
            title="Adicionar nota"
          >
            <MessageSquarePlus className="h-3 w-3" />
          </button>
          <button
            onClick={onMarkLost}
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
}

function NewLeadForm({
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
