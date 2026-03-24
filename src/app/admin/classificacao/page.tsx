import { AlertTriangle, Link2, Users } from 'lucide-react'

import {
  getClassificacaoKPIs,
  getLinkedExecAssessments,
  getUnlinkedExecAssessments,
} from '@/lib/actions/gestao'
import ClassificacaoClient from './ClassificacaoClient'

export default async function ClassificacaoPage() {
  const [kpis, unlinked, linked] = await Promise.all([
    getClassificacaoKPIs(),
    getUnlinkedExecAssessments(),
    getLinkedExecAssessments(),
  ])

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Gestao de vinculos
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Classificacao e Vinculacao PDI
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Vincule avaliacoes executivas aos supervisores para gerar PDIs corporativos completos.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            PDIs Individuais
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{kpis.individual}</p>
          <p className="mt-1 text-[11px] text-[#94A3B8]">Autoavaliacao sem exec vinculada</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
            <Link2 className="h-4.5 w-4.5 text-emerald-700" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            PDIs Corporativos
          </p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-900">{kpis.corporate}</p>
          <p className="mt-1 text-[11px] text-emerald-600">Exec vinculada a supervisor</p>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-700" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Avaliacoes Pendentes
          </p>
          <p className="mt-1 text-3xl font-extrabold text-amber-900">{kpis.pending}</p>
          <p className="mt-1 text-[11px] text-amber-600">Sem supervisor vinculado</p>
        </article>
      </section>

      {/* Interactive client section */}
      <ClassificacaoClient unlinked={unlinked} linked={linked} />
    </div>
  )
}
