import { sendEmail } from './send'
import { logger, maskEmail } from '@/lib/logger/structured'

type TemplateType = Parameters<typeof sendEmail>[1]
type SendData = Parameters<typeof sendEmail>[2]

type SendWithRetryResult = {
  success: boolean
  error?: string
  attempts: number
  latencyMs: number
}

// Constraints: Vercel Hobby plan tem timeout duro de 10s para serverless functions.
// Pro plan permite 60s. Mantemos o worst-case dentro de 10s para suportar Hobby.
// Worst case atual: 4s (try 1) + 2s (delay) + 4s (try 2) = 10s.
// Se migrar para Pro plan, aumentar para [5000, 30000] e timeout para 5000.
const DEFAULT_TIMEOUT_MS = 4000
const RETRY_DELAYS_MS = [2000]

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendEmailWithRetry(
  to: string,
  template: TemplateType,
  data: SendData,
  context: { leadId?: string; origin?: string } = {},
): Promise<SendWithRetryResult> {
  const startedAt = Date.now()
  let lastError: string | undefined
  const maxAttempts = RETRY_DELAYS_MS.length + 1

  const maskedTo = maskEmail(to)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await timeoutPromise(sendEmail(to, template, data), DEFAULT_TIMEOUT_MS)
      const latencyMs = Date.now() - startedAt

      if (result.success) {
        logger.info('email_sent', {
          template,
          to: maskedTo,
          attempts: attempt,
          latencyMs,
          ...context,
        })
        return { success: true, attempts: attempt, latencyMs }
      }

      lastError = result.error ?? 'unknown error'
      logger.warn('email_send_failed_attempt', {
        template,
        to: maskedTo,
        attempt,
        error: lastError,
        ...context,
      })
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown exception'
      logger.warn('email_send_exception_attempt', {
        template,
        to: maskedTo,
        attempt,
        error: lastError,
        ...context,
      })
    }

    if (attempt < maxAttempts) {
      await sleep(RETRY_DELAYS_MS[attempt - 1])
    }
  }

  const latencyMs = Date.now() - startedAt
  logger.error('email_send_failed_final', {
    template,
    to: maskedTo,
    attempts: maxAttempts,
    latencyMs,
    error: lastError,
    ...context,
  })

  return {
    success: false,
    error: lastError,
    attempts: maxAttempts,
    latencyMs,
  }
}
