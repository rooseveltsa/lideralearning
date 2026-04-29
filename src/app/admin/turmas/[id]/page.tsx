import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Pencil,
  Users,
  XCircle,
} from 'lucide-react'

import { getTurmaById, completeTurma, cancelTurma } from '@/lib/actions/turmas'
import TurmaDetailClient from './TurmaDetailClient'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Agendada', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: { label: 'Em andamento', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Concluida', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function TurmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getTurmaById(id)

  if (!result) notFound()

  const { training, participants } = result
  const statusCfg = STATUS_CONFIG[training.status] ?? STATUS_CONFIG.scheduled
  const canEdit = training.status === 'scheduled' || training.status === 'in_progress'
  const canComplete = training.status === 'scheduled' || training.status === 'in_progress'
  const canCancel = training.status === 'scheduled' || training.status === 'in_progress'

  return (
    <div className="space-y-8">
      {/* Dark Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-yellow-600/10 blur-[90px]" />
        <div className="relative">
          <Link
            href="/admin/turmas"
            className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-[#8CB8E7] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para turmas
          </Link>

          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E88E5]/20 text-[#1E88E5]">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl font-extrabold leading-tight md:text-3xl">
                  {training.title}
                </h1>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#A9BDD8]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDateTime(training.training_date_start)} — {formatDateTime(training.training_date_end)}
                </span>
                {training.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {training.location}
                  </span>
                )}
              </div>

              {training.description && (
                <p className="mt-3 max-w-2xl text-sm text-[#A9BDD8]">{training.description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {canEdit && (
              <Link
                href={`/admin/turmas/${training.id}/editar`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            )}
            {canComplete && (
              <form action={completeTurma}>
                <input type="hidden" name="id" value={training.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar Concluida
                </button>
              </form>
            )}
            {canCancel && (
              <form action={cancelTurma}>
                <input type="hidden" name="id" value={training.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
                >
                  <XCircle className="h-4 w-4" />
                  Cancelar Turma
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Summary KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Users className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Participantes</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">
            {participants.length} / {training.max_participants}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            {training.max_participants - participants.length} vagas restantes
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Presentes</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">
            {participants.filter((p) => p.status === 'attended').length}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {participants.filter((p) => p.status === 'confirmed').length} confirmados
          </p>
        </article>

        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-700">Ausentes</p>
          <p className="mt-2 text-3xl font-extrabold text-rose-900">
            {participants.filter((p) => p.status === 'no_show').length}
          </p>
          <p className="mt-1 text-xs text-rose-600">
            {participants.filter((p) => p.status === 'registered').length} pendentes
          </p>
        </article>
      </section>

      {/* Interactive Client Component */}
      <TurmaDetailClient
        training={training}
        participants={participants}
      />
    </div>
  )
}
