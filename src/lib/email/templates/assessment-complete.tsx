import React from 'react'

const SITE_URL = 'https://lideralearning.vercel.app'

const WHATSAPP_URL =
  'https://wa.me/5564996099020?text=Ol%C3%A1%2C%20fiz%20a%20autoavalia%C3%A7%C3%A3o%20e%20quero%20saber%20mais%20sobre%20o%20treinamento%20LIDERA!'

const PERFIL_CONFIG: Record<string, { label: string; color: string; bg: string; description: string }> = {
  reativo: {
    label: 'Supervisor Reativo',
    color: '#EF4444',
    bg: '#FEF2F2',
    description:
      'Voce tende a agir de forma corretiva, respondendo aos problemas conforme aparecem. O treinamento vai ajuda-lo a desenvolver uma postura mais proativa e estrategica.',
  },
  transicao: {
    label: 'Supervisor em Transicao',
    color: '#F59E0B',
    bg: '#FFFBEB',
    description:
      'Voce ja demonstra iniciativas de lideranca, mas ainda pode fortalecer competencias-chave. Seu PDI foca em consolidar essa evolucao.',
  },
  lider_valor: {
    label: 'Lider de Valor em Formacao',
    color: '#4CAF35',
    bg: '#F0FDF4',
    description:
      'Voce apresenta um perfil consistente de lideranca com visao estrategica. O proximo passo e aprofundar e multiplicar essas competencias.',
  },
}

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
  perfilBox: {
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  perfilLabel: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  perfilTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  perfilDesc: {
    fontSize: '13px',
    color: '#475569',
    margin: 0,
    lineHeight: '1.6',
    textAlign: 'left' as const,
  } as React.CSSProperties,
  scoreBox: {
    backgroundColor: '#F8FAFD',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center' as const,
    border: '1px solid #E3EBF6',
    marginBottom: '16px',
  } as React.CSSProperties,
  scoreNumber: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#1565C0',
    margin: 0,
  } as React.CSSProperties,
  scoreLabel: {
    fontSize: '13px',
    color: '#64748B',
    margin: '4px 0 0 0',
  } as React.CSSProperties,
  pdiNotice: {
    backgroundColor: '#FFF3E0',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #FFE0B2',
    marginBottom: '8px',
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
    backgroundColor: '#25D366',
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

export function AssessmentCompleteEmailTemplate(props: {
  name: string
  perfil: string
  score: number
}): React.ReactElement {
  const { name, perfil, score } = props
  const perfilCfg = PERFIL_CONFIG[perfil] ?? PERFIL_CONFIG.transicao

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Seu diagnostico esta pronto!</h1>
          <p style={styles.headerSubtitle}>LIDERA Treinamentos</p>
        </div>

        {/* Greeting */}
        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Ola, <strong>{name}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Parabens por completar a autoavaliacao de lideranca! Confira abaixo o
            resultado do seu diagnostico.
          </p>

          {/* Perfil Badge */}
          <div
            style={{
              ...styles.perfilBox,
              backgroundColor: perfilCfg.bg,
              border: `2px solid ${perfilCfg.color}20`,
            }}
          >
            <p style={{ ...styles.perfilLabel, color: perfilCfg.color }}>
              Seu Perfil
            </p>
            <p style={styles.perfilTitle}>{perfilCfg.label}</p>
            <p style={styles.perfilDesc}>{perfilCfg.description}</p>
          </div>

          {/* Score */}
          <div style={styles.scoreBox}>
            <p style={styles.scoreNumber}>
              {score}<span style={{ fontSize: '18px', color: '#94A3B8' }}>/18</span>
            </p>
            <p style={styles.scoreLabel}>Pontuacao total da autoavaliacao</p>
          </div>

          {/* PDI Notice */}
          <div style={styles.pdiNotice}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#F57C00', margin: '0 0 4px 0' }}>
              Seu PDI foi gerado automaticamente!
            </p>
            <p style={{ fontSize: '13px', color: '#6D4C00', margin: 0, lineHeight: '1.5' }}>
              Com base nas suas respostas, criamos um Plano de Desenvolvimento
              Individual personalizado com acoes praticas para os proximos 12
              semanas.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={styles.ctaContainer}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Acesse seu plano de desenvolvimento
          </p>
          <div>
            <a href={`${SITE_URL}/treinamento/pdi`} style={styles.ctaPrimary}>
              Ver meu PDI
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '16px 0 12px 0' }}>
            Quer conversar sobre seu resultado?
          </p>
          <div>
            <a href={WHATSAPP_URL} style={styles.ctaSecondary}>
              Falar com Claudemir
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
            Este email foi enviado automaticamente apos a conclusao da sua
            autoavaliacao de lideranca. Voce esta recebendo porque se cadastrou
            na plataforma LIDERA.
          </p>
        </div>
      </div>
    </div>
  )
}
