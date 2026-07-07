'use client'

import { CSSProperties, ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsapSetup'

type RevealProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  y?: number
  /** Anima os filhos diretos em cascata em vez do container inteiro */
  stagger?: number
}

export default function Reveal({ children, className, style, delay = 0, y = 36, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const targets = stagger != null ? Array.from(el.children) : el
    const ctx = gsap.context(() => {
      // set + to com valores explícitos: imune à recaptura de from() em refresh
      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [delay, stagger, y])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
