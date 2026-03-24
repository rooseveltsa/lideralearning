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
   Data fetchers — use left join so missing profiles don't hide rows
───────────────────────────────────────────── */

type ResponseRow = {
  id: string
  user_id: string
  respondente: string
  data: string
  score: string | null
  perfil: string | null
}

async function fetchAutoavaliacao(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  // Try with inner join first, fall back to no join
  const { data, error } = await supabase
    .from('leadership_self_assessments')
    .select('id, user_id, pontuacao_total, perfil, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    pontuacao_total: number
    perfil: string
    created_at: string
    profiles: { full_name: string } | null
  }>).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    respondente: row.profiles?.full_name || row.user_id.slice(0, 8) + '...',
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
    user_id: row.user_id ?? '',
    respondente: row.full_name || row.user_id || 'Anonimo',
    data: row.created_at,
    score: null,
    perfil: null,
  }))
}

async function fetchPdi(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_pdi')
    .select('id, user_id, media_dimensoes, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    media_dimensoes: number | null
    created_at: string
    profiles: { full_name: string } | null
  }>).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    respondente: row.profiles?.full_name || row.user_id.slice(0, 8) + '...',
    data: row.created_at,
    score: row.media_dimensoes != null ? `${Number(row.media_dimensoes).toFixed(1)} media` : null,
    perfil: null,
  }))
}

async function fetchExecutiva(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ResponseRow[]> {
  const { data, error } = await supabase
    .from('leadership_executive_assessments')
    .select('id, user_id, nome_supervisor, nome_empresa, media_dimensoes, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Array<{
    id: string
    user_id: string
    nome_supervisor: string | null
    nome_empresa: string | null
    media_dimensoes: number | null
    created_at: string
    profiles: { full_name: string } | null
  }>).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    respondente: row.profiles?.full_name || row.user_id.slice(0, 8) + '...',
    data: row.created_at,
    score: row.media_dimensoes != null ? `${Number(row.media_dimensoes).toFixed(1)}/5` : null,
    perfil: row.nome_supervisor ? `Supervisor: ${row.nome_supervisor}` : (row.nome_empresa ? `Empresa: ${row.nome_empresa}` : null),
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
      <div className="py-12 text-center">
        <p className="text-sm font-bold text-[#0F172A]">Tipo de formulario nao encontrado</p>
        <Link href="/admin/formularios" className="mt-3 inline-block text-xs font-bold text-[#1E88E5] hover:underline">
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
    rows = []
  }

  const perfilColors: Record<string, { bg: string; text: string }> = {
    'Supervisor Reativo': { bg: 'bg-red-100', text: 'text-red-700' },
    'Em Transicao': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Lider de Valor': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  }

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href="/admin/formularios"
        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E88E5] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>

      {/* Header — compact */}
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
          Respostas recebidas
        </p>
        <h1 className="mt-1 font-heading text-xl font-extrabold">
          {config.titulo}
        </h1>
      </section>

      {/* KPI — single compact card */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: config.bgCor }}
        >
          <Users className="h-4 w-4" style={{ color: config.cor }} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-[#0F172A]">{rows.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Respostas</p>
        </div>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <p className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-8 text-center text-xs text-[#94A3B8]">
          Nenhuma resposta registrada para este formulario.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#D8E2EF] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5ECF6] bg-[#F8FAFD]">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Respondente
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Data
                    </span>
                  </th>
                  {(formType === 'autoavaliacao' || formType === 'pdi' || formType === 'avaliacao-executiva') && (
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Score
                      </span>
                    </th>
                  )}
                  {(formType === 'autoavaliacao' || formType === 'avaliacao-executiva') && (
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Perfil / Info
                    </th>
                  )}
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Acao
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {rows.map((row) => {
                  const pColor = row.perfil ? perfilColors[row.perfil] : null
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-[#FAFCFF]">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/alunos/${row.user_id}`}
                          className="font-semibold text-[#0F172A] hover:text-[#1565C0]"
                        >
                          {row.respondente}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">
                        {new Date(row.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      {(formType === 'autoavaliacao' || formType === 'pdi' || formType === 'avaliacao-executiva') && (
                        <td className="px-4 py-3">
                          {row.score ? (
                            <span
                              className="inline-flex rounded px-1.5 py-0.5 text-[11px] font-bold"
                              style={{ backgroundColor: config.bgCor, color: config.cor }}
                            >
                              {row.score}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#CBD5E1]">--</span>
                          )}
                        </td>
                      )}
                      {(formType === 'autoavaliacao' || formType === 'avaliacao-executiva') && (
                        <td className="px-4 py-3">
                          {row.perfil ? (
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${pColor?.bg ?? 'bg-gray-100'} ${pColor?.text ?? 'text-gray-600'}`}>
                              {row.perfil}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#CBD5E1]">--</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/alunos/${row.user_id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E2EF] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#334155] transition-colors hover:bg-[#F7FAFE]"
                        >
                          Ver ficha
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
  )
}
