'use client'

import Link from 'next/link'

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto mt-16 max-w-lg p-6">
      <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Erro no dashboard</p>
        <h1 className="mt-3 text-2xl font-bold text-[#0F172A]">Não foi possível carregar esta página</h1>
        <p className="mt-3 text-sm text-[#64748B]">
          Tente novamente em instantes. Se o problema persistir, entre em contato com nosso suporte.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1565C0]"
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#D8E2EF] px-5 py-3 text-sm font-bold text-[#334155] transition hover:border-[#A9BDD8] hover:text-[#0F172A]"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
