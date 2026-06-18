import type { Metadata } from 'next'
import { ShieldCheck, Clock, Lock } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import ClimaForm from '@/components/clima/ClimaForm'

export const metadata: Metadata = {
  title: 'Pesquisa de Clima | Lidera Treinamentos',
  description:
    'Pesquisa de clima anônima. Sua opinião sobre o ambiente de trabalho e a liderança, sem identificação.',
}

// Pesquisa anônima — não exige login.
export default function PesquisaClimaPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-[820px]">
          <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
                Pesquisa de clima
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
                Sua opinião, de forma anônima
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
                Queremos saber como você enxerga o ambiente de trabalho e a liderança no seu setor.
                Responda com sinceridade — é rápido e ajuda a melhorar o dia a dia de todos.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1565C0]" />
                  ~10 minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#1565C0]" />
                  100% anônimo
                </span>
              </div>
            </div>

            {/* Aviso de anonimato — gera confiança e respostas sinceras */}
            <div className="mt-6 rounded-2xl border border-[#BFE3FF] bg-[#F0F8FF] p-4 text-sm leading-relaxed text-[#334155]">
              <p className="font-bold text-[#0F4C81]">É anônimo de verdade.</p>
              <p className="mt-1">
                Não pedimos nome, crachá nem matrícula. Pedimos apenas o seu <strong>setor</strong>,
                e os resultados só são divulgados por setor quando há pelo menos 5 respostas — assim
                ninguém é identificado. Esta pesquisa <strong>não avalia você</strong> e não é o
                canal para denúncia individual: em caso de assédio, risco ou sofrimento, procure o
                RH, a CIPA ou o canal de denúncia da empresa.
              </p>
            </div>

            <div className="mt-8 border-t border-[#E3EBF6] pt-8">
              <ClimaForm />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
