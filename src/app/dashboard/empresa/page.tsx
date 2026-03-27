import { redirect } from 'next/navigation'
import { Award, BookOpen, Clock, Target, TrendingUp, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export default async function DashboardEmpresaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const admin = createAdminClient()

  // Get user profile to find company
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, role, company_name')
    .eq('id', user.id)
    .maybeSingle()

  const companyName = (profile as { company_name?: string } | null)?.company_name

  // Get company team members (users with same company_name)
  const { data: teamMembers } = companyName
    ? await admin
        .from('profiles')
        .select('id, full_name, role')
        .eq('company_name', companyName)
    : { data: [] }

  const teamIds = (teamMembers || []).map((m: { id: string }) => m.id)
  const teamSize = teamIds.length

  // Get enrollments for team
  const { data: enrollments } = teamIds.length > 0
    ? await admin
        .from('enrollments')
        .select('id, user_id, course_id, status, created_at')
        .in('user_id', teamIds)
    : { data: [] }

  const activeEnrollments = (enrollments || []).filter((e: { status: string }) => e.status === 'active').length

  // Get progress for team
  const { data: progressRecords } = teamIds.length > 0
    ? await admin
        .from('progress')
        .select('id, user_id, course_id, completed')
        .in('user_id', teamIds)
    : { data: [] }

  const completedLessons = (progressRecords || []).filter((p: { completed: boolean }) => p.completed).length
  const totalLessons = (progressRecords || []).length

  // Get assessments for team
  const { data: assessments } = teamIds.length > 0
    ? await admin
        .from('leadership_self_assessments')
        .select('id, user_id, overall_score')
        .in('user_id', teamIds)
    : { data: [] }

  const avgScore = (assessments || []).length > 0
    ? (assessments as { overall_score: number }[]).reduce((sum, a) => sum + (a.overall_score || 0), 0) / assessments!.length
    : 0

  // Get certificates
  const { data: certificates } = teamIds.length > 0
    ? await admin
        .from('certificates')
        .select('id, user_id')
        .in('user_id', teamIds)
    : { data: [] }

  const certCount = (certificates || []).length
  const completionRate = teamSize > 0 ? (certCount / teamSize) * 100 : 0
  const engagementRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="min-h-screen bg-[#F7FAFD] px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B4A8F]">
            Dashboard Corporativo
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {companyName || 'Sua Empresa'}
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Acompanhe o desenvolvimento da sua equipe de liderança
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Equipe</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{teamSize}</p>
                <p className="text-xs text-[#64748B]">{activeEnrollments} matrículas ativas</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Engajamento</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{formatPercent(engagementRate)}</p>
                <p className="text-xs text-[#64748B]">{completedLessons} aulas concluídas</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Conclusão</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{formatPercent(completionRate)}</p>
                <p className="text-xs text-[#64748B]">{certCount} certificados emitidos</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Score Médio</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{avgScore.toFixed(1)}</p>
                <p className="text-xs text-[#64748B]">{(assessments || []).length} avaliações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
          <h2 className="mb-4 text-lg font-extrabold text-[#0F172A]">Membros da Equipe</h2>

          {teamSize === 0 ? (
            <p className="text-sm text-[#94A3B8]">
              Nenhum membro encontrado para esta empresa. Verifique se o campo &lsquo;company_name&rsquo; está preenchido nos perfis.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5ECF6] text-xs font-bold uppercase tracking-wide text-[#64748B]">
                    <th className="pb-3 pr-4">Nome</th>
                    <th className="pb-3 pr-4">Cargo</th>
                    <th className="pb-3 pr-4">Matrículas</th>
                    <th className="pb-3 pr-4">Progresso</th>
                    <th className="pb-3">Certificados</th>
                  </tr>
                </thead>
                <tbody>
                  {(teamMembers as { id: string; full_name: string | null; role: string }[]).map((member) => {
                    const memberEnrollments = (enrollments || []).filter((e: { user_id: string }) => e.user_id === member.id).length
                    const memberProgress = (progressRecords || []).filter((p: { user_id: string }) => p.user_id === member.id)
                    const memberCompleted = memberProgress.filter((p: { completed: boolean }) => p.completed).length
                    const memberTotal = memberProgress.length
                    const memberCerts = (certificates || []).filter((c: { user_id: string }) => c.user_id === member.id).length

                    return (
                      <tr key={member.id} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="py-3 pr-4 font-semibold text-[#0F172A]">{member.full_name || 'Sem nome'}</td>
                        <td className="py-3 pr-4 text-[#64748B]">{member.role}</td>
                        <td className="py-3 pr-4">{memberEnrollments}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-[#E5ECF6]">
                              <div
                                className="h-2 rounded-full bg-[#1E88E5]"
                                style={{ width: `${memberTotal > 0 ? (memberCompleted / memberTotal) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#64748B]">
                              {memberTotal > 0 ? `${Math.round((memberCompleted / memberTotal) * 100)}%` : '—'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          {memberCerts > 0 ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <Award className="h-3.5 w-3.5" />
                              {memberCerts}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[#94A3B8]">
                              <Clock className="h-3.5 w-3.5" />
                              Em andamento
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ROI Section */}
        <div className="mt-6 rounded-2xl border border-[#D8E2EF] bg-white p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#0B4A8F]" />
            <h2 className="text-lg font-extrabold text-[#0F172A]">Indicadores de ROI</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Taxa de Adoção</p>
              <p className="mt-1 text-xl font-extrabold text-[#0F172A]">
                {teamSize > 0 ? formatPercent((activeEnrollments / teamSize) * 100) : '—'}
              </p>
              <p className="text-xs text-[#64748B]">Colaboradores matriculados / Total equipe</p>
            </div>
            <div className="rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Horas Investidas</p>
              <p className="mt-1 text-xl font-extrabold text-[#0F172A]">
                {Math.round(completedLessons * 0.25)}h
              </p>
              <p className="text-xs text-[#64748B]">Estimativa baseada em aulas concluídas</p>
            </div>
            <div className="rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Evolução Liderança</p>
              <p className="mt-1 text-xl font-extrabold text-[#0F172A]">
                {avgScore > 0 ? `${avgScore.toFixed(1)}/5.0` : '—'}
              </p>
              <p className="text-xs text-[#64748B]">Score médio da autoavaliação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
