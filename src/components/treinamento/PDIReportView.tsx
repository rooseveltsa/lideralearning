'use client'

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Printer,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { PDIDimension, PDIPlanPhase, PDIReport } from '@/lib/utils/pdi-generator'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = {
  report: PDIReport
  /** When true, hides print button (e.g. inside admin pages) */
  hidePrint?: boolean
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AlignmentRing({ value }: { value: number }) {
  let color = 'text-red-500'
  let bg = 'bg-red-50 border-red-200'
  let label = 'Divergente'

  if (value >= 80) {
    color = 'text-emerald-600'
    bg = 'bg-emerald-50 border-emerald-200'
    label = 'Excelente'
  } else if (value >= 60) {
    color = 'text-amber-600'
    bg = 'bg-amber-50 border-amber-200'
    label = 'Moderado'
  }

  return (
    <div className={`flex flex-col items-center gap-1 rounded-2xl border px-6 py-4 ${bg}`}>
      <span className={`text-4xl font-extrabold ${color}`}>{value}%</span>
      <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
      <span className="text-[11px] text-[#64748B]">Alinhamento</span>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: PDIDimension['priority'] }) {
  const map = {
    critical: { bg: 'bg-red-100 text-red-700 border-red-200', label: 'Critico' },
    high: { bg: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Alto' },
    medium: { bg: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Medio' },
    low: { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Baixo' },
  }
  const { bg, label } = map[priority]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${bg}`}>
      {label}
    </span>
  )
}

function DimensionBar({ dim }: { dim: PDIDimension }) {
  return (
    <div className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#111827]">{dim.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#64748B]">{dim.gap}pp gap</span>
          <PriorityBadge priority={dim.priority} />
        </div>
      </div>

      {/* Self bar */}
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 text-xs font-semibold text-[#1565C0]">Autoavaliacao</span>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E8EFF8]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#1565C0] transition-all duration-500"
            style={{ width: `${dim.selfScore}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs font-bold text-[#1565C0]">{dim.selfScore}%</span>
      </div>

      {/* Exec bar */}
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 text-xs font-semibold text-[#00695C]">Executiva</span>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E0F2F1]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#00695C] transition-all duration-500"
            style={{ width: `${dim.execScore}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs font-bold text-[#00695C]">{dim.execScore}%</span>
      </div>

      {/* Recommendation */}
      <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{dim.recommendation}</p>
    </div>
  )
}

function InsightCard({
  items,
  title,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  emptyMessage,
}: {
  items: string[]
  title: string
  icon: typeof Star
  color: string
  bgColor: string
  borderColor: string
  emptyMessage: string
}) {
  return (
    <div className={`rounded-2xl border p-5 ${borderColor} ${bgColor}`}>
      <h3 className={`flex items-center gap-2 text-sm font-extrabold ${color}`}>
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-[#64748B]">{emptyMessage}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#374151]">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full`} style={{ backgroundColor: color }} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PhaseCard({ phase, index }: { phase: PDIPlanPhase; index: number }) {
  const colors = [
    { border: 'border-[#1565C0]/20', bg: 'bg-[#F0F7FF]', accent: '#1565C0', icon: Shield },
    { border: 'border-[#F57C00]/20', bg: 'bg-[#FFF8F0]', accent: '#F57C00', icon: Users },
    { border: 'border-[#7B1FA2]/20', bg: 'bg-[#F9F0FF]', accent: '#7B1FA2', icon: Rocket },
  ]
  const c = colors[index] ?? colors[0]
  const Icon = c.icon

  return (
    <div className={`rounded-2xl border p-5 ${c.border} ${c.bg}`}>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${c.accent}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: c.accent }} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[#0F172A]">{phase.title}</h3>
          <span className="text-xs font-semibold" style={{ color: c.accent }}>
            {phase.weeks}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#64748B]">{phase.focus}</p>
      <ul className="mt-3 space-y-2">
        {phase.actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: c.accent }} />
            {action}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PERFIL_LABELS: Record<string, string> = {
  reativo: 'Supervisor Reativo',
  transicao: 'Supervisor em Transicao',
  lider_valor: 'Lider de Valor',
}

const PERFIL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  reativo: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  transicao: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  lider_valor: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
}

export default function PDIReportView({ report, hidePrint }: Props) {
  const perfilColor = PERFIL_COLORS[report.selfAssessment.perfil] ?? PERFIL_COLORS.transicao
  const formattedDate = new Date(report.generatedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const sortedDimensions = [...report.dimensions].sort((a, b) => b.gap - a.gap)

  return (
    <div className="space-y-8 print:space-y-6">
      {/* ── 1. Header ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)] print:border-gray-300 print:bg-white print:text-black print:shadow-none">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px] print:hidden" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7] print:text-gray-500">
              Plano de Desenvolvimento Individual
            </p>
            <h1 className="mt-2 font-heading text-2xl font-extrabold md:text-3xl">
              {report.alunoName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#A9BDD8] print:text-gray-600">
              {report.company && <span>{report.company}</span>}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>
          <AlignmentRing value={report.overallAlignment} />
        </div>
      </section>

      {/* ── 2. Executive Summary ── */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <BarChart3 className="h-5 w-5 text-[#1565C0]" />
          Resumo Executivo
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`rounded-xl border p-4 ${perfilColor.bg} ${perfilColor.border}`}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Perfil</p>
            <p className={`mt-1 text-lg font-extrabold ${perfilColor.text}`}>
              {PERFIL_LABELS[report.selfAssessment.perfil] ?? report.selfAssessment.perfil}
            </p>
            <p className="mt-0.5 text-xs text-[#64748B]">{report.selfAssessment.total} pontos</p>
          </div>
          {report.execAssessment ? (
            <>
              <div className="rounded-xl border border-[#D8E2EF] bg-[#F8FAFD] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Nivel Atual</p>
                <p className="mt-1 text-lg font-extrabold text-[#0F172A]">{report.execAssessment.nivelAtual}</p>
              </div>
              <div className="rounded-xl border border-[#D8E2EF] bg-[#F8FAFD] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Nivel Esperado</p>
                <p className="mt-1 text-lg font-extrabold text-[#1565C0]">{report.execAssessment.nivelEsperado}</p>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">PDI Parcial</p>
              <p className="mt-1 text-sm font-bold text-amber-800">Baseado na sua autoavaliacao</p>
              <p className="mt-0.5 text-xs text-amber-600">O PDI completo sera gerado quando o gestor preencher a Avaliacao Executiva</p>
            </div>
          )}
          <div className="rounded-xl border border-[#D8E2EF] bg-[#F8FAFD] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Gaps Criticos</p>
            <p className="mt-1 text-lg font-extrabold text-red-600">{report.criticalGaps.length}</p>
            <p className="mt-0.5 text-xs text-[#64748B]">dimensoes com divergencia {'>'} 40pp</p>
          </div>
        </div>
      </section>

      {/* ── 3. Dimension Comparison ── */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <TrendingUp className="h-5 w-5 text-[#1565C0]" />
          Comparativo de Dimensoes
        </h2>
        <p className="mb-5 text-sm text-[#64748B]">
          Autoavaliacao do lider comparada com a avaliacao executiva do gestor. Barras normalizadas para 0-100%.
        </p>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-5 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-6 rounded-full bg-[#1565C0]" />
            <span className="text-[#1565C0]">Autoavaliacao</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-6 rounded-full bg-[#00695C]" />
            <span className="text-[#00695C]">Avaliacao Executiva</span>
          </div>
        </div>

        <div className="space-y-3">
          {sortedDimensions.map((dim) => (
            <DimensionBar key={dim.name} dim={dim} />
          ))}
        </div>
      </section>

      {/* ── 4. Strengths & Gaps Analysis ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Sparkles className="h-5 w-5 text-[#F57C00]" />
          Analise de Forcas e Gaps
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <InsightCard
            items={report.strengths}
            title="Forcas (alinhadas)"
            icon={Star}
            color="#16A34A"
            bgColor="bg-emerald-50"
            borderColor="border-emerald-200"
            emptyMessage="Nenhuma dimensao com ambas as notas altas e alinhadas."
          />
          <InsightCard
            items={report.criticalGaps}
            title="Gaps Criticos"
            icon={AlertTriangle}
            color="#DC2626"
            bgColor="bg-red-50"
            borderColor="border-red-200"
            emptyMessage="Nenhum gap critico identificado."
          />
          <InsightCard
            items={report.blindSpots}
            title="Pontos Cegos (superestimacao)"
            icon={EyeOff}
            color="#D97706"
            bgColor="bg-amber-50"
            borderColor="border-amber-200"
            emptyMessage="Nenhum ponto cego identificado."
          />
          <InsightCard
            items={report.hiddenStrengths}
            title="Forcas Ocultas (subestimacao)"
            icon={Eye}
            color="#2563EB"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            emptyMessage="Nenhuma forca oculta identificada."
          />
        </div>
      </section>

      {/* ── 5. 12-Week Development Plan ── */}
      <section className="space-y-4 print:break-before-page">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <BookOpen className="h-5 w-5 text-[#7B1FA2]" />
          Plano de Desenvolvimento — 12 Semanas
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <PhaseCard phase={report.developmentPlan.phase1} index={0} />
          <PhaseCard phase={report.developmentPlan.phase2} index={1} />
          <PhaseCard phase={report.developmentPlan.phase3} index={2} />
        </div>
      </section>

      {/* ── 6. KPIs ── */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Target className="h-5 w-5 text-[#F57C00]" />
          KPIs de Acompanhamento
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Indicador</th>
                <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Atual</th>
                <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Meta</th>
                <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {report.kpisToTrack.map((kpi) => (
                <tr key={kpi.name} className="border-b border-[#F1F5F9]">
                  <td className="py-3 font-semibold text-[#111827]">{kpi.name}</td>
                  <td className="py-3 text-[#64748B]">{kpi.current}</td>
                  <td className="py-3 font-semibold text-[#1565C0]">{kpi.target}</td>
                  <td className="py-3 text-[#64748B]">{kpi.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 7. Mentoring Roadmap ── */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Calendar className="h-5 w-5 text-[#7B1FA2]" />
          Roteiro de Mentoria
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#1565C0]/20 bg-[#F0F7FF] p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#1565C0]">
              <ArrowUpRight className="h-4 w-4" />
              Sessao de 30 Dias
            </h3>
            <ul className="mt-3 space-y-2">
              {report.mentoringFocus.session30days.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1565C0]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#7B1FA2]/20 bg-[#F9F0FF] p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#7B1FA2]">
              <ArrowDownRight className="h-4 w-4" />
              Sessao de 60 Dias
            </h3>
            <ul className="mt-3 space-y-2">
              {report.mentoringFocus.session60days.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7B1FA2]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 8. Print Button ── */}
      {!hidePrint && (
        <div className="flex justify-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0D47A1] hover:shadow-lg"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Exportar PDF
          </button>
        </div>
      )}
    </div>
  )
}
