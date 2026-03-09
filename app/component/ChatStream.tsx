import AssistantBubble, { type AssistantMessage } from "@/app/component/bubbles/AssistantBubble"
import UserBubble, { type UserMessage } from "@/app/component/bubbles/UserBubble"

type UserStreamProps = {
  messages: UserMessage[]
}

export const UserStream = ({ messages }: UserStreamProps) => {
  return (
    <section
      aria-label="Your messages"
      aria-live="polite"
      aria-relevant="additions"
      role="log"
      className="flex flex-col gap-2"
    >
      {messages.map((message, index) => (
        <UserBubble
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}
    </section>
  )
}

type AssistantStreamProps = {
  messages: AssistantMessage[]
}

export const AssistantStream = ({ messages }: AssistantStreamProps) => {
  return (
    <section
      aria-label="Assistant messages"
      aria-live="polite"
      aria-relevant="additions"
      role="log"
      className="flex flex-col gap-2"
    >
      {messages.map((message) => (
        <AssistantBubble key={message.id} message={message} />
      ))}
    </section>
  )
}
