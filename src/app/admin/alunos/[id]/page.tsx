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
  MessageSquare,
  Target,
  User,
  XCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import ComparativeChart from './ComparativeChart'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AlunoFichaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  /* ── Profile ── */
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  /* ── Gestor relationship ── */
  const { data: relationship } = await supabase
    .from('gestor_aluno_relationships')
    .select('company_name, relationship_type, gestor_user_id')
    .eq('aluno_user_id', id)
    .limit(1)
    .maybeSingle()

  let gestorName: string | null = null
  if (relationship?.gestor_user_id) {
    const { data: gestorProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', relationship.gestor_user_id)
      .single()
    gestorName = gestorProfile?.full_name ?? null
  }

  /* ── Self Assessments ── */
  const { data: selfAssessments } = await supabase
    .from('leadership_self_assessments')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  /* ── PDIs ── */
  const { data: pdis } = await supabase
    .from('leadership_pdi')
    .select('id, media_dimensoes, created_at')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  /* ── Executive Assessments (about this aluno — check both user_id and supervisor_user_id) ── */
  const { data: execAssessments } = await supabase
    .from('leadership_executive_assessments')
    .select('*')
    .or(`user_id.eq.${id},supervisor_user_id.eq.${id}`)
    .order('created_at', { ascending: false })

  /* ── Training Participations ── */
  const { data: participations } = await supabase
    .from('presential_training_participants')
    .select('id, status, training_id, created_at')
    .eq('user_id', id)

  let trainingDetails: Array<{ id: string; title: string; training_date_start: string; status: string; participant_status: string }> = []
  if (participations && participations.length > 0) {
    const trainingIds = participations.map((p) => p.training_id)
    const { data: trainings } = await supabase
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
  const { data: mentoringSessions } = await supabase
    .from('mentoring_sessions')
    .select('id, session_type, scheduled_date, completed_date, status, notes, created_at')
    .eq('aluno_user_id', id)
    .order('scheduled_date', { ascending: false })

  /* ── Online Courses ── */
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, course_id, status, enrolled_at')
    .eq('user_id', id)

  let courseDetails: Array<{ course_id: string; title: string; enrollment_status: string; enrolled_at: string }> = []
  if (enrollments && enrollments.length > 0) {
    const courseIds = enrollments.map((e) => e.course_id)
    const { data: courses } = await supabase
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
    for (const sa of selfAssessments) {
      const perfilLabels: Record<string, string> = { reativo: 'Reativo', transicao: 'Em Transição', lider_valor: 'Líder de Valor' }
      timeline.push({
        date: sa.created_at,
        type: 'autoavaliacao',
        icon: ClipboardCheck,
        color: '#1565C0',
        title: 'Autoavaliação concluída',
        subtitle: `${sa.pontuacao_total} pts — ${perfilLabels[sa.perfil] ?? sa.perfil}`,
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
        title: 'Avaliação Executiva recebida',
        subtitle: 'Preenchida pelo Gestor/RH',
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
        subtitle: pdi.media_dimensoes ? `Média: ${pdi.media_dimensoes}/5` : 'Dimensões registradas',
      })
    }
  }

  if (mentoringSessions) {
    for (const ms of mentoringSessions) {
      const typeLabels: Record<string, string> = { '30_days': '30 dias', '60_days': '60 dias', extra: 'Extra' }
      timeline.push({
        date: ms.completed_date ?? ms.scheduled_date ?? ms.created_at ?? '',
        type: 'mentoria',
        icon: MessageSquare,
        color: ms.status === 'completed' ? '#4CAF35' : '#F57C00',
        title: `Mentoria ${typeLabels[ms.session_type] ?? ms.session_type}`,
        subtitle: ms.status === 'completed' ? 'Concluída' : ms.status === 'scheduled' ? 'Agendada' : ms.status,
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

  /* ── Helpers ── */
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

  const perfilColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    reativo: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Supervisor Reativo' },
    transicao: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Supervisor em Transição' },
    lider_valor: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Líder de Valor' },
  }

  const latestAssessment = selfAssessments?.[0]
  const latestPerfil = latestAssessment ? perfilColors[latestAssessment.perfil] : null

  /* ── Status badges ── */
  const formStatus = [
    { label: 'Autoavaliação', done: (selfAssessments?.length ?? 0) > 0 },
    { label: 'Avaliação Executiva', done: (execAssessments?.length ?? 0) > 0 },
    { label: 'PDI', done: (pdis?.length ?? 0) > 0 },
    { label: 'Turma Presencial', done: trainingDetails.some((t) => t.participant_status === 'attended') },
    { label: 'Mentoria 30d', done: mentoringSessions?.some((m) => m.session_type === '30_days' && m.status === 'completed') ?? false },
    { label: 'Mentoria 60d', done: mentoringSessions?.some((m) => m.session_type === '60_days' && m.status === 'completed') ?? false },
  ]

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/admin/alunos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Alunos
      </Link>

      {/* Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#275082] bg-[#0E1E35] text-2xl font-extrabold text-[#8CB8E7]">
              {profile.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold md:text-3xl">
                {profile.full_name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#A9BDD8]">
                {relationship?.company_name && (
                  <span>{relationship.company_name}</span>
                )}
                {gestorName && (
                  <span>Gestor: <strong className="text-white">{gestorName}</strong></span>
                )}
                <span>Desde {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {latestPerfil && (
            <div className={`rounded-xl px-4 py-2 text-sm font-bold ${latestPerfil.bg} ${latestPerfil.border} ${latestPerfil.text} border`}>
              {latestPerfil.label} — {latestAssessment!.pontuacao_total} pts
            </div>
          )}
        </div>
      </section>

      {/* Status Badges */}
      <section className="flex flex-wrap gap-3">
        {formStatus.map((fs) => (
          <div
            key={fs.label}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              fs.done
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#94A3B8]'
            }`}
          >
            {fs.done ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {fs.label}
          </div>
        ))}
      </section>

      {/* Comparative Chart */}
      <ComparativeChart
        selfAssessment={selfAssessments?.[0] ?? null}
        execAssessment={execAssessments?.[0] ?? null}
      />

      {/* Timeline */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
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
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="my-1 h-full w-px bg-[#E5E7EB]" />
                    )}
                  </div>
                  <div className="pb-6">
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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Turmas Presenciais */}
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <Calendar className="h-5 w-5 text-[#F57C00]" />
            Turmas Presenciais
          </h2>
          {trainingDetails.length === 0 ? (
            <p className="text-sm text-[#64748B]">Nenhuma participação registrada.</p>
          ) : (
            <div className="space-y-3">
              {trainingDetails.map((t) => {
                const statusColors: Record<string, string> = {
                  attended: 'bg-emerald-100 text-emerald-700',
                  registered: 'bg-blue-100 text-blue-700',
                  confirmed: 'bg-blue-100 text-blue-700',
                  no_show: 'bg-red-100 text-red-700',
                }
                const statusLabels: Record<string, string> = {
                  attended: 'Presente',
                  registered: 'Registrado',
                  confirmed: 'Confirmado',
                  no_show: 'Ausente',
                }
                return (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
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
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <MessageSquare className="h-5 w-5 text-[#7B1FA2]" />
            Sessões de Mentoria
          </h2>
          {!mentoringSessions || mentoringSessions.length === 0 ? (
            <p className="text-sm text-[#64748B]">Nenhuma mentoria registrada.</p>
          ) : (
            <div className="space-y-3">
              {mentoringSessions.map((ms) => {
                const typeLabels: Record<string, string> = { '30_days': 'Mentoria 30 dias', '60_days': 'Mentoria 60 dias', extra: 'Mentoria Extra' }
                const statusColors: Record<string, string> = {
                  completed: 'bg-emerald-100 text-emerald-700',
                  scheduled: 'bg-blue-100 text-blue-700',
                  cancelled: 'bg-red-100 text-red-700',
                  no_show: 'bg-red-100 text-red-700',
                }
                const statusLabels: Record<string, string> = {
                  completed: 'Concluída',
                  scheduled: 'Agendada',
                  cancelled: 'Cancelada',
                  no_show: 'Ausente',
                }
                return (
                  <div key={ms.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
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
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Cursos Online */}
      {courseDetails.length > 0 && (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <BookOpen className="h-5 w-5 text-[#1565C0]" />
            Cursos Online
          </h2>
          <div className="space-y-3">
            {courseDetails.map((c) => (
              <div key={c.course_id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#111827]">{c.title}</p>
                  <p className="text-xs text-[#64748B]">Inscrito em {formatDate(c.enrolled_at)}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                  c.enrollment_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {c.enrollment_status === 'completed' ? 'Concluído' : 'Em andamento'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
