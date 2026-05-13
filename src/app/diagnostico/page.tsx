import { Suspense } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { DiagnosticoAutoOpen } from '@/components/diagnostico/DiagnosticoAutoOpen'

export const metadata = {
  title: 'Diagnóstico de Liderança · Lidera Treinamentos',
  description: 'Comece pelo diagnóstico gratuito de liderança.',
}

export default function DiagnosticoFallbackPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="flex min-h-[60vh] items-center px-6 py-20">
        <div className="mx-auto w-full max-w-[520px] text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Diagnóstico gratuito
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748B]">
            Antes de começar, escolha como você está fazendo o diagnóstico.
          </p>

          <Suspense fallback={null}>
            <DiagnosticoAutoOpen />
          </Suspense>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
