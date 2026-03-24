import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/service'
import RespostasClient from './RespostasClient'

/* ─────────────────────────────────────────────
   Config por tipo de formulario
───────────────────────────────────────────── */

type FormTypeKey = 'autoavaliacao' | 'diagnostico' | 'pdi' | 'avaliacao-executiva'

const FORM_CONFIG: Record<FormTypeKey, { titulo: string; cor: string; bgCor: string }> = {
  autoavaliacao: { titulo: 'Autoavaliacao', cor: '#1565C0', bgCor: '#EFF6FE' },
  diagnostico: { titulo: 'Diagnostico de Lideranca', cor: '#F57C00', bgCor: '#FFF8F0' },
  pdi: { titulo: 'Plano de Desenvolvimento Individual', cor: '#7B1FA2', bgCor: '#F3E5F5' },
  'avaliacao-executiva': { titulo: 'Avaliacao Executiva', cor: '#00695C', bgCor: '#E0F2F1' },
}

/* ─────────────────────────────────────────────
   Question labels for display
───────────────────────────────────────────── */

const AUTOAVALIACAO_LABELS: Record<string, string> = {
  q_percepcao: 'Percepcao da Funcao',
  q_gestao: 'Gestao de Equipes',
  q_comunicacao: 'Comunicacao e Postura',
  q_tecnologia: 'Tecnologia e KPIs',
  q_etica: 'Alicerce Etico',
  q_dor: 'Dor Atual e Expectativa',
  texto_dor_atual: 'Dor Atual (texto)',
  texto_custo_futuro: 'Custo Futuro (texto)',
}

const EXEC_DIM_LABELS: Record<string, string> = {
  dim_comunicacao: 'Comunicacao',
  dim_tomada_decisao: 'Tomada de Decisao',
  dim_gestao_equipe: 'Gestao de Equipe',
  dim_orientacao_resultados: 'Orientacao a Resultados',
  dim_adaptabilidade: 'Adaptabilidade',
  dim_lideranca_estrategica: 'Lideranca Estrategica',
  dim_desenvolvimento_pessoas: 'Desenvolvimento de Pessoas',
  dim_inovacao: 'Inovacao',
  dim_etica_integridade: 'Etica e Integridade',
  dim_gestao_crise: 'Gestao de Crise',
}

const PDI_LABELS: Record<string, string> = {
  dim_facilitador: 'Facilitador',
  dim_orientador: 'Orientador',
  dim_garantidor: 'Garantidor',
  dim_estrategista: 'Estrategista',
  dim_mentor: 'Mentor',
  hs_execucao: 'Hard: Execucao',
  hs_processos: 'Hard: Processos',
  hs_ferramentas: 'Hard: Ferramentas',
  hs_padroes: 'Hard: Padroes',
  ss_inteligencia_emocional: 'Soft: Inteligencia Emocional',
  ss_feedback: 'Soft: Feedback',
  ss_conflitos_geracionais: 'Soft: Conflitos Geracionais',
  ss_visao_futuro: 'Soft: Visao de Futuro',
  compromisso_comportamento: 'Compromisso: Comportamento',
  compromisso_dados: 'Compromisso: Dados',
  compromisso_sucessao: 'Compromisso: Sucessao',
  texto_triade: 'Triade (texto)',
}

/* ─────────────────────────────────────────────
   Data fetchers — admin client bypasses RLS
───────────────────────────────────────────── */

export type ResponseRow = {
  id: string
  user_id: string
  respondente: string
  email: string
  data: string
  score: string | null
  perfil: string | null
  extra: string | null
  details: Record<string, unknown>
  formType: string
}

async function getEmailMap(admin: ReturnType<typeof createAdminClient>, userIds: string[]): Promise<Record<string, string>> {
  if (userIds.length === 0) return {}
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const map: Record<string, string> = {}
  if (data?.users) {
    for (const u of data.users) {
      if (userIds.includes(u.id)) {
        map[u.id] = u.email ?? ''
      }
    }
  }
  return map
}

async function getProfileMap(admin: ReturnType<typeof createAdminClient>, userIds: string[]): Promise<Record<string, string>> {
  if (userIds.length === 0) return {}
  const { data } = await admin
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)
  const map: Record<string, string> = {}
  if (data) {
    for (const p of data as { id: string; full_name: string | null }[]) {
      map[p.id] = p.full_name ?? ''
    }
  }
  return map
}

async function fetchAutoavaliacao(admin: ReturnType<typeof createAdminClient>): Promise<ResponseRow[]> {
  const { data, error } = await admin
    .from('leadership_self_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const rows = data as Array<Record<string, unknown>>
  const userIds = rows.map((r) => r.user_id as string).filter(Boolean)
  const [emailMap, profileMap] = await Promise.all([
    getEmailMap(admin, userIds),
    getProfileMap(admin, userIds),
  ])

  const perfilLabels: Record<string, string> = {
    reativo: 'Supervisor Reativo',
    transicao: 'Em Transicao',
    lider_valor: 'Lider de Valor',
  }

  return rows.map((row) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    respondente: profileMap[row.user_id as string] || (row.user_id as string).slice(0, 8) + '...',
    email: emailMap[row.user_id as string] || '',
    data: row.created_at as string,
    score: `${row.pontuacao_total} pts`,
    perfil: perfilLabels[(row.perfil as string)] ?? (row.perfil as string),
    extra: null,
    details: row,
    formType: 'autoavaliacao',
  }))
}

