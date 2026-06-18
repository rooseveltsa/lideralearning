'use client'

import { useMemo, useState } from 'react'
import { Check, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'

import {
  PSICOSSOCIAL_DIMENSOES,
  PSICOSSOCIAL_ESCALA,
  PSICOSSOCIAL_SETORES,
  PSICOSSOCIAL_TURNOS,
  PSICOSSOCIAL_CRITICOS,
  PSICOSSOCIAL_TODOS_ITENS,
  PSICOSSOCIAL_PARTE2_NOME,
  PSICOSSOCIAL_PARTE2_DESCRICAO,
  PSICOSSOCIAL_RELATO_PLACEHOLDER,
} from '@/lib/psicossocial/psicossocial-data'

// Cores da escala de FREQUÊNCIA pensadas como RISCO neutro: o valor não é
// "bom" ou "ruim" por si só (depende de o item ser positivo/risco), então
// usamos uma escala de intensidade azul, sem semáforo verde→vermelho.
const SCALE_COLORS: Record<number, string> = {
  1: '#CBD5E1',
  2: '#94A3B8',
  3: '#64748B',
  4: '#3B6FB0',
  5: '#1565C0',
}

type RespMap = Record<string, number | null>
type CriticoState = { value: number | null; relato: string }
type CriticoMap = Record<string, CriticoState>

function ScaleItem({
  texto,
  value,
  onChange,
}: {
  texto: string
  value: number | null | undefined
  onChange: (v: number | null) => void
}) {
  const labels = PSICOSSOCIAL_ESCALA
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
          NS/NA
        </button>
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.06em] text-[#94A3B8]">
        <span>1 — {labels[0]}</span>
        <span>5 — {labels[4]}</span>
      </div>
    </div>
  )
}

export default function PsicossocialForm() {
  const [setor, setSetor] = useState<string>('')
  const [setorOutro, setSetorOutro] = useState<string>('')
  const [turno, setTurno] = useState<string>('')
  const [respostas, setRespostas] = useState<RespMap>({})
  const [criticos, setCriticos] = useState<CriticoMap>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const answeredP1 = useMemo(
    () => Object.keys(respostas).filter((k) => respostas[k] !== undefined).length,
    [respostas],
  )
  const answeredP2 = useMemo(
    () => Object.values(criticos).filter((c) => c.value !== undefined).length,
    [criticos],
  )
  const total = PSICOSSOCIAL_TODOS_ITENS.length + PSICOSSOCIAL_CRITICOS.length
  const answered = answeredP1 + answeredP2
  const pct = Math.round((answered / total) * 100)

  const setResp = (id: string, v: number | null) =>
    setRespostas((prev) => ({ ...prev, [id]: v }))

  const setCriticoValue = (id: string, v: number | null) =>
    setCriticos((prev) => ({ ...prev, [id]: { value: v, relato: prev[id]?.relato ?? '' } }))

  const setCriticoRelato = (id: string, relato: string) =>
    setCriticos((prev) => ({ ...prev, [id]: { value: prev[id]?.value ?? null, relato } }))

  async function handleSubmit() {
    setError(null)
    if (!setor) {
      setError('Selecione o seu setor para continuar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!turno) {
      setError('Selecione o seu turno para continuar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (answered === 0) {
      setError('Responda ao menos uma pergunta antes de enviar.')
      return
    }
    setSubmitting(true)
    try {
      // Críticos: envia value + relato (só quem respondeu o valor).
      const criticosPayload: Record<string, { value: number | null; relato?: string }> = {}
      for (const [id, c] of Object.entries(criticos)) {
        if (c.value === undefined) continue
        criticosPayload[id] = c.relato.trim()
          ? { value: c.value, relato: c.relato.trim() }
          : { value: c.value }
      }
      const res = await fetch('/api/psicossocial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setor,
          setorOutro,
          turno,
          respostas,
          criticos: criticosPayload,
        }),
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
          Obrigado por participar. Sua resposta é anônima e sigilosa, e vai ajudar a melhorar as
          condições de trabalho do seu setor. Pode fechar esta página.
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
          Usamos só para agrupar as respostas. Não identifica você.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PSICOSSOCIAL_SETORES.map((s) => {
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

      {/* Turno */}
      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1565C0]">
          Seu turno
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Também serve só para o recorte de risco — nunca para identificar a pessoa.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PSICOSSOCIAL_TURNOS.map((t) => {
            const selected = turno === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTurno(t)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${
                  selected
                    ? 'border-[#1565C0] bg-[#EFF6FE] text-[#0F172A] shadow-sm'
                    : 'border-[#E5E7EB] bg-white text-[#334155] hover:border-[#BCD0EA]'
                }`}
                aria-pressed={selected}
              >
                {t}
              </button>
            )
          })}
        </div>
      </section>

      {/* Parte 1 — dimensões */}
      {PSICOSSOCIAL_DIMENSOES.map((dim) => (
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

      {/* Parte 2 — itens críticos (janela 12 meses) */}
      <section className="rounded-2xl border border-[#F0C7C7] bg-[#FEF6F6] p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#B42318]">
          <AlertTriangle className="h-4 w-4" />
          Parte 2 — {PSICOSSOCIAL_PARTE2_NOME}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[#7A271A]">
          {PSICOSSOCIAL_PARTE2_DESCRICAO}
        </p>
        <div className="mt-4 space-y-2.5">
          {PSICOSSOCIAL_CRITICOS.map((item) => (
            <div key={item.id}>
              <ScaleItem
                texto={item.texto}
                value={criticos[item.id]?.value}
                onChange={(v) => setCriticoValue(item.id, v)}
              />
              {item.relato && (
                <textarea
                  value={criticos[item.id]?.relato || ''}
                  onChange={(e) => setCriticoRelato(item.id, e.target.value)}
                  rows={2}
                  maxLength={2000}
                  placeholder={PSICOSSOCIAL_RELATO_PLACEHOLDER}
                  className="mt-1.5 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
                />
              )}
            </div>
          ))}
        </div>
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
          <div
            className="h-full rounded-full bg-[#1565C0] transition-all"
            style={{ width: `${pct}%` }}
          />
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
