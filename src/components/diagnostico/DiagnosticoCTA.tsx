'use client'

import { useState, type ReactNode } from 'react'
import { DiagnosticoTipoModal } from './DiagnosticoTipoModal'

type Props = {
  className?: string
  children: ReactNode
}

export function DiagnosticoCTA({ className, children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <DiagnosticoTipoModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
