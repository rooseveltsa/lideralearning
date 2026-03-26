import Link from 'next/link'
import {
  Briefcase,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Plus,
  Search,
  Users,
} from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'

export default async function AdminGestoresPage() {
  const admin = createAdminClient()

  const { data: gestores } = await admin
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('role', 'hr_manager')
    .order('created_at', { ascending: false })

  // Fetch relationships with aluno details
  const { data: relationships } = await admin
    .from('gestor_aluno_relationships')
    .select('gestor_user_id, aluno_user_id, company_name, relationship_type')

  // Fetch assessment counts per aluno
  const { data: selfAssessments } = await admin
    .from('leadership_self_assessments')
    .select('user_id')

  const { data: trainings } = await admin
    .from('presential_training_participants')
    .select('user_id, status')

  const selfSet = new Set(selfAssessments?.map((s) => s.user_id) ?? [])
  const trainedSet = new Set(
    trainings?.filter((t) => t.status === 'attended').map((t) => t.user_id) ?? []
  )

  // Fetch aluno profiles
  const alunoIds = [...new Set(relationships?.map((r) => r.aluno_user_id) ?? [])]
  const { data: alunoProfiles } = alunoIds.length > 0
    ? await admin.from('profiles').select('id, full_name').in('id', alunoIds)
    : { data: [] }

  const alunoMap = new Map(alunoProfiles?.map((p) => [p.id, p.full_name]) ?? [])

  type GestorInfo = {
    count: number
    company: string
    alunos: Array<{ id: string; name: string; hasSelf: boolean; trained: boolean }>
  }
  const gestorStats = new Map<string, GestorInfo>()

  if (relationships) {
    for (const rel of relationships) {
      const existing = gestorStats.get(rel.gestor_user_id) ?? {
        count: 0,
        company: '',
        alunos: [],
      }
      existing.count++
      existing.company = rel.company_name ?? existing.company
      existing.alunos.push({
        id: rel.aluno_user_id,
        name: alunoMap.get(rel.aluno_user_id) ?? 'Sem nome',
        hasSelf: selfSet.has(rel.aluno_user_id),
        trained: trainedSet.has(rel.aluno_user_id),
      })
      gestorStats.set(rel.gestor_user_id, existing)
    }
  }

  const totalSupervisors = Array.from(gestorStats.values()).reduce((s, g) => s + g.count, 0)

  return (
    <div className="space-y-6">
      {/* Header compacto */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Gestores e RH</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            {gestores?.length ?? 0} gestores · {totalSupervisors} supervisores vinculados
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/classificacao"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] hover:bg-[#F7FAFE]"
          >
            <ClipboardCheck className="h-4 w-4" />
            Classificação
          </Link>
        </div>
      </div>

      {/* Lista compacta */}
      {!gestores || gestores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8E2EF] bg-white py-16 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <p className="mt-3 text-sm font-bold text-[#0F172A]">Nenhum gestor cadastrado</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Altere o role para &quot;hr_manager&quot; no Supabase para vincular.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#D8E2EF] bg-white shadow-sm">
          {gestores.map((gestor, i) => {
            const stats = gestorStats.get(gestor.id)
            return (
              <div
                key={gestor.id}
                className={`${i > 0 ? 'border-t border-[#E5ECF6]' : ''}`}
              >
                {/* Gestor row */}
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFCFF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7B1FA2]/10 text-sm font-extrabold text-[#7B1FA2]">
                    {gestor.full_name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-[#0F172A]">
                        {gestor.full_name}
                      </h3>
                      <span className="shrink-0 rounded-md bg-[#7B1FA2]/10 px-2 py-0.5 text-[10px] font-bold text-[#7B1FA2]">
                        {stats?.company || 'Sem empresa'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {stats?.count ?? 0} supervisores · Desde{' '}
                      {new Date(gestor.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/gestores/${gestor.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#1565C0] px-3 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F]"
                    >
                      Ver detalhes
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Supervisores inline */}
                {stats && stats.alunos.length > 0 && (
                  <div className="border-t border-dashed border-[#E5ECF6] bg-[#F8FAFD] px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {stats.alunos.slice(0, 5).map((aluno) => (
                        <Link
                          key={aluno.id}
                          href={`/admin/alunos/${aluno.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#D8E2EF] bg-white px-3 py-1.5 text-xs hover:border-[#1565C0] hover:bg-[#F0F7FF]"
                        >
                          <span className="font-medium text-[#334155]">{aluno.name}</span>
                          <span className="flex gap-1">
                            {aluno.hasSelf && (
                              <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold text-emerald-700" title="Autoavaliação preenchida">
                                AA
                              </span>
                            )}
                            {aluno.trained && (
                              <span className="rounded bg-blue-100 px-1 py-0.5 text-[9px] font-bold text-blue-700" title="Participou da turma">
                                TP
                              </span>
                            )}
                            {!aluno.hasSelf && !aluno.trained && (
                              <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-bold text-amber-700">
                                Pendente
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                      {stats.alunos.length > 5 && (
                        <span className="inline-flex items-center px-2 text-xs text-[#64748B]">
                          +{stats.alunos.length - 5} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
