import type { Metadata } from 'next'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  Lightbulb,
  MapPin,
  MessageCircle,
  Shield,
  Target,
  TrendingDown,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import UrgencyCounter from '@/components/treinamento/UrgencyCounter'
import InscricaoForm from './InscricaoForm'

// ── Configuração de urgência — ajuste sem redeploy ──
const VAGAS_RESTANTES = 3

export const metadata: Metadata = {
  title: 'Módulo 1: A Função Estratégica do Supervisor | Workshop Presencial | LIDERA',
  description:
    'Descubra exatamente onde você está como líder e para onde precisa ir. Workshop presencial de meio dia com a Autoavaliação das 5 Dimensões da Liderança. Turmas de até 8 pessoas. Catalão - GO.',
  openGraph: {
    title: 'Workshop: A Função Estratégica do Supervisor | LIDERA',
    description:
      'Você foi promovido. E agora? Aprenda as 5 Dimensões da Liderança e saia sabendo exatamente onde está e para onde precisa ir como líder.',
  },
}

const paraQuemCards = [
  {
    icon: Shield,
    text: 'Você foi promovido recentemente e sente insegurança na função',
  },
  {
    icon: Users,
    text: 'Você lidera antigos colegas e não sabe como estabelecer autoridade',
  },
  {
    icon: Brain,
    text: 'Você toma decisões no improviso e quer ter método',
  },
  {
    icon: Target,
    text: 'Você quer saber onde está como líder e para onde precisa evoluir',
  },
]

const dores = [
  'Medo de perder o emprego',
  'Insegurança na função',
  'Falta de respeito da equipe',
  'Receio de errar nas decisões',
  'Não saber separar amizade de autoridade',
]

const impactos = [
  { icon: TrendingDown, label: 'Aumento de turnover' },
  { icon: AlertTriangle, label: 'Erros operacionais' },
  { icon: TrendingDown, label: 'Retrabalho constante' },
]

const conceitos = [
  {
    icon: Target,
    titulo: 'As 5 Dimensões da Liderança',
    descricao: 'Facilitador · Orientador · Garantidor · Estrategista · Mentor',
    detalhe:
      'Identifique em qual dimensão você está forte e qual precisa desenvolver para avançar na carreira.',
  },
  {
    icon: Users,
    titulo: 'Ciclo de Sucessão Sustentável',
    descricao: 'Promoções que geram líderes preparados',
    detalhe:
      'Entenda por que 65% das promoções falham e como construir uma trajetória sólida desde o início.',
  },
  {
    icon: AlertTriangle,
    titulo: 'A Armadilha Estatística',
    descricao: 'Por que 65% dos supervisores falham',
    detalhe:
      'O erro não é técnico — é comportamental. Descubra como identificar e corrigir antes que custe sua posição.',
  },
  {
    icon: Lightbulb,
    titulo: 'Do Reativo ao Estratégico',
    descricao: 'Abandonar vícios e adotar postura de líder',
    detalhe:
      'Saia do ciclo de "apagar incêndios" e comece a agir com visão e método no dia a dia.',
  },
]

const faqs = [
  {
    q: 'Preciso ter experiência como líder para participar?',
    a: 'Não. O workshop é desenhado justamente para supervisores recém-promovidos ou que vão assumir a posição em breve.',
  },
  {
    q: 'Este workshop faz parte do treinamento completo?',
    a: 'Sim. O Módulo 1 é o primeiro de 8 módulos do programa completo "Supervisor: Da Operação à Liderança". Participar do workshop garante desconto na inscrição do programa completo.',
  },
  {
    q: 'Onde e quando acontece?',
    a: 'Presencial em Catalão — GO. As datas são confirmadas com antecedência de 15 dias para os inscritos.',
  },
  {
    q: 'Qual o investimento?',
    a: 'Entre em contato pelo WhatsApp para receber a proposta e condições de pagamento para inscrições individuais ou em grupo.',
  },
  {
    q: 'Quantas pessoas participam?',
    a: 'Máximo 8 pessoas por turma para garantir atenção individualizada e qualidade de entrega.',
  },
]

