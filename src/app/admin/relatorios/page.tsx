import Link from 'next/link'
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { generatePDI, getPDIStatus } from '@/lib/utils/pdi-generator'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AlunoWithPDI = {
  id: string
  fullName: string
  company: string | null
  alignment: number | null
  perfil: string | null
  criticalGapsCount: number
  status: 'ready' | 'waiting_self' | 'waiting_exec' | 'waiting_both'
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminRelatoriosPage() {
  const supabase = await createClient()

  // Fetch all alunos (role = 'aluno')
  const { data: alunos } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('role', 'aluno')
    .order('full_name')

  if (!alunos || alunos.length === 0) {
    return (
      <div className="space-y-8">
        <HeroSection />
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-[#64748B]">Nenhum aluno cadastrado.</p>
        </div>
      </div>
    )
  }

  // Fetch all relationships for company names
  const { data: relationships } = await supabase
    .from('gestor_aluno_relationships')
    .select('aluno_user_id, company_name')

  const companyMap = new Map<string, string>()
  if (relationships) {
    for (const r of relationships) {
      companyMap.set(r.aluno_user_id, r.company_name)
    }
  }

  // Fetch all self assessments (latest per user)
  const { data: selfAssessments } = await supabase
    .from('leadership_self_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  const selfMap = new Map<string, Record<string, unknown>>()
  if (selfAssessments) {
    for (const sa of selfAssessments) {
      if (!selfMap.has(sa.user_id)) {
        selfMap.set(sa.user_id, sa as Record<string, unknown>)
      }
    }
  }

  // Fetch all exec assessments (latest per user)
  const { data: execAssessments } = await supabase
    .from('leadership_executive_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  const execMap = new Map<string, Record<string, unknown>>()
  if (execAssessments) {
    for (const ea of execAssessments) {
      if (!execMap.has(ea.user_id)) {
        execMap.set(ea.user_id, ea as Record<string, unknown>)
      }
    }
  }

  // Build PDI data per aluno
  const alunosWithPDI: AlunoWithPDI[] = alunos.map((aluno) => {
    const hasSelf = selfMap.has(aluno.id)
    const hasExec = execMap.has(aluno.id)
    const status = getPDIStatus(aluno.id, hasSelf, hasExec)
    const company = companyMap.get(aluno.id) ?? null

    let alignment: number | null = null
    let perfil: string | null = null
    let criticalGapsCount = 0

    if (status === 'ready') {
      const report = generatePDI(
        aluno.id,
        aluno.full_name ?? '',
        company,
        selfMap.get(aluno.id)!,
        execMap.get(aluno.id)!,
      )
      alignment = report.overallAlignment
      perfil = report.selfAssessment.perfil
      criticalGapsCount = report.criticalGaps.length
    } else if (hasSelf) {
      const sa = selfMap.get(aluno.id) as { perfil?: string }
      perfil = sa?.perfil ?? null
    }

    return {
      id: aluno.id,
      fullName: aluno.full_name ?? 'Sem nome',
      company,
      alignment,
      perfil,
      criticalGapsCount,
      status,
    }
  })

  // KPIs
  const totalReady = alunosWithPDI.filter((a) => a.status === 'ready').length
  const readyAlunos = alunosWithPDI.filter((a) => a.alignment !== null)
  const avgAlignment =
    readyAlunos.length > 0
      ? Math.round(readyAlunos.reduce((s, a) => s + (a.alignment ?? 0), 0) / readyAlunos.length)
      : 0
  const totalCriticalGaps = alunosWithPDI.reduce((s, a) => s + a.criticalGapsCount, 0)
  const totalWaiting = alunosWithPDI.filter((a) => a.status !== 'ready' && a.status !== 'waiting_both').length

  // Group by company
  const byCompany = new Map<string, AlunoWithPDI[]>()
  for (const a of alunosWithPDI) {
    const key = a.company || 'Sem empresa vinculada'
    if (!byCompany.has(key)) byCompany.set(key, [])
    byCompany.get(key)!.push(a)
  }

  return (
    <div className="space-y-8">
      <HeroSection />

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={FileBarChart}
          label="PDIs Gerados"
          value={totalReady}
          color="#1565C0"
        />
        <KPICard
          icon={TrendingUp}
          label="Alinhamento Medio"
          value={`${avgAlignment}%`}
          color="#00695C"
        />
        <KPICard
          icon={AlertTriangle}
          label="Gaps Criticos"
          value={totalCriticalGaps}
          color="#DC2626"
        />
        <KPICard
          icon={Target}
          label="Aguardando Dados"
          value={totalWaiting}
          color="#F57C00"
        />
      </section>

      {/* Per-company sections */}
      {Array.from(byCompany.entries()).map(([companyName, companyAlunos]) => (
        <section key={companyName} className="space-y-4">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-[#0F172A]">
            <Building2 className="h-4.5 w-4.5 text-[#1565C0]" />
            {companyName}
            <span className="text-sm font-semibold text-[#64748B]">
              ({companyAlunos.length} aluno{companyAlunos.length !== 1 ? 's' : ''})
            </span>
          </h2>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {companyAlunos.map((aluno) => (
              <AlunoCard key={aluno.id} aluno={aluno} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
          Central de desenvolvimento
        </p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
          Relatorios PDI
        </h1>
        <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
          Indicadores de desenvolvimento individual. PDIs gerados automaticamente
          a partir da comparacao entre Autoavaliacao e Avaliacao Executiva.
        </p>
      </div>
    </section>
  )
}

function KPICard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users
  label: string
  value: string | number
  color: string
}) {
  return (
    <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
      <div
        className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-4.5 w-4.5" style={{ color }} />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{value}</p>
    </article>
  )
}

const PERFIL_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  reativo: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reativo' },
  transicao: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Em Transicao' },
  lider_valor: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Lider de Valor' },
}

function AlunoCard({ aluno }: { aluno: AlunoWithPDI }) {
  const perfilBadge = aluno.perfil ? PERFIL_BADGES[aluno.perfil] : null

  return (
    <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFD] text-sm font-extrabold text-[#1565C0]">
            {aluno.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">{aluno.fullName}</p>
            {aluno.company && (
              <p className="text-xs text-[#64748B]">{aluno.company}</p>
            )}
          </div>
        </div>

        {perfilBadge && (
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${perfilBadge.bg} ${perfilBadge.text}`}>
            {perfilBadge.label}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        {aluno.status === 'ready' ? (
          <>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-[#1565C0]" />
              <span className="text-xs font-semibold text-[#111827]">{aluno.alignment}%</span>
              <span className="text-[11px] text-[#64748B]">alinhamento</span>
            </div>
            {aluno.criticalGapsCount > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold text-red-600">
                  {aluno.criticalGapsCount} gap{aluno.criticalGapsCount !== 1 ? 's' : ''} critico{aluno.criticalGapsCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </>
        ) : (
          <StatusBadge status={aluno.status} />
        )}
      </div>

      <div className="mt-4">
        {aluno.status === 'ready' ? (
          <Link
            href={`/admin/relatorios/pdi/${aluno.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            <FileBarChart className="h-3.5 w-3.5" />
            Ver PDI Completo
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#94A3B8]">
            PDI indisponivel
          </span>
        )}
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
    waiting_self: { icon: ClipboardCheck, color: '#F57C00', label: 'Aguardando autoavaliacao' },
    waiting_exec: { icon: FileBarChart, color: '#7B1FA2', label: 'Aguardando avaliacao executiva' },
    waiting_both: { icon: AlertTriangle, color: '#94A3B8', label: 'Nenhuma avaliacao' },
  }

  const config = configs[status] ?? configs.waiting_both
  const Icon = config.icon

  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
      <span className="text-xs font-semibold" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  )
}

