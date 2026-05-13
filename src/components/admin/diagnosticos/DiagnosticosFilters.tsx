'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Filter, X } from 'lucide-react'

type FilterType = 'empresa' | 'pessoal' | 'all'

type Props = {
  initial: {
    type: FilterType
    from: string
    to: string
    search: string
  }
}

export function DiagnosticosFilters({ initial }: Props) {
  const router = useRouter()
  const [type, setType] = useState<FilterType>(initial.type)
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const [search, setSearch] = useState(initial.search)
  const [pending, startTransition] = useTransition()

  function apply() {
    const q = new URLSearchParams()
    if (type !== 'all') q.set('type', type)
    if (from) q.set('from', from)
    if (to) q.set('to', to)
    if (search.trim()) q.set('search', search.trim())
    startTransition(() => {
      router.push(`/admin/diagnosticos${q.toString() ? `?${q.toString()}` : ''}`)
      router.refresh()
    })
  }

  function reset() {
    setType('all')
    setFrom('')
    setTo('')
    setSearch('')
    startTransition(() => {
      router.push('/admin/diagnosticos')
      router.refresh()
    })
  }

  const hasFilters = type !== 'all' || from || to || search

  return (
    <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
      {/* Tabs de tipo */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'empresa', 'pessoal'] as FilterType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
              type === t
                ? 'bg-[#0F172A] text-white'
                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
            }`}
          >
            {t === 'all' ? 'Todos' : t === 'empresa' ? 'Empresa' : 'Pessoal'}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
            Buscar
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apply()}
              placeholder="Nome, empresa ou email..."
              className="w-full rounded-lg border border-[#E3EBF6] bg-white py-2 pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
            De
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-[#E3EBF6] bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
            Até
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-[#E3EBF6] bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={apply}
            disabled={pending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1565C0] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F] disabled:opacity-60"
          >
            <Filter className="h-3.5 w-3.5" />
            Aplicar
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="inline-flex items-center justify-center rounded-lg border border-[#E3EBF6] px-3 py-2 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:opacity-60"
              aria-label="Limpar filtros"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
