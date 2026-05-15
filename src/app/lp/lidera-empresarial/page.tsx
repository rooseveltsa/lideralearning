import type { Metadata } from 'next'
import { TrendingDown, Users, Target, CheckCircle2, AlertTriangle, Award } from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { LpLeadForm } from '@/components/lp/LpLeadForm'

export const metadata: Metadata = {
  title: 'Lidera Empresarial · Diagnóstico gratuito de liderança',
  description:
    'Seu melhor operador virou supervisor — e a produtividade caiu. Receba o diagnóstico do seu time de líderes em 5 minutos e um PDI executivo personalizado.',
  robots: { index: false, follow: false }, // página dedicada a tráfego pago
}

const dores = [
  {
    icon: TrendingDown,
    titulo: 'Produtividade caiu depois da promoção',
    descricao: 'Você promoveu o melhor técnico, mas ele não sabe liderar gente — e o time perdeu ritmo.',
  },
  {
    icon: Users,
    titulo: 'Turnover do operacional aumentando',
    descricao: 'Quem entra não fica. O ponto comum é sempre a relação com a chefia direta.',
  },
  {
    icon: AlertTriangle,
    titulo: 'RH apagando incêndio o tempo todo',
    descricao: 'Conflitos, retrabalho, faltas — sintomas de um time de supervisores sem método.',
  },
]

const resultados = [
  '90 dias de plano com ferramentas testadas (5W2H, 9Box, GROW, PDCA)',
  'Linguagem comum entre gestor e supervisor sobre o que é "liderar bem"',
  'Indicadores claros: turnover, retrabalho, clima — antes e depois',
  'Sucessão construída — você cria seu próximo gerente em casa',
]

export default function LpEmpresarialPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="pt-24">
        {/* Hero + Form */}
        <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Coluna esquerda — Hero */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1565C0]/30 bg-[#EFF6FE] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
                <Award className="h-3 w-3" />
                Lidera Empresarial · Diagnóstico gratuito
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl">
                Seu melhor operador virou supervisor —
                <br />
                <span className="text-[#1565C0]">e a produtividade caiu.</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#475569]">
                Receba em 5 minutos um <strong className="text-[#0F172A]">PDI executivo personalizado</strong>{' '}
                para evoluir cada supervisor da sua operação — com ferramentas, KPIs e plano de
                90 dias. Sem custo, sem compromisso.
              </p>

              <div className="mt-8 space-y-3">
                {dores.map((d) => (
                  <div key={d.titulo} className="flex items-start gap-3 rounded-xl border border-[#E3EBF6] bg-white p-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FE] text-[#1565C0]">
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

            {/* Coluna direita — Form sticky */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1565C0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white">
                <Target className="h-3 w-3" />
                Diagnóstico em 5 minutos
              </div>
              <h2 className="mb-1 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#0F172A]">
                Comece agora seu diagnóstico
              </h2>
              <p className="mb-5 text-sm text-[#475569]">
                Preencha os dados — Claudemir Domingos te chama no WhatsApp para iniciar o
                diagnóstico do seu time.
              </p>
              <LpLeadForm
                origem="lp_empresarial"
                accent="blue"
                ctaLabel="Quero o diagnóstico da minha equipe"
                nextStepHref="/diagnostico/empresa"
                nextStepLabel="Abrindo diagnóstico completo…"
              />
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto w-full max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
              O que você recebe
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
              Não é palestra, não é coach.
              <br />É um plano executivo para o seu RH.
            </h2>
            <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
              {resultados.map((r) => (
                <div key={r} className="flex items-start gap-3 rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />
                  <span className="text-sm font-medium leading-relaxed text-[#0F172A]">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quem é o Claudemir */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#E3EBF6] bg-gradient-to-br from-[#EFF6FE] to-white p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
              Quem conduz
            </p>
            <h3 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Claudemir Domingos
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#1565C0]">
              Fundador da Lidera Treinamentos
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              Mais de 20 anos formando líderes operacionais em indústrias de pequeno e médio porte.
              Especialista em transformar técnicos brilhantes em líderes que constroem times — sem
              romantizar liderança nem fugir do chão de fábrica.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
