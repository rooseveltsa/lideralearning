const rateMap = new Map<string, { count: number; resetAt: number }>()

type RateLimitConfig = {
  windowMs?: number
  maxRequests?: number
}

export function checkRateLimit(
  key: string,
  { windowMs = 60_000, maxRequests = 10 }: RateLimitConfig = {}
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return ip
}
