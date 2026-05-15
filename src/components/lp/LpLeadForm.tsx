'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Phone, Mail, Building2, Briefcase, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

import { generateEventId, trackPixel, readMetaCookies, readUtms } from '@/lib/meta/pixel-client'

type Props = {
  origem: 'lp_empresarial' | 'lp_pessoal'
  accent: 'blue' | 'orange'
  ctaLabel?: string
  nextStepHref?: string // para onde redireciona após captura
  nextStepLabel?: string
}

const inputClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20'

export function LpLeadForm({
  origem,
  accent,
  ctaLabel,
  nextStepHref,
  nextStepLabel,
}: Props) {
  const router = useRouter()
  const [data, setData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    empresa: '',
    cargo: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const accentBg = accent === 'orange' ? '#F57C00' : '#1565C0'
  const accentHover = accent === 'orange' ? '#E65100' : '#0B4A8F'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return

    if (!data.nome.trim()) {
      setErrorMsg('Informe seu nome.')
      return
    }
    if (!data.whatsapp.trim()) {
      setErrorMsg('Informe seu WhatsApp para contato.')
      return
    }

    setStatus('sending')
    setErrorMsg(null)

    const eventId = generateEventId()
    const { fbc, fbp } = readMetaCookies()
    const utms = readUtms()

    // Dispara Pixel client ANTES da requisição (usa o mesmo eventId para deduplicar)
    trackPixel('Lead', eventId, {
      content_name: origem === 'lp_empresarial' ? 'Diagnóstico Empresa' : 'Diagnóstico Pessoal',
      content_category: origem,
      currency: 'BRL',
      value: origem === 'lp_empresarial' ? 50 : 20,
    })

    try {
      const res = await fetch('/api/lp/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          empresa: data.empresa,
          cargo: data.cargo,
          origem,
          eventId,
          fbc,
          fbp,
          pageUrl: window.location.href,
          utmSource: utms.utm_source,
          utmMedium: utms.utm_medium,
          utmCampaign: utms.utm_campaign,
          utmContent: utms.utm_content,
          utmTerm: utms.utm_term,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Falha ao enviar.')

      setStatus('success')
      // Se houver next step, redireciona após 1.5s
      if (nextStepHref) {
        setTimeout(() => router.push(nextStepHref), 1500)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border-2 border-[#22C55E] bg-[#F0FDF4] p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-[#22C55E]" />
        <h3 className="mt-4 font-heading text-2xl font-extrabold text-[#0F172A]">
          Recebemos seu contato!
        </h3>
        <p className="mt-2 text-sm text-[#475569]">
          {nextStepHref
            ? 'Redirecionando para o próximo passo…'
            : 'O Claudemir vai te chamar no WhatsApp em até 2 horas úteis.'}
        </p>
        {nextStepHref && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#15803D]">
            <Loader2 className="h-4 w-4 animate-spin" />
            {nextStepLabel || 'Carregando…'}
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-[#E3EBF6] bg-white p-6 shadow-lg shadow-[#1565C0]/5"
    >
      <FormField icon={UserIcon} placeholder="Nome completo" value={data.nome} onChange={(v) => setData({ ...data, nome: v })} required />
      <FormField icon={Phone} placeholder="WhatsApp com DDD" value={data.whatsapp} onChange={(v) => setData({ ...data, whatsapp: v })} type="tel" inputMode="tel" required />
      <FormField icon={Mail} placeholder="E-mail (opcional)" value={data.email} onChange={(v) => setData({ ...data, email: v })} type="email" inputMode="email" />
      <FormField icon={Building2} placeholder={origem === 'lp_empresarial' ? 'Empresa' : 'Empresa onde trabalha'} value={data.empresa} onChange={(v) => setData({ ...data, empresa: v })} />
      <FormField icon={Briefcase} placeholder={origem === 'lp_empresarial' ? 'Seu cargo (RH, Diretor, etc)' : 'Seu cargo (Supervisor, Coord...)'} value={data.cargo} onChange={(v) => setData({ ...data, cargo: v })} />

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-3 text-xs text-[#991B1B]">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50"
        style={{ backgroundColor: accentBg }}
        onMouseEnter={(e) => {
          if (status !== 'sending') (e.currentTarget.style.backgroundColor = accentHover)
        }}
        onMouseLeave={(e) => {
          if (status !== 'sending') (e.currentTarget.style.backgroundColor = accentBg)
        }}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            {ctaLabel || 'Quero meu diagnóstico gratuito'}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-[#94A3B8]">
        Seus dados estão seguros · Sem spam · Falamos via WhatsApp em até 2h úteis
      </p>
    </form>
  )
}

function FormField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  inputMode,
  required,
}: {
  icon: typeof UserIcon
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
  inputMode?: 'text' | 'numeric' | 'email' | 'tel'
  required?: boolean
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder + (required ? ' *' : '')}
        inputMode={inputMode}
        className={`${inputClass} pl-10`}
      />
    </div>
  )
}
