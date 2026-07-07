'use client'

import { CSSProperties, ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsapSetup'

type TiltCardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Inclinação máxima em graus */
  max?: number
}

export default function TiltCard({ children, className, style, max = 5 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    gsap.set(el, { transformPerspective: 900 })
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      rotY(((e.clientX - rect.left) / rect.width - 0.5) * 2 * max)
      rotX(-((e.clientY - rect.top) / rect.height - 0.5) * 2 * max)
    }
    const onLeave = () => {
      rotX(0)
      rotY(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [max])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
