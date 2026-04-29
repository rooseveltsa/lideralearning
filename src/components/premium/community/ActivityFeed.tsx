'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Heart, Trophy, CheckCircle2, Flame, BookOpen, Users, TrendingUp } from 'lucide-react'

// ── Types ──
export type ActivityType = 'course_completed' | 'course_started' | 'xp_milestone' | 'badge_earned' | 'comment' | 'reaction'

export interface Activity {
  id: string
  type: ActivityType
  user: {
    id: string
    name: string
    avatarUrl?: string | null
    role?: string
  }
  target?: {
    type: 'course' | 'badge' | 'comment'
    id: string
    title: string
    href?: string
  }
  meta?: {
    xpGained?: number
    tier?: string
    rank?: number
    commentPreview?: string
  }
  timestamp: Date | string
  reactions?: {
    count: number
    userReacted: boolean
  }
  comments?: {
    count: number
  }
}

interface ActivityFeedProps {
  activities: Activity[]
  variant?: 'compact' | 'full'
  maxItems?: number
  showTime?: boolean
  className?: string
  /** Auto-refresh interval in ms (0 = no auto-refresh) */
  autoRefresh?: number
  /** Função para carregar mais atividades */
  onLoadMore?: () => void
  /** Link para página completa de atividade */
  seeAllHref?: string
}

// ── Config de ícones por tipo ──
const activityConfig: Record<ActivityType, { icon: typeof CheckCircle2; color: string; bgColor: string }> = {
  course_completed: { icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15' },
  course_started: { icon: BookOpen, color: 'text-yellow-400', bgColor: 'bg-yellow-500/15' },
  xp_milestone: { icon: Trophy, color: 'text-amber-400', bgColor: 'bg-amber-500/15' },
  badge_earned: { icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-500/15' },
  comment: { icon: MessageCircle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/15' },
  reaction: { icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-500/15' },
}

// ── Texto descritivo por tipo ──
function getActivityDescription(activity: Activity): string {
  const { type, user, target, meta } = activity
  const name = user.name.split(' ')[0]

  switch (type) {
    case 'course_completed':
      return `${name} concluiu "${target?.title}"`

    case 'course_started':
      return `${name} começou a assistir "${target?.title}"`

    case 'xp_milestone':
      return `${name} atingiu ${meta?.xpGained?.toLocaleString('pt-BR')} XP${meta?.tier ? ` (${meta.tier})` : ''}`

    case 'badge_earned':
      return `${name} desbloqueou o badge "${target?.title}"`

    case 'comment':
      return `${name} comentou em "${target?.title}"`

    case 'reaction':
      return `${name} reagiu a "${target?.title}"`

    default:
      return `${name} teve uma atividade`
  }
}

// ── Time formatting ──
function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'agora mesmo'
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return then.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

// ── Avatar component ──
function Avatar({ user, size = 'md' }: { user: Activity['user']; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
  }

  return (
    <div className={`relative overflow-hidden rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-500/30 ${sizeClasses[size]}`}>
      {user.avatarUrl ? (
        <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" unoptimized />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-bold text-yellow-300">
          {user.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

// ── Single activity item ──
function ActivityItem({
  activity,
  variant,
  showTime,
}: {
  activity: Activity
  variant: 'compact' | 'full'
  showTime: boolean
}) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="group relative flex gap-3 rounded-xl border border-transparent py-3 transition-all hover:border-white/5 hover:bg-white/[0.02]">
      {/* Avatar com badge do tipo */}
      <div className="relative shrink-0">
        <Avatar user={activity.user} size={variant === 'compact' ? 'sm' : 'md'} />
        <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#262626] ${config.bgColor}`}>
          <Icon className={`h-2.5 w-2.5 ${config.color}`} />
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-white/80">
          {getActivityDescription(activity)}
        </p>

        {/* Meta info (xp, rank, etc) */}
        {activity.meta?.rank && (
          <div className="mt-1 flex items-center gap-1.5">
            <Trophy className="h-3 w-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Top {activity.meta.rank} esta semana</span>
          </div>
        )}

        {activity.meta?.commentPreview && (
          <p className="mt-2 truncate rounded-lg bg-white/5 px-3 py-2 text-xs text-white/50 italic">
            &ldquo;{activity.meta.commentPreview}&rdquo;
          </p>
        )}

        {/* Actions row */}
        <div className="mt-2 flex items-center gap-4">
          {showTime && (
            <span className="text-[11px] text-white/40">{formatTimeAgo(activity.timestamp)}</span>
          )}

          {activity.reactions && (
            <button
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                activity.reactions.userReacted ? 'text-pink-400' : 'text-white/40 hover:text-pink-400'
              }`}
            >
              <Heart className={`h-3 w-3 ${activity.reactions.userReacted ? 'fill-current' : ''}`} />
              {activity.reactions.count > 0 && activity.reactions.count}
            </button>
          )}

          {activity.comments && activity.comments.count > 0 && (
            <button className="flex items-center gap-1 text-[11px] text-white/40 hover:text-yellow-400">
              <MessageCircle className="h-3 w-3" />
              {activity.comments.count}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Loading skeleton ──
function ActivityFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </>
  )
}

// ── Main ActivityFeed component ──
export function ActivityFeed({
  activities,
  variant = 'full',
  maxItems,
  showTime = true,
  className = '',
  autoRefresh = 0,
  onLoadMore,
  seeAllHref,
}: ActivityFeedProps) {
  const [items, setItems] = useState(activities)
  const [isLoading, _setIsLoading] = useState(false)
  const [hasMore, _setHasMore] = useState(!!onLoadMore)

  useEffect(() => {
    setItems(activities)
  }, [activities])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || autoRefresh <= 0) return
    const interval = setInterval(() => {
      // Em produção, aqui seria uma chamada à API
      // onLoadMore?.() // Descomentar quando tiver API real
    }, autoRefresh)
    return () => clearInterval(interval)
  }, [autoRefresh, onLoadMore])

  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-1">
        {displayItems.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            variant={variant}
            showTime={showTime}
          />
        ))}

        {isLoading && <ActivityFeedSkeleton count={2} />}
      </div>

      {/* See all link */}
      {seeAllHref && hasMore && !maxItems && (
        <div className="mt-4 border-t border-white/5 pt-4 text-center">
          <Link
            href={seeAllHref}
            className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300"
          >
            Ver toda a atividade
          </Link>
        </div>
      )}

      {/* Load more button */}
      {onLoadMore && hasMore && maxItems && (
        <div className="mt-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-sm font-medium text-white/50 transition-colors hover:text-white disabled:opacity-50"
          >
            {isLoading ? 'Carregando...' : 'Ver mais'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Community Stats Widget ──
export function CommunityStats({
  totalStudents = 0,
  activeNow = 0,
  coursesCompleted = 0,
  className = '',
}: {
  totalStudents?: number
  activeNow?: number
  coursesCompleted?: number
  className?: string
}) {
  const stats = [
    {
      label: 'Alunos',
      value: totalStudents.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Online agora',
      value: activeNow.toLocaleString('pt-BR'),
      icon: Flame,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Concluídos',
      value: coursesCompleted.toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ]

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center"
        >
          <span className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </span>
          <p className="text-lg font-bold text-white">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed