'use client'

import { useState, useTransition } from 'react'
import {
  ChevronDown,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

import {
  addParticipant,
  updateParticipantStatus,
  removeParticipant,
} from '@/lib/actions/turmas'
import type { PresentialTraining, ParticipantWithProfile } from '@/types/management'

const PARTICIPANT_STATUSES = [
  { value: 'registered', label: 'Inscrito', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { value: 'confirmed', label: 'Confirmado', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'attended', label: 'Presente', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'no_show', label: 'Ausente', color: 'bg-rose-50 text-rose-700 border-rose-200' },
] as const

export default function TurmaDetailClient({
  training,
  participants,
}: {
  training: PresentialTraining
  participants: ParticipantWithProfile[]
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isEditable = training.status === 'scheduled' || training.status === 'in_progress'

  function handleAddParticipant(fd: FormData) {
    startTransition(async () => {
      await addParticipant(fd)
      setShowAddForm(false)
    })
  }

  function handleUpdateStatus(fd: FormData) {
    startTransition(async () => {
      await updateParticipantStatus(fd)
    })
  }

  function handleRemove(fd: FormData) {
    startTransition(async () => {
      await removeParticipant(fd)
    })
  }

  return (
    <div className="space-y-6">
      {/* Section Header + Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Users className="h-5 w-5 text-[#1565C0]" />
          Participantes ({participants.length})
        </h2>
        {isEditable && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Fechar' : 'Adicionar participante'}
          </button>
        )}
      </div>

      {/* Add Participant Form */}
      {showAddForm && isEditable && (
        <section className="rounded-2xl border border-[#1E88E5]/30 bg-[#F0F7FF] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
            Novo participante
          </p>
          <form action={handleAddParticipant} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input type="hidden" name="training_id" value={training.id} />
            <input
              name="participant_name"
              placeholder="Nome completo *"
              required
              className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm text-[#334155] outline-none focus:border-[#1E88E5]"
            />
            <input
              name="participant_email"
              type="email"
              placeholder="E-mail"
              className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm text-[#334155] outline-none focus:border-[#1E88E5]"
            />
            <input
              name="company_name"
              placeholder="Empresa"
              className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm text-[#334155] outline-none focus:border-[#1E88E5]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1E88E5] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="h-11 rounded-xl border border-[#D8E2EF] bg-white px-4 text-sm font-bold text-[#64748B] hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Participants Table */}
      {participants.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-[#94A3B8]" />
          <h3 className="mt-4 text-xl font-extrabold text-[#0F172A]">Nenhum participante</h3>
          <p className="mt-2 text-sm text-[#64748B]">
            Adicione participantes para esta turma.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#D8E2EF] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5ECF6] bg-[#F8FAFD]">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    Nome
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    E-mail
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    Empresa
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    Gestor
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    Status
                  </th>
                  {isEditable && (
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                      Acoes
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => {
                  const statusConfig = PARTICIPANT_STATUSES.find(
                    (s) => s.value === participant.status
                  )

                  return (
                    <tr
                      key={participant.id}
                      className="border-b border-[#E5ECF6] last:border-b-0 hover:bg-[#FAFCFF]"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B4A8F]/10 text-[10px] font-bold text-[#0B4A8F]">
                            {participant.participant_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <span className="font-bold text-[#0F172A]">
                            {participant.participant_name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-[#64748B]">
                        {participant.participant_email || '—'}
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4 text-[#64748B]">
                        {participant.company_name || '—'}
                      </td>

                      {/* Gestor */}
                      <td className="px-5 py-4 text-[#64748B]">
                        {participant.gestor_profile?.full_name || '—'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {isEditable ? (
                          <form action={handleUpdateStatus} className="flex items-center gap-1">
                            <input type="hidden" name="participant_id" value={participant.id} />
                            <input type="hidden" name="training_id" value={training.id} />
                            <div className="relative">
                              <select
                                name="status"
                                defaultValue={participant.status}
                                className="h-8 appearance-none rounded-lg border border-[#D8E2EF] bg-white pl-2.5 pr-7 text-[11px] font-semibold text-[#334155] outline-none focus:border-[#1E88E5]"
                              >
                                {PARTICIPANT_STATUSES.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                            </div>
                            <button
                              type="submit"
                              disabled={isPending}
                              className="h-8 rounded-lg border border-[#D8E2EF] bg-white px-2 text-[10px] font-bold uppercase text-[#334155] hover:bg-slate-50 disabled:opacity-50"
                            >
                              Salvar
                            </button>
                          </form>
                        ) : (
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusConfig?.color ?? 'bg-slate-50 text-slate-700 border-slate-200'}`}
                          >
                            {statusConfig?.label ?? participant.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      {isEditable && (
                        <td className="px-5 py-4">
                          <form action={handleRemove}>
                            <input type="hidden" name="participant_id" value={participant.id} />
                            <input type="hidden" name="training_id" value={training.id} />
                            <button
                              type="submit"
                              disabled={isPending}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
