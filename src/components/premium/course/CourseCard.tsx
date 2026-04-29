'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Star, Play } from 'lucide-react'

export interface CourseCardProps {
  id: string
  title: string
  thumbnailUrl?: string | null
  instructor: {
    name: string
    avatarUrl?: string | null
  }
  category: string
  duration?: string // e.g., "12h 30min"
  totalLessons?: number
  progressPercent?: number // 0-100
  rating?: number
  studentsCount?: number
  badge?: 'new' | 'bestseller' | 'updated' | 'coming-soon'
  price?: {
    original?: number
    current: number
  }
  href: string
  variant?: 'default' | 'compact' | 'horizontal'
  className?: string
}

function formatDuration(duration: string): string {
  return duration
}

function BadgePill({ type }: { type: NonNullable<CourseCardProps['badge']> }) {
  const config = {
    'new': { label: 'Novo', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    'bestseller': { label: 'Mais vendido', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    'updated': { label: 'Atualizado', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    'coming-soon': { label: 'Em breve', className: 'bg-white/10 text-white/60 border-white/20' },
  }
  const { label, className } = config[type]
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
      {label}
    </span>
  )
}

export function CourseCard({
  id: _id,
  title,
  thumbnailUrl,
  instructor,
  category,
  duration,
  totalLessons,
  progressPercent,
  rating,
  studentsCount,
  badge,
  price,
  href,
  variant = 'default',
  className = '',
}: CourseCardProps) {
  const isInProgress = typeof progressPercent === 'number' && progressPercent > 0 && progressPercent < 100
  const isCompleted = typeof progressPercent === 'number' && progressPercent === 100

  // Compact variant for horizontal lists
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={`group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/10 hover:bg-white/[0.04] ${className}`}
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={title} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-5 w-5 text-white/30" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-white/50">{instructor.name}</p>
          {isInProgress && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-yellow-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-[10px] font-medium text-yellow-400">{progressPercent}%</span>
            </div>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
      </Link>
    )
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <Link
        href={href}
        className={`group grid grid-cols-[200px_1fr] gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.04] ${className}`}
      >
        <div className="relative h-32 overflow-hidden rounded-xl bg-white/5">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-10 w-10 text-white/20" />
            </div>
          )}
          {badge && (
            <div className="absolute left-3 top-3">
              <BadgePill type={badge} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-yellow-400">{category}</p>
            <h3 className="mt-1.5 text-xl font-bold text-white group-hover:text-yellow-200">{title}</h3>
            <p className="mt-1 text-sm text-white/50">{instructor.name}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(duration)}
              </span>
            )}
            {totalLessons && <span>{totalLessons} aulas</span>}
            {rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
            {studentsCount && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {studentsCount.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Default card variant (Netflix-style)
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-400 hover:border-white/15 hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.5)] hover:scale-[1.02] ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-white/5">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-full bg-white/5 p-4">
              <Play className="h-8 w-8 text-white/30" />
            </div>
          </div>
        )}

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
            <Play className="h-8 w-8 text-white" fill="white" />
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute left-3 top-3 z-10">
            <BadgePill type={badge} />
          </div>
        )}

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {category}
          </span>
        </div>

        {/* Progress bar */}
        {isInProgress && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Instructor */}
        <div className="mb-2 flex items-center gap-2">
          <div className="relative h-5 w-5 overflow-hidden rounded-full bg-yellow-500/20">
            {instructor.avatarUrl ? (
              <Image src={instructor.avatarUrl} alt={instructor.name} fill className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[8px] font-bold text-yellow-400">
                {instructor.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs text-white/50">{instructor.name}</span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-white transition-colors group-hover:text-yellow-200">
          {title}
        </h3>

        {/* Meta info */}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-white/40">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </span>
          )}
          {rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Progress info */}
        {isInProgress && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-yellow-400">{progressPercent}%</span>
          </div>
        )}

        {isCompleted && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Concluído
            </span>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">
              R$ {price.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {price.original && price.original > price.current && (
              <span className="text-sm text-white/40 line-through">
                R$ {price.original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default CourseCard