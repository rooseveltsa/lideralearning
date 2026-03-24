import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Target,
  User,
  XCircle,
} from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import ComparativeChart from './ComparativeChart'

type Props = {
  params: Promise<{ id: string }>
}

/* ─────────────────────────────────────────────
   Labels
───────────────────────────────────────────── */

const SA_LABELS: Record<string, string> = {
  q_percepcao: 'Percepcao da Funcao',
  q_gestao: 'Gestao de Equipes',
  q_comunicacao: 'Comunicacao e Postura',
  q_tecnologia: 'Tecnologia e KPIs',
  q_etica: 'Alicerce Etico',
  q_dor: 'Dor Atual e Expectativa',
}

const EXEC_DIM_LABELS: Record<string, string> = {
  dim_comunicacao: 'Comunicacao',
  dim_tomada_decisao: 'Tomada de Decisao',
  dim_gestao_equipe: 'Gestao de Equipe',
  dim_orientacao_resultados: 'Orientacao a Resultados',
  dim_adaptabilidade: 'Adaptabilidade',
  dim_lideranca_estrategica: 'Lideranca Estrategica',
  dim_desenvolvimento_pessoas: 'Desenvolvimento de Pessoas',
  dim_inovacao: 'Inovacao',
  dim_etica_integridade: 'Etica e Integridade',
  dim_gestao_crise: 'Gestao de Crise',
}

const PDI_DIM_LABELS: Record<string, string> = {
  dim_facilitador: 'Facilitador',
  dim_orientador: 'Orientador',
  dim_garantidor: 'Garantidor',
  dim_estrategista: 'Estrategista',
  dim_mentor: 'Mentor',
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default async function AlunoFichaPage({ params }: Props) {
  const { id } = await params
  const admin = createAdminClient()

  /* ── Profile ── */
  const { data: profile } = await admin
    .from('profiles')
    .select('id, full_name, role, whatsapp, company, created_at')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  /* ── Email from auth ── */
  let userEmail = ''
  try {
    const { data: authData } = await admin.auth.admin.getUserById(id)
    userEmail = authData?.user?.email ?? ''
  } catch { /* ignore */ }

  /* ── Gestor relationship ── */
  const { data: relationship } = await admin
    .from('gestor_aluno_relationships')
    .select('company_name, relationship_type, gestor_user_id')
    .eq('aluno_user_id', id)
    .limit(1)
    .maybeSingle()

  let gestorName: string | null = null
  if (relationship?.gestor_user_id) {
    const { data: gestorProfile } = await admin
      .from('profiles')
      .select('full_name')
      .eq('id', relationship.gestor_user_id)
      .single()
    gestorName = gestorProfile?.full_name ?? null
  }

  /* ── Self Assessments (full data) ── */
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  /* ── PDIs (full data) ── */
  const { data: pdis } = await admin
    .from('leadership_pdi')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  /* ── Executive Assessments (full data) ── */
  const { data: execAssessments } = await admin
    .from('leadership_executive_assessments')
    .select('*')
    .or(`user_id.eq.${id},supervisor_user_id.eq.${id}`)
    .order('created_at', { ascending: false })

  /* ── Training Participations ── */
  const { data: participations } = await admin
    .from('presential_training_participants')
    .select('id, status, training_id, created_at')
    .eq('user_id', id)

  let trainingDetails: Array<{ id: string; title: string; training_date_start: string; status: string; participant_status: string }> = []
  if (participations && participations.length > 0) {
    const trainingIds = participations.map((p) => p.training_id)
    const { data: trainings } = await admin
      .from('presential_trainings')
      .select('id, title, training_date_start, status')
      .in('id', trainingIds)

    if (trainings) {
      trainingDetails = trainings.map((t) => ({
        ...t,
        participant_status: participations.find((p) => p.training_id === t.id)?.status ?? 'registered',
      }))
    }
  }

  /* ── Mentoring Sessions ── */
  const { data: mentoringSessions } = await admin
    .from('mentoring_sessions')
    .select('id, session_type, scheduled_date, completed_date, status, notes, created_at')
    .eq('aluno_user_id', id)
    .order('scheduled_date', { ascending: false })

  /* ── Online Courses ── */
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('id, course_id, status, enrolled_at')
    .eq('user_id', id)

  let courseDetails: Array<{ course_id: string; title: string; enrollment_status: string; enrolled_at: string }> = []
  if (enrollments && enrollments.length > 0) {
    const courseIds = enrollments.map((e) => e.course_id)
    const { data: courses } = await admin
      .from('courses')
      .select('id, title')
      .in('id', courseIds)

    if (courses) {
      courseDetails = courses.map((c) => {
        const enr = enrollments.find((e) => e.course_id === c.id)
        return {
          course_id: c.id,
          title: c.title,
          enrollment_status: enr?.status ?? 'active',
          enrolled_at: enr?.enrolled_at ?? '',
        }
      })
    }
  }

  /* ── Helpers ── */
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '--'
  const formatDateTime = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--'

  const perfilColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    reativo: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Supervisor Reativo' },
    transicao: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Supervisor em Transicao' },
    lider_valor: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Lider de Valor' },
  }

  const latestAssessment = selfAssessments?.[0]
  const latestPerfil = latestAssessment ? perfilColors[latestAssessment.perfil] : null

  /* ── Status badges ── */
  const formStatus = [
    { label: 'Autoavaliacao', done: (selfAssessments?.length ?? 0) > 0 },
    { label: 'Avaliacao Executiva', done: (execAssessments?.length ?? 0) > 0 },
    { label: 'PDI', done: (pdis?.length ?? 0) > 0 },
    { label: 'Turma Presencial', done: trainingDetails.some((t) => t.participant_status === 'attended') },
    { label: 'Mentoria 30d', done: mentoringSessions?.some((m) => m.session_type === '30_days' && m.status === 'completed') ?? false },
    { label: 'Mentoria 60d', done: mentoringSessions?.some((m) => m.session_type === '60_days' && m.status === 'completed') ?? false },
  ]

  /* ── Build timeline ── */
  type TimelineItem = { date: string; type: string; icon: typeof CheckCircle2; color: string; title: string; subtitle: string }
  const timeline: TimelineItem[] = []

  timeline.push({
    date: profile.created_at,
    type: 'cadastro',
    icon: User,
    color: '#1565C0',
    title: 'Cadastro na plataforma',
    subtitle: 'Conta criada',
  })

  if (selfAssessments) {
    const perfilLabels: Record<string, string> = { reativo: 'Reativo', transicao: 'Em Transicao', lider_valor: 'Lider de Valor' }
    for (const sa of selfAssessments) {
      timeline.push({
        date: sa.created_at,
        type: 'autoavaliacao',
        icon: ClipboardCheck,
        color: '#1565C0',
        title: 'Autoavaliacao concluida',
        subtitle: `${sa.pontuacao_total} pts -- ${perfilLabels[sa.perfil] ?? sa.perfil}`,
      })
    }
  }

  if (execAssessments) {
    for (const ea of execAssessments) {
      timeline.push({
        date: ea.created_at,
        type: 'avaliacao_executiva',
        icon: FileText,
        color: '#00695C',
        title: 'Avaliacao Executiva recebida',
        subtitle: `Supervisor: ${ea.nome_supervisor ?? '--'} | Media: ${ea.media_dimensoes ?? '--'}/5`,
      })
    }
  }

  if (pdis) {
    for (const pdi of pdis) {
      timeline.push({
        date: pdi.created_at,
        type: 'pdi',
        icon: Target,
        color: '#7B1FA2',
        title: 'PDI preenchido',
        subtitle: pdi.media_dimensoes ? `Media: ${pdi.media_dimensoes}/5` : 'Dimensoes registradas',
      })
    }
  }

  if (mentoringSessions) {
    const typeLabels: Record<string, string> = { '30_days': '30 dias', '60_days': '60 dias', extra: 'Extra' }
    for (const ms of mentoringSessions) {
      timeline.push({
        date: ms.completed_date ?? ms.scheduled_date ?? ms.created_at ?? '',
        type: 'mentoria',
        icon: MessageSquare,
        color: ms.status === 'completed' ? '#4CAF35' : '#F57C00',
        title: `Mentoria ${typeLabels[ms.session_type] ?? ms.session_type}`,
        subtitle: ms.status === 'completed' ? 'Concluida' : ms.status === 'scheduled' ? 'Agendada' : ms.status,
      })
    }
  }

  for (const td of trainingDetails) {
    timeline.push({
      date: td.training_date_start,
      type: 'turma',
      icon: Calendar,
      color: td.participant_status === 'attended' ? '#4CAF35' : '#F57C00',
      title: td.title,
      subtitle: td.participant_status === 'attended' ? 'Presente' : td.participant_status === 'no_show' ? 'Ausente' : 'Registrado',
    })
  }

  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/alunos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Alunos
      </Link>

      {/* Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-6 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#275082] bg-[#0E1E35] text-xl font-extrabold text-[#8CB8E7]">
              {profile.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold md:text-2xl">
                {profile.full_name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#A9BDD8]">
                {userEmail && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {userEmail}
                  </span>
                )}
                {profile.whatsapp && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {profile.whatsapp}
                  </span>
                )}
                {(profile.company || relationship?.company_name) && (
                  <span>{profile.company || relationship?.company_name}</span>
                )}
                {gestorName && (
                  <span>Gestor: <strong className="text-white">{gestorName}</strong></span>
                )}
                <span>Role: <strong className="text-white">{profile.role}</strong></span>
                <span>Desde {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {latestPerfil && (
            <div className={`rounded-xl px-4 py-2 text-sm font-bold ${latestPerfil.bg} ${latestPerfil.border} ${latestPerfil.text} border`}>
              {latestPerfil.label} -- {latestAssessment!.pontuacao_total} pts
            </div>
          )}
        </div>
      </section>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg bg-[#1565C0] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D47A1]">
          Classificar
        </button>
        <button className="rounded-lg bg-[#F57C00] px-4 py-2 text-xs font-bold text-white hover:bg-[#E65100]">
          Enviar para Turma
        </button>
        <button className="rounded-lg bg-[#7B1FA2] px-4 py-2 text-xs font-bold text-white hover:bg-[#6A1B9A]">
          Agendar Mentoria
        </button>
      </div>

      {/* Status Badges */}
      <section className="flex flex-wrap gap-2">
        {formStatus.map((fs) => (
          <div
            key={fs.label}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${
              fs.done
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#94A3B8]'
            }`}
          >
            {fs.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {fs.label}
          </div>
        ))}
      </section>

      {/* ── AUTOAVALIACAO DETAIL ── */}
      {selfAssessments && selfAssessments.length > 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <ClipboardCheck className="h-5 w-5 text-[#1565C0]" />
            Autoavaliacoes ({selfAssessments.length})
          </h2>
          <div className="space-y-4">
            {selfAssessments.map((sa, idx) => {
              const pLabel = perfilColors[sa.perfil]?.label ?? sa.perfil
              const qKeys = ['q_percepcao', 'q_gestao', 'q_comunicacao', 'q_tecnologia', 'q_etica', 'q_dor'] as const
              return (
                <div key={sa.id} className="rounded-xl border border-[#E5ECF6] bg-[#FAFBFC] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#94A3B8]">#{idx + 1}</span>
                      <span className="text-sm font-bold text-[#0F172A]">{sa.pontuacao_total} pts</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${perfilColors[sa.perfil]?.bg ?? 'bg-gray-100'} ${perfilColors[sa.perfil]?.text ?? 'text-gray-600'}`}>
                        {pLabel}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{formatDateTime(sa.created_at)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {qKeys.map((k) => (
                      <div key={k} className="rounded-lg bg-white border border-[#E5ECF6] px-2 py-1.5 text-center">
                        <p className="text-[9px] font-bold text-[#64748B]">{SA_LABELS[k]}</p>
                        <p className="text-base font-extrabold text-[#0F172A]">{sa[k] ?? '--'}</p>
                      </div>
                    ))}
                  </div>
                  {(sa.texto_dor_atual || sa.texto_custo_futuro) && (
                    <div className="mt-3 space-y-2">
                      {sa.texto_dor_atual && (
                        <div className="rounded-lg bg-white border border-[#E5ECF6] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#64748B]">Dor Atual</p>
                          <p className="text-xs text-[#374151] leading-relaxed">{sa.texto_dor_atual}</p>
                        </div>
                      )}
                      {sa.texto_custo_futuro && (
                        <div className="rounded-lg bg-white border border-[#E5ECF6] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#64748B]">Custo Futuro</p>
                          <p className="text-xs text-[#374151] leading-relaxed">{sa.texto_custo_futuro}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── EXECUTIVE ASSESSMENTS DETAIL ── */}
      {execAssessments && execAssessments.length > 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <FileText className="h-5 w-5 text-[#00695C]" />
            Avaliacoes Executivas ({execAssessments.length})
          </h2>
          <div className="space-y-4">
            {execAssessments.map((ea, idx) => {
              const dimKeys = Object.keys(EXEC_DIM_LABELS)
              return (
                <div key={ea.id} className="rounded-xl border border-[#E5ECF6] bg-[#FAFBFC] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#94A3B8]">#{idx + 1}</span>
                      <span className="rounded-md bg-[#E0F2F1] px-2 py-0.5 text-[11px] font-bold text-[#00695C]">
                        Media: {ea.media_dimensoes ?? '--'}/5
                      </span>
                      {ea.nome_empresa && <span className="text-xs text-[#64748B]">Empresa: {ea.nome_empresa}</span>}
                      {ea.nome_supervisor && <span className="text-xs text-[#64748B]">Supervisor: {ea.nome_supervisor}</span>}
                      {ea.nome_avaliador && <span className="text-xs text-[#64748B]">Avaliador: {ea.nome_avaliador}</span>}
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{formatDateTime(ea.created_at)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                    {dimKeys.map((k) => (
                      <div key={k} className="rounded-lg bg-white border border-[#E0F2F1] px-2 py-1.5 text-center">
                        <p className="text-[9px] font-bold text-[#00695C]">{EXEC_DIM_LABELS[k]}</p>
                        <p className="text-base font-extrabold text-[#0F172A]">
                          {(ea as Record<string, unknown>)[k] != null ? String((ea as Record<string, unknown>)[k]) : '--'}
                          <span className="text-[10px] font-normal text-[#94A3B8]">/5</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  {(ea.ponto_forte || ea.area_melhoria || ea.impacto_equipe) && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      {ea.ponto_forte && (
                        <div className="rounded-lg bg-white border border-[#E0F2F1] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#00695C]">Ponto Forte</p>
                          <p className="text-xs text-[#374151]">{ea.ponto_forte}</p>
                        </div>
                      )}
                      {ea.area_melhoria && (
                        <div className="rounded-lg bg-white border border-[#E0F2F1] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#00695C]">Area de Melhoria</p>
                          <p className="text-xs text-[#374151]">{ea.area_melhoria}</p>
                        </div>
                      )}
                      {ea.impacto_equipe && (
                        <div className="rounded-lg bg-white border border-[#E0F2F1] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#00695C]">Impacto na Equipe</p>
                          <p className="text-xs text-[#374151]">{ea.impacto_equipe}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── PDI DETAIL ── */}
      {pdis && pdis.length > 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <Target className="h-5 w-5 text-[#7B1FA2]" />
            PDIs ({pdis.length})
          </h2>
          <div className="space-y-4">
            {pdis.map((pdi, idx) => {
              const dimKeys = Object.keys(PDI_DIM_LABELS)
              return (
                <div key={pdi.id} className="rounded-xl border border-[#E5ECF6] bg-[#FAFBFC] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#94A3B8]">#{idx + 1}</span>
                      <span className="rounded-md bg-[#F3E5F5] px-2 py-0.5 text-[11px] font-bold text-[#7B1FA2]">
                        Media: {pdi.media_dimensoes ?? '--'}/5
                      </span>
                      {pdi.cargo && <span className="text-xs text-[#64748B]">Cargo: {pdi.cargo}</span>}
                      {pdi.departamento && <span className="text-xs text-[#64748B]">Depto: {pdi.departamento}</span>}
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{formatDateTime(pdi.created_at)}</span>
                  </div>
                  <p className="mb-2 text-[11px] font-bold uppercase text-[#64748B]">Dimensoes de Lideranca</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {dimKeys.map((k) => (
                      <div key={k} className="rounded-lg bg-white border border-[#F3E5F5] px-2 py-1.5 text-center">
                        <p className="text-[9px] font-bold text-[#7B1FA2]">{PDI_DIM_LABELS[k]}</p>
                        <p className="text-base font-extrabold text-[#0F172A]">
                          {(pdi as Record<string, unknown>)[k] != null ? String((pdi as Record<string, unknown>)[k]) : '--'}
                          <span className="text-[10px] font-normal text-[#94A3B8]">/5</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  {(pdi.compromisso_comportamento || pdi.compromisso_dados || pdi.compromisso_sucessao) && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[11px] font-bold uppercase text-[#64748B]">Compromissos 12 Semanas</p>
                      {pdi.compromisso_comportamento && (
                        <div className="rounded-lg bg-white border border-[#F3E5F5] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#7B1FA2]">Comportamento</p>
                          <p className="text-xs text-[#374151]">{pdi.compromisso_comportamento}</p>
                        </div>
                      )}
                      {pdi.compromisso_dados && (
                        <div className="rounded-lg bg-white border border-[#F3E5F5] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#7B1FA2]">Dados</p>
                          <p className="text-xs text-[#374151]">{pdi.compromisso_dados}</p>
                        </div>
                      )}
                      {pdi.compromisso_sucessao && (
                        <div className="rounded-lg bg-white border border-[#F3E5F5] px-3 py-2">
                          <p className="text-[10px] font-bold text-[#7B1FA2]">Sucessao</p>
                          <p className="text-xs text-[#374151]">{pdi.compromisso_sucessao}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Comparative Chart */}
      <ComparativeChart
        selfAssessment={selfAssessments?.[0] ?? null}
        execAssessment={execAssessments?.[0] ?? null}
      />

      {/* Timeline */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
          <Clock className="h-5 w-5 text-[#1565C0]" />
          Timeline
        </h2>

        {timeline.length === 0 ? (
          <p className="text-sm text-[#64748B]">Nenhuma atividade registrada.</p>
        ) : (
          <div className="space-y-0">
            {timeline.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={`${item.type}-${i}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="my-1 h-full w-px bg-[#E5E7EB]" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-bold text-[#111827]">{item.title}</p>
                    <p className="text-xs text-[#64748B]">{item.subtitle}</p>
                    <p className="mt-0.5 text-[11px] text-[#94A3B8]">{formatDate(item.date)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Grid: Trainings + Mentorias */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Turmas */}
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <Calendar className="h-5 w-5 text-[#F57C00]" />
            Turmas Presenciais
          </h2>
          {trainingDetails.length === 0 ? (
            <p className="text-sm text-[#64748B]">Nenhuma participacao registrada.</p>
          ) : (
            <div className="space-y-2">
              {trainingDetails.map((t) => {
                const statusColors: Record<string, string> = {
                  attended: 'bg-emerald-100 text-emerald-700',
                  registered: 'bg-blue-100 text-blue-700',
                  confirmed: 'bg-blue-100 text-blue-700',
                  no_show: 'bg-red-100 text-red-700',
                }
                const statusLabels: Record<string, string> = {
                  attended: 'Presente', registered: 'Registrado', confirmed: 'Confirmado', no_show: 'Ausente',
                }
                return (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5">
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{t.title}</p>
                      <p className="text-xs text-[#64748B]">{formatDate(t.training_date_start)}</p>
                    </div>
                    <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${statusColors[t.participant_status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[t.participant_status] ?? t.participant_status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Mentorias */}
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <MessageSquare className="h-5 w-5 text-[#7B1FA2]" />
            Sessoes de Mentoria
          </h2>
          {!mentoringSessions || mentoringSessions.length === 0 ? (
            <p className="text-sm text-[#64748B]">Nenhuma mentoria registrada.</p>
          ) : (
            <div className="space-y-2">
              {mentoringSessions.map((ms) => {
                const typeLabels: Record<string, string> = { '30_days': 'Mentoria 30 dias', '60_days': 'Mentoria 60 dias', extra: 'Mentoria Extra' }
                const statusColors: Record<string, string> = {
                  completed: 'bg-emerald-100 text-emerald-700',
                  scheduled: 'bg-blue-100 text-blue-700',
                  cancelled: 'bg-red-100 text-red-700',
                  no_show: 'bg-red-100 text-red-700',
                }
                const statusLabels: Record<string, string> = {
                  completed: 'Concluida', scheduled: 'Agendada', cancelled: 'Cancelada', no_show: 'Ausente',
                }
                return (
                  <div key={ms.id} className="rounded-xl border border-[#E5E7EB] px-4 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{typeLabels[ms.session_type] ?? ms.session_type}</p>
                        <p className="text-xs text-[#64748B]">
                          {ms.scheduled_date ? formatDate(ms.scheduled_date) : 'Sem data'}
                        </p>
                      </div>
                      <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${statusColors[ms.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[ms.status] ?? ms.status}
                      </span>
                    </div>
                    {ms.notes && (
                      <p className="mt-1 text-xs text-[#64748B] italic">{ms.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Cursos Online */}
      {courseDetails.length > 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <BookOpen className="h-5 w-5 text-[#1565C0]" />
            Cursos Online
          </h2>
          <div className="space-y-2">
            {courseDetails.map((c) => (
              <div key={c.course_id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5">
                <div>
                  <p className="text-sm font-bold text-[#111827]">{c.title}</p>
                  <p className="text-xs text-[#64748B]">Inscrito em {formatDate(c.enrolled_at)}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                  c.enrollment_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {c.enrollment_status === 'completed' ? 'Concluido' : 'Em andamento'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
