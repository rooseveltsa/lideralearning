import type { Metadata } from 'next'
import { ShieldCheck, Clock, Lock } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import CulturaForm from '@/components/cultura/CulturaForm'
import { getOrg } from '@/lib/surveys/orgs'

export const metadata: Metadata = {
  title: 'Termômetro da Cultura Preventiva | Lidera Treinamentos',
  description:
    'Diagnóstico anônimo de cultura de segurança e segurança psicológica no chão de fábrica. Mede o estágio de maturidade da prevenção por setor, sem identificar ninguém.',
}

// Pesquisa anônima — não exige login.
export default async function PesquisaCulturaPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>
}) {
  const { org } = await searchParams
  const empresa = await getOrg(org)

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
                Cultura preventiva
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
                Como a prevenção funciona no seu setor?
              </h1>
              {empresa && (
                <p className="mt-2 text-sm font-semibold text-[#0F4C81]">
                  Empresa: {empresa.nome}
                </p>
              )}
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
                Queremos saber, de forma anônima, como a segurança funciona de verdade no seu dia a
                dia — se a liderança dá o exemplo, se dá para falar dos riscos sem medo e se a equipe
                aprende com o erro. Responda com sinceridade.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1565C0]" />
                  ~8 a 12 minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#1565C0]" />
                  100% anônimo
                </span>
              </div>
            </div>

            {/* Aviso de anonimato e escopo — gera confiança e respostas sinceras */}
            <div className="mt-6 rounded-2xl border border-[#BFE3FF] bg-[#F0F8FF] p-4 text-sm leading-relaxed text-[#334155]">
              <p className="font-bold text-[#0F4C81]">É anônimo de verdade.</p>
              <p className="mt-1">
                Não pedimos nome, crachá nem matrícula. Pedimos apenas o seu <strong>setor</strong>,
                e os resultados só são divulgados por setor quando há pelo menos 5 respostas — assim
                ninguém é identificado. Este é um <strong>diagnóstico de cultura do setor</strong>,
                não avalia você individualmente, não é avaliação de saúde mental e não substitui o
                levantamento legal de riscos psicossociais (NR-1/GRO/PGR) feito pelo SESMT/RH. Em
                caso de assédio, ameaça, violência ou sofrimento, use o canal de denúncia da empresa
                ou o campo aberto no fim desta pesquisa, lido em sigilo.
              </p>
            </div>

            <div className="mt-8 border-t border-[#E3EBF6] pt-8">
              <CulturaForm orgCode={empresa?.code ?? null} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
