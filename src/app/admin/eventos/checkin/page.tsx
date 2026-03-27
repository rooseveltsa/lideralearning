'use client'

import { useState } from 'react'
import { CheckCircle2, Scan, XCircle } from 'lucide-react'
import Link from 'next/link'

type CheckinResult = {
  success: boolean
  attendeeName?: string
  eventTitle?: string
  checkedInAt?: string
  error?: string
}

export default function CheckinPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckinResult | null>(null)
  const [history, setHistory] = useState<CheckinResult[]>([])

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/events/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode: code.trim() }),
      })

      const data = await res.json()

      const checkinResult: CheckinResult = res.ok
        ? { success: true, attendeeName: data.attendeeName, eventTitle: data.eventTitle, checkedInAt: data.checkedInAt }
        : { success: false, error: data.error, attendeeName: data.attendeeName }

      setResult(checkinResult)
      setHistory((prev) => [checkinResult, ...prev].slice(0, 20))
      if (res.ok) setCode('')
    } catch {
      setResult({ success: false, error: 'Erro de conexão.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050A14] px-6 py-8 text-[#E5ECF8]">
      <div className="mx-auto max-w-[600px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Check-in</h1>
            <p className="mt-1 text-sm text-[#A9BDD8]">Escaneie ou digite o código do ticket</p>
          </div>
          <Link
            href="/admin/eventos"
            className="rounded-xl border border-[#335077] px-4 py-2 text-sm font-semibold text-[#D4E4F6] hover:text-white"
          >
            Voltar
          </Link>
        </div>

        <form onSubmit={handleCheckin} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Scan className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="LDR-XXXXXXXX"
                autoFocus
                className="w-full rounded-xl border border-[#335077] bg-[#0A1324] py-4 pl-12 pr-4 text-lg font-bold tracking-wider text-white uppercase outline-none placeholder:text-[#4A6B8A] focus:border-[#1E88E5]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="rounded-xl bg-[#1E88E5] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#1565C0] disabled:opacity-50"
            >
              {loading ? '...' : 'Check-in'}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`mb-6 rounded-2xl border p-6 text-center ${
              result.success
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            {result.success ? (
              <>
                <CheckCircle2 className="mx-auto mb-3 h-16 w-16 text-green-400" />
                <p className="text-2xl font-extrabold text-white">{result.attendeeName}</p>
                <p className="mt-1 text-sm text-green-300">Check-in realizado — {result.eventTitle}</p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto mb-3 h-16 w-16 text-red-400" />
                <p className="text-lg font-bold text-red-300">{result.error}</p>
                {result.attendeeName && (
                  <p className="mt-1 text-sm text-red-200">{result.attendeeName}</p>
                )}
              </>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#64748B]">
              Histórico ({history.filter(h => h.success).length} check-ins)
            </p>
            <div className="space-y-2">
              {history.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    item.success ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-sm font-semibold text-white">
                      {item.attendeeName || item.error}
                    </span>
                  </div>
                  <span className="text-xs text-[#64748B]">{item.eventTitle || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
