import * as Dialog from "@radix-ui/react-dialog"
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons"
import * as Toggle from "@radix-ui/react-toggle"
import { type MouseEvent, memo, useEffect, useState } from "react"
import type { Item } from "@/app/hooks/useChat"
import { formatHistoryDate } from "@/lib/formatDate"
import { cn } from "@/lib/utils"

type HistoryProps = {
  isOpen: boolean
  historyMessages: Item[]
}

const HistoryItemDate = memo(
  ({ date }: { date: Date }) => (
    <time className="text-xs m-0 p-0" dateTime={date.toISOString()}>
      {formatHistoryDate(date)}
    </time>
  ),
  (prev, next) => prev.date.getTime() === next.date.getTime(),
)

const HistoryItem = memo(({ message }: { message: Item }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (e: MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(message.content).catch(console.error)
    setIsCopied(true)
  }

  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [isCopied])

  const isUser = message.role === "user"

  return (
    <li className="group relative py-3 px-4 rounded-lg border border-transparent hover:bg-surface hover:border-border [content-visibility:auto] [contain-intrinsic-size:auto_72px]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 mt-0.5 rounded-sm",
            isUser ? "w-2 h-4 bg-cream-deep dark:bg-surface" : "w-2 h-4 bg-ink dark:bg-cream",
          )}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">{isUser ? "You" : "Moko"}</span>
            {message.sentAt && <HistoryItemDate date={message.sentAt} />}
            {message.debug && (
              <span className="text-xs font-mono text-flame/80 bg-flame/10 px-1.5 py-0.5 rounded">Debug</span>
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed wrap-break-word">{message.content}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopied}
          className={cn(
            "right-4 top-3 absolute flex rounded-md opacity-0 group-hover:opacity-100 ",
            "text-muted-foreground/60 hover:text-foreground ",
            "focus-visible:opacity-100",
          )}
          aria-label="Copy message"
        >
          {isCopied ? <span className="text-[0.65rem] text-flame">Copied</span> : <CopyIcon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </li>
  )
})

const History = ({ isOpen, historyMessages }: HistoryProps) => {
  const [showDebugMessages, setShowDebugMessages] = useState(false)
  const hasDebugMessages = historyMessages.some((msg) => msg.debug)
  const filteredMessages = showDebugMessages ? historyMessages : historyMessages.filter((msg) => !msg.debug)

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        data-state={isOpen ? "open" : undefined}
        className="z-60 fixed inset-0 bg-ink/60 dark:bg-ink-soft/80 backdrop-blur-sm"
      />
      <Dialog.Content
        data-state={isOpen ? "open" : undefined}
        className={cn(
          "z-60 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100dvw-4rem)] max-w-2xl max-h-[80vh]",
          "flex flex-col",
          "bg-surface-elevated rounded-xl border border-border",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          "focus:outline-none",
        )}
      >
        <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Moko-style indicator */}
            <div className="w-1.5 h-6 bg-ink dark:bg-cream rounded-sm" aria-hidden="true" />
            <div>
              <Dialog.Title className="font-display text-lg font-semibold tracking-tight text-foreground">
                History
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground/60 mt-0.5">
                {filteredMessages.length === 0
                  ? "No messages yet"
                  : `${filteredMessages.length} message${filteredMessages.length !== 1 ? "s" : ""}`}
              </Dialog.Description>
              {hasDebugMessages && showDebugMessages && (
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Messages marked with a <span className="font-mono text-flame/80">Debug</span> badge are internal notes
                  only, they won't be included in the conversation sent to the API when debug mode is off.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasDebugMessages && (
              <Toggle.Root
                pressed={showDebugMessages}
                onPressedChange={setShowDebugMessages}
                aria-label={showDebugMessages ? "Hide debug messages" : "Show debug messages"}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                  "text-muted-foreground/60 hover:text-foreground hover:bg-surface",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame",
                  "data-[state=on]:bg-flame/10 data-[state=on]:text-flame",
                )}
              >
                <span className="font-mono">Debug</span>
              </Toggle.Root>
            )}
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
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-none">
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
