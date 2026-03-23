'use client'

import Link from 'next/link'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050A14] px-6 text-[#E5ECF8]">
      <div className="w-full max-w-lg rounded-2xl border border-[#2B3D60] bg-[#0B1222] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7FA0C2]">Erro inesperado</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Algo deu errado</h1>
        <p className="mt-3 text-sm text-[#9DB5CF]">
          Um erro inesperado ocorreu. Tente novamente ou entre em contato com o suporte.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1565C0]"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#365781] px-5 py-3 text-sm font-bold text-[#D5E9FB] transition hover:border-[#4EA1F0] hover:text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
