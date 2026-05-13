// Visualização DISC em barras horizontais (sem libs externas).
// Recebe scores {D, I, S, C} em %.

type Props = {
  scores: Record<string, number>
  size?: 'sm' | 'md' | 'lg'
  comparativo?: Record<string, number> // opcional — desenha "expectativa" tracejada
}

const DISC_META: Record<string, { label: string; description: string; color: string }> = {
  D: { label: 'Dominância', description: 'Decisivo · Executor', color: '#EF4444' },
  I: { label: 'Influência', description: 'Comunicativo · Inspirador', color: '#F59E0B' },
  S: { label: 'Estabilidade', description: 'Paciente · Colaborativo', color: '#22C55E' },
  C: { label: 'Conformidade', description: 'Analítico · Disciplinado', color: '#1565C0' },
}

export function DiscBarChart({ scores, comparativo }: Props) {
  return (
    <div className="space-y-4">
      {(['D', 'I', 'S', 'C'] as const).map((dim) => {
        const meta = DISC_META[dim]
        const value = Math.max(0, Math.min(100, scores[dim] ?? 0))
        const cmp = comparativo ? Math.max(0, Math.min(100, comparativo[dim] ?? 0)) : null
        return (
          <div key={dim}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {dim}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{meta.label}</p>
                  <p className="text-[10px] text-[#94A3B8]">{meta.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold tabular-nums" style={{ color: meta.color }}>
                  {value}%
                </p>
                {cmp !== null && (
                  <p className="text-[10px] font-semibold text-[#94A3B8]">expectativa {cmp}%</p>
                )}
              </div>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-[#EEF3F9]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${value}%`, backgroundColor: meta.color }}
              />
              {cmp !== null && (
                <div
                  className="absolute top-0 h-full w-0.5"
                  style={{ left: `calc(${cmp}% - 1px)`, backgroundColor: '#0F172A' }}
                  aria-label={`Expectativa ${cmp}%`}
                  title={`Expectativa ${cmp}%`}
                />
              )}
            </div>
          </div>
        )
      })}
      {comparativo && (
        <p className="mt-2 text-center text-[11px] text-[#64748B]">
          Barra colorida = sua percepção · Traço escuro = expectativa da empresa
        </p>
      )}
    </div>
  )
}
