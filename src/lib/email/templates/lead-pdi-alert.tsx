import React from 'react'

const PERFIL_LABELS: Record<string, { label: string; color: string }> = {
  reativo: { label: 'Reativo', color: '#DC2626' },
  transicao: { label: 'Em Transição', color: '#F57C00' },
  lider_valor: { label: 'Líder de Valor', color: '#0F8F3A' },
}

const styles = {
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
    backgroundColor: '#0F172A',
    padding: '28px 24px',
  } as React.CSSProperties,
  kicker: {
    color: '#F57C00',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    margin: '0 0 6px 0',
  } as React.CSSProperties,
  headerTitle: {
    color: '#FFFFFF',
    fontSize: '22px',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.01em',
  } as React.CSSProperties,
  section: {
    padding: '24px',
  } as React.CSSProperties,
  row: {
    fontSize: '14px',
    color: '#334155',
    margin: '0 0 8px 0',
    lineHeight: '1.6',
  } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 800,
    color: '#FFFFFF',
  } as React.CSSProperties,
  quoteCard: {
    backgroundColor: '#FFF7ED',
    border: '1px solid #FED7AA',
    borderRadius: '10px',
    padding: '14px 16px',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  quoteLabel: {
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#9A3412',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  quoteText: {
    fontSize: '14px',
    color: '#0F172A',
    margin: 0,
    lineHeight: '1.6',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
  ctaContainer: {
    padding: '8px 24px 28px 24px',
  } as React.CSSProperties,
  ctaPrimary: {
    display: 'inline-block',
    backgroundColor: '#1565C0',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    marginRight: '8px',
  } as React.CSSProperties,
  ctaWhats: {
    display: 'inline-block',
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
  } as React.CSSProperties,
  footer: {
    padding: '18px 24px',
    backgroundColor: '#F1F5F9',
  } as React.CSSProperties,
  footerText: {
    color: '#64748B',
    fontSize: '12px',
    margin: 0,
    lineHeight: '1.6',
  } as React.CSSProperties,
} as const

export function LeadPdiAlertTemplate(props: {
  participantName: string
  participantEmail: string
  perfil: string
  score: number
  dorAtual?: string | null
  custoFuturo?: string | null
  adminPdiUrl: string
  whatsappUrl?: string | null
}): React.ReactElement {
  const {
    participantName,
    participantEmail,
    perfil,
    score,
    dorAtual,
    custoFuturo,
    adminPdiUrl,
    whatsappUrl,
  } = props

  const perfilInfo = PERFIL_LABELS[perfil] ?? { label: perfil, color: '#64748B' }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.kicker}>Novo gatilho de venda · PDI</p>
          <h1 style={styles.headerTitle}>
            {participantName} acabou de fazer o diagnóstico
          </h1>
        </div>

        <div style={styles.section}>
          <p style={styles.row}>
            <strong>Participante:</strong> {participantName}
          </p>
          <p style={styles.row}>
            <strong>E-mail:</strong>{' '}
            <a href={`mailto:${participantEmail}`} style={{ color: '#1565C0' }}>
              {participantEmail}
            </a>
          </p>
          <p style={styles.row}>
            <strong>Perfil atual:</strong>{' '}
            <span style={{ ...styles.badge, backgroundColor: perfilInfo.color }}>
              {perfilInfo.label}
            </span>{' '}
            <span style={{ color: '#64748B' }}>· score {score}/21</span>
          </p>

          {(dorAtual || custoFuturo) && (
            <div style={{ marginTop: '16px' }}>
              {dorAtual && (
                <div style={styles.quoteCard}>
                  <p style={styles.quoteLabel}>Dor relatada hoje</p>
                  <p style={styles.quoteText}>&ldquo;{dorAtual}&rdquo;</p>
                </div>
              )}
              {custoFuturo && (
                <div style={styles.quoteCard}>
                  <p style={styles.quoteLabel}>Custo se nada mudar</p>
                  <p style={styles.quoteText}>&ldquo;{custoFuturo}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.ctaContainer}>
          <a href={adminPdiUrl} style={styles.ctaPrimary}>
            Ver PDI completo
          </a>
          {whatsappUrl && (
            <a href={whatsappUrl} style={styles.ctaWhats}>
              Falar no WhatsApp
            </a>
          )}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Gatilho automático: este participante preencheu a autoavaliação de
            liderança. É o momento ideal para abrir conversa sobre treinamento
            presencial.
          </p>
        </div>
      </div>
    </div>
  )
}
