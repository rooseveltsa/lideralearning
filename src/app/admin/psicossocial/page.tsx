import Link from 'next/link'
import { AlertTriangle, ArrowLeft, ShieldAlert, Users } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import {
  PSICOSSOCIAL_DIMENSOES,
  PSICOSSOCIAL_CRITICOS,
  PSICOSSOCIAL_MIN_CELULA,
  criticoDisparado,
  faixaDe,
} from '@/lib/psicossocial/psicossocial-data'
import { getOrg, normalizeOrgCode } from '@/lib/surveys/orgs'

export const metadata = { title: 'Indicadores Psicossociais — Resultados | Admin' }

type CriticoResp = { value: number | null; relato?: string }

type Row = {
  setor: string
  turno: string
  dimension_scores: { id: string; nome: string; score: number | null; semBase: boolean }[]
  overall_risk: number | null
  criticos: Record<string, CriticoResp>
  org_code: string | null
}

type CriticoAlerta = { id: string; texto: string; ocorrencias: number; relatos: number }

type Aggregate = {
  n: number
  overall: number | null
  // dims já ordenadas da MAIS arriscada para a menos
  dims: { id: string; nome: string; score: number | null }[]
  criticos: CriticoAlerta[]
  totalCriticos: number
}

function aggregate(rows: Row[]): Aggregate {
  const n = rows.length
  // Por dimensão: média do nível de risco (ignora null/semBase)
  const dims = PSICOSSOCIAL_DIMENSOES.map((d) => {
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
  }).sort((a, b) => (b.score ?? -1) - (a.score ?? -1)) // pior (maior risco) primeiro

  const overalls = rows
    .map((r) => r.overall_risk)
    .filter((v): v is number => typeof v === 'number')
  const overall = overalls.length
    ? Math.round(overalls.reduce((a, b) => a + b, 0) / overalls.length)
    : null

  // Parte 2 — conta QUALQUER ocorrência (>= Raramente). Sem identificar ninguém.
  const criticos: CriticoAlerta[] = PSICOSSOCIAL_CRITICOS.map((item) => {
    let ocorrencias = 0
    let relatos = 0
    for (const r of rows) {
      const c = r.criticos?.[item.id]
      if (c && criticoDisparado(c.value)) {
        ocorrencias += 1
        if (typeof c.relato === 'string' && c.relato.trim()) relatos += 1
      }
    }
    return { id: item.id, texto: item.texto, ocorrencias, relatos }
  }).filter((c) => c.ocorrencias > 0)

  const totalCriticos = criticos.reduce((a, c) => a + c.ocorrencias, 0)

  return { n, overall, dims, criticos, totalCriticos }
}

