'use client'

import { useState, useTransition } from 'react'
import {
  ArrowLeftRight,
  Building2,
  ChevronDown,
  ExternalLink,
  Filter,
  Linkedin,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  UserPlus,
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
  { value: 'not_contacted', label: 'Não contatado', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { value: 'connection_sent', label: 'Conexão enviada', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'connected', label: 'Conectado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'message_sent', label: 'Mensagem enviada', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'replied', label: 'Respondeu', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { value: 'meeting_scheduled', label: 'Reunião agendada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'converted', label: 'Convertido', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'not_interested', label: 'Sem interesse', color: 'bg-rose-50 text-rose-700 border-rose-200' },
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
  const [filterFunction, setFilterFunction] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleCreateProspect(fd: FormData) {
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

  const filtered = prospects.filter((p) => {
    if (filterFunction && p.job_function !== filterFunction) return false
    if (filterStatus && p.outreach_status !== filterStatus) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (
        !p.full_name.toLowerCase().includes(term) &&
        !p.company_name.toLowerCase().includes(term) &&
        !p.job_title.toLowerCase().includes(term)
      )
        return false
    }
    return true
  })

  const statsByFunction = JOB_FUNCTIONS.map((f) => ({
    ...f,
    count: prospects.filter((p) => p.job_function === f.value).length,
  }))

  const activeCount = prospects.filter((p) => !['converted', 'not_interested'].includes(p.outreach_status)).length
  const repliedCount = prospects.filter((p) => ['replied', 'meeting_scheduled'].includes(p.outreach_status)).length
  const convertedCount = prospects.filter((p) => p.outreach_status === 'converted').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0077B5]/20 blur-[90px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0077B5]/20 text-[#0077B5]">
              <Linkedin className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">SDR Workspace</p>
              <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
                Prospecção LinkedIn
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
            Gerencie prospects por função, acompanhe outreach e converta para o pipeline de vendas.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total prospects</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{prospects.length}</p>
        </article>
        <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700">Ativos</p>
          <p className="mt-2 text-3xl font-extrabold text-sky-900">{activeCount}</p>
        </article>
        <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">Responderam</p>
          <p className="mt-2 text-3xl font-extrabold text-violet-900">{repliedCount}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Convertidos</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{convertedCount}</p>
        </article>
      </section>

      {/* Segmentation by Function */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Prospects por função</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {statsByFunction.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterFunction(filterFunction === f.value ? '' : f.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                filterFunction === f.value
                  ? 'border-[#1E88E5] bg-[#1E88E5] text-white'
                  : 'border-[#D8E2EF] bg-white text-[#334155] hover:border-[#1E88E5] hover:text-[#1E88E5]'
              }`}
            >
              {f.label}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
        >
          <Plus className="h-4 w-4" />
          Novo prospect
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar nome, empresa ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 rounded-xl border border-[#D8E2EF] bg-white pl-10 pr-4 text-sm text-[#334155] outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 appearance-none rounded-xl border border-[#D8E2EF] bg-white pl-10 pr-10 text-sm font-semibold text-[#334155] outline-none focus:border-[#1E88E5]"
          >
            <option value="">Todos os status</option>
            {OUTREACH_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        </div>

        {(filterFunction || filterStatus || searchTerm) && (
          <button
            onClick={() => { setFilterFunction(''); setFilterStatus(''); setSearchTerm('') }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="h-3.5 w-3.5" /> Limpar filtros
          </button>
        )}
      </div>

      {/* New Prospect Form */}
      {showForm && (
        <section className="rounded-2xl border border-[#1E88E5]/30 bg-[#F0F7FF] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Adicionar prospect LinkedIn</p>
          <form action={handleCreateProspect} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input name="full_name" placeholder="Nome completo *" required className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <input name="job_title" placeholder="Cargo (ex: Supervisor de Produção) *" required className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <select name="job_function" required className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]">
              <option value="">Função *</option>
              {JOB_FUNCTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <input name="company_name" placeholder="Empresa *" required className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <select name="company_size" className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]">
              <option value="">Porte da empresa</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label} funcionários</option>
              ))}
            </select>
            <input name="linkedin_url" placeholder="URL do LinkedIn" className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <input name="email" type="email" placeholder="E-mail" className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <input name="phone" placeholder="Telefone" className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            <div className="flex items-center gap-2">
              <input name="city" placeholder="Cidade" className="h-11 w-full rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
              <input name="state" placeholder="UF" maxLength={2} className="h-11 w-20 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm outline-none focus:border-[#1E88E5]" />
            </div>

            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1E88E5] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm font-bold text-[#64748B] hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Prospects List */}
      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center shadow-sm">
          <Linkedin className="mx-auto h-10 w-10 text-[#94A3B8]" />
          <h2 className="mt-4 text-xl font-extrabold text-[#0F172A]">Nenhum prospect encontrado</h2>
          <p className="mt-2 text-sm text-[#64748B]">Adicione prospects do LinkedIn para iniciar a prospecção.</p>
        </section>
      ) : (
        <section className="space-y-3">
          {filtered.map((prospect) => {
            const statusConfig = OUTREACH_STATUSES.find((s) => s.value === prospect.outreach_status)
            const isConverted = prospect.outreach_status === 'converted'
            const isNotInterested = prospect.outreach_status === 'not_interested'

            return (
              <article
                key={prospect.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                  isConverted ? 'border-green-200 bg-green-50/30' : isNotInterested ? 'border-rose-200 opacity-60' : 'border-[#D8E2EF]'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0077B5]/10 text-xs font-bold text-[#0077B5]">
                        {prospect.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0F172A]">{prospect.full_name}</p>
                        <p className="truncate text-xs text-[#64748B]">{prospect.job_title}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2 py-0.5 text-[10px] font-bold text-[#334155]">
                        <Building2 className="h-3 w-3" /> {prospect.company_name}
                        {prospect.company_size && ` • ${prospect.company_size}`}
                      </span>
                      <span className="rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2 py-0.5 text-[10px] font-bold uppercase text-[#64748B]">
                        {JOB_FUNCTIONS.find((f) => f.value === prospect.job_function)?.label}
                      </span>
                      {(prospect.city || prospect.state) && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]">
                          <MapPin className="h-3 w-3" /> {[prospect.city, prospect.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {prospect.linkedin_url && (
                        <a
                          href={prospect.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0077B5] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusConfig?.color ?? 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      {statusConfig?.label ?? prospect.outreach_status}
                    </span>

                    {!isConverted && !isNotInterested && (
                      <>
                        <form action={handleUpdateStatus} className="flex items-center gap-1">
                          <input type="hidden" name="prospect_id" value={prospect.id} />
                          <select
                            name="outreach_status"
                            defaultValue={prospect.outreach_status}
                            className="h-8 rounded-lg border border-[#D8E2EF] px-2 text-[11px] font-semibold text-[#334155] outline-none"
                          >
                            {OUTREACH_STATUSES.filter((s) => s.value !== 'converted').map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <button type="submit" disabled={isPending} className="h-8 rounded-lg border border-[#D8E2EF] bg-white px-2 text-[10px] font-bold uppercase text-[#334155] hover:bg-slate-50">
                            Salvar
                          </button>
                        </form>

                        {['replied', 'meeting_scheduled'].includes(prospect.outreach_status) && (
                          <form action={handleConvert}>
                            <input type="hidden" name="prospect_id" value={prospect.id} />
                            <button
                              type="submit"
                              disabled={isPending}
                              className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-[10px] font-bold uppercase text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <ArrowLeftRight className="h-3 w-3" /> Converter
                            </button>
                          </form>
                        )}
                      </>
                    )}

                    <form action={handleDelete}>
                      <input type="hidden" name="prospect_id" value={prospect.id} />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
