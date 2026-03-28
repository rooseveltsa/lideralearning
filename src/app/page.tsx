import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MessageCircle,
  Target,
  Users,
} from 'lucide-react'

import SiteFooter from '@/components/site/Footer'
import SiteHeader from '@/components/site/Header'

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
    q: 'Quanto tempo leva para começar um projeto B2B?',
    a: 'Após o diagnóstico, a proposta é enviada em até 48h para início da implantação.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-white text-[#111827] selection:bg-[#1E88E5]/20">
      <SiteHeader />

      <main>
        {/* ── HERO — limpo, direto, respirável ── */}
        <section className="px-6 pb-20 pt-36">
          <div className="mx-auto max-w-[1080px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E0E7EF] bg-[#F4F8FC] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
              Treinamentos, Mentorias e Palestras
            </p>

            <h1 className="mx-auto mt-8 max-w-[800px] font-heading text-4xl leading-[1.15] text-[#0F172A] sm:text-5xl lg:text-[3.5rem]">
              Formamos os líderes que sua operação precisa.
            </h1>

            <p className="mx-auto mt-6 max-w-[600px] text-lg leading-relaxed text-[#64748B]">
              Diagnóstico, treinamento direcionado e acompanhamento de 60 dias.
              Resultado real, não certificado de gaveta.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1565C0]/20 transition-all hover:bg-[#0B4A8F] hover:shadow-[#1565C0]/30"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/empresas"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] px-8 py-4 text-base font-bold text-[#475569] transition-all hover:border-[#1565C0] hover:text-[#1565C0]"
              >
                Soluções para empresas
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-[#94A3B8]">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#F57C00]" />
                <strong className="text-[#0F172A]">500+</strong> supervisores treinados
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#4CAF50]" />
                <strong className="text-[#0F172A]">79%</strong> aumento em engajamento
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-[#1565C0]" />
                <strong className="text-[#0F172A]">98%</strong> recomendam
              </span>
            </div>
          </div>
        </section>

        {/* ── NÚMEROS — impacto rápido ── */}
        <section className="border-y border-[#E5ECF6] bg-[#F8FAFC] px-6 py-16">
          <div className="mx-auto grid max-w-[1080px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '16h', label: 'de imersão presencial', color: '#1565C0' },
              { value: '60', label: 'dias de acompanhamento', color: '#4CAF50' },
              { value: '8', label: 'módulos práticos', color: '#F57C00' },
              { value: 'PDI', label: 'individual por aluno', color: '#1565C0' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-heading text-4xl" style={{ color: item.color }}>
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[#64748B]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA — 3 cards, sem ruído ── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-14 text-center">
              <h2 className="font-heading text-3xl text-[#0F172A] sm:text-4xl">
                Como funciona
              </h2>
              <p className="mx-auto mt-4 max-w-[500px] text-base text-[#64748B]">
                Um método que conecta diagnóstico, treinamento e resultado prático.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: Target,
                  title: 'Diagnóstico',
                  desc: 'Autoavaliação de liderança com PDI gerado automaticamente. Você sabe exatamente onde está.',
                  color: '#F57C00',
                },
                {
                  step: '02',
                  icon: BookOpen,
                  title: 'Treinamento Direcionado',
                  desc: 'Academy digital + imersão presencial. 8 módulos práticos focados no que precisa ser desenvolvido.',
                  color: '#1565C0',
                },
                {
                  step: '03',
                  icon: BadgeCheck,
                  title: 'Acompanhamento',
                  desc: '60 dias de mentoria pós-treinamento para certificar que o resultado aconteceu na prática.',
                  color: '#4CAF50',
                },
              ].map(({ step, icon: Icon, title, desc, color }) => (
                <div key={step} className="rounded-2xl border border-[#E5ECF6] bg-white p-8 transition-all hover:shadow-lg hover:shadow-[#1565C0]/5">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Etapa {step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#0F172A]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS — curtos e com resultado ── */}
        <section className="bg-[#0F172A] px-6 py-24 text-white">
          <div className="mx-auto max-w-[1080px]">
            <h2 className="text-center font-heading text-3xl sm:text-4xl">
              Quem já passou pelo programa
            </h2>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {[
                {
                  quote: 'Em 90 dias o treinamento virou sistema de execução gerencial.',
                  name: 'Carlos Mendes',
                  role: 'Diretor de RH',
                  result: '43% menos turnover',
                },
                {
                  quote: 'A operação ganhou clareza e os times passaram a executar com consistência.',
                  name: 'Fernanda Pacheco',
                  role: 'CEO',
                  result: 'Meta de 62% para 91%',
                },
                {
                  quote: 'Conseguimos ligar formação e performance com dados reais.',
                  name: 'Ricardo Albuquerque',
                  role: 'COO',
                  result: 'T&D integrado ao painel',
                },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                  <p className="text-base leading-relaxed text-white/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 inline-flex rounded-full bg-[#4CAF50]/15 px-3 py-1 text-xs font-bold text-[#4CAF50]">
                    {t.result}
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL — único, claro ── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="font-heading text-3xl text-[#0F172A] sm:text-4xl">
              Descubra seu perfil de liderança em 5 minutos.
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-base text-[#64748B]">
              Faça a autoavaliação gratuita e receba seu diagnóstico com Plano de Desenvolvimento Individual.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100]"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/5564996099020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] px-8 py-4 text-base font-bold text-[#475569] transition-all hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ — curto ── */}
        <section className="border-t border-[#E5ECF6] bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-[700px]">
            <h2 className="mb-8 text-center font-heading text-2xl text-[#0F172A]">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl border border-[#E5ECF6] bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#94A3B8] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="border-t border-[#F1F5F9] px-5 py-4 text-sm leading-relaxed text-[#64748B]">
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
