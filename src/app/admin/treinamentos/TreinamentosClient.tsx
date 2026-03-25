'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  MapPin,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react'

import ConteudoStudio from '@/app/admin/conteudo/ConteudoStudio'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TrainingRow = {
  id: string
  title: string
  training_date_start: string
  training_date_end: string
  location: string | null
  status: string
  max_participants: number
  company_name: string | null
  created_at: string
}

type MentoringRow = {
  id: string
  aluno_user_id: string
  session_type: string
  scheduled_date: string | null
  completed_date: string | null
  status: string
  notes: string | null
  mentor_name: string | null
}

type CourseRow = {
  id: string
  title: string
  is_published: boolean
  created_at: string
  thumbnail_url: string | null
}

type ModuleRow = {
  id: string
  course_id: string
  title: string
  order_index: number
}

type EnrollmentRow = {
  id: string
  user_id: string
  course_id: string
  status: string
  created_at: string
}

type Props = {
  trainings: TrainingRow[]
  mentorings: MentoringRow[]
  courses: CourseRow[]
  modules: ModuleRow[]
  enrollments: EnrollmentRow[]
  participantCounts: Record<string, number>
  profileMap: Record<string, string>
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { key: 'turmas', label: 'Turmas' },
  { key: 'mentorias', label: 'Mentorias' },
  { key: 'programa', label: 'Programa' },
  { key: 'cursos', label: 'Cursos' },
] as const

type TabKey = (typeof TABS)[number]['key']

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Agendada', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: {
    label: 'Em andamento',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  completed: {
    label: 'Concluida',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  cancelled: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

const MENTORING_TYPE_LABELS: Record<string, string> = {
  '30_days': '30 dias',
  '60_days': '60 dias',
  extra: 'Extra',
}

const MENTORING_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  no_show: 'bg-rose-50 text-rose-700 border-rose-200',
}

