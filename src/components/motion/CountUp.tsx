'use client'

import { CSSProperties, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsapSetup'

type CountUpProps = {
  /** Valor final com prefixo/sufixo, ex.: "+79%", "−43%", "98%" */
  value: string
  className?: string
  style?: CSSProperties
}

export default function CountUp({ value, className, style }: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const match = value.match(/^([+\-−]?)(\d[\d.]*?)(\D.*|)$/)
    if (!match) return
    const [, prefix, num, suffix] = match
    const hasThousands = num.includes('.')
    const target = parseInt(num.replace(/\./g, ''), 10)
    const format = (n: number) => (hasThousands ? n.toLocaleString('pt-BR') : String(n))
    const state = { n: 0 }

    el.textContent = `${prefix}0${suffix}`
    const tween = gsap.to(state, {
      n: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      onUpdate: () => {
        el.textContent = `${prefix}${format(Math.round(state.n))}${suffix}`
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      el.textContent = value
    }
  }, [value])

  return (
    <div ref={ref} className={className} style={style}>
      {value}
    </div>
  )
}
