import { CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createPdiCheckoutSession } from '@/app/diagnostico/pessoal/pdi/[id]/checkout-actions'
import { PDI_PRICE_CENTS, formatBRLFromCents } from '@/lib/funnel'

const INCLUDED = [
  'Classificação do seu nível de liderança atual e meta de 90 dias',
  'Plano em 3 fases com ações semanais priorizadas',
  'Ferramentas práticas por competência (1:1, feedback, delegação)',
  'Rituais de sustentação e próximos passos',
  'Nota crítica personalizada sobre seu maior risco de estagnação',
  'PDF completo para imprimir e acompanhar com seu gestor',
]

type PdiPaywallProps = {
  diagnosticoId: string
  firstName: string
}

/** Paywall do PDI: valor simbólico que abre o funil de formação. */
export function PdiPaywall({ diagnosticoId, firstName }: PdiPaywallProps) {
  const checkoutAction = createPdiCheckoutSession.bind(null, diagnosticoId)

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-32 sm:px-6">
        <div className="mx-auto w-full max-w-[860px]">
          <div className="overflow-hidden rounded-3xl border border-[#E3EBF6] bg-white shadow-[0_22px_45px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#F1F5F9] bg-gradient-to-br from-[#FFF7ED] to-white p-8 sm:p-10">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ec6411] text-white">
                  <Sparkles className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ec6411]">
                    Seu PDI está pronto
                  </p>
                  <h1 className="mt-1 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                    {firstName}, seu plano de 90 dias foi gerado.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#475569]">
                    Cruzamos suas respostas com o framework LIDERA e montamos um plano de
                    desenvolvimento individual completo. Desbloqueie o acesso vitalício por um
                    valor único e simbólico.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">O que está incluso</p>
                <ul className="mt-4 space-y-3">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#334155]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f8f3a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-7 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Pagamento único</p>
                <p className="mt-2 font-heading text-5xl font-extrabold tracking-tight text-[#0F172A]">
                  {formatBRLFromCents(PDI_PRICE_CENTS)}
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">Acesso imediato e vitalício ao seu PDI</p>

                <form action={checkoutAction} className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ec6411] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#ec6411]/25 transition-all hover:bg-[#cc4f06] active:scale-[0.98]"
                  >
                    <Lock className="h-4 w-4" />
                    Desbloquear meu PDI completo
                  </button>
                </form>

                <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0f8f3a]" />
                  Pagamento seguro processado pela Stripe
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#94A3B8]">
            Dúvidas? Fale com a gente pelo WhatsApp antes de desbloquear — sem compromisso.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
