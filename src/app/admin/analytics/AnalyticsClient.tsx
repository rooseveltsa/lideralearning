'use client'

import { useState } from 'react'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Eye,
  GraduationCap,
  TrendingUp,
  Users,
  AlertTriangle,
} from 'lucide-react'

// ── Types ──

type KPIs = {
  totalUsers: number
  activeStudents: number
  overallCompletionRate: number
  avgScore: number
  totalCertificates: number
}

type SignupDay = { date: string; count: number }
type FunnelStep = { label: string; count: number }
type CourseCompletion = { courseId: string; title: string; rate: number; enrolled: number }
type ProgressBuckets = { '0-25': number; '25-50': number; '50-75': number; '75-100': number }
type LessonCompletion = { id: string; title: string; completions: number }
type StudentAtRisk = { enrollmentId: string; userId: string; courseTitle: string; daysSinceActivity: number }
type DimAverage = { key: string; label: string; avg: number }
type ScoreBucket = { bucket: string; count: number }
type CompanyBreakdown = { company: string; count: number; avgScore: number }
type TrainingStat = {
  id: string
  title: string
  dateStart: string
  dateEnd: string
  location: string | null
  maxParticipants: number
  status: string
  company: string | null
  totalParticipants: number
  attendanceRate: number
  statusCounts: Record<string, number>
}

type Props = {
  kpis: KPIs
  signupTrend: SignupDay[]
  funnel: FunnelStep[]
  courseCompletionRates: CourseCompletion[]
  progressBuckets: ProgressBuckets
  lessonCompletionList: LessonCompletion[]
  studentsAtRisk: StudentAtRisk[]
  perfilDistribution: Record<string, number>
  selfDimAverages: DimAverage[]
  scoreHistogram: ScoreBucket[]
  execDimAverages: DimAverage[]
  execCompanyBreakdown: CompanyBreakdown[]
  pdiPhaseDistribution: Record<string, number>
  pdiDimAverages: DimAverage[]
  strongestDim: DimAverage | null
  weakestDim: DimAverage | null
  trainingStats: TrainingStat[]
  upcomingTurmas: TrainingStat[]
  globalParticipantStatus: Record<string, number>
  totalSelfAssessments: number
  totalExecAssessments: number
  totalPDIs: number
}

// ── Design tokens ──

const BLUE = '#1565C0'
const ORANGE = '#F57C00'
const GREEN = '#4CAF35'
const RED = '#E53935'
const PURPLE = '#7C3AED'
const SLATE = '#64748B'
const DARK = '#0F172A'
const LIGHT_BG = '#F8FAFD'
const BORDER = '#E5ECF6'
const MUTED = '#94A3B8'

const PERFIL_COLORS: Record<string, { bg: string; fill: string }> = {
  reativo: { bg: '#FEF2F2', fill: RED },
  transicao: { bg: '#FFF7ED', fill: ORANGE },
  lider_valor: { bg: '#F0FDF4', fill: GREEN },
}
const PERFIL_LABELS: Record<string, string> = {
  reativo: 'Reativo',
  transicao: 'Transicao',
  lider_valor: 'Lider de Valor',
}

const PHASE_LABELS: Record<string, string> = {
  '1': 'Fase 1 - Fundacao',
  '2': 'Fase 2 - Construcao',
  '3': 'Fase 3 - Consolidacao',
  'null': 'Nao informado',
}

const STATUS_LABELS: Record<string, string> = {
  registered: 'Registrado',
  confirmed: 'Confirmado',
  attended: 'Presente',
  no_show: 'Ausente',
}

const STATUS_COLORS: Record<string, string> = {
  registered: BLUE,
  confirmed: ORANGE,
  attended: GREEN,
  no_show: RED,
}

const TRAINING_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendada',
  in_progress: 'Em andamento',
  completed: 'Concluida',
  cancelled: 'Cancelada',
}

const TRAINING_STATUS_COLORS: Record<string, string> = {
  scheduled: BLUE,
  in_progress: ORANGE,
  completed: GREEN,
  cancelled: RED,
}

