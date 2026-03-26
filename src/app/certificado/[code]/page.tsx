import { notFound } from 'next/navigation'
import QRCode from 'qrcode'

import { createAdminClient } from '@/lib/supabase/service'
import { CertificadoPDF } from '@/components/certificado/CertificadoPDF'

import { CertificadoPrintActions } from './CertificadoPrintActions'

type CertificateDbRow = {
  verification_code: string
  issued_at: string
  user_id: string
  course_id: string
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  return envUrl?.replace(/\/$/, '') || 'http://localhost:3000'
}

export default async function CertificadoPrintPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const normalizedCode = code.trim().toUpperCase()

  const admin = createAdminClient()

  const { data: certificate, error } = await admin
    .from('certificates')
    .select('verification_code, issued_at, user_id, course_id')
    .eq('verification_code', normalizedCode)
    .maybeSingle()

  if (error || !certificate) return notFound()

  const cert = certificate as CertificateDbRow

  const [{ data: course }, { data: profile }] = await Promise.all([
    admin.from('courses').select('title').eq('id', cert.course_id).maybeSingle(),
    admin.from('profiles').select('full_name').eq('id', cert.user_id).maybeSingle(),
  ])

  const studentName = (profile as { full_name: string | null } | null)?.full_name || 'Aluno Lidera'
  const courseTitle = (course as { title: string } | null)?.title || 'Formacao Lidera'

  const completionDate = new Date(cert.issued_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const verifyUrl = `${getBaseUrl()}/certificado/verificar/${cert.verification_code}`

  let qrDataUrl: string | null = null
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0B4A8F', light: '#FFFFFF' },
    })
  } catch {
    // QR generation failed silently
  }

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Certificado - {studentName} - {courseTitle}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                background: #f1f5f9;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
              }
              @media print {
                body { background: white; }
                .no-print { display: none !important; }
              }
            `,
          }}
        />
      </head>
      <body>
        <CertificadoPrintActions />

        <div style={{ padding: '20px 0' }}>
          <CertificadoPDF
            studentName={studentName}
            courseTitle={courseTitle}
            completionDate={completionDate}
            duration="16 horas"
            verificationCode={cert.verification_code}
            verifyUrl={verifyUrl}
            qrDataUrl={qrDataUrl}
          />
        </div>
      </body>
    </html>
  )
}
