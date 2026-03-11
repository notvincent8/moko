"use client"
import { Root, Trigger } from "@radix-ui/react-dialog"

import "@/lib/gsap-init"

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Activity, useState } from "react"
import ChatInput from "@/app/component/ChatInput"
import { AssistantStream, UserStream } from "@/app/component/ChatStream"
import ConsentGate from "@/app/component/ConsentGate"
import Disclaimer from "@/app/component/Disclaimer"
import Entity from "@/app/component/Entity"
import History from "@/app/component/History"
import PIIPreviewBubble from "@/app/component/PIIPreviewBubble"
import useChat from "@/app/hook/useChat"
import { usePIIWarning } from "@/app/hook/usePIIWarning"

export default function Home() {
  const { userMessages, assistantMessages, sendMessage, isPending, history } = useChat()
  const [isShowingHistory, setIsShowingHistory] = useState(false)

  const { piiWarning, checkAndSend, sendAnyway, sendAndDismissForever, cancelWarning } = usePIIWarning(sendMessage)

  const handleChatInputSend = (message: string) => {
    if (isPending) return
    checkAndSend(message)
  }

  return (
    <ConsentGate>
      <Root open={isShowingHistory} onOpenChange={setIsShowingHistory}>
        <Activity mode={isShowingHistory ? "visible" : "hidden"}>
          <History isOpen={isShowingHistory} historyMessages={history} />
        </Activity>

        <header className="shrink-0 flex justify-center pt-3 pb-1">
          <Disclaimer />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden container-chat">
          <div className="w-full max-w-lg mb-6 sm:mb-8">
            <AssistantStream messages={assistantMessages} />
          </div>
          <Entity />
        </main>

        <section className="shrink-0 flex flex-col items-end">
          <UserStream messages={userMessages} />

          {piiWarning && (
            <div className="w-full flex justify-end">
              <PIIPreviewBubble
                message={piiWarning.message}
                matches={piiWarning.matches}
                onSend={sendAnyway}
                onDismissForever={sendAndDismissForever}
                onCancel={cancelWarning}
              />
            </div>
          )}
        </section>

        <div className="shrink-0 w-full flex items-center gap-3 safe-area-bottom container-chat border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
            <Link href="/about" className="hover:text-muted-foreground transition-colors">
              À propos
            </Link>
            <Link href="/resources" className="hover:text-muted-foreground transition-colors">
              Aide
            </Link>
          </div>

          <div className="flex-1" />

          <Trigger asChild>
            <button
              type="button"
              aria-label="View chat history"
              className="shrink-0 p-2 rounded-lg transition-all duration-200 border border-transparent hover:text-foreground hover:bg-surface hover:border-border active:scale-95"
            >
              <CounterClockwiseClockIcon className="w-4 h-4" />
            </button>
          </Trigger>

          <ChatInput onSend={handleChatInputSend} disabled={isPending} />
        </div>
      </Root>
    </ConsentGate>
  )
}
