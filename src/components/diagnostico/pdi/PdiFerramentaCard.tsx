// Card com explicação inline de uma ferramenta gerencial LIDERA.

import { getFerramenta } from '@/lib/diagnostico/pdi-knowledge'

export function PdiFerramentaCard({ ferramentaId }: { ferramentaId: string }) {
  const f = getFerramenta(ferramentaId)
  if (!f) return null

  return (
    <details className="group rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4">
      <summary className="flex cursor-pointer items-center justify-between gap-2 list-none">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-md bg-[#1565C0] px-2 text-[10px] font-extrabold uppercase tracking-wider text-white">
            {f.sigla}
          </span>
          <span className="text-sm font-bold text-[#0F172A]">{f.nome}</span>
        </span>
        <svg
          className="h-4 w-4 text-[#94A3B8] transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="mt-4 space-y-3">
        <p className="text-sm leading-relaxed text-[#334155]">{f.shortDescription}</p>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B]">
            Estrutura
          </p>
          <ul className="space-y-1">
            {f.estrutura.map((item, i) => (
              <li key={i} className="text-xs text-[#334155]">
                <strong className="text-[#0F172A]">{item.label}:</strong> {item.detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1565C0]">
            Aplicação prática
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#475569]">{f.exemploAplicacao}</p>
        </div>
      </div>
    </details>
  )
}
