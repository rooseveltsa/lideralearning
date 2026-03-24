import Link from 'next/link'
import { ArrowLeft, GraduationCap } from 'lucide-react'

import { createTurma } from '@/lib/actions/turmas'

export default function NovaTurmaPage() {
  return (
    <div className="space-y-8">
      {/* Dark Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <Link
            href="/admin/turmas"
            className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-[#8CB8E7] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para turmas
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F57C00]/20 text-[#F57C00]">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
                Nova turma
              </p>
              <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
                Criar Turma Presencial
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
            Preencha os dados abaixo para agendar uma nova turma de treinamento presencial.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <form action={createTurma} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
              Titulo da turma *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Ex: Lideranca Estrategica - Turma 01/2026"
              className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
              Descricao
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Descricao do treinamento, conteudo programatico, objetivos..."
              className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="training_date_start" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Data/hora inicio *
              </label>
              <input
                id="training_date_start"
                name="training_date_start"
                type="datetime-local"
                required
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label htmlFor="training_date_end" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Data/hora fim *
              </label>
              <input
                id="training_date_end"
                name="training_date_end"
                type="datetime-local"
                required
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
          </div>

          {/* Location + Max Participants */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Local
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Ex: Sala de treinamento - Sede Empresa X"
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label htmlFor="max_participants" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Max. participantes
              </label>
              <input
                id="max_participants"
                name="max_participants"
                type="number"
                min={1}
                defaultValue={10}
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
          </div>

          {/* Mentor + Company */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mentor_name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Mentor / Facilitador
              </label>
              <input
                id="mentor_name"
                name="mentor_name"
                type="text"
                defaultValue="Claudemir Domingos"
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label htmlFor="company_name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Empresa (in-company)
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                placeholder="Deixe em branco para turma aberta"
                className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition-colors focus:border-[#1E88E5]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-[#E5ECF6] pt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E65100]"
            >
              <GraduationCap className="h-4 w-4" />
              Criar Turma
            </button>
            <Link
              href="/admin/turmas"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-6 py-3 text-sm font-bold text-[#64748B] transition-colors hover:bg-slate-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
