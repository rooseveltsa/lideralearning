import { redirect } from 'next/navigation'
import {
  CheckCircle2,
  Users,
  XCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function EquipePage() {
  const supabase = await createClient()

  /* ── Auth & role check ── */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'hr_manager') {
    redirect('/dashboard')
  }

  /* ── Relationships (supervisors linked to this gestor) ── */
  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('aluno_user_id, company_name')
    .eq('gestor_user_id', user.id)

  const alunoIds = relationships?.map((r) => r.aluno_user_id) ?? []

  /* ── Fetch supervisor profiles ── */
  let alunoProfiles: Array<{ id: string; full_name: string }> = []
  if (alunoIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', alunoIds)
    alunoProfiles = data ?? []
  }

  /* ── Fetch assessment data for all linked supervisors ── */
  let selfAssessments: Array<{ user_id: string; perfil: string }> = []
  let execAssessments: Array<{ user_id: string }> = []
  let pdis: Array<{ user_id: string }> = []
  let participations: Array<{ user_id: string; status: string }> = []

  if (alunoIds.length > 0) {
    const [saRes, eaRes, pdiRes, partRes] = await Promise.all([
      supabase
        .from('leadership_self_assessments')
        .select('user_id, perfil')
        .in('user_id', alunoIds),
      supabase
        .from('leadership_executive_assessments')
        .select('user_id')
        .in('user_id', alunoIds),
      supabase
        .from('leadership_pdi')
        .select('user_id')
        .in('user_id', alunoIds),
      supabase
        .from('presential_training_participants')
        .select('user_id, status')
        .in('user_id', alunoIds),
    ])

    selfAssessments = saRes.data ?? []
    execAssessments = eaRes.data ?? []
    pdis = pdiRes.data ?? []
    participations = partRes.data ?? []
  }

  /* ── Build supervisor list ── */
  const perfilColors: Record<string, { bg: string; text: string; label: string }> = {
    reativo: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reativo' },
    transicao: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Transição' },
    lider_valor: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Líder de Valor' },
  }

  const supervisors = alunoProfiles.map((aluno) => {
    const sa = selfAssessments.find((s) => s.user_id === aluno.id)
    const hasExec = execAssessments.some((e) => e.user_id === aluno.id)
    const hasPdi = pdis.some((p) => p.user_id === aluno.id)
    const participation = participations.find((p) => p.user_id === aluno.id)
    const attended = participation?.status === 'attended'

    return {
      id: aluno.id,
      name: aluno.full_name,
      selfAssessment: sa ?? null,
      hasExec,
      hasPdi,
      attended,
    }
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Portal do Gestor
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Minha Equipe
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Acompanhe o progresso dos supervisores vinculados ao seu programa de desenvolvimento.
          </p>
        </div>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Total supervisores</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{supervisors.length}</p>
        </article>
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00695C]/10">
            <CheckCircle2 className="h-4.5 w-4.5 text-[#00695C]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Formulários preenchidos</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">
            {selfAssessments.length + execAssessments.length + pdis.length}
          </p>
        </article>
      </section>

      {/* Supervisor List */}
      {supervisors.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <Users className="h-8 w-8 text-[#94A3B8]" />
          </div>
          <h3 className="mb-2 font-heading text-xl font-extrabold text-[#111827]">Nenhum supervisor vinculado</h3>
          <p className="font-medium text-[#64748B]">
            Seus supervisores aparecerão aqui quando vinculados ao seu perfil.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {supervisors.map((sup) => {
            const perfil = sup.selfAssessment ? perfilColors[sup.selfAssessment.perfil] : null

            const badges = [
              { label: 'Autoavaliação', done: !!sup.selfAssessment },
              { label: 'Av. Executiva', done: sup.hasExec },
              { label: 'PDI', done: sup.hasPdi },
              { label: 'Turma Presencial', done: sup.attended },
            ]

            return (
              <article
                key={sup.id}
                className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1565C0]/10 text-lg font-extrabold text-[#1565C0]">
                    {sup.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-extrabold text-[#0F172A]">{sup.name}</h3>
                      {perfil && (
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${perfil.bg} ${perfil.text}`}>
                          {perfil.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <div
                      key={b.label}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                        b.done
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#94A3B8]'
                      }`}
                    >
                      {b.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {b.label}
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
