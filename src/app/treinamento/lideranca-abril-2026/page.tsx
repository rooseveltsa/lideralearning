import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Target,
  TrendingDown,
  Users,
} from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'

export const metadata: Metadata = {
  title: 'Treinamento para Líderes e Supervisores | 09 e 10 de Abril 2026 | LIDERA',
  description:
    'Treinamento presencial direcionado para novos líderes e supervisores. Avaliação prática + PDI individual + acompanhamento de 60 dias. Turmas de no máximo 10 pessoas. Catalão - GO.',
  openGraph: {
    title: 'Treinamento Presencial para Líderes e Supervisores | LIDERA',
    description:
      'Supere insegurança na função, medo de errar e falta de respeito da equipe. Treinamento com resultado real e acompanhamento de 60 dias.',
  },
}

const doresLider = [
  { icon: AlertTriangle, text: 'Medo de perder o emprego' },
  { icon: ShieldCheck, text: 'Insegurança na função' },
  { icon: Users, text: 'Falta de respeito da equipe' },
  { icon: Target, text: 'Receio de errar nas decisões' },
]

const falhasComuns = [
  'Relacionamento com a equipe',
  'Liderança de antigos colegas',
  'Postura e comunicação',
  'Tomada de decisão',
]

const impactosOperacao = [
  { icon: TrendingDown, label: 'Aumento de turnover' },
  { icon: AlertTriangle, label: 'Erros operacionais' },
  { icon: Clock, label: 'Retrabalho constante' },
  { icon: TrendingDown, label: 'Custos desnecessários (EPIs, processos)' },
]

const etapasMetodo = [
  {
    numero: '01',
    titulo: 'Avaliação Diagnóstica',
    descricao:
      'Perguntas diretamente ligadas à realidade do líder, já conectadas ao conteúdo do treinamento.',
  },
  {
    numero: '02',
    titulo: 'PDI — Plano de Desenvolvimento Individual',
    descricao:
      'A partir da avaliação, estruturamos um plano personalizado com foco no que realmente precisa ser desenvolvido.',
  },
  {
    numero: '03',
    titulo: 'Treinamento Direcionado',
    descricao:
      'O profissional segue para o treinamento com foco direcionado. Não é genérico — é para gerar resultado real na função.',
  },
  {
    numero: '04',
    titulo: 'Acompanhamento de 60 Dias',
    descricao:
      'Certificação dos resultados propostos com acompanhamento pós-treinamento para garantir a aplicação prática.',
  },
]

const faqs = [
  {
    q: 'Preciso ter experiência como líder para participar?',
    a: 'Não. O treinamento é desenhado justamente para novos líderes e supervisores que foram promovidos recentemente ou que vão assumir a posição.',
  },
  {
    q: 'Como funciona o acompanhamento de 60 dias?',
    a: 'Após o treinamento, você terá sessões de acompanhamento com o mentor para validar a aplicação prática dos conceitos e certificar os resultados alcançados.',
  },
  {
    q: 'A empresa pode inscrever mais de um líder?',
    a: 'Sim. Recomendamos inclusive que líderes da mesma empresa participem juntos para alinhar a cultura de gestão. A turma tem máximo de 10 pessoas.',
  },
  {
    q: 'Qual o investimento?',
    a: 'Entre em contato pelo WhatsApp para receber a proposta completa com condições de pagamento e valores para grupos corporativos.',
  },
  {
    q: 'A avaliação diagnóstica é obrigatória?',
    a: 'Sim. É ela que direciona o PDI e garante que o treinamento não seja genérico. Sem a avaliação, não há como personalizar o desenvolvimento.',
  },
]

