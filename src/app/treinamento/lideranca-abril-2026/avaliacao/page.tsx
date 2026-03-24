import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import AvaliacaoForm from '@/components/treinamento/AvaliacaoForm'

export const metadata: Metadata = {
  title: 'Avaliação Diagnóstica — Treinamento para Líderes | LIDERA',
  description: 'Faça a avaliação diagnóstica gratuita para líderes e supervisores. Descubra seus pontos fortes e áreas de desenvolvimento antes do treinamento.',
}

export default function AvaliacaoPage() {
  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="px-6 pb-24 pt-36">
          <div className="mx-auto w-full max-w-[800px]">
            <Link
              href="/treinamento/lideranca-abril-2026"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9AB2CE] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o treinamento
            </Link>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E88E5]/30 bg-[#1E88E5]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8CC1F7]">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Avaliação gratuita
              </div>

              <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Avaliação Diagnóstica de Liderança
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#A9BDD8]">
                Essa avaliação foi desenhada com perguntas diretamente ligadas à realidade do líder, já
                conectadas ao conteúdo do treinamento. A partir do resultado, será estruturado seu{' '}
                <strong className="text-white">PDI (Plano de Desenvolvimento Individual)</strong>.
              </p>
            </div>

            <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-7 shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
              <AvaliacaoForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
