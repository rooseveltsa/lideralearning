'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, User, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

export function DiagnosticoTipoModal({ open, onClose }: Props) {
  const router = useRouter()
  const [navigating, setNavigating] = useState<'empresa' | 'pessoal' | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  function go(path: '/diagnostico/empresa' | '/diagnostico/pessoal') {
    setNavigating(path.includes('empresa') ? 'empresa' : 'pessoal')
    router.push(path)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostico-tipo-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_22px_45px_rgba(2,6,23,0.35)] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="diagnostico-tipo-title"
          className="font-heading text-xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-2xl"
        >
          Antes de começar, conta pra gente:
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
          Você está fazendo o diagnóstico como...
        </p>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => go('/diagnostico/empresa')}
            disabled={!!navigating}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-[#E3EBF6] bg-white px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#1565C0] hover:shadow-[0_8px_20px_rgba(21,101,192,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FE] text-[#1565C0]">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#0F172A]">Empresa avaliando supervisor</p>
              <p className="text-xs text-[#64748B]">
                Mapeie expectativas e gaps de cada supervisor
              </p>
            </div>
            {navigating === 'empresa' && (
              <span className="text-xs font-bold text-[#1565C0]">...</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => go('/diagnostico/pessoal')}
            disabled={!!navigating}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-[#E3EBF6] bg-white px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#F57C00] hover:shadow-[0_8px_20px_rgba(245,124,0,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#F57C00]">
              <User className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#0F172A]">Sou supervisor / líder</p>
              <p className="text-xs text-[#64748B]">Autoavaliação + PDI personalizado</p>
            </div>
            {navigating === 'pessoal' && (
              <span className="text-xs font-bold text-[#F57C00]">...</span>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-[#94A3B8]">
          Você pode trocar de tipo a qualquer momento dentro do formulário.
        </p>
      </div>
    </div>
  )
}
