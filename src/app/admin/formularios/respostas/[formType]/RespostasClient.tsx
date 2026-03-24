'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Hash,
  Search,
  User,
} from 'lucide-react'

import type { ResponseRow } from './page'

type Props = {
  rows: ResponseRow[]
  formType: string
  config: { titulo: string; cor: string; bgCor: string }
  labelMap: Record<string, string>
}

/* ─────────────────────────────────────────────
   Detail renderers per form type
───────────────────────────────────────────── */

function AutoavaliacaoDetail({ details, labelMap }: { details: Record<string, unknown>; labelMap: Record<string, string> }) {
  const questionKeys = ['q_percepcao', 'q_gestao', 'q_comunicacao', 'q_tecnologia', 'q_etica', 'q_dor']
  const textKeys = ['texto_dor_atual', 'texto_custo_futuro']

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {questionKeys.map((k) => (
          <div key={k} className="rounded-lg border border-[#E5ECF6] bg-[#F8FAFD] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-[#64748B]">{labelMap[k] ?? k}</p>
            <p className="mt-0.5 text-lg font-extrabold text-[#0F172A]">
              {details[k] != null ? String(details[k]) : '--'}/3
            </p>
          </div>
        ))}
      </div>

      {textKeys.map((k) => {
        const val = details[k] as string | null
        if (!val) return null
        return (
          <div key={k} className="rounded-lg border border-[#E5ECF6] bg-[#F8FAFD] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-[#64748B]">{labelMap[k] ?? k}</p>
            <p className="mt-1 text-sm text-[#374151] leading-relaxed">{val}</p>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-2 pt-2">
        <button className="rounded-lg bg-[#7B1FA2] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#6A1B9A]">
          Gerar PDI
        </button>
        <button className="rounded-lg bg-[#1565C0] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#0D47A1]">
          Classificar como Aluno
        </button>
      </div>
    </div>
  )
}

function ExecutivaDetail({ details, labelMap }: { details: Record<string, unknown>; labelMap: Record<string, string> }) {
  const dimKeys = [
    'dim_comunicacao', 'dim_tomada_decisao', 'dim_gestao_equipe',
    'dim_orientacao_resultados', 'dim_adaptabilidade', 'dim_lideranca_estrategica',
    'dim_desenvolvimento_pessoas', 'dim_inovacao', 'dim_etica_integridade', 'dim_gestao_crise',
  ]
  const textKeys = ['ponto_forte', 'area_melhoria', 'impacto_equipe', 'recomendacao', 'comentario_adicional']
  const textLabels: Record<string, string> = {
    ponto_forte: 'Ponto Forte',
    area_melhoria: 'Area de Melhoria',
    impacto_equipe: 'Impacto na Equipe',
    recomendacao: 'Recomendacao',
    comentario_adicional: 'Comentario Adicional',
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 md:grid-cols-5">
        <div className="rounded-lg border border-[#E0F2F1] bg-[#E0F2F1] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#00695C]">Empresa</p>
          <p className="font-semibold text-[#0F172A]">{(details.nome_empresa as string) || '--'}</p>
        </div>
        <div className="rounded-lg border border-[#E0F2F1] bg-[#E0F2F1] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#00695C]">Avaliador</p>
          <p className="font-semibold text-[#0F172A]">{(details.nome_avaliador as string) || '--'}</p>
        </div>
        <div className="rounded-lg border border-[#E0F2F1] bg-[#E0F2F1] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#00695C]">Supervisor</p>
          <p className="font-semibold text-[#0F172A]">{(details.nome_supervisor as string) || '--'}</p>
        </div>
        <div className="rounded-lg border border-[#E0F2F1] bg-[#E0F2F1] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#00695C]">Cargo Supervisor</p>
          <p className="font-semibold text-[#0F172A]">{(details.cargo_supervisor as string) || '--'}</p>
        </div>
        <div className="rounded-lg border border-[#E0F2F1] bg-[#E0F2F1] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#00695C]">Recomendacao Geral</p>
          <p className="font-semibold text-[#0F172A]">{(details.recomendacao_geral as string) || '--'}</p>
        </div>
      </div>

      <p className="text-[11px] font-bold uppercase text-[#64748B]">10 Dimensoes (1-5)</p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {dimKeys.map((k) => (
          <div key={k} className="rounded-lg border border-[#E5ECF6] bg-[#F8FAFD] px-2 py-1.5">
            <p className="text-[10px] font-bold text-[#64748B]">{labelMap[k] ?? k}</p>
            <p className="text-lg font-extrabold text-[#0F172A]">
              {details[k] != null ? String(details[k]) : '--'}<span className="text-xs font-normal text-[#94A3B8]">/5</span>
            </p>
          </div>
        ))}
      </div>

      {textKeys.map((k) => {
        const val = details[k] as string | null
        if (!val) return null
        return (
          <div key={k} className="rounded-lg border border-[#E5ECF6] bg-[#F8FAFD] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-[#64748B]">{textLabels[k] ?? k}</p>
            <p className="mt-1 text-sm text-[#374151] leading-relaxed">{val}</p>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-2 pt-2">
        <button className="rounded-lg bg-[#00695C] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#004D40]">
          Vincular ao Supervisor
        </button>
      </div>
    </div>
  )
}

function PdiDetail({ details, labelMap }: { details: Record<string, unknown>; labelMap: Record<string, string> }) {
  const dimKeys = ['dim_facilitador', 'dim_orientador', 'dim_garantidor', 'dim_estrategista', 'dim_mentor']
  const hsKeys = ['hs_execucao', 'hs_processos', 'hs_ferramentas', 'hs_padroes']
  const ssKeys = ['ss_inteligencia_emocional', 'ss_feedback', 'ss_conflitos_geracionais', 'ss_visao_futuro']
  const textKeys = ['compromisso_comportamento', 'compromisso_dados', 'compromisso_sucessao', 'texto_triade']

  const renderScoreGrid = (keys: string[], title: string) => (
    <div>
      <p className="mb-1 text-[11px] font-bold uppercase text-[#64748B]">{title}</p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {keys.map((k) => (
          <div key={k} className="rounded-lg border border-[#F3E5F5] bg-[#F3E5F5] px-2 py-1.5">
            <p className="text-[10px] font-bold text-[#7B1FA2]">{labelMap[k] ?? k}</p>
            <p className="text-lg font-extrabold text-[#0F172A]">
              {details[k] != null ? String(details[k]) : '--'}<span className="text-xs font-normal text-[#94A3B8]">/5</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="flex gap-3 text-xs">
        <span className="rounded-md bg-[#F3E5F5] px-2 py-1 font-bold text-[#7B1FA2]">Cargo: {(details.cargo as string) || '--'}</span>
        <span className="rounded-md bg-[#F3E5F5] px-2 py-1 font-bold text-[#7B1FA2]">Tempo: {(details.tempo_funcao as string) || '--'}</span>
        <span className="rounded-md bg-[#F3E5F5] px-2 py-1 font-bold text-[#7B1FA2]">Depto: {(details.departamento as string) || '--'}</span>
      </div>
      {renderScoreGrid(dimKeys, 'Dimensoes de Lideranca')}
      {renderScoreGrid(hsKeys, 'Hard Skills')}
      {renderScoreGrid(ssKeys, 'Soft Skills')}

      {textKeys.map((k) => {
        const val = details[k] as string | null
        if (!val) return null
        return (
          <div key={k} className="rounded-lg border border-[#F3E5F5] bg-[#FAFBFC] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-[#64748B]">{labelMap[k] ?? k}</p>
            <p className="mt-1 text-sm text-[#374151] leading-relaxed">{val}</p>
          </div>
        )
      })}
    </div>
  )
}

function GenericDetail({ details }: { details: Record<string, unknown> }) {
  const skipKeys = ['id', 'user_id', 'created_at']
  const entries = Object.entries(details).filter(([k, v]) => !skipKeys.includes(k) && v != null && v !== '')

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {entries.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-[#E5ECF6] bg-[#F8FAFD] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[#64748B]">{k}</p>
          <p className="text-sm font-semibold text-[#0F172A]">{String(v)}</p>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Client Component
───────────────────────────────────────────── */

export default function RespostasClient({ rows, formType, config, labelMap }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (r) =>
        r.respondente.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.perfil && r.perfil.toLowerCase().includes(q)) ||
        (r.extra && r.extra.toLowerCase().includes(q))
    )
  }, [rows, search])

  const perfilColors: Record<string, { bg: string; text: string }> = {
    'Supervisor Reativo': { bg: 'bg-red-100', text: 'text-red-700' },
    'Em Transicao': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Lider de Valor': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-8 text-center text-xs text-[#94A3B8]">
        Nenhuma resposta registrada para este formulario.
      </p>
    )
  }

  const renderDetail = (row: ResponseRow) => {
    switch (formType) {
      case 'autoavaliacao':
        return <AutoavaliacaoDetail details={row.details} labelMap={labelMap} />
      case 'avaliacao-executiva':
        return <ExecutivaDetail details={row.details} labelMap={labelMap} />
      case 'pdi':
        return <PdiDetail details={row.details} labelMap={labelMap} />
      default:
        return <GenericDetail details={row.details} />
    }
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#D8E2EF] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]"
        />
      </div>

      <p className="text-[11px] text-[#94A3B8]">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#D8E2EF] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5ECF6] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> Respondente</span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Data</span>
                </th>
                {(formType === 'autoavaliacao' || formType === 'pdi' || formType === 'avaliacao-executiva') && (
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" /> Score</span>
                  </th>
                )}
                {(formType === 'autoavaliacao' || formType === 'avaliacao-executiva') && (
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Perfil / Info
                  </th>
                )}
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Acao
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((row) => {
                const isExpanded = expandedId === row.id
                const pColor = row.perfil ? perfilColors[row.perfil] : null

                return (
                  <tr key={row.id} className="group">
                    <td colSpan={99} className="p-0">
                      {/* Summary row */}
                      <div
                        className={`flex cursor-pointer items-center transition-colors hover:bg-[#FAFCFF] ${isExpanded ? 'bg-[#F8FAFD]' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      >
                        <div className="flex-1 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/alunos/${row.user_id}`}
                              className="font-semibold text-[#0F172A] hover:text-[#1565C0]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {row.respondente}
                            </Link>
                            {row.email && (
                              <span className="text-[11px] text-[#94A3B8]">{row.email}</span>
                            )}
                          </div>
                        </div>
                        <div className="px-4 py-3 text-xs text-[#64748B]">
                          {new Date(row.data).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </div>
                        {(formType === 'autoavaliacao' || formType === 'pdi' || formType === 'avaliacao-executiva') && (
                          <div className="px-4 py-3">
                            {row.score ? (
                              <span
                                className="inline-flex rounded px-1.5 py-0.5 text-[11px] font-bold"
                                style={{ backgroundColor: config.bgCor, color: config.cor }}
                              >
                                {row.score}
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#CBD5E1]">--</span>
                            )}
                          </div>
                        )}
                        {(formType === 'autoavaliacao' || formType === 'avaliacao-executiva') && (
                          <div className="px-4 py-3">
                            {row.perfil ? (
                              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${pColor?.bg ?? 'bg-gray-100'} ${pColor?.text ?? 'text-gray-600'}`}>
                                {row.perfil}
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#CBD5E1]">--</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-4 py-3">
                          <Link
                            href={`/admin/alunos/${row.user_id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver ficha
                          </Link>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[#94A3B8]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
                          )}
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-[#E5ECF6] bg-[#FAFBFC] px-6 py-4">
                          {renderDetail(row)}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
