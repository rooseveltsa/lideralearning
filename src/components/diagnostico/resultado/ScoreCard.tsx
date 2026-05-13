// Card de score grande com label + valor + descrição.

type Props = {
  label: string
  value: number
  max: number
  unit?: string
  color?: string
  description?: string
}

function scoreColor(ratio: number): string {
  if (ratio >= 0.7) return '#22C55E'
  if (ratio >= 0.4) return '#F59E0B'
  return '#EF4444'
}

export function ScoreCard({ label, value, max, unit = '', color, description }: Props) {
  const ratio = max > 0 ? value / max : 0
  const finalColor = color || scoreColor(ratio)
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: `${finalColor}33`, backgroundColor: `${finalColor}0F` }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.13em]" style={{ color: finalColor }}>
        {label}
      </p>
      <p className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-[#0F172A]">
        {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
        <span className="text-lg font-bold text-[#94A3B8]">
          {unit ? unit : `/${max}`}
        </span>
      </p>
      {description && <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{description}</p>}
    </div>
  )
}
