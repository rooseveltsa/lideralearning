import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, CheckCircle2, MessageCircle, Users, Zap } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createAdminClient } from '@/lib/supabase/service'

export const metadata: Metadata = {
  title: 'Planos & Preços | LIDERA Academy',
  description: 'Escolha o plano ideal para desenvolver líderes na sua empresa. Academy streaming, imersões presenciais e mentoria.',
}

type PlanRow = {
  id: string
  name: string
  slug: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
  max_users: number | null
  features: string[]
  is_active: boolean
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const planIcons: Record<string, typeof Zap> = {
  starter: Users,
  growth: Zap,
  enterprise: BadgeCheck,
}

const planHighlight: Record<string, boolean> = {
  growth: true,
}

export default async function PricingPage() {
  const admin = createAdminClient()

  const { data: plans } = await admin
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const planList = (plans as PlanRow[] | null) || []
  const tableMissing = planList.length === 0

  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative border-b border-[#1A2438] px-6 pb-16 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1565C0]/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">Planos & Preços</p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Invista no desenvolvimento dos seus líderes
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
              Do supervisor recém-promovido ao executivo sênior — escolha o plano que melhor atende sua operação.
            </p>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-[1280px]">
            {tableMissing ? (
              <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
                <p className="text-sm font-bold text-amber-200">Planos ainda não configurados.</p>
                <p className="mt-1 text-xs text-amber-300/70">
                  Execute <code className="rounded bg-amber-500/20 px-1.5 py-0.5">docs/database/17_subscriptions.sql</code> no Supabase.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {planList.map((plan) => {
                  const Icon = planIcons[plan.slug] || Users
                  const isHighlighted = planHighlight[plan.slug]
                  const isEnterprise = plan.slug === 'enterprise'

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-3xl border p-8 ${
                        isHighlighted
                          ? 'border-[#F57C00]/40 bg-gradient-to-b from-[#1A0800] to-[#0A1324] shadow-[0_0_60px_rgba(245,124,0,0.08)]'
                          : 'border-[#22314B] bg-[#0A1324]'
                      }`}
                    >
                      {isHighlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#F57C00] px-4 py-1 text-xs font-bold text-white">
                          Mais popular
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                          isHighlighted ? 'bg-[#F57C00]/20 text-[#F57C00]' : 'bg-[#1565C0]/20 text-[#1E88E5]'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-xs text-[#7FA0C2]">{plan.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-6">
                        {isEnterprise ? (
                          <div>
                            <p className="font-heading text-4xl font-extrabold text-white">Sob consulta</p>
                            <p className="mt-1 text-sm text-[#7FA0C2]">Personalizado para sua empresa</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-heading text-4xl font-extrabold text-white">
                              {formatCurrency(plan.price_monthly)}
                              <span className="text-lg font-medium text-[#64748B]">/mês</span>
                            </p>
                            {plan.price_yearly && plan.price_yearly > 0 && (
                              <p className="mt-1 text-sm text-[#7FA0C2]">
                                ou {formatCurrency(plan.price_yearly)}/ano (economia de {formatCurrency(plan.price_monthly * 12 - plan.price_yearly)})
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Capacity */}
                      {plan.max_users && (
                        <p className="mt-3 text-sm font-semibold text-[#A9BDD8]">
                          Até {plan.max_users} usuários
                        </p>
                      )}
                      {!plan.max_users && isEnterprise && (
                        <p className="mt-3 text-sm font-semibold text-[#A9BDD8]">Usuários ilimitados</p>
                      )}

                      {/* Features */}
                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isHighlighted ? 'text-[#F57C00]' : 'text-[#1E88E5]'
                            }`} />
                            <span className="text-sm text-[#D4E4F6]">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="mt-8">
                        {isEnterprise ? (
                          <a
                            href="https://wa.me/5564996099020?text=Ol%C3%A1!%20Tenho%20interesse%20no%20plano%20Enterprise%20da%20LIDERA."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#335077] py-4 text-base font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Falar com consultor
                          </a>
                        ) : (
                          <Link
                            href="/contato"
                            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all ${
                              isHighlighted
                                ? 'bg-[#F57C00] shadow-lg shadow-[#F57C00]/25 hover:bg-[#E65100]'
                                : 'bg-[#1E88E5] shadow-lg shadow-[#1E88E5]/25 hover:bg-[#1565C0]'
                            }`}
                          >
                            Começar agora
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[#1A2438] px-6 py-16">
          <div className="mx-auto max-w-[800px]">
            <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-white">Dúvidas sobre os planos</h2>
            <div className="space-y-3">
              {[
                { q: 'Posso mudar de plano depois?', a: 'Sim. Você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente.' },
                { q: 'Existe período de teste?', a: 'Oferecemos 7 dias de teste gratuito no plano Starter e Growth para você avaliar a plataforma.' },
                { q: 'Como funciona o pagamento?', a: 'Cobrança mensal ou anual via cartão de crédito. Emitimos nota fiscal para todos os planos.' },
                { q: 'O que acontece se eu cancelar?', a: 'Seus dados ficam disponíveis até o fim do período pago. Após isso, a conta é pausada mas não deletada.' },
              ].map((item) => (
                <details key={item.q} className="group overflow-hidden rounded-xl border border-[#23334D] bg-[#0A1324]">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#8FA8C5] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="border-t border-[#1D2D45] px-5 py-4 text-sm leading-relaxed text-[#A9BDD8]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
