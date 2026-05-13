'use client'

import { useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

// Shell genérico de wizard multi-step.
// Recebe array de steps (cada step com title + render function + validator).
// Cuida de: progress bar, navegação, validação por step, submit final.

export type WizardStep<T> = {
  id: string
  title: string
  subtitle?: string
  render: (data: T, update: (patch: Partial<T>) => void, errors: string | null) => ReactNode
  validate?: (data: T) => string | null
}

type Props<T> = {
  steps: WizardStep<T>[]
  initialData: T
  onSubmit: (data: T) => Promise<void>
  submitLabel?: string
}

export function WizardShell<T>({
  steps,
  initialData,
  onSubmit,
  submitLabel = 'Concluir diagnóstico',
}: Props<T>) {
  const [stepIndex, setStepIndex] = useState(0)
  const [data, setData] = useState<T>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const step = steps[stepIndex]
  const total = steps.length
  const progress = Math.round(((stepIndex + 1) / total) * 100)
  const isLast = stepIndex === total - 1
  const isFirst = stepIndex === 0

  function update(patch: Partial<T>) {
    setData((prev) => ({ ...prev, ...patch }))
    setError(null)
  }

  function next() {
    if (step.validate) {
      const err = step.validate(data)
      if (err) {
        setError(err)
        return
      }
    }
    setError(null)
    if (stepIndex < total - 1) setStepIndex((i) => i + 1)
  }

  function prev() {
    setError(null)
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  async function handleSubmit() {
    if (step.validate) {
      const err = step.validate(data)
      if (err) {
        setError(err)
        return
      }
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar diagnóstico.')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#64748B]">
            Etapa {stepIndex + 1} de {total} · {step.title}
          </p>
          <p className="text-sm font-bold text-[#1565C0]">{progress}%</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-full rounded-full bg-[#1565C0] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step header */}
      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
          {step.title}
        </h2>
        {step.subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{step.subtitle}</p>
        )}
      </div>

      {/* Step content */}
      <div className="space-y-4">{step.render(data, update, error)}</div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E3EBF6] pt-4">
        {!isFirst ? (
          <button
            type="button"
            onClick={prev}
            disabled={submitting}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        {!isLast ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando diagnóstico...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {submitLabel}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
