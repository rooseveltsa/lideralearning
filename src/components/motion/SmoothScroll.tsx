'use client'

import { ReactNode, useEffect, useSyncExternalStore } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap, ScrollTrigger } from './gsapSetup'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

/**
 * Integração Lenis + GSAP: o raf do Lenis é dirigido pelo ticker do GSAP
 * e cada scroll do Lenis atualiza o ScrollTrigger (sem passar argumentos —
 * ScrollTrigger.update(reset) interpreta objeto truthy como reset).
 */
function RafDriver() {
  const lenis = useLenis(() => ScrollTrigger.update())

  useEffect(() => {
    if (!lenis) return
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [lenis])

  return null
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (reducedMotion) return <>{children}</>

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.11 }}>
      <RafDriver />
      {children}
    </ReactLenis>
  )
}
