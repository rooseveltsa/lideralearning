'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

type Variant = 'subtle' | 'outline'

type Props = {
  fallbackHref: string
  variant?: Variant
  className?: string
  children: ReactNode
}

export function BackButton({ fallbackHref, variant = 'subtle', className, children }: Props) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (typeof window === 'undefined') {
      router.push(fallbackHref)
      return
    }
    const sameOriginReferrer =
      document.referrer && document.referrer.includes(window.location.host)
    if (window.history.length > 1 && sameOriginReferrer) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  const base = variant === 'outline'
    ? 'inline-flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-white px-6 py-3 text-sm font-bold text-[#334155] transition-colors hover:bg-[#F8FAFD]'
    : 'inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]'

  return (
    <button type="button" onClick={handleClick} className={className || base}>
      {children}
    </button>
  )
}
