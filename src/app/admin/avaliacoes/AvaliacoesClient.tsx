'use client'

import { useCallback, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  Link2,
  Loader2,
  Search,
  Unlink,
  X,
} from 'lucide-react'

import {
  linkExecToSupervisor,
  searchUsers,
  unlinkExecFromSupervisor,
} from '@/lib/actions/gestao'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SelfAssessment = {
  id: string
  user_id: string
  perfil_lideranca: string | null
  media_dimensoes: number | null
  created_at: string
}

type ExecAssessment = {
  id: string
  user_id: string
  supervisor_user_id: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  nome_empresa: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  created_at: string
  respostas: Record<string, unknown> | null
}

type PdiRow = {
  id: string
  aluno_user_id: string
  plano: Record<string, unknown> | null
  alignment_score: number | null
  created_at: string
}

type SearchResult = {
  id: string
  full_name: string | null
  role: string
}

type Props = {
  selfAssessments: SelfAssessment[]
  execAssessments: ExecAssessment[]
  pdis: PdiRow[]
  profileMap: Record<string, string>
  authUsers: { id: string; email: string }[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { key: 'respostas', label: 'Respostas' },
  { key: 'links', label: 'Links' },
  { key: 'vincular', label: 'Vincular' },
  { key: 'pdis', label: 'PDIs' },
] as const

type TabKey = (typeof TABS)[number]['key']

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  self: { label: 'Auto', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  exec: { label: 'Executiva', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  pdi: { label: 'PDI', color: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const ASSESSMENT_LINKS = [
  {
    label: 'Autoavaliacao',
    url: 'https://lideralearning.vercel.app/treinamento/autoavaliacao',
    color: 'border-blue-200 bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Avaliacao Executiva',
    url: 'https://lideralearning.vercel.app/treinamento/avaliacao-executiva',
    color: 'border-teal-200 bg-teal-50',
    iconColor: 'text-teal-600',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('pt-BR') : '--'
}

function getName(profileMap: Record<string, string>, userId: string) {
  return profileMap[userId] ?? 'Desconhecido'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AvaliacoesClient({
  selfAssessments,
  execAssessments,
  pdis,
  profileMap,
  authUsers,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('respostas')
  const [typeFilter, setTypeFilter] = useState<'all' | 'self' | 'exec'>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  // Vincular tab state
  const [linkingId, setLinkingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ── Unified responses ──────────────────────────────────
  type UnifiedRow = {
    id: string
    uniqueKey: string
    userId: string
    type: 'self' | 'exec'
    score: number | null
    profile: string | null
    date: string
    detail: Record<string, unknown> | null
  }

  const unifiedRows: UnifiedRow[] = [
    ...selfAssessments.map((s) => ({
      id: s.id,
      uniqueKey: `self-${s.id}`,
      userId: s.user_id,
      type: 'self' as const,
      score: s.media_dimensoes,
      profile: s.perfil_lideranca,
      date: s.created_at,
      detail: null,
    })),
    ...execAssessments.map((e) => ({
      id: e.id,
      uniqueKey: `exec-${e.id}`,
      userId: e.user_id,
      type: 'exec' as const,
      score: e.media_dimensoes,
      profile: e.nome_avaliador,
      date: e.created_at,
      detail: e.respostas,
    })),
  ]
    .filter((r) => typeFilter === 'all' || r.type === typeFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // ── Copy to clipboard ──────────────────────────────────
  const handleCopy = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      // Fallback
    }
  }, [])

  // ── Vincular: search ───────────────────────────────────
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const results = await searchUsers(query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleLink = useCallback(
    (assessmentId: string, supervisorId: string) => {
      const fd = new FormData()
      fd.set('assessmentId', assessmentId)
      fd.set('supervisorUserId', supervisorId)
      startTransition(async () => {
        await linkExecToSupervisor(fd)
        setLinkingId(null)
        setSearchQuery('')
        setSearchResults([])
      })
    },
    [startTransition]
  )

  const handleUnlink = useCallback(
    (assessmentId: string) => {
      const fd = new FormData()
      fd.set('assessmentId', assessmentId)
      startTransition(async () => {
        await unlinkExecFromSupervisor(fd)
      })
    },
    [startTransition]
  )

  // ── PDI status builder ─────────────────────────────────
  type PdiStatus = {
    userId: string
    name: string
    hasSelf: boolean
    hasExec: boolean
    pdi: PdiRow | null
    alignmentScore: number | null
  }

  const pdiStatusMap = new Map<string, PdiStatus>()

  // Collect all unique users from self and exec
  const allUserIds = new Set<string>()
  for (const s of selfAssessments) allUserIds.add(s.user_id)
  for (const e of execAssessments) allUserIds.add(e.user_id)

  for (const uid of allUserIds) {
    const hasSelf = selfAssessments.some((s) => s.user_id === uid)
    const hasExec = execAssessments.some((e) => e.user_id === uid)
    const pdi = pdis.find((p) => p.aluno_user_id === uid) ?? null

    pdiStatusMap.set(uid, {
      userId: uid,
      name: getName(profileMap, uid),
      hasSelf,
      hasExec,
      pdi,
      alignmentScore: pdi?.alignment_score ?? null,
    })
  }

  const pdiStatuses = Array.from(pdiStatusMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR')
  )

  // ── Vincular data ──────────────────────────────────────
  const pendingExecs = execAssessments.filter((e) => !e.supervisor_user_id)
  const linkedExecs = execAssessments.filter((e) => !!e.supervisor_user_id)

  // ── Link counts ────────────────────────────────────────
  const selfCount = selfAssessments.length
  const execCount = execAssessments.length

  return (
    <div>
      {/* Tab Bar */}
      <div className="border-b border-[#E5ECF6]">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap pb-3 text-[13px] font-bold transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#1565C0] text-[#1565C0]'
                  : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-5">
        {/* ── Tab: Respostas ──────────────────────────────── */}
        {activeTab === 'respostas' && (
          <div>
            {/* Type filter */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Filtrar:
              </span>
              {(['all', 'self', 'exec'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-colors ${
                    typeFilter === f
                      ? 'border-[#1565C0] bg-[#1565C0]/10 text-[#1565C0]'
                      : 'border-[#D8E2EF] text-[#64748B] hover:border-[#94A3B8]'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'self' ? 'Auto' : 'Executiva'}
                </button>
              ))}
            </div>

            {unifiedRows.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
                <ClipboardList className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-extrabold text-[#111827]">
                  Nenhuma resposta encontrada
                </h3>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  As avaliacoes preenchidas aparecerao aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="w-8 px-4 py-3" />
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Pessoa
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Perfil / Score
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {unifiedRows.map((row) => {
                        const isExpanded = expandedRow === row.uniqueKey
                        const badge = TYPE_BADGES[row.type]
                        return (
                          <TableRowGroup key={row.uniqueKey}>
                            <tr
                              className="h-[44px] cursor-pointer transition-colors hover:bg-[#F9FBFE]"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : row.uniqueKey)
                              }
                            >
                              <td className="px-4">
                                {isExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
                                )}
                              </td>
                              <td className="px-4 text-[13px] font-bold text-[#0F172A]">
                                {getName(profileMap, row.userId)}
                              </td>
                              <td className="px-4">
                                <span
                                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                              </td>
                              <td className="px-4 text-[13px] text-[#334155]">
                                {row.type === 'self'
                                  ? row.profile ?? '--'
                                  : row.score != null
                                    ? row.score.toFixed(1)
                                    : '--'}
                              </td>
                              <td className="px-4 text-[13px] text-[#64748B]">
                                {formatDate(row.date)}
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-[#F7FAFE]">
                                <td colSpan={5} className="px-6 py-4">
                                  <div className="text-[12px] text-[#334155]">
                                    <p className="font-bold text-[#0F172A]">
                                      Detalhes da resposta
                                    </p>
                                    {row.type === 'self' && (
                                      <div className="mt-2 space-y-1">
                                        <p>
                                          <span className="font-semibold">Perfil:</span>{' '}
                                          {row.profile ?? 'Nao definido'}
                                        </p>
                                        <p>
                                          <span className="font-semibold">
                                            Media dimensoes:
                                          </span>{' '}
                                          {row.score != null ? row.score.toFixed(2) : '--'}
                                        </p>
                                      </div>
                                    )}
                                    {row.type === 'exec' && (
                                      <div className="mt-2 space-y-1">
                                        <p>
                                          <span className="font-semibold">Avaliador:</span>{' '}
                                          {row.profile ?? '--'}
                                        </p>
                                        <p>
                                          <span className="font-semibold">Score:</span>{' '}
                                          {row.score != null ? row.score.toFixed(2) : '--'}
                                        </p>
                                        {row.detail && (
                                          <details className="mt-2">
                                            <summary className="cursor-pointer font-semibold text-[#1565C0]">
                                              Ver respostas completas
                                            </summary>
                                            <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-white p-3 text-[11px]">
                                              {JSON.stringify(row.detail, null, 2)}
                                            </pre>
                                          </details>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </TableRowGroup>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Links ─────────────────────────────────── */}
        {activeTab === 'links' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {ASSESSMENT_LINKS.map((link) => (
              <div
                key={link.url}
                className={`rounded-2xl border p-5 shadow-sm ${link.color}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[13px] font-extrabold text-[#0F172A]">
                      {link.label}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#64748B]">
                      {link.label === 'Autoavaliacao'
                        ? `${selfCount} respostas`
                        : `${execCount} respostas`}
                    </p>
                  </div>
                  <Link2 className={`h-4 w-4 ${link.iconColor}`} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={link.url}
                    className="flex-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-2 text-[11px] text-[#334155]"
                  />
                  <button
                    onClick={() => handleCopy(link.url)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8E2EF] bg-white transition-colors hover:bg-[#F4F8FD]"
                  >
                    {copiedUrl === link.url ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#64748B]" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Vincular ──────────────────────────────── */}
        {activeTab === 'vincular' && (
          <div className="space-y-6">
            {/* Pending */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-[#0F172A]">
                <Eye className="h-4 w-4 text-amber-600" />
                Pendentes de vinculacao ({pendingExecs.length})
              </h3>

              {pendingExecs.length === 0 ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-[13px] text-emerald-700">
                  Todas as avaliacoes executivas estao vinculadas.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Avaliado
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Supervisor (nome)
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Data
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Acao
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {pendingExecs.map((e) => (
                        <tr key={e.id} className="h-[44px]">
                          <td className="px-4 text-[13px] font-bold text-[#0F172A]">
                            {getName(profileMap, e.user_id)}
                          </td>
                          <td className="px-4 text-[13px] text-[#64748B]">
                            {e.nome_supervisor}
                          </td>
                          <td className="px-4 text-[13px] text-[#64748B]">
                            {formatDate(e.created_at)}
                          </td>
                          <td className="px-4 text-right">
                            {linkingId === e.id ? (
                              <div className="inline-flex items-center gap-2">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                                  <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    value={searchQuery}
                                    onChange={(ev) => handleSearch(ev.target.value)}
                                    className="w-48 rounded-lg border border-[#D8E2EF] py-1.5 pl-7 pr-3 text-[12px]"
                                    autoFocus
                                  />
                                  {isSearching && (
                                    <Loader2 className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[#94A3B8]" />
                                  )}
                                  {searchResults.length > 0 && (
                                    <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-xl border border-[#D8E2EF] bg-white p-1 shadow-lg">
                                      {searchResults.map((sr) => (
                                        <button
                                          key={sr.id}
                                          onClick={() => handleLink(e.id, sr.id)}
                                          disabled={isPending}
                                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] transition-colors hover:bg-[#F4F8FD] disabled:opacity-50"
                                        >
                                          <span className="font-bold text-[#0F172A]">
                                            {sr.full_name ?? 'Sem nome'}
                                          </span>
                                          <span className="rounded-full bg-[#E5ECF6] px-2 py-0.5 text-[10px] text-[#64748B]">
                                            {sr.role}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setLinkingId(null)
                                    setSearchQuery('')
                                    setSearchResults([])
                                  }}
                                  className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F4F8FD]"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setLinkingId(e.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-1.5 text-[11px] font-bold text-[#1565C0] transition-colors hover:bg-[#F4F8FD]"
                              >
                                <Link2 className="h-3 w-3" />
                                Vincular
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Linked */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-[#0F172A]">
                <Link2 className="h-4 w-4 text-emerald-600" />
                Vinculadas ({linkedExecs.length})
              </h3>

              {linkedExecs.length === 0 ? (
                <div className="rounded-xl border border-[#D8E2EF] bg-white p-4 text-center text-[13px] text-[#64748B]">
                  Nenhuma avaliacao vinculada ainda.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Avaliado
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Supervisor vinculado
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Score
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Acao
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {linkedExecs.map((e) => (
                        <tr key={e.id} className="h-[44px]">
                          <td className="px-4 text-[13px] font-bold text-[#0F172A]">
                            {getName(profileMap, e.user_id)}
                          </td>
                          <td className="px-4 text-[13px] text-[#334155]">
                            {e.supervisor_user_id
                              ? getName(profileMap, e.supervisor_user_id)
                              : e.nome_supervisor}
                          </td>
                          <td className="px-4 text-[13px] text-[#64748B]">
                            {e.media_dimensoes != null ? e.media_dimensoes.toFixed(1) : '--'}
                          </td>
                          <td className="px-4 text-right">
                            <button
                              onClick={() => handleUnlink(e.id)}
                              disabled={isPending}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
                            >
                              <Unlink className="h-3 w-3" />
                              Desvincular
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: PDIs ──────────────────────────────────── */}
        {activeTab === 'pdis' && (
          <div>
            {pdiStatuses.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
                <FileText className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-extrabold text-[#111827]">
                  Nenhum aluno com avaliacoes
                </h3>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  PDIs serao gerados quando houver avaliacoes.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Aluno
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Auto
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Executiva
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Status PDI
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Alinhamento
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Acao
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5ECF6]">
                    {pdiStatuses.map((ps) => {
                      let statusLabel: string
                      let statusColor: string

                      if (ps.pdi) {
                        statusLabel = 'Gerado'
                        statusColor =
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                      } else if (ps.hasSelf && ps.hasExec) {
                        statusLabel = 'Pronto para gerar'
                        statusColor = 'bg-blue-50 text-blue-700 border-blue-200'
                      } else if (ps.hasSelf) {
                        statusLabel = 'Aguardando executiva'
                        statusColor = 'bg-amber-50 text-amber-700 border-amber-200'
                      } else {
                        statusLabel = 'Sem avaliacoes'
                        statusColor = 'bg-gray-50 text-gray-500 border-gray-200'
                      }

                      return (
                        <tr key={ps.userId} className="h-[44px]">
                          <td className="px-4 text-[13px] font-bold text-[#0F172A]">
                            {ps.name}
                          </td>
                          <td className="px-4">
                            {ps.hasSelf ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <X className="h-4 w-4 text-[#CBD5E1]" />
                            )}
                          </td>
                          <td className="px-4">
                            {ps.hasExec ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <X className="h-4 w-4 text-[#CBD5E1]" />
                            )}
                          </td>
                          <td className="px-4">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColor}`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-4 text-[13px] text-[#334155]">
                            {ps.alignmentScore != null
                              ? `${ps.alignmentScore.toFixed(0)}%`
                              : '--'}
                          </td>
                          <td className="px-4 text-right">
                            {ps.pdi ? (
                              <a
                                href={`/admin/relatorios/pdi/${ps.userId}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1565C0] hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                Ver relatorio
                              </a>
                            ) : (
                              <span className="text-[11px] text-[#94A3B8]">--</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table Row Group (fragment wrapper for expandable rows)
// ---------------------------------------------------------------------------

function TableRowGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
