import Link from 'next/link'
import { CheckCircle2, MessageCircle, Home, ArrowRight } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata = {
  title: 'Diagnóstico enviado · Lidera Treinamentos',
  description: 'Diagnóstico empresarial recebido com sucesso.',
}

export default function DiagnosticoEmpresaSucessoPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-6 pb-20 pt-32">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="rounded-3xl border border-[#E3EBF6] bg-white p-10 text-center shadow-[0_22px_45px_rgba(2,6,23,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#10B981]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
              Diagnóstico enviado com sucesso!
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
              Recebemos o mapeamento do supervisor. O <strong>Claudemir</strong> vai analisar
              pessoalmente e entrar em contato em até <strong>24 horas úteis</strong> com a leitura
              completa e proposta de próximos passos.
            </p>

            <div className="mt-8 rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-6 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
                Próximos passos
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1565C0]" />
                  <span>
                    Você vai receber um <strong>email de confirmação</strong> com o resumo do
                    mapeamento (fit de expectativa + perfil DISC).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1565C0]" />
                  <span>
                    Claudemir entra em contato pelo <strong>WhatsApp informado</strong> para
                    agendar uma conversa de 30 minutos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1565C0]" />
                  <span>
                    Após a conversa, você recebe uma <strong>proposta personalizada</strong> de
                    PDI e formato de treinamento.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/5564996099020?text=Ol%C3%A1%20Claudemir%2C%20acabei%20de%20enviar%20o%20diagn%C3%B3stico%20de%20supervisor%20pelo%20site!"
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
              Quer avaliar outro supervisor?{' '}
              <Link href="/diagnostico/empresa" className="font-semibold text-[#1565C0] hover:underline">
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
