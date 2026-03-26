import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Target,
  Users,
  XCircle,
} from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

type Props = {
  params: Promise<{ id: string }>
}

export default async function GestorDetailPage({ params }: Props) {
  const { id } = await params
  const admin = createAdminClient()

  /* ── Gestor profile ── */
  const { data: gestor } = await admin
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', id)
    .eq('role', 'hr_manager')
    .single()

  if (!gestor) notFound()

  /* ── Relationships (supervisors linked to this gestor) ── */
  const { data: relationships } = await admin
    .from('gestor_aluno_relationships')
    .select('aluno_user_id, company_name, relationship_type')
    .eq('gestor_user_id', id)

  const companyName = relationships?.[0]?.company_name ?? null
  const alunoIds = relationships?.map((r) => r.aluno_user_id) ?? []

  /* ── Fetch supervisor profiles ── */
  let alunoProfiles: Array<{ id: string; full_name: string }> = []
  if (alunoIds.length > 0) {
    const { data } = await admin
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
  let mentoringSessions: Array<{ aluno_user_id: string; session_type: string; status: string }> = []

  if (alunoIds.length > 0) {
    const [saRes, eaRes, pdiRes, partRes, mentRes] = await Promise.all([
      admin
        .from('leadership_self_assessments')
        .select('user_id, perfil')
        .in('user_id', alunoIds),
      admin
        .from('leadership_executive_assessments')
        .select('user_id')
        .in('user_id', alunoIds),
      admin
        .from('leadership_pdi')
        .select('user_id')
        .in('user_id', alunoIds),
      admin
        .from('presential_training_participants')
        .select('user_id, status')
        .in('user_id', alunoIds),
      admin
        .from('mentoring_sessions')
        .select('aluno_user_id, session_type, status')
        .in('aluno_user_id', alunoIds),
    ])

    selfAssessments = saRes.data ?? []
    execAssessments = eaRes.data ?? []
    pdis = pdiRes.data ?? []
    participations = partRes.data ?? []
    mentoringSessions = mentRes.data ?? []
  }

  /* ── Build supervisor matrix ── */
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
    const turmaStatus = participation
      ? participation.status === 'attended'
        ? 'Presente'
        : participation.status === 'no_show'
          ? 'Ausente'
          : 'Registrado'
      : null

    const mentoring = mentoringSessions.filter((m) => m.aluno_user_id === aluno.id)
    const hasCompleted30 = mentoring.some((m) => m.session_type === '30_days' && m.status === 'completed')
    const hasCompleted60 = mentoring.some((m) => m.session_type === '60_days' && m.status === 'completed')
    const hasScheduled = mentoring.some((m) => m.status === 'scheduled')
    const mentoriaStatus = hasCompleted60
      ? 'Concluída (60d)'
      : hasCompleted30
        ? 'Concluída (30d)'
        : hasScheduled
          ? 'Agendada'
          : null

    return {
      id: aluno.id,
      name: aluno.full_name,
      selfAssessment: sa ?? null,
      hasExec,
      hasPdi,
      turmaStatus,
      mentoriaStatus,
    }
  })

  /* ── KPIs ── */
  const totalSupervisors = alunoIds.length
  const totalForms = selfAssessments.length + execAssessments.length + pdis.length
  const totalMentorias = mentoringSessions.filter((m) => m.status === 'completed').length

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/admin/gestores"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Gestores
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#275082] bg-[#0E1E35] text-2xl font-extrabold text-[#8CB8E7]">
              {gestor.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold md:text-3xl">
                {gestor.full_name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#A9BDD8]">
                {companyName && <span>{companyName}</span>}
                <span>Desde {new Date(gestor.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#7B1FA2]/30 bg-[#7B1FA2]/10 px-4 py-2 text-sm font-bold text-[#CE93D8]">
            Gestor / RH
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Supervisores vinculados</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalSupervisors}</p>
        </article>
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00695C]/10">
            <ClipboardCheck className="h-4.5 w-4.5 text-[#00695C]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Formulários preenchidos</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalForms}</p>
        </article>
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7B1FA2]/10">
            <MessageSquare className="h-4.5 w-4.5 text-[#7B1FA2]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Mentorias concluídas</p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalMentorias}</p>
        </article>
      </section>

      {/* Supervisor Matrix */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <Briefcase className="h-5 w-5 text-[#1565C0]" />
          Matriz de Supervisores
        </h2>

        {supervisors.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]">
              <Users className="h-7 w-7 text-[#94A3B8]" />
            </div>
            <h3 className="mb-1 font-heading text-lg font-extrabold text-[#111827]">Nenhum supervisor vinculado</h3>
            <p className="text-sm font-medium text-[#64748B]">
              Este gestor ainda não possui supervisores vinculados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="pb-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Nome do Supervisor</th>
                  <th className="pb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Autoavaliação</th>
                  <th className="pb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Av. Executiva</th>
                  <th className="pb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">PDI</th>
                  <th className="pb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Turma</th>
                  <th className="pb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Mentoria</th>
                  <th className="pb-3 text-right text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {supervisors.map((sup) => {
                  const perfil = sup.selfAssessment ? perfilColors[sup.selfAssessment.perfil] : null
                  return (
                    <tr key={sup.id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10 text-sm font-extrabold text-[#1565C0]">
                            {sup.name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <span className="font-bold text-[#0F172A]">{sup.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {sup.selfAssessment ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {perfil && (
                                <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${perfil.bg} ${perfil.text}`}>
                                  {perfil.label}
                                </span>
                              )}
                            </>
                          ) : (
                            <XCircle className="h-4 w-4 text-[#CBD5E1]" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        {sup.hasExec ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#CBD5E1]" />
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {sup.hasPdi ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-[#CBD5E1]" />
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {sup.turmaStatus ? (
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            sup.turmaStatus === 'Presente'
                              ? 'bg-emerald-100 text-emerald-700'
                              : sup.turmaStatus === 'Ausente'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {sup.turmaStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-[#CBD5E1]">—</span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {sup.mentoriaStatus ? (
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            sup.mentoriaStatus.startsWith('Concluída')
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {sup.mentoriaStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-[#CBD5E1]">—</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/admin/alunos/${sup.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-3 py-1.5 text-xs font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                        >
                          <FileText className="h-3 w-3" />
                          Ver ficha
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
