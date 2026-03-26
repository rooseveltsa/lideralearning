import { Award, ShieldCheck } from 'lucide-react'

type CertificadoPDFProps = {
  studentName: string
  courseTitle: string
  completionDate: string
  duration: string
  verificationCode: string
  verifyUrl: string
  qrDataUrl?: string | null
}

export function CertificadoPDF({
  studentName,
  courseTitle,
  completionDate,
  duration,
  verificationCode,
  verifyUrl,
  qrDataUrl,
}: CertificadoPDFProps) {
  return (
    <div className="certificate-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              header, footer, nav, .no-print {
                display: none !important;
              }
              .certificate-page {
                width: 297mm !important;
                height: 210mm !important;
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
              }
            }
            @media screen {
              .certificate-page {
                width: 297mm;
                height: 210mm;
                margin: 0 auto;
                box-shadow: 0 8px 40px rgba(0,0,0,0.15);
              }
            }
          `,
        }}
      />

      <div
        className="relative overflow-hidden bg-white"
        style={{
          width: '297mm',
          height: '210mm',
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Outer decorative border */}
        <div
          className="absolute inset-0"
          style={{
            border: '3px solid #0B4A8F',
            margin: '8mm',
            borderRadius: '4px',
          }}
        />

        {/* Inner decorative border */}
        <div
          className="absolute inset-0"
          style={{
            border: '1px solid #C9A84C',
            margin: '11mm',
            borderRadius: '2px',
          }}
        />

        {/* Top-left corner ornament */}
        <div
          className="absolute"
          style={{
            top: '11mm',
            left: '11mm',
            width: '30mm',
            height: '30mm',
            borderTop: '3px solid #C9A84C',
            borderLeft: '3px solid #C9A84C',
            borderRadius: '2px 0 0 0',
          }}
        />

        {/* Top-right corner ornament */}
        <div
          className="absolute"
          style={{
            top: '11mm',
            right: '11mm',
            width: '30mm',
            height: '30mm',
            borderTop: '3px solid #C9A84C',
            borderRight: '3px solid #C9A84C',
            borderRadius: '0 2px 0 0',
          }}
        />

        {/* Bottom-left corner ornament */}
        <div
          className="absolute"
          style={{
            bottom: '11mm',
            left: '11mm',
            width: '30mm',
            height: '30mm',
            borderBottom: '3px solid #C9A84C',
            borderLeft: '3px solid #C9A84C',
            borderRadius: '0 0 0 2px',
          }}
        />

        {/* Bottom-right corner ornament */}
        <div
          className="absolute"
          style={{
            bottom: '11mm',
            right: '11mm',
            width: '30mm',
            height: '30mm',
            borderBottom: '3px solid #C9A84C',
            borderRight: '3px solid #C9A84C',
            borderRadius: '0 0 2px 0',
          }}
        />

        {/* Subtle background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(11,74,143,0.04) 0%, transparent 60%)',
            margin: '12mm',
          }}
        />

        {/* Content */}
        <div
          className="relative flex h-full flex-col items-center justify-between text-center"
          style={{ padding: '18mm 25mm 14mm 25mm' }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Award style={{ width: '28px', height: '28px', color: '#C9A84C' }} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#0B4A8F',
                }}
              >
                Lidera Treinamentos
              </span>
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#0B4A8F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Certificado de Conclusao
            </h1>
            <div
              style={{
                width: '80mm',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
                marginTop: '4px',
              }}
            />
          </div>

          {/* Main body */}
          <div className="flex flex-col items-center" style={{ marginTop: '-8mm' }}>
            <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
              Certificamos que
            </p>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#0F172A',
                marginTop: '6px',
                lineHeight: 1.2,
                maxWidth: '200mm',
              }}
            >
              {studentName}
            </h2>

            <div
              style={{
                width: '120mm',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
                marginTop: '6px',
              }}
            />

            <p
              style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: 500,
                marginTop: '10px',
                lineHeight: 1.6,
                maxWidth: '200mm',
              }}
            >
              concluiu com exito o programa de formacao
            </p>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0B4A8F',
                marginTop: '6px',
                maxWidth: '220mm',
                lineHeight: 1.3,
              }}
            >
              {courseTitle}
            </h3>

            <p
              style={{
                fontSize: '12px',
                color: '#64748B',
                marginTop: '8px',
              }}
            >
              com carga horaria de <strong style={{ color: '#0F172A' }}>{duration}</strong>,
              concluido em <strong style={{ color: '#0F172A' }}>{completionDate}</strong>.
            </p>
          </div>

          {/* Signature section */}
          <div className="flex w-full items-end justify-between" style={{ maxWidth: '230mm' }}>
            {/* QR Code / Verification */}
            <div className="flex flex-col items-center" style={{ minWidth: '45mm' }}>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code de verificacao"
                  style={{ width: '28mm', height: '28mm' }}
                />
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '28mm',
                    height: '28mm',
                    border: '1px dashed #B1C0D4',
                    borderRadius: '4px',
                    fontSize: '8px',
                    color: '#94A3B8',
                  }}
                >
                  QR Code
                </div>
              )}
              <p
                style={{
                  fontSize: '7px',
                  color: '#94A3B8',
                  marginTop: '2px',
                  maxWidth: '40mm',
                  wordBreak: 'break-all',
                }}
              >
                {verifyUrl}
              </p>
            </div>

            {/* Signature */}
            <div className="flex flex-col items-center" style={{ minWidth: '80mm' }}>
              <div
                style={{
                  width: '70mm',
                  borderBottom: '2px solid #0B4A8F',
                  marginBottom: '4px',
                }}
              />
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Claudemir Domingos
              </p>
              <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>
                Mentor de Lideres
              </p>
            </div>

            {/* Verification code */}
            <div className="flex flex-col items-center" style={{ minWidth: '45mm' }}>
              <div className="flex items-center gap-1" style={{ marginBottom: '2px' }}>
                <ShieldCheck style={{ width: '14px', height: '14px', color: '#4CAF35' }} />
                <span style={{ fontSize: '8px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Verificado
                </span>
              </div>
              <p
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#0B4A8F',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                }}
              >
                {verificationCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
