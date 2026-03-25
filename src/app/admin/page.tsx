import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'

// ── Helpers ──

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min atras`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atras`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d atras`
  return `${Math.floor(days / 30)}m atras`
}

type ActivityEvent = {
  id: string
  type: 'signup' | 'self_assessment' | 'exec_assessment' | 'training_participant'
  description: string
  date: string
  href: string
}

export default async function AdminPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  // ── Get current user name ──
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let userName = 'Administrador'
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      if (profile?.full_name) userName = profile.full_name.split(' ')[0]
    } catch { /* */ }
  }

  // ── Core counts ──
  let totalPessoas = 0
  let totalAvaliacoes = 0
  let totalTurmas = 0
  let totalLeads = 0

  try {
    const [r1, r2, r3, r4, r5] = await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }),
      admin.from('leadership_self_assessments').select('*', { count: 'exact', head: true }),
      admin.from('leadership_executive_assessments').select('*', { count: 'exact', head: true }),
      admin.from('presential_trainings').select('*', { count: 'exact', head: true }),
      admin.from('b2b_leads').select('*', { count: 'exact', head: true }),
    ])
    totalPessoas = r1.count ?? 0
    totalAvaliacoes = (r2.count ?? 0) + (r3.count ?? 0)
    totalTurmas = r4.count ?? 0
    totalLeads = r5.count ?? 0
  } catch { /* tables may not exist */ }

  // ── Activity Feed — merge recent events ──
  const events: ActivityEvent[] = []

  try {
    const { data: recentProfiles } = await admin
      .from('profiles')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentProfiles) {
      for (const p of recentProfiles) {
        events.push({
          id: `signup-${p.id}`,
          type: 'signup',
          description: `${p.full_name || 'Novo usuario'} se cadastrou`,
          date: p.created_at,
          href: `/admin/pessoas/${p.id}`,
        })
      }
    }
  } catch { /* */ }

  try {
    const { data: recentSA } = await admin
      .from('leadership_self_assessments')
      .select('id, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentSA) {
      const userIds = recentSA.map((r) => r.user_id).filter(Boolean)
      let nameMap: Record<string, string> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await admin
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        if (profiles) {
          for (const p of profiles) nameMap[p.id] = p.full_name ?? 'Usuario'
        }
      }
      for (const sa of recentSA) {
        events.push({
          id: `sa-${sa.id}`,
          type: 'self_assessment',
          description: `${nameMap[sa.user_id] || 'Usuario'} preencheu Autoavaliacao`,
          date: sa.created_at,
          href: '/admin/avaliacoes',
        })
      }
    }
  } catch { /* */ }

  try {
    const { data: recentExec } = await admin
      .from('leadership_executive_assessments')
      .select('id, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentExec) {
      const userIds = recentExec.map((r) => r.user_id).filter(Boolean)
      let nameMap: Record<string, string> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await admin
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        if (profiles) {
          for (const p of profiles) nameMap[p.id] = p.full_name ?? 'Usuario'
        }
      }
      for (const ea of recentExec) {
        events.push({
          id: `exec-${ea.id}`,
          type: 'exec_assessment',
          description: `${nameMap[ea.user_id] || 'Gestor'} enviou Avaliacao Executiva`,
          date: ea.created_at,
          href: '/admin/avaliacoes',
        })
      }
    }
  } catch { /* */ }

  try {
    const { data: recentParticipants } = await admin
      .from('presential_training_participants')
      .select('id, training_id, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentParticipants) {
      const userIds = recentParticipants.map((r) => r.user_id).filter(Boolean)
      let nameMap: Record<string, string> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await admin
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        if (profiles) {
          for (const p of profiles) nameMap[p.id] = p.full_name ?? 'Participante'
        }
      }
      for (const tp of recentParticipants) {
        events.push({
          id: `tp-${tp.id}`,
          type: 'training_participant',
          description: `${nameMap[tp.user_id] || 'Participante'} entrou em uma turma`,
          date: tp.created_at,
          href: '/admin/treinamentos',
        })
      }
    }
  } catch { /* */ }

  // Sort all events by date desc, take top 10
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentEvents = events.slice(0, 10)

  // ── Pending Actions ──
  type PendingAction = {
    id: string
    label: string
    count: number
    href: string
  }

  const pendingActions: PendingAction[] = []

  // Exec assessments without link
  try {
    const { data: execAssessments } = await admin
      .from('leadership_executive_assessments')
      .select('id, user_id')
    const { data: selfAssessments } = await admin
      .from('leadership_self_assessments')
      .select('user_id')
    if (execAssessments && selfAssessments) {
      const selfUserIds = new Set(selfAssessments.map((s) => s.user_id))
      const unlinked = execAssessments.filter((e) => !selfUserIds.has(e.user_id))
      if (unlinked.length > 0) {
        pendingActions.push({
          id: 'unlinked-exec',
          label: `${unlinked.length} avaliacoes executivas sem vinculo`,
          count: unlinked.length,
          href: '/admin/avaliacoes',
        })
      }
    }
  } catch { /* */ }

  // Leads without classification
  try {
    const { count } = await admin
      .from('b2b_leads')
      .select('*', { count: 'exact', head: true })
      .or('status.is.null,status.eq.')
    if (count && count > 0) {
      pendingActions.push({
        id: 'unclassified-leads',
        label: `${count} leads sem classificacao`,
        count,
        href: '/admin/comercial',
      })
    }
  } catch { /* */ }

  // Turmas with available slots
  try {
    const { data: turmas } = await admin
      .from('presential_trainings')
      .select('id, title, max_participants, participant_count')
      .eq('status', 'scheduled')
    if (turmas) {
      for (const t of turmas) {
        const remaining = (t.max_participants ?? 0) - (t.participant_count ?? 0)
        if (remaining > 0) {
          pendingActions.push({
            id: `turma-${t.id}`,
            label: `${t.title} — ${remaining} vagas restantes`,
            count: remaining,
            href: '/admin/treinamentos',
          })
        }
      }
    }
  } catch { /* */ }

  // Mentorias count
  try {
    const { count } = await admin
      .from('mentoring_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
    if (count === 0) {
      pendingActions.push({
        id: 'no-mentorias',
        label: '0 mentorias agendadas',
        count: 0,
        href: '/admin/treinamentos',
      })
    }
  } catch { /* */ }

  // ── Quick Vision Cards data ──
  let leadsThisWeek = 0
  let activeStudents = 0
  let completedThisMonth = 0
  let totalPdi = 0
  let proposalsSent = 0

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { count } = await admin
      .from('b2b_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo)
    leadsThisWeek = count ?? 0
  } catch { /* */ }

  try {
    const { count } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
    activeStudents = count ?? 0
  } catch { /* */ }

  try {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const { count } = await admin
      .from('leadership_self_assessments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString())
    completedThisMonth = count ?? 0
  } catch { /* */ }

  try {
    const { count } = await admin
      .from('leadership_pdi')
      .select('*', { count: 'exact', head: true })
    totalPdi = count ?? 0
  } catch { /* */ }

  try {
    const { count } = await admin
      .from('b2b_leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'proposal_sent')
    proposalsSent = count ?? 0
  } catch { /* */ }

  // ── Icon for event type ──
  function eventIcon(type: ActivityEvent['type']) {
    switch (type) {
      case 'signup':
        return <UserPlus className="h-3.5 w-3.5 text-[#7C3AED]" />
      case 'self_assessment':
        return <ClipboardCheck className="h-3.5 w-3.5 text-[#1565C0]" />
      case 'exec_assessment':
        return <UserCheck className="h-3.5 w-3.5 text-[#00695C]" />
      case 'training_participant':
        return <GraduationCap className="h-3.5 w-3.5 text-[#E65100]" />
    }
  }

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* ── Welcome + Quick Numbers ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">
            Ola, {userName}
          </h1>
          <p className="text-[13px] capitalize text-[#64748B]">{today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: totalPessoas, label: 'pessoas' },
            { value: totalAvaliacoes, label: 'avaliacoes' },
            { value: totalTurmas, label: 'turmas' },
            { value: totalLeads, label: 'leads' },
          ].map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E5ECF6] bg-white px-3 py-1 text-[12px] text-[#475569] shadow-sm"
            >
              <strong className="font-bold text-[#0F172A]">{pill.value}</strong>
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 1: Atividade Recente ── */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-[#0F172A]">Atividade Recente</h2>
        <div className="rounded-2xl border border-[#E5ECF6] bg-white shadow-sm">
          {recentEvents.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-[#94A3B8]">
              Nenhuma atividade recente.
            </p>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={event.href}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F8FAFD]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9]">
                    {eventIcon(event.type)}
                  </div>
                  <p className="flex-1 text-[13px] text-[#334155]">{event.description}</p>
                  <span className="shrink-0 text-[11px] text-[#94A3B8]">
                    {timeAgo(event.date)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2: Acoes Pendentes ── */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-[#0F172A]">Acoes Pendentes</h2>
        {pendingActions.length === 0 ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-[13px] font-medium text-emerald-700">
              Tudo em dia! Nenhuma acao pendente.
            </p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {pendingActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 transition-colors hover:border-amber-300 hover:bg-amber-50"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span className="flex-1 text-[13px] text-amber-800">{action.label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Section 3: Visao Rapida (3 cards) ── */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-[#0F172A]">Visao Rapida</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Card: Pessoas */}
          <div className="rounded-2xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#7C3AED]" />
              <h3 className="text-[13px] font-bold text-[#0F172A]">Pessoas</h3>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Total cadastrados</span>
                <span className="font-bold text-[#0F172A]">{totalPessoas}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Leads esta semana</span>
                <span className="font-bold text-[#0F172A]">{leadsThisWeek}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Alunos ativos</span>
                <span className="font-bold text-[#0F172A]">{activeStudents}</span>
              </div>
            </div>
            <Link
              href="/admin/pessoas"
              className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#1565C0] hover:underline"
            >
              Ver mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card: Avaliacoes */}
          <div className="rounded-2xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-[#1565C0]" />
              <h3 className="text-[13px] font-bold text-[#0F172A]">Avaliacoes</h3>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Concluidas este mes</span>
                <span className="font-bold text-[#0F172A]">{completedThisMonth}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">PDIs gerados</span>
                <span className="font-bold text-[#0F172A]">{totalPdi}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Total avaliacoes</span>
                <span className="font-bold text-[#0F172A]">{totalAvaliacoes}</span>
              </div>
            </div>
            <Link
              href="/admin/avaliacoes"
              className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#1565C0] hover:underline"
            >
              Ver mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card: Comercial */}
          <div className="rounded-2xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#E65100]" />
              <h3 className="text-[13px] font-bold text-[#0F172A]">Comercial</h3>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Leads no pipeline</span>
                <span className="font-bold text-[#0F172A]">{totalLeads}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Propostas enviadas</span>
                <span className="font-bold text-[#0F172A]">{proposalsSent}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#64748B]">Leads esta semana</span>
                <span className="font-bold text-[#0F172A]">{leadsThisWeek}</span>
              </div>
            </div>
            <Link
              href="/admin/comercial"
              className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#1565C0] hover:underline"
            >
              Ver mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
