import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, CheckCircle2, MessageCircle, Users, Zap } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createAdminClient } from '@/lib/supabase/service'
import SmoothScroll from '@/components/motion/SmoothScroll'
import Reveal from '@/components/motion/Reveal'
import SplitHeading from '@/components/motion/SplitHeading'
import Magnetic from '@/components/motion/Magnetic'
import TiltCard from '@/components/motion/TiltCard'

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
    <SmoothScroll>
    <div className="ld-deep">
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ═══ HERO ═══ */}
        <section className="relative px-6 pb-16 pt-32" style={{ borderBottom: '1px solid rgba(245,241,234,0.10)' }}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(236,100,17,0.12), transparent 55%)' }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <Reveal y={20}>
              <p className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Planos &amp; Preços</p>
            </Reveal>
            <SplitHeading
              as="h1"
              delay={0.1}
              className="ld-display mt-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f5f1ea' }}
            >
              Invista no desenvolvimento dos seus <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>líderes.</em>
            </SplitHeading>
            <Reveal delay={0.35}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: 'rgba(245,241,234,0.75)' }}>
                Do supervisor recém-promovido ao executivo sênior — escolha o plano que melhor atende sua operação.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══ PLANOS ═══ */}
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
              <Reveal stagger={0.12} className="grid gap-6 lg:grid-cols-3">
                {planList.map((plan) => {
                  const Icon = planIcons[plan.slug] || Users
                  const isHighlighted = planHighlight[plan.slug]
                  const isEnterprise = plan.slug === 'enterprise'

                  return (
                    <TiltCard
                      key={plan.id}
                      max={3}
                      className="relative rounded-3xl p-8"
                      style={
                        isHighlighted
                          ? {
                              border: '1px solid rgba(236,100,17,0.45)',
                              background: 'linear-gradient(180deg, rgba(236,100,17,0.10) 0%, rgba(245,241,234,0.03) 40%)',
                              boxShadow: '0 0 60px rgba(236,100,17,0.10)',
                            }
                          : { border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }
                      }
                    >
                      {isHighlighted && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                          style={{ background: '#ec6411' }}
                        >
                          Mais popular
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                          style={
                            isHighlighted
                              ? { background: 'rgba(236,100,17,0.18)', color: '#fb7d2e' }
                              : { background: 'rgba(245,241,234,0.08)', color: 'rgba(245,241,234,0.85)' }
                          }
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: '#f5f1ea' }}>{plan.name}</h3>
                          {plan.description && (
                            <p className="text-xs" style={{ color: 'rgba(245,241,234,0.6)' }}>{plan.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Preço */}
                      <div className="mt-6">
                        {isEnterprise ? (
                          <div>
                            <p className="font-heading text-4xl" style={{ color: '#f5f1ea', letterSpacing: '-0.02em' }}>Sob consulta</p>
                            <p className="mt-1 text-sm" style={{ color: 'rgba(245,241,234,0.6)' }}>Personalizado para sua empresa</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-heading text-4xl" style={{ color: '#f5f1ea', letterSpacing: '-0.02em' }}>
                              {formatCurrency(plan.price_monthly)}
                              <span className="text-lg font-medium" style={{ color: 'rgba(245,241,234,0.5)' }}>/mês</span>
                            </p>
                            {plan.price_yearly && plan.price_yearly > 0 && (
                              <p className="mt-1 text-sm" style={{ color: 'rgba(245,241,234,0.6)' }}>
                                ou {formatCurrency(plan.price_yearly)}/ano (economia de {formatCurrency(plan.price_monthly * 12 - plan.price_yearly)})
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Capacidade */}
                      {plan.max_users && (
                        <p className="mt-3 text-sm font-semibold" style={{ color: 'rgba(245,241,234,0.75)' }}>
                          Até {plan.max_users} usuários
                        </p>
                      )}
                      {!plan.max_users && isEnterprise && (
                        <p className="mt-3 text-sm font-semibold" style={{ color: 'rgba(245,241,234,0.75)' }}>Usuários ilimitados</p>
                      )}

                      {/* Recursos */}
                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0"
                              style={{ color: isHighlighted ? '#fb7d2e' : '#2eb555' }}
                            />
                            <span className="text-sm" style={{ color: 'rgba(245,241,234,0.85)' }}>{feature}</span>
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
                            className="ld-btn-outline-light w-full justify-center"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Falar com consultor
                          </a>
                        ) : (
                          <Magnetic>
                            <Link
                              href="/contato"
                              className={isHighlighted ? 'ld-btn-primary w-full justify-center' : 'ld-btn-outline-light w-full justify-center'}
                            >
                              Começar agora
                              <ArrowRight className="h-5 w-5" />
                            </Link>
                          </Magnetic>
                        )}
                      </div>
                    </TiltCard>
                  )
                })}
              </Reveal>
            )}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="px-6 py-16" style={{ borderTop: '1px solid rgba(245,241,234,0.10)' }}>
          <div className="mx-auto max-w-[800px]">
            <Reveal>
              <h2 className="mb-8 text-center font-heading text-2xl" style={{ color: '#f5f1ea', letterSpacing: '-0.02em' }}>
                Dúvidas sobre os planos
              </h2>
            </Reveal>
            <Reveal stagger={0.08} className="space-y-3">
              {[
                { q: 'Posso mudar de plano depois?', a: 'Sim. Você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente.' },
                { q: 'Existe período de teste?', a: 'Oferecemos 7 dias de teste gratuito no plano Starter e Growth para você avaliar a plataforma.' },
                { q: 'Como funciona o pagamento?', a: 'Cobrança mensal ou anual via cartão de crédito. Emitimos nota fiscal para todos os planos.' },
                { q: 'O que acontece se eu cancelar?', a: 'Seus dados ficam disponíveis até o fim do período pago. Após isso, a conta é pausada mas não deletada.' },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl"
                  style={{ border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold [&::-webkit-details-marker]:hidden" style={{ color: '#f5f1ea' }}>
                    {item.q}
                    <span className="text-lg transition-transform duration-200 group-open:rotate-45" style={{ color: '#fb7d2e' }}>+</span>
                  </summary>
                  <p className="px-5 py-4 text-sm leading-relaxed" style={{ borderTop: '1px solid rgba(245,241,234,0.10)', color: 'rgba(245,241,234,0.7)' }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
    </SmoothScroll>
  )
}
