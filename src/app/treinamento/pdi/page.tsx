import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BookOpen, Clock, Shield } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import PDIForm from '@/components/treinamento/PDIForm'

export const metadata: Metadata = {
  title: 'Plano de Desenvolvimento Individual (PDI) | LIDERA',
  description:
    'Construa seu Plano de Desenvolvimento Individual como lider. Mapeie dimensoes, habilidades e compromissos para as proximas 12 semanas.',
}

export default async function PDIPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/register?redirect=/treinamento/pdi')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const userProfile = {
    id: user.id,
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    email: user.email || '',
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#F8FAFD] to-white">
        {/* Hero */}
        <section className="border-b border-[#E3EBF6] bg-white px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1565C0]/10">
              <BookOpen className="h-7 w-7 text-[#1565C0]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1565C0]">
              Formulario PDI
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Plano de Desenvolvimento Individual
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
              Construa seu plano de desenvolvimento mapeando suas dimensoes de
              lideranca, habilidades tecnicas e comportamentais, e defina
              compromissos concretos para as proximas 12 semanas.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#1565C0]" />
                ~10 minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#1565C0]" />
                Suas respostas sao confidenciais
              </span>
            </div>

            {userProfile.fullName && (
              <p className="mt-4 text-sm text-[#64748B]">
                Respondendo como{' '}
                <strong className="text-[#0F172A]">{userProfile.fullName}</strong>
              </p>
            )}
          </div>
        </section>

        {/* Form */}
        <section className="px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <PDIForm user={userProfile} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
