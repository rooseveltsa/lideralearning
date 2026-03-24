import Link from 'next/link'
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import CopyLinkButton from './CopyLinkButton'

/* ─────────────────────────────────────────────
   Formulários disponíveis
───────────────────────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'

type Formulario = {
  id: string
  titulo: string
  descricao: string
  tipo: 'multipla_escolha' | 'dissertativo' | 'misto'
  duracao: string
  rota: string
  requerLogin: boolean
  icon: typeof ClipboardCheck
  cor: string
  bgCor: string
}

const formularios: Formulario[] = [
  {
    id: 'autoavaliacao',
    titulo: 'Autoavaliação — Líder/Supervisor',
    descricao:
      'Formulário de múltipla escolha com diagnóstico automático. 6 questões sobre percepção da função, gestão de equipes, comunicação, tecnologia, ética e expectativas. Resultado com perfil de liderança.',
    tipo: 'multipla_escolha',
    duracao: '~5 min',
    rota: '/treinamento/autoavaliacao',
    requerLogin: true,
    icon: ClipboardCheck,
    cor: '#1565C0',
    bgCor: '#EFF6FE',
  },
  {
    id: 'diagnostico',
    titulo: 'Diagnóstico de Liderança Estratégica',
    descricao:
      'Formulário dissertativo completo com 6 etapas: identificação, reflexão de papel, autoavaliação das 5 dimensões, maturidade 4.0, gestão de equipes e plano de ação de 12 semanas.',
    tipo: 'dissertativo',
    duracao: '~15 min',
    rota: '/treinamento/diagnostico-lideranca',
    requerLogin: false,
    icon: FileText,
    cor: '#F57C00',
    bgCor: '#FFF8F0',
  },
  {
    id: 'pdi',
    titulo: 'Plano de Desenvolvimento Individual (PDI)',
    descricao:
      'Formulário completo de PDI com 5 etapas: diagnóstico das 5 dimensões da liderança, avaliação de Hard Skills e Soft Skills, roteiro de aceleração de 12 semanas e competências do Supervisor 4.0.',
    tipo: 'misto',
    duracao: '~10 min',
    rota: '/treinamento/pdi',
    requerLogin: true,
    icon: BookOpen,
    cor: '#7B1FA2',
    bgCor: '#F3E5F5',
  },
  {
    id: 'avaliacao-executiva',
    titulo: 'Avaliação Executiva — Alinhamento Estratégico',
    descricao:
      'Formulário para RH/Gestor avaliar o supervisor. 8 seções: perfil do elo estratégico, gestão de equipe, conflitos geracionais, dados e IA, ética, autonomia, prioridade estratégica e critérios de sucesso.',
    tipo: 'misto',
    duracao: '~10 min',
    rota: '/treinamento/avaliacao-executiva',
    requerLogin: true,
    icon: Building2,
    cor: '#00695C',
    bgCor: '#E0F2F1',
  },
]

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default async function AdminFormulariosPage() {
  const supabase = await createClient()

  // Buscar contagem de respostas da autoavaliação
  const { count: totalAutoavaliacao } = await supabase
    .from('leadership_self_assessments')
    .select('*', { count: 'exact', head: true })

  // Buscar contagem de PDI
  let totalPdi = 0
  try {
    const { count } = await supabase
      .from('leadership_pdi')
      .select('*', { count: 'exact', head: true })
    totalPdi = count ?? 0
  } catch {
    // Table may not exist yet
  }

  // Buscar contagem de avaliacao executiva
  let totalExecutiva = 0
  try {
    const { count } = await supabase
      .from('leadership_executive_assessments')
      .select('*', { count: 'exact', head: true })
    totalExecutiva = count ?? 0
  } catch {
    // Table may not exist yet
  }

  // Buscar contagem por perfil
  const { data: perfilData } = await supabase
    .from('leadership_self_assessments')
    .select('perfil')

  const perfilCounts = {
    reativo: 0,
    transicao: 0,
    lider_valor: 0,
  }

  if (perfilData) {
    for (const row of perfilData as { perfil: string }[]) {
      if (row.perfil in perfilCounts) {
        perfilCounts[row.perfil as keyof typeof perfilCounts]++
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Central de documentos
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Formulários e Diagnósticos
          </h1>
          <p className="mt-4 max-w-lg text-sm text-[#A9BDD8]">
            Copie os links dos formulários para enviar aos líderes e supervisores.
            Acompanhe as respostas e resultados aqui.
          </p>
        </div>
      </section>

      {/* KPIs da Autoavaliação */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1565C0]/10">
            <Users className="h-4.5 w-4.5 text-[#1565C0]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Total de respostas
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalAutoavaliacao ?? 0}</p>
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-700">
            Supervisor Reativo
          </p>
          <p className="mt-2 text-3xl font-extrabold text-red-900">{perfilCounts.reativo}</p>
          <p className="mt-1 text-xs text-red-600">7-10 pontos</p>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Em Transição
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-900">{perfilCounts.transicao}</p>
          <p className="mt-1 text-xs text-amber-600">11-15 pontos</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            Líder de Valor
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{perfilCounts.lider_valor}</p>
          <p className="mt-1 text-xs text-emerald-600">16-21 pontos</p>
        </article>
      </section>

      {/* KPIs extras — PDI e Executiva */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7B1FA2]/10">
            <BookOpen className="h-4.5 w-4.5 text-[#7B1FA2]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Respostas PDI
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalPdi}</p>
        </article>

        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00695C]/10">
            <Building2 className="h-4.5 w-4.5 text-[#00695C]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Avaliacoes Executivas
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{totalExecutiva}</p>
        </article>
      </section>

      {/* Lista de Formulários */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]">
          <ClipboardList className="h-5 w-5 text-[#1565C0]" />
          Formulários Disponíveis
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          {formularios.map((form) => {
            const Icon = form.icon
            const fullUrl = `${BASE_URL}${form.rota}`

            return (
              <article
                key={form.id}
                className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: form.bgCor }}
                  >
                    <Icon className="h-6 w-6" style={{ color: form.cor }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-[#0F172A]">{form.titulo}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-bold uppercase"
                        style={{ backgroundColor: form.bgCor, color: form.cor }}
                      >
                        {form.tipo === 'multipla_escolha' ? 'Múltipla escolha' : form.tipo === 'dissertativo' ? 'Dissertativo' : 'Misto'}
                      </span>
                      <span className="text-xs text-[#64748B]">{form.duracao}</span>
                      {form.requerLogin && (
                        <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#64748B]">
                          Requer cadastro
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{form.descricao}</p>

                {/* Link + Ações */}
                <div className="mt-4 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">
                    Link para compartilhar
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-[#334155] border border-[#E3EBF6]">
                      {fullUrl}
                    </code>
                    <CopyLinkButton url={fullUrl} />
                  </div>
                </div>

                {/* Botões */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8E2EF] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </a>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1565C0]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir em nova aba
                  </a>
                  <Link
                    href={`/admin/formularios/respostas/${form.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8E2EF] bg-white px-3 py-2 text-xs font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Ver respostas
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
