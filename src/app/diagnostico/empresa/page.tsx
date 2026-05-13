import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import DiagnosticoEmpresaForm from '@/components/diagnostico/empresa/DiagnosticoEmpresaForm'

export const metadata = {
  title: 'Diagnóstico empresarial · Lidera Treinamentos',
  description:
    'Formulário estruturado de avaliação de supervisores e líderes operacionais. 7 seções, 20-30 minutos.',
}

export default function DiagnosticoEmpresaPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-[860px]">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Trocar tipo de diagnóstico
          </Link>

          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
                Diagnóstico empresarial
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
                Avaliação do Supervisor
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
                Mapeie expectativas, perfil comportamental e gaps. Ao final, você recebe um
                resumo com o fit DISC e nossa equipe entra em contato para apresentar o PDI.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1565C0]" />
                  20-30 minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1565C0]" />
                  Confidencial e LGPD compliant
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-[#E3EBF6] pt-8">
              <DiagnosticoEmpresaForm />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
