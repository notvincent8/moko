"use client"
import "@/lib/gsap-init"

import ChatInput from "@/app/component/ChatInput"
import { AssistantStream, UserStream } from "@/app/component/ChatStream"
import useChat from "@/app/hook/useChat"

export default function Home() {
  const { userMessages, assistantMessages, sendMessage, isPending } = useChat()

  const handleChatInputSend = (message: string | undefined) => {
    if (isPending) return
    if (!message) {
      if (process.env.NODE_ENV === "development") {
        console.error("Message is required")
      }
      return
    }
    sendMessage(message)
  }

  return (
    <section>
      <h1>Moko</h1>
      <ChatInput onSend={handleChatInputSend} disabled={isPending} />
      <div className="flex flex-col gap-4 mt-4">
        <UserStream messages={userMessages} />

        <AssistantStream messages={assistantMessages} />
      </div>
    </section>
  )
}
