// Radar chart SVG puro (sem libs externas).
// Recebe array de {label, value 0-10}.

type Point = { label: string; value: number }

type Props = {
  data: Point[]
  size?: number
  maxValue?: number
}

export function RadarChart({ data, size = 360, maxValue = 10 }: Props) {
  if (data.length < 3) return null

  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.36
  const labelRadius = size * 0.46

  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
    const valueRatio = Math.max(0, Math.min(maxValue, d.value)) / maxValue
    return {
      ...d,
      angle,
      x: cx + Math.cos(angle) * radius * valueRatio,
      y: cy + Math.sin(angle) * radius * valueRatio,
      labelX: cx + Math.cos(angle) * labelRadius,
      labelY: cy + Math.sin(angle) * labelRadius,
      axisX: cx + Math.cos(angle) * radius,
      axisY: cy + Math.sin(angle) * radius,
    }
  })

  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Grid concêntrico (4 níveis: 25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  return (
    <div className="flex w-full justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{ maxWidth: size }}
        aria-label="Radar de desenvolvimento"
        role="img"
      >
        {/* Grid concêntrico */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={data
              .map((_, i) => {
                const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
                return `${cx + Math.cos(angle) * radius * level},${cy + Math.sin(angle) * radius * level}`
              })
              .join(' ')}
            fill="none"
            stroke="#E3EBF6"
            strokeWidth={1}
          />
        ))}

        {/* Eixos */}
        {points.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.axisX}
            y2={p.axisY}
            stroke="#E3EBF6"
            strokeWidth={1}
          />
        ))}

        {/* Polígono dos dados */}
        <polygon
          points={polygon}
          fill="#1565C0"
          fillOpacity={0.18}
          stroke="#1565C0"
          strokeWidth={2}
        />

        {/* Pontos */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#1565C0" />
        ))}

        {/* Labels */}
        {points.map((p, i) => {
          const align =
            Math.abs(p.angle + Math.PI / 2) < 0.001
              ? 'middle'
              : p.labelX > cx
              ? 'start'
              : p.labelX < cx
              ? 'end'
              : 'middle'
          return (
            <g key={i}>
              <text
                x={p.labelX}
                y={p.labelY}
                fontSize={11}
                fontWeight={700}
                fill="#0F172A"
                textAnchor={align}
                dominantBaseline="middle"
              >
                {p.label}
              </text>
              <text
                x={p.labelX}
                y={p.labelY + 14}
                fontSize={10}
                fontWeight={600}
                fill="#64748B"
                textAnchor={align}
                dominantBaseline="middle"
              >
                {p.value}/{maxValue}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
