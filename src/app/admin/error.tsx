'use client'

import Link from 'next/link'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto mt-16 max-w-lg">
      <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Erro no painel</p>
        <h1 className="mt-3 text-2xl font-bold text-[#0F172A]">Falha ao carregar módulo administrativo</h1>
        <p className="mt-3 text-sm text-[#64748B]">
          Tente novamente ou volte à visão geral do painel.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1565C0]"
          >
            Tentar novamente
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-[#D8E2EF] px-5 py-3 text-sm font-bold text-[#334155] transition hover:border-[#A9BDD8] hover:text-[#0F172A]"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  )
}
