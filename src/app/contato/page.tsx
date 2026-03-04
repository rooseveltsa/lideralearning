import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import Link from 'next/link'
import { ArrowRight, Building2, CalendarClock, Mail, MessageCircle, Phone } from 'lucide-react'

const channels = [
  {
    icon: Mail,
    label: 'E-mail comercial',
    value: 'comercial@lideratreinamentos.com.br',
    href: 'mailto:comercial@lideratreinamentos.com.br',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp corporativo',
    value: '+55 (11) 99999-9999',
    href: 'https://wa.me/5511999999999',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+55 (11) 4000-0000',
    href: 'tel:+551140000000',
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
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="overflow-hidden">
        <section className="relative border-b border-[#DBE5F1] px-6 pb-20 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(30,136,229,0.18),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(76,175,53,0.13),transparent_50%)]" />
          <div className="relative mx-auto w-full max-w-[1200px]">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C8DAEE] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
              <CalendarClock className="h-3.5 w-3.5" />
              Contato comercial
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              Vamos desenhar a melhor entrada para seu cenário de liderança.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#475569]">
              Fale com nosso time para estruturar um plano de treinamento robusto. O formulário abaixo gera protocolo imediato no pipeline comercial da plataforma.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-8">
              <div className="rounded-2xl border border-[#D8E2EF] bg-[#F9FBFE] p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Canais diretos</p>
                <div className="mt-5 space-y-4">
                  {channels.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 rounded-xl border border-[#E2EAF5] bg-white p-4 transition-colors hover:border-[#C7DAF1]"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FC] text-[#0B4A8F]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
                        <p className="mt-1 text-sm font-bold text-[#0F172A]">{value}</p>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#D8E2EF] bg-[#F9FBFE] p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Para acelerar o diagnóstico</p>
                <ul className="mt-5 space-y-2.5">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#334155]">
                      <ArrowRight className="h-4 w-4 text-[#1E88E5]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-[#D7E6F8] bg-[#EAF3FC] p-4 text-sm text-[#0B4A8F]">
                  SLA de resposta: até 4 horas úteis para novos contatos corporativos.
                </div>
              </div>

              <div className="rounded-2xl border border-[#D8E2EF] bg-[#F9FBFE] p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Também disponível</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cursos"
                    className="inline-flex items-center justify-center rounded-xl border border-[#C8DAEE] px-4 py-3 text-sm font-bold text-[#0B4A8F] transition-colors hover:bg-[#EFF5FD]"
                  >
                    Ver programas digitais
                  </Link>
                  <Link
                    href="/empresas"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
                  >
                    Solução B2B
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-7 shadow-[0_22px_45px_rgba(2,6,23,0.45)]">
              <LeadFormB2B />
            </div>
          </div>
        </section>

        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-20 text-[#E7EDF8]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-6 md:grid-cols-3">
            {[
              { label: 'Modelo de atendimento', value: 'Consultivo', icon: Building2 },
              { label: 'Resposta comercial', value: 'Até 4h úteis', icon: CalendarClock },
              { label: 'Cobertura', value: 'Brasil inteiro', icon: MessageCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-[#263A59] bg-[#0A1324] p-6">
                <Icon className="h-5 w-5 text-[#8CC1F7]" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7FA0C2]">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
