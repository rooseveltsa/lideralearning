'use client'

import { useCallback, useState, useTransition } from 'react'
import {
  CheckCircle2,
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

type UnlinkedAssessment = {
  id: string
  user_id: string
  nome_empresa: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  created_at: string
  filled_by_name: string
}

type LinkedAssessment = {
  id: string
  user_id: string
  supervisor_user_id: string | null
  nome_empresa: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  created_at: string
  filled_by_name: string
  supervisor_name: string | null
  has_pdi: boolean
}

type SearchResult = {
  id: string
  full_name: string | null
  role: string
}

type Props = {
  unlinked: UnlinkedAssessment[]
  linked: LinkedAssessment[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClassificacaoClient({ unlinked, linked }: Props) {
  const [linkingId, setLinkingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '--'

  // Debounced search
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
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleLink = (assessmentId: string, supervisorUserId: string) => {
    const fd = new FormData()
    fd.set('assessment_id', assessmentId)
    fd.set('supervisor_user_id', supervisorUserId)
    startTransition(async () => {
      await linkExecToSupervisor(fd)
      setLinkingId(null)
      setSearchQuery('')
      setSearchResults([])
    })
  }

  const handleUnlink = (assessmentId: string) => {
    const fd = new FormData()
    fd.set('assessment_id', assessmentId)
    startTransition(async () => {
      await unlinkExecFromSupervisor(fd)
    })
  }

  return (
    <>
      {/* Unlinked Assessments Section */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Search className="h-5 w-5 text-amber-600" />
          Avaliacoes Executivas Pendentes
          {unlinked.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {unlinked.length}
            </span>
          )}
        </h2>

        {unlinked.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white py-12 text-center shadow-sm">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
            <p className="text-sm font-semibold text-[#64748B]">
              Todas as avaliacoes executivas estao vinculadas.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Preenchido por
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Supervisor avaliado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Data
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Acao
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {unlinked.map((assessment) => (
                    <tr key={assessment.id} className="transition-colors hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#111827]">
                          {assessment.filled_by_name}
                        </p>
                        {assessment.nome_avaliador && (
                          <p className="text-xs text-[#64748B]">{assessment.nome_avaliador}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                        {assessment.nome_empresa || '--'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#111827]">
                          {assessment.nome_supervisor}
                        </p>
                        {assessment.cargo_supervisor && (
                          <p className="text-xs text-[#64748B]">{assessment.cargo_supervisor}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#64748B]">
                        {formatDate(assessment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {linkingId === assessment.id ? (
                          <div className="space-y-3">
                            {/* Search input */}
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                              <input
                                type="text"
                                placeholder="Buscar supervisor por nome..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-lg border border-[#D8E2EF] bg-white py-2 pl-10 pr-8 text-sm text-[#111827] placeholder-[#94A3B8] outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setLinkingId(null)
                                  setSearchQuery('')
                                  setSearchResults([])
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#94A3B8] hover:text-[#111827]"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Search results */}
                            {isSearching && (
                              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Buscando...
                              </div>
                            )}

                            {!isSearching && searchResults.length > 0 && (
                              <div className="max-h-48 overflow-y-auto rounded-lg border border-[#E5E7EB] bg-white">
                                {searchResults.map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleLink(assessment.id, user.id)}
                                    disabled={isPending}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#F0F7FF] disabled:opacity-50"
                                  >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F6] text-xs font-bold text-[#64748B]">
                                      {user.full_name?.charAt(0).toUpperCase() ?? '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-[#111827]">
                                        {user.full_name ?? 'Sem nome'}
                                      </p>
                                      <p className="text-[11px] text-[#94A3B8]">
                                        {user.role === 'hr_manager' ? 'Gestor' : user.role === 'admin' ? 'Admin' : 'Aluno'}
                                      </p>
                                    </div>
                                    <Link2 className="h-3.5 w-3.5 shrink-0 text-[#1565C0]" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                              <p className="text-xs text-[#94A3B8]">Nenhum usuario encontrado.</p>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setLinkingId(assessment.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1565C0]"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            Vincular Supervisor
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Linked Assessments Section */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Link2 className="h-5 w-5 text-emerald-600" />
          Vinculos Corporativos
          {linked.length > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {linked.length}
            </span>
          )}
        </h2>

        {linked.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white py-12 text-center shadow-sm">
            <Link2 className="mx-auto mb-3 h-10 w-10 text-[#D8E2EF]" />
            <p className="text-sm font-semibold text-[#64748B]">
              Nenhum vinculo corporativo criado ainda.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Supervisor (vinculado)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Gestor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Acao
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {linked.map((assessment) => (
                    <tr key={assessment.id} className="transition-colors hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
                            {assessment.supervisor_name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#111827]">
                              {assessment.supervisor_name}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {assessment.nome_supervisor}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                        {assessment.filled_by_name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                        {assessment.nome_empresa || '--'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#64748B]">
                        {formatDate(assessment.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {assessment.has_pdi ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            PDI disponivel
                          </span>
                        ) : (
                          <span className="rounded-md bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">
                            Aguardando autoavaliacao
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleUnlink(assessment.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <Unlink className="h-3.5 w-3.5" />
                          Desvincular
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
