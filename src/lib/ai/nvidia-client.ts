// Cliente NVIDIA NIM (fetch direto, sem SDK adicional).
// Compatível com endpoint OpenAI da NVIDIA: https://integrate.api.nvidia.com/v1
// Free tier: ~1.000 créditos no signup, modelos Llama 3.3 70B disponíveis.

import { logger } from '@/lib/logger/structured'

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEFAULT_MODEL = 'meta/llama-3.3-70b-instruct'
// O Llama 3.3 70B estourava os 30s antigos gerando um PDI completo (medido em prod:
// timeout em 30.003ms), e TODO PDI caía no fallback determinístico. As rotas que geram
// PDI rodam com maxDuration = 60, então 50s deixa ~10s de folga para persistir o
// resultado antes de a plataforma encerrar a execução.
// Quem chama em contexto mais curto deve passar `timeoutMs` explicitamente.
const DEFAULT_TIMEOUT_MS = 50_000
const DEFAULT_TEMPERATURE = 0.6 // criativo mas consistente
const DEFAULT_MAX_TOKENS = 2_500 // PDI completo cabe nisso

export type NvidiaMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type NvidiaCompletionOptions = {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  jsonMode?: boolean
  timeoutMs?: number
}

export type NvidiaCompletionResult = {
  content: string
  model: string
  promptTokens: number
  completionTokens: number
  latencyMs: number
}

class NvidiaError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: string,
  ) {
    super(message)
    this.name = 'NvidiaError'
  }
}

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new NvidiaError(`Timeout after ${ms}ms`)), ms)
    promise
      .then((v) => {
        clearTimeout(timer)
        resolve(v)
      })
      .catch((e) => {
        clearTimeout(timer)
        reject(e)
      })
  })
}

export async function nvidiaComplete(
  messages: NvidiaMessage[],
  opts: NvidiaCompletionOptions = {},
): Promise<NvidiaCompletionResult> {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    throw new NvidiaError('NVIDIA_API_KEY não configurado em env vars.')
  }

  const model = opts.model ?? DEFAULT_MODEL
  const startedAt = Date.now()

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    top_p: opts.topP ?? 0.9,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    stream: false,
  }

  if (opts.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  try {
    const response = await timeoutPromise(
      fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      }),
      opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new NvidiaError(
        `NVIDIA NIM retornou ${response.status}`,
        response.status,
        errorText.slice(0, 500),
      )
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
      usage: { prompt_tokens: number; completion_tokens: number }
      model: string
    }

    const content = json.choices?.[0]?.message?.content ?? ''
    const latencyMs = Date.now() - startedAt

    logger.info('nvidia_completion_ok', {
      model: json.model,
      promptTokens: json.usage?.prompt_tokens,
      completionTokens: json.usage?.completion_tokens,
      latencyMs,
    })

    return {
      content,
      model: json.model,
      promptTokens: json.usage?.prompt_tokens ?? 0,
      completionTokens: json.usage?.completion_tokens ?? 0,
      latencyMs,
    }
  } catch (err) {
    const latencyMs = Date.now() - startedAt
    const message = err instanceof Error ? err.message : 'unknown'
    logger.error('nvidia_completion_failed', {
      model,
      latencyMs,
      error: message,
    })
    if (err instanceof NvidiaError) throw err
    throw new NvidiaError(message)
  }
}

export { NvidiaError }
