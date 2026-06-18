import Link from 'next/link'
import { AlertTriangle, ArrowLeft, BarChart3, Users } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import {
  CLIMA_DIMENSOES,
  CLIMA_ITENS_CRITICOS,
  CLIMA_MIN_CELULA,
  CLIMA_LIMIAR_ALERTA,
  computeEnps,
  faixaDe,
  valueToScore,
} from '@/lib/clima/clima-data'

export const metadata = { title: 'Pesquisa de Clima — Resultados | Admin' }

type Row = {
  setor: string
  respostas: Record<string, number | null>
  dimension_scores: { id: string; nome: string; score: number | null; semBase: boolean }[]
  overall_score: number | null
  enps_nota: number | null
}

type Aggregate = {
  n: number
  overall: number | null
  enps: number | null
  dims: { id: string; nome: string; score: number | null }[]
  alertas: { texto: string; media: number }[]
}

function aggregate(rows: Row[]): Aggregate {
  const n = rows.length
  // Por dimensão: média das notas (ignora null/semBase)
  const dims = CLIMA_DIMENSOES.map((d) => {
    const vals: number[] = []
    for (const r of rows) {
      const ds = (r.dimension_scores || []).find((x) => x.id === d.id)
      if (ds && !ds.semBase && typeof ds.score === 'number') vals.push(ds.score)
    }
    return {
      id: d.id,
      nome: d.nome,
      score: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null,
    }
  })
  const overalls = rows.map((r) => r.overall_score).filter((v): v is number => typeof v === 'number')
  const overall = overalls.length
    ? Math.round(overalls.reduce((a, b) => a + b, 0) / overalls.length)
    : null
  const enps = computeEnps(
    rows.map((r) => r.enps_nota).filter((v): v is number => typeof v === 'number'),
  )
  // Alertas de itens críticos: média do item < limiar
  const alertas: { texto: string; media: number }[] = []
  for (const item of CLIMA_ITENS_CRITICOS) {
    const vals: number[] = []
    for (const r of rows) {
      const v = r.respostas?.[item.id]
      if (typeof v === 'number') vals.push(valueToScore(v))
    }
    if (vals.length >= CLIMA_MIN_CELULA) {
      const media = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      if (media < CLIMA_LIMIAR_ALERTA) alertas.push({ texto: item.texto, media })
    }
  }
  return { n, overall, enps, dims, alertas }
}

function scoreColor(score: number | null): string {
  if (score === null) return '#94A3B8'
  if (score < 50) return '#DC2626'
  if (score < 65) return '#D97706'
  if (score < 80) return '#16A34A'
  return '#15803D'
}

function AggCard({ titulo, agg }: { titulo: string; agg: Aggregate }) {
  return (
    <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
          <Users className="h-4 w-4 text-[#1565C0]" />
          {titulo}
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B]">
          <span>{agg.n} respostas</span>
          {agg.overall !== null && (
            <span className="rounded-md px-2 py-0.5 text-white" style={{ backgroundColor: scoreColor(agg.overall) }}>
              Geral {agg.overall}
            </span>
          )}
          {agg.enps !== null && <span>eNPS {agg.enps}</span>}
        </div>
      </div>

      {agg.alertas.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Itens críticos em alerta
          </p>
          <ul className="mt-1.5 space-y-1">
            {agg.alertas.map((a) => (
              <li key={a.texto} className="text-xs text-red-800">
                {a.texto} <strong>({a.media})</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {agg.dims.map((d) => {
          const faixa = d.score !== null ? faixaDe(d.score) : undefined
          return (
            <div key={d.id} className="flex items-center gap-3">
              <span className="w-48 shrink-0 truncate text-xs font-semibold text-[#334155]" title={d.nome}>
                {d.nome}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-[#EEF2F7]">
                {d.score !== null && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{ width: `${d.score}%`, backgroundColor: scoreColor(d.score) }}
                  />
                )}
              </div>
              <span className="w-24 shrink-0 text-right text-xs font-bold" style={{ color: scoreColor(d.score) }}>
                {d.score === null ? 'sem base' : `${d.score} · ${faixa?.rotulo?.split(' ')[0] ?? ''}`}
              </span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default async function AdminClimaPage() {
  const admin = createAdminClient()
  let rows: Row[] = []
  try {
    const { data } = await admin
      .from('climate_survey_responses')
      .select('setor, respostas, dimension_scores, overall_score, enps_nota')
      .order('created_at', { ascending: false })
    rows = (data as Row[]) ?? []
  } catch {
    /* tabela pode não existir ainda */
  }

  const geral = aggregate(rows)

  // Por setor — só divulga setor com >= mínimo (regra de privacidade)
  const porSetor = new Map<string, Row[]>()
  for (const r of rows) {
    const k = r.setor || '—'
    porSetor.set(k, [...(porSetor.get(k) ?? []), r])
  }
  const setoresVisiveis = [...porSetor.entries()]
    .filter(([, rs]) => rs.length >= CLIMA_MIN_CELULA)
    .sort((a, b) => b[1].length - a[1].length)
  const setoresOcultos = [...porSetor.entries()].filter(([, rs]) => rs.length < CLIMA_MIN_CELULA)
  const ocultosTotal = setoresOcultos.reduce((a, [, rs]) => a + rs.length, 0)

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
          <BarChart3 className="h-6 w-6 text-[#1E88E5]" />
          Pesquisa de Clima — Resultados
        </h1>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          Anônimo. Resultados por setor só aparecem com {CLIMA_MIN_CELULA}+ respostas (regra de privacidade).
        </p>
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center text-sm text-[#64748B]">
          Ainda não há respostas. Compartilhe o link da pesquisa para começar a coletar.
        </div>
      ) : (
        <>
          <AggCard titulo="Geral (todos os setores)" agg={geral} />

          <div>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-[#64748B]">
              Por setor
            </h2>
            <div className="space-y-4">
              {setoresVisiveis.map(([setor, rs]) => (
                <AggCard key={setor} titulo={setor} agg={aggregate(rs)} />
              ))}
            </div>
            {ocultosTotal > 0 && (
              <p className="mt-3 text-xs text-[#94A3B8]">
                {ocultosTotal} resposta(s) em {setoresOcultos.length} setor(es) com menos de{' '}
                {CLIMA_MIN_CELULA} respostas estão incluídas só no Geral, para preservar o anonimato.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
