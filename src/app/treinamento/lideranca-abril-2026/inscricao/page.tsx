import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import InscricaoForm from '@/components/treinamento/InscricaoForm'

export const metadata: Metadata = {
  title: 'Inscrição — Treinamento para Líderes e Supervisores | LIDERA',
  description: 'Inscreva-se no treinamento presencial para líderes e supervisores. 09 e 10 de Abril 2026, Catalão - GO. Turmas de no máximo 10 pessoas.',
}

export default function InscricaoPage() {
  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="px-6 pb-24 pt-36">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <Link
                href="/treinamento/lideranca-abril-2026"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#9AB2CE] transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o treinamento
              </Link>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">Inscrição</p>
                <h1 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                  Treinamento para Líderes e Supervisores
                </h1>
              </div>

              <p className="text-base leading-relaxed text-[#A9BDD8]">
                Preencha seus dados para garantir sua vaga. Após a inscrição, o mentor Claudemir entrará em
                contato para confirmar sua participação e enviar os detalhes do evento.
              </p>

              <div className="space-y-3">
                {[
                  { icon: CalendarDays, text: '09 e 10 de Abril de 2026' },
                  { icon: MapPin, text: 'Catalão — GO (presencial)' },
                  { icon: Users, text: 'Máximo 10 participantes' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-[#9AB2CE]">
                    <Icon className="h-4 w-4 text-[#1E88E5]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-7 shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
              <InscricaoForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
