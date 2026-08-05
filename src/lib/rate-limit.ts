import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '10 m'),
      analytics: true,
    })
  : null

export async function rateLimitUser(identifier: string) {
  if (!ratelimit) {
    return { success: true, limit: 0, remaining: 0 }
  }

  return ratelimit.limit(identifier)
}
