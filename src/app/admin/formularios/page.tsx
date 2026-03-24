import Link from 'next/link'
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  ClipboardList,
  ExternalLink,
  Eye,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import CopyLinkButton from './CopyLinkButton'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'

export default async function AdminFormulariosPage() {
  const supabase = await createClient()

  // ── Real counts from DB ──
  let totalAutoavaliacao = 0
  let totalPdi = 0
  let totalExecutiva = 0

  try {
    const { count } = await supabase
      .from('leadership_self_assessments')
      .select('*', { count: 'exact', head: true })
    totalAutoavaliacao = count ?? 0
  } catch { /* table may not exist */ }

  try {
    const { count } = await supabase
      .from('leadership_pdi')
      .select('*', { count: 'exact', head: true })
    totalPdi = count ?? 0
  } catch { /* table may not exist */ }

  try {
    const { count } = await supabase
      .from('leadership_executive_assessments')
      .select('*', { count: 'exact', head: true })
    totalExecutiva = count ?? 0
  } catch { /* table may not exist */ }

  // ── Perfil breakdown ──
  const perfilCounts = { reativo: 0, transicao: 0, lider_valor: 0 }
  try {
    const { data: perfilData } = await supabase
      .from('leadership_self_assessments')
      .select('perfil')
    if (perfilData) {
      for (const row of perfilData as { perfil: string }[]) {
        if (row.perfil in perfilCounts) {
          perfilCounts[row.perfil as keyof typeof perfilCounts]++
        }
      }
    }
  } catch { /* table may not exist */ }

  // ── Form definitions with real counts ──
  const formularios = [
    {
      id: 'autoavaliacao',
      titulo: '1.4.1 — Autoavaliacao do Lider/Supervisor',
      descricao: 'Multipla escolha (6 questoes). Gera Diagnostico de Lideranca com perfil Reativo / Transicao / Lider de Valor.',
      tipo: 'Multipla escolha',
      duracao: '~5 min',
      rota: '/treinamento/autoavaliacao',
      icon: ClipboardCheck,
      cor: '#1565C0',
      bgCor: '#EFF6FE',
      respostas: totalAutoavaliacao,
    },
    {
      id: 'avaliacao-executiva',
      titulo: '1.3.1 — Avaliacao Executiva (Gestor/RH)',
      descricao: '8 secoes: perfil, gestao de equipe, conflitos, dados/IA, etica, autonomia, prioridade e criterios de sucesso.',
      tipo: 'Misto',
      duracao: '~10 min',
      rota: '/treinamento/avaliacao-executiva',
      icon: Building2,
      cor: '#00695C',
      bgCor: '#E0F2F1',
      respostas: totalExecutiva,
    },
    {
      id: 'pdi',
      titulo: 'PDI — Plano de Desenvolvimento Individual',
      descricao: 'Gerado automaticamente do cruzamento Autoavaliacao + Executiva. Plano de 12 semanas com foco de mentoria.',
      tipo: 'Auto-gerado',
      duracao: 'Auto',
      rota: '/treinamento/pdi',
      icon: BookOpen,
      cor: '#7B1FA2',
      bgCor: '#F3E5F5',
      respostas: totalPdi,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header — compact */}
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
          Central de documentos
        </p>
        <h1 className="mt-1 font-heading text-2xl font-extrabold">Formularios e PDI</h1>
        <p className="mt-1 max-w-lg text-xs text-[#A9BDD8]">
          Supervisor preenche Autoavaliacao → Gestor preenche Executiva → Sistema gera PDI.
        </p>
      </section>

      {/* KPIs — compact row */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Autoavaliacoes</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalAutoavaliacao}</p>
        </article>
        <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Executivas</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalExecutiva}</p>
        </article>
        <article className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">PDIs</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{totalPdi}</p>
        </article>
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
      </section>

      {/* Form cards — compact */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
          <ClipboardList className="h-4 w-4 text-[#1565C0]" />
          Formularios Disponiveis
        </h2>

        <div className="space-y-3">
          {formularios.map((form) => {
            const Icon = form.icon
            const fullUrl = `${BASE_URL}${form.rota}`

            return (
              <article
                key={form.id}
                className="rounded-xl border border-[#D8E2EF] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: form.bgCor }}
                  >
                    <Icon className="h-5 w-5" style={{ color: form.cor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-[#0F172A]">{form.titulo}</h3>
                      <span
                        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: form.bgCor, color: form.cor }}
                      >
                        {form.respostas} resposta{form.respostas !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
                      <span>{form.tipo}</span>
                      <span>|</span>
                      <span>{form.duracao}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-[#64748B]">{form.descricao}</p>

                    {/* Link area */}
                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg border border-[#E3EBF6] bg-[#F8FAFD] px-2.5 py-1.5 text-[11px] text-[#334155]">
                        {fullUrl}
                      </code>
                      <CopyLinkButton url={fullUrl} />
                    </div>

                    {/* Actions */}
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                      >
                        <Eye className="h-3 w-3" />
                        Visualizar
                      </a>
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#1E88E5] px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#1565C0]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Abrir
                      </a>
                      <Link
                        href={`/admin/formularios/respostas/${form.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                      >
                        <BarChart3 className="h-3 w-3" />
                        Ver respostas ({form.respostas})
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
