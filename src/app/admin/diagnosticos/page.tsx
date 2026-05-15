import { Building2, User, Download, Calendar, Mail } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/service'
import { DiagnosticosFilters } from '@/components/admin/diagnosticos/DiagnosticosFilters'
import { PdiActionsCell } from '@/components/admin/diagnosticos/PdiActionsCell'
import {
  emailBodyEmpresa,
  emailBodyPessoal,
  emailSubjectEmpresa,
  emailSubjectPessoal,
  whatsappTextEmpresa,
  whatsappTextPessoal,
} from '@/lib/admin/diagnosticos-templates'

export const metadata = { title: 'Diagnósticos · Admin Lidera' }

type SearchParams = Promise<{
  type?: 'empresa' | 'pessoal' | 'all'
  from?: string
  to?: string
  search?: string
}>

type B2bRow = {
  id: string
  empresa: string
  gestor_nome: string
  gestor_email: string
  gestor_whatsapp: string | null
  supervisor_nome: string
  supervisor_whatsapp: string | null
  fit_score: number | null
  disc_scores: Record<string, number> | null
  pdi_enviado_em: string | null
  created_at: string
}

type PersonalRow = {
  id: string
  nome_completo: string
  email: string
  whatsapp: string | null
  empresa: string | null
  cargo: string | null
  modulo_scores: Record<string, number> | null
  radar_average: number | null
  disc_scores: Record<string, number> | null
  linked_b2b_diagnostic_id: string | null
  pdi_enviado_em: string | null
  created_at: string
}

