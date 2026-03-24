'use client'

import { FormEvent, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

type FormState = {
  nome: string
  email: string
  whatsapp: string
  empresa: string
  cargo: string
  tempoLideranca: string
  tamanhEquipe: string
  maiorDesafio: string
}

const initialForm: FormState = {
  nome: '',
  email: '',
  whatsapp: '',
  empresa: '',
  cargo: '',
  tempoLideranca: '',
  tamanhEquipe: '',
  maiorDesafio: '',
}

const tempoOptions = [
  'Ainda não assumi',
  'Menos de 6 meses',
  '6 meses a 1 ano',
  '1 a 3 anos',
  'Mais de 3 anos',
]

const equipeOptions = [
  '1 a 5 pessoas',
  '6 a 15 pessoas',
  '16 a 30 pessoas',
  '30+ pessoas',
]

const desafioOptions = [
  'Insegurança na função',
  'Relacionamento com a equipe',
  'Liderar antigos colegas',
  'Tomada de decisão',
  'Comunicação e postura',
  'Manter a equipe engajada',
  'Gestão de conflitos',
]

export default function InscricaoForm() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValid = useMemo(() => {
    return !!form.nome && !!form.whatsapp && !!form.cargo && !!form.tempoLideranca
  }, [form])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid || enviando) return

    setEnviando(true)
    setErro(null)

    try {
      const response = await fetch('/api/treinamento/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          treinamento: 'lideranca-abril-2026',
          sourcePage: 'treinamento_inscricao',
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar inscrição.')
      }

      setSucesso(true)
      setForm(initialForm)
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado ao enviar inscrição.')
    } finally {
      setEnviando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="rounded-2xl border border-[#4CAF35]/30 bg-[#4CAF35]/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4CAF35] text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Inscrição realizada!</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#A9BDD8]">
          Sua inscrição foi registrada com sucesso. O mentor Claudemir vai entrar em contato pelo
          WhatsApp para confirmar sua participação e enviar os detalhes do evento.
        </p>
        <a
          href="https://wa.me/5564996099020"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
        >
          Falar com Claudemir no WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Nome completo *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: João da Silva"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">WhatsApp *</label>
        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="(64) 99999-9999"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">E-mail</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="joao@empresa.com"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Empresa</label>
        <input
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          placeholder="Nome da empresa"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Cargo atual *</label>
        <input
          name="cargo"
          value={form.cargo}
          onChange={handleChange}
          placeholder="Ex: Supervisor de produção"
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Tempo como líder/supervisor *</label>
        <select
          name="tempoLideranca"
          value={form.tempoLideranca}
          onChange={handleChange}
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
          required
        >
          <option value="" className="text-[#475569]">Selecione...</option>
          {tempoOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Tamanho da equipe</label>
        <select
          name="tamanhEquipe"
          value={form.tamanhEquipe}
          onChange={handleChange}
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
        >
          <option value="" className="text-[#475569]">Selecione...</option>
          {equipeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#94A3B8]">Maior desafio atual</label>
        <select
          name="maiorDesafio"
          value={form.maiorDesafio}
          onChange={handleChange}
          className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
        >
          <option value="" className="text-[#475569]">Selecione...</option>
          {desafioOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F57C00] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#E65100]"
        >
          {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {enviando ? 'Enviando inscrição...' : 'Confirmar inscrição'}
        </button>
        <p className="text-center text-xs text-[#475569]">
          Ao se inscrever, o mentor Claudemir entrará em contato para confirmar sua participação.
        </p>
      </div>
    </form>
  )
}
