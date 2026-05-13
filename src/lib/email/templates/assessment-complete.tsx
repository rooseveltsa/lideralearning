import React from 'react'

const SITE_URL = 'https://lideralearning.vercel.app'

const WHATSAPP_URL =
  'https://wa.me/5564996099020?text=Ol%C3%A1%2C%20fiz%20a%20autoavalia%C3%A7%C3%A3o%20e%20quero%20saber%20mais%20sobre%20o%20treinamento%20LIDERA!'

const UNSUBSCRIBE_URL =
  'mailto:claudemir@lideralearning.com.br?subject=Remover%20da%20lista%20de%20emails&body=Por%20favor%2C%20remova%20meu%20email%20da%20lista%20da%20LIDERA%20Treinamentos.'

const PERFIL_CONFIG: Record<string, { label: string; color: string; bg: string; description: string }> = {
  reativo: {
    label: 'Supervisor Reativo',
    color: '#EF4444',
    bg: '#FEF2F2',
    description:
      'Você tende a agir de forma corretiva, respondendo aos problemas conforme aparecem. O treinamento vai ajudá-lo a desenvolver uma postura mais proativa e estratégica.',
  },
  transicao: {
    label: 'Supervisor em Transição',
    color: '#F59E0B',
    bg: '#FFFBEB',
    description:
      'Você já demonstra iniciativas de liderança, mas ainda pode fortalecer competências-chave. Seu PDI foca em consolidar essa evolução.',
  },
  lider_valor: {
    label: 'Líder de Valor em Formação',
    color: '#4CAF35',
    bg: '#F0FDF4',
    description:
      'Você apresenta um perfil consistente de liderança com visão estratégica. O próximo passo é aprofundar e multiplicar essas competências.',
  },
}

type DimensoesProp = {
  percepcao: number
  gestao: number
  comunicacao: number
  tecnologia: number
  etica: number
  dor: number
}

type TopGapProp = {
  id: string
  titulo: string
  nota: number
  maxNota: number
  recomendacao: string
}

const DIMENSAO_LABELS: Record<keyof DimensoesProp, string> = {
  percepcao: 'Percepção da Função',
  gestao: 'Gestão de Equipes',
  comunicacao: 'Comunicação e Postura',
  tecnologia: 'Tecnologia, Dados e KPIs',
  etica: 'Alicerce Ético',
  dor: 'Clareza do Desafio',
}

const DIMENSAO_MAX = 3

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
  dimensoesBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3EBF6',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
  } as React.CSSProperties,
  dimensoesTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  dimensaoRow: {
    margin: '0 0 10px 0',
  } as React.CSSProperties,
  dimensaoRowLast: {
    margin: 0,
  } as React.CSSProperties,
  dimensaoHeader: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '4px',
  } as React.CSSProperties,
  barTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#EEF3F9',
    borderRadius: '4px',
    overflow: 'hidden' as const,
  } as React.CSSProperties,
  topGapsBox: {
    backgroundColor: '#FEF7E5',
    border: '1px solid #FCD49C',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
  } as React.CSSProperties,
  topGapsTitle: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#9A3412',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  topGapItem: {
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  topGapItemLast: {
    margin: 0,
  } as React.CSSProperties,
  topGapTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  topGapRec: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
    lineHeight: '1.5',
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
  footerLink: {
    color: '#CBD5E1',
    fontSize: '11px',
    textDecoration: 'underline',
  } as React.CSSProperties,
} as const

function barColor(pct: number): string {
  if (pct >= 80) return '#4CAF35'
  if (pct >= 50) return '#F59E0B'
  return '#EF4444'
}

