import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useCallback, useMemo, useState } from "react"
import HistoryItem from "@/app/components/history/HistoryItem"
import HistoryToolbar from "@/app/components/history/HistoryToolbar"
import type { Item } from "@/app/hooks/useChat"
import { downloadChatHistory } from "@/lib/downloadHistory"
import { cn } from "@/lib/utils"

type HistoryProps = {
  isOpen: boolean
  historyMessages: Item[]
}

const History = ({ isOpen, historyMessages }: HistoryProps) => {
  const [debug, setDebug] = useState(false)
  const filteredMessages = useMemo(
    () => (debug ? historyMessages : historyMessages.filter((msg) => !msg.debug)),
    [debug, historyMessages],
  )

  const handleDownload = useCallback(() => {
    downloadChatHistory({ messages: filteredMessages, includeDebug: debug })
  }, [filteredMessages, debug])

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        data-state={isOpen ? "open" : undefined}
        className="z-60 fixed inset-0 bg-ink/60 dark:bg-ink-soft/80"
      />
      <Dialog.Content
        data-state={isOpen ? "open" : undefined}
        className={cn(
          "z-60 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100dvw-4rem)] max-w-2xl max-h-[80vh]",
          "flex flex-col",
          "bg-surface-elevated rounded-xl",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          "focus:outline-none",
        )}
      >
        {/* Toolbar: bottom-center on mobile, right-side on desktop */}
        <HistoryToolbar
          className={cn(
            "fixed z-70",
            // Mobile: horizontal bar at bottom of dialog
            "bottom-4 left-1/2 -translate-x-1/2",
            // Desktop: vertical bar on right side
            "sm:bottom-auto sm:left-auto sm:translate-x-0",
            "sm:top-1/2 sm:-translate-y-1/2 sm:right-0 sm:translate-x-[calc(100%+1rem)]",
          )}
          debug={{ show: debug, onToggle: setDebug }}
          onDownload={handleDownload}
        />

        <div className="shrink-0 flex items-center justify-between  gap-3 px-5 pt-5 py-3 border-b">
          <div className="w-1.5 h-6 bg-ink dark:bg-cream rounded-sm" aria-hidden="true" />
          <div className="w-full">
            <div className="flex justify-between">
              <Dialog.Title className="font-display text-lg font-semibold tracking-tight text-foreground">
                History
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={cn(
                    "p-2 -mr-1 rounded-lg",
                    "text-muted-foreground/60 hover:text-foreground",
                    "hover:bg-surface",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame",
                  )}
                  aria-label="Close"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-xs text-muted-foreground/60 mt-0.5">
              {filteredMessages.length === 0
                ? "No messages yet"
                : `${filteredMessages.length} message${filteredMessages.length !== 1 ? "s" : ""}`}
            </Dialog.Description>
            {debug && (
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                Messages marked with a <span className="font-mono text-flame/80">Debug</span> badge are internal notes
                only, they won't be included in the conversation sent to the API when debug mode is off.
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-none will-change-scroll">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-3 h-8 bg-muted-foreground/20 rounded-sm mb-4" />
              <p className="text-sm text-muted-foreground/60">Start a conversation with Moko</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredMessages.map((entry) => (
                <HistoryItem key={entry.id} message={entry} />
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 h-1 bg-linear-to-r from-transparent via-flame/20 to-transparent" />
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default History

// TODO : - Cleaner CSS, refactoring long tailwind classes into css classes
