import { memo } from "react"
import { cn } from "@/lib/utils"
import BubbleBase from "./BubbleBase"

export type AssistantMessage = {
  id: string
  content: string
  streaming: boolean
  error?: boolean
}

type AssistantBubbleProps = {
  message: AssistantMessage
  className?: string
}

const TypingIndicator = () => (
  <span className="inline-flex items-baseline gap-[2px] text-muted-foreground text-sm">
    <span className="animate-pulse [animation-duration:1s]">·</span>
    <span className="animate-pulse [animation-duration:1s] [animation-delay:150ms]">·</span>
    <span className="animate-pulse [animation-duration:1s] [animation-delay:300ms]">·</span>
  </span>
)

const AssistantBubble = memo(({ message, className }: AssistantBubbleProps) => {
  const isTyping = message.streaming && !message.content
  const hasContent = message.content.length > 0

  if (message.error || (!message.streaming && !hasContent)) {
    return null
  }

  return (
    <BubbleBase
      aria-label={isTyping ? "Typing" : `Assistant said: ${message.content}`}
      busy={message.streaming}
      className={cn("mr-auto border-l-2 border-flame/50 rounded-none rounded-r-lg bg-surface-elevated pl-3", className)}
    >
      {isTyping ? <TypingIndicator /> : <p className="text-foreground">{message.content}</p>}
    </BubbleBase>
  )
})

AssistantBubble.displayName = "AssistantBubble"

export default AssistantBubble
