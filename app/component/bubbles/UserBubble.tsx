import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { memo, useRef } from "react"
import { cn } from "@/lib/utils"
import BubbleBase from "./BubbleBase"

export type UserMessage = {
  id: string
  content: string
  pending: boolean
  error?: boolean
}

type UserBubbleProps = {
  message: UserMessage
  isLast?: boolean
  onRetry?: () => void
  onCancel?: () => void
}

const UserBubble = memo(({ message, isLast = false, onRetry, onCancel }: UserBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const isError = message.error
  const isSent = !message.pending && !isError
  const showStatus = isError || (isLast && isSent)

  useGSAP(
    () => {
      if (!isLast || !bubbleRef.current) return
      const animation = gsap.fromTo(
        bubbleRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
      )

      return () => {
        animation.kill()
      }
    },
    { scope: bubbleRef, dependencies: [isLast] },
  )

  useGSAP(
    () => {
      if (!(isLast && isSent) || !statusRef.current) return
      const q = gsap.utils.selector(statusRef.current)
      const animation = gsap.from(q("p"), {
        delay: 0.2,
        x: 10,
        opacity: 0,
        duration: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          bubbleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        },
      })

      return () => {
        animation.kill()
      }
    },
    { scope: bubbleRef, dependencies: [isLast, isSent] },
  )

  return (
    <div ref={bubbleRef} className="flex flex-col items-end gap-0.5">
      <BubbleBase
        aria-label={`You said: ${message.content}`}
        busy={message.pending}
        className={cn(
          isError ? "bg-flame/8 border border-flame/20" : "bg-cream-deep/60 dark:bg-surface",
          !isSent && !isError && "animate-pulse",
        )}
      >
        <span className={cn("text-foreground ", isError && "text-flame")}>{message.content}</span>
      </BubbleBase>
      <span
        ref={statusRef}
        aria-hidden={!showStatus}
        className={cn("text-[10px] pr-1 select-none relative", isError ? "text-flame/80" : "text-muted-foreground/60")}
      >
        {showStatus && !isError && <p className="relative">Sent</p>}
        {showStatus && isError && (
          <span className="flex items-center gap-2">
            {onCancel && (
              <button type="button" onClick={onCancel} className="hover:text-muted-foreground transition-colors">
                Cancel
              </button>
            )}
            {onRetry && (
              <button type="button" onClick={onRetry} className="hover:text-flame transition-colors">
                Retry
              </button>
            )}
          </span>
        )}
      </span>
    </div>
  )
})

UserBubble.displayName = "UserBubble"

export default UserBubble
