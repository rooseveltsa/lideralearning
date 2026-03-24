'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyLinkButton({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
        copiado
          ? 'bg-[#4CAF35] text-white'
          : 'border border-[#D8E2EF] bg-white text-[#334155] hover:bg-[#F7FAFE]'
      }`}
    >
      {copiado ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </>
      )}
    </button>
  )
}