// ── Tabs ──

const TABS = [
  { id: 'overview', label: 'Visao Geral', icon: Eye },
  { id: 'learning', label: 'Aprendizagem', icon: BookOpen },
  { id: 'assessments', label: 'Avaliacoes', icon: ClipboardCheck },
  { id: 'presential', label: 'Presencial', icon: CalendarDays },
] as const

type TabId = (typeof TABS)[number]['id']

// ── Component ──

export default function AnalyticsClient(props: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-lg font-bold text-[#0F172A]">
          <BarChart3 className="h-5 w-5" style={{ color: BLUE }} />
          Analytics
        </h1>
        <p className="mt-0.5 text-[13px] text-[#94A3B8]">
          Dados consolidados da plataforma Lidera Treinamentos
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#E5ECF6] bg-white p-1 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#1565C0] text-white shadow-sm'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab {...props} />}
      {activeTab === 'learning' && <LearningTab {...props} />}
      {activeTab === 'assessments' && <AssessmentsTab {...props} />}
      {activeTab === 'presential' && <PresentialTab {...props} />}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// TAB 1: VISAO GERAL
// ══════════════════════════════════════════════════════

function OverviewTab({ kpis, signupTrend, funnel }: Props) {
  const maxSignup = Math.max(...signupTrend.map((d) => d.count), 1)
  const funnelMax = funnel[0]?.count || 1

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard icon={Users} color={BLUE} value={kpis.totalUsers} label="Total Usuarios" />
        <KPICard icon={GraduationCap} color={PURPLE} value={kpis.activeStudents} label="Alunos Ativos" />
        <KPICard icon={TrendingUp} color={GREEN} value={`${kpis.overallCompletionRate}%`} label="Taxa Conclusao" />
        <KPICard icon={BarChart3} color={ORANGE} value={kpis.avgScore} label="Media Pontuacao" />
        <KPICard icon={ClipboardCheck} color={RED} value={kpis.totalCertificates} label="Certificados" />
      </div>

      {/* Signup trend */}
      <Card title="Tendencia de Cadastros" subtitle="Ultimos 30 dias">
        {signupTrend.every((d) => d.count === 0) ? (
          <EmptyState text="Nenhum cadastro nos ultimos 30 dias." />
        ) : (
          <div className="flex items-end gap-[2px]" style={{ height: 140 }}>
            {signupTrend.map((day) => {
              const height = day.count > 0 ? Math.max((day.count / maxSignup) * 120, 4) : 2
              const dayLabel = day.date.slice(8, 10)
              return (
                <div key={day.date} className="group relative flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t transition-all hover:opacity-80"
                    style={{
                      height,
                      backgroundColor: day.count > 0 ? BLUE : '#E2E8F0',
                      minWidth: 4,
                    }}
                  />
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#0F172A] px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {day.count}
                  </div>
                  {/* Day label every 5th */}
                  {parseInt(dayLabel) % 5 === 0 && (
                    <span className="mt-1 text-[9px] text-[#94A3B8]">{dayLabel}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* User funnel */}
      <Card title="Funil de Usuarios" subtitle="Jornada do cadastro ao certificado">
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const pct = funnelMax > 0 ? Math.round((step.count / funnelMax) * 100) : 0
            const width = Math.max(pct, step.count > 0 ? 8 : 2)
            const conversionFromPrev = i > 0 && funnel[i - 1].count > 0
              ? Math.round((step.count / funnel[i - 1].count) * 100)
              : null
            return (
              <div key={step.label} className="flex items-center gap-3">
                <span className="w-28 text-right text-[12px] font-medium text-[#334155]">
                  {step.label}
                </span>
                <div className="flex-1">
                  <div className="relative h-8 w-full overflow-hidden rounded-lg bg-[#F1F5F9]">
                    <div
                      className="flex h-full items-center rounded-lg px-3 text-[11px] font-bold text-white transition-all"
                      style={{
                        width: `${width}%`,
                        backgroundColor: BLUE,
                        opacity: 1 - i * 0.15,
                      }}
                    >
                      {step.count}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-[12px] font-bold" style={{ color: BLUE }}>{pct}%</span>
                  {conversionFromPrev !== null && (
                    <span className="ml-1 text-[10px] text-[#94A3B8]">({conversionFromPrev}%)</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-[10px] text-[#94A3B8]">
          Percentual do total | (conversao do passo anterior)
        </p>
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// TAB 2: APRENDIZAGEM
// ══════════════════════════════════════════════════════

function LearningTab({
  courseCompletionRates,
  progressBuckets,
  lessonCompletionList,
  studentsAtRisk,
}: Props) {
  const bucketEntries: [string, number][] = [
    ['0-25%', progressBuckets['0-25']],
    ['25-50%', progressBuckets['25-50']],
    ['50-75%', progressBuckets['50-75']],
    ['75-100%', progressBuckets['75-100']],
  ]
  const bucketMax = Math.max(...bucketEntries.map((b) => b[1]), 1)
  const bucketColors = [RED, ORANGE, BLUE, GREEN]

  const topLessons = lessonCompletionList.slice(0, 5)
  const bottomLessons = [...lessonCompletionList].sort((a, b) => a.completions - b.completions).slice(0, 5)
  const lessonMax = Math.max(...lessonCompletionList.map((l) => l.completions), 1)

  return (
    <div className="space-y-6">
      {/* Course completion rates */}
      <Card title="Taxa de Conclusao por Curso" subtitle="Media de progresso dos alunos matriculados">
        {courseCompletionRates.length === 0 ? (
          <EmptyState text="Nenhum curso com matriculas." />
        ) : (
          <div className="space-y-3">
            {courseCompletionRates.map((course) => (
              <div key={course.courseId}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#334155] truncate max-w-[60%]">
                    {course.title}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">{course.enrolled} alunos</span>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-lg bg-[#F1F5F9]">
                  <div
                    className="flex h-full items-center rounded-lg px-2 text-[11px] font-bold text-white transition-all"
                    style={{
                      width: `${Math.max(course.rate, course.rate > 0 ? 8 : 0)}%`,
                      backgroundColor: course.rate >= 75 ? GREEN : course.rate >= 40 ? ORANGE : RED,
                    }}
                  >
                    {course.rate > 0 && `${course.rate}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Progress distribution */}
      <Card title="Distribuicao de Progresso" subtitle="Quantidade de alunos por faixa de conclusao">
        <div className="flex items-end gap-6 justify-center" style={{ height: 160 }}>
          {bucketEntries.map(([label, count], i) => {
            const height = count > 0 ? Math.max((count / bucketMax) * 130, 8) : 4
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-[12px] font-bold" style={{ color: bucketColors[i] }}>
                  {count}
                </span>
                <div
                  className="w-14 rounded-t-lg transition-all"
                  style={{ height, backgroundColor: bucketColors[i] }}
                />
                <span className="text-[10px] font-medium text-[#64748B]">{label}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Most / Least completed lessons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Aulas Mais Concluidas" subtitle="Top 5">
          {topLessons.length === 0 ? (
            <EmptyState text="Nenhuma aula concluida." />
          ) : (
            <div className="space-y-2">
              {topLessons.map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <span className="flex-1 truncate text-[12px] text-[#334155]">{l.title}</span>
                  <div className="w-24">
                    <div className="h-4 w-full overflow-hidden rounded bg-[#F1F5F9]">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.max((l.completions / lessonMax) * 100, 8)}%`,
                          backgroundColor: GREEN,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-[11px] font-bold text-[#334155]">
                    {l.completions}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Aulas Menos Concluidas" subtitle="Bottom 5">
          {bottomLessons.length === 0 ? (
            <EmptyState text="Nenhuma aula disponivel." />
          ) : (
            <div className="space-y-2">
              {bottomLessons.map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <span className="flex-1 truncate text-[12px] text-[#334155]">{l.title}</span>
                  <div className="w-24">
                    <div className="h-4 w-full overflow-hidden rounded bg-[#F1F5F9]">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${l.completions > 0 ? Math.max((l.completions / lessonMax) * 100, 8) : 0}%`,
                          backgroundColor: RED,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-[11px] font-bold text-[#334155]">
                    {l.completions}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Students at risk */}
      <Card
        title="Alunos em Risco"
        subtitle="Matriculados com 0% de progresso ha 7+ dias"
        icon={<AlertTriangle className="h-4 w-4" style={{ color: RED }} />}
      >
        {studentsAtRisk.length === 0 ? (
          <EmptyState text="Nenhum aluno em risco no momento." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  <th className="px-3 py-2 text-left font-semibold text-[#64748B]">ID Aluno</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#64748B]">Curso</th>
                  <th className="px-3 py-2 text-right font-semibold text-[#64748B]">Dias Inativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {studentsAtRisk.slice(0, 10).map((s) => (
                  <tr key={s.enrollmentId} className="hover:bg-[#F8FAFD]">
                    <td className="px-3 py-2 font-mono text-[11px] text-[#64748B]">
                      {s.userId.slice(0, 8)}...
                    </td>
                    <td className="px-3 py-2 text-[#334155]">{s.courseTitle}</td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: s.daysSinceActivity > 14 ? '#FEF2F2' : '#FFF7ED',
                          color: s.daysSinceActivity > 14 ? RED : ORANGE,
                        }}
                      >
                        {s.daysSinceActivity}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {studentsAtRisk.length > 10 && (
              <p className="mt-2 text-center text-[11px] text-[#94A3B8]">
                +{studentsAtRisk.length - 10} alunos adicionais
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// TAB 3: AVALIACOES
// ══════════════════════════════════════════════════════

function AssessmentsTab({
  perfilDistribution,
  selfDimAverages,
  scoreHistogram,
  execDimAverages,
  execCompanyBreakdown,
  pdiPhaseDistribution,
  pdiDimAverages,
  strongestDim,
  weakestDim,
  totalSelfAssessments,
  totalExecAssessments,
  totalPDIs,
}: Props) {
  const totalPerfil = Object.values(perfilDistribution).reduce((a, b) => a + b, 0) || 1
  const histogramMax = Math.max(...scoreHistogram.map((b) => b.count), 1)
  const totalPdiPhases = Object.values(pdiPhaseDistribution).reduce((a, b) => a + b, 0) || 1
  const gapValue = strongestDim && weakestDim
    ? Math.round((strongestDim.avg - weakestDim.avg) * 100) / 100
    : 0

  return (
    <div className="space-y-6">
      {/* Assessment summary KPIs */}
      <div className="grid gap-3 sm:grid-cols-3">
        <KPICard icon={ClipboardCheck} color={ORANGE} value={totalSelfAssessments} label="Autoavaliacoes" />
        <KPICard icon={BarChart3} color={PURPLE} value={totalExecAssessments} label="Av. Executivas" />
        <KPICard icon={TrendingUp} color={GREEN} value={totalPDIs} label="PDIs Gerados" />
      </div>

      {/* Autoavaliacao section */}
      <div className="rounded-xl border-2 border-[#E5ECF6] bg-white p-4">
        <h3 className="mb-4 text-[13px] font-bold text-[#0F172A]">Autoavaliacao</h3>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Perfil distribution (CSS pie) */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              Distribuicao por Perfil
            </p>
            <div className="flex items-center gap-6">
              {/* CSS pie chart */}
              <div className="relative h-28 w-28 shrink-0">
                <CSSPieChart
                  segments={Object.entries(perfilDistribution).map(([key, count]) => ({
                    label: PERFIL_LABELS[key] ?? key,
                    value: count,
                    color: PERFIL_COLORS[key]?.fill ?? SLATE,
                  }))}
                  total={totalPerfil}
                />
              </div>
              <div className="space-y-2">
                {Object.entries(perfilDistribution).map(([key, count]) => {
                  const pct = Math.round((count / totalPerfil) * 100)
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: PERFIL_COLORS[key]?.fill ?? SLATE }}
                      />
                      <span className="text-[12px] text-[#334155]">
                        {PERFIL_LABELS[key] ?? key}
                      </span>
                      <span className="text-[11px] font-bold text-[#64748B]">
                        {count} ({pct}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Dimension radar (horizontal bars) */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              Media por Dimensao (escala 1-3)
            </p>
            <div className="space-y-2">
              {selfDimAverages.map((dim) => (
                <HBar
                  key={dim.key}
                  label={dim.label}
                  value={dim.avg}
                  max={3}
                  color={dim.avg < 1.5 ? RED : dim.avg <= 2.2 ? ORANGE : GREEN}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Score histogram */}
        {scoreHistogram.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              Histograma de Pontuacao Total
            </p>
            <div className="flex items-end gap-3 justify-center" style={{ height: 120 }}>
              {scoreHistogram.map((bucket) => {
                const height = Math.max((bucket.count / histogramMax) * 100, 6)
                return (
                  <div key={bucket.bucket} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-[#334155]">{bucket.count}</span>
                    <div
                      className="w-10 rounded-t-lg"
                      style={{ height, backgroundColor: BLUE }}
                    />
                    <span className="text-[9px] text-[#94A3B8]">{bucket.bucket}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Executive assessment section */}
      <div className="rounded-xl border-2 border-[#E5ECF6] bg-white p-4">
        <h3 className="mb-4 text-[13px] font-bold text-[#0F172A]">Avaliacao Executiva</h3>

        {totalExecAssessments === 0 ? (
          <EmptyState text="Nenhuma avaliacao executiva preenchida." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Dimension averages */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                Media por Dimensao (escala 1-5)
              </p>
              <div className="space-y-1.5">
                {execDimAverages.map((dim) => (
                  <HBar
                    key={dim.key}
                    label={dim.label}
                    value={dim.avg}
                    max={5}
                    color={dim.avg < 2.5 ? RED : dim.avg <= 3.5 ? ORANGE : GREEN}
                    labelWidth="w-40"
                  />
                ))}
              </div>
            </div>

            {/* Company breakdown */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                Por Empresa
              </p>
              {execCompanyBreakdown.length === 0 ? (
                <EmptyState text="Sem dados por empresa." />
              ) : (
                <div className="space-y-2">
                  {execCompanyBreakdown.slice(0, 8).map((c) => (
                    <div key={c.company} className="flex items-center justify-between rounded-lg border border-[#F1F5F9] px-3 py-2">
                      <span className="text-[12px] font-medium text-[#334155] truncate max-w-[50%]">
                        {c.company}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#94A3B8]">{c.count} av.</span>
                        <span className="text-[12px] font-bold" style={{ color: c.avgScore >= 3.5 ? GREEN : c.avgScore >= 2.5 ? ORANGE : RED }}>
                          {c.avgScore}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDI section */}
      <div className="rounded-xl border-2 border-[#E5ECF6] bg-white p-4">
        <h3 className="mb-4 text-[13px] font-bold text-[#0F172A]">PDI - Plano de Desenvolvimento</h3>

        {totalPDIs === 0 ? (
          <EmptyState text="Nenhum PDI gerado." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Phase distribution */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                Distribuicao por Fase
              </p>
              <div className="space-y-2">
                {Object.entries(pdiPhaseDistribution).map(([phase, count]) => {
                  const pct = Math.round((count / totalPdiPhases) * 100)
                  const phaseColors = [GREEN, BLUE, PURPLE, MUTED]
                  const idx = phase === '1' ? 0 : phase === '2' ? 1 : phase === '3' ? 2 : 3
                  return (
                    <div key={phase} className="flex items-center gap-3">
                      <span className="w-32 text-[12px] font-medium text-[#334155]">
                        {PHASE_LABELS[phase] ?? phase}
                      </span>
                      <div className="flex-1">
                        <div className="h-5 w-full overflow-hidden rounded bg-[#F1F5F9]">
                          <div
                            className="flex h-full items-center rounded px-2 text-[10px] font-bold text-white"
                            style={{
                              width: `${Math.max(pct, count > 0 ? 12 : 0)}%`,
                              backgroundColor: phaseColors[idx],
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

            {/* PDI dimension averages */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                Media por Dimensao (escala 1-5)
              </p>
              <div className="space-y-2">
                {pdiDimAverages.map((dim) => (
                  <HBar
                    key={dim.key}
                    label={dim.label}
                    value={dim.avg}
                    max={5}
                    color={dim.avg < 2.5 ? RED : dim.avg <= 3.5 ? ORANGE : GREEN}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gap analysis */}
      {strongestDim && weakestDim && totalSelfAssessments > 0 && (
        <Card title="Analise de Gaps" subtitle="Comparacao entre dimensoes mais forte e mais fraca (autoavaliacao)">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[#F1F5F9] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">Mais forte</p>
              <p className="mt-1 text-[13px] font-bold text-[#0F172A]">{strongestDim.label}</p>
              <p className="text-[12px] font-bold" style={{ color: GREEN }}>
                {strongestDim.avg.toFixed(2)} / 3
              </p>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">Mais fraca</p>
              <p className="mt-1 text-[13px] font-bold text-[#0F172A]">{weakestDim.label}</p>
              <p className="text-[12px] font-bold" style={{ color: RED }}>
                {weakestDim.avg.toFixed(2)} / 3
              </p>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">Gap critico</p>
              <p className="mt-1 text-[13px] font-bold text-[#0F172A]">
                {strongestDim.label} vs {weakestDim.label}
              </p>
              <p className="text-[12px] font-bold" style={{ color: ORANGE }}>
                {gapValue.toFixed(2)} pontos
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// TAB 4: PRESENCIAL
// ══════════════════════════════════════════════════════

function PresentialTab({
  trainingStats,
  upcomingTurmas,
  globalParticipantStatus,
}: Props) {
  const totalParticipants = Object.values(globalParticipantStatus).reduce((a, b) => a + b, 0) || 1
  // "Agora" capturado uma única vez (evita chamar Date.now() durante o render).
  const [nowMs] = useState(() => Date.now())

  return (
    <div className="space-y-6">
      {/* Turma completion rates */}
      <Card title="Taxa de Presenca por Turma" subtitle="Percentual de participantes presentes">
        {trainingStats.length === 0 ? (
          <EmptyState text="Nenhuma turma cadastrada." />
        ) : (
          <div className="space-y-3">
            {trainingStats.map((t) => (
              <div key={t.id}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#334155] truncate max-w-[200px]">
                      {t.title}
                    </span>
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                      style={{
                        backgroundColor: (TRAINING_STATUS_COLORS[t.status] ?? SLATE) + '18',
                        color: TRAINING_STATUS_COLORS[t.status] ?? SLATE,
                      }}
                    >
                      {TRAINING_STATUS_LABELS[t.status] ?? t.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    {t.totalParticipants}/{t.maxParticipants} participantes
                  </span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-lg bg-[#F1F5F9]">
                  <div
                    className="flex h-full items-center rounded-lg px-2 text-[10px] font-bold text-white transition-all"
                    style={{
                      width: `${Math.max(t.attendanceRate, t.attendanceRate > 0 ? 8 : 0)}%`,
                      backgroundColor: t.attendanceRate >= 75 ? GREEN : t.attendanceRate >= 50 ? ORANGE : RED,
                    }}
                  >
                    {t.attendanceRate > 0 && `${t.attendanceRate}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Participant status distribution */}
      <Card title="Status dos Participantes" subtitle="Distribuicao global de todos os participantes">
        <div className="flex items-end gap-6 justify-center" style={{ height: 160 }}>
          {Object.entries(globalParticipantStatus).map(([status, count]) => {
            const maxCount = Math.max(...Object.values(globalParticipantStatus), 1)
            const height = count > 0 ? Math.max((count / maxCount) * 130, 8) : 4
            return (
              <div key={status} className="flex flex-col items-center gap-1">
                <span className="text-[12px] font-bold" style={{ color: STATUS_COLORS[status] ?? SLATE }}>
                  {count}
                </span>
                <div
                  className="w-16 rounded-t-lg transition-all"
                  style={{ height, backgroundColor: STATUS_COLORS[status] ?? SLATE }}
                />
                <span className="text-[10px] font-medium text-[#64748B]">
                  {STATUS_LABELS[status] ?? status}
                </span>
                <span className="text-[9px] text-[#94A3B8]">
                  {Math.round((count / totalParticipants) * 100)}%
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Upcoming turmas */}
      <Card
        title="Proximas Turmas"
        subtitle="Agendadas e em andamento"
        icon={<CalendarDays className="h-4 w-4" style={{ color: BLUE }} />}
      >
        {upcomingTurmas.length === 0 ? (
          <EmptyState text="Nenhuma turma futura agendada." />
        ) : (
          <div className="space-y-2">
            {upcomingTurmas.map((t) => {
              const startDate = new Date(t.dateStart)
              const endDate = new Date(t.dateEnd)
              const fmtDate = (d: Date) =>
                d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
              const daysUntil = Math.ceil((startDate.getTime() - nowMs) / (1000 * 60 * 60 * 24))

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-[#F1F5F9] px-4 py-3 hover:bg-[#F8FAFD]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#0F172A] truncate">
                        {t.title}
                      </span>
                      {t.company && (
                        <span className="text-[10px] text-[#94A3B8]">({t.company})</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span>{fmtDate(startDate)} - {fmtDate(endDate)}</span>
                      {t.location && <span>| {t.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-[#94A3B8]">
                      {t.totalParticipants}/{t.maxParticipants}
                    </span>
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: daysUntil <= 3 ? '#FEF2F2' : daysUntil <= 7 ? '#FFF7ED' : '#F0FDF4',
                        color: daysUntil <= 3 ? RED : daysUntil <= 7 ? ORANGE : GREEN,
                      }}
                    >
                      {daysUntil <= 0 ? 'Hoje' : `${daysUntil}d`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════

function KPICard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  value: number | string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E5ECF6] bg-white px-4 py-3 shadow-sm">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: color + '14' }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-[#0F172A]">{value}</p>
        <p className="text-[11px] text-[#94A3B8]">{label}</p>
      </div>
    </div>
  )
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#E5ECF6] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-[13px] font-bold text-[#0F172A]">{title}</h3>
          {subtitle && <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <p className="text-[13px] text-[#94A3B8]">{text}</p>
    </div>
  )
}

function HBar({
  label,
  value,
  max,
  color,
  labelWidth = 'w-32',
}: {
  label: string
  value: number
  max: number
  color: string
  labelWidth?: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className={`${labelWidth} shrink-0 truncate text-[11px] font-medium text-[#334155]`}>
        {label}
      </span>
      <div className="flex-1">
        <div className="h-4 w-full overflow-hidden rounded bg-[#F1F5F9]">
          <div
            className="flex h-full items-center rounded px-1.5 text-[9px] font-bold text-white"
            style={{
              width: `${Math.max(pct, value > 0 ? 12 : 0)}%`,
              backgroundColor: color,
              minWidth: value > 0 ? '1.5rem' : '0',
            }}
          >
            {value > 0 && value.toFixed(1)}
          </div>
        </div>
      </div>
      <span className="w-8 text-right text-[11px] font-bold" style={{ color }}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}

function CSSPieChart({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[]
  total: number
}) {
  // Build conic gradient
  let cumulative = 0
  const stops: string[] = []
  for (const seg of segments) {
    const pct = (seg.value / total) * 100
    stops.push(`${seg.color} ${cumulative}% ${cumulative + pct}%`)
    cumulative += pct
  }
  // Fill remainder with light gray if any
  if (cumulative < 100) {
    stops.push(`#E2E8F0 ${cumulative}% 100%`)
  }

  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        background: `conic-gradient(${stops.join(', ')})`,
      }}
    >
      {/* Inner circle for donut effect */}
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
          <span className="text-[14px] font-bold text-[#0F172A]">{total}</span>
        </div>
      </div>
    </div>
  )
}