export function AssessmentCompleteEmailTemplate(props: {
  name: string
  perfil: string
  score: number
  dimensoes?: DimensoesProp
  topGaps?: TopGapProp[]
}): React.ReactElement {
  const { name, perfil, score, dimensoes, topGaps } = props
  const perfilCfg = PERFIL_CONFIG[perfil] ?? PERFIL_CONFIG.transicao

  const dimensaoEntries = dimensoes
    ? (Object.keys(DIMENSAO_LABELS) as Array<keyof DimensoesProp>).map((key, idx, arr) => {
        const nota = dimensoes[key] ?? 0
        const pct = Math.round((nota / DIMENSAO_MAX) * 100)
        const isLast = idx === arr.length - 1
        return { key, label: DIMENSAO_LABELS[key], nota, pct, isLast }
      })
    : []

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Seu diagnóstico está pronto!</h1>
          <p style={styles.headerSubtitle}>LIDERA Treinamentos</p>
        </div>

        {/* Greeting */}
        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Olá, <strong>{name}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Parabéns por completar a autoavaliação de liderança. Confira abaixo o
            resultado do seu diagnóstico e os próximos passos personalizados.
          </p>

          {/* Perfil Badge */}
          <div
            style={{
              ...styles.perfilBox,
              backgroundColor: perfilCfg.bg,
              border: `2px solid ${perfilCfg.color}33`,
            }}
          >
            <p style={{ ...styles.perfilLabel, color: perfilCfg.color }}>Seu Perfil</p>
            <p style={styles.perfilTitle}>{perfilCfg.label}</p>
            <p style={styles.perfilDesc}>{perfilCfg.description}</p>
          </div>

          {/* Score */}
          <div style={styles.scoreBox}>
            <p style={styles.scoreNumber}>
              {score}
              <span style={{ fontSize: '18px', color: '#94A3B8' }}>/18</span>
            </p>
            <p style={styles.scoreLabel}>Pontuação total da autoavaliação</p>
          </div>

          {/* Dimensoes detalhadas (condicional) */}
          {dimensaoEntries.length > 0 && (
            <div style={styles.dimensoesBox}>
              <p style={styles.dimensoesTitle}>Detalhamento por dimensão</p>
              {dimensaoEntries.map(({ key, label, nota, pct, isLast }) => (
                <div key={key} style={isLast ? styles.dimensaoRowLast : styles.dimensaoRow}>
                  <div style={styles.dimensaoHeader}>
                    <span>{label}</span>
                    <span style={{ color: barColor(pct), fontWeight: 700 }}>
                      {nota}/{DIMENSAO_MAX} · {pct}%
                    </span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: barColor(pct),
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top 3 gaps prioritários (condicional) */}
          {topGaps && topGaps.length > 0 && (
            <div style={styles.topGapsBox}>
              <p style={styles.topGapsTitle}>Seus {topGaps.length} gaps prioritários</p>
              {topGaps.map((gap, idx) => (
                <div
                  key={gap.id}
                  style={idx === topGaps.length - 1 ? styles.topGapItemLast : styles.topGapItem}
                >
                  <p style={styles.topGapTitle}>
                    {idx + 1}. {gap.titulo}{' '}
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>
                      ({gap.nota}/{gap.maxNota})
                    </span>
                  </p>
                  <p style={styles.topGapRec}>{gap.recomendacao}</p>
                </div>
              ))}
            </div>
          )}

          {/* PDI Notice */}
          <div style={styles.pdiNotice}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#F57C00', margin: '0 0 4px 0' }}>
              Seu PDI completo está disponível!
            </p>
            <p style={{ fontSize: '13px', color: '#6D4C00', margin: 0, lineHeight: '1.5' }}>
              Com base nas suas respostas, geramos um Plano de Desenvolvimento Individual
              com ações práticas para as próximas 12 semanas.
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
          <p style={styles.footerText}>Transformando supervisores em líderes de valor</p>
          <p style={styles.footerText}>
            Claudemir Domingos | WhatsApp: (64) 9 9609-9020
          </p>
          <p style={{ ...styles.footerText, marginTop: '12px', fontSize: '11px' }}>
            Você recebeu este email porque concluiu a autoavaliação de liderança em{' '}
            {SITE_URL.replace('https://', '')}. Para responder com dúvidas, basta replicar
            este email — chega direto no Claudemir.
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
