import * as React from 'react'

type Props = {
  name: string
  workshopName?: string
}

export function WorkshopFollowupEmailTemplate({
  name,
  workshopName = 'A Função Estratégica do Supervisor',
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
          Obrigado por se inscrever no workshop <strong>&ldquo;{workshopName}&rdquo;</strong>.
          Recebemos seus dados e entraremos em contato em até 24h para confirmar sua vaga.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          Enquanto isso, algumas coisas para você aproveitar:
        </p>

        <div style={{ backgroundColor: '#F4F8FC', borderRadius: 12, padding: '20px 24px', margin: '24px 0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0B4A8F', margin: '0 0 12px 0' }}>
            PREPARE-SE PARA O WORKSHOP:
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20, color: '#475569' }}>
            <li>Pense em 3 situações recentes onde sentiu insegurança como líder</li>
            <li>Liste as 3 pessoas mais difíceis de liderar na sua equipe</li>
            <li>Anote qual decisão mais te tirou o sono este mês</li>
          </ul>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#64748B' }}>
          Essas reflexões vão potencializar seu aprendizado no workshop. Você vai sair sabendo
          exatamente onde está e para onde precisa ir como líder.
        </p>

        <div style={{ textAlign: 'center' as const, margin: '32px 0' }}>
          <a
            href="https://wa.me/5564996099020"
            style={{
              display: 'inline-block',
              backgroundColor: '#25D366',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Tirar dúvidas no WhatsApp
          </a>
        </div>

        <p style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center' as const }}>
          — Claudemir Domingos, Mentor LIDERA
        </p>
      </div>
    </div>
  )
}
