// Regeneração de PDI a partir do que já está gravado no banco.
//
// Existe porque os PDIs gerados antes do fix do `after()` nunca chegaram a ser
// escritos: a geração era disparada depois da response e a plataforma matava a
// execução. Quem preencheu ficou com `pdi.generated` ausente e sem devolutiva.
// Este módulo reconstrói o input a partir da própria linha do diagnóstico —
// nenhum dado do formulário se perdeu, então nada precisa ser pedido de novo.

import type { SupabaseClient } from '@supabase/supabase-js'

import { logger } from '@/lib/logger/structured'
import { generatePdiPessoal } from './pdi-generator'

export type RegenerateResult = {
  diagnosticoId: string
  ok: boolean
  provider?: string
  error?: string
}

export type PdiOrfao = {
  id: string
  nome_completo: string
  email: string
  created_at: string
  falhou: boolean
}

function selfAssessmentScore(auto: Record<string, number>): number {
  const values = Object.values(auto || {})
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round((sum / (values.length * 5)) * 100)
}

/**
 * Diagnósticos pessoais sem PDI gerado. `pdi.generated` ausente é a marca —
 * vale tanto para quem falhou quanto para quem nunca chegou a ser processado.
 */
export async function listPdisOrfaos(
  admin: SupabaseClient,
  limit = 100,
): Promise<PdiOrfao[]> {
  const { data, error } = await admin
    .from('personal_diagnostics')
    .select('id, nome_completo, email, created_at, pdi')
    .order('created_at', { ascending: true })
    .limit(500)

  if (error) throw new Error(error.message)

  return (data ?? [])
    .filter((row) => !((row.pdi as Record<string, unknown>) || {}).generated)
    .slice(0, limit)
    .map((row) => ({
      id: row.id as string,
      nome_completo: row.nome_completo as string,
      email: row.email as string,
      created_at: row.created_at as string,
      falhou: !!((row.pdi as Record<string, unknown>) || {}).error,
    }))
}

/** Regenera e persiste o PDI de um diagnóstico pessoal. */
export async function regeneratePdiPessoal(
  admin: SupabaseClient,
  diagnosticoId: string,
): Promise<RegenerateResult> {
  try {
    const { data: row, error } = await admin
      .from('personal_diagnostics')
      .select(
        'id, nome_completo, empresa, cargo, tempo_na_funcao, qtd_liderados, autoavaliacao_comportamental, modulos_lidera, reflexao_profissional, radar_desenvolvimento, pdi, alinhamento_final, disc_scores, radar_average',
      )
      .eq('id', diagnosticoId)
      .single()

    if (error || !row) {
      throw new Error(error?.message ?? 'diagnóstico não encontrado')
    }

    const autoavaliacao = (row.autoavaliacao_comportamental as Record<string, number>) || {}
    const alinhamento = (row.alinhamento_final as Record<string, unknown>) || {}
    const reflexao = (row.reflexao_profissional as Record<string, unknown>) || {}

    const pdiReport = await generatePdiPessoal({
      nomeCompleto: (row.nome_completo as string) || 'Líder',
      empresa: (row.empresa as string) || null,
      cargo: (row.cargo as string) || null,
      tempoNaFuncao: (row.tempo_na_funcao as string) || null,
      qtdLiderados: (row.qtd_liderados as number) || null,
      selfScore: selfAssessmentScore(autoavaliacao),
      radarAverage: Number(row.radar_average ?? 0),
      discScores: (row.disc_scores as Record<string, number>) || {},
      autoavaliacao,
      modulos: (row.modulos_lidera as Record<string, string>) || {},
      pdiForm: (row.pdi as Record<string, string | null>) || {},
      alinhamento: {
        o_que_empresa_espera: (alinhamento.o_que_empresa_espera as string) || null,
        o_que_entrega_melhor: (alinhamento.o_que_entrega_melhor as string) || null,
        onde_maior_desalinhamento: (alinhamento.onde_maior_desalinhamento as string) || null,
      },
      radar: (row.radar_desenvolvimento as Record<string, number>) || {},
      desejaDesenvolver: (reflexao.deseja_desenvolver as Record<string, number>) || {},
      comparativoEmpresa: null,
      objetivoCarreira: (alinhamento.objetivo_carreira as Record<string, string | null>) || {},
      kpisPercebidos: (alinhamento.kpis_percebidos as Record<string, number>) || {},
    })

    // Preserva as respostas do formulário, que vivem no mesmo JSONB, e limpa o erro anterior.
    const { error: _previousError, ...formAnswers } =
      ((row.pdi as Record<string, unknown>) || {}) as { error?: unknown }

    const { error: persistError } = await admin
      .from('personal_diagnostics')
      .update({ pdi: { ...formAnswers, generated: pdiReport } })
      .eq('id', diagnosticoId)

    if (persistError) throw new Error(persistError.message)

    logger.info('pdi_regenerated', {
      diagnosticoId,
      provider: pdiReport.meta.provider,
      model: pdiReport.meta.model,
    })

    return { diagnosticoId, ok: true, provider: pdiReport.meta.provider }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    logger.error('pdi_regeneration_failed', { diagnosticoId, error: message })
    return { diagnosticoId, ok: false, error: message }
  }
}
