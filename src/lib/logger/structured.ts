type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogPayload = Record<string, unknown>

// LGPD: minimização de PII em logs. Emails são identificadores diretos.
export function maskEmail(email: string | undefined | null): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '***'
  const [local, domain] = email.split('@')
  const localMasked =
    local.length <= 2
      ? '*'.repeat(local.length)
      : `${local[0]}***${local[local.length - 1]}`
  const [domainName, ...tldParts] = domain.split('.')
  const domainMasked =
    domainName.length <= 2 ? '*'.repeat(domainName.length) : `${domainName[0]}***`
  const tld = tldParts.length > 0 ? `.${tldParts.join('.')}` : ''
  return `${localMasked}@${domainMasked}${tld}`
}

function emit(level: LogLevel, event: string, payload: LogPayload) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...payload,
  }

  const json = JSON.stringify(entry)

  if (level === 'error' || level === 'warn') {
    console.error(json)
  } else {
    console.log(json)
  }
}

export const logger = {
  debug: (event: string, payload: LogPayload = {}) => emit('debug', event, payload),
  info: (event: string, payload: LogPayload = {}) => emit('info', event, payload),
  warn: (event: string, payload: LogPayload = {}) => emit('warn', event, payload),
  error: (event: string, payload: LogPayload = {}) => emit('error', event, payload),
}
