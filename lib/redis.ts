import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
// Burst protection: 10 requests per 10 minutes
export const burstLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  ephemeralCache: new Map(),
  prefix: "@moko/burst",
})

// Daily protection: 50 messages per day (adjust as needed)
export const dailyLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 d"),
  prefix: "@moko/daily",
})
