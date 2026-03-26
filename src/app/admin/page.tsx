import Link from 'next/link'
import {
  BarChart3,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  Users,
} from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

// ── Types ──

type SelfAssessmentRow = {
  id: string
  user_id: string
  q_percepcao: number | null
  q_gestao: number | null
  q_comunicacao: number | null
  q_tecnologia: number | null
  q_etica: number | null
  q_dor: number | null
  pontuacao_total: number | null
  perfil: string | null
  created_at: string
  profiles: { id: string; full_name: string | null } | null
}

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
  source: string | null
}

// ── Dimension config ──

const DIMENSIONS = [
  { key: 'q_percepcao' as const, label: 'Percepcao da Funcao', short: 'Percep.' },
  { key: 'q_gestao' as const, label: 'Gestao de Equipes', short: 'Gestao' },
  { key: 'q_comunicacao' as const, label: 'Comunicacao e Postura', short: 'Comun.' },
  { key: 'q_tecnologia' as const, label: 'Tecnologia e KPIs', short: 'Tecnol.' },
  { key: 'q_etica' as const, label: 'Alicerce Etico', short: 'Etica' },
  { key: 'q_dor' as const, label: 'Dor Atual', short: 'Dor' },
] as const

type DimKey = (typeof DIMENSIONS)[number]['key']

const PERFIL_LABELS: Record<string, string> = {
  reativo: 'Reativo',
  transicao: 'Transicao',
  lider_valor: 'Lider de Valor',
}

const PERFIL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  reativo: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  transicao: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  lider_valor: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
}

// ── Helpers ──

function scoreColor(score: number): string {
  if (score < 1.5) return '#E53935'
  if (score <= 2.2) return '#F57C00'
  return '#4CAF35'
}

