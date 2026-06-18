import Link from 'next/link'
import { AlertTriangle, ArrowLeft, BarChart3, ShieldAlert, Users } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import {
  CULTURA_DIMENSOES,
  CULTURA_ITENS_CRITICOS,
  CULTURA_MIN_CELULA,
  CULTURA_LIMIAR_ALERTA,
  CULTURA_ANCORA_D5_LIMIAR,
  CULTURA_LIMIAR_INCONSISTENCIA,
  faixaDe,
  itemScore,
  isInconsistente,
  type CulturaRespostas,
} from '@/lib/cultura/cultura-data'

export const metadata = { title: 'Cultura Preventiva — Resultados | Admin' }

const ITEM_REVERSO = new Map(
  CULTURA_DIMENSOES.flatMap((d) => d.itens).map((i) => [i.id, i.reverso]),
)

type Row = {
  setor: string
  respostas: CulturaRespostas
  dimension_scores: { id: string; nome: string; score: number | null; semBase: boolean }[]
  overall_score: number | null
}

type Aggregate = {
  n: number
  overall: number | null
  dims: { id: string; nome: string; score: number | null }[]
  d5: number | null
  inconsistencia: number // % de questionários inconsistentes
  alertas: { texto: string; score: number }[]
}

function aggregate(rows: Row[]): Aggregate {
  const n = rows.length
  // Por dimensão: média das notas (ignora null/semBase)
  const dims = CULTURA_DIMENSOES.map((d) => {
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
  const d5 = dims.find((d) => d.id === 'd5')?.score ?? null
  // Índice de Inconsistência (PASSO 6): % de questionários incoerentes.
  const incons = rows.filter((r) => isInconsistente(r.respostas || {})).length
  const inconsistencia = n ? Math.round((incons / n) * 100) : 0
  // Alertas de itens críticos: score normalizado (já invertido) < limiar.
  const alertas: { texto: string; score: number }[] = []
  for (const item of CULTURA_ITENS_CRITICOS) {
    const vals: number[] = []
    for (const r of rows) {
      const v = r.respostas?.[item.id]
      if (typeof v === 'number') vals.push(itemScore(v, ITEM_REVERSO.get(item.id) ?? false))
    }
    if (vals.length >= CULTURA_MIN_CELULA) {
      const score = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      if (score < CULTURA_LIMIAR_ALERTA) alertas.push({ texto: item.texto, score })
    }
  }
  return { n, overall, dims, d5, inconsistencia, alertas }
}

function scoreColor(score: number | null): string {
  if (score === null) return '#94A3B8'
  if (score < 40) return '#DC2626'
  if (score < 60) return '#D97706'
  if (score < 80) return '#16A34A'
  return '#15803D'
}

function AggCard({ titulo, agg }: { titulo: string; agg: Aggregate }) {
  const faixaGeral = agg.overall !== null ? faixaDe(agg.overall) : undefined
  // Confiança do resultado (âncora D5 + inconsistência).
  const d5Baixa = agg.d5 !== null && agg.d5 < CULTURA_ANCORA_D5_LIMIAR
  const inconsAlta = agg.inconsistencia > CULTURA_LIMIAR_INCONSISTENCIA
  const desconfiar = d5Baixa || inconsAlta

  return (
    <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
          <Users className="h-4 w-4 text-[#1565C0]" />
          {titulo}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#64748B]">
          <span>{agg.n} respostas</span>
          {agg.overall !== null && (
            <span
              className="rounded-md px-2 py-0.5 text-white"
              style={{ backgroundColor: scoreColor(agg.overall) }}
            >
              Maturidade {agg.overall}
            </span>
          )}
          <span>Inconsistência {agg.inconsistencia}%</span>
        </div>
      </div>

      {faixaGeral && (
        <p className="mt-2 text-xs font-bold" style={{ color: scoreColor(agg.overall) }}>
          Estágio: {faixaGeral.rotulo}
        </p>
      )}

      {desconfiar && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" /> Confie com cautela
          </p>
          <p className="mt-1 text-xs text-amber-900">
            {d5Baixa &&
              `Segurança psicológica (D5 = ${agg.d5}) abaixo de ${CULTURA_ANCORA_D5_LIMIAR}: os demais índices podem estar inflados por medo. `}
            {inconsAlta &&
              `Índice de inconsistência (${agg.inconsistencia}%) acima de ${CULTURA_LIMIAR_INCONSISTENCIA}%: possível resposta no automático ou medo. `}
            Aja primeiro na segurança psicológica antes de confiar em índices altos.
          </p>
        </div>
      )}

      {agg.alertas.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Itens críticos em alerta
          </p>
          <ul className="mt-1.5 space-y-1">
            {agg.alertas.map((a) => (
              <li key={a.texto} className="text-xs text-red-800">
                {a.texto} <strong>({a.score})</strong>
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
              <span
                className="w-48 shrink-0 truncate text-xs font-semibold text-[#334155]"
                title={d.nome}
              >
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
              <span
                className="w-28 shrink-0 text-right text-xs font-bold"
                style={{ color: scoreColor(d.score) }}
              >
                {d.score === null ? 'sem base' : `${d.score} · ${faixa?.rotulo?.split(' ')[0] ?? ''}`}
              </span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default async function AdminCulturaPage() {
  const admin = createAdminClient()
  let rows: Row[] = []
  try {
    const { data } = await admin
      .from('preventive_culture_responses')
      .select('setor, respostas, dimension_scores, overall_score')
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
    .filter(([, rs]) => rs.length >= CULTURA_MIN_CELULA)
    .sort((a, b) => b[1].length - a[1].length)
  const setoresOcultos = [...porSetor.entries()].filter(([, rs]) => rs.length < CULTURA_MIN_CELULA)
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
          Cultura Preventiva — Resultados
        </h1>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          Anônimo. Maturidade por setor só aparece com {CULTURA_MIN_CELULA}+ respostas (regra de
          privacidade). Antes de aceitar um setor como maduro, confira D5 alta e baixa inconsistência.
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
                {CULTURA_MIN_CELULA} respostas estão incluídas só no Geral, para preservar o anonimato.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
