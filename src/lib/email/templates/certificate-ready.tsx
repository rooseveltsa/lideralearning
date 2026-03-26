import React from 'react'

const SITE_URL = 'https://lideralearning.vercel.app'

const styles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#F8FAFC',
    margin: 0,
    padding: 0,
    width: '100%',
  } as React.CSSProperties,
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    backgroundColor: '#1565C0',
    padding: '40px 24px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  headerTitle: {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  headerSubtitle: {
    color: '#BBDEFB',
    fontSize: '14px',
    margin: '8px 0 0 0',
  } as React.CSSProperties,
  section: {
    padding: '24px',
  } as React.CSSProperties,
  certCard: {
    backgroundColor: '#F8FAFD',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid #1565C0',
    textAlign: 'center' as const,
    marginBottom: '16px',
  } as React.CSSProperties,
  certIcon: {
    fontSize: '48px',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  certCourse: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  detailRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    padding: '10px 0',
    borderBottom: '1px solid #E3EBF6',
  } as React.CSSProperties,
  detailLabel: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  } as React.CSSProperties,
  detailValue: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
    margin: 0,
  } as React.CSSProperties,
  codeBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'center' as const,
    marginTop: '16px',
  } as React.CSSProperties,
  codeLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  codeValue: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#1565C0',
    fontFamily: 'monospace',
    letterSpacing: '0.15em',
    margin: 0,
  } as React.CSSProperties,
  ctaContainer: {
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#F8FAFD',
  } as React.CSSProperties,
  ctaPrimary: {
    display: 'inline-block',
    backgroundColor: '#1565C0',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '14px 32px',
    borderRadius: '12px',
    marginBottom: '12px',
  } as React.CSSProperties,
  ctaSecondary: {
    display: 'inline-block',
    backgroundColor: '#F57C00',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
  } as React.CSSProperties,
  footer: {
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#0F172A',
  } as React.CSSProperties,
  footerText: {
    color: '#94A3B8',
    fontSize: '12px',
    margin: '0 0 4px 0',
    lineHeight: '1.6',
  } as React.CSSProperties,
} as const

export function CertificateReadyEmailTemplate(props: {
  name: string
  courseName: string
  completionDate: string
  verificationCode: string
}): React.ReactElement {
  const { name, courseName, completionDate, verificationCode } = props

  const certificateUrl = `${SITE_URL}/certificado/${verificationCode}`
  const shareText = encodeURIComponent(
    `Acabei de concluir o treinamento "${courseName}" na LIDERA Treinamentos! Verifique meu certificado: ${certificateUrl}`,
  )
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Parabens! Certificado emitido!</h1>
          <p style={styles.headerSubtitle}>LIDERA Treinamentos</p>
        </div>

        {/* Greeting */}
        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Ola, <strong>{name}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Voce concluiu com sucesso o treinamento e seu certificado digital
            ja esta disponivel. Confira os detalhes abaixo:
          </p>

          {/* Certificate Card */}
          <div style={styles.certCard}>
            <p style={styles.certCourse}>{courseName}</p>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              LIDERA Treinamentos
            </p>
          </div>

          {/* Details */}
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #E3EBF6', fontSize: '13px', color: '#64748B' }}>
                  Aluno
                </td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #E3EBF6', fontSize: '13px', fontWeight: 700, color: '#334155', textAlign: 'right' as const }}>
                  {name}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #E3EBF6', fontSize: '13px', color: '#64748B' }}>
                  Data de conclusao
                </td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #E3EBF6', fontSize: '13px', fontWeight: 700, color: '#334155', textAlign: 'right' as const }}>
                  {completionDate}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Verification Code */}
          <div style={styles.codeBox}>
            <p style={styles.codeLabel}>Codigo de verificacao</p>
            <p style={styles.codeValue}>{verificationCode}</p>
          </div>
        </div>

        {/* CTAs */}
        <div style={styles.ctaContainer}>
          <div>
            <a href={certificateUrl} style={styles.ctaPrimary}>
              Ver Certificado
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '16px 0 12px 0' }}>
            Compartilhe sua conquista:
          </p>
          <div>
            <a
              href={linkedinShareUrl}
              style={{
                ...styles.ctaSecondary,
                backgroundColor: '#0A66C2',
                marginRight: '8px',
              }}
            >
              LinkedIn
            </a>
            <a
              href={whatsappShareUrl}
              style={{
                ...styles.ctaSecondary,
                backgroundColor: '#25D366',
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            <strong style={{ color: '#FFFFFF' }}>LIDERA Treinamentos</strong>
          </p>
          <p style={styles.footerText}>
            Transformando supervisores em lideres de valor
          </p>
          <p style={styles.footerText}>
            contato@lideralearning.vercel.app | (64) 99609-9020
          </p>
          <p style={{ ...styles.footerText, marginTop: '12px', fontSize: '11px' }}>
            Este email foi enviado automaticamente apos a emissao do seu
            certificado. Voce esta recebendo porque se cadastrou na plataforma LIDERA.
          </p>
        </div>
      </div>
    </div>
  )
}
