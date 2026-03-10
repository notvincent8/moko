import { memo, useMemo } from "react"
import AssistantBubble, { type AssistantMessage } from "@/app/component/bubbles/AssistantBubble"
import UserBubble, { type UserMessage } from "@/app/component/bubbles/UserBubble"
import { cn } from "@/lib/utils"

type ChatStreamProps =
  | { type: "user"; messages: UserMessage[]; maxHeight?: string; className?: string }
  | { type: "assistant"; messages: AssistantMessage[]; maxHeight?: string; className?: string }

const ChatStream = memo((props: ChatStreamProps) => {

  const reversedMessages = useMemo(() => props.messages.toReversed(), [props.messages])

  if (props.messages.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      role="log"
      className={cn("flex flex-col-reverse overflow-y-scroll scrollbar-none gap-2", props.className)}
      style={{ maxHeight: props.maxHeight || "30vh" }}
    >
      {props.type === "user"
        ? reversedMessages.map((message, index) => (
            <UserBubble key={message.id} message={message as UserMessage} isLast={index === 0} />
          ))
        : reversedMessages.map((message) => (
            <AssistantBubble key={message.id} message={message as AssistantMessage} />
          ))}
    </div>
  )
})

export const UserStream = (props: Omit<Extract<ChatStreamProps, { type: "user" }>, "type">) => (
  <ChatStream
    type="user"
    maxHeight="30vh"
    {...props}
    className="container-chat safe-area-bottom border-t-2 border-flame-glow"
  />
)

export const AssistantStream = (props: Omit<Extract<ChatStreamProps, { type: "assistant" }>, "type">) => (
  <ChatStream type="assistant" maxHeight="35vh" {...props} />
)
