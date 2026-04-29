import Link from 'next/link'
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Building2,
  Plus,
  Users,
  ArrowRight,
  BarChart3,
} from 'lucide-react'

import { getTurmas } from '@/lib/actions/turmas'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Agendada', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: { label: 'Em andamento', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Concluída', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
  const startStr = s.toLocaleDateString('pt-BR', opts)
  const endStr = e.toLocaleDateString('pt-BR', opts)

  if (startStr === endStr) return startStr
  return `${s.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${endStr}`
}

export default async function TurmasPage() {
  const turmas = await getTurmas()

  const total = turmas.length
  const scheduled = turmas.filter((t) => t.status === 'scheduled').length
  const completed = turmas.filter((t) => t.status === 'completed').length

  const totalParticipants = turmas.reduce((acc, t) => acc + t.participant_count, 0)
  const totalAttended = turmas.reduce((acc, t) => acc + t.attended_count, 0)
  const attendanceRate = totalParticipants > 0 ? Math.round((totalAttended / totalParticipants) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Dark Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-yellow-600/10 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Gestão de Treinamentos
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Turmas Presenciais
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[#A9BDD8]">
            Crie e gerencie turmas de treinamento presencial. Acompanhe agendamentos, participantes e taxa de presenca em um unico painel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/turmas/nova"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E65100]"
            >
              <Plus className="h-4 w-4" />
              Nova Turma
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total turmas</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{total}</p>
          <p className="mt-1 text-xs text-[#64748B]">{turmas.filter((t) => t.status === 'in_progress').length} em andamento</p>
        </article>

        <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <CalendarDays className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700">Agendadas</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-sky-900">{scheduled}</p>
          <p className="mt-1 text-xs text-sky-600">turmas futuras</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Concluidas</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-900">{completed}</p>
          <p className="mt-1 text-xs text-emerald-600">treinamentos realizados</p>
        </article>

        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <BarChart3 className="h-4.5 w-4.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Taxa de presenca</p>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{attendanceRate}%</p>
          <p className="mt-1 text-xs text-[#64748B]">{totalAttended} de {totalParticipants} participantes</p>
        </article>
      </section>

      {/* Turmas Grid */}
      {turmas.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center shadow-sm">
          <GraduationCap className="mx-auto h-10 w-10 text-[#94A3B8]" />
          <h2 className="mt-4 text-xl font-extrabold text-[#0F172A]">Nenhuma turma cadastrada</h2>
          <p className="mt-2 text-sm text-[#64748B]">Crie sua primeira turma presencial para comecar.</p>
          <Link
            href="/admin/turmas/nova"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E65100]"
          >
            <Plus className="h-4 w-4" />
            Criar primeira turma
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
              <CalendarCheck className="h-5 w-5 text-[#1565C0]" />
              Todas as Turmas
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {turmas.map((turma) => {
              const statusCfg = STATUS_CONFIG[turma.status] ?? STATUS_CONFIG.scheduled
              const participantPct = turma.max_participants > 0
                ? Math.round((turma.participant_count / turma.max_participants) * 100)
                : 0

              return (
                <article
                  key={turma.id}
                  className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-[#0F172A]">{turma.title}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        {turma.company_name && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2 py-0.5 text-[10px] font-bold text-[#334155]">
                            <Building2 className="h-3 w-3" />
                            {turma.company_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <CalendarDays className="h-3.5 w-3.5 text-[#1565C0]" />
                      {formatDateRange(turma.training_date_start, turma.training_date_end)}
                    </div>
                    {turma.location && (
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <MapPin className="h-3.5 w-3.5 text-[#1565C0]" />
                        {turma.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <Users className="h-3.5 w-3.5 text-[#1565C0]" />
                      {turma.participant_count} / {turma.max_participants} participantes
                    </div>
                  </div>

                  {/* Participant progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5ECF6]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          participantPct >= 90 ? 'bg-rose-500' : participantPct >= 70 ? 'bg-amber-500' : 'bg-[#1E88E5]'
                        }`}
                        style={{ width: `${Math.min(participantPct, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-[#94A3B8]">{participantPct}% preenchido</p>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/admin/turmas/${turma.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1E88E5] hover:underline"
                    >
                      Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
