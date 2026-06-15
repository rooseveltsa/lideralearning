// Card de uma fase do PDI (90 dias dividido em 3).

import { Target, CheckCircle2, BookOpen } from 'lucide-react'
import type { PdiFase as PdiFaseType } from '@/lib/diagnostico/pdi-types'
import { PdiFerramentaCard } from './PdiFerramentaCard'

const FASE_STYLES: Record<number, { color: string; bg: string; border: string; label: string }> = {
  1: { color: '#1565C0', bg: '#EFF6FE', border: '#1565C0', label: 'Fundação' },
  2: { color: '#F57C00', bg: '#FFF7ED', border: '#F57C00', label: 'Desenvolvimento' },
  3: { color: '#7B1FA2', bg: '#F3E5F5', border: '#7B1FA2', label: 'Estratégia' },
}

export function PdiFase({ fase }: { fase: PdiFaseType }) {
  const style = FASE_STYLES[fase.numero] || FASE_STYLES[1]

  return (
    <div
      className="rounded-3xl border-2 bg-white p-7 sm:p-10"
      style={{ borderColor: `${style.color}33` }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            <Target className="h-3 w-3" />
            {style.label} · {fase.periodo}
          </span>
          <h3 className="mt-3 font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
            {fase.titulo}
          </h3>
          {fase.moduloLidera && (
            <span
              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold"
              style={{ backgroundColor: style.bg, color: style.color }}
            >
              <BookOpen className="h-3 w-3" />
              {fase.moduloLidera}
            </span>
          )}
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{fase.objetivo}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#64748B]">
          Ações práticas
        </p>
        {fase.acoes.map((acao, i) => (
          <div key={i} className="rounded-xl border border-[#E3EBF6] bg-[#FBFCFE] p-5">
            <div className="mb-2 flex items-start gap-2">
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-extrabold text-white"
                style={{ backgroundColor: style.color }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#0F172A]">{acao.descricao}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{acao.comoExecutar}</p>
              </div>
            </div>
            <div className="mt-3">
              <PdiFerramentaCard ferramentaId={acao.ferramentaId} />
            </div>
          </div>
        ))}
      </div>

      {/* KPI */}
      <div
        className="mt-6 flex items-start gap-3 rounded-xl border p-4"
        style={{ borderColor: `${style.color}55`, backgroundColor: style.bg }}
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: style.color }} />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em]" style={{ color: style.color }}>
            KPI de sucesso desta fase
          </p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F172A]">
            {fase.kpiSucesso}
          </p>
        </div>
      </div>
    </div>
  )
}
