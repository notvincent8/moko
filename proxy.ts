import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server"
import { burstLimit, dailyLimit } from "@/lib/redis"

export default async function proxy(req: NextRequest, ctx: NextFetchEvent) {
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]

  // Check both limits in parallel
  const burst = await burstLimit.limit(ip)
  if (!burst.success) {
    return NextResponse.json({ error: "TooManyRequests", limitType: "burst", retryAfter: burst.reset }, { status: 429 })
  }

  const daily = await dailyLimit.limit(ip)
  if (!daily.success) {
    return NextResponse.json({ error: "TooManyRequests", limitType: "daily", retryAfter: daily.reset }, { status: 429 })
  }

  ctx.waitUntil(Promise.all([burst.pending, daily.pending]))

  // Determine which limit was hit (if any) : "burst" or "daily"
  const limitType = !burst.success ? "burst" : !daily.success ? "daily" : null

  if (limitType) {
    const reset = limitType === "burst" ? burst.reset : daily.reset
    return NextResponse.json(
      {
        error: "TooManyRequests",
        limitType,
        retryAfter: reset,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Type": limitType,
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    )
  }

  const res = NextResponse.next()
  res.headers.set("X-RateLimit-Burst-Remaining", burst.remaining.toString())
  res.headers.set("X-RateLimit-Daily-Remaining", daily.remaining.toString())
  return res
}
export const config = {
  matcher: "/api/:path*",
}
