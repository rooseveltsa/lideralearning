'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2, Trophy } from 'lucide-react'

import {
  FORMACAO_MODULOS,
  FORMACAO_ESCALA_COMPETENCIA,
  FORMACAO_ESCALA_PRIORIDADE,
  FORMACAO_FILTRO_LABEL,
  FORMACAO_LGPD,
  FORMACAO_CONSENTIMENTO_LABEL,
  FORMACAO_TEMPO_FUNCAO,
  FORMACAO_QTD_LIDERADOS,
  FORMACAO_PERGUNTAS_ABERTAS,
  FORMACAO_TODOS_ITENS,
} from '@/lib/formacao/formacao-data'

type UserProfile = { id: string; fullName: string; email: string }

type RespItem = { competencia: number | null; prioridade: number | null }
type RespMap = Record<string, RespItem>
type TopModulo = { id: string; titulo: string; inNorm: number | null }

function ScaleRow({
  labels,
  value,
  onChange,
}: {
  labels: string[]
  value: number | null
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={labels[n - 1]}
            className={`flex h-9 min-w-[2rem] flex-1 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
              selected
                ? 'border-[#1565C0] bg-[#1565C0] text-white shadow-sm'
                : 'border-[#E5E7EB] bg-white text-[#334155] hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
            }`}
            aria-pressed={selected}
            aria-label={`${n} — ${labels[n - 1]}`}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

function ItemRow({
  texto,
  reverso,
  disabled,
  value,
  onChange,
}: {
  texto: string
  reverso: boolean
  disabled: boolean
  value: RespItem | undefined
  onChange: (patch: Partial<RespItem>) => void
}) {
  return (
    <div
      className={`rounded-xl border border-[#E3EBF6] px-4 py-3.5 transition-opacity ${
        disabled ? 'bg-[#F8FAFD] opacity-50' : 'bg-white'
      }`}
    >
      <p className="text-sm font-semibold text-[#0F172A]">
        {texto}
        {reverso && (
          <span className="ml-2 rounded bg-[#FFF1E6] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
            atenção
          </span>
        )}
      </p>
      <fieldset disabled={disabled} className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1565C0]">
            Quanto eu faço hoje
          </p>
          <ScaleRow
            labels={FORMACAO_ESCALA_COMPETENCIA}
            value={value?.competencia ?? null}
            onChange={(v) => onChange({ competencia: v })}
          />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#64748B]">
            Quanto preciso melhorar
          </p>
          <ScaleRow
            labels={FORMACAO_ESCALA_PRIORIDADE}
            value={value?.prioridade ?? null}
            onChange={(v) => onChange({ prioridade: v })}
          />
        </div>
      </fieldset>
    </div>
  )
}

export default function FormacaoForm({
  user,
  orgCode,
}: {
  user: UserProfile | null
  orgCode?: string | null
}) {
  const [nome, setNome] = useState(user?.fullName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [empresa, setEmpresa] = useState('')
  const [setor, setSetor] = useState('')
  const [tempoFuncao, setTempoFuncao] = useState('')
  const [qtdLiderados, setQtdLiderados] = useState('')
  const [consentimento, setConsentimento] = useState(false)
  const [respostas, setRespostas] = useState<RespMap>({})
  const [filtros, setFiltros] = useState<Record<string, boolean>>({})
  const [abertas, setAbertas] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [top, setTop] = useState<TopModulo[]>([])
  const [error, setError] = useState<string | null>(null)

  const total = FORMACAO_TODOS_ITENS.length
  const answered = useMemo(
    () => FORMACAO_TODOS_ITENS.filter((it) => respostas[it.id]?.competencia != null).length,
    [respostas],
  )
  const pct = Math.round((answered / total) * 100)

  const setResp = (id: string, patch: Partial<RespItem>) =>
    setRespostas((prev) => {
      const current = prev[id] ?? { competencia: null, prioridade: null }
      return { ...prev, [id]: { ...current, ...patch } }
    })

  async function handleSubmit() {
    setError(null)
    if (!consentimento) {
      setError('Marque o consentimento (LGPD) para continuar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!nome.trim() || !email.trim()) {
      setError('Preencha seu nome e o e-mail (ou matrícula).')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (answered === 0) {
      setError('Responda ao menos um módulo antes de enviar.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/formacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          org: orgCode,
          nome,
          email,
          empresa,
          setor,
          tempoFuncao,
          qtdLiderados,
          respostas,
          filtros,
          abertas,
          consentimento,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Falha ao enviar.')
      setTop(Array.isArray(data?.topModulos) ? data.topModulos : [])
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
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">Diagnóstico enviado!</h2>
        {top.length > 0 ? (
          <>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
              Pelo seu diagnóstico, os temas que mais vão te ajudar agora são. Sua trilha LIDERA
              começa por aqui:
            </p>
            <ul className="mx-auto mt-4 max-w-md space-y-2 text-left">
              {top.map((m, i) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white px-4 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FE] text-sm font-extrabold text-[#1565C0]">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-[#0F172A]">{m.titulo}</span>
                  {i === 0 && <Trophy className="ml-auto h-4 w-4 text-[#F59E0B]" />}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Recebemos suas respostas. A Lidera vai montar a sua trilha de formação a partir delas.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Consentimento LGPD */}
      <section className="rounded-2xl border border-[#BFE3FF] bg-[#F0F8FF] p-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0F4C81]">
          Consentimento e proteção de dados (LGPD)
        </h2>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#334155]">
          {FORMACAO_LGPD.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
        <label className="mt-3 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={consentimento}
            onChange={(e) => setConsentimento(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#94A3B8] text-[#1565C0]"
          />
          <span className="text-sm font-semibold text-[#0F172A]">{FORMACAO_CONSENTIMENTO_LABEL}</span>
        </label>
      </section>

      {/* Contexto do supervisor */}
      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1565C0]">
          Seus dados
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            maxLength={160}
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail ou matrícula"
            maxLength={160}
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          />
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Empresa / unidade"
            maxLength={160}
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          />
          <input
            type="text"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            placeholder="Setor (ex.: produção, manutenção, logística)"
            maxLength={120}
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          />
          <select
            value={tempoFuncao}
            onChange={(e) => setTempoFuncao(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          >
            <option value="">Há quanto tempo é líder?</option>
            {FORMACAO_TEMPO_FUNCAO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={qtdLiderados}
            onChange={(e) => setQtdLiderados(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
          >
            <option value="">Quantas pessoas você lidera?</option>
            {FORMACAO_QTD_LIDERADOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Régua de referência */}
      <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-xs text-[#64748B]">
        Para cada frase, marque <strong>quanto você faz hoje</strong> (1 = nunca · 5 = sempre) e{' '}
        <strong>quanto precisa melhorar</strong> (1 = não precisa agora · 5 = começar já).
      </div>

      {/* Módulos: competência × prioridade + filtro "não sei fazer" */}
      {FORMACAO_MODULOS.map((mod) => {
        const naoSabe = filtros[mod.id] === true
        return (
          <section key={mod.id}>
            <h2 className="text-sm font-extrabold text-[#0F172A]">{mod.rotulo}</h2>
            <p className="mt-0.5 text-xs text-[#64748B]">{mod.descricao}</p>

            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={naoSabe}
                onChange={(e) => setFiltros((prev) => ({ ...prev, [mod.id]: e.target.checked }))}
                className="h-4 w-4 rounded border-[#94A3B8] text-[#1565C0]"
              />
              <span className="font-semibold text-[#334155]">{FORMACAO_FILTRO_LABEL}</span>
            </label>

            <div className="mt-3 space-y-2.5">
              {mod.itens.map((item) => (
                <ItemRow
                  key={item.id}
                  texto={item.texto}
                  reverso={item.reverso}
                  disabled={naoSabe}
                  value={respostas[item.id]}
                  onChange={(patch) => setResp(item.id, patch)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Abertas */}
      <section className="space-y-4">
        {FORMACAO_PERGUNTAS_ABERTAS.map((q) => (
          <div key={q.id}>
            <label className="text-sm font-semibold text-[#0F172A]">{q.texto}</label>
            <textarea
              value={abertas[q.id] || ''}
              onChange={(e) => setAbertas((prev) => ({ ...prev, [q.id]: e.target.value }))}
              rows={3}
              maxLength={2000}
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#1565C0]"
              placeholder="Escreva com suas palavras."
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
            'Ver minha trilha recomendada'
          )}
        </button>
      </div>
    </div>
  )
}
