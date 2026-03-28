import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  PlayCircle,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import SiteFooter from '@/components/site/Footer'
import SiteHeader from '@/components/site/Header'
import TypewriterText from '@/components/site/TypewriterText'

const faqs = [
  {
    q: 'A Lidera é somente plataforma digital?',
    a: 'Não. O modelo é híbrido: academy digital, imersões presenciais e projetos corporativos no mesmo ecossistema.',
  },
  {
    q: 'A empresa consegue contratar algo personalizado?',
    a: 'Sim. O diagnóstico inicial define trilhas, formatos e metas de implementação para cada contexto.',
  },
  {
    q: 'Existe certificação?',
    a: 'Sim. Trilhas elegíveis liberam certificado verificável conforme critérios de conclusão.',
  },
  {
    q: 'Quanto tempo leva para começar?',
    a: 'Após o diagnóstico, a proposta é enviada em até 48h para início da implantação.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">

        {/* ── HERO — autoridade + clareza ── */}
        <section className="relative px-6 pb-32 pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(30,136,229,0.08),transparent)]" />

          <div className="relative mx-auto max-w-[1080px] text-center">
            <h1 className="mx-auto max-w-[820px] font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
              <TypewriterText text="Formamos os líderes que sua" speed={50} delay={300} />{' '}
              <span className="text-[#4CAF50]">
                <TypewriterText text="operação precisa." speed={50} delay={1750} cursorColor="#4CAF50" />
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-[580px] text-lg leading-relaxed text-[#A9BDD8]">
              Diagnóstico individualizado, treinamento presencial de alto impacto
              e 60 dias de acompanhamento. Resultado real, não certificado de gaveta.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100] hover:shadow-[#F57C00]/35"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/empresas"
                className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-8 py-4 text-base font-bold text-[#D4E4F6] transition-all hover:border-[#4F77AA] hover:text-white"
              >
                Soluções para empresas
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROVA SOCIAL — números que importam ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-14">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-12 sm:gap-16">
            {[
              { value: '500+', label: 'Supervisores treinados', icon: Users, color: '#F57C00' },
              { value: '79%', label: 'Aumento em engajamento', icon: TrendingUp, color: '#4CAF50' },
              { value: '98%', label: 'Recomendam o programa', icon: BadgeCheck, color: '#1E88E5' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-white">{item.value}</p>
                  <p className="text-xs font-medium text-[#7FA0C2]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MÉTODO — 3 etapas, visual limpo ── */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-16 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F57C00]">
                Nosso método
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Diagnóstico, treinamento e resultado.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: Target,
                  title: 'Diagnóstico',
                  desc: 'Autoavaliação de liderança com PDI gerado automaticamente. Você sabe exatamente onde está e o que desenvolver.',
                  color: '#F57C00',
                },
                {
                  step: '02',
                  icon: BookOpen,
                  title: 'Treinamento Direcionado',
                  desc: 'Academy digital + imersão presencial. 8 módulos focados no que realmente precisa ser desenvolvido.',
                  color: '#1E88E5',
                },
                {
                  step: '03',
                  icon: BadgeCheck,
                  title: 'Acompanhamento 60 dias',
                  desc: 'Mentoria pós-treinamento para certificar que o resultado aconteceu na prática. Sem isso, é só teoria.',
                  color: '#4CAF50',
                },
              ].map(({ step, icon: Icon, title, desc, color }) => (
                <div
                  key={step}
                  className="group rounded-2xl border border-[#22314B] bg-[#0A1324] p-8 transition-all hover:border-[#335077] hover:shadow-[0_12px_40px_rgba(30,136,229,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-heading text-4xl font-extrabold text-[#1A2E4A]">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A9BDD8]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── O QUE VOCÊ RECEBE — lista de valor ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1E88E5]">
                Programa completo
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Tudo incluso no treinamento
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Diagnóstico individualizado de liderança',
                'PDI — Plano de Desenvolvimento Individual',
                '8 módulos presenciais (16h de imersão)',
                'Autoavaliação das 5 Dimensões',
                'Ferramentas práticas para aplicar no dia seguinte',
                'Certificado verificável',
                'Mentoria de acompanhamento 30 e 60 dias',
                'Acesso à Academy digital',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#1A2E4A] bg-[#0A1324] px-5 py-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4CAF50]" />
                  <span className="text-sm font-semibold text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS — curtos, com resultado ── */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7FA0C2]">
                Resultados reais
              </p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Quem já passou pelo programa
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  quote: 'Em 90 dias o treinamento virou sistema de execução gerencial.',
                  name: 'Carlos Mendes',
                  role: 'Diretor de RH · Grupo Industrial Alfa',
                  result: '43% menos turnover',
                },
                {
                  quote: 'A operação ganhou clareza e os times passaram a executar com consistência.',
                  name: 'Fernanda Pacheco',
                  role: 'CEO · TechBR Soluções',
                  result: 'Meta de 62% para 91%',
                },
                {
                  quote: 'Conseguimos ligar formação e performance com dados reais de aplicação.',
                  name: 'Ricardo Albuquerque',
                  role: 'COO · Rede Varejista Nacional',
                  result: 'T&D integrado ao painel',
                },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-7">
                  <p className="text-base leading-relaxed text-[#D6E3F5]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 inline-flex rounded-full bg-[#4CAF50]/10 px-3 py-1 text-xs font-bold text-[#4CAF50]">
                    {t.result}
                  </div>
                  <div className="mt-5 border-t border-[#1A2E4A] pt-4">
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-[#7FA0C2]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOIS CAMINHOS — B2C e B2B lado a lado ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto grid max-w-[1080px] gap-6 lg:grid-cols-2">
            {/* Para você */}
            <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F57C00]/15 text-[#F57C00]">
                  <PlayCircle className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F57C00]">Para você</p>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-white">
                Treinamento Individual
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A9BDD8]">
                Workshop presencial, autoavaliação, PDI personalizado e acesso à Academy digital.
              </p>
              <Link
                href="/treinamento/modulo-1"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100]"
              >
                Ver próxima turma
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Para sua empresa */}
            <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E88E5]/15 text-[#1E88E5]">
                  <Users className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E88E5]">Para empresas</p>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-white">
                Programa Corporativo
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A9BDD8]">
                Diagnóstico, trilha personalizada, dashboard de acompanhamento e mentoria dedicada.
              </p>
              <Link
                href="/empresas"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-all hover:bg-[#1565C0]"
              >
                Solicitar proposta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Descubra seu perfil de liderança em 5 minutos.
            </h2>
            <p className="mx-auto mt-5 max-w-[500px] text-base leading-relaxed text-[#A9BDD8]">
              Autoavaliação gratuita com diagnóstico e Plano de Desenvolvimento Individual gerado na hora.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100]"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/5564996099020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-8 py-4 text-base font-bold text-[#D4E4F6] transition-all hover:border-[#4F77AA] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-t border-[#1A2438] bg-[#060D1A] px-6 py-20">
          <div className="mx-auto max-w-[700px]">
            <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-white">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl border border-[#22314B] bg-[#0A1324]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#7FA0C2] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="border-t border-[#1A2E4A] px-5 py-4 text-sm leading-relaxed text-[#A9BDD8]">
                    {item.a}
                  </p>
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
