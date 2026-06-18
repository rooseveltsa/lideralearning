import Link from 'next/link'
import { AlertTriangle, ArrowLeft, GraduationCap, Trophy } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import { faixaDe } from '@/lib/formacao/formacao-data'

export const metadata = { title: 'Diagnóstico de Formação — Resultados | Admin' }

type TopModulo = { id: string; titulo: string; inNorm: number | null }

type Row = {
  id: string
  nome: string
  email: string
  empresa: string | null
  setor: string | null
  tempo_funcao: string | null
  qtd_liderados: string | null
  top_modulos: TopModulo[] | null
  gaps: { flags?: { tudoUrgente?: boolean } } | null
  created_at: string
}

function formatData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return '—'
  }
}

function inColor(inNorm: number | null): string {
  if (inNorm === null) return '#94A3B8'
  if (inNorm <= 25) return '#15803D'
  if (inNorm <= 50) return '#16A34A'
  if (inNorm <= 75) return '#D97706'
  return '#DC2626'
}

export default async function AdminFormacaoPage() {
  const admin = createAdminClient()
  let rows: Row[] = []
  try {
    const { data } = await admin
      .from('training_needs_assessments')
      .select('id, nome, email, empresa, setor, tempo_funcao, qtd_liderados, top_modulos, gaps, created_at')
      .order('created_at', { ascending: false })
    rows = (data as Row[]) ?? []
  } catch {
    /* tabela pode não existir ainda */
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <Link
          href="/admin/formularios"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8CB8E7] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Formulários
        </Link>
        <h1 className="mt-2 flex items-center gap-2 font-heading text-2xl font-extrabold">
          <GraduationCap className="h-6 w-6 text-[#1E88E5]" />
          Diagnóstico de Formação — Resultados
        </h1>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          Identificado por supervisor. Top 3 módulos recomendados alimentam a trilha LIDERA (motor de PDI de treinamento).
        </p>
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center text-sm text-[#64748B]">
          Ainda não há diagnósticos. Compartilhe o link do diagnóstico com os supervisores para começar a coletar.
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const top = r.top_modulos ?? []
            const tudoUrgente = r.gaps?.flags?.tudoUrgente === true
            return (
              <article key={r.id} className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A]">{r.nome}</h3>
                    <p className="text-xs text-[#64748B]">
                      {r.email}
                      {r.empresa ? ` · ${r.empresa}` : ''}
                      {r.setor ? ` · ${r.setor}` : ''}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                      {[r.tempo_funcao, r.qtd_liderados ? `${r.qtd_liderados} liderados` : null]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#64748B]">{formatData(r.created_at)}</span>
                </div>

                {tudoUrgente && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Múltiplas prioridades altas — revalidar trilha em conversa
                  </div>
                )}

                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <Trophy className="h-3.5 w-3.5 text-[#F59E0B]" /> Top 3 módulos recomendados
                  </p>
                  {top.length === 0 ? (
                    <p className="text-xs text-[#94A3B8]">Sem dados suficientes para ranquear.</p>
                  ) : (
                    <ol className="space-y-1.5">
                      {top.map((m, i) => {
                        const faixa = m.inNorm !== null ? faixaDe(m.inNorm) : undefined
                        return (
                          <li key={m.id} className="flex items-center gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FE] text-xs font-extrabold text-[#1565C0]">
                              {i + 1}
                            </span>
                            <span className="flex-1 text-sm font-semibold text-[#0F172A]">{m.titulo}</span>
                            <span
                              className="shrink-0 text-xs font-bold"
                              style={{ color: inColor(m.inNorm) }}
                              title={faixa?.rotulo}
                            >
                              {m.inNorm === null ? '—' : `IN ${m.inNorm}`}
                            </span>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
