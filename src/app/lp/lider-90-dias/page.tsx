import type { Metadata } from 'next'
import { Flame, BookOpen, Compass, CheckCircle2, Award, ArrowUpRight } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { LpLeadForm } from '@/components/lp/LpLeadForm'

export const metadata: Metadata = {
  title: 'Lidera · 90 dias para virar o líder que sua empresa precisa',
  description:
    'Você foi promovido por ser bom técnico, mas ninguém te ensinou a liderar. Faça o diagnóstico gratuito e receba um PDI personalizado em 5 minutos.',
  robots: { index: false, follow: false },
}

const dores = [
  {
    icon: Flame,
    titulo: 'Apago incêndio o dia inteiro',
    descricao: 'Você assume tudo porque ninguém faz como você. O time fica dependente — e você esgota.',
  },
  {
    icon: BookOpen,
    titulo: 'Ninguém me ensinou a liderar',
    descricao: 'Você foi promovido por ser bom no técnico. Liderança? Aprendeu na marra, errando.',
  },
  {
    icon: Compass,
    titulo: 'Quero crescer mas não sei o caminho',
    descricao: 'Sente que a empresa espera mais de você, mas falta clareza do que desenvolver primeiro.',
  },
]

const entregas = [
  'Plano de 90 dias com 3 fases (30/30/30) e ferramentas testadas',
  'Classificação do seu nível de liderança hoje e meta realista',
  'Bibliografia personalizada — só os livros que cabem no seu momento',
  'Conversa direta com o Claudemir para destravar o que o PDI não resolve',
]

export default function LpPessoalPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="pt-24">
        {/* Hero + Form */}
        <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Coluna esquerda */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F57C00]/30 bg-[#FFF7ED] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                <Award className="h-3 w-3" />
                Diagnóstico pessoal · 100% gratuito
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl">
                Você foi promovido por ser bom técnico —
                <br />
                <span className="text-[#F57C00]">e agora apaga incêndio o dia inteiro?</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#475569]">
                Em 5 minutos você recebe seu{' '}
                <strong className="text-[#0F172A]">PDI personalizado de 90 dias</strong> — com
                classificação do seu nível atual, meta realista e as 3 ferramentas mais urgentes
                para você desenvolver. Sem motivação rasa, sem fórmula mágica.
              </p>

              <div className="mt-8 space-y-3">
                {dores.map((d) => (
                  <div key={d.titulo} className="flex items-start gap-3 rounded-xl border border-[#E3EBF6] bg-white p-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F57C00]">
                      <d.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{d.titulo}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">{d.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna direita — Form */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F57C00] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white">
                <ArrowUpRight className="h-3 w-3" />
                Diagnóstico em 5 minutos
              </div>
              <h2 className="mb-1 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#0F172A]">
                Comece seu PDI agora
              </h2>
              <p className="mb-5 text-sm text-[#475569]">
                Preenche o WhatsApp e o cargo — o Claudemir te chama para iniciar o diagnóstico
                personalizado.
              </p>
              <LpLeadForm
                origem="lp_pessoal"
                accent="orange"
                ctaLabel="Quero meu PDI personalizado"
                nextStepHref="/diagnostico/pessoal"
                nextStepLabel="Abrindo diagnóstico completo…"
              />
            </div>
          </div>
        </section>

        {/* Entregas */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto w-full max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
              O que você recebe
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
              Não é coach, não é motivação.
              <br />É plano com método.
            </h2>
            <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
              {entregas.map((r) => (
                <div key={r} className="flex items-start gap-3 rounded-2xl border border-[#E3EBF6] bg-[#FFF7ED] p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F57C00]" />
                  <span className="text-sm font-medium leading-relaxed text-[#0F172A]">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Autoridade */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#E3EBF6] bg-gradient-to-br from-[#FFF7ED] to-white p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
              Quem conduz
            </p>
            <h3 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Claudemir Domingos
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#F57C00]">
              Fundador da Lidera Treinamentos
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              20+ anos formando líderes operacionais. Combina ferramentas clássicas (5W2H, GROW,
              PDCA, SBI) com modelos modernos de liderança (Maxwell, DISC) — sempre testado em
              chão de fábrica, nunca só na sala de aula.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
