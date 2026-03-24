import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  ClipboardCheck,
  Eye,
  MapPin,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalCourses },
    { count: publishedCourses },
    { count: totalStudents },
    { count: totalEnrollments },
    { count: totalLeads },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('b2b_leads').select('*', { count: 'exact', head: true }),
  ])

  // ── Novas queries (tabelas podem não existir ainda) ──
  let turmasAgendadas = 0
  let proximasTurmas: Array<{
    id: string
    title: string
    date: string
    location: string | null
    participant_count: number | null
  }> = []
  try {
    const { count } = await supabase
      .from('presential_trainings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
    turmasAgendadas = count ?? 0

    const { data } = await supabase
      .from('presential_trainings')
      .select('id, title, date, location, participant_count')
      .eq('status', 'scheduled')
      .order('date', { ascending: true })
      .limit(3)
    proximasTurmas = (data ?? []) as typeof proximasTurmas
  } catch {
    // Table may not exist
  }

  let mentoriasPendentes = 0
  let mentoriasSemana: Array<{
    id: string
    scheduled_date: string
    profiles: { full_name: string } | null
  }> = []
  try {
    const { count } = await supabase
      .from('mentoring_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
    mentoriasPendentes = count ?? 0

    const now = new Date()
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const { data } = await supabase
      .from('mentoring_sessions')
      .select('id, scheduled_date, profiles!inner(full_name)')
      .eq('status', 'scheduled')
      .gte('scheduled_date', now.toISOString())
      .lte('scheduled_date', weekLater.toISOString())
      .order('scheduled_date', { ascending: true })
      .limit(5)
    mentoriasSemana = (data ?? []) as unknown as typeof mentoriasSemana
  } catch {
    // Table may not exist
  }

  let gestoresAtivos = 0
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'hr_manager')
    gestoresAtivos = count ?? 0
  } catch {
    // Column/value may not exist
  }

  let formulariosPendentes = 0
  try {
    const { count: totalProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    const { count: totalAutoavaliacao } = await supabase
      .from('leadership_self_assessments')
      .select('user_id', { count: 'exact', head: true })
    formulariosPendentes = Math.max(0, (totalProfiles ?? 0) - (totalAutoavaliacao ?? 0))
  } catch {
    // Tables may not exist
  }

  const stats = [
    { label: 'Formações totais', value: totalCourses ?? 0, icon: BookOpen, color: '#0B4A8F' },
    { label: 'Formações publicadas', value: publishedCourses ?? 0, icon: Eye, color: '#2E7D32' },
    { label: 'Alunos cadastrados', value: totalStudents ?? 0, icon: Users, color: '#7C3AED' },
    { label: 'Matrículas ativas', value: totalEnrollments ?? 0, icon: TrendingUp, color: '#D97706' },
    { label: 'Turmas agendadas', value: turmasAgendadas, icon: Calendar, color: '#0D47A1' },
    { label: 'Mentorias pendentes', value: mentoriasPendentes, icon: UserCheck, color: '#4A148C' },
    { label: 'Gestores ativos', value: gestoresAtivos, icon: Users, color: '#00695C' },
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)] md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#4CAF35]/10 blur-[80px]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Centro de comando</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Painel administrativo da Lidera.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#A9BDD8]">
              Gestão operacional de cursos, alunos e pipeline comercial em uma única visão.
            </p>
          </div>

          <div className="grid gap-2 text-xs text-[#A9BDD8]">
            <p className="rounded-xl border border-[#274364] bg-[#0A1528] px-3 py-2">
              Leads B2B registrados: <strong className="text-white">{totalLeads ?? 0}</strong>
            </p>
            <p className="rounded-xl border border-[#274364] bg-[#0A1528] px-3 py-2">
              Taxa de publicação: <strong className="text-white">{(totalCourses ?? 0) > 0 ? Math.round(((publishedCourses ?? 0) / (totalCourses ?? 1)) * 100) : 0}%</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F8FE]" style={{ color: stat.color }}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#0F172A]">{stat.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: 'Gerenciar formações',
            desc: 'Criar, editar e publicar programas da academia.',
            href: '/admin/cursos',
            icon: BookOpen,
          },
          {
            title: 'Gestão de alunos',
            desc: 'Acompanhar base de alunos e evolução da operação educacional.',
            href: '/admin/alunos',
            icon: Users,
          },
          {
            title: 'Pipeline B2B',
            desc: 'Qualificar leads corporativos e gerar propostas comerciais.',
            href: '/admin/leads',
            icon: BriefcaseBusiness,
          },
        ].map(({ title, desc, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm transition-all hover:border-[#C5D9F0] hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
          >
            <Icon className="h-5 w-5 text-[#0B4A8F]" />
            <h2 className="mt-3 text-xl font-extrabold text-[#0F172A]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#0B4A8F]">
              Acessar
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>

      {/* ── Novas seções ── */}

      {/* Próximas Turmas */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#0B4A8F]" />
            <h2 className="text-lg font-extrabold text-[#0F172A]">Proximas Turmas</h2>
          </div>
        </div>

        {proximasTurmas.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[#94A3B8]">Nenhuma turma agendada no momento.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {proximasTurmas.map((turma) => (
              <article
                key={turma.id}
                className="rounded-xl border border-[#E5ECF6] bg-[#FAFCFF] p-4"
              >
                <h3 className="text-sm font-bold text-[#0F172A]">{turma.title}</h3>
                <div className="mt-2 space-y-1 text-xs text-[#64748B]">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(turma.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {turma.location && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {turma.location}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {turma.participant_count ?? 0} participantes
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Mentorias da Semana */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-[#4A148C]" />
          <h2 className="text-lg font-extrabold text-[#0F172A]">Mentorias da Semana</h2>
        </div>

        {mentoriasSemana.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[#94A3B8]">Nenhuma mentoria agendada nos proximos 7 dias.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {mentoriasSemana.map((mentoria) => (
              <div
                key={mentoria.id}
                className="flex items-center justify-between rounded-xl border border-[#E5ECF6] bg-[#FAFCFF] px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#0F172A]">
                  {mentoria.profiles?.full_name ?? 'Aluno'}
                </p>
                <p className="text-xs text-[#64748B]">
                  {new Date(mentoria.scheduled_date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Formulários Pendentes */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-amber-700" />
          <h2 className="text-lg font-extrabold text-amber-900">Formularios Pendentes</h2>
        </div>
        <p className="mt-3 text-sm text-amber-800">
          <strong className="text-2xl font-extrabold">{formulariosPendentes}</strong>{' '}
          usuarios ainda nao preencheram a autoavaliacao de lideranca.
        </p>
      </section>
    </div>
  )
}
