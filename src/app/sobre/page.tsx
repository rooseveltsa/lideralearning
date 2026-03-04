import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import Link from 'next/link'
import { ArrowRight, Award, Compass, Gem, Handshake, Target, Users2 } from 'lucide-react'

const principles = [
  {
    icon: Target,
    title: 'Resultado antes de discurso',
    description: 'Toda trilha é desenhada para gerar comportamento observável e impacto operacional.',
  },
  {
    icon: Compass,
    title: 'Direção estratégica clara',
    description: 'Decisões de produto e de conteúdo seguem problema real de negócio, não tendências superficiais.',
  },
  {
    icon: Users2,
    title: 'Evolução humana aplicada',
    description: 'Desenvolvimento técnico e soft skills caminham juntos para sustentar liderança em contexto de pressão.',
  },
  {
    icon: Gem,
    title: 'Qualidade de execução',
    description: 'Mantemos padrão alto de curadoria, experiência e acompanhamento para evitar jornadas genéricas.',
  },
]

const timeline = [
  {
    year: '2014',
    title: 'Origem em campo',
    text: 'A metodologia nasceu da necessidade de formar líderes em ambientes de alta pressão operacional.',
  },
  {
    year: '2018',
    title: 'Consolidação em B2B',
    text: 'Programas in-company passam a estruturar jornadas por nível de liderança e metas de negócio.',
  },
  {
    year: '2022',
    title: 'Integração digital',
    text: 'Academy e trilhas online entram como acelerador contínuo de formação e escala.',
  },
  {
    year: '2026',
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
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="relative border-b border-[#DBE5F1] px-6 pb-20 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(30,136,229,0.18),transparent_44%),radial-gradient(circle_at_90%_20%,rgba(76,175,53,0.14),transparent_48%)]" />
          <div className="relative mx-auto w-full max-w-[1200px]">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C8DAEE] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              <Handshake className="h-3.5 w-3.5" />
              Manifesto Lidera
            </p>

            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              A Lidera existe para transformar treinamento em vantagem competitiva real.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#475569]">
              Não criamos jornadas para impressionar com volume de conteúdo. Criamos estrutura para que líderes evoluam comportamento, decisões e execução de time com consistência.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Princípios de produto</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">Como pensamos cada solução da plataforma.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {principles.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-[#D8E2EF] bg-[#F9FBFE] p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3FC] text-[#0B4A8F]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24 text-[#E7EDF8]">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Evolução da metodologia</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-white">
                Construída na prática, refinada em ciclos curtos e validação contínua.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {timeline.map((item) => (
                <article key={item.year} className="rounded-2xl border border-[#263A59] bg-[#0A1324] p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">{item.year}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#9AB2CE]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Compromissos de execução</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">A régua de qualidade que guiamos internamente.</h2>
              <p className="mt-5 text-lg leading-relaxed text-[#475569]">
                Essa disciplina é o que sustenta a consistência entre branding, experiência do aluno e resultado para empresas.
              </p>

              <ul className="mt-7 space-y-3">
                {commitments.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <Award className="h-4 w-4 text-[#1E88E5]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-2xl border border-[#D8E2EF] bg-[#F9FBFE] p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Próximo passo</p>
              <h3 className="mt-3 text-2xl font-extrabold text-[#0F172A]">Conheça a solução completa da Lidera.</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Se você quer avaliar aderência para seu time ou para sua empresa, nosso time pode orientar o melhor caminho de entrada.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/empresas"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
                >
                  Ver solução corporativa
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center rounded-xl border border-[#C8DAEE] px-5 py-3 text-sm font-bold text-[#0B4A8F] transition-colors hover:border-[#A9C8EA] hover:bg-[#EFF5FD]"
                >
                  Explorar programas
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