// Cor por NÍVEL DE RISCO (MAIOR = PIOR): baixo 0–34, médio 35–59, alto 60–100.
function riskColor(score: number | null): string {
  if (score === null) return '#94A3B8'
  if (score <= 34) return '#16A34A'
  if (score <= 59) return '#D97706'
  return '#DC2626'
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
            <span
              className="rounded-md px-2 py-0.5 text-white"
              style={{ backgroundColor: riskColor(agg.overall) }}
            >
              Risco geral {agg.overall}
            </span>
          )}
        </div>
      </div>

      {/* Parte 2 — alertas críticos: independem da média */}
      {agg.criticos.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
            <ShieldAlert className="h-3.5 w-3.5" /> Alertas críticos (últimos 12 meses) —{' '}
            {agg.totalCriticos} no total
          </p>
          <ul className="mt-1.5 space-y-1">
            {agg.criticos.map((c) => (
              <li key={c.id} className="text-xs text-red-800">
                {c.texto} <strong>({c.ocorrencias})</strong>
                {c.relatos > 0 && (
                  <span className="ml-1 text-red-600">
                    · {c.relatos} relato(s) sob sigilo
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-red-700">
            Independe da média. Acionar canal de denúncia/apuração e/ou medicina do trabalho, com
            sigilo. Relatos livres são lidos apenas por profissional de saúde/segurança.
          </p>
        </div>
      )}

      {/* Ranking das dimensões — da mais arriscada para a menos */}
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
                    style={{ width: `${d.score}%`, backgroundColor: riskColor(d.score) }}
                  />
                )}
              </div>
              <span
                className="w-28 shrink-0 text-right text-xs font-bold"
                style={{ color: riskColor(d.score) }}
              >
                {d.score === null ? 'sem base' : `${d.score} · ${faixa?.rotulo?.split(' ')[1] ?? faixa?.rotulo ?? ''}`}
              </span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default async function AdminPsicossocialPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>
}) {
  const { org } = await searchParams
  const orgCode = normalizeOrgCode(org)
  const empresa = orgCode ? await getOrg(orgCode) : null

  const admin = createAdminClient()
  let rows: Row[] = []
  try {
    const { data } = await admin
      .from('psychosocial_survey_responses')
      .select('setor, turno, dimension_scores, overall_risk, criticos, org_code')
      .order('created_at', { ascending: false })
    rows = (data as Row[]) ?? []
  } catch {
    /* tabela pode não existir ainda */
  }

  // Filtra por empresa quando há ?org= (antes de qualquer agregação).
  if (orgCode) {
    rows = rows.filter((r) => r.org_code === orgCode)
  }

  const geral = aggregate(rows)

  // Por célula setor×turno — só divulga com >= mínimo (regra de privacidade).
  const porCelula = new Map<string, Row[]>()
  for (const r of rows) {
    const k = `${r.setor || '—'} · ${r.turno || '—'}`
    porCelula.set(k, [...(porCelula.get(k) ?? []), r])
  }
  const celulasVisiveis = [...porCelula.entries()]
    .filter(([, rs]) => rs.length >= PSICOSSOCIAL_MIN_CELULA)
    .sort((a, b) => b[1].length - a[1].length)
  const celulasOcultas = [...porCelula.entries()].filter(
    ([, rs]) => rs.length < PSICOSSOCIAL_MIN_CELULA,
  )
  const ocultasTotal = celulasOcultas.reduce((a, [, rs]) => a + rs.length, 0)

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
          <AlertTriangle className="h-6 w-6 text-[#1E88E5]" />
          Indicadores Psicossociais — Resultados
        </h1>
        <p className="mt-1 text-xs text-[#A9BDD8]">
          NR-1 / ISO 45003. Anônimo. NOTA ALTA = MAIS RISCO. Resultados por setor×turno só aparecem
          com {PSICOSSOCIAL_MIN_CELULA}+ respostas (regra de privacidade). Alertas críticos da Parte
          2 independem da média.
        </p>
        <div className="mt-2 text-xs text-[#A9BDD8]">
          {orgCode ? (
            <span>
              Filtrando por empresa:{' '}
              <strong className="text-white">{empresa?.nome ?? orgCode}</strong>{' '}
              <Link href="/admin/psicossocial" className="text-[#8CB8E7] hover:underline">
                · ver todas
              </Link>
            </span>
          ) : (
            <span>Mostrando todas as empresas.</span>
          )}
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center text-sm text-[#64748B]">
          Ainda não há respostas. Compartilhe o link da pesquisa para começar a coletar.
        </div>
      ) : (
        <>
          <AggCard titulo="Geral (todos os setores e turnos)" agg={geral} />

          <div>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-[#64748B]">
              Por setor × turno
            </h2>
            <div className="space-y-4">
              {celulasVisiveis.map(([celula, rs]) => (
                <AggCard key={celula} titulo={celula} agg={aggregate(rs)} />
              ))}
            </div>
            {ocultasTotal > 0 && (
              <p className="mt-3 text-xs text-[#94A3B8]">
                {ocultasTotal} resposta(s) em {celulasOcultas.length} grupo(s) setor×turno com menos
                de {PSICOSSOCIAL_MIN_CELULA} respostas estão incluídas só no Geral, para preservar o
                anonimato.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