function barWidth(score: number, max: number): number {
  return Math.round((score / max) * 100)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default async function AdminPage() {
  const admin = createAdminClient()

  // ── Section 1: Overview counts ──
  let totalProfiles = 0
  let totalSelfAssessments = 0
  let totalExecAssessments = 0
  let totalPDIs = 0
  let totalActiveTurmas = 0

  try {
    const [r1, r2, r3, r4, r5] = await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }),
      admin.from('leadership_self_assessments').select('*', { count: 'exact', head: true }),
      admin.from('leadership_executive_assessments').select('*', { count: 'exact', head: true }),
      admin.from('leadership_pdi').select('*', { count: 'exact', head: true }),
      admin.from('presential_trainings').select('*', { count: 'exact', head: true }),
    ])
    totalProfiles = r1.count ?? 0
    totalSelfAssessments = r2.count ?? 0
    totalExecAssessments = r3.count ?? 0
    totalPDIs = r4.count ?? 0
    totalActiveTurmas = r5.count ?? 0
  } catch { /* tables may not exist yet */ }

  // ── Section 2: Self-assessment analytics ──
  let selfAssessments: SelfAssessmentRow[] = []

  try {
    const { data } = await admin
      .from('leadership_self_assessments')
      .select('id, user_id, q_percepcao, q_gestao, q_comunicacao, q_tecnologia, q_etica, q_dor, pontuacao_total, perfil, created_at, profiles(id, full_name)')
      .order('created_at', { ascending: false })
    if (data) selfAssessments = data as unknown as SelfAssessmentRow[]
  } catch { /* */ }

  // Perfil distribution
  const perfilCounts: Record<string, number> = { reativo: 0, transicao: 0, lider_valor: 0 }
  for (const sa of selfAssessments) {
    const p = sa.perfil ?? 'reativo'
    perfilCounts[p] = (perfilCounts[p] ?? 0) + 1
  }
  const totalForPerfil = selfAssessments.length || 1

  // Dimension averages
  const dimSums: Record<DimKey, number> = {
    q_percepcao: 0, q_gestao: 0, q_comunicacao: 0,
    q_tecnologia: 0, q_etica: 0, q_dor: 0,
  }
  const dimCounts: Record<DimKey, number> = {
    q_percepcao: 0, q_gestao: 0, q_comunicacao: 0,
    q_tecnologia: 0, q_etica: 0, q_dor: 0,
  }

  for (const sa of selfAssessments) {
    for (const dim of DIMENSIONS) {
      const val = sa[dim.key]
      if (val !== null && val !== undefined) {
        dimSums[dim.key] += val
        dimCounts[dim.key] += 1
      }
    }
  }

  const dimAverages = DIMENSIONS.map((dim) => {
    const count = dimCounts[dim.key]
    const avg = count > 0 ? dimSums[dim.key] / count : 0
    return { ...dim, avg: Math.round(avg * 100) / 100 }
  })

  // Insights
  const sortedByAvg = [...dimAverages].sort((a, b) => b.avg - a.avg)
  const strongest = sortedByAvg[0]
  const weakest = sortedByAvg[sortedByAvg.length - 1]
  const gapValue = strongest && weakest ? Math.round((strongest.avg - weakest.avg) * 100) / 100 : 0

  // ── Section 3: PDI Status ──
  type PDIStatusRow = {
    userId: string
    name: string
    perfil: string
    hasExec: boolean
    pdiStatus: string
  }

  const pdiStatusRows: PDIStatusRow[] = []

  try {
    // Get all users who did self-assessment
    const selfUserIds = selfAssessments.map((sa) => sa.user_id)

    if (selfUserIds.length > 0) {
      // Check which have exec assessments
      const { data: execData } = await admin
        .from('leadership_executive_assessments')
        .select('user_id')
        .in('user_id', selfUserIds)
      const execUserIds = new Set((execData ?? []).map((e: { user_id: string }) => e.user_id))

      // Check which have PDIs
      const { data: pdiData } = await admin
        .from('leadership_pdi')
        .select('user_id')
        .in('user_id', selfUserIds)
      const pdiUserIds = new Set((pdiData ?? []).map((p: { user_id: string }) => p.user_id))

      // Build rows (deduplicate by user_id, take latest assessment)
      const seen = new Set<string>()
      for (const sa of selfAssessments) {
        if (seen.has(sa.user_id)) continue
        seen.add(sa.user_id)

        const hasExec = execUserIds.has(sa.user_id)
        const hasPdi = pdiUserIds.has(sa.user_id)

        let pdiStatus = 'Aguardando Executiva'
        if (hasPdi) pdiStatus = 'Gerado'
        else if (hasExec) pdiStatus = 'Parcial'

        pdiStatusRows.push({
          userId: sa.user_id,
          name: sa.profiles?.full_name ?? 'Sem nome',
          perfil: sa.perfil ?? 'reativo',
          hasExec,
          pdiStatus,
        })
      }
    }
  } catch { /* */ }

  // ── Section 4: Recent signups ──
  let recentSignups: ProfileRow[] = []

  try {
    const { data } = await admin
      .from('profiles')
      .select('id, full_name, email, created_at, source')
      .order('created_at', { ascending: false })
      .limit(5)
    if (data) recentSignups = data as ProfileRow[]
  } catch { /* */ }

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* ── Section 1: Overview Strip ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: totalProfiles, label: 'Inscritos', icon: Users, color: '#1565C0' },
          { value: totalSelfAssessments, label: 'Autoavaliacoes', icon: ClipboardCheck, color: '#F57C00' },
          { value: totalExecAssessments, label: 'Av. Executivas', icon: BarChart3, color: '#7C3AED' },
          { value: totalPDIs, label: 'PDIs Gerados', icon: FileText, color: '#4CAF35' },
          { value: totalActiveTurmas, label: 'Turmas Ativas', icon: GraduationCap, color: '#E53935' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-xl border border-[#E5ECF6] bg-white px-4 py-2.5 shadow-sm"
          >
            <item.icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#0F172A]">{item.value}</span>
              <span className="text-[12px] text-[#64748B]">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Analise de Autoavaliacoes ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <ClipboardCheck className="h-4 w-4 text-[#1565C0]" />
          Analise de Autoavaliacoes
          <span className="ml-1 text-[11px] font-normal text-[#94A3B8]">
            ({selfAssessments.length} resposta{selfAssessments.length !== 1 ? 's' : ''})
          </span>
        </h2>

        {selfAssessments.length === 0 ? (
          <div className="rounded-xl border border-[#E5ECF6] bg-white px-4 py-8 text-center">
            <p className="text-[13px] text-[#94A3B8]">Nenhuma autoavaliacao preenchida ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 2a: Perfil Distribution */}
            <div className="rounded-xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
                Distribuicao por Perfil
              </h3>
              <div className="space-y-2">
                {(['reativo', 'transicao', 'lider_valor'] as const).map((perfil) => {
                  const count = perfilCounts[perfil] ?? 0
                  const pct = Math.round((count / totalForPerfil) * 100)
                  const colors = PERFIL_COLORS[perfil]
                  return (
                    <div key={perfil} className="flex items-center gap-3">
                      <span className="w-24 text-[12px] font-medium text-[#334155]">
                        {PERFIL_LABELS[perfil]}
                      </span>
                      <div className="flex-1">
                        <div className="h-5 w-full overflow-hidden rounded-md bg-[#F1F5F9]">
                          <div
                            className="flex h-full items-center rounded-md px-2 text-[11px] font-bold transition-all"
                            style={{
                              width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                              backgroundColor: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              minWidth: count > 0 ? '2.5rem' : '0',
                            }}
                          >
                            {count > 0 && count}
                          </div>
                        </div>
                      </div>
                      <span className="w-10 text-right text-[11px] text-[#94A3B8]">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2b: Dimension Average Scores */}
            <div className="rounded-xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
                Media por Dimensao (escala 1-3)
              </h3>
              <div className="space-y-2">
                {dimAverages.map((dim) => {
                  const color = scoreColor(dim.avg)
                  const width = barWidth(dim.avg, 3)
                  return (
                    <div key={dim.key} className="flex items-center gap-3">
                      <span className="w-36 text-[12px] font-medium text-[#334155]">{dim.label}</span>
                      <div className="flex-1">
                        <div className="h-5 w-full overflow-hidden rounded-md bg-[#F1F5F9]">
                          <div
                            className="flex h-full items-center rounded-md px-2 text-[11px] font-bold text-white transition-all"
                            style={{
                              width: `${Math.max(width, dim.avg > 0 ? 12 : 0)}%`,
                              backgroundColor: color,
                              minWidth: dim.avg > 0 ? '2.5rem' : '0',
                            }}
                          >
                            {dim.avg > 0 && dim.avg.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <span
                        className="w-10 text-right text-[12px] font-bold"
                        style={{ color }}
                      >
                        {dim.avg.toFixed(1)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2c: Score Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E5ECF6] bg-white shadow-sm">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[#F1F5F9] bg-[#F8FAFD]">
                    <th className="px-3 py-2 text-left font-semibold text-[#64748B]">Nome</th>
                    <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Perfil</th>
                    {DIMENSIONS.map((dim) => (
                      <th
                        key={dim.key}
                        className="px-2 py-2 text-center font-semibold text-[#64748B]"
                        title={dim.label}
                      >
                        {dim.short}
                      </th>
                    ))}
                    <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Total</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#64748B]">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {selfAssessments.map((sa) => {
                    const perfilKey = sa.perfil ?? 'reativo'
                    const colors = PERFIL_COLORS[perfilKey] ?? PERFIL_COLORS.reativo
                    return (
                      <tr key={sa.id} className="hover:bg-[#F8FAFD]">
                        <td className="px-3 py-2">
                          <Link
                            href={`/admin/pessoas/${sa.user_id}`}
                            className="font-medium text-[#1565C0] hover:underline"
                          >
                            {sa.profiles?.full_name ?? 'Sem nome'}
                          </Link>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {PERFIL_LABELS[perfilKey] ?? perfilKey}
                          </span>
                        </td>
                        {DIMENSIONS.map((dim) => {
                          const val = sa[dim.key]
                          const color = val !== null ? scoreColor(val) : '#CBD5E1'
                          return (
                            <td key={dim.key} className="px-2 py-2 text-center">
                              <span className="font-bold" style={{ color }}>
                                {val ?? '-'}
                              </span>
                            </td>
                          )
                        })}
                        <td className="px-2 py-2 text-center font-bold text-[#0F172A]">
                          {sa.pontuacao_total ?? '-'}
                        </td>
                        <td className="px-3 py-2 text-right text-[#94A3B8]">
                          {formatDate(sa.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 2d: Dimension Insights */}
            {selfAssessments.length >= 1 && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-2.5 rounded-xl border border-[#E5ECF6] bg-white p-3 shadow-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF35]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                      Dimensao mais forte
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold text-[#0F172A]">
                      {strongest?.label ?? '-'}
                    </p>
                    <p className="text-[12px] text-[#64748B]">
                      media {strongest?.avg.toFixed(1) ?? '0'} / 3
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-[#E5ECF6] bg-white p-3 shadow-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#E53935]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                      Dimensao mais fraca
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold text-[#0F172A]">
                      {weakest?.label ?? '-'}
                    </p>
                    <p className="text-[12px] text-[#64748B]">
                      media {weakest?.avg.toFixed(1) ?? '0'} / 3
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-[#E5ECF6] bg-white p-3 shadow-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#F57C00]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                      Gap mais critico
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold text-[#0F172A]">
                      {strongest?.label ?? '-'} vs {weakest?.label ?? '-'}
                    </p>
                    <p className="text-[12px] text-[#64748B]">
                      diferenca de {gapValue.toFixed(1)} pontos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Section 3: Status PDI ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <FileText className="h-4 w-4 text-[#4CAF35]" />
          Status PDI
        </h2>
        {pdiStatusRows.length === 0 ? (
          <div className="rounded-xl border border-[#E5ECF6] bg-white px-4 py-6 text-center">
            <p className="text-[13px] text-[#94A3B8]">
              Nenhum PDI disponivel. Autoavaliacoes precisam ser preenchidas primeiro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E5ECF6] bg-white shadow-sm">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFD]">
                  <th className="px-3 py-2 text-left font-semibold text-[#64748B]">Nome</th>
                  <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Perfil</th>
                  <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Av. Executiva?</th>
                  <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Status PDI</th>
                  <th className="px-3 py-2 text-right font-semibold text-[#64748B]">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {pdiStatusRows.map((row) => {
                  const colors = PERFIL_COLORS[row.perfil] ?? PERFIL_COLORS.reativo
                  const statusColor =
                    row.pdiStatus === 'Gerado'
                      ? '#4CAF35'
                      : row.pdiStatus === 'Parcial'
                        ? '#F57C00'
                        : '#94A3B8'
                  return (
                    <tr key={row.userId} className="hover:bg-[#F8FAFD]">
                      <td className="px-3 py-2">
                        <Link
                          href={`/admin/pessoas/${row.userId}`}
                          className="font-medium text-[#1565C0] hover:underline"
                        >
                          {row.name}
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {PERFIL_LABELS[row.perfil] ?? row.perfil}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: row.hasExec ? '#4CAF35' : '#94A3B8' }}
                        >
                          {row.hasExec ? 'Sim' : 'Nao'}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: statusColor + '18',
                            color: statusColor,
                          }}
                        >
                          {row.pdiStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          href={`/admin/pessoas/${row.userId}`}
                          className="text-[11px] font-semibold text-[#1565C0] hover:underline"
                        >
                          Ver PDI
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

      {/* ── Section 4: Ultimas Inscricoes ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <Users className="h-4 w-4 text-[#7C3AED]" />
          Ultimas Inscricoes
        </h2>
        {recentSignups.length === 0 ? (
          <div className="rounded-xl border border-[#E5ECF6] bg-white px-4 py-6 text-center">
            <p className="text-[13px] text-[#94A3B8]">Nenhuma inscricao recente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E5ECF6] bg-white shadow-sm">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFD]">
                  <th className="px-3 py-2 text-left font-semibold text-[#64748B]">Nome</th>
                  <th className="px-2 py-2 text-left font-semibold text-[#64748B]">Email</th>
                  <th className="px-2 py-2 text-center font-semibold text-[#64748B]">Data</th>
                  <th className="px-3 py-2 text-center font-semibold text-[#64748B]">Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recentSignups.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFD]">
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin/pessoas/${p.id}`}
                        className="font-medium text-[#1565C0] hover:underline"
                      >
                        {p.full_name ?? 'Sem nome'}
                      </Link>
                    </td>
                    <td className="px-2 py-2 text-[#64748B]">{p.email ?? '-'}</td>
                    <td className="px-2 py-2 text-center text-[#94A3B8]">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block rounded-full border border-[#E5ECF6] bg-[#F8FAFD] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
                        {p.source ?? 'direto'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Section 5: Acoes Rapidas ── */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-[#0F172A]">Acoes Rapidas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CopyLinkCard
            icon={<ClipboardCheck className="h-4 w-4 text-[#1565C0]" />}
            title="Enviar Autoavaliacao"
            description="Copie o link do formulario"
            link="/treinamento/autoavaliacao"
          />
          <CopyLinkCard
            icon={<BarChart3 className="h-4 w-4 text-[#7C3AED]" />}
            title="Enviar Av. Executiva"
            description="Copie o link do formulario"
            link="/treinamento/avaliacao-executiva"
          />
          <LinkCard
            icon={<Users className="h-4 w-4 text-[#F57C00]" />}
            title="Ver Pessoas"
            description="Gerenciar participantes"
            href="/admin/pessoas"
          />
          <LinkCard
            icon={<GraduationCap className="h-4 w-4 text-[#4CAF35]" />}
            title="Criar Turma"
            description="Nova turma presencial"
            href="/admin/treinamentos"
          />
        </div>
      </section>
    </div>
  )
}

// ── Subcomponents ──

function CopyLinkCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[#E5ECF6] bg-white p-3 shadow-sm transition-colors hover:border-[#1565C0]/20 hover:bg-[#F8FAFD]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-[#0F172A]">{title}</p>
        <p className="text-[11px] text-[#94A3B8]">{description}</p>
        <p className="mt-1 flex items-center gap-1 truncate text-[11px] font-medium text-[#1565C0]">
          <Copy className="h-3 w-3 shrink-0" />
          <span className="truncate">{link}</span>
        </p>
      </div>
    </div>
  )
}

function LinkCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-[#E5ECF6] bg-white p-3 shadow-sm transition-colors hover:border-[#1565C0]/20 hover:bg-[#F8FAFD]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-[#0F172A]">{title}</p>
        <p className="text-[11px] text-[#94A3B8]">{description}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#1565C0]">
          <ExternalLink className="h-3 w-3" />
          Acessar
        </p>
      </div>
    </Link>
  )
}
