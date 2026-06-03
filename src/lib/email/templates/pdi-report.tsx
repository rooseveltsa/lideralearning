import React from 'react'

import type { PDIReport } from '@/lib/utils/pdi-generator'

// ---------------------------------------------------------------------------
// Perfil display config
// ---------------------------------------------------------------------------

const PERFIL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  reativo: { label: 'Supervisor Reativo', color: '#EF4444', bg: '#FEF2F2' },
  transicao: { label: 'Supervisor em Transicao', color: '#F59E0B', bg: '#FFFBEB' },
  lider_valor: { label: 'Lider de Valor em Formacao', color: '#4CAF35', bg: '#F0FDF4' },
}

// ---------------------------------------------------------------------------
// Shared inline styles
// ---------------------------------------------------------------------------

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
    backgroundColor: '#0F172A',
    padding: '32px 24px',
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
    color: '#94A3B8',
    fontSize: '14px',
    margin: '8px 0 0 0',
  } as React.CSSProperties,
  section: {
    padding: '24px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 16px 0',
    borderBottom: '2px solid #E3EBF6',
    paddingBottom: '8px',
  } as React.CSSProperties,
  perfilBox: {
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '8px',
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
    fontSize: '20px',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  perfilScore: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '8px',
  } as React.CSSProperties,
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    backgroundColor: '#F1F5F9',
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  td: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #E3EBF6',
  } as React.CSSProperties,
  phaseCard: {
    backgroundColor: '#F8FAFD',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #E3EBF6',
  } as React.CSSProperties,
  phaseTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1565C0',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  phaseWeeks: {
    fontSize: '12px',
    color: '#64748B',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  phaseFocus: {
    fontSize: '13px',
    color: '#334155',
    margin: '0 0 8px 0',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
  ctaContainer: {
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#F8FAFD',
  } as React.CSSProperties,
  ctaPrimary: {
    display: 'inline-block',
    backgroundColor: '#7B1FA2',
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
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700,
  } as React.CSSProperties,
} as const

// ---------------------------------------------------------------------------
// Priority badge color
// ---------------------------------------------------------------------------

function priorityColor(priority: string): { color: string; bg: string } {
  switch (priority) {
    case 'critical':
      return { color: '#DC2626', bg: '#FEF2F2' }
    case 'high':
      return { color: '#EA580C', bg: '#FFF7ED' }
    case 'medium':
      return { color: '#CA8A04', bg: '#FEFCE8' }
    default:
      return { color: '#16A34A', bg: '#F0FDF4' }
  }
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export function PDIEmailTemplate(props: {
  report: PDIReport
  siteUrl: string
}): React.ReactElement {
  const { report, siteUrl } = props
  const perfilCfg = PERFIL_CONFIG[report.selfAssessment.perfil] ?? PERFIL_CONFIG.transicao

  const whatsappUrl =
    'https://wa.me/5564996099020?text=Ol%C3%A1%2C%20fiz%20a%20autoavalia%C3%A7%C3%A3o%20e%20quero%20saber%20mais%20sobre%20o%20treinamento%20LIDERA!'

  // Only show dimensions that have self-assessment data
  const scoreDimensions = report.dimensions.filter((d) => d.selfScore > 0)

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>LIDERA</h1>
          <p style={styles.headerSubtitle}>
            Seu Plano de Desenvolvimento Individual
          </p>
        </div>

        {/* ── Greeting ── */}
        <div style={styles.section}>
          <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0' }}>
            Ola, <strong>{report.alunoName}</strong>!
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
            Sua autoavaliacao de lideranca foi processada com sucesso. Abaixo
            esta um resumo do seu diagnostico e plano de desenvolvimento
            personalizado.
          </p>
        </div>

        {/* ── Perfil Result ── */}
        <div style={styles.section}>
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
            <p style={styles.perfilScore}>
              Pontuacao: {report.selfAssessment.total} / 21
            </p>
          </div>
        </div>

        {/* ── Scores per Dimension ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Suas Pontuacoes por Dimensao</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Dimensao</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Nota</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {scoreDimensions.map((dim) => {
                const pColor = priorityColor(dim.priority)
                return (
                  <tr key={dim.name}>
                    <td style={styles.td}>{dim.name}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 700 }}>
                      {dim.selfScore}%
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span
                        style={{
                          ...styles.badge,
                          color: pColor.color,
                          backgroundColor: pColor.bg,
                        }}
                      >
                        {dim.priority}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Strengths & Gaps Summary ── */}
        {(report.strengths.length > 0 || report.criticalGaps.length > 0) && (
          <div style={styles.section}>
            {report.strengths.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A', margin: '0 0 8px 0' }}>
                  Pontos Fortes
                </h3>
                <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.6' }}>
                  {report.strengths.join(' | ')}
                </p>
              </div>
            )}
            {report.criticalGaps.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', margin: '0 0 8px 0' }}>
                  Areas de Desenvolvimento Prioritario
                </h3>
                <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.6' }}>
                  {report.criticalGaps.join(' | ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Plano de Ação por competência (trilhas LIDERA) ── */}
        {report.developmentTracks.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Plano de Ação — Como desenvolver cada gap</h2>

            {report.developmentTracks.map((track, i) => {
              const pc = priorityColor(track.priority)
              return (
                <div key={track.dimensao} style={styles.phaseCard}>
                  <p style={{ ...styles.phaseTitle, color: pc.color }}>
                    Prioridade {i + 1}: {track.dimensao}
                  </p>
                  <p style={styles.phaseWeeks}>{track.moduloLidera}</p>
                  <p style={styles.phaseFocus}>{track.porQueImporta}</p>
                  {track.ferramentas.length > 0 && (
                    <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 8px 0' }}>
                      <strong>Ferramentas LIDERA:</strong>{' '}
                      {track.ferramentas.map((f) => f.sigla).join(' · ')}
                    </p>
                  )}
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {track.acoes.slice(0, 3).map((a, j) => (
                      <li
                        key={j}
                        style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', lineHeight: '1.5' }}
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '8px 0 0 0' }}>
                    <strong>Como medir:</strong> {track.comoMedir}
                  </p>
                </div>
              )
            })}

            <p style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', margin: '4px 0 0 0' }}>
              Veja o plano completo (apostila, leitura e cronograma 30/60/90) no seu PDI na plataforma.
            </p>
          </div>
        )}

        {/* ── CTAs ── */}
        <div style={styles.ctaContainer}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Acesse seu PDI completo na plataforma
          </p>
          <div>
            <a href={`${siteUrl}/treinamento/pdi`} style={styles.ctaPrimary}>
              Ver seu PDI completo na plataforma
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '16px 0' }}>
            Duvidas? Fale diretamente com nosso especialista:
          </p>
          <div>
            <a href={whatsappUrl} style={styles.ctaSecondary}>
              Falar com Claudemir
            </a>
          </div>
        </div>

        {/* ── Footer ── */}
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