export default function Modulo1Page() {
  return (
    <div className="bg-[#050A14] text-[#E5ECF8] selection:bg-[#1E88E5]/30">
      <SiteHeader />

      <main className="overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative border-b border-[#1A2438] px-6 pb-24 pt-36">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1565C0]/6 via-transparent to-transparent" />
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">

              <div className="mb-6 inline-flex animate-pulse items-center gap-2 rounded-full border border-[#F57C00]/40 bg-[#F57C00]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                <Zap className="h-3.5 w-3.5" />
                Workshop · Vagas Limitadas
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Você foi promovido.{' '}
                <span className="text-[#8CC1F7]">E agora?</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#A9BDD8]">
                Aprenda a função estratégica do supervisor e descubra exatamente onde está
                e para onde precisa ir como líder —{' '}
                <strong className="text-white">em um workshop presencial de meio dia.</strong>
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#inscricao"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100] hover:shadow-[#F57C00]/40"
                >
                  Garantir minha vaga
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#conteudo"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#335077] px-8 py-4 text-base font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
                >
                  Ver o que você vai aprender
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#9AB2CE]">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#1E88E5]" />
                  Presencial · Catalão — GO
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#1E88E5]" />
                  Máximo 8 vagas
                </span>
                <span className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#1E88E5]" />
                  Certificado incluso
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── ESTATÍSTICA DE IMPACTO ── */}
        <section className="border-b border-[#1A2438] bg-[#060D1A] px-6 py-20">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-8">
                  <p className="font-heading text-6xl font-extrabold text-[#F57C00]">65%</p>
                  <p className="mt-3 text-base font-semibold leading-snug text-white">
                    dos supervisores são promovidos por{' '}
                    <span className="text-[#8CC1F7]">competência técnica</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-8">
                  <p className="font-heading text-6xl font-extrabold text-[#EF4444]">30%</p>
                  <p className="mt-3 text-base font-semibold leading-snug text-white">
                    recebem formação em liderança{' '}
                    <span className="text-[#8CC1F7]">antes de assumir o cargo</span>
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#4A6B8A]">
                Pesquisa interna — base de dados LIDERA
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-relaxed text-[#D4E4F6]">
                A diferença entre o supervisor que prospera e o que pede demissão{' '}
                <span className="text-white font-extrabold">não é técnica. É comportamental.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── PARA QUEM É ── */}
        <section className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
                Para quem é
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                Este workshop foi feito para você se...
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {paraQuemCards.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-4 rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECF3FC] text-[#0B4A8F]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-base font-semibold leading-snug text-[#1E293B]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMA ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">
                O problema
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                O padrão de promoção é técnico. O problema começa depois.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#A9BDD8]">
                Muitos supervisores são promovidos sem preparação para o cargo de liderança.
                As consequências aparecem rápido.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#23344E] bg-[#0A1324] p-7">
                <h3 className="mb-5 text-base font-bold text-white">
                  Dores que novos líderes enfrentam
                </h3>
                <ul className="space-y-3">
                  {dores.map((dor) => (
                    <li
                      key={dor}
                      className="flex items-center gap-3 rounded-xl bg-[#1A0A0A] px-4 py-3 text-sm font-medium text-[#FCA5A5]"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />
                      {dor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#23344E] bg-[#0A1324] p-7">
                <h3 className="mb-5 text-base font-bold text-white">
                  Impacto direto na operação
                </h3>
                <div className="space-y-4">
                  {impactos.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 rounded-xl border border-[#253B5A] bg-[#0F1B30] px-4 py-4"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E2F49] text-[#EF4444]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-base font-bold text-white">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-[#0B4A8F]/20 border border-[#0B4A8F]/30 px-4 py-4">
                  <p className="text-sm leading-relaxed text-[#8CC1F7]">
                    <strong className="text-white">Resultado:</strong> empresas perdem produtividade,
                    talentos pedem demissão e o supervisor recém-promovido carrega o peso sozinho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTEÚDO DO WORKSHOP ── */}
        <section id="conteudo" className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
                O que você vai aprender
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                4 conceitos que transformam a forma como você enxerga seu papel
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {conceitos.map(({ icon: Icon, titulo, descricao, detalhe }) => (
                <article
                  key={titulo}
                  className="rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECF3FC] text-[#0B4A8F]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-[#0F172A]">{titulo}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#1565C0]">
                    {descricao}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{detalhe}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-4 rounded-2xl bg-[#0F172A] px-6 py-5">
              <span className="mt-0.5 text-2xl">🎯</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F57C00]">
                  Resultado prático
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  Você sai sabendo exatamente onde está e para onde precisa ir como líder.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FERRAMENTA INCLUÍDA ── */}
        <section className="border-y border-[#1A2438] bg-[#060D1A] px-6 py-20">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-[#1565C0]/30 bg-[#0B1E3A] p-8 sm:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1565C0]/40 bg-[#1565C0]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#8CC1F7]">
                  <Wrench className="h-3.5 w-3.5" />
                  Ferramenta Prática Incluída
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
                  Autoavaliação das 5 Dimensões
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#A9BDD8]">
                  Questionário prático para mapear seu nível atual em cada dimensão e definir
                  prioridades de desenvolvimento.{' '}
                  <strong className="text-white">Você leva para casa e usa no trabalho.</strong>
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />
                    <p className="text-sm text-[#A9BDD8]">
                      Reflexão guiada sobre sua trajetória de promoção
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />
                    <p className="text-sm text-[#A9BDD8]">
                      Mapeamento das 5 dimensões na sua rotina atual
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />
                    <p className="text-sm text-[#A9BDD8]">
                      Plano de prioridades de desenvolvimento personalizado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOBRE O MENTOR ── */}
        <section className="bg-[#050A14] px-6 py-24">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">
                  Sobre o mentor
                </p>
                <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
                  Claudemir Domingos
                </h2>
                <p className="text-lg leading-relaxed text-[#A9BDD8]">
                  Mentor especializado em desenvolvimento de líderes e supervisores com foco em
                  resultado prático. Criador da metodologia LIDERA, que conecta autoavaliação,
                  plano de desenvolvimento individual e acompanhamento pós-treinamento.
                </p>
                <a
                  href="https://wa.me/5564996099020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Tirar dúvidas no WhatsApp
                </a>
              </div>

              <div className="rounded-3xl border border-[#22314C] bg-[#0A1324] p-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#87A6C8]">
                  O que você recebe
                </p>
                <ul className="mt-4 space-y-4">
                  {[
                    'Workshop presencial de meio dia',
                    'Autoavaliação das 5 Dimensões (leva para casa)',
                    'Diagnóstico do seu perfil de liderança',
                    'Plano de prioridades de desenvolvimento',
                    'Certificado de participação',
                    'Desconto para o programa completo (8 módulos)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1E88E5]" />
                      <span className="text-sm font-semibold text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── BLOCO DE URGÊNCIA ── */}
        <section className="border-y border-[#F57C00]/20 bg-gradient-to-r from-[#1A0800] via-[#0F0500] to-[#1A0800] px-6 py-16">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-2xl text-center">
              <UrgencyCounter vagasRestantes={VAGAS_RESTANTES} />
              <h2 className="mt-6 font-heading text-2xl font-extrabold text-white sm:text-3xl">
                Próxima turma: vagas se esgotando
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#A9BDD8]">
                Turmas de máximo 8 pessoas para garantir atenção individualizada e resultado real.
                Quando esgotarem, a próxima data leva semanas para confirmar.
              </p>
              <a
                href="#inscricao"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/30 transition-all hover:bg-[#E65100]"
              >
                Quero garantir minha vaga
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── FORMULÁRIO DE INSCRIÇÃO ── */}
        <section id="inscricao" className="bg-[#F4F8FC] px-6 py-24 text-[#0F172A]">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mx-auto max-w-xl">
              <div className="mb-10 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
                  Inscrição
                </p>
                <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight">
                  Garanta sua vaga
                </h2>
                <p className="mt-3 text-base text-[#475569]">
                  Preencha seus dados e entraremos em contato em até 24h.
                </p>
              </div>
              <div className="rounded-3xl border border-[#D8E2EF] bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                <InscricaoForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#050A14] px-6 py-20">
          <div className="mx-auto w-full max-w-[980px]">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">
                Dúvidas frequentes
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Perguntas sobre o workshop
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl border border-[#23334D] bg-[#0A1324]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-lg text-[#8FA8C5] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="border-t border-[#1D2D45] px-5 py-4 text-sm leading-relaxed text-[#A9BDD8]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="border-t border-[#1A2438] bg-gradient-to-b from-[#0C1629] to-[#050A14] px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Dê o primeiro passo como líder estratégico.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#A9BDD8]">
              Vagas limitadas. Turmas reduzidas. Resultado real.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#inscricao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100]"
              >
                Garantir minha vaga
                <ArrowRight className="h-5 w-5" />
              </a>
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
