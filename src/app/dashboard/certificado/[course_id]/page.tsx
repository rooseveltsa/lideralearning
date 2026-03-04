import { randomUUID } from 'crypto'

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Lock, QrCode, ShieldCheck } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { PrintButton } from './PrintButton'

type CourseModule = {
  id: string
  lessons: { id: string }[]
}

type CourseData = {
  id: string
  title: string
  description: string | null
  modules: CourseModule[]
}

type CertificateRow = {
  id: string
  verification_code: string
  issued_at: string
  pdf_url: string | null
}

function buildVerificationCode() {
  return `LIDERA-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`
}

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: string }).code)
  }

  return null
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  return envUrl?.replace(/\/$/, '') || 'http://localhost:3000'
}

async function getOrCreateCertificate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  payload: {
    userId: string
    courseId: string
    enrollmentId: string
    canIssue: boolean
  }
): Promise<{ certificate: CertificateRow | null; setupError: string | null }> {
  const { userId, courseId, enrollmentId, canIssue } = payload

  const existing = await supabase
    .from('certificates')
    .select('id, verification_code, issued_at, pdf_url')
    .eq('enrollment_id', enrollmentId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing.error) {
    const code = getErrorCode(existing.error)
    if (code === '42P01') {
      return {
        certificate: null,
        setupError: 'Tabela certificates não encontrada. Execute docs/database/05_certificates.sql.',
      }
    }

    return {
      certificate: null,
      setupError: existing.error.message,
    }
  }

  if (existing.data) {
    return { certificate: existing.data as CertificateRow, setupError: null }
  }

  if (!canIssue) {
    return { certificate: null, setupError: null }
  }

  const verificationCode = buildVerificationCode()

  const inserted = await supabase
    .from('certificates')
    .insert({
      enrollment_id: enrollmentId,
      user_id: userId,
      course_id: courseId,
      verification_code: verificationCode,
    })
    .select('id, verification_code, issued_at, pdf_url')
    .single()

  if (!inserted.error && inserted.data) {
    return { certificate: inserted.data as CertificateRow, setupError: null }
  }

  const code = getErrorCode(inserted.error)

  if (code === '23505') {
    const retry = await supabase
      .from('certificates')
      .select('id, verification_code, issued_at, pdf_url')
      .eq('enrollment_id', enrollmentId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!retry.error && retry.data) {
      return { certificate: retry.data as CertificateRow, setupError: null }
    }
  }

  if (code === '42P01') {
    return {
      certificate: null,
      setupError: 'Tabela certificates não encontrada. Execute docs/database/05_certificates.sql.',
    }
  }

  return {
    certificate: null,
    setupError: inserted.error?.message || 'Falha ao emitir certificado.',
  }
}

