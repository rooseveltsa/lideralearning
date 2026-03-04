'use client'

import { Download } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-5 text-sm font-bold text-[#334155] transition-colors hover:bg-[#F5F9FE]"
    >
      <Download className="h-4 w-4" />
      Imprimir / PDF
    </button>
  )
}
