import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

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

/**
 * Generates a minimal, valid PDF document with the certificate data.
 * This uses raw PDF content streams — no external libraries needed.
 */
function generatePdfBytes(opts: {
  studentName: string
  courseTitle: string
  completionDate: string
  verificationCode: string
  verifyUrl: string
}): Buffer {
  const { studentName, courseTitle, completionDate, verificationCode, verifyUrl } = opts

  // A4 Landscape dimensions in points (1mm = 2.835pt)
  const pageWidth = 841.89 // 297mm
  const pageHeight = 595.28 // 210mm
  const cx = pageWidth / 2

  // Helper: PDF text operator (centered)
  function centeredText(text: string, y: number, fontSize: number, r: number, g: number, b: number) {
    return `${r} ${g} ${b} rg\nBT /F1 ${fontSize} Tf ${cx} ${y} Td (${escapePdf(text)}) Tj ET\n`
  }

  function escapePdf(text: string) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  }

  // Build content stream
  let stream = ''

  // Border rectangle
  stream += '0.043 0.29 0.56 RG\n' // #0B4A8F stroke
  stream += '2 w\n'
  stream += `25 25 ${pageWidth - 50} ${pageHeight - 50} re S\n`

  // Gold inner border
  stream += '0.788 0.659 0.298 RG\n' // #C9A84C
  stream += '0.5 w\n'
  stream += `35 35 ${pageWidth - 70} ${pageHeight - 70} re S\n`

  // Title: LIDERA TREINAMENTOS
  stream += centeredText('LIDERA TREINAMENTOS', pageHeight - 85, 14, 0.043, 0.29, 0.56)

  // CERTIFICADO DE CONCLUSAO
  stream += centeredText('CERTIFICADO DE CONCLUSAO', pageHeight - 115, 28, 0.043, 0.29, 0.56)

  // Gold line
  stream += '0.788 0.659 0.298 rg\n'
  stream += `${cx - 100} ${pageHeight - 125} 200 1.5 re f\n`

  // "Certificamos que"
  stream += centeredText('Certificamos que', pageHeight - 165, 13, 0.39, 0.45, 0.52)

  // Student name
  stream += centeredText(studentName, pageHeight - 200, 28, 0.06, 0.09, 0.16)

  // Gold line under name
  stream += '0.788 0.659 0.298 rg\n'
  stream += `${cx - 150} ${pageHeight - 212} 300 0.8 re f\n`

  // "concluiu com exito o programa de formacao"
  stream += centeredText('concluiu com exito o programa de formacao', pageHeight - 240, 13, 0.39, 0.45, 0.52)

  // Course title
  stream += centeredText(courseTitle, pageHeight - 270, 20, 0.043, 0.29, 0.56)

  // Duration + date
  stream += centeredText(
    `com carga horaria de 16 horas, concluido em ${completionDate}.`,
    pageHeight - 300,
    11,
    0.39,
    0.45,
    0.52
  )

  // Signature line
  stream += '0.043 0.29 0.56 rg\n'
  stream += `${cx - 80} 110 160 1.5 re f\n`

  // Signature name
  stream += centeredText('Claudemir Domingos', 90, 13, 0.06, 0.09, 0.16)

  // Signature title
  stream += centeredText('Mentor de Lideres', 74, 10, 0.39, 0.45, 0.52)

  // Verification code (bottom-right)
  stream += '0.39 0.45 0.52 rg\n'
  stream += `BT /F1 7 Tf 580 50 Td (Codigo: ${escapePdf(verificationCode)}) Tj ET\n`

  // Verify URL (bottom-left)
  stream += `BT /F1 6 Tf 50 50 Td (${escapePdf(verifyUrl)}) Tj ET\n`

  // Build PDF structure
  const objects: string[] = []

  // Object 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj')

  // Object 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj')

  // Object 3: Page
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`
  )

  // Object 4: Content stream
  const streamBytes = Buffer.from(stream, 'utf-8')
  objects.push(
    `4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream\nendobj`
  )

  // Object 5: Font (Helvetica — built-in PDF font)
  objects.push(
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj'
  )

  // Assemble PDF
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const offsets: number[] = []

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'))
    pdf += obj + '\n'
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8')
  pdf += 'xref\n'
  pdf += `0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }

  pdf += 'trailer\n'
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += 'startxref\n'
  pdf += `${xrefOffset}\n`
  pdf += '%%EOF\n'

  return Buffer.from(pdf, 'binary')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const normalizedCode = code.trim().toUpperCase()

  const admin = createAdminClient()

  const { data: certificate, error } = await admin
    .from('certificates')
    .select('verification_code, issued_at, user_id, course_id')
    .eq('verification_code', normalizedCode)
    .maybeSingle()

  if (error || !certificate) {
    return NextResponse.json(
      { error: 'Certificado nao encontrado.' },
      { status: 404 }
    )
  }

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

  const pdfBuffer = generatePdfBytes({
    studentName,
    courseTitle,
    completionDate,
    verificationCode: cert.verification_code,
    verifyUrl,
  })

  const filename = `certificado-${normalizedCode}.pdf`

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
