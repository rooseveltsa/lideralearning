import * as React from 'react'

type Props = {
  name: string
  workshopCompleted?: string
}

export function UpsellFullProgramEmailTemplate({
  name,
  workshopCompleted = 'A Função Estratégica do Supervisor',
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
          Você completou o Módulo 1 — <strong>&ldquo;{workshopCompleted}&rdquo;</strong>.
          Agora você sabe onde está como líder e as 5 dimensões que precisa desenvolver.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          <strong>Mas conhecer é só o primeiro passo.</strong> Os outros 7 módulos vão te dar
          as ferramentas para aplicar tudo no dia a dia:
        </p>

        <div style={{ backgroundColor: '#F4F8FC', borderRadius: 12, padding: '20px 24px', margin: '24px 0' }}>
          <ul style={{ fontSize: 14, lineHeight: 2.2, paddingLeft: 20, color: '#1E293B' }}>
            <li><strong>Módulo 2:</strong> Inteligência Comportamental e Comunicação</li>
            <li><strong>Módulo 3:</strong> Alicerce Ético e Responsabilidade</li>
            <li><strong>Módulo 4:</strong> Gestão da Diversidade Geracional</li>
            <li><strong>Módulo 5:</strong> Engenharia de Equipes e Sucessão</li>
            <li><strong>Módulo 6:</strong> O Supervisor 4.0 (IA e Dados)</li>
            <li><strong>Módulo 7:</strong> Padrões de Sucesso</li>
            <li><strong>Módulo 8:</strong> Estratégia de Carreira + PDI</li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 12,
            padding: '20px 24px',
            margin: '24px 0',
            textAlign: 'center' as const,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F57C00', margin: '0 0 8px 0', textTransform: 'uppercase' as const, letterSpacing: 2 }}>
            EXCLUSIVO PARA PARTICIPANTES DO MÓDULO 1
          </p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
            Desconto especial no programa completo
          </p>
          <p style={{ fontSize: 14, color: '#A9BDD8', margin: '8px 0 0 0' }}>
            2 dias de imersão + 60 dias de acompanhamento + certificação
          </p>
        </div>

        <div style={{ textAlign: 'center' as const, margin: '32px 0' }}>
          <a
            href="https://wa.me/5564996099020?text=Ol%C3%A1%20Claudemir!%20Fiz%20o%20M%C3%B3dulo%201%20e%20quero%20saber%20sobre%20o%20programa%20completo."
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
            Quero saber mais sobre o programa completo
          </a>
        </div>

        <p style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center' as const }}>
          — Claudemir Domingos, Mentor LIDERA
        </p>
      </div>
    </div>
  )
}