function onlyDigits(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

function normalizeBrazilianWhatsapp(value: string | null | undefined): string | null {
  const digits = onlyDigits(value)
  if (!digits) return null
  if (digits.startsWith('55')) return digits
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`
  return digits
}

function buildWhatsappUrl(phone: string | null | undefined, message: string): string | null {
  const normalized = normalizeBrazilianWhatsapp(phone)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function dominantDisc(scores: Record<string, number> | null): string {
  if (!scores) return '—'
  const dims = (['D', 'I', 'S', 'C'] as Array<'D' | 'I' | 'S' | 'C'>)
    .slice()
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
  return `${dims[0]}${scores[dims[0]] || 0}%`
}

export default async function AdminDiagnosticosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const type = params.type || 'all'
  const search = params.search?.trim().toLowerCase() || ''
  const from = params.from || ''
  const to = params.to || ''

  const admin = createAdminClient()

  let b2bRows: B2bRow[] = []
  let personalRows: PersonalRow[] = []

  if (type === 'all' || type === 'empresa') {
    let q = admin
      .from('b2b_diagnostics')
      .select(
        'id, empresa, gestor_nome, gestor_email, gestor_whatsapp, supervisor_nome, supervisor_whatsapp, fit_score, disc_scores, pdi_enviado_em, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(200)
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lte('created_at', `${to}T23:59:59.999Z`)
    const { data } = await q
    b2bRows = (data as B2bRow[]) || []
    if (search) {
      b2bRows = b2bRows.filter((r) =>
        [r.empresa, r.gestor_nome, r.gestor_email, r.supervisor_nome]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(search)),
      )
    }
  }

  if (type === 'all' || type === 'pessoal') {
    let q = admin
      .from('personal_diagnostics')
      .select(
        'id, nome_completo, email, whatsapp, empresa, cargo, modulo_scores, radar_average, disc_scores, linked_b2b_diagnostic_id, pdi_enviado_em, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(200)
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lte('created_at', `${to}T23:59:59.999Z`)
    const { data } = await q
    personalRows = (data as PersonalRow[]) || []
    if (search) {
      personalRows = personalRows.filter((r) =>
        [r.nome_completo, r.email, r.empresa, r.cargo]
          .filter(Boolean)
          .some((v) => (v ?? '').toLowerCase().includes(search)),
      )
    }
  }

  const total = b2bRows.length + personalRows.length

  const exportQuery = new URLSearchParams()
  if (type !== 'all') exportQuery.set('type', type)
  if (from) exportQuery.set('from', from)
  if (to) exportQuery.set('to', to)
  if (search) exportQuery.set('search', search)
  const exportHref = `/api/admin/diagnosticos/export${
    exportQuery.toString() ? `?${exportQuery.toString()}` : ''
  }`

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Admin</p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Diagnósticos recebidos
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Total: <strong className="text-[#0F172A]">{total}</strong> registros (após filtros)
            · {b2bRows.length} empresa · {personalRows.length} pessoal
          </p>
        </div>
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F]"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </a>
      </div>

      {/* Filtros */}
      <DiagnosticosFilters initial={{ type, from, to, search }} />

      {/* Tabela Empresa */}
      {(type === 'all' || type === 'empresa') && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#1565C0]" />
            <h2 className="font-heading text-lg font-extrabold text-[#0F172A]">
              Empresa ({b2bRows.length})
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFD]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Empresa
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Gestor
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Supervisor avaliado
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Fit
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      DISC dom.
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Data
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {b2bRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#94A3B8]">
                        Nenhum diagnóstico empresa encontrado.
                      </td>
                    </tr>
                  ) : (
                    b2bRows.map((r) => (
                      <tr key={r.id} className="border-t border-[#E3EBF6] hover:bg-[#F8FAFD]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#0F172A]">{r.empresa}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#334155]">{r.gestor_nome}</p>
                          <p className="text-xs text-[#94A3B8]">{r.gestor_email}</p>
                        </td>
                        <td className="px-4 py-3 text-[#334155]">{r.supervisor_nome}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-[#EFF6FE] px-2 py-1 text-xs font-extrabold text-[#1565C0]">
                            {r.fit_score ?? 0}/100
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#334155]">
                          {dominantDisc(r.disc_scores)}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#64748B]">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <PdiActionsCell
                            diagnosticoId={r.id}
                            tipo="empresa"
                            pdiHref={`/diagnostico/empresa/pdi/${r.id}`}
                            contatoEmail={r.gestor_email}
                            contatoNome={r.gestor_nome}
                            whatsappUrl={buildWhatsappUrl(
                              r.gestor_whatsapp,
                              whatsappTextEmpresa({
                                firstName: firstName(r.gestor_nome),
                                empresa: r.empresa,
                                supervisorNome: r.supervisor_nome,
                                diagnosticoId: r.id,
                              }),
                            )}
                            enviadoEm={r.pdi_enviado_em}
                            emailDefault={{
                              to: r.gestor_email,
                              subject: emailSubjectEmpresa({
                                firstName: firstName(r.gestor_nome),
                                empresa: r.empresa,
                                supervisorNome: r.supervisor_nome,
                                diagnosticoId: r.id,
                              }),
                              body: emailBodyEmpresa({
                                firstName: firstName(r.gestor_nome),
                                empresa: r.empresa,
                                supervisorNome: r.supervisor_nome,
                                diagnosticoId: r.id,
                              }),
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tabela Pessoal */}
      {(type === 'all' || type === 'pessoal') && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-[#F57C00]" />
            <h2 className="font-heading text-lg font-extrabold text-[#0F172A]">
              Pessoal ({personalRows.length})
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFD]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Profissional
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Empresa / Cargo
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Self
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Radar
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      DISC dom.
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Cross
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Data
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {personalRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#94A3B8]">
                        Nenhum diagnóstico pessoal encontrado.
                      </td>
                    </tr>
                  ) : (
                    personalRows.map((r) => (
                      <tr key={r.id} className="border-t border-[#E3EBF6] hover:bg-[#F8FAFD]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#0F172A]">{r.nome_completo}</p>
                          <p className="flex items-center gap-1 text-xs text-[#94A3B8]">
                            <Mail className="h-3 w-3" />
                            {r.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#334155]">{r.empresa || '—'}</p>
                          <p className="text-xs text-[#94A3B8]">{r.cargo || '—'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-[#FFF7ED] px-2 py-1 text-xs font-extrabold text-[#F57C00]">
                            {(r.modulo_scores?.self_score as number) ?? 0}/100
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#334155]">
                          {r.radar_average ? r.radar_average.toFixed(1) : '—'}/10
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#334155]">
                          {dominantDisc(r.disc_scores)}
                        </td>
                        <td className="px-4 py-3">
                          {r.linked_b2b_diagnostic_id ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#ECFDF5] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
                              <Building2 className="h-3 w-3" />
                              Linkado
                            </span>
                          ) : (
                            <span className="text-xs text-[#94A3B8]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#64748B]">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <PdiActionsCell
                            diagnosticoId={r.id}
                            tipo="pessoal"
                            pdiHref={`/diagnostico/pessoal/pdi/${r.id}`}
                            contatoEmail={r.email}
                            contatoNome={r.nome_completo}
                            whatsappUrl={buildWhatsappUrl(
                              r.whatsapp,
                              whatsappTextPessoal({
                                firstName: firstName(r.nome_completo),
                                diagnosticoId: r.id,
                                empresa: r.empresa,
                              }),
                            )}
                            enviadoEm={r.pdi_enviado_em}
                            emailDefault={{
                              to: r.email,
                              subject: emailSubjectPessoal({
                                firstName: firstName(r.nome_completo),
                                diagnosticoId: r.id,
                                empresa: r.empresa,
                              }),
                              body: emailBodyPessoal({
                                firstName: firstName(r.nome_completo),
                                diagnosticoId: r.id,
                                empresa: r.empresa,
                              }),
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Footer info */}
      <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4 text-xs text-[#64748B]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Limite: 200 registros mais recentes por tipo
          </span>
          <span>·</span>
          <span>
            Para análise histórica completa, use o <strong>Export CSV</strong> com filtros de data.
          </span>
        </div>
      </div>
    </div>
  )
}
