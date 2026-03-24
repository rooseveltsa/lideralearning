'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock,
  Cpu,
  ExternalLink,
  Eye,
  EyeOff,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'

type ModuleAdmin = {
  id: number
  title: string
  fullTitle: string
  day: number
  period: string
  icon: typeof BookOpen
  description: string
  published: boolean
  conceptCount: number
  exerciseCount: number
  toolName: string
  views: number
  completionRate: number
}

const programModules: ModuleAdmin[] = [
  {
    id: 1,
    title: 'A Função Estratégica',
    fullTitle: 'Módulo 1 — A Função Estratégica do Supervisor',
    day: 1,
    period: 'Manhã',
    icon: Target,
    description:
      'O supervisor como elo entre diretoria e operação. 5 Dimensões da Liderança, Ciclo de Sucessão, Armadilha Estatística e autoavaliação.',
    published: true,
    conceptCount: 4,
    exerciseCount: 2,
    toolName: 'Autoavaliação das 5 Dimensões',
    views: 342,
    completionRate: 89,
  },
  {
    id: 2,
    title: 'Inteligência Comportamental',
    fullTitle: 'Módulo 2 — Inteligência Comportamental e Comunicação',
    day: 1,
    period: 'Manhã',
    icon: Brain,
    description:
      'Fórmula E.I.A. para feedback assertivo, Escuta Ativa em 3 níveis, postura assertiva e Comunicação Não-Violenta no chão de fábrica.',
    published: true,
    conceptCount: 4,
    exerciseCount: 2,
    toolName: 'Role-play de Feedback com E.I.A.',
    views: 298,
    completionRate: 85,
  },
  {
    id: 3,
    title: 'Alicerce Ético',
    fullTitle: 'Módulo 3 — Alicerce Ético e Responsabilidade',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    description:
      'Tribunal das Virtudes, 7 Virtudes do Líder, dilemas éticos, segurança psicológica e compliance como vantagem competitiva.',
    published: true,
    conceptCount: 5,
    exerciseCount: 2,
    toolName: 'Caso Prático do Tribunal das Virtudes',
    views: 267,
    completionRate: 82,
  },
  {
    id: 4,
    title: 'Diversidade Geracional',
    fullTitle: 'Módulo 4 — Gestão da Diversidade Geracional',
    day: 1,
    period: 'Tarde',
    icon: Users,
    description:
      'Mapeamento de Boomers, X, Millennials e Z. Mentoria Reversa, Equidade vs Igualdade e Matriz de Engajamento por Geração.',
    published: true,
    conceptCount: 6,
    exerciseCount: 2,
    toolName: 'Matriz de Engajamento por Geração',
    views: 245,
    completionRate: 78,
  },
  {
    id: 5,
    title: 'Engenharia de Equipes',
    fullTitle: 'Módulo 5 — Engenharia de Equipes, Mapeamento e Sucessão',
    day: 2,
    period: 'Manhã',
    icon: BriefcaseBusiness,
    description:
      'Matriz Competência x Compromisso com 4 quadrantes, plano de sucessão, delegação eficaz por perfil comportamental.',
    published: true,
    conceptCount: 6,
    exerciseCount: 2,
    toolName: 'Mapeamento da Equipe nos 4 Quadrantes',
    views: 312,
    completionRate: 91,
  },
  {
    id: 6,
    title: 'O Supervisor 4.0',
    fullTitle: 'Módulo 6 — O Supervisor 4.0 (Tecnologia e IA)',
    day: 2,
    period: 'Manhã',
    icon: Cpu,
    description:
      'Prompt Mágico (Contexto + Dados + Objetivo), KPI Autópsia vs Bússola, Análise de Causa Raiz, IA como copiloto com Gemini/ChatGPT.',
    published: true,
    conceptCount: 6,
    exerciseCount: 2,
    toolName: 'Prompt Mágico Aplicado a um Caso Real',
    views: 387,
    completionRate: 93,
  },
  {
    id: 7,
    title: 'Padrões de Sucesso',
    fullTitle: 'Módulo 7 — Padrões de Sucesso',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    description:
      'Tríade da Maestria, KPIs S.M.A.R.T., transformar resultados em procedimentos replicáveis e benchmarking interno.',
    published: true,
    conceptCount: 4,
    exerciseCount: 2,
    toolName: 'Criação de um Padrão de Sucesso Real',
    views: 231,
    completionRate: 76,
  },
  {
    id: 8,
    title: 'Estratégia e Plano Futuro',
    fullTitle: 'Módulo 8 — Estratégia de Carreira e Plano Futuro',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    description:
      'PDI individual, Roteiro de Aceleração 12 Semanas, autocoaching, mentoria 30/60 dias e certificação.',
    published: true,
    conceptCount: 5,
    exerciseCount: 2,
    toolName: 'Preenchimento do PDI e Compromisso Público',
    views: 356,
    completionRate: 88,
  },
]

