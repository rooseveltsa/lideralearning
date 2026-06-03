import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { generatePDI } from '@/lib/utils/pdi-generator'
import { generateAiTrackPatches } from '@/lib/diagnostico/pdi-ai-enricher'
import { logger } from '@/lib/logger/structured'

type AvaliacaoExecutivaPayload = {
  userId: string
  // company identification
  nomeEmpresa: string
  segmento: string
  porte: string
  cidadeEstado: string
  nomeAvaliador: string
  cargoAvaliador: string
  // supervisor identification
  nomeSupervisor: string
  cargoSupervisor: string
  tempoSupervisao: string
  // assessment dimensions (1-5 scale)
  dimensoes: {
    comunicacao: number
    tomadaDecisao: number
    gestaoEquipe: number
    orientacaoResultados: number
    adaptabilidade: number
    liderancaEstrategica: number
    desenvolvimentoPessoas: number
    inovacao: number
    eticaIntegridade: number
    gestaoCrise: number
  }
  // open-ended questions
  pontoForte: string
  areaMelhoria: string
  impactoEquipe: string
  recomendacao: string
  comentarioAdicional: string
  // overall recommendation
  recomendacaoGeral: string
  nivelConfianca: number
}

function normalize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function clamp(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number') return null
  if (value < min || value > max) return null
  return value
}

function calcMediaDimensoes(
  dim: AvaliacaoExecutivaPayload['dimensoes'],
): number {
  const values = Object.values(dim).filter(
    (v) => typeof v === 'number' && v >= 1 && v <= 5,
  )
  if (values.length === 0) return 0
  const sum = values.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / values.length) * 10) / 10
}

export async function POST(request: Request) {
  let json: AvaliacaoExecutivaPayload

  try {
    json = (await request.json()) as AvaliacaoExecutivaPayload
  } catch {
    return NextResponse.json({ error: 'Payload invalido.' }, { status: 400 })
  }

  if (!json.userId || !json.dimensoes || !json.nomeSupervisor) {
    return NextResponse.json(
      { error: 'Dados obrigatorios ausentes.' },
      { status: 400 },
    )
  }

  const mediaDimensoes = calcMediaDimensoes(json.dimensoes)

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('leadership_executive_assessments')
    .insert({
      user_id: json.userId,
      // company identification
      nome_empresa: normalize(json.nomeEmpresa) || null,
      segmento: normalize(json.segmento) || null,
      porte: normalize(json.porte) || null,
      cidade_estado: normalize(json.cidadeEstado) || null,
      nome_avaliador: normalize(json.nomeAvaliador) || null,
      cargo_avaliador: normalize(json.cargoAvaliador) || null,
      // supervisor identification
      nome_supervisor: normalize(json.nomeSupervisor),
      cargo_supervisor: normalize(json.cargoSupervisor) || null,
      tempo_supervisao: normalize(json.tempoSupervisao) || null,
      // 10 assessment dimensions (1-5)
      dim_comunicacao: clamp(json.dimensoes?.comunicacao, 1, 5),
      dim_tomada_decisao: clamp(json.dimensoes?.tomadaDecisao, 1, 5),
      dim_gestao_equipe: clamp(json.dimensoes?.gestaoEquipe, 1, 5),
      dim_orientacao_resultados: clamp(json.dimensoes?.orientacaoResultados, 1, 5),
      dim_adaptabilidade: clamp(json.dimensoes?.adaptabilidade, 1, 5),
      dim_lideranca_estrategica: clamp(json.dimensoes?.liderancaEstrategica, 1, 5),
      dim_desenvolvimento_pessoas: clamp(json.dimensoes?.desenvolvimentoPessoas, 1, 5),
      dim_inovacao: clamp(json.dimensoes?.inovacao, 1, 5),
      dim_etica_integridade: clamp(json.dimensoes?.eticaIntegridade, 1, 5),
      dim_gestao_crise: clamp(json.dimensoes?.gestaoCrise, 1, 5),
      // open-ended
      ponto_forte: normalize(json.pontoForte) || null,
      area_melhoria: normalize(json.areaMelhoria) || null,
      impacto_equipe: normalize(json.impactoEquipe) || null,
      recomendacao: normalize(json.recomendacao) || null,
      comentario_adicional: normalize(json.comentarioAdicional) || null,
      // overall
      recomendacao_geral: normalize(json.recomendacaoGeral) || null,
      nivel_confianca: clamp(json.nivelConfianca, 1, 5),
      // calculated
      media_dimensoes: mediaDimensoes,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Error inserting executive assessment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Plano de ação personalizado por IA (opcional, defensivo) ──
  // Agora que a avaliação executiva fechou o PDI, gera o plano de IA 1x e salva.
  // Qualquer falha é ignorada — o PDI cai no plano determinístico LIDERA.
  try {
    const { data: selfRows } = await admin
      .from('leadership_self_assessments')
      .select('*')
      .eq('user_id', json.userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (selfRows && selfRows.length > 0) {
      const { data: rel } = await admin
        .from('gestor_aluno_relationships')
        .select('company_name')
        .eq('aluno_user_id', json.userId)
        .limit(1)
        .maybeSingle()

      const { data: prof } = await admin
        .from('profiles')
        .select('full_name')
        .eq('id', json.userId)
        .maybeSingle()

      const report = generatePDI(
        json.userId,
        prof?.full_name ?? json.nomeSupervisor ?? 'Participante',
        rel?.company_name ?? null,
        selfRows[0] as Record<string, unknown>,
        data as Record<string, unknown>,
      )

      const patches = await generateAiTrackPatches(report)
      if (patches) {
        const { error: updErr } = await admin
          .from('leadership_pdi')
          .update({ action_plan_ai: patches })
          .eq('user_id', json.userId)
        if (updErr) {
          logger.error('pdi_ai_store_failed', { alunoId: json.userId, error: updErr.message })
        }
      }
    }
  } catch (e) {
    logger.error('pdi_ai_pipeline_failed', {
      alunoId: json.userId,
      error: e instanceof Error ? e.message : 'unknown',
    })
  }

  return NextResponse.json({ success: true, avaliacaoId: data.id })
}
