'use client'

interface ProgressBarProps {
  value: number // 0-100
  variant?: 'yellow' | 'emerald' | 'amber' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

const variantClasses = {
  yellow: 'bg-yellow-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-500',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  variant = 'gradient',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const isComplete = clampedValue === 100

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex-1 overflow-hidden rounded-full bg-white/10 ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            animated ? ' ease-out' : ''
          } ${variantClasses[variant]} ${
            isComplete ? 'to-emerald-400' : ''
          }`}
          style={{
            width: `${clampedValue}%`,
            animation: animated && clampedValue > 0 ? 'none' : undefined,
          }}
        />
        {/* Glow effect for complete */}
        {isComplete && (
          <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-sm" />
        )}
      </div>

      {showLabel && (
        <span className={`shrink-0 text-xs font-medium ${
          isComplete ? 'text-emerald-400' : 'text-white/60'
        }`}>
          {label ?? `${clampedValue}%`}
        </span>
      )}
    </div>
  )
}

// ── Streak indicator ──
interface StreakProps {
  days: number
  className?: string
}

export function Streak({ days, className = '' }: StreakProps) {
  const isActive = days > 0
  const isMilestone = days === 7 || days === 30 || days === 100

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        isActive
          ? 'bg-amber-500/15 text-amber-400'
          : 'bg-white/5 text-white/40'
      } ${isMilestone ? 'ring-2 ring-amber-500/30' : ''} ${className}`}
    >
      <span className="text-lg leading-none">🔥</span>
      <span>{days}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70">
        {days === 1 ? 'dia' : 'dias'}
      </span>
    </div>
  )
}

// ── XP Badge ──
interface XPBadgeProps {
  xp: number
  tier?: string
  showTier?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function XPBadge({ xp, tier, showTier = true, size = 'md', className = '' }: XPBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 px-2 text-[10px]',
    md: 'h-7 px-2.5 text-xs',
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 font-bold text-yellow-400 ${sizeClasses[size]} ${className}`}
    >
      <span className="text-yellow-400">⚡</span>
      <span>{xp.toLocaleString('pt-BR')}</span>
      {showTier && tier && (
        <>
          <span className="text-white/30">•</span>
          <span className="text-yellow-300">{tier}</span>
        </>
      )}
    </div>
  )
}

// ── Rank Badge ──
interface RankBadgeProps {
  rank: number
  total?: number
  variant?: 'gold' | 'silver' | 'bronze' | 'default'
  className?: string
}

export function RankBadge({ rank, total, variant = 'default', className = '' }: RankBadgeProps) {
  const variantClasses = {
    gold: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
    silver: 'bg-white/10 text-white/80 ring-white/20',
    bronze: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
    default: 'bg-white/5 text-white/60 ring-white/10',
  }

  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${variantClasses[variant]} ${className}`}
    >
      {medals[rank as keyof typeof medals] && (
        <span className="text-sm">{medals[rank as keyof typeof medals]}</span>
      )}
      <span>#{rank}</span>
      {total && <span className="text-white/40">de {total}</span>}
    </div>
  )
}

export default ProgressBar