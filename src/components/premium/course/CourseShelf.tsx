'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Users, Flame } from 'lucide-react'
import { CourseCard, CourseCardProps } from './CourseCard'

export interface CourseShelfProps {
  title: string
  subtitle?: string
  courses: CourseCardProps[]
  variant?: 'continue' | 'trending' | 'community' | 'recommended' | 'all'
  /** Mostrabadge de "X pessoas assistindo agora" */
  showLiveCount?: boolean
  liveCount?: number
  /** Link para ver todos os itens */
  seeAllHref?: string
  seeAllLabel?: string
  /** Quantos cards visíveis por vez (responsive) */
  visibleCards?: { mobile: number; tablet: number; desktop: number; wide: number }
  className?: string
}

function getVisibleCount(visibleCards: CourseShelfProps['visibleCards']) {
  const defaults = { mobile: 1.2, tablet: 2.5, desktop: 3.5, wide: 5 }
  const v = { ...defaults, ...visibleCards }
  // Retorna objeto com breakpoints em vez de count fixo
  return v
}

export function CourseShelf({
  title,
  subtitle,
  courses,
  variant = 'recommended',
  showLiveCount,
  liveCount = 0,
  seeAllHref,
  seeAllLabel = 'Ver todos',
  visibleCards,
  className = '',
}: CourseShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Card width in pixels (approximate for gap calculation)
  const CARD_WIDTH = 320
  const CARD_GAP = 16

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [courses.length])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = (CARD_WIDTH + CARD_GAP) * 2.5
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const variantConfig = {
    continue: {
      accentColor: 'text-emerald-400',
      bgAccent: 'bg-emerald-500/10',
      icon: Flame,
      label: 'Continue assistindo',
    },
    trending: {
      accentColor: 'text-amber-400',
      bgAccent: 'bg-amber-500/10',
      icon: Flame,
      label: 'Em alta',
    },
    community: {
      accentColor: 'text-yellow-400',
      bgAccent: 'bg-yellow-500/10',
      icon: Users,
      label: 'Comunidade',
    },
    recommended: {
      accentColor: 'text-yellow-400',
      bgAccent: 'bg-yellow-500/10',
      icon: null,
      label: '',
    },
    all: {
      accentColor: 'text-white/60',
      bgAccent: 'bg-white/5',
      icon: null,
      label: '',
    },
  }

  const config = variantConfig[variant]
  const IconComponent = config.icon

  if (courses.length === 0) return null

  return (
    <section
      className={`relative ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            {IconComponent && (
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${config.bgAccent}`}>
                <IconComponent className={`h-4 w-4 ${config.accentColor}`} />
              </span>
            )}
            <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-white/50">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Live count */}
          {showLiveCount && liveCount > 0 && (
            <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/60 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span><span className="font-semibold text-white">{liveCount}</span> assistindo agora</span>
            </div>
          )}

          {/* See all link */}
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="group inline-flex items-center gap-1 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {seeAllLabel}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* Scroll navigation - Left */}
      <button
        onClick={() => scroll('left')}
        className={`absolute top-[55%] z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:border-white/20 lg:block ${
          !canScrollLeft ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{ left: '0.5rem' }}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Scroll navigation - Right */}
      <button
        onClick={() => scroll('right')}
        className={`absolute top-[55%] z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:border-white/20 lg:block ${
          !canScrollRight ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{ right: '0.5rem' }}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Cards scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pl-4 pr-4 lg:pl-6 lg:pr-6"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="shrink-0"
            style={{
              width: `min(${CARD_WIDTH}px, calc((100vw - 128px) / ${getVisibleCount(visibleCards).mobile}))`,
              scrollSnapAlign: 'start',
            }}
          >
            {/* Staggered animation */}
            <div
              className="animate-fade-up opacity-0"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <CourseCard {...course} />
            </div>
          </div>
        ))}

        {/* "View more" card at the end */}
        {seeAllHref && (
          <div
            className="shrink-0"
            style={{
              width: `min(${CARD_WIDTH}px, calc((100vw - 128px) / ${getVisibleCount(visibleCards).mobile}))`,
            }}
          >
            <a
              href={seeAllHref}
              className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center transition-all hover:border-yellow-500/30 hover:bg-yellow-500/5"
            >
              <div className="rounded-full bg-yellow-500/10 p-4">
                <ChevronRight className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="mt-4 font-semibold text-white/80">Ver mais</p>
              <p className="mt-1 text-sm text-white/40">{courses.length} cursos disponíveis</p>
            </a>
          </div>
        )}
      </div>

      {/* Fade indicators (edges) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1F1F1F] to-transparent lg:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1F1F1F] to-transparent lg:w-16" />

      <style jsx>{`
        @media (min-width: 640px) {
          section .shrink-0 {
            width: min(320px, calc((100vw - 192px) / 2.5)) !important;
          }
        }
        @media (min-width: 1024px) {
          section .shrink-0 {
            width: min(320px, calc((100vw - 256px) / 3.5)) !important;
          }
        }
        @media (min-width: 1440px) {
          section .shrink-0 {
            width: 300px !important;
          }
        }
      `}</style>
    </section>
  )
}

export default CourseShelf