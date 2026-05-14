'use client'

import { Download } from 'lucide-react'

type Props = {
  variant?: 'primary' | 'secondary'
  label?: string
}

export function PdiPrintButton({ variant = 'secondary', label = 'Baixar PDI em PDF' }: Props) {
  const baseClass =
    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-colors print:hidden'
  const variantClass =
    variant === 'primary'
      ? 'bg-[#0F172A] text-white hover:bg-[#1565C0]'
      : 'border border-[#E3EBF6] bg-white text-[#0F172A] hover:bg-[#F8FAFD]'

  function handleClick() {
    // Pequeno delay garante que estilos @media print apliquem antes do dialog abrir
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <button type="button" onClick={handleClick} className={`${baseClass} ${variantClass}`}>
      <Download className="h-4 w-4" />
      {label}
    </button>
  )
}
