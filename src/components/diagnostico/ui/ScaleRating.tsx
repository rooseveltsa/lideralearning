'use client'

// Escala 1-5 (importância / nota) — botões grandes com label nas extremidades.
// Usado em Form 1 (perfil esperado, diagnóstico atual, expectativas) e Form 2 (autoavaliação).

type Props = {
  label: string
  value: number | undefined
  onChange: (value: number) => void
  minLabel?: string
  maxLabel?: string
  helperText?: string
}

const COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F59E0B',
  3: '#FBBF24',
  4: '#84CC16',
  5: '#22C55E',
}

export function ScaleRating({
  label,
  value,
  onChange,
  minLabel = 'Pouco importante',
  maxLabel = 'Extremamente importante',
  helperText,
}: Props) {
  return (
    <div className="rounded-xl border border-[#E3EBF6] bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
        {value !== undefined && (
          <span
            className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
            style={{ backgroundColor: COLORS[value] || '#94A3B8' }}
          >
            {value}
          </span>
        )}
      </div>

      {helperText && <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>}

      <div className="mt-3 flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-11 flex-1 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                selected
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-[#E5E7EB] bg-white text-[#334155] hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
              }`}
              style={selected ? { backgroundColor: COLORS[n] } : undefined}
              aria-pressed={selected}
              aria-label={`Nota ${n}`}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
        <span>1 — {minLabel}</span>
        <span>5 — {maxLabel}</span>
      </div>
    </div>
  )
}
