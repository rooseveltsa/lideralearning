import * as React from 'react'

type Props = {
  name: string
  lastAccessDays: number
  courseName?: string
  progressPercent?: number
}

export function ReengagementEmailTemplate({
  name,
  lastAccessDays,
  courseName = 'seu treinamento',
  progressPercent = 0,
}: Props) {
  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', maxWidth: 600, margin: '0 auto', color: '#1E293B' }}>
      <div style={{ backgroundColor: '#050A14', padding: '32px 24px', textAlign: 'center' as const }}>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>LIDERA</h1>
      </div>

      <div style={{ padding: '32px 24px' }}>
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          Olá <strong>{name}</strong>,
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          Faz <strong>{lastAccessDays} dias</strong> que você não acessa {courseName}.
          Seu progresso está em <strong>{progressPercent}%</strong> — falta pouco para completar!
        </p>

        <div
          style={{
            backgroundColor: '#FFF7ED',
            border: '1px solid #FDBA74',
            borderRadius: 12,
            padding: '20px 24px',
            margin: '24px 0',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#9A3412', margin: '0 0 8px 0' }}>
            VOCÊ SABIA?
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#9A3412', margin: 0 }}>
            Líderes que completam o treinamento têm 3x mais chance de serem promovidos
            nos próximos 12 meses. Não deixe seu desenvolvimento parar.
          </p>
        </div>

        <div style={{ textAlign: 'center' as const, margin: '32px 0' }}>
          <a
            href="https://lideralearning.vercel.app/dashboard"
            style={{
              display: 'inline-block',
              backgroundColor: '#F57C00',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Continuar meu treinamento
          </a>
        </div>

        <p style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center' as const }}>
          — Equipe LIDERA Treinamentos
        </p>
      </div>
    </div>
  )
}
