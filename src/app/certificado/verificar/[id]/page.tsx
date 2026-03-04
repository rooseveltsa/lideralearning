import Link from 'next/link'
import { Award, CheckCircle2, HelpCircle, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

type CertificateDbRow = {
  verification_code: string
  issued_at: string
  user_id: string
  course_id: string
}

type CourseRow = {
  title: string
}

type ProfileRow = {
  full_name: string | null
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function VerificarCertificadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const code = id.trim().toUpperCase()

  const admin = createAdminClient()

  const { data: certificate, error } = await admin
    .from('certificates')
    .select('verification_code, issued_at, user_id, course_id')
    .eq('verification_code', code)
    .maybeSingle()

  const tableMissing = typeof error?.code === 'string' && error.code === '42P01'
  const isValid = !error && !!certificate

  let courseTitle: string | null = null
  let fullName: string | null = null

  if (isValid && certificate) {
    const cert = certificate as CertificateDbRow
    const [{ data: course }, { data: profile }] = await Promise.all([
      admin.from('courses').select('title').eq('id', cert.course_id).maybeSingle(),
      admin.from('profiles').select('full_name').eq('id', cert.user_id).maybeSingle(),
    ])

    courseTitle = (course as CourseRow | null)?.title ?? null
    fullName = (profile as ProfileRow | null)?.full_name ?? null
  }

  return (
    <div className="min-h-screen bg-[#050A14] px-6 py-14 text-[#E5ECF8]">
      <div className="mx-auto w-full max-w-[860px] space-y-7">
        <section className="rounded-3xl border border-[#23334D] bg-[#0A1324] p-8 shadow-[0_20px_40px_rgba(2,6,23,0.5)] md:p-10">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Validação pública</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Autenticidade de certificado</h1>
              <p className="mt-2 text-sm text-[#A9BDD8]">
                Código consultado: <span className="font-semibold text-[#D5E6F7]">{code}</span>
              </p>
            </div>

            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${
                isValid ? 'border-green-500/30 bg-green-500/10 text-green-300' : tableMissing ? 'border-amber-400/35 bg-amber-500/10 text-amber-200' : 'border-red-500/30 bg-red-500/10 text-red-300'
              }`}
            >
              {isValid ? (
                <CheckCircle2 className="h-7 w-7" />
              ) : tableMissing ? (
                <ShieldAlert className="h-7 w-7" />
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </div>
          </div>

          <div
            className={`mt-6 rounded-2xl border px-5 py-4 ${
              isValid
                ? 'border-green-500/30 bg-green-500/10 text-green-100'
                : tableMissing
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-100'
                  : 'border-red-500/30 bg-red-500/10 text-red-100'
            }`}
          >
            <p className="text-sm font-semibold">
              {tableMissing
                ? 'Estrutura de certificados não configurada neste ambiente.'
                : isValid
                  ? 'Certificado válido e emitido pela Lidera Treinamentos.'
                  : 'Não encontramos certificado com este código.'}
            </p>
            <p className="mt-1 text-xs opacity-90">
              {tableMissing
                ? 'Execute docs/database/05_certificates.sql para habilitar a validação.'
                : isValid
                  ? 'A emissão e o código de autenticação estão íntegros.'
                  : 'Verifique se o código foi digitado corretamente e tente novamente.'}
            </p>
          </div>
        </section>

        {isValid && certificate ? (
          <section className="rounded-3xl border border-[#23334D] bg-[#0A1324] p-7 shadow-[0_20px_40px_rgba(2,6,23,0.45)]">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#4CAF35]" />
              <p className="text-sm font-bold text-white">Dados autenticados</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#2A3E5D] bg-[#0F1B30] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA8C5]">Aluno</p>
                <p className="mt-1 text-sm font-semibold text-white">{fullName || 'Aluno Lidera'}</p>
              </div>
              <div className="rounded-xl border border-[#2A3E5D] bg-[#0F1B30] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA8C5]">Programa</p>
                <p className="mt-1 text-sm font-semibold text-white">{courseTitle || 'Formação Lidera'}</p>
              </div>
              <div className="rounded-xl border border-[#2A3E5D] bg-[#0F1B30] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA8C5]">Código</p>
                <p className="mt-1 text-xs font-semibold text-white">{(certificate as CertificateDbRow).verification_code}</p>
              </div>
              <div className="rounded-xl border border-[#2A3E5D] bg-[#0F1B30] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA8C5]">Data de emissão</p>
                <p className="mt-1 text-sm font-semibold text-white">{formatDate((certificate as CertificateDbRow).issued_at)}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-[#23334D] bg-[#0A1324] p-7 shadow-[0_20px_40px_rgba(2,6,23,0.45)]">
            <div className="flex items-start gap-3">
              <HelpCircle className="mt-0.5 h-5 w-5 text-[#8FA8C5]" />
              <div>
                <p className="text-sm font-bold text-white">Precisa de apoio na validação?</p>
                <p className="mt-1 text-sm text-[#A9BDD8]">
                  Se você recebeu o certificado por e-mail, confira novamente o código completo antes de tentar a validação.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1E88E5] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            <Award className="h-4 w-4" />
            Conhecer a Lidera
          </Link>
          <Link
            href="/contato"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2A3E5D] bg-[#0A1324] px-5 text-sm font-bold text-[#D6E5F7] transition-colors hover:border-[#40628E] hover:text-white"
          >
            Falar com suporte
          </Link>
        </div>
      </div>
    </div>
  )
}
