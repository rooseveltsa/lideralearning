import Link from 'next/link'
import { CalendarDays, MapPin, Ticket, Users } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import CreateEventForm from './CreateEventForm'

type EventRow = {
  id: string
  title: string
  event_type: string
  location: string | null
  city: string | null
  start_date: string
  end_date: string | null
  max_capacity: number
  current_enrollment: number
  price: number | null
  status: string
  mentor_name: string | null
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-50 text-green-700',
  sold_out: 'bg-red-50 text-red-700',
  completed: 'bg-blue-50 text-blue-700',
  canceled: 'bg-gray-100 text-gray-400',
}

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  sold_out: 'Esgotado',
  completed: 'Concluído',
  canceled: 'Cancelado',
}

export default async function AdminEventosPage() {
  const admin = createAdminClient()

  const { data: events, error } = await admin
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })

  const eventList = (events as EventRow[] | null) || []
  const tableMissing = error?.code === '42P01'

  return (
    <div className="min-h-screen bg-[#F7FAFD] px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Eventos & Tickets</h1>
            <p className="mt-1 text-sm text-[#64748B]">Gerencie workshops, imersões e check-in</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F4F8FC]"
            >
              Voltar
            </Link>
            <Link
              href="/admin/eventos/checkin"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F4F8FC]"
            >
              <Ticket className="h-4 w-4" />
              Check-in
            </Link>
          </div>
        </div>

        {tableMissing ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm font-bold text-amber-800">Tabela &lsquo;events&rsquo; não encontrada.</p>
            <p className="mt-1 text-sm text-amber-700">Execute <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">docs/database/16_events_tickets.sql</code> no Supabase.</p>
          </div>
        ) : eventList.length === 0 ? (
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-12 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-[#94A3B8]" />
            <p className="text-lg font-bold text-[#0F172A]">Nenhum evento cadastrado</p>
            <p className="mt-1 text-sm text-[#64748B]">Crie seu primeiro workshop ou imersão presencial.</p>
            <CreateEventForm />
          </div>
        ) : (
          <>
          <div className="mb-6">
            <CreateEventForm />
          </div>

          <div className="grid gap-4">
            {eventList.map((event) => (
              <div key={event.id} className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-extrabold text-[#0F172A]">{event.title}</h3>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${statusColors[event.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[event.status] || event.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#64748B]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(event.start_date)}
                      </span>
                      {event.city && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.city}{event.location ? ` — ${event.location}` : ''}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {event.current_enrollment}/{event.max_capacity} vagas
                      </span>
                      {event.price && (
                        <span className="flex items-center gap-1.5">
                          <Ticket className="h-3.5 w-3.5" />
                          {formatCurrency(event.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#0F172A]">
                      {event.current_enrollment}
                    </div>
                    <div className="text-xs text-[#64748B]">inscritos</div>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-[#E5ECF6]">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        event.current_enrollment >= event.max_capacity ? 'bg-red-500' : 'bg-[#1E88E5]'
                      }`}
                      style={{ width: `${Math.min((event.current_enrollment / event.max_capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  )
}
