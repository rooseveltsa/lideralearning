import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Target,
  XCircle,
} from 'lucide-react'

import { addActivity, getLeadsForCloser, updateLeadPipeline } from '@/lib/actions/crm'

const PIPELINE_LABELS: Record<string, string> = {
  prospecting: 'Prospeccao',
  first_contact: '1o Contato',
  qualification: 'Qualificacao',
  meeting: 'Reuniao',
  proposal: 'Proposta',
  negotiation: 'Negociacao',
  won: 'Ganho',
  lost: 'Perdido',
}

function daysSince(dateStr: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000))
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

export default async function CloserPage() {
  const { leads, scores, activities } = await getLeadsForCloser()

  // Filter to show leads in proposal/negotiation stages (closer's workspace)
  const closerStages = ['proposal', 'negotiation', 'meeting']
  const closerLeads = leads.filter((l) => closerStages.includes(l.pipeline_stage))
  const wonLeads = leads.filter((l) => l.pipeline_stage === 'won')

  const scoresByLead = new Map(scores.map((s) => [s.lead_id, s]))
  const activitiesByLead = new Map<string, typeof activities>()
  for (const a of activities) {
    if (!a.lead_id) continue
    const list = activitiesByLead.get(a.lead_id) ?? []
    list.push(a)
    activitiesByLead.set(a.lead_id, list)
  }

  const totalValue = closerLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)
  const wonValue = wonLeads.reduce((a, l) => a + (l.estimated_value || 0), 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/crm" className="text-[#64748b] hover:text-[#0f172a]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">Closer - Negociacoes</h1>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-[#64748b]">
              <span>{closerLeads.length} em negociacao</span>
              {totalValue > 0 && <span>Pipeline: {formatCurrency(totalValue)}</span>}
              {wonValue > 0 && <span className="text-green-700">Ganhos: {formatCurrency(wonValue)}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {closerLeads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#d1d5db] bg-white py-12 text-center">
          <Target className="mx-auto h-8 w-8 text-[#94a3b8]" />
          <p className="mt-3 text-sm font-semibold text-[#64748b]">Nenhuma negociacao ativa</p>
          <p className="mt-1 text-xs text-[#94a3b8]">Avance leads no pipeline para que aparecam aqui.</p>
          <Link href="/admin/crm" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#1565C0] hover:underline">
            Ir para o pipeline
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Empresa</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Valor</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Fase</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Dias</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] md:table-cell">Proxima Acao</th>
                <th className="hidden px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b] lg:table-cell">BANT</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {closerLeads.map((lead) => {
                const days = daysSince(lead.created_at)
                const score = scoresByLead.get(lead.id)
                const recentActivities = activitiesByLead.get(lead.id)?.slice(0, 2) ?? []

                return (
                  <tr key={lead.id} className="bg-white hover:bg-[#f8fafc]">
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-[#0f172a]">{lead.company_name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{lead.full_name} {lead.whatsapp !== 'Nao informado' ? `| ${lead.whatsapp}` : ''}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      {lead.estimated_value && lead.estimated_value > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#065f46]">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(lead.estimated_value)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">--</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">
                      <span className="rounded bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                        {PIPELINE_LABELS[lead.pipeline_stage] ?? lead.pipeline_stage}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${days > 14 ? 'text-[#dc2626]' : days > 7 ? 'text-[#f59e0b]' : 'text-[#64748b]'}`}>
                        <Clock className="h-3 w-3" />
                        {days}d
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">
                      {lead.next_action ? (
                        <span className="text-xs text-[#374151]">{lead.next_action}</span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">Nenhuma</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2.5 lg:table-cell">
                      {score ? (
                        <span className="rounded bg-[#eef2ff] px-2 py-0.5 text-[11px] font-bold text-[#4338ca]">
                          {score.total_score}/20
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#cbd5e1]">--</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {/* Fechar Ganho */}
                        <form action={updateLeadPipeline}>
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <input type="hidden" name="pipeline_stage" value="won" />
                          <input type="hidden" name="temperature" value="hot" />
                          <button
                            type="submit"
                            className="inline-flex h-7 items-center gap-1 rounded bg-[#16a34a] px-2 text-[10px] font-bold text-white hover:bg-[#15803d]"
                            title="Fechar como ganho"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Ganho
                          </button>
                        </form>

                        {/* Marcar Perdido */}
                        <form action={updateLeadPipeline}>
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <input type="hidden" name="pipeline_stage" value="lost" />
                          <input type="hidden" name="temperature" value="cold" />
                          <button
                            type="submit"
                            className="inline-flex h-7 items-center gap-1 rounded border border-[#fecaca] bg-[#fef2f2] px-2 text-[10px] font-bold text-[#dc2626] hover:bg-[#fecaca]"
                            title="Marcar como perdido"
                          >
                            <XCircle className="h-3 w-3" />
                            Perdido
                          </button>
                        </form>

                        {/* Add note */}
                        <form action={addActivity} className="flex items-center gap-1">
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <input type="hidden" name="activity_type" value="note" />
                          <input
                            name="title"
                            placeholder="Nota..."
                            className="h-7 w-28 rounded border border-[#d1d5db] px-2 text-[10px] outline-none focus:border-[#1565C0]"
                          />
                          <button
                            type="submit"
                            className="inline-flex h-7 items-center justify-center rounded border border-[#d1d5db] px-1.5 text-[#64748b] hover:bg-[#f3f4f6]"
                            title="Salvar nota"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </button>
                        </form>
                      </div>

                      {/* Recent activities */}
                      {recentActivities.length > 0 && (
                        <div className="mt-1.5 space-y-0.5">
                          {recentActivities.map((a) => (
                            <p key={a.id} className="truncate text-[10px] text-[#94a3b8]">
                              {a.title} - {new Date(a.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Won leads summary */}
      {wonLeads.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-bold text-[#0f172a]">Fechados recentes ({wonLeads.length})</h2>
          <div className="overflow-x-auto rounded-lg border border-[#bbf7d0]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#bbf7d0] bg-[#f0fdf4]">
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Empresa</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Valor</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase text-[#166534]">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcfce7]">
                {wonLeads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="bg-white">
                    <td className="px-3 py-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{lead.company_name}</p>
                      <p className="text-[10px] text-[#64748b]">{lead.full_name}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-bold text-[#065f46]">
                        {lead.estimated_value ? formatCurrency(lead.estimated_value) : '--'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-[#64748b]">
                      {new Date(lead.updated_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
