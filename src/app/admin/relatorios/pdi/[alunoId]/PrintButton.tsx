'use client'

import { Download } from 'lucide-react'

export default function PrintPDIButton() {
  function handleClick() {
    // Pequeno delay garante que os estilos @media print apliquem antes do dialog
    setTimeout(() => window.print(), 100)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0D47A1] hover:shadow-lg print:hidden"
      title="Abre o diálogo de impressão — escolha 'Salvar como PDF' para baixar"
    >
      <Download className="h-4 w-4" />
      Baixar PDF
    </button>
  )
}