export default function TreinamentoLiderancaPage() {
  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ── HERO ── */}
        <section className="relative border-b border-[#1A2438] px-6 pb-24 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1E88E5]/5 via-transparent to-transparent" />
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F57C00]/30 bg-[#F57C00]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                <CalendarDays className="h-3.5 w-3.5" />
                09 e 10 de Abril 2026 — Presencial
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Treinamento para{' '}
                <span className="text-[#8CC1F7]">Líderes e Supervisores</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
                Não é um treinamento genérico. É direcionado para gerar{' '}
                <strong className="text-white">resultado real na função</strong> com
                acompanhamento de até 60 dias após o treinamento para certificação dos
                resultados propostos.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/treinamento/lideranca-abril-2026/inscricao"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100] hover:shadow-[#F57C00]/40"
                >
                  Garantir minha vaga
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/treinamento/lideranca-abril-2026/avaliacao"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-8 py-4 text-base font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
                >
                  Fazer avaliação diagnóstica
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#9AB2CE]">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#1E88E5]" />
                  Catalão — GO
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#1E88E5]" />
                  Máximo 10 pessoas
                </span>
                <span className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#1E88E5]" />
                  Certificação com acompanhamento
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── INFO CARDS ── */}
        <section className="border-b border-[#1A2438] bg-[#060D1A] px-6 py-14">
          <div className="mx-auto grid w-full max-w-[1280px] gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { value: '09-10', label: 'Abril 2026', detail: 'Dois dias de imersão presencial intensiva.' },
              { value: '10', label: 'Vagas por turma', detail: 'Turmas reduzidas para atenção individualizada.' },
              { value: '60', label: 'Dias de acompanhamento', detail: 'Certificação de resultados pós-treinamento.' },
              { value: 'PDI', label: 'Plano individual', detail: 'Cada participante recebe seu plano de desenvolvimento.' },
            ].map((item) => (
              <article key={item.label} className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-5">
                <p className="text-3xl font-extrabold text-white">{item.value}</p>
                <p className="mt-1 text-sm font-bold text-[#D8E4F5]">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#8FA8C5]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PROBLEMA: O QUE ACONTECE APÓS A PROMOÇÃO ── */}
        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">O problema</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                O padrão para promoção é técnico ou tempo de casa. O problema começa depois.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#475569]">
                Muitos profissionais promovidos têm dificuldade de se manter na função. São falhas simples, que
                poderiam ser desenvolvidas com a orientação certa.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#D8E2EF] bg-white p-7 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <h3 className="mb-5 text-lg font-bold text-[#0F172A]">
                  Dores que novos líderes enfrentam
                </h3>
                <div className="space-y-3">
                  {doresLider.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 rounded-xl bg-[#FFF7ED] px-4 py-3 text-sm font-medium text-[#9A3412]">
                      <Icon className="h-4 w-4 shrink-0 text-[#F57C00]" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#D8E2EF] bg-white p-7 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <h3 className="mb-5 text-lg font-bold text-[#0F172A]">
                  Dificuldades após a promoção
                </h3>
                <div className="space-y-3">
                  {falhasComuns.map((falha) => (
                    <div key={falha} className="flex items-center gap-3 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />
                      {falha}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACTO NA OPERAÇÃO ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Impacto direto</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Falhas de liderança geram impactos diretos na operação.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {impactosOperacao.map(({ icon: Icon, label }) => (
                <article key={label} className="rounded-2xl border border-[#23344E] bg-[#0A1324] p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E2F49] text-[#EF4444]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-base font-bold text-white">{label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── MÉTODO: COMO FUNCIONA ── */}
        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Nosso método</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                Avaliação, PDI e treinamento direcionado. Nada genérico.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {etapasMetodo.map((etapa) => (
                <article key={etapa.numero} className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECF3FC] font-heading text-lg font-extrabold text-[#0B4A8F]">
                    {etapa.numero}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-[#0F172A]">{etapa.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{etapa.descricao}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA: MENTOR + DETALHES ── */}
        <section className="border-y border-[#1A2438] bg-[#050A14] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Sobre o mentor</p>
                <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
                  Claudemir Domingos
                </h2>
                <p className="text-lg leading-relaxed text-[#A9BDD8]">
                  Mentor especializado em desenvolvimento de líderes e supervisores com foco em resultado
                  prático. Criador da metodologia LIDERA, que conecta avaliação diagnóstica, plano de
                  desenvolvimento individual e acompanhamento pós-treinamento para certificar evolução real.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://wa.me/5564996099020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </a>
                  <a
                    href="tel:+5564996099020"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-5 py-3 text-sm font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    (64) 99609-9020
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-[#22314C] bg-[#0A1324] p-8 shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#87A6C8]">Detalhes do evento</p>
                <h3 className="mt-3 text-2xl font-extrabold text-white">Imersão Presencial</h3>

                <div className="mt-6 space-y-4">
                  {[
                    { icon: CalendarDays, label: 'Data', value: '09 e 10 de Abril de 2026' },
                    { icon: MapPin, label: 'Local', value: 'Catalão — GO (presencial)' },
                    { icon: Users, label: 'Turma', value: 'Máximo 10 participantes' },
                    { icon: Clock, label: 'Duração', value: '2 dias de imersão + 60 dias de acompanhamento' },
                    { icon: BadgeCheck, label: 'Certificação', value: 'Com validação de resultados práticos' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl border border-[#253B5A] bg-[#0F1B30] px-4 py-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#162845] text-[#9EC6F1]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9CB4CF]">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/treinamento/lideranca-abril-2026/inscricao"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100]"
                >
                  Garantir minha vaga
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#050A14] px-6 py-20">
          <div className="mx-auto w-full max-w-[980px]">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Dúvidas frequentes</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Perguntas comuns sobre o treinamento
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details key={item.q} className="group overflow-hidden rounded-xl border border-[#23334D] bg-[#0A1324]">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#8FA8C5] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="border-t border-[#1D2D45] px-5 py-4 text-sm leading-relaxed text-[#A9BDD8]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="border-t border-[#1A2438] bg-gradient-to-b from-[#0C1629] to-[#050A14] px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Vagas limitadas. Garanta sua participação.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#A9BDD8]">
              Turmas de no máximo 10 pessoas para garantir atenção individualizada e resultado real.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/treinamento/lideranca-abril-2026/inscricao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100]"
              >
                Inscrever-se agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/5564996099020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-8 py-4 text-base font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
