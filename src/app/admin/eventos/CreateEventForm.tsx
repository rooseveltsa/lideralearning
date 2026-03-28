'use client'

import { useState } from 'react'
import { CalendarDays, Loader2, Plus } from 'lucide-react'

type FormState = {
  title: string
  description: string
  event_type: string
  location: string
  city: string
  start_date: string
  end_date: string
  max_capacity: string
  price: string
  mentor_name: string
}

export default function CreateEventForm({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    event_type: 'workshop',
    location: '',
    city: 'Catalão',
    start_date: '',
    end_date: '',
    max_capacity: '10',
    price: '',
    mentor_name: 'Claudemir Domingos',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.start_date) {
      setError('Título e data de início são obrigatórios.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          event_type: form.event_type,
          location: form.location || null,
          city: form.city || null,
          state: 'GO',
          start_date: new Date(form.start_date).toISOString(),
          end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
          max_capacity: parseInt(form.max_capacity) || 10,
          price: form.price ? parseFloat(form.price) : null,
          mentor_name: form.mentor_name || null,
          status: 'draft',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar evento.')
      }

      setForm({
        title: '', description: '', event_type: 'workshop', location: '',
        city: 'Catalão', start_date: '', end_date: '', max_capacity: '10',
        price: '', mentor_name: 'Claudemir Domingos',
      })
      setOpen(false)
      onCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
      >
        <Plus className="h-4 w-4" />
        Criar evento
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-[#1E88E5]" />
        <h3 className="text-lg font-extrabold text-[#0F172A]">Novo Evento</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">
              Título <span className="text-red-500">*</span>
            </label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Ex: Workshop Módulo 1"
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Tipo</label>
            <select name="event_type" value={form.event_type} onChange={handleChange}
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]">
              <option value="workshop">Workshop</option>
              <option value="immersion">Imersão</option>
              <option value="training">Treinamento</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Descrição</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2}
            placeholder="Descrição breve do evento"
            className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">
              Data início <span className="text-red-500">*</span>
            </label>
            <input name="start_date" type="datetime-local" value={form.start_date} onChange={handleChange} required
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Data fim</label>
            <input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange}
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Vagas máximas</label>
            <input name="max_capacity" type="number" value={form.max_capacity} onChange={handleChange}
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Local</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Nome do local"
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Cidade</label>
            <input name="city" value={form.city} onChange={handleChange}
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#64748B]">Preço (R$)</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00"
              className="w-full rounded-lg border border-[#D8E2EF] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]" />
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1565C0] disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {loading ? 'Criando...' : 'Criar evento'}
          </button>
          <button type="button" onClick={() => setOpen(false)}
            className="rounded-xl border border-[#D8E2EF] px-6 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F4F8FC]">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
