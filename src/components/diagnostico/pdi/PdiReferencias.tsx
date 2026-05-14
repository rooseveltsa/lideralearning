// Componente que renderiza as referências bibliográficas do PDI.
// Mostra livro + autor + ano + porque ler (justificativa contextual).

import { BookOpen } from 'lucide-react'
import { getLiteratura } from '@/lib/diagnostico/pdi-knowledge'
import type { PdiReferencia } from '@/lib/diagnostico/pdi-types'

const PILAR_LABELS: Record<string, string> = {
  comportamental: 'Comportamental',
  lideranca_desenvolvimento: 'Liderança',
  feedback_conflitos: 'Feedback e Conflitos',
  performance_operacional: 'Performance Operacional',
  mudanca_habitos: 'Mudança de Hábitos',
  inteligencia_emocional: 'Inteligência Emocional',
  seguranca_psicologica: 'Segurança Psicológica',
  ia_supervisao_moderna: 'IA e Supervisão Moderna',
}

const PILAR_COLORS: Record<string, string> = {
  comportamental: '#EF4444',
  lideranca_desenvolvimento: '#1565C0',
  feedback_conflitos: '#F59E0B',
  performance_operacional: '#15803D',
  mudanca_habitos: '#7B1FA2',
  inteligencia_emocional: '#0891B2',
  seguranca_psicologica: '#BE185D',
  ia_supervisao_moderna: '#0F172A',
}

export function PdiReferencias({ referencias }: { referencias: PdiReferencia[] }) {
  if (!referencias || referencias.length === 0) return null

  // Filtra apenas referências cujos livros existem no KB
  const validRefs = referencias
    .map((ref) => ({ ref, lit: getLiteratura(ref.literaturaId) }))
    .filter((r) => r.lit !== undefined)

  if (validRefs.length === 0) return null

  return (
    <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10 print:break-before-page">
      <div className="mb-2 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[#1565C0]" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
          Fundamentos teóricos
        </p>
      </div>
      <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
        Leituras Recomendadas
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
        Bibliografia que fundamenta as recomendações deste PDI. Não é lista genérica — cada livro
        foi selecionado pelo perfil específico e gargalo identificado.
      </p>

      <div className="mt-6 space-y-3">
        {validRefs.map(({ ref, lit }) => {
          if (!lit) return null
          const pilarLabel = PILAR_LABELS[lit.pilar] || lit.pilar
          const pilarColor = PILAR_COLORS[lit.pilar] || '#1565C0'
          return (
            <div
              key={ref.literaturaId}
              className="rounded-xl border border-[#E3EBF6] bg-[#FBFCFE] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-heading text-base font-extrabold tracking-tight text-[#0F172A]">
                    {lit.titulo}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    {lit.autor}
                    {lit.ano && ` · ${lit.ano}`}
                  </p>
                </div>
                <span
                  className="rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${pilarColor}15`,
                    color: pilarColor,
                  }}
                >
                  {pilarLabel}
                </span>
              </div>

              <div className="mt-3 rounded-lg bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#64748B]">
                  Por que ler agora
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#334155]">{ref.porQueLer}</p>
              </div>

              <div className="mt-3 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFD] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#94A3B8]">
                  Insight central do livro
                </p>
                <p className="mt-1 text-xs italic leading-relaxed text-[#475569]">
                  &ldquo;{lit.insightCentral}&rdquo;
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
