import { memo } from "react"
import type { RateLimitError } from "@/app/hooks/useChat"

const RateLimitErrorNotice = memo(({ rateLimitError }: { rateLimitError: RateLimitError }) => {
  if (!rateLimitError) return null

  const diff = Math.max(0, rateLimitError.retryAfter - Date.now())
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  return (
    <p className="w-full text-[11px] text-flame/80 text-right pr-1 select-none">
      {rateLimitError.type === "burst"
        ? `Limite de message atteinte. Réessaie dans ${m > 0 ? `${m}m ` : ""}${s}s.`
        : "Limite quotidienne atteinte. Reviens demain."}
    </p>
  )
})

RateLimitErrorNotice.displayName = "ErrorNotice"
export default RateLimitErrorNotice
