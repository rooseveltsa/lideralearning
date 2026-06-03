import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileBarChart } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import { generatePDI, getPDIStatus } from '@/lib/utils/pdi-generator'
import PDIReportView from '@/components/treinamento/PDIReportView'
import PrintPDIButton from './PrintButton'
import { PdiOutreachActions } from '@/components/admin/relatorios/PdiOutreachActions'

type Props = {
  params: Promise<{ alunoId: string }>
}

export default async function AdminPDIAlunoPage({ params }: Props) {
  const { alunoId } = await params
  const admin = createAdminClient()

  // Fetch profile
  const { data: profile } = await admin
    .from('profiles')
    .select('id, full_name, role, whatsapp')
    .eq('id', alunoId)
    .single()

  if (!profile) notFound()

  // Fetch relationship for company
  const { data: relationship } = await admin
    .from('gestor_aluno_relationships')
    .select('company_name')
    .eq('aluno_user_id', alunoId)
    .limit(1)
    .maybeSingle()

  // Fetch latest self-assessment
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('*')
    .eq('user_id', alunoId)
    .order('created_at', { ascending: false })
    .limit(1)

  // Fetch latest exec assessment
  const { data: execAssessments } = await admin
    .from('leadership_executive_assessments')
    .select('*')
    .eq('user_id', alunoId)
    .order('created_at', { ascending: false })
    .limit(1)

  const hasSelf = (selfAssessments?.length ?? 0) > 0
  const hasExec = (execAssessments?.length ?? 0) > 0
  const status = getPDIStatus(alunoId, hasSelf, hasExec)

  const alunoName = profile.full_name ?? 'Sem nome'
  const company = relationship?.company_name ?? null

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/admin/relatorios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Relatorios
        </Link>

        {status === 'ready' && (
          <div className="flex items-center gap-2">
            <PdiOutreachActions
              alunoId={alunoId}
              nome={alunoName}
              whatsapp={profile.whatsapp ?? null}
              variant="header"
            />
            <PrintPDIButton />
          </div>
        )}
      </div>

      {status === 'ready' ? (
        <PDIReportView
          report={generatePDI(
            alunoId,
            alunoName,
            company,
            selfAssessments![0] as Record<string, unknown>,
            execAssessments![0] as Record<string, unknown>,
          )}
          hidePrint
        />
      ) : (
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <FileBarChart className="h-7 w-7 text-amber-500" />
          </div>
          <h2 className="text-lg font-extrabold text-[#0F172A]">
            PDI indisponivel para {alunoName}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            {status === 'waiting_both' &&
              'Nenhuma avaliacao foi preenchida ainda. Aguardando autoavaliacao e avaliacao executiva.'}
            {status === 'waiting_self' &&
              'A avaliacao executiva ja foi preenchida. Aguardando autoavaliacao do supervisor.'}
            {status === 'waiting_exec' &&
              'A autoavaliacao ja foi preenchida. Aguardando avaliacao executiva do gestor.'}
          </p>
          <Link
            href={`/admin/alunos/${alunoId}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            Ver ficha do aluno
          </Link>
        </div>
      )}
    </div>
  )
}

