'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'

import { createCourse } from '@/app/admin/actions'

export default function NovoCursoPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createCourse(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Cadastro de formação</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Criar nova formação</h1>
            <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
              Defina informações básicas do programa. Módulos e aulas serão adicionados na próxima etapa.
            </p>
          </div>

          <Link
            href="/admin/cursos"
            className="inline-flex items-center gap-2 rounded-xl border border-[#274364] bg-[#0A1528] px-4 py-2.5 text-sm font-bold text-[#C4D8EF] transition-colors hover:bg-[#10203A] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
        </div>
      </section>

      <section className="max-w-3xl rounded-2xl border border-[#D8E2EF] bg-white p-8 shadow-sm">
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Título da formação *</label>
            <input
              name="title"
              required
              placeholder="Ex: Liderança de Alta Performance"
              className="h-12 w-full rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-4 text-sm font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#1E88E5] focus:bg-white focus:ring-4 focus:ring-[#1E88E5]/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Descrição</label>
            <textarea
              name="description"
              rows={5}
              placeholder="Resumo da transformação proposta por essa formação..."
              className="w-full rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-4 py-3 text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#1E88E5] focus:bg-white focus:ring-4 focus:ring-[#1E88E5]/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Preço (R$)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                placeholder="997.00"
                className="h-12 w-full rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-4 text-sm font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#1E88E5] focus:bg-white focus:ring-4 focus:ring-[#1E88E5]/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">URL da thumbnail</label>
              <input
                name="thumbnail_url"
                type="url"
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-4 text-sm font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#1E88E5] focus:bg-white focus:ring-4 focus:ring-[#1E88E5]/10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E8EEF7] pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isPending ? 'Criando formação...' : 'Salvar e continuar'}
            </button>

            <Link
              href="/admin/cursos"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[#D8E2EF] px-6 text-sm font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
