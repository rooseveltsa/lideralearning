import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata = {
  title: 'Autoavaliação de liderança · Lidera Treinamentos',
  description:
    'Autoavaliação comportamental, radar de pilares e Plano de Desenvolvimento Individual.',
}

export default function DiagnosticoPessoalPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-6 pb-20 pt-32">
        <div className="mx-auto w-full max-w-[860px]">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Trocar tipo de diagnóstico
          </Link>

          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F57C00]">
              <Construction className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Autoavaliação Profissional
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#64748B]">
              Formulário em construção — Fase 3 da implementação. Esta rota está pronta para
              receber o wizard de 8 seções (~100 campos) na próxima sessão de desenvolvimento.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-xs text-[#94A3B8]">
              Componentes UI base, schema Supabase e fluxo de submit já implementados. Aguardando
              encaixe das seções (Identificação, Autoavaliação, DISC pessoal, Módulos LIDERA,
              Reflexão, Radar 0-10, PDI, Alinhamento).
            </p>

            <Link
              href="/contato"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F]"
            >
              Falar diretamente com Claudemir
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
