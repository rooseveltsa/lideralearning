import { Calendar, CheckCircle2, Clock, MessageSquare } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

export default async function AdminMentoriasPage() {
  const admin = createAdminClient()

  // Fetch all mentoring sessions with aluno names
  const { data: sessions } = await admin
    .from('mentoring_sessions')
    .select('id, aluno_user_id, session_type, scheduled_date, completed_date, status, notes, mentor_name')
    .order('scheduled_date', { ascending: false })

  // Fetch aluno names
  const alunoIds = [...new Set(sessions?.map((s) => s.aluno_user_id) ?? [])]
  const alunoNames = new Map<string, string>()
  if (alunoIds.length > 0) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, full_name')
      .in('id', alunoIds)
    if (profiles) {
      for (const p of profiles) alunoNames.set(p.id, p.full_name ?? 'Sem nome')
    }
  }

  // Stats
  const total = sessions?.length ?? 0
  const completed = sessions?.filter((s) => s.status === 'completed').length ?? 0
  const scheduled = sessions?.filter((s) => s.status === 'scheduled').length ?? 0
  const upcoming = sessions?.filter((s) => {
    if (s.status !== 'scheduled' || !s.scheduled_date) return false
    const diff = new Date(s.scheduled_date).getTime() - Date.now()
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
  }).length ?? 0

  const typeLabels: Record<string, string> = { '30_days': '30 dias', '60_days': '60 dias', extra: 'Extra' }
  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    scheduled: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-red-100 text-red-700',
  }
  const statusLabels: Record<string, string> = {
    completed: 'Concluida',
    scheduled: 'Agendada',
    cancelled: 'Cancelada',
    no_show: 'Ausente',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7B1FA2]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9A3E8]">
            Acompanhamento pos-treinamento
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Sessoes de Mentoria
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Gerencie as mentorias individuais de 30 e 60 dias. Garantia de
            implementacao para combater a curva do esquecimento.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7B1FA2]/10">
            <MessageSquare className="h-4.5 w-4.5 text-[#7B1FA2]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total sessoes</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{total}</p>
        </article>
        <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Agendadas</p>
          <p className="mt-2 text-3xl font-extrabold text-blue-900">{scheduled}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Concluidas</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{completed}</p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Esta semana</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-900">{upcoming}</p>
        </article>
      </section>

      {/* Session List */}
      {!sessions || sessions.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <MessageSquare className="h-8 w-8 text-[#94A3B8]" />
          </div>
          <h3 className="mb-2 font-heading text-xl font-extrabold text-[#111827]">Nenhuma mentoria registrada</h3>
          <p className="font-medium text-[#64748B]">As mentorias podem ser criadas na ficha do aluno.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Aluno</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Mentor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {sessions.map((session) => (
                  <tr key={session.id} className="transition-colors hover:bg-[#F8FAFC]">
                    <td className="px-6 py-5 text-sm font-bold text-[#111827]">
                      {alunoNames.get(session.aluno_user_id) ?? 'Desconhecido'}
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-md bg-[#7B1FA2]/10 px-2 py-1 text-[11px] font-bold text-[#7B1FA2]">
                        {typeLabels[session.session_type] ?? session.session_type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#64748B]">
                      {session.scheduled_date
                        ? new Date(session.scheduled_date).toLocaleDateString('pt-BR')
                        : 'Sem data'}
                    </td>
                    <td className="px-6 py-5 text-sm text-[#64748B]">
                      {session.mentor_name}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${statusColors[session.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[session.status] ?? session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
