// Tabela de Convergência — replica visualmente o documento Fernanda Campos.

import type { PdiConvergenciaPoint } from '@/lib/diagnostico/pdi-types'

const CONVERGENCE_STYLE: Record<string, { bg: string; color: string }> = {
  Alta: { bg: '#ECFDF5', color: '#15803D' },
  Média: { bg: '#FFFBEB', color: '#9A3412' },
  Baixa: { bg: '#FEF2F2', color: '#B91C1C' },
}

export function PdiConvergencia({
  resumo,
  pontos,
}: {
  resumo: string
  pontos: PdiConvergenciaPoint[]
}) {
  return (
    <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
      <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
        Convergência de Alinhamento
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#475569]">{resumo}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3EBF6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFD]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                  Ponto de Análise
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                  Sua Percepção
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                  Percepção Externa
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#64748B]">
                  Convergência
                </th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p, i) => {
                const style = CONVERGENCE_STYLE[p.convergencia] || CONVERGENCE_STYLE['Média']
                return (
                  <tr key={i} className="border-t border-[#E3EBF6]">
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-[#0F172A]">{p.analise}</p>
                    </td>
                    <td className="px-4 py-3 align-top text-[#334155]">{p.percepcaoPessoal}</td>
                    <td className="px-4 py-3 align-top text-[#334155]">{p.percepcaoExterna}</td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {p.convergencia}
                      </span>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">{p.comentario}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
