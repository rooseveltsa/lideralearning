// Cliente de LLM do PDI. Roteia entre Claude (preferido) e NVIDIA (legado).
//
// Por que existe: a NVIDIA NIM (Llama 3.3 70B) parou de responder dentro da janela
// serverless — medido em prod: timeout em 30.003ms e depois em 50.003ms, sem resposta.
// Todo PDI caía no fallback determinístico. Claude responde em segundos e escreve um
// PT-BR que pode ir para o cliente sem revisão linha a linha.
//
// A NVIDIA continua como rota alternativa: se ANTHROPIC_API_KEY não existir mas
// NVIDIA_API_KEY existir, o sistema segue funcionando como antes.

import Anthropic from '@anthropic-ai/sdk'

import { logger } from '@/lib/logger/structured'
import { nvidiaComplete, type NvidiaMessage } from './nvidia-client'

const ANTHROPIC_MODEL = 'claude-opus-4-8'
const DEFAULT_MAX_TOKENS = 4_000
// As rotas que geram PDI rodam com maxDuration = 60; 45s deixa folga para persistir.
const DEFAULT_TIMEOUT_MS = 45_000

export type LlmMessage = NvidiaMessage

export type LlmCompletionOptions = {
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
  timeoutMs?: number
}

export type LlmCompletionResult = {
  content: string
  model: string
  provider: 'anthropic' | 'nvidia'
  promptTokens: number
  completionTokens: number
  latencyMs: number
}

export function isLlmConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY || !!process.env.NVIDIA_API_KEY
}

export async function llmComplete(
  messages: LlmMessage[],
  opts: LlmCompletionOptions = {},
): Promise<LlmCompletionResult> {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropicComplete(messages, opts)
  }

  const result = await nvidiaComplete(messages, opts)
  return { ...result, provider: 'nvidia' }
}

async function anthropicComplete(
  messages: LlmMessage[],
  opts: LlmCompletionOptions,
): Promise<LlmCompletionResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const client = new Anthropic({ timeout: timeoutMs, maxRetries: 1 })

  // A Messages API separa system do diálogo — o cliente NVIDIA aceitava system inline.
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n')

  const turns = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

  const startedAt = Date.now()

  try {
    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
      // Sem thinking: a geração roda depois da response, dentro de um orçamento de 60s.
      // Effort medium mantém a qualidade da leitura sem estourar a janela.
      output_config: { effort: 'medium' },
      ...(system ? { system } : {}),
      messages: turns,
    })

    const latencyMs = Date.now() - startedAt

    if (response.stop_reason === 'refusal') {
      throw new Error('Claude recusou a geração do PDI (stop_reason: refusal).')
    }

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    if (!content.trim()) {
      throw new Error(`Claude retornou conteúdo vazio (stop_reason: ${response.stop_reason}).`)
    }

    logger.info('llm_completion_ok', {
      provider: 'anthropic',
      model: response.model,
      latencyMs,
      stopReason: response.stop_reason,
      outputTokens: response.usage.output_tokens,
    })

    return {
      content,
      model: response.model,
      provider: 'anthropic',
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      latencyMs,
    }
  } catch (e) {
    logger.error('llm_completion_failed', {
      provider: 'anthropic',
      model: ANTHROPIC_MODEL,
      latencyMs: Date.now() - startedAt,
      error: e instanceof Error ? e.message : 'unknown',
    })
    throw e
  }
}
