'use client'

import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

/** Carrega o canvas Three.js só no client, sem bloquear o SSR do hero. */
export default function HeroBackdrop() {
  return <HeroScene />
}
