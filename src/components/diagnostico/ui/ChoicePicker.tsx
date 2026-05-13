'use client'

import { Check } from 'lucide-react'

// Seleção única entre opções (radio button visual de cards).
// Usado nos módulos LIDERA do Form 1 e Form 2.

export type ChoicePickerOption = {
  value: string
  label: string
  description?: string
}

type Props = {
  label: string
  options: ChoicePickerOption[]
  value: string | undefined
  onChange: (value: string) => void
  helperText?: string
}

export function ChoicePicker({ label, options, value, onChange, helperText }: Props) {
  return (
    <div className="rounded-xl border border-[#E3EBF6] bg-white px-5 py-4">
      <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
      {helperText && <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>}

      <div className="mt-3 space-y-2">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                selected
                  ? 'border-[#1565C0] bg-[#EFF6FE] shadow-sm'
                  : 'border-[#E5E7EB] bg-white hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
              }`}
              aria-pressed={selected}
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-[#1565C0] bg-[#1565C0]' : 'border-[#CBD5E1]'
                }`}
                aria-hidden
              >
                {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    selected ? 'text-[#0F172A]' : 'text-[#334155]'
                  }`}
                >
                  {opt.label}
                </p>
                {opt.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">{opt.description}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
