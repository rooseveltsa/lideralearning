'use client'

import { Download } from 'lucide-react'

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-xl font-bold text-sm hover:bg-[#1E293B] shadow-lg shadow-[#111827]/10 transition-all"
        >
            <Download className="h-4 w-4" />
            Imprimir / PDF
        </button>
    )
}
