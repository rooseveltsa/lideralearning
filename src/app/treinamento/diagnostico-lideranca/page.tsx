import type { Metadata } from 'next'
import { ClipboardCheck } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import DiagnosticoLiderancaForm from '@/components/treinamento/DiagnosticoLiderancaForm'

export const metadata: Metadata = {
  title: 'Diagnóstico de Liderança Estratégica | LIDERA',
  description:
    'Formulário de diagnóstico de liderança estratégica e alinhamento de performance. Avalie suas competências, identifique gaps e construa seu plano de ação de 12 semanas.',
}

export default function DiagnosticoLiderancaPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#F8FAFD] to-white">
        {/* Hero */}
        <section className="border-b border-[#E3EBF6] bg-white px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1565C0]/10">
              <ClipboardCheck className="h-7 w-7 text-[#1565C0]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1565C0]">
              Formulário 1.4.1
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Diagnóstico de Liderança Estratégica e Alinhamento de Performance
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B]">
              Este diagnóstico atua como o elo vital entre a visão da diretoria e a execução no chão de fábrica.
              Ao preenchê-lo, você adota o <strong className="text-[#0F172A]">&quot;Senso de Dono&quot;</strong>: uma postura
              de autorresponsabilidade onde cada decisão é pautada como se o resultado da operação fosse seu.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <DiagnosticoLiderancaForm />
          </div>
        </section>

        {/* Quote */}
        <section className="border-t border-[#E3EBF6] bg-[#F8FAFD] px-4 py-8">
          <p className="mx-auto max-w-xl text-center text-sm font-semibold italic text-[#64748B]">
            &quot;Liderar é inspirar. Transforme dados em decisões e pessoas em talentos.&quot;
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
