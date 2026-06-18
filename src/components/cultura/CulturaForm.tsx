'use client'

import { useMemo, useState } from 'react'
import { Check, CheckCircle2, Loader2 } from 'lucide-react'

import {
  CULTURA_DIMENSOES,
  CULTURA_ESCALA,
  CULTURA_SETORES,
  CULTURA_PERGUNTAS_ABERTAS,
  CULTURA_TODOS_ITENS,
} from '@/lib/cultura/cultura-data'

const SCALE_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F59E0B',
  3: '#FBBF24',
  4: '#84CC16',
  5: '#22C55E',
}

type RespMap = Record<string, number | null>

function ScaleItem({
  texto,
  value,
  onChange,
}: {
  texto: string
  value: number | null | undefined
  onChange: (v: number | null) => void
}) {
  const labels = CULTURA_ESCALA
  return (
    <div className="rounded-xl border border-[#E3EBF6] bg-white px-4 py-3.5">
      <p className="text-sm font-semibold text-[#0F172A]">{texto}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              title={labels[n - 1]}
              className={`flex h-10 min-w-[2.5rem] flex-1 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                selected
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-[#E5E7EB] bg-white text-[#334155] hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
              }`}
              style={selected ? { backgroundColor: SCALE_COLORS[n] } : undefined}
              aria-pressed={selected}
              aria-label={`${n} — ${labels[n - 1]}`}
            >
              {n}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`flex h-10 items-center justify-center gap-1 rounded-lg border px-3 text-xs font-bold transition-all ${
            value === null
              ? 'border-[#64748B] bg-[#64748B] text-white'
              : 'border-[#E5E7EB] bg-white text-[#64748B] hover:bg-[#F8FAFD]'
          }`}
          aria-pressed={value === null}
        >
          {value === null && <Check className="h-3 w-3" strokeWidth={3} />}
          Não sei
        </button>
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.06em] text-[#94A3B8]">
        <span>1 — {labels[0]}</span>
        <span>5 — {labels[4]}</span>
      </div>
    </div>
  )
}

export default function CulturaForm() {
  const [setor, setSetor] = useState<string>('')
  const [setorOutro, setSetorOutro] = useState<string>('')
  const [respostas, setRespostas] = useState<RespMap>({})
  const [abertas, setAbertas] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const answered = useMemo(
    () => Object.keys(respostas).filter((k) => respostas[k] !== undefined).length,
    [respostas],
  )
  const total = CULTURA_TODOS_ITENS.length
  const pct = Math.round((answered / total) * 100)

  const setResp = (id: string, v: number | null) =>
    setRespostas((prev) => ({ ...prev, [id]: v }))

  async function handleSubmit() {
    setError(null)
    if (!setor) {
      setError('Selecione o seu setor para continuar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (answered === 0) {
      setError('Responda ao menos uma pergunta antes de enviar.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/cultura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setor, setorOutro, respostas, abertas }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao enviar.')
      }
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao enviar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">Resposta enviada!</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
          Obrigado por participar. Sua resposta é anônima e vai ajudar a fortalecer a cultura de
          segurança do seu setor. Pode fechar esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Setor */}
      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1565C0]">
          Seu setor
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Usamos só para comparar a cultura entre as áreas. Não identifica você.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CULTURA_SETORES.map((s) => {
            const selected = setor === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSetor(s)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${
                  selected
                    ? 'border-[#1565C0] bg-[#EFF6FE] text-[#0F172A] shadow-sm'
                    : 'border-[#E5E7EB] bg-white text-[#334155] hover:border-[#BCD0EA]'
                }`}
                aria-pressed={selected}
              >
                {s}
              </button>
            )
          })}
        </div>
        {setor === 'Outro' && (
          <input
            type="text"
            value={setorOutro}
            onChange={(e) => setSetorOutro(e.target.value)}
            placeholder="Qual setor?"
            maxLength={120}
            className="mt-3 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          />
        )}
      </section>

      {/* Dimensões */}
      {CULTURA_DIMENSOES.map((dim) => (
        <section key={dim.id}>
          <h2 className="text-sm font-extrabold text-[#0F172A]">{dim.nome}</h2>
          <p className="mt-0.5 text-xs text-[#64748B]">{dim.descricao}</p>
          <div className="mt-3 space-y-2.5">
            {dim.itens.map((item) => (
              <ScaleItem
                key={item.id}
                texto={item.texto}
                value={respostas[item.id]}
                onChange={(v) => setResp(item.id, v)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Aberta — relato grave (sigiloso) */}
      <section className="space-y-4">
        {CULTURA_PERGUNTAS_ABERTAS.map((q) => (
          <div key={q.id}>
            <label className="text-sm font-semibold text-[#0F172A]">{q.texto}</label>
            <textarea
              value={abertas[q.id] || ''}
              onChange={(e) => setAbertas((prev) => ({ ...prev, [q.id]: e.target.value }))}
              rows={4}
              maxLength={2000}
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
              placeholder="Opcional — pode escrever à vontade. Lido em sigilo."
            />
          </div>
        ))}
      </section>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {/* Barra de progresso + envio */}
      <div className="sticky bottom-0 -mx-7 border-t border-[#E3EBF6] bg-white/95 px-7 py-4 backdrop-blur sm:-mx-10 sm:px-10">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#64748B]">
          <span>
            {answered} de {total} respondidas
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E8EFF8]">
          <div className="h-full rounded-full bg-[#1565C0] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0D47A1] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando…
            </>
          ) : (
            'Enviar resposta anônima'
          )}
        </button>
      </div>
    </div>
  )
}
