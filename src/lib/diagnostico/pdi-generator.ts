// PdiGenerator: orquestra geração de PDI.
// 1. Analisa diagnóstico (rule-based)
// 2. Tenta gerar via NVIDIA NIM com prompt rico (Knowledge Base injetada)
// 3. Se LLM falhar OU retornar JSON inválido → cai para rule-based fallback
// 4. Persiste em personal_diagnostics.pdi.generated (JSONB sub-campo)

import { nvidiaComplete, NvidiaError } from '@/lib/ai/nvidia-client'
import {
  PDI_PESSOAL_SYSTEM_PROMPT,
  buildPdiPessoalUserPrompt,
  type DiagnosticoPessoalInput,
} from '@/lib/ai/prompts/pdi-pessoal-prompt'
import { analyzePessoal } from './pdi-analyzer'
import { buildRuleBasedPdi } from './pdi-rule-fallback'
import { FERRAMENTAS, NIVEIS_LIDER, LITERATURAS } from './pdi-knowledge'
import type { PdiReport } from './pdi-types'
import { logger } from '@/lib/logger/structured'

const PDI_VERSION = '1.0'

const VALID_FERRAMENTA_IDS = new Set(Object.keys(FERRAMENTAS))
const VALID_NIVEL_IDS = new Set(Object.keys(NIVEIS_LIDER))
const VALID_LITERATURA_IDS = new Set(Object.keys(LITERATURAS))

function validatePdiStructure(obj: unknown): obj is PdiReport {
  if (!obj || typeof obj !== 'object') return false
  const r = obj as Partial<PdiReport>

  if (!r.convergencia || !Array.isArray(r.convergencia.pontos)) return false
  if (!Array.isArray(r.fases) || r.fases.length !== 3) return false
  if (!Array.isArray(r.proximosPassos)) return false
  if (typeof r.notaCritica !== 'string') return false
  if (!r.classificacao) return false
  if (!VALID_NIVEL_IDS.has(r.classificacao.atual)) return false
  if (!VALID_NIVEL_IDS.has(r.classificacao.alvo90Dias)) return false

  for (const fase of r.fases) {
    if (!Array.isArray(fase.acoes) || fase.acoes.length < 1) return false
    for (const acao of fase.acoes) {
      if (!VALID_FERRAMENTA_IDS.has(acao.ferramentaId)) return false
    }
  }

  // referencias é opcional — se vier, valida que literaturaIds existem
  if (r.referencias && Array.isArray(r.referencias)) {
    for (const ref of r.referencias) {
      if (!VALID_LITERATURA_IDS.has(ref.literaturaId)) {
        // Filtra silenciosamente — não invalida o PDI inteiro
        return true // permite passar, generator filtra inválidas depois
      }
    }
  }

  return true
}

function tryParseLLMJson(content: string): unknown | null {
  // Remove eventual wrapping em markdown
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    // Tenta encontrar substring JSON dentro do texto
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

export async function generatePdiPessoal(
  input: DiagnosticoPessoalInput,
): Promise<PdiReport> {
  const analyzer = analyzePessoal({
    selfScore: input.selfScore,
    radarAverage: input.radarAverage,
    discScores: input.discScores,
    autoavaliacao: input.autoavaliacao,
    modulos: input.modulos,
    radar: input.radar,
  })

  // Se NVIDIA_API_KEY não estiver configurado, vai direto pro fallback
  if (!process.env.NVIDIA_API_KEY) {
    logger.warn('pdi_no_nvidia_key_fallback', { nomeCompleto: input.nomeCompleto })
    return buildRuleBasedPdi(analyzer, {
      nomeCompleto: input.nomeCompleto,
      empresa: input.empresa,
    })
  }

  try {
    const userPrompt = buildPdiPessoalUserPrompt(input)
    const result = await nvidiaComplete(
      [
        { role: 'system', content: PDI_PESSOAL_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      { jsonMode: true, temperature: 0.5, maxTokens: 2500 },
    )

    const parsed = tryParseLLMJson(result.content)
    if (!validatePdiStructure(parsed)) {
      logger.warn('pdi_llm_invalid_structure', {
        contentPreview: result.content.slice(0, 200),
      })
      const fallback = buildRuleBasedPdi(analyzer, {
        nomeCompleto: input.nomeCompleto,
        empresa: input.empresa,
      })
      return fallback
    }

    const pdi = parsed as PdiReport
    // Filtra referências inválidas (LLM pode inventar literaturaIds)
    if (pdi.referencias && Array.isArray(pdi.referencias)) {
      pdi.referencias = pdi.referencias.filter((ref) =>
        VALID_LITERATURA_IDS.has(ref.literaturaId),
      )
    }
    pdi.meta = {
      generatedAt: new Date().toISOString(),
      provider: 'nvidia-nim',
      model: result.model,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      latencyMs: result.latencyMs,
      version: PDI_VERSION,
    }

    logger.info('pdi_generated_ok', {
      provider: 'nvidia-nim',
      model: result.model,
      tokens: result.promptTokens + result.completionTokens,
      latencyMs: result.latencyMs,
    })

    return pdi
  } catch (err) {
    const error = err instanceof NvidiaError ? err : new Error(String(err))
    logger.error('pdi_llm_failed_fallback', {
      error: error.message,
    })
    return buildRuleBasedPdi(analyzer, {
      nomeCompleto: input.nomeCompleto,
      empresa: input.empresa,
    })
  }
}
