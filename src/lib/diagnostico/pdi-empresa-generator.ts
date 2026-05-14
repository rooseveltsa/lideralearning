// PdiEmpresaGenerator: orquestra geração de PDI para o fluxo Empresa.
// Mesma arquitetura do gerador pessoal: tenta NVIDIA NIM, fallback rule-based.

import { nvidiaComplete, NvidiaError } from '@/lib/ai/nvidia-client'
import {
  PDI_EMPRESA_SYSTEM_PROMPT,
  buildPdiEmpresaUserPrompt,
  type DiagnosticoEmpresaInput,
} from '@/lib/ai/prompts/pdi-empresa-prompt'
import { analyzeEmpresa } from './pdi-empresa-analyzer'
import { buildRuleBasedPdiEmpresa } from './pdi-empresa-rule-fallback'
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

  return true
}

function tryParseLLMJson(content: string): unknown | null {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  try {
    return JSON.parse(cleaned)
  } catch {
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

export async function generatePdiEmpresa(
  input: DiagnosticoEmpresaInput,
): Promise<PdiReport> {
  const analyzer = analyzeEmpresa({
    fitScore: input.fitScore,
    discScores: input.discScores,
    perfilLiderancaEsperado: input.perfilLiderancaEsperado,
    diagnosticoAtual: input.diagnosticoAtual,
    modulos: input.modulos,
    expectativas: input.expectativas,
  })

  if (!process.env.NVIDIA_API_KEY) {
    logger.warn('pdi_empresa_no_nvidia_key_fallback', { empresa: input.empresa })
    return buildRuleBasedPdiEmpresa(analyzer, {
      empresa: input.empresa,
      supervisorNome: input.supervisorNome,
      gestorNome: input.gestorNome,
    })
  }

  try {
    const userPrompt = buildPdiEmpresaUserPrompt(input)
    const result = await nvidiaComplete(
      [
        { role: 'system', content: PDI_EMPRESA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      { jsonMode: true, temperature: 0.5, maxTokens: 2500 },
    )

    const parsed = tryParseLLMJson(result.content)
    if (!validatePdiStructure(parsed)) {
      logger.warn('pdi_empresa_llm_invalid_structure', {
        contentPreview: result.content.slice(0, 200),
      })
      return buildRuleBasedPdiEmpresa(analyzer, {
        empresa: input.empresa,
        supervisorNome: input.supervisorNome,
        gestorNome: input.gestorNome,
      })
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

    logger.info('pdi_empresa_generated_ok', {
      provider: 'nvidia-nim',
      model: result.model,
      tokens: result.promptTokens + result.completionTokens,
      latencyMs: result.latencyMs,
    })

    return pdi
  } catch (err) {
    const error = err instanceof NvidiaError ? err : new Error(String(err))
    logger.error('pdi_empresa_llm_failed_fallback', {
      error: error.message,
    })
    return buildRuleBasedPdiEmpresa(analyzer, {
      empresa: input.empresa,
      supervisorNome: input.supervisorNome,
      gestorNome: input.gestorNome,
    })
  }
}
