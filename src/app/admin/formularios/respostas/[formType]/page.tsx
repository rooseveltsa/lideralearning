import Link from 'next/link'
import { ArrowLeft, Calendar, Hash, User, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

/* ─────────────────────────────────────────────
   Config por tipo de formulario
───────────────────────────────────────────── */

type FormTypeKey = 'autoavaliacao' | 'diagnostico' | 'pdi' | 'avaliacao-executiva'

const FORM_CONFIG: Record<FormTypeKey, { titulo: string; cor: string; bgCor: string }> = {
  autoavaliacao: { titulo: 'Autoavaliacao', cor: '#1565C0', bgCor: '#EFF6FE' },
  diagnostico: { titulo: 'Diagnostico de Lideranca', cor: '#F57C00', bgCor: '#FFF8F0' },
  pdi: { titulo: 'Plano de Desenvolvimento Individual', cor: '#7B1FA2', bgCor: '#F3E5F5' },
  'avaliacao-executiva': { titulo: 'Avaliacao Executiva', cor: '#00695C', bgCor: '#E0F2F1' },
}

/* ─────────────────────────────────────────────
   Data fetchers
───────────────────────────────────────────── */

type ResponseRow = {
  id: string
  respondente: string
  data: string
  score: string | null
  perfil: string | null
}

async function fetchAutoavaliacao(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_self_assessments')
    .select('id, user_id, pontuacao_total, perfil, created_at, profiles!inner(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    pontuacao_total: number
    perfil: string
    created_at: string
    profiles: { full_name: string }
  }>).map((row) => ({
    id: row.id,
    respondente: row.profiles?.full_name || row.user_id,
    data: row.created_at,
    score: `${row.pontuacao_total} pts`,
    perfil: row.perfil === 'reativo'
      ? 'Supervisor Reativo'
      : row.perfil === 'transicao'
        ? 'Em Transicao'
        : 'Lider de Valor',
  }))
}

async function fetchDiagnostico(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_diagnostics')
    .select('id, user_id, full_name, created_at')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as Array<{
    id: string
    user_id: string | null
    full_name: string | null
    created_at: string
  }>).map((row) => ({
    id: row.id,
    respondente: row.full_name || row.user_id || 'Anonimo',
    data: row.created_at,
    score: null,
    perfil: null,
  }))
}

async function fetchPdi(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_pdi')
    .select('id, user_id, media_dimensoes, created_at, profiles!inner(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    media_dimensoes: number | null
    created_at: string
    profiles: { full_name: string }
  }>).map((row) => ({
    id: row.id,
    respondente: row.profiles?.full_name || row.user_id,
    data: row.created_at,
    score: row.media_dimensoes != null ? `${row.media_dimensoes.toFixed(1)} media` : null,
    perfil: null,
  }))
}

async function fetchExecutiva(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_executive_assessments')
    .select('id, user_id, created_at, profiles!inner(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    created_at: string
    profiles: { full_name: string }
  }>).map((row) => ({
    id: row.id,
    respondente: row.profiles?.full_name || row.user_id,
    data: row.created_at,
    score: null,
    perfil: null,
  }))
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default async function RespostasPage({
  params,
}: {
  params: Promise<{ formType: string }>
}) {
  const { formType } = await params
  const config = FORM_CONFIG[formType as FormTypeKey]

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-bold text-[#0F172A]">Tipo de formulario nao encontrado</p>
        <Link href="/admin/formularios" className="mt-4 text-sm font-bold text-[#1E88E5] hover:underline">
          Voltar para formularios
        </Link>
      </div>
    )
  }

  const supabase = await createClient()
  let rows: ResponseRow[] = []

  try {
    switch (formType as FormTypeKey) {
      case 'autoavaliacao':
        rows = await fetchAutoavaliacao(supabase)
        break
      case 'diagnostico':
        rows = await fetchDiagnostico(supabase)
        break
      case 'pdi':
        rows = await fetchPdi(supabase)
        break
      case 'avaliacao-executiva':
        rows = await fetchExecutiva(supabase)
        break
    }
  } catch {
    // Table may not exist yet — handle gracefully
    rows = []
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/formularios"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E88E5] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para formularios
      </Link>

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
            Respostas recebidas
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Respostas &mdash; {config.titulo}
          </h1>
        </div>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: config.bgCor }}>
            <Users className="h-4.5 w-4.5" style={{ color: config.cor }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Total de respostas
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{rows.length}</p>
        </article>
      </section>

      {/* Table */}
      {rows.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-[#94A3B8]">
            Nenhuma resposta registrada ainda para este formulario.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#D8E2EF] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5ECF6] bg-[#F8FAFD]">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Respondente
                    </span>
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Data
                    </span>
                  </th>
                  {(formType === 'autoavaliacao' || formType === 'pdi') && (
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      <span className="inline-flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5" />
                        Score
                      </span>
                    </th>
                  )}
                  {formType === 'autoavaliacao' && (
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      Perfil
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#F1F5F9] transition-colors hover:bg-[#FAFCFF]">
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">{row.respondente}</td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {new Date(row.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    {(formType === 'autoavaliacao' || formType === 'pdi') && (
                      <td className="px-6 py-4">
                        {row.score ? (
                          <span
                            className="inline-flex rounded-md px-2 py-0.5 text-xs font-bold"
                            style={{ backgroundColor: config.bgCor, color: config.cor }}
                          >
                            {row.score}
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">&mdash;</span>
                        )}
                      </td>
                    )}
                    {formType === 'autoavaliacao' && (
                      <td className="px-6 py-4">
                        {row.perfil ? (
                          <span className="text-xs font-bold text-[#334155]">{row.perfil}</span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">&mdash;</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
