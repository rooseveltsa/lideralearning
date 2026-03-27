'use client'

import { Suspense, useState } from 'react'
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react'

import { useUtmParams } from '@/lib/hooks/useUtmParams'

type FormState = {
  nome: string
  email: string
  whatsapp: string
  empresa: string
  cargo: string
}

const WHATSAPP_NUMBER = '5564996099020'

function InscricaoFormInner() {
  const utm = useUtmParams()
  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    whatsapp: '',
    empresa: '',
    cargo: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.nome || !form.whatsapp) {
      setError('Nome e WhatsApp são obrigatórios.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/treinamento/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          whatsapp: form.whatsapp,
          empresa: form.empresa,
          cargo: form.cargo || 'Supervisor / Líder',
          tempoLideranca: 'a-confirmar',
          treinamento: 'modulo-1-funcao-estrategica',
          sourcePage: 'modulo-1',
          ...utm,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar inscrição.')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const msg = encodeURIComponent(
      `Olá Claudemir! Me inscrevi no workshop Módulo 1 — A Função Estratégica do Supervisor. Meu nome é ${form.nome}.`
    )
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3 className="text-xl font-extrabold text-[#0F172A]">Inscrição recebida!</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          Entraremos em contato em até 24h para confirmar sua vaga e passar os detalhes do workshop.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
        >
          <MessageCircle className="h-4 w-4" />
          Confirmar pelo WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#475569]">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#475569]">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="(64) 9 9999-9999"
            className="w-full rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#475569]">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          className="w-full rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="empresa" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#475569]">
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            value={form.empresa}
            onChange={handleChange}
            placeholder="Nome da empresa"
            className="w-full rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>
        <div>
          <label htmlFor="cargo" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#475569]">
            Cargo atual
          </label>
          <input
            id="cargo"
            name="cargo"
            type="text"
            value={form.cargo}
            onChange={handleChange}
            placeholder="Ex: Supervisor de Produção"
            className="w-full rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F57C00]/25 transition-all hover:bg-[#E65100] disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Quero me inscrever'}
        {!loading && <ArrowRight className="h-5 w-5" />}
      </button>

      <p className="text-center text-xs text-[#94A3B8]">
        Seus dados são protegidos. Sem spam.
      </p>
    </form>
  )
}

export default function InscricaoForm() {
  return (
    <Suspense>
      <InscricaoFormInner />
    </Suspense>
  )
}
