import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  ClipboardCheck,
  MapPin,
  Plus,
  Target,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

export default async function AdminPage() {
  const admin = createAdminClient()

  // ── Core counts ──
  let totalCourses = 0
  let publishedCourses = 0
  let totalProfiles = 0
  let totalEnrollments = 0
  let totalLeads = 0

  try {
    const [r1, r2, r3, r4, r5] = await Promise.all([
      admin.from('courses').select('*', { count: 'exact', head: true }),
      admin.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
      admin.from('profiles').select('*', { count: 'exact', head: true }),
      admin.from('enrollments').select('*', { count: 'exact', head: true }),
      admin.from('b2b_leads').select('*', { count: 'exact', head: true }),
    ])
    totalCourses = r1.count ?? 0
    publishedCourses = r2.count ?? 0
    totalProfiles = r3.count ?? 0
    totalEnrollments = r4.count ?? 0
    totalLeads = r5.count ?? 0
  } catch { /* tables may not exist */ }

  // ── Assessment counts ──
  let totalAutoavaliacao = 0
  let totalPdi = 0
  let totalExecutiva = 0

  try {
    const { count } = await admin.from('leadership_self_assessments').select('*', { count: 'exact', head: true })
    totalAutoavaliacao = count ?? 0
  } catch { /* */ }
  try {
    const { count } = await admin.from('leadership_pdi').select('*', { count: 'exact', head: true })
    totalPdi = count ?? 0
  } catch { /* */ }
  try {
    const { count } = await admin.from('leadership_executive_assessments').select('*', { count: 'exact', head: true })
    totalExecutiva = count ?? 0
  } catch { /* */ }

  // ── Perfil breakdown ──
  const perfilCounts = { reativo: 0, transicao: 0, lider_valor: 0 }
  try {
    const { data: perfilData } = await admin.from('leadership_self_assessments').select('perfil')
    if (perfilData) {
      for (const row of perfilData as { perfil: string }[]) {
        if (row.perfil in perfilCounts) {
          perfilCounts[row.perfil as keyof typeof perfilCounts]++
        }
      }
    }
  } catch { /* */ }

  // ── Ultimas Inscricoes (5 most recent signups with form status) ──
  type RecentSignup = {
    id: string
    full_name: string
    email: string
    created_at: string
    hasAutoavaliacao: boolean
    hasExec: boolean
    hasPdi: boolean
  }

  let recentSignups: RecentSignup[] = []
  try {
    const { data: recentProfiles } = await admin
      .from('profiles')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentProfiles && recentProfiles.length > 0) {
      // Get emails from auth
      const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 })
      const emailMap: Record<string, string> = {}
      if (authData?.users) {
        for (const u of authData.users) {
          emailMap[u.id] = u.email ?? ''
        }
      }

      // Check form completion for these users
      const userIds = recentProfiles.map((p) => p.id)

      const [saRes, execRes, pdiRes] = await Promise.all([
        admin.from('leadership_self_assessments').select('user_id').in('user_id', userIds),
        admin.from('leadership_executive_assessments').select('user_id').in('user_id', userIds),
        admin.from('leadership_pdi').select('user_id').in('user_id', userIds),
      ])

      const saSet = new Set((saRes.data ?? []).map((r: { user_id: string }) => r.user_id))
      const execSet = new Set((execRes.data ?? []).map((r: { user_id: string }) => r.user_id))
      const pdiSet = new Set((pdiRes.data ?? []).map((r: { user_id: string }) => r.user_id))

      recentSignups = recentProfiles.map((p) => ({
        id: p.id,
        full_name: p.full_name ?? 'Sem nome',
        email: emailMap[p.id] ?? '',
        created_at: p.created_at,
        hasAutoavaliacao: saSet.has(p.id),
        hasExec: execSet.has(p.id),
        hasPdi: pdiSet.has(p.id),
      }))
    }
  } catch { /* */ }

  // ── Turmas agendadas ──
  let turmasAgendadas = 0
  let proximasTurmas: Array<{
    id: string
    title: string
    date: string
    location: string | null
    participant_count: number | null
  }> = []
  try {
    const { count } = await admin
      .from('presential_trainings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
    turmasAgendadas = count ?? 0

    const { data } = await admin
      .from('presential_trainings')
      .select('id, title, date, location, participant_count')
      .eq('status', 'scheduled')
      .order('date', { ascending: true })
      .limit(3)
    proximasTurmas = (data ?? []) as typeof proximasTurmas
  } catch { /* */ }

  // ── Mentorias ──
  let mentoriasPendentes = 0
  let mentoriasSemana: Array<{
    id: string
    scheduled_date: string
    aluno_user_id: string
    aluno_name: string
  }> = []
  try {
    const { count } = await admin
      .from('mentoring_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
    mentoriasPendentes = count ?? 0

    const now = new Date()
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const { data } = await admin
      .from('mentoring_sessions')
      .select('id, scheduled_date, aluno_user_id')
      .eq('status', 'scheduled')
      .gte('scheduled_date', now.toISOString())
      .lte('scheduled_date', weekLater.toISOString())
      .order('scheduled_date', { ascending: true })
      .limit(5)

    if (data && data.length > 0) {
      const alunoIds = data.map((m) => m.aluno_user_id).filter(Boolean)
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, full_name')
        .in('id', alunoIds)
      const nameMap: Record<string, string> = {}
      if (profiles) {
        for (const p of profiles) {
          nameMap[p.id] = p.full_name ?? 'Aluno'
        }
      }
      mentoriasSemana = data.map((m) => ({
        id: m.id,
        scheduled_date: m.scheduled_date,
        aluno_user_id: m.aluno_user_id,
        aluno_name: nameMap[m.aluno_user_id] ?? 'Aluno',
      }))
    }
  } catch { /* */ }

  // ── Gestores ──
  let gestoresAtivos = 0
  try {
    const { count } = await admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hr_manager')
    gestoresAtivos = count ?? 0
  } catch { /* */ }

  const formulariosPendentes = Math.max(0, totalProfiles - totalAutoavaliacao)

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Centro de comando</p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold">Painel Administrativo</h1>
            <p className="mt-1 max-w-xl text-xs text-[#A9BDD8]">
              Visao geral de formularios, alunos e operacao educacional.
            </p>
          </div>
          <div className="flex gap-2 text-[11px] text-[#A9BDD8]">
            <span className="rounded-lg border border-[#274364] bg-[#0A1528] px-3 py-1.5">
              Leads B2B: <strong className="text-white">{totalLeads}</strong>
            </span>
            <span className="rounded-lg border border-[#274364] bg-[#0A1528] px-3 py-1.5">
              Gestores: <strong className="text-white">{gestoresAtivos}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ── Acoes Rapidas ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
          <Plus className="h-4 w-4 text-[#1565C0]" />
          Acoes Rapidas
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-xs font-bold text-[#334155] transition-colors hover:border-[#1565C0] hover:bg-[#F7FAFE]"
          >
            <UserPlus className="h-4 w-4 text-[#1565C0]" />
            Novo Lead
          </Link>
          <Link
            href="/admin/alunos"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-xs font-bold text-[#334155] transition-colors hover:border-[#7C3AED] hover:bg-[#FAF5FF]"
          >
            <Users className="h-4 w-4 text-[#7C3AED]" />
            Ver Inscritos
          </Link>
          <Link
            href="/admin/formularios/respostas/autoavaliacao"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-xs font-bold text-[#334155] transition-colors hover:border-[#1565C0] hover:bg-[#EFF6FE]"
          >
            <ClipboardCheck className="h-4 w-4 text-[#1565C0]" />
            Ver Autoavaliacoes
          </Link>
          <Link
            href="/admin/formularios/respostas/avaliacao-executiva"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-xs font-bold text-[#334155] transition-colors hover:border-[#00695C] hover:bg-[#E0F2F1]"
          >
            <Target className="h-4 w-4 text-[#00695C]" />
            Ver Executivas
          </Link>
        </div>
      </section>

      {/* ── Formularios KPIs ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
          <ClipboardCheck className="h-4 w-4 text-[#1565C0]" />
          Formularios de Lideranca
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <Link href="/admin/formularios/respostas/autoavaliacao" className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm transition-colors hover:border-[#1565C0]/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Autoavaliacoes</p>
            <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalAutoavaliacao}</p>
          </Link>
          <Link href="/admin/formularios/respostas/avaliacao-executiva" className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm transition-colors hover:border-[#00695C]/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Executivas</p>
            <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalExecutiva}</p>
          </Link>
          <Link href="/admin/formularios/respostas/pdi" className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm transition-colors hover:border-[#7B1FA2]/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">PDIs</p>
            <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalPdi}</p>
          </Link>
          <article className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">Reativo</p>
            <p className="mt-1 text-2xl font-extrabold text-red-900">{perfilCounts.reativo}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Transicao</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-900">{perfilCounts.transicao}</p>
          </article>
          <article className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Lider Valor</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-900">{perfilCounts.lider_valor}</p>
          </article>
        </div>
      </section>

      {/* ── Ultimas Inscricoes ── */}
      <section className="rounded-xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
            <UserPlus className="h-4 w-4 text-[#7C3AED]" />
            Ultimas Inscricoes
          </h2>
          <Link href="/admin/alunos" className="text-[11px] font-bold text-[#1E88E5] hover:underline">
            Ver todos <ArrowRight className="ml-0.5 inline h-3 w-3" />
          </Link>
        </div>
        {recentSignups.length === 0 ? (
          <p className="mt-3 text-xs text-[#94A3B8]">Nenhuma inscricao recente.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {recentSignups.map((s) => (
              <Link
                key={s.id}
                href={`/admin/alunos/${s.id}`}
                className="flex items-center justify-between rounded-lg border border-[#E5ECF6] bg-[#FAFCFF] px-4 py-2.5 transition-colors hover:border-[#1565C0]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FE] text-sm font-bold text-[#1565C0]">
                    {s.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{s.full_name}</p>
                    <p className="text-[11px] text-[#64748B]">{s.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${s.hasAutoavaliacao ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      AA
                    </span>
                    <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${s.hasExec ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      EX
                    </span>
                    <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${s.hasPdi ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      PDI
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">{formatDate(s.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Operacao KPIs ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
          <TrendingUp className="h-4 w-4 text-[#F57C00]" />
          Operacao
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: 'Usuarios', value: totalProfiles, icon: Users, color: '#7C3AED', href: '/admin/alunos' },
            { label: 'Formacoes', value: totalCourses, icon: BookOpen, color: '#0B4A8F', href: '/admin/cursos' },
            { label: 'Matriculas', value: totalEnrollments, icon: TrendingUp, color: '#D97706', href: null },
            { label: 'Turmas', value: turmasAgendadas, icon: Calendar, color: '#0D47A1', href: null },
            { label: 'Mentorias pend.', value: mentoriasPendentes, icon: UserCheck, color: '#4A148C', href: null },
          ].map((stat) => {
            const Icon = stat.icon
            const inner = (
              <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm transition-colors hover:border-[#C5D9F0]">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{stat.label}</p>
                </div>
                <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{stat.value}</p>
              </article>
            )
            return stat.href ? (
              <Link key={stat.label} href={stat.href}>{inner}</Link>
            ) : (
              <div key={stat.label}>{inner}</div>
            )
          })}
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Formularios', desc: 'Autoavaliacao, PDI e Executiva', href: '/admin/formularios', icon: ClipboardCheck, color: '#1565C0' },
          { title: 'Usuarios', desc: `${totalProfiles} cadastrados, ${totalAutoavaliacao} preencheram`, href: '/admin/alunos', icon: Users, color: '#7C3AED' },
          { title: 'Formacoes', desc: `${publishedCourses} publicadas de ${totalCourses}`, href: '/admin/cursos', icon: BookOpen, color: '#0B4A8F' },
          { title: 'Pipeline B2B', desc: `${totalLeads} leads registrados`, href: '/admin/leads', icon: BriefcaseBusiness, color: '#D97706' },
        ].map(({ title, desc, href, icon: Icon, color }) => (
          <Link
            key={title}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm transition-all hover:border-[#C5D9F0] hover:shadow-md"
          >
            <Icon className="h-5 w-5 shrink-0" style={{ color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0F172A]">{title}</p>
              <p className="truncate text-xs text-[#64748B]">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>

      {/* ── Proximas Turmas ── */}
      <section className="rounded-xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#0B4A8F]" />
          <h2 className="text-sm font-extrabold text-[#0F172A]">Proximas Turmas</h2>
        </div>
        {proximasTurmas.length === 0 ? (
          <p className="mt-3 text-xs text-[#94A3B8]">Nenhuma turma agendada.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {proximasTurmas.map((turma) => (
              <div key={turma.id} className="rounded-lg border border-[#E5ECF6] bg-[#FAFCFF] px-3 py-2.5">
                <p className="text-xs font-bold text-[#0F172A]">{turma.title}</p>
                <div className="mt-1 space-y-0.5 text-[11px] text-[#64748B]">
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(turma.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </p>
                  {turma.location && (
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {turma.location}
                    </p>
                  )}
                  <p className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {turma.participant_count ?? 0} participantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Mentorias da Semana ── */}
      <section className="rounded-xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#4A148C]" />
          <h2 className="text-sm font-extrabold text-[#0F172A]">Mentorias da Semana</h2>
        </div>
        {mentoriasSemana.length === 0 ? (
          <p className="mt-3 text-xs text-[#94A3B8]">Nenhuma mentoria agendada nos proximos 7 dias.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {mentoriasSemana.map((m) => (
              <Link
                key={m.id}
                href={`/admin/alunos/${m.aluno_user_id}`}
                className="flex items-center justify-between rounded-lg border border-[#E5ECF6] bg-[#FAFCFF] px-3 py-2 transition-colors hover:border-[#4A148C]/20"
              >
                <p className="text-xs font-semibold text-[#0F172A]">{m.aluno_name}</p>
                <p className="text-[11px] text-[#64748B]">
                  {new Date(m.scheduled_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Formularios Pendentes ── */}
      {formulariosPendentes > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-700" />
            <p className="text-sm text-amber-800">
              <strong className="text-xl font-extrabold">{formulariosPendentes}</strong>{' '}
              usuarios ainda nao preencheram a autoavaliacao.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
