"use client"
import "@/lib/gsap-init"

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"
import { useCallback, useState } from "react"
import ChatInput from "@/app/component/ChatInput"
import { AssistantStream, UserStream } from "@/app/component/ChatStream"
import Entity from "@/app/component/Entity"
import useChat from "@/app/hook/useChat"
import { cn } from "@/lib/utils"

export default function Home() {
  const { userMessages, assistantMessages, sendMessage, isPending } = useChat()
  const [, setHistoryOpen] = useState(false)

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

  const handleOpenHistory = useCallback(() => {
    setHistoryOpen(true)
    // TODO: Open history modal with merged timeline
    // Access both userMessages and assistantMessages here
  }, [])

  const hasMessages = userMessages.length > 0 || assistantMessages.length > 0

  return (
    <>
      {/* Main stage - Entity centered with responses above */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden container-chat">
        <div className="w-full max-w-lg mb-6 sm:mb-8">
          <AssistantStream messages={assistantMessages} />
        </div>
        <Entity />
      </main>

      <footer className="shrink-0  flex flex-col items-end">
        <UserStream messages={userMessages} />
        <div className="w-full justify-end flex items-center gap-3 safe-area-bottom container-chat border-t border-border">
          <button
            type="button"
            onClick={handleOpenHistory}
            disabled={!hasMessages}
            aria-label="View chat history"
            className={cn(
              "shrink-0 p-2 rounded-lg transition-all duration-200",
              "border border-transparent",
              hasMessages
                ? "text-muted-foreground hover:text-foreground hover:bg-surface hover:border-border active:scale-95"
                : "text-muted-foreground/30 cursor-not-allowed",
            )}
          >
            <CounterClockwiseClockIcon className="w-4 h-4" />
          </button>

          <ChatInput onSend={handleChatInputSend} disabled={isPending} />
        </div>
      </footer>
    </>
  )
}
