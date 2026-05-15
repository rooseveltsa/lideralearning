'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, Mail, MessageCircle, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type Props = {
  diagnosticoId: string
  tipo: 'pessoal' | 'empresa'
  pdiHref: string
  contatoEmail: string
  contatoNome: string
  whatsappUrl: string | null
  enviadoEm: string | null
  emailDefault: {
    to: string
    subject: string
    body: string
  }
}

export function PdiActionsCell({
  diagnosticoId,
  tipo,
  pdiHref,
  contatoEmail,
  contatoNome,
  whatsappUrl,
  enviadoEm,
  emailDefault,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [to, setTo] = useState(emailDefault.to)
  const [subject, setSubject] = useState(emailDefault.subject)
  const [body, setBody] = useState(emailDefault.body)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const accent = tipo === 'pessoal' ? '#F57C00' : '#1565C0'
  const accentBg = tipo === 'pessoal' ? '#FFF7ED' : '#EFF5FD'
  const accentText = tipo === 'pessoal' ? '#9A3412' : '#0B4A8F'

  async function handleSend() {
    setStatus('sending')
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admin/diagnosticos/${diagnosticoId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, to, subject, body }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Falha ao enviar.')
      setStatus('success')
      setTimeout(() => {
        setModalOpen(false)
        setStatus('idle')
        window.location.reload()
      }, 1500)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido.')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5">
        <Link
          href={pdiHref}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
          style={{ borderColor: '#E3EBF6', color: accentText, backgroundColor: accentBg }}
          title="Abrir PDI completo"
        >
          <Eye className="h-3 w-3" />
          PDI
        </Link>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#E3EBF6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFD]"
          title={`Enviar PDI por email para ${contatoNome}`}
        >
          <Mail className="h-3 w-3" />
          Email
        </button>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#22C55E] bg-[#F0FDF4] px-2.5 py-1.5 text-xs font-semibold text-[#15803D] transition-colors hover:bg-[#DCFCE7]"
            title={`Abrir WhatsApp de ${contatoNome}`}
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        ) : (
          <span
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#E3EBF6] px-2.5 py-1.5 text-xs text-[#94A3B8]"
            title="WhatsApp não informado"
          >
            <MessageCircle className="h-3 w-3" />
            Sem WhatsApp
          </span>
        )}
      </div>

      {enviadoEm && (
        <span className="flex items-center gap-1 text-[10px] font-medium text-[#15803D]">
          <CheckCircle className="h-2.5 w-2.5" />
          Enviado {formatRelative(enviadoEm)}
        </span>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && status !== 'sending') setModalOpen(false)
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E3EBF6] p-5">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">
                  Enviar PDI por email
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Personalize a mensagem antes de enviar para{' '}
                  <strong>{contatoNome}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={status === 'sending'}
                className="rounded-lg p-1 text-[#64748B] transition-colors hover:bg-[#F8FAFD] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#334155]">
                  Para
                </label>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={status === 'sending'}
                  className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 disabled:bg-[#F8FAFD]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#334155]">
                  Assunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={status === 'sending'}
                  className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 disabled:bg-[#F8FAFD]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#334155]">
                  Mensagem
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={status === 'sending'}
                  rows={14}
                  className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm leading-relaxed transition-colors focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 disabled:bg-[#F8FAFD]"
                />
                <p className="mt-1 text-xs text-[#94A3B8]">
                  O link do PDI já está no corpo. O sistema envia em formato texto (mantém quebras de linha).
                </p>
              </div>

              {status === 'error' && errorMsg && (
                <div className="flex items-start gap-2 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-start gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-sm text-[#15803D]">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Email enviado com sucesso! Atualizando lista…</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E3EBF6] bg-[#F8FAFD] p-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={status === 'sending'}
                className="rounded-xl border border-[#E3EBF6] bg-white px-4 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFD] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={status === 'sending' || status === 'success'}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F] disabled:opacity-50"
                style={{ backgroundColor: accent }}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Enviar agora
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hide email/whatsapp from contact email (only used for tooltip) */}
      <span className="sr-only">{contatoEmail}</span>
    </div>
  )
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias}d`
  if (dias < 30) return `há ${Math.floor(dias / 7)}sem`
  return `há ${Math.floor(dias / 30)}m`
}
