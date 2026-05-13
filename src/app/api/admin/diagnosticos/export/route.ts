import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsvRow(values: unknown[]): string {
  return values.map(csvEscape).join(';')
}

export async function GET(request: Request) {
  // Verifica que o user é admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso restrito a admin.' }, { status: 403 })
  }

  const url = new URL(request.url)
  const type = (url.searchParams.get('type') || 'all') as 'all' | 'empresa' | 'pessoal'
  const from = url.searchParams.get('from') || ''
  const to = url.searchParams.get('to') || ''
  const search = (url.searchParams.get('search') || '').toLowerCase()

  const admin = createAdminClient()
  const lines: string[] = []

  // Header geral indicando o tipo
  if (type === 'all' || type === 'empresa') {
    lines.push('# DIAGNÓSTICOS EMPRESA')
    lines.push(
      toCsvRow([
        'id',
        'empresa',
        'unidade_filial',
        'segmento',
        'gestor_nome',
        'gestor_cargo',
        'gestor_email',
        'gestor_whatsapp',
        'supervisor_nome',
        'supervisor_cargo',
        'tempo_na_funcao',
        'qtd_liderados',
        'data_avaliacao',
        'fit_score',
        'disc_D',
        'disc_I',
        'disc_S',
        'disc_C',
        'created_at',
      ]),
    )

    let q = admin
      .from('b2b_diagnostics')
      .select(
        'id, empresa, unidade_filial, segmento, gestor_nome, gestor_cargo, gestor_email, gestor_whatsapp, supervisor_nome, supervisor_cargo, tempo_na_funcao, qtd_liderados, data_avaliacao, fit_score, disc_scores, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(5000)
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lte('created_at', `${to}T23:59:59.999Z`)

    const { data } = await q
    let rows = (data as Array<Record<string, unknown>>) || []
    if (search) {
      rows = rows.filter((r) =>
        ['empresa', 'gestor_nome', 'gestor_email', 'supervisor_nome'].some((k) =>
          String(r[k] ?? '')
            .toLowerCase()
            .includes(search),
        ),
      )
    }

    for (const r of rows) {
      const disc = (r.disc_scores as Record<string, number>) || {}
      lines.push(
        toCsvRow([
          r.id,
          r.empresa,
          r.unidade_filial,
          r.segmento,
          r.gestor_nome,
          r.gestor_cargo,
          r.gestor_email,
          r.gestor_whatsapp,
          r.supervisor_nome,
          r.supervisor_cargo,
          r.tempo_na_funcao,
          r.qtd_liderados,
          r.data_avaliacao,
          r.fit_score,
          disc.D ?? 0,
          disc.I ?? 0,
          disc.S ?? 0,
          disc.C ?? 0,
          r.created_at,
        ]),
      )
    }
    lines.push('')
  }

  if (type === 'all' || type === 'pessoal') {
    lines.push('# DIAGNÓSTICOS PESSOAL')
    lines.push(
      toCsvRow([
        'id',
        'nome_completo',
        'email',
        'empresa',
        'cargo',
        'setor',
        'tempo_na_funcao',
        'qtd_liderados',
        'idade',
        'cidade_uf',
        'data_avaliacao',
        'self_score',
        'radar_average',
        'disc_D',
        'disc_I',
        'disc_S',
        'disc_C',
        'linked_b2b_diagnostic_id',
        'pdi_habilidade_desenvolver',
        'pdi_acao_proximos_7_dias',
        'pdi_resultado_90_dias',
        'created_at',
      ]),
    )

    let q = admin
      .from('personal_diagnostics')
      .select(
        'id, nome_completo, email, empresa, cargo, setor, tempo_na_funcao, qtd_liderados, idade, cidade_uf, data_avaliacao, modulo_scores, radar_average, disc_scores, linked_b2b_diagnostic_id, pdi, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(5000)
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lte('created_at', `${to}T23:59:59.999Z`)

    const { data } = await q
    let rows = (data as Array<Record<string, unknown>>) || []
    if (search) {
      rows = rows.filter((r) =>
        ['nome_completo', 'email', 'empresa', 'cargo'].some((k) =>
          String(r[k] ?? '')
            .toLowerCase()
            .includes(search),
        ),
      )
    }

    for (const r of rows) {
      const disc = (r.disc_scores as Record<string, number>) || {}
      const moduloScores = (r.modulo_scores as Record<string, number>) || {}
      const pdi = (r.pdi as Record<string, string | null>) || {}
      lines.push(
        toCsvRow([
          r.id,
          r.nome_completo,
          r.email,
          r.empresa,
          r.cargo,
          r.setor,
          r.tempo_na_funcao,
          r.qtd_liderados,
          r.idade,
          r.cidade_uf,
          r.data_avaliacao,
          moduloScores.self_score ?? 0,
          r.radar_average,
          disc.D ?? 0,
          disc.I ?? 0,
          disc.S ?? 0,
          disc.C ?? 0,
          r.linked_b2b_diagnostic_id,
          pdi.habilidade_desenvolver,
          pdi.acao_proximos_7_dias,
          pdi.resultado_90_dias,
          r.created_at,
        ]),
      )
    }
  }

  const csv = '﻿' + lines.join('\n') // BOM para Excel ler UTF-8 acentuado
  const date = new Date().toISOString().slice(0, 10)
  const filename = `lidera-diagnosticos-${type}-${date}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
