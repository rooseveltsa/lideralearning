'use client'

import { Download, Printer } from 'lucide-react'

export function CertificadoPrintActions() {
  return (
    <div
      className="no-print"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: 'linear-gradient(135deg, #060D1A 0%, #0B1A30 100%)',
        borderBottom: '1px solid #1E2E48',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          color: '#A9BDD8',
          fontWeight: 600,
          marginRight: '8px',
        }}
      >
        Para salvar como PDF, use <strong style={{ color: '#fff' }}>Ctrl+P</strong> (ou Cmd+P) e
        selecione &quot;Salvar como PDF&quot;.
      </p>

      <button
        type="button"
        onClick={() => window.print()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 18px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#fff',
          background: '#1E88E5',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#1565C0')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#1E88E5')}
      >
        <Printer style={{ width: '16px', height: '16px' }} />
        Imprimir / Salvar PDF
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 18px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#D6E5F7',
          background: 'transparent',
          border: '1px solid #2A3E5D',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = '#40628E')}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = '#2A3E5D')}
      >
        <Download style={{ width: '16px', height: '16px' }} />
        Baixar PDF
      </button>
    </div>
  )
}
