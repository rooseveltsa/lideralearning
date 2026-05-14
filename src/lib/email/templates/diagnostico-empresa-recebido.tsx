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
  ctaContainer: {
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#F8FAFD',
  } as React.CSSProperties,
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
  footerLink: { color: '#CBD5E1', fontSize: '11px', textDecoration: 'underline' } as React.CSSProperties,
} as const

function buildWhatsappUrl(gestorNome: string, empresa: string): string {
  const text = `Olá Claudemir! Sou ${gestorNome} da ${empresa}. Acabei de enviar o diagnóstico de supervisor pelo site e quero conversar sobre os próximos passos.`
  return `https://wa.me/5564996099020?text=${encodeURIComponent(text)}`
}

export function DiagnosticoEmpresaRecebidoTemplate(props: {
  gestorNome: string
  empresa: string
  supervisorNome: string
  fitScore: number
  discScores: Record<string, number>
  diagnosticoId?: string | null
}): React.ReactElement {
  const { gestorNome, empresa, supervisorNome, fitScore, discScores, diagnosticoId } = props
  const firstName = gestorNome.trim().split(' ')[0]
  const pdiUrl = diagnosticoId ? `${SITE_URL}/diagnostico/empresa/pdi/${diagnosticoId}` : null

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Diagnóstico recebido!</h1>
          <p style={styles.headerSubtitle}>LIDERA Treinamentos</p>
        </div>

        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Olá, <strong>{firstName}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px 0', lineHeight: '1.6' }}>
            Recebemos o diagnóstico do supervisor <strong>{supervisorNome}</strong> da{' '}
            <strong>{empresa}</strong>. O Claudemir vai analisar seu mapeamento e entrar em contato
            em até 24h com a leitura completa e os próximos passos do programa.
          </p>

          <div style={styles.card}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
              Resumo do mapeamento
            </p>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>Fit de expectativa</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1565C0' }}>
                {fitScore}/100
              </span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Dominância (D)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444' }}>
                {discScores.D}%
              </span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Influência (I)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>
                {discScores.I}%
              </span>
            </div>
            <div style={styles.scoreRow}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Estabilidade (S)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E' }}>
                {discScores.S}%
              </span>
            </div>
            <div style={{ ...styles.scoreRow, borderBottom: 'none' }}>
              <span style={{ fontSize: '13px', color: '#334155' }}>DISC — Conformidade (C)</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1565C0' }}>
                {discScores.C}%
              </span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
            Esses números servem como referência inicial. Na conversa com o Claudemir você vai
            receber a análise qualitativa, cruzamento expectativa × percepção e proposta de PDI.
          </p>
        </div>

        {pdiUrl && (
          <div style={{ ...styles.ctaContainer, backgroundColor: '#EFF6FE' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
              PDI executivo do {supervisorNome.split(' ')[0]} está pronto
            </p>
            <a
              href={pdiUrl}
              style={{
                ...styles.ctaPrimary,
                backgroundColor: '#1565C0',
                marginBottom: '8px',
              }}
            >
              Ver PDI do supervisor
            </a>
            <p style={{ fontSize: '11px', color: '#0B4A8F', margin: '8px 0 0 0' }}>
              Insumo para reunião 1:1 · plano detalhado em 3 fases de 30 dias · KPIs operacionais
            </p>
          </div>
        )}

        <div style={styles.ctaContainer}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
            Quer apoio executivo na implementação?
          </p>
          <a href={buildWhatsappUrl(gestorNome, empresa)} style={styles.ctaPrimary}>
            Falar com Claudemir
          </a>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            <strong style={{ color: '#FFFFFF' }}>LIDERA Treinamentos</strong>
          </p>
          <p style={styles.footerText}>Transformando supervisores em líderes de valor</p>
          <p style={styles.footerText}>Claudemir Domingos | WhatsApp: (64) 9 9609-9020</p>
          <p style={{ ...styles.footerText, marginTop: '12px', fontSize: '11px' }}>
            Você recebeu este email porque enviou um diagnóstico em{' '}
            {SITE_URL.replace('https://', '')}.
          </p>
          <p style={{ ...styles.footerText, marginTop: '8px', fontSize: '11px' }}>
            <a href={UNSUBSCRIBE_URL} style={styles.footerLink}>
              Não desejo receber estes emails
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
