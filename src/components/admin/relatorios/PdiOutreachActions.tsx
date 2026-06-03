'use client'

import { useState } from 'react'
import { Mail, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const SITE = 'https://lideralearning.vercel.app'

type Props = {
  alunoId: string
  nome: string
  whatsapp: string | null
  variant?: 'card' | 'header'
}

function onlyDigits(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

function normalizeBrazilianWhatsapp(value: string | null | undefined): string | null {
  const digits = onlyDigits(value)
  if (!digits) return null
  if (digits.startsWith('55')) return digits
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`
  return digits
}

function buildWhatsappUrl(phone: string | null | undefined, message: string): string | null {
  const normalized = normalizeBrazilianWhatsapp(phone)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function PdiOutreachActions({ alunoId, nome, whatsapp, variant = 'card' }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)

  const firstName = (nome || 'líder').trim().split(/\s+/)[0]
  const whatsappMessage =
    `Olá ${firstName}! 👋 Aqui é a Lidera Treinamentos.\n\n` +
    `Seu PDI de liderança está pronto. Acesse o plano completo de 90 dias em ${SITE}/treinamento/pdi ` +
    `(entre com seu login).\n\nQualquer dúvida, estou à disposição.`
  const whatsappUrl = buildWhatsappUrl(whatsapp, whatsappMessage)

  async function handleSendEmail() {
    if (status === 'sending') return
    setStatus('sending')
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/relatorios/pdi/${alunoId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Falha ao enviar.')
      setStatus('success')
      setFeedback(json.to ? `Enviado para ${json.to}` : 'Email enviado!')
    } catch (err) {
      setStatus('error')
      setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.')
    }
  }

  const sizing =
    variant === 'header'
      ? 'px-3.5 py-2 text-sm'
      : 'px-2.5 py-1.5 text-xs'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleSendEmail}
          disabled={status === 'sending'}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-[#E3EBF6] bg-white font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFD] disabled:opacity-60 ${sizing}`}
          title={`Enviar PDI por email para ${nome}`}
        >
          {status === 'sending' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          {status === 'sending' ? 'Enviando…' : 'Email'}
        </button>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-[#22C55E] bg-[#F0FDF4] font-semibold text-[#15803D] transition-colors hover:bg-[#DCFCE7] ${sizing}`}
            title={`Abrir WhatsApp de ${nome}`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#E3EBF6] text-[#94A3B8] ${sizing}`}
            title="WhatsApp não informado no cadastro"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Sem WhatsApp
          </span>
        )}
      </div>

      {status === 'success' && feedback && (
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#15803D]">
          <CheckCircle className="h-3 w-3 shrink-0" />
          {feedback}
        </span>
      )}
      {status === 'error' && feedback && (
        <span className="flex items-start gap-1 text-[11px] font-medium text-[#991B1B]">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          {feedback}
        </span>
      )}
    </div>
  )
}