const MENTORING_STATUS_LABELS: Record<string, string> = {
  completed: 'Concluida',
  scheduled: 'Agendada',
  cancelled: 'Cancelada',
  no_show: 'Ausente',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('pt-BR') : '--'
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const opts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
  const startStr = s.toLocaleDateString('pt-BR', opts)
  const endStr = e.toLocaleDateString('pt-BR', opts)
  if (startStr === endStr) return startStr
  return `${s.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${endStr}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TreinamentosClient({
  trainings,
  mentorings,
  courses,
  modules,
  enrollments,
  participantCounts,
  profileMap,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('turmas')

  // Derived data for courses tab
  const modulesByCoursue = modules.reduce<Record<string, ModuleRow[]>>((acc, m) => {
    ;(acc[m.course_id] ??= []).push(m)
    return acc
  }, {})

  const enrollmentsByCourse = enrollments.reduce<Record<string, number>>((acc, e) => {
    acc[e.course_id] = (acc[e.course_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Tab Bar */}
      <div className="border-b border-[#E5ECF6]">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap pb-3 text-[13px] font-bold transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#1565C0] text-[#1565C0]'
                  : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-5">
        {/* ── Tab: Turmas ─────────────────────────────────── */}
        {activeTab === 'turmas' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-extrabold text-[#0F172A]">
                Turmas Presenciais
              </h3>
              <Link
                href="/admin/turmas/nova"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F57C00] px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#E65100]"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Turma
              </Link>
            </div>

            {trainings.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
                <GraduationCap className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-extrabold text-[#111827]">
                  Nenhuma turma cadastrada
                </h3>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  Crie sua primeira turma presencial para comecar.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Titulo
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Local
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Participantes
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Acoes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {trainings.map((t) => {
                        const statusCfg =
                          STATUS_CONFIG[t.status] ?? STATUS_CONFIG.scheduled
                        const count = participantCounts[t.id] ?? 0
                        const pct =
                          t.max_participants > 0
                            ? Math.round((count / t.max_participants) * 100)
                            : 0

                        return (
                          <tr
                            key={t.id}
                            className="h-[44px] transition-colors hover:bg-[#F9FBFE]"
                          >
                            <td className="px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#0F172A]">
                                  {t.title}
                                </span>
                                {t.company_name && (
                                  <span className="rounded-full border border-[#D8E2EF] bg-[#F7FAFE] px-2 py-0.5 text-[10px] font-bold text-[#334155]">
                                    {t.company_name}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 text-[13px] text-[#64748B]">
                              <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-[#1565C0]" />
                                {formatDateRange(
                                  t.training_date_start,
                                  t.training_date_end
                                )}
                              </div>
                            </td>
                            <td className="px-4 text-[13px] text-[#64748B]">
                              {t.location ? (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-[#1565C0]" />
                                  {t.location}
                                </div>
                              ) : (
                                '--'
                              )}
                            </td>
                            <td className="px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E5ECF6]">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      pct >= 90
                                        ? 'bg-rose-500'
                                        : pct >= 70
                                          ? 'bg-amber-500'
                                          : 'bg-[#1E88E5]'
                                    }`}
                                    style={{
                                      width: `${Math.min(pct, 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] text-[#64748B]">
                                  {count}/{t.max_participants}
                                </span>
                              </div>
                            </td>
                            <td className="px-4">
                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}
                              >
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="px-4 text-right">
                              <Link
                                href={`/admin/turmas/${t.id}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E88E5] hover:underline"
                              >
                                Ver <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Mentorias ──────────────────────────────── */}
        {activeTab === 'mentorias' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-extrabold text-[#0F172A]">
                Sessoes de Mentoria
              </h3>
            </div>

            {mentorings.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
                <MessageSquare className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-extrabold text-[#111827]">
                  Nenhuma mentoria registrada
                </h3>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  As mentorias podem ser criadas na ficha do aluno.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Aluno
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Mentor
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Acoes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {mentorings.map((s) => (
                        <tr
                          key={s.id}
                          className="h-[44px] transition-colors hover:bg-[#F9FBFE]"
                        >
                          <td className="px-4 text-[13px] font-bold text-[#0F172A]">
                            {profileMap[s.aluno_user_id] ?? 'Desconhecido'}
                          </td>
                          <td className="px-4">
                            <span className="rounded-full border border-[#7B1FA2]/20 bg-[#7B1FA2]/10 px-2 py-0.5 text-[10px] font-bold text-[#7B1FA2]">
                              {MENTORING_TYPE_LABELS[s.session_type] ?? s.session_type}
                            </span>
                          </td>
                          <td className="px-4 text-[13px] text-[#64748B]">
                            {formatDate(s.scheduled_date)}
                          </td>
                          <td className="px-4 text-[13px] text-[#64748B]">
                            {s.mentor_name ?? '--'}
                          </td>
                          <td className="px-4">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                MENTORING_STATUS_COLORS[s.status] ??
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              {MENTORING_STATUS_LABELS[s.status] ?? s.status}
                            </span>
                          </td>
                          <td className="px-4 text-right">
                            <Link
                              href={`/admin/alunos/${s.aluno_user_id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E88E5] hover:underline"
                            >
                              Ficha <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Programa ──────────────────────────────── */}
        {activeTab === 'programa' && (
          <div>
            <ConteudoStudio />
          </div>
        )}

        {/* ── Tab: Cursos ────────────────────────────────── */}
        {activeTab === 'cursos' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-extrabold text-[#0F172A]">
                Cursos e Formacoes
              </h3>
              <Link
                href="/admin/cursos/novo"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E88E5] px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#1565C0]"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Formacao
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
                <BookOpen className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-extrabold text-[#111827]">
                  Nenhum curso cadastrado
                </h3>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  Crie a primeira formacao para iniciar o catalogo.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5ECF6] bg-[#F8FAFC]">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Curso
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Modulos
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Alunos
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Acoes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECF6]">
                      {courses.map((c) => {
                        const mods = modulesByCoursue[c.id] ?? []
                        const studentCount = enrollmentsByCourse[c.id] ?? 0

                        return (
                          <tr
                            key={c.id}
                            className="h-[44px] transition-colors hover:bg-[#F9FBFE]"
                          >
                            <td className="px-4">
                              <div className="flex items-center gap-2">
                                {c.thumbnail_url ? (
                                  <img
                                    src={c.thumbnail_url}
                                    alt=""
                                    className="h-8 w-12 rounded-md border border-[#D8E2EF] object-cover"
                                  />
                                ) : (
                                  <div className="flex h-8 w-12 items-center justify-center rounded-md border border-[#D8E2EF] bg-[#F3F8FE] text-[9px] font-bold text-[#94A3B8]">
                                    IMG
                                  </div>
                                )}
                                <span className="text-[13px] font-bold text-[#0F172A]">
                                  {c.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 text-[13px] text-[#334155]">
                              {mods.length}
                            </td>
                            <td className="px-4">
                              <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-[#94A3B8]" />
                                <span className="text-[13px] text-[#334155]">
                                  {studentCount}
                                </span>
                              </div>
                            </td>
                            <td className="px-4">
                              {c.is_published ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  <Eye className="h-3 w-3" />
                                  Publicado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                  <EyeOff className="h-3 w-3" />
                                  Rascunho
                                </span>
                              )}
                            </td>
                            <td className="px-4 text-right">
                              <Link
                                href={`/admin/cursos/${c.id}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E88E5] hover:underline"
                              >
                                Editar <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
