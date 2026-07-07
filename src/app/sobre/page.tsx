import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import Link from 'next/link'
import { ArrowRight, Award, Compass, Gem, Handshake, Target, Users2 } from 'lucide-react'
import SmoothScroll from '@/components/motion/SmoothScroll'
import Reveal from '@/components/motion/Reveal'
import SplitHeading from '@/components/motion/SplitHeading'
import Magnetic from '@/components/motion/Magnetic'
import TiltCard from '@/components/motion/TiltCard'

const principles = [
  {
    icon: Target,
    color: '#ec6411',
    title: 'Resultado antes de discurso',
    description: 'Toda trilha é desenhada para gerar comportamento observável e impacto operacional.',
  },
  {
    icon: Compass,
    color: '#1855bd',
    title: 'Direção estratégica clara',
    description: 'Decisões de produto e de conteúdo seguem problema real de negócio, não tendências superficiais.',
  },
  {
    icon: Users2,
    color: '#0f8f3a',
    title: 'Evolução humana aplicada',
    description: 'Desenvolvimento técnico e soft skills caminham juntos para sustentar liderança em contexto de pressão.',
  },
  {
    icon: Gem,
    color: '#cc4f06',
    title: 'Qualidade de execução',
    description: 'Mantemos padrão alto de curadoria, experiência e acompanhamento para evitar jornadas genéricas.',
  },
]

const timeline = [
  {
    year: '2014',
    color: '#ec6411',
    title: 'Origem em campo',
    text: 'A metodologia nasceu da necessidade de formar líderes em ambientes de alta pressão operacional.',
  },
  {
    year: '2018',
    color: '#0f8f3a',
    title: 'Consolidação em B2B',
    text: 'Programas in-company passam a estruturar jornadas por nível de liderança e metas de negócio.',
  },
  {
    year: '2022',
    color: '#1855bd',
    title: 'Integração digital',
    text: 'Academy e trilhas online entram como acelerador contínuo de formação e escala.',
  },
  {
    year: '2026',
    color: '#fb7d2e',
    title: 'Ecossistema híbrido',
    text: 'Plataforma robusta conectando digital, presencial, pipeline comercial e certificação rastreável.',
  },
]

const commitments = [
  'Sem conteúdo inflado: foco no que gera aplicação imediata.',
  'Sem dado solto: todo programa precisa de leitura de evolução.',
  'Sem promessa vazia: clareza de escopo, cadência e resultado esperado.',
]

export default function SobrePage() {
  return (
    <SmoothScroll>
    <div className="min-h-screen" style={{ background: '#f5f1ea', color: '#070e1c' }}>
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ═══ HERO / MANIFESTO ═══ */}
        <section className="relative px-6 pb-20 pt-32" style={{ borderBottom: '1px solid rgba(7,14,28,0.08)' }}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 10% 0%, rgba(236,100,17,0.10), transparent 44%), radial-gradient(circle at 90% 20%, rgba(15,143,58,0.08), transparent 48%)' }}
          />
          <div className="relative mx-auto w-full max-w-[1200px]">
            <Reveal y={20}>
              <p className="ld-badge ld-badge-orange inline-flex items-center gap-2">
                <Handshake className="h-3.5 w-3.5" />
                Manifesto Lidera
              </p>
            </Reveal>

            <SplitHeading
              as="h1"
              delay={0.1}
              className="ld-display mt-6 max-w-4xl"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', color: '#070e1c' }}
            >
              A Lidera existe para transformar treinamento em <em style={{ fontStyle: 'normal', color: '#ec6411' }}>vantagem competitiva real.</em>
            </SplitHeading>

            <Reveal delay={0.35}>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: '#4a5060' }}>
                Não criamos jornadas para impressionar com volume de conteúdo. Criamos estrutura para que líderes evoluam comportamento, decisões e execução de time com consistência.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══ PRINCÍPIOS ═══ */}
        <section className="px-6 py-24" style={{ background: '#fdfcfa' }}>
          <div className="mx-auto w-full max-w-[1200px]">
            <Reveal className="mb-12 max-w-3xl">
              <p className="ld-eyebrow">Princípios de produto</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
                Como pensamos cada solução da plataforma.
              </SplitHeading>
            </Reveal>

            <Reveal stagger={0.1} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {principles.map(({ icon: Icon, color, title, description }) => (
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

        {/* ═══ TIMELINE ═══ */}
        <section className="px-6 py-24" style={{ background: '#070e1c', color: '#f5f1ea' }}>
          <div className="mx-auto w-full max-w-[1200px]">
            <Reveal className="mb-12 max-w-3xl">
              <p className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Evolução da metodologia</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#f5f1ea' }}>
                Construída na prática, refinada em ciclos curtos e validação contínua.
              </SplitHeading>
            </Reveal>

            <Reveal stagger={0.12} className="grid gap-6 md:grid-cols-2">
              {timeline.map((item) => (
                <TiltCard
                  key={item.year}
                  max={3}
                  className="rounded-2xl p-7"
                  style={{ border: '1px solid rgba(245,241,234,0.12)', background: 'rgba(245,241,234,0.03)' }}
                >
                  <p className="font-heading text-3xl" style={{ color: item.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{item.year}</p>
                  <h3 className="mt-3 text-2xl font-bold" style={{ color: '#f5f1ea' }}>{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(245,241,234,0.65)' }}>{item.text}</p>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ COMPROMISSOS + CTA ═══ */}
        <section className="px-6 py-24" style={{ background: '#fdfcfa' }}>
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <Reveal>
              <p className="ld-eyebrow">Compromissos de execução</p>
              <SplitHeading as="h2" className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
                A régua de qualidade que guiamos internamente.
              </SplitHeading>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: '#4a5060' }}>
                Essa disciplina é o que sustenta a consistência entre branding, experiência do aluno e resultado para empresas.
              </p>

              <ul className="mt-7 space-y-3">
                {commitments.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: '#334155' }}>
                    <Award className="h-4 w-4 shrink-0" style={{ color: '#ec6411' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <aside className="ld-card p-8">
                <p className="ld-eyebrow">Próximo passo</p>
                <h3 className="mt-3 text-2xl font-bold" style={{ color: '#070e1c' }}>Conheça a solução completa da Lidera.</h3>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#4a5060' }}>
                  Se você quer avaliar aderência para seu time ou para sua empresa, nosso time pode orientar o melhor caminho de entrada.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Magnetic>
                    <Link href="/empresas" className="ld-btn-primary w-full justify-center">
                      Ver solução corporativa
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Magnetic>
                  <Link href="/cursos" className="ld-btn-outline w-full justify-center">
                    Explorar programas
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
    </SmoothScroll>
  )
}
