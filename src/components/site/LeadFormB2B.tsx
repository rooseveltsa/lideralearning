'use client'

import { FormEvent, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

const gestoresOptions = [
  '1 a 10 gestores',
  '11 a 50 gestores',
  '51 a 200 gestores',
  '200+ gestores',
]

type LeadFormState = {
  nome: string
  empresa: string
  gestores: string
  whatsapp: string
  email: string
}

const initialForm: LeadFormState = {
  nome: '',
  empresa: '',
  gestores: '',
  whatsapp: '',
  email: '',
}

export default function LeadFormB2B() {
  const [form, setForm] = useState<LeadFormState>(initialForm)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValid = useMemo(() => {
    return !!form.nome && !!form.empresa && !!form.gestores && !!form.whatsapp
  }, [form])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!isValid || enviando) {
      return
    }

    setEnviando(true)
    setErro(null)

    try {
      const response = await fetch('/api/b2b/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.nome,
          companyName: form.empresa,
          managersRange: form.gestores,
          whatsapp: form.whatsapp,
          email: form.email,
          sourcePage: 'homepage_b2b_form',
        }),
      })

      const data = (await response.json()) as { success?: boolean; leadId?: string; error?: string }

      if (!response.ok || !data.success || !data.leadId) {
        throw new Error(data.error || 'Falha ao enviar solicitação.')
      }

      setLeadId(data.leadId)
      setForm(initialForm)
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado ao enviar formulário.')
    } finally {
      setEnviando(false)
    }
  }

  if (leadId) {
    const protocol = leadId.slice(0, 8).toUpperCase()

    return (
      <div className="rounded-2xl border border-[#4CAF35]/30 bg-[#4CAF35]/10 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4CAF35] text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">Solicitação registrada</p>
            <p className="text-xs text-[#64748B]">Protocolo: LT-{protocol}</p>
          </div>
        </div>

        <p className="text-sm text-[#334155]">
          Nosso time comercial recebeu sua demanda e vai retornar em até 4h úteis.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Seu nome</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Carlos Mendes"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Empresa</label>
        <input
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          placeholder="Ex: Grupo Industrial Alfa"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Nº de gestores na empresa</label>
        <select
          name="gestores"
          value={form.gestores}
          onChange={handleChange}
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        >
          <option value="" className="text-[#475569]">
            Selecione...
          </option>
          {gestoresOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">WhatsApp corporativo</label>
        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">E-mail corporativo (opcional)</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="contato@empresa.com"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
        />
      </div>

      {erro ? (
        <div className="sm:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </div>
      ) : null}

      <div className="sm:col-span-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={!isValid || enviando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#1565C0]"
        >
          {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {enviando ? 'Enviando solicitação...' : 'Solicitar Diagnóstico Gratuito'}
        </button>
        <p className="text-center text-xs text-[#475569]">Sem compromisso. Retorno em até 4h úteis.</p>
      </div>
    </form>
  )
}