export default function AdminConteudoPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [publishState, setPublishState] = useState<Record<number, boolean>>(
    Object.fromEntries(programModules.map((m) => [m.id, m.published]))
  )

  const publishedCount = Object.values(publishState).filter(Boolean).length
  const totalViews = programModules.reduce((sum, m) => sum + m.views, 0)
  const avgCompletion = Math.round(
    programModules.reduce((sum, m) => sum + m.completionRate, 0) / programModules.length
  )

  function toggleExpand(id: number) {
    setExpandedId(expandedId === id ? null : id)
  }

  function togglePublish(id: number) {
    setPublishState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const day1 = programModules.filter((m) => m.day === 1)
  const day2 = programModules.filter((m) => m.day === 2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-[#1A2B46] bg-[#060D1A] p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#1E88E5]/20 blur-[80px]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
              Gestao de conteudo
            </p>
            <h1 className="mt-2 font-heading text-2xl font-extrabold leading-tight md:text-3xl">
              Conteudo do Programa
            </h1>
            <p className="mt-2 text-sm text-[#A9BDD8]">
              <strong className="text-white">8 modulos</strong> em 2 dias &bull;{' '}
              <strong className="text-white">{publishedCount}</strong> publicados
            </p>
          </div>

          <Link
            href="/treinamento/modulos"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2E4467] px-4 py-2.5 text-sm font-bold text-[#D3E1F2] transition-colors hover:border-[#496A97] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Ver pagina publica
          </Link>
        </div>
      </section>

      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#1565C0]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Visualizacoes
            </p>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {totalViews.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5">Total em todos os modulos</p>
        </div>
        <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#16A34A]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Taxa de conclusao
            </p>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{avgCompletion}%</p>
          <p className="text-xs text-[#64748B] mt-0.5">Media entre modulos</p>
        </div>
        <div className="rounded-xl border border-[#D8E2EF] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#F57C00]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Mais popular
            </p>
          </div>
          <p className="mt-2 text-lg font-extrabold text-[#0F172A]">Modulo 06</p>
          <p className="text-xs text-[#64748B] mt-0.5">Supervisor 4.0 — 387 views</p>
        </div>
      </div>

      {/* Day 1 */}
      <DaySection
        day={1}
        label="O Elo e o Alicerce Etico"
        color="#1565C0"
        modules={day1}
        expandedId={expandedId}
        publishState={publishState}
        onToggleExpand={toggleExpand}
        onTogglePublish={togglePublish}
      />

      {/* Day 2 */}
      <DaySection
        day={2}
        label="Tecnologia e Futuro"
        color="#F57C00"
        modules={day2}
        expandedId={expandedId}
        publishState={publishState}
        onToggleExpand={toggleExpand}
        onTogglePublish={togglePublish}
      />
    </div>
  )
}

function DaySection({
  day,
  label,
  color,
  modules,
  expandedId,
  publishState,
  onToggleExpand,
  onTogglePublish,
}: {
  day: number
  label: string
  color: string
  modules: ModuleAdmin[]
  expandedId: number | null
  publishState: Record<number, boolean>
  onToggleExpand: (id: number) => void
  onTogglePublish: (id: number) => void
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-extrabold text-white"
            style={{ backgroundColor: color }}
          >
            D{day}
          </span>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color }}
            >
              Dia {day} — {label}
            </p>
            <h2 className="text-lg font-extrabold text-[#0F172A]">
              Modulos {day === 1 ? '1 a 4' : '5 a 8'}
            </h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E2EF] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
          <CalendarDays className="h-3.5 w-3.5" />4 modulos
        </span>
      </div>

      <div className="space-y-2">
        {modules.map((mod) => (
          <ModuleAdminCard
            key={mod.id}
            module={mod}
            isExpanded={expandedId === mod.id}
            isPublished={publishState[mod.id]}
            dayColor={color}
            onToggleExpand={onToggleExpand}
            onTogglePublish={onTogglePublish}
          />
        ))}
      </div>
    </section>
  )
}

