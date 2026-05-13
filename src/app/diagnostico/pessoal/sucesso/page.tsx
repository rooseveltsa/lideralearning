import Link from 'next/link'
import { CheckCircle2, MessageCircle, Home, ArrowRight } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata = {
  title: 'PDI gerado · Lidera Treinamentos',
  description: 'Sua autoavaliação foi recebida com sucesso.',
}

export default function DiagnosticoPessoalSucessoPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-6 pb-20 pt-32">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="rounded-3xl border border-[#E3EBF6] bg-white p-10 text-center shadow-[0_22px_45px_rgba(2,6,23,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F57C00]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
              Seu PDI inicial está pronto!
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
              Recebemos sua autoavaliação e construímos a primeira versão do seu Plano de
              Desenvolvimento Individual. O <strong>Claudemir</strong> vai analisar pessoalmente e
              entrar em contato em até <strong>24 horas úteis</strong>.
            </p>

            <div className="mt-8 rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-6 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#F57C00]">
                Próximos passos
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57C00]" />
                  <span>Você receberá um <strong>email de confirmação</strong> com o resumo do seu mapeamento (autoavaliação + radar + DISC).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57C00]" />
                  <span>Claudemir entra em contato para uma <strong>conversa de 30 min</strong> e leitura personalizada do seu PDI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57C00]" />
                  <span>Após a conversa, você decide se quer entrar no <strong>programa LIDERA completo</strong> (presencial + 60 dias de mentoria).</span>
                </li>
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/5564996099020?text=Ol%C3%A1%20Claudemir%2C%20acabei%20de%20fazer%20meu%20PDI%20pelo%20site!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar agora com Claudemir
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C8DAEE] bg-white px-6 py-3 text-sm font-bold text-[#0B4A8F] transition-colors hover:bg-[#EFF5FD]"
              >
                <Home className="h-4 w-4" />
                Voltar para a home
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#94A3B8]">
              Quer fazer outro diagnóstico?{' '}
              <Link href="/diagnostico" className="font-semibold text-[#1565C0] hover:underline">
                Novo diagnóstico
                <ArrowRight className="ml-0.5 inline h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