async function fetchDiagnostico(admin: ReturnType<typeof createAdminClient>): Promise<ResponseRow[]> {
  const { data, error } = await admin
    .from('leadership_diagnostics')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const rows = data as Array<Record<string, unknown>>
  const userIds = rows.map((r) => r.user_id as string).filter(Boolean)
  const emailMap = userIds.length > 0 ? await getEmailMap(admin, userIds) : {}

  return rows.map((row) => ({
    id: row.id as string,
    user_id: (row.user_id as string) ?? '',
    respondente: (row.full_name as string) || (row.user_id as string) || 'Anonimo',
    email: emailMap[(row.user_id as string)] || '',
    data: row.created_at as string,
    score: null,
    perfil: null,
    extra: null,
    details: row,
    formType: 'diagnostico',
  }))
}

async function fetchPdi(admin: ReturnType<typeof createAdminClient>): Promise<ResponseRow[]> {
  const { data, error } = await admin
    .from('leadership_pdi')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const rows = data as Array<Record<string, unknown>>
  const userIds = rows.map((r) => r.user_id as string).filter(Boolean)
  const [emailMap, profileMap] = await Promise.all([
    getEmailMap(admin, userIds),
    getProfileMap(admin, userIds),
  ])

  return rows.map((row) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    respondente: profileMap[row.user_id as string] || (row.user_id as string).slice(0, 8) + '...',
    email: emailMap[row.user_id as string] || '',
    data: row.created_at as string,
    score: row.media_dimensoes != null ? `${Number(row.media_dimensoes).toFixed(1)} media` : null,
    perfil: null,
    extra: row.cargo ? `Cargo: ${row.cargo}` : null,
    details: row,
    formType: 'pdi',
  }))
}

async function fetchExecutiva(admin: ReturnType<typeof createAdminClient>): Promise<ResponseRow[]> {
  const { data, error } = await admin
    .from('leadership_executive_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const rows = data as Array<Record<string, unknown>>
  const userIds = rows.map((r) => r.user_id as string).filter(Boolean)
  const [emailMap, profileMap] = await Promise.all([
    getEmailMap(admin, userIds),
    getProfileMap(admin, userIds),
  ])

  return rows.map((row) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    respondente: profileMap[row.user_id as string] || (row.user_id as string).slice(0, 8) + '...',
    email: emailMap[row.user_id as string] || '',
    data: row.created_at as string,
    score: row.media_dimensoes != null ? `${Number(row.media_dimensoes).toFixed(1)}/5` : null,
    perfil: row.nome_supervisor ? `Supervisor: ${row.nome_supervisor}` : null,
    extra: row.nome_empresa ? `Empresa: ${row.nome_empresa}` : null,
    details: row,
    formType: 'avaliacao-executiva',
  }))
}

/* ─────────────────────────────────────────────
   Page (server component)
───────────────────────────────────────────── */

export default async function RespostasPage({
  params,
}: {
  params: Promise<{ formType: string }>
}) {
  const { formType } = await params
  const config = FORM_CONFIG[formType as FormTypeKey]

  if (!config) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-bold text-[#0F172A]">Tipo de formulario nao encontrado</p>
        <Link href="/admin/formularios" className="mt-3 inline-block text-xs font-bold text-[#1E88E5] hover:underline">
          Voltar para formularios
        </Link>
      </div>
    )
  }

  const admin = createAdminClient()
  let rows: ResponseRow[] = []

  try {
    switch (formType as FormTypeKey) {
      case 'autoavaliacao':
        rows = await fetchAutoavaliacao(admin)
        break
      case 'diagnostico':
        rows = await fetchDiagnostico(admin)
        break
      case 'pdi':
        rows = await fetchPdi(admin)
        break
      case 'avaliacao-executiva':
        rows = await fetchExecutiva(admin)
        break
    }
  } catch {
    rows = []
  }

  // Build label maps for client component
  const labelMaps: Record<string, Record<string, string>> = {
    autoavaliacao: AUTOAVALIACAO_LABELS,
    'avaliacao-executiva': EXEC_DIM_LABELS,
    pdi: PDI_LABELS,
    diagnostico: {},
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/formularios"
        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E88E5] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>

      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">
          Respostas recebidas
        </p>
        <h1 className="mt-1 font-heading text-xl font-extrabold">
          {config.titulo}
        </h1>
      </section>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: config.bgCor }}
        >
          <Users className="h-4 w-4" style={{ color: config.cor }} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-[#0F172A]">{rows.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Respostas</p>
        </div>
      </div>

      <RespostasClient
        rows={rows}
        formType={formType}
        config={config}
        labelMap={labelMaps[formType] ?? {}}
      />
    </div>
  )
}
