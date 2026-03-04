import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Handshake, Layers3, ShieldCheck, Users2 } from 'lucide-react'

const differentiators = [
  {
    icon: Layers3,
    title: 'Arquitetura híbrida',
    description: 'Combinamos academy digital, encontros ao vivo e programas presenciais em uma jornada contínua.',
  },
  {
    icon: BarChart3,
    title: 'Medição operacional',
    description: 'Evolução por competência, taxa de conclusão e histórico de aplicação prática com visão para RH e liderança.',
  },
  {
    icon: ShieldCheck,
    title: 'Governança e rastreabilidade',
    description: 'Fluxo auditável de lead, proposta, matrícula, progresso e certificação em um único ecossistema.',
  },
  {
    icon: Users2,
    title: 'Curadoria por perfil',
    description: 'Trilhas diferentes para coordenadores, gerentes e diretoria, respeitando maturidade e contexto do time.',
  },
]

const deliveryModel = [
  {
    step: '01',
    title: 'Diagnóstico do cenário',
    description: 'Mapeamos estrutura de liderança, gargalos de execução e metas de negócio para priorizar competências críticas.',
  },
  {
    step: '02',
    title: 'Desenho da trilha',
    description: 'Configuramos plano de formação por público interno, combinando módulos digitais, workshops e checkpoints.',
  },
  {
    step: '03',
    title: 'Execução guiada',
    description: 'Ativamos a trilha com acompanhamento de engajamento, ritos de aplicação e suporte de customer success.',
  },
  {
    step: '04',
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
    <div className="min-h-screen bg-[#040812] text-[#E7EDF8]">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="relative border-b border-[#1A2438] px-6 pb-24 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(30,136,229,0.24),transparent_42%),radial-gradient(circle_at_88%_20%,rgba(76,175,53,0.2),transparent_44%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          <div className="relative mx-auto grid w-full max-w-[1280px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D4364] bg-[#0A1426] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
                <Handshake className="h-3.5 w-3.5" />
                Lidera Corporativo
              </p>

              <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Treinamento corporativo com <span className="text-[#8CC1F7]">lógica de operação</span>, não apenas conteúdo.
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
                Estruturamos jornadas híbridas para desenvolver liderança em escala. Da entrada do lead ao relatório de impacto, toda a experiência fica centralizada na plataforma.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#diagnostico"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1E88E5]/25 transition-colors hover:bg-[#1565C0]"
                >
                  Solicitar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center rounded-xl border border-[#35527B] px-6 py-3.5 text-sm font-bold text-[#D4E4F6] transition-colors hover:border-[#5480B8] hover:text-white"
                >
                  Ver programas digitais
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Empresas atendidas', value: '200+' },
                { label: 'Gestores em formação', value: '5.000+' },
                { label: 'Tempo médio de resposta', value: '4h úteis' },
                { label: 'Modelo de entrega', value: 'Digital + Presencial' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#253A58] bg-[#0A1324] p-5">
                  <p className="text-xs font-semibold text-[#8FA8C5]">{item.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Diferenciais de plataforma</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">
                Estrutura robusta para RH, business partner e líderes de área.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {differentiators.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-[#D8E2EF] bg-white p-7">
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

        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Modelo de entrega</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-white">
                Fluxo de implantação orientado por evidência e execução.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {deliveryModel.map((item) => (
                <article key={item.step} className="rounded-2xl border border-[#263A59] bg-[#0A1324] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7FA0C2]">Etapa {item.step}</p>
                  <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#9AB2CE]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Planos de parceria</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight">Formato de contratação para diferentes estágios de maturidade.</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex h-full flex-col rounded-2xl border p-7 ${
                    plan.highlight ? 'border-[#1E88E5] bg-[#0D1C33] text-white shadow-[0_18px_42px_rgba(16,42,84,0.25)]' : 'border-[#D8E2EF] bg-white'
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-[0.14em] ${plan.highlight ? 'text-[#9BC4EE]' : 'text-[#64748B]'}`}>{plan.name}</p>
                  <h3 className={`mt-2 text-2xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{plan.price}</h3>
                  <p className={`mt-3 text-sm ${plan.highlight ? 'text-[#B5CAE3]' : 'text-[#475569]'}`}>{plan.audience}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.items.map((item) => (
                      <li key={item} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-[#E0ECFA]' : 'text-[#334155]'}`}>
                        <CheckCircle2 className={`h-4 w-4 ${plan.highlight ? 'text-[#4CAF35]' : 'text-[#1E88E5]'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#diagnostico"
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${
                      plan.highlight ? 'bg-[#1E88E5] text-white hover:bg-[#1565C0]' : 'bg-[#EAF3FC] text-[#0B4A8F] hover:bg-[#DCEBFC]'
                    }`}
                  >
                    Falar com especialista
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="diagnostico" className="border-t border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Próximo passo</p>
              <h2 className="font-heading text-4xl font-extrabold leading-tight text-white">
                Solicite um diagnóstico e desenhe a trilha ideal para sua operação.
              </h2>
              <p className="text-lg leading-relaxed text-[#A9BDD8]">
                O formulário gera protocolo interno e abre o pipeline comercial da sua empresa dentro da plataforma Lidera.
              </p>
            </div>
            <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-7 shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
              <LeadFormB2B />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
