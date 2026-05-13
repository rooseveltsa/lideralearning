import React from 'react'

const SITE_URL = 'https://lideralearning.vercel.app'
const UNSUBSCRIBE_URL =
  'mailto:claudemir.lidera@gmail.com?subject=Remover%20da%20lista%20de%20emails'

const styles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
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
    backgroundColor: '#F57C00',
    padding: '40px 24px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  headerTitle: { color: '#FFFFFF', fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' } as React.CSSProperties,
  headerSubtitle: { color: '#FFE0B2', fontSize: '14px', margin: '8px 0 0 0' } as React.CSSProperties,
  section: { padding: '24px' } as React.CSSProperties,
  card: {
    backgroundColor: '#F8FAFD',
    border: '1px solid #E3EBF6',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '14px',
  } as React.CSSProperties,
  scoreRow: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px 0',
    borderBottom: '1px solid #EEF3F9',
  } as React.CSSProperties,
  ctaContainer: { padding: '24px', textAlign: 'center' as const, backgroundColor: '#F8FAFD' } as React.CSSProperties,
  ctaPrimary: {
    display: 'inline-block',
    backgroundColor: '#25D366',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '14px 28px',
    borderRadius: '12px',
  } as React.CSSProperties,
  footer: { padding: '24px', textAlign: 'center' as const, backgroundColor: '#0F172A' } as React.CSSProperties,
  footerText: { color: '#94A3B8', fontSize: '12px', margin: '0 0 4px 0', lineHeight: '1.6' } as React.CSSProperties,
  footerLink: { color: '#CBD5E1', fontSize: '11px', textDecoration: 'underline' } as React.CSSProperties,
} as const

function buildWhatsappUrl(name: string): string {
  const firstName = name.trim().split(' ')[0]
  const text = `Olá Claudemir! Sou ${firstName} e acabei de fazer meu PDI pelo site. Quero conversar sobre os próximos passos do meu desenvolvimento.`
  return `https://wa.me/5564996099020?text=${encodeURIComponent(text)}`
}

function radarColor(n: number): string {
  if (n >= 8) return '#22C55E'
  if (n >= 5) return '#F59E0B'
  return '#EF4444'
}

export function DiagnosticoPessoalRecebidoTemplate(props: {
  nomeCompleto: string
  empresa?: string
  selfScore: number
  radarAverage: number
  discScores: Record<string, number>
}): React.ReactElement {
  const { nomeCompleto, empresa, selfScore, radarAverage, discScores } = props
  const firstName = nomeCompleto.trim().split(' ')[0]

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Seu PDI inicial está pronto!</h1>
          <p style={styles.headerSubtitle}>LIDERA Treinamentos</p>
        </div>

        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Olá, <strong>{firstName}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px 0', lineHeight: '1.6' }}>
            Recebemos sua autoavaliação{empresa ? ` da ${empresa}` : ''} e o seu Plano de
            Desenvolvimento Individual. O <strong>Claudemir</strong> vai analisar pessoalmente e
            entrar em contato em até 24h com a leitura completa do seu caso.
          </p>

          <div style={styles.card}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
              Resumo do seu mapeamento
            </p>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>Autoavaliação geral</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1565C0' }}>
                {selfScore}/100
              </span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>Radar de pilares (média)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: radarColor(radarAverage) }}>
                {radarAverage.toFixed(1)}/10
              </span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Dominância (D)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444' }}>{discScores.D}%</span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Influência (I)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>{discScores.I}%</span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Estabilidade (S)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E' }}>{discScores.S}%</span>
            </div>
            <div style={{ ...styles.scoreRow, borderBottom: 'none' }}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Conformidade (C)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1565C0' }}>{discScores.C}%</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
            Esses números são apenas a referência inicial. O valor real está no plano que vamos
            construir junto com você — com ações práticas dos próximos 7, 30 e 90 dias.
          </p>
        </div>

        <div style={styles.ctaContainer}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
            Quer adiantar a conversa?
          </p>
          <a href={buildWhatsappUrl(nomeCompleto)} style={styles.ctaPrimary}>
            Falar com Claudemir agora
          </a>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}><strong style={{ color: '#FFFFFF' }}>LIDERA Treinamentos</strong></p>
          <p style={styles.footerText}>Transformando supervisores em líderes de valor</p>
          <p style={styles.footerText}>Claudemir Domingos | WhatsApp: (64) 9 9609-9020</p>
          <p style={{ ...styles.footerText, marginTop: '12px', fontSize: '11px' }}>
            Você recebeu este email porque fez um diagnóstico em {SITE_URL.replace('https://', '')}.
          </p>
          <p style={{ ...styles.footerText, marginTop: '8px', fontSize: '11px' }}>
            <a href={UNSUBSCRIBE_URL} style={styles.footerLink}>Não desejo receber estes emails</a>
          </p>
        </div>
      </div>
    </div>
  )
}
