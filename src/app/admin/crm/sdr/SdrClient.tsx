'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Filter,
  Loader2,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import {
  convertProspectToLead,
  createProspect,
  deleteProspect,
  updateProspectStatus,
  type CrmProspect,
} from '@/lib/actions/crm'

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

const COMPANY_SIZES = [
  { value: '1-50', label: '1-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1000+', label: '1000+' },
] as const

export default function SdrClient({ initialProspects }: { initialProspects: CrmProspect[] }) {
  const [prospects] = useState<CrmProspect[]>(initialProspects)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleCreate(fd: FormData) {
    startTransition(async () => {
      await createProspect(fd)
      setShowForm(false)
    })
  }

  function handleUpdateStatus(fd: FormData) {
    startTransition(async () => { await updateProspectStatus(fd) })
  }

  function handleConvert(fd: FormData) {
    startTransition(async () => { await convertProspectToLead(fd) })
  }

  function handleDelete(fd: FormData) {
    startTransition(async () => { await deleteProspect(fd) })
  }

  const filtered = prospects.filter((p) => {
    if (filterStatus && p.outreach_status !== filterStatus) return false
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      if (
        !p.full_name.toLowerCase().includes(t) &&
        !p.company_name.toLowerCase().includes(t) &&
        !(p.job_title || '').toLowerCase().includes(t)
      ) return false
    }
    return true
  })

  const countByStatus = (s: string) => prospects.filter((p) => p.outreach_status === s).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/crm" className="text-[#64748b] hover:text-[#0f172a]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">SDR - Prospeccao</h1>
            <p className="text-xs text-[#64748b]">{prospects.length} prospects | {countByStatus('converted')} convertidos</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d47a1]"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Lead
        </button>
      </div>

      {/* New Prospect Form (inline) */}
      {showForm && (
        <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1565C0]">Novo Prospect</p>
            <button onClick={() => setShowForm(false)} className="text-[#64748b] hover:text-[#0f172a]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form action={handleCreate} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input name="full_name" placeholder="Nome completo *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="job_title" placeholder="Cargo *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <select name="job_function" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]">
              <option value="">Funcao *</option>
              {JOB_FUNCTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <input name="company_name" placeholder="Empresa *" required className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <select name="company_size" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]">
              <option value="">Porte</option>
              {COMPANY_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <input name="linkedin_url" placeholder="URL LinkedIn" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="email" type="email" placeholder="Email" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <input name="phone" placeholder="Telefone" className="h-9 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#1565C0]" />
            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
              <button type="submit" disabled={isPending} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1565C0] px-4 text-xs font-semibold text-white hover:bg-[#0d47a1] disabled:opacity-50">
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
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
            {OUTREACH_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
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
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Origem</th>
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
                const funcLabel = JOB_FUNCTIONS.find((f) => f.value === p.job_function)?.label

                return (
                  <tr key={p.id} className={`bg-white hover:bg-[#f8fafc] ${isNotInterested ? 'opacity-50' : ''}`}>
                    <td className="px-3 py-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{p.company_name}</p>
                      {p.company_size && <p className="text-[10px] text-[#94a3b8]">{p.company_size} func.</p>}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium text-[#0f172a]">{p.full_name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{p.job_title}{funcLabel ? ` (${funcLabel})` : ''}</p>
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
                    <td className="hidden px-3 py-2 md:table-cell">
                      {p.linkedin_url ? (
                        <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0077B5] hover:underline">
                          <ExternalLink className="h-3 w-3" /> LinkedIn
                        </a>
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
                            {/* Quick call */}
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

                            {/* Update status */}
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
                              <button type="submit" disabled={isPending} className="h-7 rounded border border-[#d1d5db] bg-white px-2 text-[10px] font-semibold text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-50">
                                OK
                              </button>
                            </form>

                            {/* Convert to lead */}
                            {['replied', 'meeting_scheduled'].includes(p.outreach_status) && (
                              <form action={handleConvert}>
                                <input type="hidden" name="prospect_id" value={p.id} />
                                <button
                                  type="submit"
                                  disabled={isPending}
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
                        <form action={handleDelete}>
                          <input type="hidden" name="prospect_id" value={p.id} />
                          <button type="submit" disabled={isPending} className="inline-flex h-7 w-7 items-center justify-center rounded text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#dc2626] disabled:opacity-50">
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
