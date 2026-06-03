import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  AlertTriangle,
  BookOpen,
  ClipboardCheck,
  Clock,
  FileText,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { generatePDI, generatePartialPDI, getPDIStatus } from '@/lib/utils/pdi-generator'
import { withStoredAiPlan } from '@/lib/diagnostico/pdi-ai-enricher'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import PDIReportView from '@/components/treinamento/PDIReportView'

export const metadata: Metadata = {
  title: 'Plano de Desenvolvimento Individual (PDI) | LIDERA',
  description:
    'Seu PDI gerado automaticamente a partir da comparacao entre Autoavaliacao e Avaliacao Executiva.',
}

export default async function PDIPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/register?redirect=/treinamento/pdi')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // Fetch relationship for company name
  const { data: relationship } = await supabase
    .from('gestor_aluno_relationships')
    .select('company_name')
    .eq('aluno_user_id', user.id)
    .limit(1)
    .maybeSingle()

  // Fetch latest self-assessment
  const { data: selfAssessments } = await supabase
    .from('leadership_self_assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  // Fetch latest executive assessment (check both user_id and supervisor_user_id)
  const { data: execAssessments } = await supabase
    .from('leadership_executive_assessments')
    .select('*')
    .or(`user_id.eq.${user.id},supervisor_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(1)

  const hasSelf = (selfAssessments?.length ?? 0) > 0
  const hasExec = (execAssessments?.length ?? 0) > 0
  const status = getPDIStatus(user.id, hasSelf, hasExec)

  const alunoName = profile?.full_name || user.user_metadata?.full_name || ''
  const company = relationship?.company_name ?? null

  // Plano de ação personalizado por IA (opcional). Falha → plano determinístico.
  let aiPlan: unknown = null
  if (status === 'ready') {
    try {
      const { data: pdiRow } = await supabase
        .from('leadership_pdi')
        .select('action_plan_ai')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      aiPlan = (pdiRow as { action_plan_ai?: unknown } | null)?.action_plan_ai ?? null
    } catch {
      aiPlan = null
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#F8FAFD] to-white">
        {/* Hero */}
        <section className="border-b border-[#E3EBF6] bg-white px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1565C0]/10">
              <BookOpen className="h-7 w-7 text-[#1565C0]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1565C0]">
              Relatorio PDI
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Plano de Desenvolvimento Individual
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#64748B]">
              Seu PDI e gerado automaticamente a partir da comparacao entre sua
              Autoavaliacao e a Avaliacao Executiva preenchida pelo seu gestor.
            </p>

            {alunoName && (
              <p className="mt-4 text-sm text-[#64748B]">
                Relatorio de{' '}
                <strong className="text-[#0F172A]">{alunoName}</strong>
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            {status === 'ready' ? (
              <PDIReportView
                report={withStoredAiPlan(
                  generatePDI(
                    user.id,
                    alunoName,
                    company,
                    selfAssessments![0] as Record<string, unknown>,
                    execAssessments![0] as Record<string, unknown>,
                  ),
                  aiPlan,
                )}
              />
            ) : hasSelf ? (
              /* Partial PDI: only self-assessment available */
              <PDIReportView
                report={generatePartialPDI(
                  user.id,
                  alunoName,
                  company,
                  selfAssessments![0] as Record<string, unknown>,
                )}
              />
            ) : (
              <WaitingState status={status} />
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

// ---------------------------------------------------------------------------
// Waiting state component
// ---------------------------------------------------------------------------

function WaitingState({ status }: { status: 'waiting_self' | 'waiting_exec' | 'waiting_both' }) {
  const configs = {
    waiting_both: {
      icon: AlertTriangle,
      title: 'Nenhuma avaliacao preenchida',
      description:
        'Para gerar seu PDI, e necessario que voce preencha a Autoavaliacao e que seu gestor preencha a Avaliacao Executiva.',
      steps: [
        { icon: ClipboardCheck, label: 'Autoavaliacao', href: '/treinamento/autoavaliacao', done: false },
        { icon: FileText, label: 'Avaliacao Executiva', href: null, done: false },
      ],
    },
    waiting_self: {
      icon: ClipboardCheck,
      title: 'Autoavaliacao pendente',
      description:
        'Seu gestor ja preencheu a Avaliacao Executiva. Falta voce completar a Autoavaliacao para gerar o PDI.',
      steps: [
        { icon: ClipboardCheck, label: 'Autoavaliacao', href: '/treinamento/autoavaliacao', done: false },
        { icon: FileText, label: 'Avaliacao Executiva', href: null, done: true },
      ],
    },
    waiting_exec: {
      icon: Clock,
      title: 'Aguardando Avaliacao Executiva',
      description:
        'Voce ja completou a Autoavaliacao. Agora aguarde seu gestor preencher a Avaliacao Executiva para gerar o PDI.',
      steps: [
        { icon: ClipboardCheck, label: 'Autoavaliacao', href: null, done: true },
        { icon: FileText, label: 'Avaliacao Executiva', href: null, done: false },
      ],
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
        <Icon className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="text-xl font-extrabold text-[#0F172A]">{config.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
        {config.description}
      </p>

      <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
        {config.steps.map((step) => {
          const StepIcon = step.icon
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
                step.done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <StepIcon className="h-4.5 w-4.5" />
              <span className="flex-1 text-left">{step.label}</span>
              {step.done ? (
                <span className="text-xs">Concluida</span>
              ) : step.href ? (
                <a
                  href={step.href}
                  className="rounded-lg bg-[#1565C0] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[#0D47A1]"
                >
                  Preencher
                </a>
              ) : (
                <span className="text-xs">Pendente</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
