import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { forwardRef, memo, useRef } from "react"
import { cn } from "@/lib/utils"
import BubbleBase from "./BubbleBase"

export type UserMessage = {
  id: string
  content: string
  pending: boolean
  error?: boolean
  debug?: boolean
}

type UserBubbleProps = {
  message: UserMessage
  isLast?: boolean
  onRetry?: () => void
  onCancel?: () => void
}

type StatusProps = Pick<UserBubbleProps, "onRetry" | "onCancel"> & {
  isError: boolean
  showStatus: boolean
}
const Status = memo(
  forwardRef<HTMLSpanElement, StatusProps>(({ isError, onRetry, onCancel, showStatus }, ref) => {
    if (!showStatus) {
      return <span ref={ref} aria-hidden="true" className="text-[10px] pr-1 select-none" />
    }

    return (
      <span
        ref={ref}
        className={cn("text-[10px] pr-1 select-none relative", isError ? "text-flame/80" : "text-muted-foreground/60")}
      >
        {isError ? (
          <span className="flex items-center gap-2">
            {onCancel && (
              <button type="button" onClick={onCancel} className="hover:text-muted-foreground transition-colors">
                Annuler
              </button>
            )}
            {onRetry && (
              <button type="button" onClick={onRetry} className="hover:text-flame transition-colors">
                Réessayer
              </button>
            )}
          </span>
        ) : (
          <p className="relative">Envoyé</p>
        )}
      </span>
    )
  }),
)

Status.displayName = "Status"

const UserBubble = memo(({ message, isLast = false, onRetry, onCancel }: UserBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)

  const isError = message.error === true
  const isPending = message.pending
  const isSent = !isPending && !isError
  const showStatus = isError || (isLast && isSent)

  useGSAP(
    () => {
      if (!isLast || !bubbleRef.current) return
      const animation = gsap.fromTo(
        bubbleRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            bubbleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          },
        },
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
        debug={message.debug}
        className={cn(
          isError ? "bg-flame/8 border border-flame/20" : "bg-cream-deep/60 dark:bg-surface",
          isPending && "animate-pulse",
        )}
      >
        <span className={cn("text-foreground ", isError && "text-flame")}>{message.content}</span>
      </BubbleBase>
      <Status ref={statusRef} showStatus={showStatus} isError={isError} onRetry={onRetry} onCancel={onCancel} />
    </div>
  )
})

UserBubble.displayName = "UserBubble"

export default UserBubble
