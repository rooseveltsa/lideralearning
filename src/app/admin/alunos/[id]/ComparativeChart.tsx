'use client'

import {
  buildComparison,
  calculateAlignment,
  getGapSummary,
  normalizeScore,
  type ComparisonDimension,
  type ExecOnlyDimension,
} from '@/lib/utils/assessment-comparison'

type Props = {
  selfAssessment: {
    pontuacao_total: number
    perfil: string
    [key: string]: unknown
  } | null
  execAssessment: Record<string, unknown> | null
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AlignmentBadge({ value }: { value: number }) {
  let bg = 'bg-red-100 text-red-700 border-red-200'
  let label = 'Divergente'

  if (value >= 80) {
    bg = 'bg-emerald-100 text-emerald-700 border-emerald-200'
    label = 'Excelente'
  } else if (value >= 60) {
    bg = 'bg-amber-100 text-amber-700 border-amber-200'
    label = 'Moderado'
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${bg}`}>
      <span className="text-lg font-extrabold">{value}%</span>
      <span>{label}</span>
    </div>
  )
}

function GapIndicator({ gap }: { gap: number }) {
  let color = 'bg-emerald-500'
  let label = 'Alinhado'

  if (gap > 40) {
    color = 'bg-red-500'
    label = 'Divergente'
  } else if (gap > 20) {
    color = 'bg-amber-500'
    label = 'Moderado'
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-[11px] font-semibold text-[#64748B]">
        {gap}pp {label}
      </span>
    </div>
  )
}

function BarPair({ dimension }: { dimension: ComparisonDimension }) {
  const selfPct =
    dimension.selfScore !== null
      ? normalizeScore(dimension.selfScore, dimension.selfMax)
      : null
  const execPct =
    dimension.execScore !== null
      ? normalizeScore(dimension.execScore, dimension.execMax)
      : null

  return (
    <div className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#111827]">
          {dimension.label}
        </span>
        {dimension.alignment !== 'no_data' && (
          <GapIndicator gap={dimension.gap} />
        )}
      </div>

      {/* Self bar */}
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 text-xs font-semibold text-[#1565C0]">
          Autoavaliacao
        </span>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E8EFF8]">
          {selfPct !== null ? (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#1565C0] transition-all duration-500"
              style={{ width: `${selfPct}%` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] text-[#94A3B8]">Sem dados</span>
            </div>
          )}
        </div>
        <span className="w-10 text-right text-xs font-bold text-[#1565C0]">
          {selfPct !== null ? `${selfPct}%` : '--'}
        </span>
      </div>

      {/* Exec bar */}
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 text-xs font-semibold text-[#00695C]">
          Executiva
        </span>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E0F2F1]">
          {execPct !== null ? (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#00695C] transition-all duration-500"
              style={{ width: `${execPct}%` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] text-[#94A3B8]">Sem dados</span>
            </div>
          )}
        </div>
        <span className="w-10 text-right text-xs font-bold text-[#00695C]">
          {execPct !== null ? `${execPct}%` : '--'}
        </span>
      </div>
    </div>
  )
}

function SingleBar({
  label,
  score,
  max,
  color,
  bgBar,
}: {
  label: string
  score: number | null
  max: number
  color: string
  bgBar: string
}) {
  const pct = score !== null ? normalizeScore(score, max) : null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-3">
      <span className="w-44 shrink-0 text-sm font-bold text-[#111827]">
        {label}
      </span>
      <div className={`relative h-5 flex-1 overflow-hidden rounded-full ${bgBar}`}>
        {pct !== null ? (
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] text-[#94A3B8]">Sem dados</span>
          </div>
        )}
      </div>
      <span
        className="w-10 text-right text-xs font-bold"
        style={{ color }}
      >
        {pct !== null ? `${pct}%` : '--'}
      </span>
    </div>
  )
}

function SummaryCards({ summaries }: { summaries: string[] }) {
  return (
    <div className="space-y-3">
      {summaries.map((text, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#D8E2EF] bg-[#F8FAFC] px-4 py-3 text-sm leading-relaxed text-[#374151]"
        >
          {text}
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9]">
        <svg
          className="h-6 w-6 text-[#94A3B8]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      </div>
      <h3 className="text-base font-extrabold text-[#111827]">
        Comparativo indisponivel
      </h3>
      <p className="mt-1 text-sm text-[#64748B]">
        O comparativo sera exibido quando ambas as avaliacoes estiverem
        preenchidas (autoavaliacao do lider e avaliacao executiva do gestor).
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ComparativeChart({
  selfAssessment,
  execAssessment,
}: Props) {
  // If neither assessment exists, show empty state
  if (!selfAssessment && !execAssessment) {
    return <EmptyState />
  }

  const { paired, selfOnly, execOnly } = buildComparison(
    selfAssessment as Record<string, unknown> | null,
    execAssessment,
  )

  const alignment = calculateAlignment(paired)
  const summaries = getGapSummary(paired)

  // Check if we have at least one dimension with data on both sides
  const hasPairedData = paired.some((d) => d.alignment !== 'no_data')

  return (
    <section className="space-y-6 rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
            <svg
              className="h-5 w-5 text-[#1565C0]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            Comparativo: Autoavaliacao x Avaliacao Executiva
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Visao lado a lado das percepcoes do lider e do gestor
          </p>
        </div>
        {hasPairedData && <AlignmentBadge value={alignment} />}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded-full bg-[#1565C0]" />
          <span className="text-[#1565C0]">Autoavaliacao (lider)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded-full bg-[#00695C]" />
          <span className="text-[#00695C]">Avaliacao Executiva (gestor)</span>
        </div>
        <div className="flex items-center gap-4 text-[#64748B]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {'<'}20pp
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
            20-40pp
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            {'>'}40pp
          </span>
        </div>
      </div>

      {/* Paired dimension bars */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#374151]">
          Dimensoes comparaveis
        </h3>
        {paired.map((dim) => (
          <BarPair key={dim.label} dimension={dim} />
        ))}
      </div>

      {/* Self-only dimensions */}
      {selfOnly.some((d) => d.score !== null) && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#374151]">
            Somente autoavaliacao
          </h3>
          {selfOnly
            .filter((d) => d.score !== null)
            .map((d) => (
              <SingleBar
                key={d.label}
                label={d.label}
                score={d.score}
                max={d.max}
                color="#1565C0"
                bgBar="bg-[#E8EFF8]"
              />
            ))}
        </div>
      )}

      {/* Exec-only dimensions */}
      {execOnly.some((d) => d.score !== null) && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#374151]">
            Somente avaliacao executiva
          </h3>
          {execOnly
            .filter((d: ExecOnlyDimension) => d.score !== null)
            .map((d: ExecOnlyDimension) => (
              <SingleBar
                key={d.label}
                label={d.label}
                score={d.score}
                max={d.max}
                color="#00695C"
                bgBar="bg-[#E0F2F1]"
              />
            ))}
        </div>
      )}

      {/* Gap summary */}
      {summaries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#374151]">
            Analise de gaps
          </h3>
          <SummaryCards summaries={summaries} />
        </div>
      )}
    </section>
  )
}
