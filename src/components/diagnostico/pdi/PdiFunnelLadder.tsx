import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FUNNEL_LADDER } from '@/lib/funnel'

/** Escada de ofertas ao final do PDI: do presencial ao programa corporativo. */
export function PdiFunnelLadder() {
  return (
    <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10 print:hidden">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ec6411]">Sua escada de evolução</p>
      <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
        O PDI é o mapa. Estes são os próximos degraus.
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">
        Cada etapa aprofunda a anterior — do plano individual à transformação da operação inteira.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {FUNNEL_LADDER.map((step) => (
          <div
            key={step.degrau}
            className={`flex flex-col rounded-2xl border p-6 ${
              step.highlight ? 'border-[#ec6411]/45 bg-[#FFF7ED]' : 'border-[#E3EBF6] bg-[#F8FAFD]'
            }`}
          >
            <p className="font-heading text-3xl" style={{ color: step.highlight ? '#ec6411' : '#94A3B8', letterSpacing: '-0.02em' }}>
              {step.degrau}
            </p>
            <h3 className="mt-3 text-base font-extrabold text-[#0F172A]">{step.title}</h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-[#475569]">{step.description}</p>
            <Link
              href={step.href}
              className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                step.highlight
                  ? 'bg-[#ec6411] text-white hover:bg-[#cc4f06]'
                  : 'border border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#ec6411]/40 hover:text-[#ec6411]'
              }`}
            >
              {step.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
