/** Aceita apenas caminhos internos. Bloqueia open redirect (`//`, esquema, barra invertida). */
export function safeInternalPath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null
  if (path.includes('://') || path.includes('\\') || path.includes('\0')) return null
  return path
}
