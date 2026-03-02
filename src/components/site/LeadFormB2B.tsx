'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

const gestoresOptions = [
  '1 a 10 gestores',
  '11 a 50 gestores',
  '51 a 200 gestores',
  '200+ gestores',
]

export default function LeadFormB2B() {
  const [form, setForm] = useState({ nome: '', empresa: '', gestores: '', whatsapp: '' })
  const [enviando, setEnviando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const mensagem = encodeURIComponent(
      `Olá! Quero solicitar um Diagnóstico de Liderança.\n\nNome: ${form.nome}\nEmpresa: ${form.empresa}\nNº de Gestores: ${form.gestores}\nWhatsApp: ${form.whatsapp}`
    )
    window.open(`https://wa.me/5500000000000?text=${mensagem}`, '_blank')
    setTimeout(() => setEnviando(false), 2000)
  }

  const isValid = form.nome && form.empresa && form.gestores && form.whatsapp

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Seu nome</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Carlos Mendes"
          className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0B0F19] text-white placeholder:text-[#475569] text-sm focus:outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 transition-all"
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
          className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0B0F19] text-white placeholder:text-[#475569] text-sm focus:outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Nº de gestores na empresa</label>
        <select
          name="gestores"
          value={form.gestores}
          onChange={handleChange}
          className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0B0F19] text-white text-sm focus:outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 transition-all"
          required
        >
          <option value="" className="text-[#475569]">Selecione...</option>
          {gestoresOptions.map(o => (
            <option key={o} value={o}>{o}</option>
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
          className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0B0F19] text-white placeholder:text-[#475569] text-sm focus:outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 transition-all"
          required
        />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={!isValid || enviando}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1E88E5] text-white font-bold rounded-xl hover:bg-[#1565C0] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg shadow-lg shadow-[#1E88E5]/20"
        >
          {enviando
            ? <Loader2 className="h-5 w-5 animate-spin" />
            : <ArrowRight className="h-5 w-5" />}
          {enviando ? 'Abrindo WhatsApp...' : 'Solicitar Diagnóstico Gratuito'}
        </button>
        <p className="text-center text-xs text-[#475569]">
          Sem compromisso. Nosso consultor entra em contato em até 4h úteis.
        </p>
      </div>
    </form>
  )
}
