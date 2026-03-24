import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Cpu,
  Heart,
  MessageCircle,
  Phone,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import ModulosAccordion from './ModulosAccordion'

export const metadata: Metadata = {
  title: 'Programa Completo — Supervisor: Da Operação à Liderança | LIDERA',
  description:
    '8 módulos em 16 horas de imersão presencial. Conheça o conteúdo completo do programa que transforma supervisores operacionais em líderes estratégicos.',
}

export default function ModulosPage() {
  const whatsappUrl =
    'https://wa.me/5564999686668?text=Ol%C3%A1%20Claudemir%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20programa%20de%20lideran%C3%A7a.'

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F8FD]">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero compacto */}
        <section className="relative overflow-hidden bg-[#060D1A] py-14 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(30,136,229,0.18),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F57C00]">
              Programa Completo · 16h · 2 dias
            </p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              Supervisor: Da Operação <span className="text-[#1E88E5]">à Liderança</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#A9BDD8]">
              8 módulos práticos. Clique em cada módulo para ver o conteúdo detalhado.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2E4467] bg-[#0E1E35] px-3 py-1.5 font-bold text-[#D3E1F2]">
                <CalendarDays className="h-3.5 w-3.5 text-[#1E88E5]" /> 2 dias
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2E4467] bg-[#0E1E35] px-3 py-1.5 font-bold text-[#D3E1F2]">
                <BookOpen className="h-3.5 w-3.5 text-[#1E88E5]" /> 8 módulos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2E4467] bg-[#0E1E35] px-3 py-1.5 font-bold text-[#D3E1F2]">
                <Heart className="h-3.5 w-3.5 text-[#F57C00]" /> Mentoria 30/60 dias
              </span>
            </div>
          </div>
        </section>

        {/* Módulos Accordion */}
        <section className="mx-auto max-w-4xl px-5 py-12">
          <ModulosAccordion />
        </section>

        {/* Garantia compacta */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-5">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-[#1565C0]" />
              <h2 className="text-xl font-extrabold text-[#0F172A]">Garantia de Implementação</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-5 py-4">
                <p className="text-xl font-extrabold text-[#1565C0]">30 dias</p>
                <p className="text-sm font-bold text-[#0F172A]">Primeira mentoria</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Revisão do PDI, ajustes no plano de ação.
                </p>
              </div>
              <div className="rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-5 py-4">
                <p className="text-xl font-extrabold text-[#F57C00]">60 dias</p>
                <p className="text-sm font-bold text-[#0F172A]">Segunda mentoria</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Certificação e plano de sucessão.
                </p>
              </div>
              <div className="rounded-xl border border-[#D8E2EF] bg-[#F7FAFE] px-5 py-4">
                <p className="text-xl font-extrabold text-[#0F172A]">PDI</p>
                <p className="text-sm font-bold text-[#0F172A]">Diagnóstico gratuito</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Receba seu plano de desenvolvimento individual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#060D1A] py-12 text-white">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-2xl font-extrabold">Pronto para transformar sua liderança?</h2>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/treinamento/autoavaliacao"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-3 text-sm font-bold text-white hover:bg-[#1565C0]"
              >
                <Target className="h-4 w-4" />
                Fazer Diagnóstico Gratuito
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2E4467] px-6 py-3 text-sm font-bold text-[#D3E1F2] hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                Falar com Claudemir
              </a>
            </div>
            <p className="mt-4 text-xs text-[#5A7A9E]">
              <Phone className="mr-1 inline h-3 w-3" />
              (64) 99968-6668
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
