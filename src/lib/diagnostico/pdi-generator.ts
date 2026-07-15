// PdiGenerator: orquestra geração de PDI.
// 1. Analisa diagnóstico (rule-based)
// 2. Tenta gerar via NVIDIA NIM com prompt rico (Knowledge Base injetada)
// 3. Se LLM falhar OU retornar JSON inválido → cai para rule-based fallback
// 4. Persiste em personal_diagnostics.pdi.generated (JSONB sub-campo)

import { NvidiaError } from '@/lib/ai/nvidia-client'
import { llmComplete, isLlmConfigured } from '@/lib/ai/llm-client'
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

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/**
 * Merge de reparo: esqueleto determinístico (IDs e estrutura sempre válidos) +
 * texto interpretativo da IA onde ele é seguro de aproveitar.
 *
 * Por quê: modelos menores (ex.: Llama 8B) escrevem bom português mas erram os
 * IDs de catálogo (ferramentas, níveis). Descartar o PDI inteiro por causa disso
 * desperdiça a leitura que a IA fez. Aqui o motor de regras garante o "o quê"
 * (quais ferramentas, qual nível, quais módulos) e a IA entrega o "porquê" — a
 * convergência entre autoavaliação e percepção externa, e a nota crítica.
 */
function mergeRepair(llm: unknown, skeleton: PdiReport): PdiReport {
  if (!llm || typeof llm !== 'object') return skeleton
  const src = llm as Partial<PdiReport>
  const out: PdiReport = { ...skeleton }

  // Convergência: o núcleo interpretativo. Aproveita o resumo e os pontos da IA
  // quando têm forma válida; senão mantém o determinístico.
  if (src.convergencia && typeof src.convergencia === 'object') {
    const conv = { ...skeleton.convergencia }
    if (isNonEmptyString(src.convergencia.resumo)) conv.resumo = src.convergencia.resumo
    if (Array.isArray(src.convergencia.pontos)) {
      const pontos = src.convergencia.pontos.filter(
        (p) => p && isNonEmptyString(p.analise) && isNonEmptyString(p.comentario),
      )
      if (pontos.length > 0) conv.pontos = pontos
    }
    out.convergencia = conv
  }

  // Nota crítica: prosa livre, sempre segura de aproveitar.
  if (isNonEmptyString(src.notaCritica)) out.notaCritica = src.notaCritica

  // Próximos passos: aproveita se vierem em forma válida.
  if (Array.isArray(src.proximosPassos)) {
    const passos = src.proximosPassos.filter(
      (p) => p && isNonEmptyString(p.titulo) && isNonEmptyString(p.descricao),
    )
    if (passos.length > 0) out.proximosPassos = passos
  }

  // Fases: mantém o esqueleto (IDs de ferramenta válidos), mas empresta o texto
  // narrativo da IA fase a fase, sem tocar nas ações — que dependem dos IDs certos.
  if (Array.isArray(src.fases) && src.fases.length === skeleton.fases.length) {
    out.fases = skeleton.fases.map((fase, i) => {
      const llmFase = src.fases?.[i]
      if (!llmFase) return fase
      return {
        ...fase,
        titulo: isNonEmptyString(llmFase.titulo) ? llmFase.titulo : fase.titulo,
        objetivo: isNonEmptyString(llmFase.objetivo) ? llmFase.objetivo : fase.objetivo,
        kpiSucesso: isNonEmptyString(llmFase.kpiSucesso) ? llmFase.kpiSucesso : fase.kpiSucesso,
      }
    })
  }

  // Referências: só as com literaturaId válido.
  if (Array.isArray(src.referencias)) {
    const refs = src.referencias.filter((r) => r && VALID_LITERATURA_IDS.has(r.literaturaId))
    if (refs.length > 0) out.referencias = refs
  }

  return out
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

  // Sem nenhum provedor de IA configurado, vai direto pro fallback determinístico
  if (!isLlmConfigured()) {
    logger.warn('pdi_no_llm_key_fallback', { nomeCompleto: input.nomeCompleto })
    return buildRuleBasedPdi(analyzer, {
      nomeCompleto: input.nomeCompleto,
      empresa: input.empresa,
    })
  }

  try {
    const userPrompt = buildPdiPessoalUserPrompt(input)
    const result = await llmComplete(
      [
        { role: 'system', content: PDI_PESSOAL_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      { jsonMode: true, temperature: 0.5, maxTokens: 4000 },
    )

    const parsed = tryParseLLMJson(result.content)
    const skeleton = buildRuleBasedPdi(analyzer, {
      nomeCompleto: input.nomeCompleto,
      empresa: input.empresa,
    })

    let pdi: PdiReport
    let providerLabel: PdiReport['meta']['provider']

    if (validatePdiStructure(parsed)) {
      // Saída da IA já bate 100% no schema (modelos maiores).
      pdi = parsed as PdiReport
      if (pdi.referencias && Array.isArray(pdi.referencias)) {
        pdi.referencias = pdi.referencias.filter((ref) =>
          VALID_LITERATURA_IDS.has(ref.literaturaId),
        )
      }
      providerLabel = result.provider
    } else if (parsed && typeof parsed === 'object') {
      // A IA produziu texto mas errou algum ID de catálogo (comum em modelos
      // menores). Repara em vez de descartar: esqueleto válido + prosa da IA.
      logger.warn('pdi_llm_repaired', {
        contentPreview: result.content.slice(0, 200),
      })
      pdi = mergeRepair(parsed, skeleton)
      providerLabel = result.provider
    } else {
      // Nem JSON saiu — cai para o determinístico puro.
      logger.warn('pdi_llm_unparseable', {
        contentPreview: result.content.slice(0, 200),
      })
      return skeleton
    }

    pdi.meta = {
      generatedAt: new Date().toISOString(),
      provider: providerLabel,
      model: result.model,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      latencyMs: result.latencyMs,
      version: PDI_VERSION,
    }

    logger.info('pdi_generated_ok', {
      provider: providerLabel,
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
