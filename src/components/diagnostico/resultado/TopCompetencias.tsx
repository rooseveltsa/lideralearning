// Top 5 forças + Top 5 gaps em duas colunas.

type Item = { id: string; label: string; value: number }

type Props = {
  items: Item[]
  max?: number
  labelFortes?: string
  labelGaps?: string
}

export function TopCompetencias({
  items,
  max = 5,
  labelFortes = 'Top 5 forças',
  labelGaps = 'Top 5 gaps a desenvolver',
}: Props) {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  const fortes = sorted.slice(0, 5)
  const gaps = [...items].sort((a, b) => a.value - b.value).slice(0, 5)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#15803D]">
          {labelFortes}
        </p>
        <ul className="mt-3 space-y-2">
          {fortes.map((f, i) => (
            <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E] text-[10px] font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="font-semibold text-[#0F172A]">{f.label}</span>
              </span>
              <span className="font-extrabold text-[#15803D]">
                {f.value}/{max}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#B91C1C]">
          {labelGaps}
        </p>
        <ul className="mt-3 space-y-2">
          {gaps.map((g, i) => (
            <li key={g.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="font-semibold text-[#0F172A]">{g.label}</span>
              </span>
              <span className="font-extrabold text-[#B91C1C]">
                {g.value}/{max}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
