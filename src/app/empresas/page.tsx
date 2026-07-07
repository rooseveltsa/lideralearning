import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Handshake, Layers3, ShieldCheck, Users2 } from 'lucide-react'
import SmoothScroll from '@/components/motion/SmoothScroll'
import Reveal from '@/components/motion/Reveal'
import SplitHeading from '@/components/motion/SplitHeading'
import CountUp from '@/components/motion/CountUp'
import Magnetic from '@/components/motion/Magnetic'
import TiltCard from '@/components/motion/TiltCard'

const differentiators = [
  {
    icon: Layers3,
    color: '#ec6411',
    title: 'Arquitetura híbrida',
    description: 'Combinamos academy digital, encontros ao vivo e programas presenciais em uma jornada contínua.',
  },
  {
    icon: BarChart3,
    color: '#0f8f3a',
    title: 'Medição operacional',
    description: 'Evolução por competência, taxa de conclusão e histórico de aplicação prática com visão para RH e liderança.',
  },
  {
    icon: ShieldCheck,
    color: '#1855bd',
    title: 'Governança e rastreabilidade',
    description: 'Fluxo auditável de lead, proposta, matrícula, progresso e certificação em um único ecossistema.',
  },
  {
    icon: Users2,
    color: '#cc4f06',
    title: 'Curadoria por perfil',
    description: 'Trilhas diferentes para coordenadores, gerentes e diretoria, respeitando maturidade e contexto do time.',
  },
]

const deliveryModel = [
  {
    step: '01',
    color: '#ec6411',
    title: 'Diagnóstico do cenário',
    description: 'Mapeamos estrutura de liderança, gargalos de execução e metas de negócio para priorizar competências críticas.',
  },
  {
    step: '02',
    color: '#0f8f3a',
    title: 'Desenho da trilha',
    description: 'Configuramos plano de formação por público interno, combinando módulos digitais, workshops e checkpoints.',
  },
  {
    step: '03',
    color: '#1855bd',
    title: 'Execução guiada',
    description: 'Ativamos a trilha com acompanhamento de engajamento, ritos de aplicação e suporte de customer success.',
  },
  {
    step: '04',
    color: '#fb7d2e',
    title: 'Leitura de impacto',
    description: 'Consolidamos indicadores para RH e diretoria com recomendações de continuidade, expansão ou ajuste de rota.',
  },
]