function ModuleAdminCard({
  module: mod,
  isExpanded,
  isPublished,
  dayColor,
  onToggleExpand,
  onTogglePublish,
}: {
  module: ModuleAdmin
  isExpanded: boolean
  isPublished: boolean
  dayColor: string
  onToggleExpand: (id: number) => void
  onTogglePublish: (id: number) => void
}) {
  const Icon = mod.icon

  return (
    <div className="overflow-hidden rounded-xl border border-[#D8E2EF] bg-white shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => onToggleExpand(mod.id)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <div
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${dayColor}15` }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: dayColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider"
                style={{ color: dayColor }}
              >
                Modulo {String(mod.id).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#94A3B8]">&bull;</span>
              <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <Clock className="h-3 w-3" />
                {mod.period}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">{mod.fullTitle}</h3>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Publish toggle */}
        <button
          onClick={() => onTogglePublish(mod.id)}
          className="shrink-0"
          title={isPublished ? 'Clique para despublicar' : 'Clique para publicar'}
        >
          {isPublished ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
              <Eye className="h-3.5 w-3.5" />
              Publicado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100">
              <EyeOff className="h-3.5 w-3.5" />
              Rascunho
            </span>
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-[#E5ECF6] px-5 py-4 space-y-4">
          {/* Description */}
          <p className="text-sm leading-relaxed text-[#64748B]">{mod.description}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-3 py-2.5 text-center">
              <p className="text-lg font-extrabold text-[#0F172A]">{mod.conceptCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Conceitos
              </p>
            </div>
            <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-3 py-2.5 text-center">
              <p className="text-lg font-extrabold text-[#0F172A]">
                {mod.exerciseCount}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Exercicios
              </p>
            </div>
            <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-3 py-2.5 text-center">
              <p className="text-lg font-extrabold text-[#1565C0]">{mod.views}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Views
              </p>
            </div>
            <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-3 py-2.5 text-center">
              <p className="text-lg font-extrabold text-[#16A34A]">
                {mod.completionRate}%
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Conclusao
              </p>
            </div>
          </div>

          {/* Tool */}
          <div
            className="rounded-lg border px-4 py-3"
            style={{
              backgroundColor: `${dayColor}08`,
              borderColor: `${dayColor}20`,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: dayColor }}
            >
              Ferramenta pratica
            </p>
            <p className="text-sm font-bold text-[#0F172A] mt-0.5">{mod.toolName}</p>
          </div>

          {/* Views bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Popularidade relativa
              </p>
              <p className="text-xs font-bold text-[#0F172A]">
                {mod.views} visualizacoes
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E5ECF6]">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.round((mod.views / 387) * 100)}%`,
                  backgroundColor: dayColor,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
