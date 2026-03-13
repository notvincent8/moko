import { CopyIcon } from "@radix-ui/react-icons"
import type { MouseEvent } from "react"
import { memo, useEffect, useState } from "react"
import type { Item } from "@/app/hooks/useChat"
import { formatHistoryDate } from "@/lib/formatDate"
import { cn } from "@/lib/utils"

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

HistoryItem.displayName = "HistoryItem"

export default HistoryItem
