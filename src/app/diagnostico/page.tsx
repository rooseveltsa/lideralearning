import Link from 'next/link'
import { Building2, User, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata = {
  title: 'Diagnóstico de Liderança · Lidera Treinamentos',
  description:
    'Comece pelo diagnóstico gratuito. Identificamos gaps comportamentais e construímos um Plano de Desenvolvimento Individual.',
}

const cards = [
  {
    href: '/diagnostico/empresa',
    icon: Building2,
    badge: 'Empresa',
    color: '#1565C0',
    bg: '#EFF6FE',
    title: 'Sou de uma empresa avaliando supervisores',
    description:
      'Mapeie expectativas, perfis e gaps de cada supervisor. Recebe um PDI individualizado e relatório executivo para o RH.',
    bullets: [
      'Avaliação por supervisor (estruturada)',
      'DISC comportamental + 8 módulos LIDERA',
      'Cruzamento expectativa × percepção',
    ],
    cta: 'Avaliar supervisores',
  },
  {
    href: '/diagnostico/pessoal',
    icon: User,
    badge: 'Profissional',
    color: '#F57C00',
    bg: '#FFF7ED',
    title: 'Sou supervisor / líder buscando crescimento',
    description:
      'Autoavaliação comportamental, radar de pilares e PDI personalizado para destravar a próxima etapa da sua carreira.',
    bullets: [
      'Autoidentificação DISC',
      'Radar de desenvolvimento (10 pilares)',
      'PDI com ações para próximos 90 dias',
    ],
    cta: 'Fazer minha autoavaliação',
  },
]

export default function DiagnosticoSelectorPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main>
        <section className="border-b border-[#DBE5F1] px-6 pb-12 pt-32">
          <div className="mx-auto w-full max-w-[1100px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C8DAEE] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              <Sparkles className="h-3.5 w-3.5" />
              Diagnóstico gratuito
            </p>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl">
              Antes do treinamento, o diagnóstico.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#475569]">
              Para entregarmos um Plano de Desenvolvimento Individual de verdade, precisamos
              entender quem está sendo avaliado. Escolha por onde começar:
            </p>

            <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                25-40 minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Confidencial e LGPD compliant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Resultado em até 24h
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid w-full max-w-[1100px] gap-6 lg:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3EBF6] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#C8DAEE] hover:shadow-[0_22px_45px_rgba(2,6,23,0.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: card.bg, color: card.color }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ backgroundColor: card.bg, color: card.color }}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="mt-5 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#0F172A]">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{card.description}</p>

                  <ul className="mt-5 space-y-2">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-[#334155]">
                        <span
                          className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: card.color }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="mt-7 inline-flex items-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-bold text-white transition-colors"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
