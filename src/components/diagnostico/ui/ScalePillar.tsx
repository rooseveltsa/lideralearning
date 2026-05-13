'use client'

// Escala 0-10 (radar de pilares de vida) — slider com display do valor.
// Usado no Form 2 — Radar de Desenvolvimento.

type Props = {
  label: string
  value: number | undefined
  onChange: (value: number) => void
  helperText?: string
}

function barColor(n: number): string {
  if (n >= 8) return '#22C55E'
  if (n >= 5) return '#F59E0B'
  return '#EF4444'
}

export function ScalePillar({ label, value, onChange, helperText }: Props) {
  const display = value ?? 0
  return (
    <div className="rounded-xl border border-[#E3EBF6] bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
        <span
          className="ml-2 inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded-lg px-2 text-sm font-extrabold text-white"
          style={{ backgroundColor: value === undefined ? '#94A3B8' : barColor(display) }}
        >
          {value === undefined ? '—' : display}
        </span>
      </div>

      {helperText && <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>}

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={display}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-3 w-full accent-[#1565C0]"
        aria-label={`Nota de ${label}`}
      />

      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
        <span>0 — Muito baixo</span>
        <span>10 — Excelente</span>
      </div>
    </div>
  )
}
