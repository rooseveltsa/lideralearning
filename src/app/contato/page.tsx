import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import Link from 'next/link'
import { ArrowRight, Building2, CalendarClock, Mail, MessageCircle } from 'lucide-react'
import { CONTACT } from '@/lib/config/contact'
import SmoothScroll from '@/components/motion/SmoothScroll'
import Reveal from '@/components/motion/Reveal'
import SplitHeading from '@/components/motion/SplitHeading'
import Magnetic from '@/components/motion/Magnetic'
import TiltCard from '@/components/motion/TiltCard'

const channels = [
  {
    icon: Mail,
    label: 'E-mail comercial',
    value: CONTACT.email.commercial,
    href: CONTACT.email.commercialMailto,
  },
  {
    icon: MessageCircle,
    label: `Falar com ${CONTACT.owner.name}`,
    value: CONTACT.whatsapp.display,
    href: `${CONTACT.whatsapp.url}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Lidera%20Treinamentos`,
  },
]

const checklist = [
  'Número de líderes que participarão da jornada',
  'Meta principal (retenção, performance, onboarding, cultura)',
  'Prazo desejado de implantação',
  'Formato prioritário (digital, presencial ou híbrido)',
]

export default function ContatoPage() {
  return (
    <SmoothScroll>
    <div className="min-h-screen" style={{ background: '#f5f1ea', color: '#070e1c' }}>
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ═══ HERO ═══ */}
        <section className="relative px-6 pb-20 pt-32" style={{ borderBottom: '1px solid rgba(7,14,28,0.08)' }}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 15% 0%, rgba(236,100,17,0.10), transparent 45%), radial-gradient(circle at 85% 15%, rgba(15,143,58,0.08), transparent 50%)' }}
          />
          <div className="relative mx-auto w-full max-w-[1200px]">
            <Reveal y={20}>
              <p className="ld-badge ld-badge-orange inline-flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                Contato comercial
              </p>
            </Reveal>
            <SplitHeading
              as="h1"
              delay={0.1}
              className="ld-display mt-6 max-w-4xl"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', color: '#070e1c' }}
            >
              Vamos desenhar a melhor entrada para seu cenário de <em style={{ fontStyle: 'normal', color: '#ec6411' }}>liderança.</em>
            </SplitHeading>
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: '#4a5060' }}>
                Fale com nosso time para estruturar um plano de treinamento robusto. O formulário abaixo gera protocolo imediato no pipeline comercial da plataforma.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══ CANAIS + FORM ═══ */}
        <section className="px-6 py-24" style={{ background: '#fdfcfa' }}>
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal stagger={0.12} className="space-y-8">
              <div className="ld-card p-7">
                <p className="ld-eyebrow">Canais diretos</p>
                <div className="mt-5 space-y-4">
                  {channels.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 rounded-xl p-4 transition-colors"
                      style={{ border: '1px solid rgba(7,14,28,0.08)', background: '#fff' }}
                    >
                      <span
                        className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: '#f1f4f9', color: '#ec6411' }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: '#64748B' }}>{label}</p>
                        <p className="mt-1 text-sm font-bold" style={{ color: '#070e1c' }}>{value}</p>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="ld-card p-7">
                <p className="ld-eyebrow">Para acelerar o diagnóstico</p>
                <ul className="mt-5 space-y-2.5">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#334155' }}>
                      <ArrowRight className="h-4 w-4 shrink-0" style={{ color: '#ec6411' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-6 rounded-xl p-4 text-sm font-semibold"
                  style={{ border: '1px solid rgba(236,100,17,0.25)', background: 'rgba(236,100,17,0.07)', color: '#cc4f06' }}
                >
                  SLA de resposta: até 4 horas úteis para novos contatos corporativos.
                </div>
              </div>

              <div className="ld-card p-7">
                <p className="ld-eyebrow">Também disponível</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link href="/cursos" className="ld-btn-outline justify-center">
                    Ver programas digitais
                  </Link>
                  <Magnetic>
                    <Link href="/empresas" className="ld-btn-primary justify-center">
                      Solução B2B
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                className="rounded-3xl p-7"
                style={{ background: '#070e1c', border: '1px solid rgba(245,241,234,0.12)', boxShadow: '0 22px 45px rgba(7,14,28,0.35)' }}
              >
                <LeadFormB2B />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ GARANTIAS ═══ */}
        <section className="px-6 py-20" style={{ background: '#070e1c', color: '#f5f1ea' }}>
          <Reveal stagger={0.12} className="mx-auto grid w-full max-w-[1200px] gap-6 md:grid-cols-3">
            {[
              { label: 'Modelo de atendimento', value: 'Consultivo', icon: Building2, color: '#fb7d2e' },
              { label: 'Resposta comercial', value: 'Até 4h úteis', icon: CalendarClock, color: '#2eb555' },
              { label: 'Cobertura', value: 'Brasil inteiro', icon: MessageCircle, color: '#5d92f7' },
            ].map(({ label, value, icon: Icon, color }) => (
              <TiltCard
                key={label}
                max={3}
                className="rounded-2xl p-6"
                style={{ border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(245,241,234,0.6)' }}>{label}</p>
                <p className="mt-1 font-heading text-2xl" style={{ color: '#f5f1ea', letterSpacing: '-0.02em' }}>{value}</p>
              </TiltCard>
            ))}
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
    </SmoothScroll>
  )
}
