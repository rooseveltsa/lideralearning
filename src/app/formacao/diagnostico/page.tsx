import type { Metadata } from 'next'
import { GraduationCap, Clock, ShieldCheck } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getOrg } from '@/lib/surveys/orgs'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import FormacaoForm from '@/components/formacao/FormacaoForm'

export const metadata: Metadata = {
  title: 'Diagnóstico de Formação de Supervisores | LIDERA',
  description:
    'Diagnóstico de necessidade de formação para supervisores e líderes. Descubra quais módulos LIDERA priorizar na sua trilha de desenvolvimento.',
}

// Instrumento IDENTIFICADO: usa o usuário logado quando houver, senão pede nome/e-mail no formulário.
export default async function FormacaoDiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>
}) {
  const { org } = await searchParams
  const empresa = await getOrg(org)

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
        <div className="mx-auto w-full max-w-[820px]">
          <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
                <GraduationCap className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
                Diagnóstico de formação
              </p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
                De quais módulos você mais precisa agora?
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
                Aqui não tem certo ou errado e isso não é prova nem avaliação do seu desempenho.
                Quanto mais sincero você for, melhor vai ser o seu plano de treinamento. Suas
                respostas vão direto para montar a sua trilha de formação com a Lidera.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1565C0]" />
                  ~12 a 18 minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1565C0]" />
                  Resultado pessoal e seguro (LGPD)
                </span>
              </div>

              {empresa && (
                <p className="mt-4 text-sm text-[#64748B]">
                  Empresa: <strong className="text-[#0F172A]">{empresa.nome}</strong>
                </p>
              )}

              {userProfile?.fullName && (
                <p className="mt-4 text-sm text-[#64748B]">
                  Respondendo como{' '}
                  <strong className="text-[#0F172A]">{userProfile.fullName}</strong>
                </p>
              )}
            </div>

            {/* Aviso de uso das respostas (instrumento identificado) */}
            <div className="mt-6 rounded-2xl border border-[#FCE4B6] bg-[#FFF8EC] p-4 text-sm leading-relaxed text-[#334155]">
              <p className="font-bold text-[#92580B]">Leia antes de responder.</p>
              <p className="mt-1">
                Algumas respostas sobre <strong>segurança e conduta</strong> (por exemplo, regras de
                segurança e respeito com a equipe) podem ser repassadas ao seu RH ou ao consultor da
                Lidera, porque envolvem o cuidado com você e com a equipe. O objetivo nunca é punir,
                e sim apoiar e proteger.
              </p>
            </div>

            <div className="mt-8 border-t border-[#E3EBF6] pt-8">
              <FormacaoForm user={userProfile} orgCode={empresa?.code ?? null} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
