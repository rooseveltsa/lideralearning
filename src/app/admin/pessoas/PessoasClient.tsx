'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  ExternalLink,
  MessageCircle,
  Search,
  Users,
  XCircle,
} from 'lucide-react'

import { classificarUsuario } from '@/lib/actions/inscritos'

// ── Types ──────────────────────────────────────────────

export type PessoaRow = {
  id: string
  full_name: string | null
  email: string
  whatsapp: string | null
  company: string | null
  role: string
  created_at: string
  source: 'site' | 'presencial' | 'admin'
  hasAutoavaliacao: boolean
  hasExec: boolean
  hasPdi: boolean
  hasTraining: boolean
  prospectStatus: string | null
  selfPerfil: string | null
  selfScore: number | null
  alunosCount: number
}

type FilterTab = 'todos' | 'leads' | 'alunos' | 'gestores'
type OriginFilter = 'todos' | 'site' | 'presencial' | 'admin'
type AssessmentFilter = 'todos' | 'com' | 'sem'

// ── Constants ──────────────────────────────────────────

const sourceBadge: Record<string, { bg: string; text: string; label: string }> = {
  site: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Site' },
  presencial: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Presencial' },
  admin: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Admin' },
}

const classificationBadge: Record<string, { bg: string; text: string; label: string }> = {
  student: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Lead' },
  hr_manager: { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Gestor' },
  admin: { bg: 'bg-slate-50', text: 'text-slate-700', label: 'Admin' },
}

const perfilBadge: Record<string, { bg: string; text: string; label: string }> = {
  reativo: { bg: 'bg-red-50', text: 'text-red-700', label: 'Reativo' },
  transicao: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Transicao' },
  lider_valor: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Lider de Valor' },
}

// ── Component ──────────────────────────────────────────

type Props = {
  pessoas: PessoaRow[]
  initialTab?: string
  initialQuery?: string
}

export default function PessoasClient({ pessoas, initialTab, initialQuery }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialQuery ?? '')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [originFilter, setOriginFilter] = useState<OriginFilter>('todos')
  const [assessmentFilter, setAssessmentFilter] = useState<AssessmentFilter>('todos')

  const activeTab = (initialTab as FilterTab) || 'todos'

  // ── Counts ──
  const counts = useMemo(() => {
    const total = pessoas.length
    const leads = pessoas.filter((p) => p.role === 'student' && p.source === 'site').length
    const alunos = pessoas.filter(
      (p) => p.role === 'student' && p.source !== 'site',
    ).length
    const gestores = pessoas.filter((p) => p.role === 'hr_manager').length
    return { total, leads, alunos, gestores }
  }, [pessoas])

  // ── Filtering ──
  const filtered = useMemo(() => {
    let result = pessoas

    // Tab filter
    if (activeTab === 'leads') result = result.filter((p) => p.role === 'student' && p.source === 'site')
    else if (activeTab === 'alunos') result = result.filter((p) => p.role === 'student' && p.source !== 'site')
    else if (activeTab === 'gestores') result = result.filter((p) => p.role === 'hr_manager')

    // Origin filter
    if (originFilter !== 'todos') result = result.filter((p) => p.source === originFilter)

    // Assessment filter
    if (assessmentFilter === 'com') result = result.filter((p) => p.hasAutoavaliacao || p.hasExec || p.hasPdi)
    else if (assessmentFilter === 'sem') result = result.filter((p) => !p.hasAutoavaliacao && !p.hasExec && !p.hasPdi)

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          (p.full_name?.toLowerCase().includes(q)) ||
          p.email.toLowerCase().includes(q),
      )
    }

    return result
  }, [pessoas, activeTab, originFilter, assessmentFilter, search])

  // ── Tab navigation ──
  const setTab = useCallback(
    (tab: FilterTab) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tab === 'todos') params.delete('tab')
      else params.set('tab', tab)
      if (search) params.set('q', search)
      else params.delete('q')
      router.push(`/admin/pessoas${params.toString() ? `?${params.toString()}` : ''}`)
    },
    [router, searchParams, search],
  )

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: counts.total },
    { key: 'leads', label: 'Leads', count: counts.leads },
    { key: 'alunos', label: 'Alunos', count: counts.alunos },
    { key: 'gestores', label: 'Gestores', count: counts.gestores },
  ]

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '--'

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0F172A]">
            Pessoas{' '}
            <span className="text-base font-medium text-[#94A3B8]">
              ({counts.total})
            </span>
          </h1>
          <p className="text-xs text-[#64748B]">
            Todos os cadastros consolidados: leads, alunos e gestores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-xl border border-[#E5ECF6] bg-white pl-9 pr-3 text-sm text-[#334155] placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0]/20"
            />
          </div>

          {/* Origin filter */}
          <div className="relative">
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value as OriginFilter)}
              className="h-9 appearance-none rounded-xl border border-[#E5ECF6] bg-white pl-3 pr-8 text-xs font-medium text-[#334155] focus:border-[#1565C0] focus:outline-none"
            >
              <option value="todos">Todas origens</option>
              <option value="site">Site</option>
              <option value="presencial">Presencial</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          </div>

          {/* Assessment filter */}
          <div className="relative">
            <select
              value={assessmentFilter}
              onChange={(e) => setAssessmentFilter(e.target.value as AssessmentFilter)}
              className="h-9 appearance-none rounded-xl border border-[#E5ECF6] bg-white pl-3 pr-8 text-xs font-medium text-[#334155] focus:border-[#1565C0] focus:outline-none"
            >
              <option value="todos">Todas avaliacoes</option>
              <option value="com">Com avaliacao</option>
              <option value="sem">Sem avaliacao</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          </div>

          {/* Export button (future) */}
          <button
            disabled
            className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E5ECF6] bg-white px-3 text-xs font-bold text-[#94A3B8] opacity-50"
            title="Em breve"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-[#E5ECF6]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`relative px-4 pb-2.5 pt-1 text-sm font-bold transition-colors ${
              activeTab === tab.key
                ? 'text-[#1565C0]'
                : 'text-[#94A3B8] hover:text-[#64748B]'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-0.5 text-[11px] font-medium opacity-60">
              {tab.count}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-[#1565C0]" />
            )}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8E2EF] bg-white py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <p className="mt-3 text-sm font-bold text-[#0F172A]">
            Nenhuma pessoa encontrada
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            {search
              ? 'Tente ajustar os termos de busca ou filtros.'
              : 'Novos cadastros aparecerao aqui automaticamente.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Nome
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Email
                  </th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Origem
                  </th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    <span title="Autoavaliacao / Exec / PDI">Avaliacoes</span>
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Classificacao
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((p) => {
                  const source = sourceBadge[p.source] ?? sourceBadge.site
                  const classification = classificationBadge[p.role] ?? classificationBadge.student
                  const whatsappLink = p.whatsapp
                    ? `https://wa.me/${p.whatsapp.replace(/\D/g, '')}`
                    : null
                  const isExpanded = expandedId === p.id

                  return (
                    <TableRow
                      key={p.id}
                      pessoa={p}
                      source={source}
                      classification={classification}
                      whatsappLink={whatsappLink}
                      isExpanded={isExpanded}
                      onToggleExpand={() =>
                        setExpandedId(isExpanded ? null : p.id)
                      }
                      formatDate={formatDate}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Table Row (with inline detail) ─────────────────────

function TableRow({
  pessoa: p,
  source,
  classification,
  whatsappLink,
  isExpanded,
  onToggleExpand,
  formatDate,
}: {
  pessoa: PessoaRow
  source: { bg: string; text: string; label: string }
  classification: { bg: string; text: string; label: string }
  whatsappLink: string | null
  isExpanded: boolean
  onToggleExpand: () => void
  formatDate: (d: string) => string
}) {
  const perfil = p.selfPerfil ? perfilBadge[p.selfPerfil] : null

  return (
    <>
      <tr className="h-11 transition-colors hover:bg-[#FAFCFF]">
        {/* Nome */}
        <td className="px-4 py-2">
          <Link
            href={`/admin/pessoas/${p.id}`}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F6] text-[11px] font-bold text-[#64748B]">
              {p.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <span className="text-sm font-semibold text-[#111827] group-hover:text-[#1565C0]">
              {p.full_name ?? 'Sem nome'}
            </span>
          </Link>
        </td>

        {/* Email */}
        <td className="max-w-[180px] truncate px-4 py-2 text-xs text-[#64748B]">
          {p.email}
        </td>

        {/* Origem */}
        <td className="px-4 py-2 text-center">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${source.bg} ${source.text}`}
          >
            {source.label}
          </span>
        </td>

        {/* Avaliacoes (3 icons) */}
        <td className="px-4 py-2">
          <div className="flex items-center justify-center gap-1.5">
            <span title="Autoavaliacao">
              {p.hasAutoavaliacao ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <span className="text-[11px] text-[#D1D5DB]">--</span>
              )}
            </span>
            <span title="Avaliacao Executiva">
              {p.hasExec ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <span className="text-[11px] text-[#D1D5DB]">--</span>
              )}
            </span>
            <span title="PDI">
              {p.hasPdi ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <span className="text-[11px] text-[#D1D5DB]">--</span>
              )}
            </span>
          </div>
        </td>

        {/* Classificacao */}
        <td className="px-4 py-2">
          <form action={classificarUsuario} className="flex items-center gap-1.5">
            <input type="hidden" name="userId" value={p.id} />
            <select
              name="role"
              defaultValue={p.role}
              className="h-7 rounded-lg border border-[#E5ECF6] bg-white px-2 text-[11px] font-medium text-[#334155] focus:border-[#1565C0] focus:outline-none"
            >
              <option value="student">Lead / Aluno</option>
              <option value="hr_manager">Gestor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-[#1565C0] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0B4A8F]"
            >
              OK
            </button>
          </form>
        </td>

        {/* Acoes */}
        <td className="px-4 py-2 text-right">
          <div className="flex items-center justify-end gap-1">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100"
                title="WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              onClick={onToggleExpand}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isExpanded
                  ? 'border-[#1565C0] bg-[#EBF2FC] text-[#1565C0]'
                  : 'border-[#E5ECF6] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
              title="Detalhes"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <Link
              href={`/admin/pessoas/${p.id}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5ECF6] bg-white text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
              title="Ficha completa"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </td>
      </tr>

      {/* Inline detail row */}
      {isExpanded && (
        <tr className="bg-[#FAFCFF]">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Left: Profile info */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Informacoes
                </p>
                <div className="space-y-1 text-xs text-[#374151]">
                  {p.whatsapp && (
                    <p>
                      <span className="font-semibold text-[#64748B]">Tel:</span>{' '}
                      {p.whatsapp}
                    </p>
                  )}
                  {p.company && (
                    <p>
                      <span className="font-semibold text-[#64748B]">Empresa:</span>{' '}
                      {p.company}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-[#64748B]">Cadastro:</span>{' '}
                    {formatDate(p.created_at)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#64748B]">Origem:</span>{' '}
                    {source.label}
                  </p>
                  {p.role === 'hr_manager' && p.alunosCount > 0 && (
                    <p>
                      <span className="font-semibold text-[#64748B]">Alunos vinculados:</span>{' '}
                      {p.alunosCount}
                    </p>
                  )}
                </div>
              </div>

              {/* Center: Assessment summary */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Avaliacoes
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {p.hasAutoavaliacao ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-[#D1D5DB]" />
                    )}
                    <span className={p.hasAutoavaliacao ? 'text-[#111827]' : 'text-[#94A3B8]'}>
                      Autoavaliacao
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.hasExec ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-[#D1D5DB]" />
                    )}
                    <span className={p.hasExec ? 'text-[#111827]' : 'text-[#94A3B8]'}>
                      Avaliacao Executiva
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.hasPdi ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-[#D1D5DB]" />
                    )}
                    <span className={p.hasPdi ? 'text-[#111827]' : 'text-[#94A3B8]'}>PDI</span>
                  </div>
                  {perfil && (
                    <div className="mt-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${perfil.bg} ${perfil.text}`}
                      >
                        {perfil.label}
                      </span>
                      {p.selfScore !== null && (
                        <span className="ml-2 text-[11px] font-bold text-[#334155]">
                          {p.selfScore} pts
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Quick actions */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Acoes rapidas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button className="rounded-lg bg-[#1565C0] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#0D47A1]">
                    Enviar Formulario
                  </button>
                  <button className="rounded-lg bg-[#7B1FA2] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#6A1B9A]">
                    Agendar Mentoria
                  </button>
                  <button className="rounded-lg bg-[#F57C00] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#E65100]">
                    Adicionar a Turma
                  </button>
                  <Link
                    href={`/admin/pessoas/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-1.5 text-[11px] font-bold text-[#334155] hover:bg-[#F7FAFE]"
                  >
                    Ficha completa
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
