'use client'

import { useEffect, useState } from 'react'
import { DiagnosticoTipoModal } from './DiagnosticoTipoModal'

/**
 * Para usuários que chegam direto em /diagnostico (link compartilhado, Google):
 * abre o modal automaticamente ao carregar a página.
 * Botão "Escolher tipo" continua visível para reabrir caso fechem.
 */
export function DiagnosticoAutoOpen() {
  const [open, setOpen] = useState(true)

  // Reabre o modal se o usuário fechar e clicar no botão de retomar
  useEffect(() => {
    if (!open) {
      // delay pequeno permite animação de fechamento natural
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F]"
      >
        Começar agora
      </button>
      <DiagnosticoTipoModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
