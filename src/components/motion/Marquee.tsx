import { ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  className?: string
}

/** Marquee infinito em CSS puro (pausa no hover, desliga com reduced-motion). */
export default function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={`ld-marquee ${className ?? ''}`}>
      <div className="ld-marquee-track">
        <div className="ld-marquee-group">{children}</div>
        <div className="ld-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
