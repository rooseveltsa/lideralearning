import { randomUUID } from 'crypto'

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Download, Lock, Printer, QrCode, ShieldCheck } from 'lucide-react'

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
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-learning-border bg-learning-panel px-4 py-2.5 text-sm font-semibold text-learning-text transition-colors hover:border-learning-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para trilha
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-learning-border bg-learning-panel p-6 text-learning-text md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,154,90,0.16),transparent_42%)]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-learning-accent">Certificação Lidera</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight md:text-4xl">{typedCourse.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-learning-muted">
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
              <article key={item.label} className="rounded-xl border border-learning-border bg-learning-bg/80 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-learning-muted">{item.label}</p>
                <p className="mt-1 break-all text-base font-semibold text-learning-text">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!isCertified ? (
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-3xl border border-learning-border bg-learning-panel p-6 md:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-learning-border bg-learning-bg">
                <Lock className="h-6 w-6 text-learning-muted" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-learning-muted">Certificado bloqueado</p>
                <h2 className="mt-1 text-2xl font-semibold text-learning-text">Continue de onde parou</h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-learning-muted">
              Faltam <strong className="text-learning-text">{pendingCount}</strong> {pendingCount === 1 ? 'aula' : 'aulas'} para liberar o certificado.
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-learning-bg">
              <div className="h-full rounded-full bg-learning-accent transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-learning-muted">{progressPercent}% da trilha concluído</p>

            <Link
              href={`/dashboard/cursos/${course_id}`}
              className="learning-button mt-6"
            >
              Continuar aprendizado
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-learning-border bg-learning-panel p-6 md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-learning-accent">Requisitos de emissão</p>
            <div className="mt-4 space-y-3">
              {[
                'Concluir 100% das aulas da trilha',
                'Manter matrícula ativa no programa',
                'Certificado com código único de validação',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-learning-border bg-learning-bg px-4 py-3 text-sm text-learning-text">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-learning-success" />
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : (
        <>
          {setupError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{setupError}</div>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <article className="relative overflow-hidden rounded-3xl border border-learning-border bg-learning-bg p-6 md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(255,154,90,0.18),transparent_36%)]" />
              <div className="relative text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-learning-border bg-learning-panel text-learning-accent">
                  <Award className="h-8 w-8" />
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-learning-accent">Certificado de conclusão</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-learning-text md:text-4xl">
                  {profile?.full_name ?? 'Aluno Lidera'}
                </h2>
                <p className="mt-3 text-sm text-learning-muted">concluiu com êxito o programa</p>
                <p className="mt-2 text-xl font-semibold text-learning-accent">{typedCourse.title}</p>

                <div className="mx-auto mt-7 flex w-full max-w-lg items-center justify-center gap-2 rounded-xl border border-learning-border bg-learning-panel px-4 py-3 text-xs font-semibold text-learning-text">
                  <ShieldCheck className="h-4 w-4 text-learning-success" />
                  Certificado autenticável por código único
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-learning-border bg-learning-panel p-4 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-learning-muted">Data de emissão</p>
                    <p className="mt-1 text-sm font-semibold text-learning-text">{completionDate}</p>
                  </div>
                  <div className="rounded-xl border border-learning-border bg-learning-panel p-4 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-learning-muted">Código de validação</p>
                    <p className="mt-1 break-all text-sm font-semibold text-learning-text">{certId ?? 'Pendente'}</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="space-y-4 rounded-3xl border border-learning-border bg-learning-panel p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-learning-accent">Ações do certificado</p>

              <div className="flex items-center gap-2 rounded-xl border border-learning-border bg-learning-bg px-4 py-3 text-sm text-learning-text">
                <QrCode className="h-4 w-4 shrink-0 text-learning-accent" />
                O link de validação é público e pode ser enviado para RH ou recrutadores.
              </div>

              <div className="flex flex-wrap gap-3">
                <PrintButton />
                {certId ? (
                  <a
                    href={`/certificado/${certId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learning-button"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir certificado
                  </a>
                ) : null}
                {certId ? (
                  <a
                    href={`/api/certificado/pdf/${certId}`}
                    download
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-learning-border px-5 text-sm font-semibold text-learning-text transition-colors hover:border-learning-accent"
                  >
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </a>
                ) : null}
                {verifyUrl ? (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-learning-border px-5 text-sm font-semibold text-learning-text transition-colors hover:border-learning-accent"
                  >
                    Abrir validação
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {verifyUrl ? (
                <div className="rounded-xl border border-learning-border bg-learning-bg px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-learning-muted">URL de validação</p>
                  <p className="mt-1 break-all text-xs text-learning-text">{verifyUrl}</p>
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
