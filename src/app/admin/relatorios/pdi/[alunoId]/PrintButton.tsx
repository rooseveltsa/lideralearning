'use client'

import { Printer } from 'lucide-react'

export default function PrintPDIButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0D47A1] hover:shadow-lg print:hidden"
    >
      <Printer className="h-4 w-4" />
      Imprimir
    </button>
  )
}