const plans = [
  {
    name: 'Starter',
    audience: 'Times menores e operação em estruturação',
    price: 'A partir de R$ 997/mês',
    items: ['Até 25 acessos corporativos', 'Trilhas essenciais de liderança', 'Relatórios de engajamento'],
    highlight: false,
  },
  {
    name: 'Growth',
    audience: 'Empresas em escala e múltiplas lideranças',
    price: 'A partir de R$ 2.497/mês',
    items: ['Até 100 acessos corporativos', 'Academy completa + encontros ao vivo', 'Acompanhamento estratégico dedicado'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    audience: 'Operações de grande porte e alta complexidade',
    price: 'Proposta sob demanda',
    items: ['Acessos ilimitados', 'Programa híbrido customizado', 'Integrações e governança avançada'],
    highlight: false,
  },
]

export default function EmpresasPage() {
  return (
    <SmoothScroll>
    <div className="ld-deep min-h-screen">
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ═══ HERO ═══ */}
        <section className="relative px-6 pb-24 pt-32" style={{ borderBottom: '1px solid rgba(245,241,234,0.10)' }}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 12% 0%, rgba(236,100,17,0.16), transparent 42%), radial-gradient(circle at 88% 20%, rgba(15,143,58,0.12), transparent 44%)' }}
          />

          <div className="relative mx-auto grid w-full max-w-[1280px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <Reveal y={20}>
                <p className="ld-badge ld-badge-deep-line inline-flex items-center gap-2">
                  <Handshake className="h-3.5 w-3.5" />
                  Lidera Corporativo
                </p>
              </Reveal>

              <SplitHeading
                as="h1"
                delay={0.1}
                className="ld-display max-w-3xl"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', color: '#f5f1ea' }}
              >
                Treinamento corporativo com <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>lógica de operação,</em> não apenas conteúdo.
              </SplitHeading>

              <Reveal delay={0.35}>
                <p className="max-w-2xl text-lg leading-relaxed" style={{ color: 'rgba(245,241,234,0.75)' }}>
                  Estruturamos jornadas híbridas para desenvolver liderança em escala. Da entrada do lead ao relatório de impacto, toda a experiência fica centralizada na plataforma.
                </p>
              </Reveal>

              <Reveal delay={0.5} className="flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <a href="#diagnostico" className="ld-btn-primary ld-btn-primary-xl">
                    Solicitar diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link href="/cursos" className="ld-btn-outline-light ld-btn-primary-xl">
                    Ver programas digitais
                  </Link>
                </Magnetic>
              </Reveal>
            </div>

            <Reveal stagger={0.1} delay={0.3} className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Empresas atendidas', value: '200+' },
                { label: 'Gestores em formação', value: '5.000+' },
                { label: 'Tempo médio de resposta', value: '4h úteis' },
                { label: 'Modelo de entrega', value: 'Digital + Presencial' },
              ].map((item) => (
                <TiltCard
                  key={item.label}
                  max={4}
                  className="rounded-2xl p-5"
                  style={{ border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }}
                >
                  <p className="text-xs font-semibold" style={{ color: 'rgba(245,241,234,0.6)' }}>{item.label}</p>
                  <CountUp
                    value={item.value}
                    className="mt-2 font-heading text-3xl"
                    style={{ color: '#f5f1ea', letterSpacing: '-0.02em' }}
                  />
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ DIFERENCIAIS ═══ */}
        <section className="px-6 py-24" style={{ background: '#f5f1ea', color: '#070e1c' }}>
          <div className="mx-auto w-full max-w-[1280px]">
            <Reveal className="mb-12 max-w-3xl">
              <p className="ld-eyebrow">Diferenciais de plataforma</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
                Estrutura robusta para RH, business partner e líderes de área.
              </SplitHeading>
            </Reveal>

            <Reveal stagger={0.1} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {differentiators.map(({ icon: Icon, color, title, description }) => (
                <TiltCard key={title} className="ld-card p-7">
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: '#f1f4f9', color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="ld-h5" style={{ margin: 0, color: '#070e1c' }}>{title}</h3>
                  <p className="ld-body mt-3" style={{ margin: 0 }}>{description}</p>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ MODELO DE ENTREGA ═══ */}
        <section className="px-6 py-24" style={{ background: '#070e1c', borderTop: '1px solid rgba(245,241,234,0.10)', borderBottom: '1px solid rgba(245,241,234,0.10)' }}>
          <div className="mx-auto w-full max-w-[1280px]">
            <Reveal className="mb-12 max-w-3xl">
              <p className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Modelo de entrega</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#f5f1ea' }}>
                Fluxo de implantação orientado por evidência e execução.
              </SplitHeading>
            </Reveal>

            <Reveal stagger={0.1} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {deliveryModel.map((item) => (
                <TiltCard
                  key={item.step}
                  className="rounded-2xl p-6"
                  style={{ border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }}
                >
                  <p className="font-heading text-4xl" style={{ color: item.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{item.step}</p>
                  <h3 className="mt-4 text-xl font-bold" style={{ color: '#f5f1ea' }}>{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(245,241,234,0.65)' }}>{item.description}</p>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ PLANOS ═══ */}
        <section className="px-6 py-24" style={{ background: '#f5f1ea', color: '#070e1c' }}>
          <div className="mx-auto w-full max-w-[1280px]">
            <Reveal className="mb-12 max-w-3xl">
              <p className="ld-eyebrow">Planos de parceria</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
                Formato de contratação para diferentes estágios de maturidade.
              </SplitHeading>
            </Reveal>

            <Reveal stagger={0.12} className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <TiltCard
                  key={plan.name}
                  max={3}
                  className={plan.highlight ? 'flex h-full flex-col rounded-2xl p-7' : 'ld-card flex h-full flex-col p-7'}
                  style={
                    plan.highlight
                      ? { background: '#070e1c', color: '#f5f1ea', border: '1px solid rgba(236,100,17,0.45)', boxShadow: '0 22px 48px rgba(7,14,28,0.28)' }
                      : undefined
                  }
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: plan.highlight ? '#fb7d2e' : '#64748B' }}>
                    {plan.name}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl" style={{ color: plan.highlight ? '#f5f1ea' : '#070e1c', letterSpacing: '-0.02em' }}>
                    {plan.price}
                  </h3>
                  <p className="mt-3 text-sm" style={{ color: plan.highlight ? 'rgba(245,241,234,0.7)' : '#475569' }}>{plan.audience}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: plan.highlight ? 'rgba(245,241,234,0.85)' : '#334155' }}>
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: plan.highlight ? '#fb7d2e' : '#0f8f3a' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="#diagnostico" className={plan.highlight ? 'ld-btn-primary mt-7 justify-center' : 'ld-btn-outline mt-7 justify-center'}>
                    Falar com especialista
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ DIAGNÓSTICO / FORM ═══ */}
        <section id="diagnostico" className="relative overflow-hidden px-6 py-24" style={{ background: '#070e1c', borderTop: '1px solid rgba(245,241,234,0.10)' }}>
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 85% 30%, rgba(236,100,17,0.14), transparent 50%)' }} />
          <div className="relative mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal className="space-y-6">
              <p className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Próximo passo</p>
              <SplitHeading as="h2" className="ld-h2" style={{ color: '#f5f1ea' }}>
                Solicite um diagnóstico e desenhe a trilha ideal para sua operação.
              </SplitHeading>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(245,241,234,0.75)' }}>
                O formulário gera protocolo interno e abre o pipeline comercial da sua empresa dentro da plataforma Lidera.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl p-7"
                style={{ border: '1px solid rgba(245,241,234,0.14)', background: 'rgba(245,241,234,0.03)', boxShadow: '0 22px 45px rgba(2,6,23,0.5)' }}
              >
                <LeadFormB2B />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
    </SmoothScroll>
  )
}
