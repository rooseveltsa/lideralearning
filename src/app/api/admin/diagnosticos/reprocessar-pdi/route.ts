// Recuperação dos PDIs que nunca foram gerados (docs/stories/PDI-backlog.md — PDI.0.5).
//
// GET  → quem está sem devolutiva
// POST → regenera um lote pequeno e diz quantos ainda faltam
//
// O lote é pequeno de propósito: cada PDI chama o LLM e a rota tem 60s. Processar
// tudo de uma vez estouraria a janela e deixaria o backfill pela metade, sem sinal.

import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { requireAdmin } from '@/lib/auth/require-admin'
import { logger } from '@/lib/logger/structured'
import { listPdisOrfaos, regeneratePdiPessoal } from '@/lib/diagnostico/regenerate-pdi'

export const maxDuration = 60

const MAX_LOTE = 3

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  try {
    const orfaos = await listPdisOrfaos(createAdminClient(), 100)
    // `falhou` distingue quem quebrou na geração de quem nunca chegou a ser processado.
    return NextResponse.json({ total: orfaos.length, orfaos })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    logger.error('pdi_orfaos_list_failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const admin = createAdminClient()

  let lote = 1
  try {
    const body = (await request.json()) as { lote?: number }
    lote = Math.min(Math.max(1, body.lote ?? 1), MAX_LOTE)
  } catch {
    // Sem body: processa um.
  }

  try {
    const orfaos = await listPdisOrfaos(admin, lote)

    if (orfaos.length === 0) {
      return NextResponse.json({ processados: [], restantes: 0, mensagem: 'Nenhum PDI órfão.' })
    }

    // Sequencial, não paralelo: o LLM é o gargalo, e disparar em paralelo
    // arriscaria rate limit e estouro dos 60s.
    const processados = []
    for (const orfao of orfaos) {
      const resultado = await regeneratePdiPessoal(admin, orfao.id)
      processados.push({
        ...resultado,
        nome: orfao.nome_completo,
        email: orfao.email,
      })
    }

    const restantes = (await listPdisOrfaos(admin, 500)).length

    logger.info('pdi_backfill_lote', {
      sucesso: processados.filter((p) => p.ok).length,
      falhas: processados.filter((p) => !p.ok).length,
      restantes,
    })

    return NextResponse.json({ processados, restantes })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    logger.error('pdi_backfill_failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