export default async function CertificadoPage({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: course }, { data: enrollment }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('courses').select('id, title, description, modules(id, lessons(id))').eq('id', course_id).single(),
    supabase.from('enrollments').select('id, enrolled_at').eq('user_id', user.id).eq('course_id', course_id).single(),
  ])

  if (!course) notFound()
  if (!enrollment) redirect('/dashboard/cursos')

  const typedCourse = course as CourseData
  const allLessons = typedCourse.modules.flatMap((module) => module.lessons)
  const totalLessons = allLessons.length

  const { data: progressData } = await supabase
    .from('progress')
    .select('lesson_id, is_completed')
    .eq('enrollment_id', enrollment.id)
    .eq('is_completed', true)

  const completedCount = progressData?.length ?? 0
  const pendingCount = Math.max(0, totalLessons - completedCount)
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCertified = progressPercent === 100 && totalLessons > 0

  const { certificate, setupError } = await getOrCreateCertificate(supabase, {
    userId: user.id,
    courseId: course_id,
    enrollmentId: enrollment.id,
    canIssue: isCertified,
  })

  const completionDate = (certificate?.issued_at ? new Date(certificate.issued_at) : new Date()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const certId = certificate?.verification_code || null
  const verifyUrl = certId ? `${getBaseUrl()}/certificado/verificar/${certId}` : null

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-7 p-4 lg:p-8">
      <Link
        href={`/dashboard/cursos/${course_id}`}
        className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F9FE]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para trilha
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)] md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(30,136,229,0.22),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Certificação Lidera</p>
          <h1 className="mt-3 max-w-4xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">{typedCourse.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#A9BDD8]">
            {isCertified
              ? 'Parabéns, todos os requisitos da trilha foram concluídos. Seu certificado está pronto para validação pública.'
              : 'Finalize 100% das aulas da trilha para liberar automaticamente seu certificado oficial.'}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Aulas concluídas', value: `${completedCount}/${totalLessons}` },
              { label: 'Progresso', value: `${progressPercent}%` },
              { label: 'Status', value: isCertified ? 'Certificado liberado' : 'Em progresso' },
              { label: 'Validação', value: certId ? certId : 'Pendente' },
            ].map((item) => (
              <article key={item.label} className="rounded-xl border border-[#2C3E5B] bg-[#0E1A2E]/88 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#93AECF]">{item.label}</p>
                <p className="mt-1 text-base font-extrabold text-white">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!isCertified ? (
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-3xl border border-[#D8E2EF] bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#E3EBF6] bg-[#F8FAFD]">
                <Lock className="h-6 w-6 text-[#64748B]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Certificado bloqueado</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Continue sua execução</h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#64748B]">
              Faltam <strong className="text-[#0F172A]">{pendingCount}</strong> {pendingCount === 1 ? 'aula' : 'aulas'} para liberar o certificado.
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EEF7]">
              <div className="h-full rounded-full bg-[#1E88E5] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-[#64748B]">{progressPercent}% da trilha concluído</p>

            <Link
              href={`/dashboard/cursos/${course_id}`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#1E88E5] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
            >
              Continuar aprendizado
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-[#D8E2EF] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Requisitos de emissão</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-sm text-[#334155]">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" />
                Concluir 100% das aulas da trilha
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-sm text-[#334155]">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" />
                Manter matrícula ativa no programa
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-sm text-[#334155]">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" />
                Certificado com código único de validação
              </div>
            </div>
          </article>
        </section>
      ) : (
        <>
          {setupError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{setupError}</div>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <article className="relative overflow-hidden rounded-3xl border border-[#1E2E48] bg-[#070E1B] p-8 shadow-[0_24px_48px_rgba(2,6,23,0.55)] md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(30,136,229,0.22),transparent_35%),radial-gradient(circle_at_88%_90%,rgba(245,124,0,0.15),transparent_35%)]" />
              <div className="relative text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2C4566] bg-[#10213A] text-[#9EC6F1]">
                  <Award className="h-8 w-8" />
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8EAED1]">Certificado de conclusão</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  {profile?.full_name ?? 'Aluno Lidera'}
                </h2>
                <p className="mt-3 text-sm text-[#A9BDD8]">concluiu com êxito o programa</p>
                <p className="mt-2 text-xl font-bold text-[#9EC6F1]">{typedCourse.title}</p>

                <div className="mx-auto mt-7 flex w-full max-w-lg items-center justify-center gap-2 rounded-xl border border-[#294567] bg-[#0E1A2E] px-4 py-3 text-xs font-semibold text-[#BFD3EA]">
                  <ShieldCheck className="h-4 w-4 text-[#4CAF35]" />
                  Certificado autenticável por código único
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#2A4163] bg-[#0E1A2E] p-4 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8EAED1]">Data de emissão</p>
                    <p className="mt-1 text-sm font-semibold text-white">{completionDate}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A4163] bg-[#0E1A2E] p-4 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8EAED1]">Código de validação</p>
                    <p className="mt-1 text-sm font-semibold text-white">{certId ?? 'Pendente'}</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="space-y-4 rounded-3xl border border-[#D8E2EF] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Ações do certificado</p>

              <div className="flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-sm text-[#334155]">
                <QrCode className="h-4 w-4 text-[#0B4A8F]" />
                O link de validação é público e pode ser enviado para RH ou recrutadores.
              </div>

              <div className="flex flex-wrap gap-3">
                <PrintButton />
                {verifyUrl ? (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-5 text-sm font-bold text-[#334155] transition-colors hover:bg-[#F5F9FE]"
                  >
                    Abrir validação
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {verifyUrl ? (
                <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">URL de validação</p>
                  <p className="mt-1 break-all text-xs text-[#334155]">{verifyUrl}</p>
                </div>
              ) : null}

              {setupError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{setupError}</div>
              ) : null}
            </article>
          </section>
        </>
      )}
    </div>
  )
}
