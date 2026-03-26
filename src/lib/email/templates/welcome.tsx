import React from 'react'

const SITE_URL = 'https://lideralearning.vercel.app'

const WHATSAPP_URL =
  'https://wa.me/5564996099020?text=Ol%C3%A1%2C%20acabei%20de%20me%20cadastrar%20na%20LIDERA%20e%20gostaria%20de%20saber%20mais!'

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
    fontSize: '28px',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  headerSubtitle: {
    color: '#BBDEFB',
    fontSize: '15px',
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  } as React.CSSProperties,
  section: {
    padding: '32px 24px',
  } as React.CSSProperties,
  greeting: {
    fontSize: '16px',
    color: '#334155',
    margin: '0 0 16px 0',
    lineHeight: '1.6',
  } as React.CSSProperties,
  featureCard: {
    backgroundColor: '#F8FAFD',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '12px',
    border: '1px solid #E3EBF6',
  } as React.CSSProperties,
  featureIcon: {
    fontSize: '20px',
    marginRight: '10px',
  } as React.CSSProperties,
  featureTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1565C0',
    margin: 0,
  } as React.CSSProperties,
  featureDesc: {
    fontSize: '13px',
    color: '#64748B',
    margin: '4px 0 0 0',
    lineHeight: '1.5',
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

export function WelcomeEmailTemplate(props: {
  name: string
}): React.ReactElement {
  const { name } = props

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Bem-vindo a LIDERA Treinamentos!</h1>
          <p style={styles.headerSubtitle}>
            Sua jornada de desenvolvimento em lideranca comeca agora
          </p>
        </div>

        {/* Greeting */}
        <div style={styles.section}>
          <p style={styles.greeting}>
            Ola, <strong>{name}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Estamos muito felizes em ter voce na plataforma LIDERA. Aqui voce vai
            desenvolver suas habilidades de lideranca com um metodo pratico e
            personalizado. Veja o que voce ja pode fazer:
          </p>

          {/* Features */}
          <div style={styles.featureCard}>
            <p style={styles.featureTitle}>Faca seu diagnostico gratuito</p>
            <p style={styles.featureDesc}>
              Descubra seu perfil de lideranca com nossa autoavaliacao rapida.
              Em poucos minutos, voce recebe um diagnostico completo e um
              Plano de Desenvolvimento Individual (PDI) personalizado.
            </p>
          </div>

          <div style={styles.featureCard}>
            <p style={styles.featureTitle}>Explore nossos modulos</p>
            <p style={styles.featureDesc}>
              Acesse 8 modulos de treinamento cobrindo desde percepcao e
              autoconhecimento ate gestao de equipes, comunicacao, tecnologia e
              etica profissional.
            </p>
          </div>

          <div style={styles.featureCard}>
            <p style={styles.featureTitle}>Acompanhe sua evolucao</p>
            <p style={styles.featureDesc}>
              Monitore seu progresso no dashboard, complete modulos e obtenha
              seu certificado de conclusao.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={styles.ctaContainer}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Comece agora mesmo!
          </p>
          <div>
            <a href={`${SITE_URL}/dashboard`} style={styles.ctaPrimary}>
              Acessar Plataforma
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '16px 0 12px 0' }}>
            Recomendamos comecar pelo diagnostico de lideranca:
          </p>
          <div>
            <a href={`${SITE_URL}/treinamento/autoavaliacao`} style={styles.ctaSecondary}>
              Fazer Diagnostico
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
            Claudemir — (64) 99609-9020
          </p>
          <p style={styles.footerText}>
            <a
              href={WHATSAPP_URL}
              style={{ color: '#25D366', textDecoration: 'none', fontWeight: 700 }}
            >
              Falar no WhatsApp
            </a>
          </p>
          <p style={{ ...styles.footerText, marginTop: '12px', fontSize: '11px' }}>
            Voce esta recebendo este email porque se cadastrou na plataforma
            LIDERA Treinamentos. Se nao foi voce, por favor ignore esta mensagem.
          </p>
        </div>
      </div>
    </div>
  )
}
