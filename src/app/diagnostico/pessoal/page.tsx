import Link from 'next/link'
import { ArrowLeft, User, Clock, ShieldCheck } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import DiagnosticoPessoalForm from '@/components/diagnostico/pessoal/DiagnosticoPessoalForm'

export const metadata = {
  title: 'Autoavaliação de liderança · Lidera Treinamentos',
  description:
    'Autoavaliação comportamental, radar de pilares e Plano de Desenvolvimento Individual.',
}

export default async function DiagnosticoPessoalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile: { id: string; fullName: string; email: string } | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    userProfile = {
      id: user.id,
      fullName: profile?.full_name || user.user_metadata?.full_name || '',
      email: user.email || '',
    }
  }

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
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F57C00]">
                <User className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                Autoavaliação profissional
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
                Construa seu PDI
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
                Autoavaliação comportamental + radar de 10 pilares de vida + plano de ação para
                os próximos 90 dias. Ao final, o Claudemir analisa pessoalmente e te chama no
                WhatsApp.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#F57C00]" />
                  25-40 minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#F57C00]" />
                  Confidencial e LGPD compliant
                </span>
              </div>

              {userProfile?.fullName && (
                <p className="mt-4 text-sm text-[#64748B]">
                  Respondendo como <strong className="text-[#0F172A]">{userProfile.fullName}</strong>
                </p>
              )}
            </div>

            <div className="mt-8 border-t border-[#E3EBF6] pt-8">
              <DiagnosticoPessoalForm user={userProfile} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
