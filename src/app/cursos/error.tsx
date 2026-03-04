'use client'

import Link from 'next/link'

export default function CursosError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#05080F] px-6 py-20 text-[#E6EDF7]">
      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-[#2B3D60] bg-[#0B1222] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7FA0C2]">Falha de carregamento</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Não foi possível carregar o stream de treinamentos</h1>
        <p className="mt-4 text-[#9DB5CF]">
          Tente novamente em instantes. Se o problema persistir, entre em contato com nosso time para suporte.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1565C0]"
          >
            Tentar novamente
          </button>

          <Link
            href="/contato"
            className="rounded-lg border border-[#365781] px-5 py-3 text-sm font-bold text-[#D5E9FB] transition hover:border-[#4EA1F0] hover:text-white"
          >
            Falar com suporte
          </Link>
        </div>
      </div>
    </div>
  )
}
