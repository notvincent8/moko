import * as Dialog from "@radix-ui/react-dialog"
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons"
import type { MouseEvent } from "react"
import { memo, useState } from "react"
import type { Item } from "@/app/hook/useChat"
import { lang } from "@/lib/get-lang"
import { cn } from "@/lib/utils"

type HistoryProps = {
  isOpen: boolean
  historyMessages: Item[]
}

const HistoryItemDate = memo(({ date }: { date: Date }) => {
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)

  let stringDate = date.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })
  if (date >= todayStart) {
    // just show time
  } else if (date >= yesterdayStart) {
    stringDate = `Yesterday, ${stringDate}`
  } else {
    stringDate = `${date.toLocaleDateString(lang)}, ${stringDate}`
  }
  return (
    <time className="text-xs m-0 p-0" dateTime={date.toISOString()}>
      {stringDate}
    </time>
  )
})

const CopiedIndicator = () => <span className="text-xs text-flame">Copied!</span>
const CopyButton = ({ onClick }: { onClick: (e: MouseEvent) => void }) => (
  <button type="button" onClick={onClick} className="text-xs text-muted-foreground hover:text-foreground">
    <CopyIcon />
  </button>
)

const HistoryItem = ({ message }: { message: Item }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (e: MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(message.content).catch(console.error)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const isUser = message.role === "user"
  return (
    <li
      className="group hover:bg-surface rounded-lg py-2 px-3  border border-surface-elevated hover:border-ink/10 [content-visibility:auto] [contain-intrinsic-size:auto_80px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-1 justify-between ">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="text-sm">{isUser ? "Me" : "Moko"}</span>
            {message.sentAt ? <HistoryItemDate date={message.sentAt} /> : null}
          </div>
          {isHovered && (isCopied ? <CopiedIndicator /> : <CopyButton onClick={handleCopy} />)}
        </div>
        <p className="text-sm text-foreground">{message.content}</p>
      </div>
      <span
        aria-hidden={!isHovered}
        className={cn("text-right text-xs text-muted-foreground w-full inline-block group-hover:opacity-100 opacity-0")}
      >
        {message.id}
      </span>
    </li>
  )
}
const History = ({ isOpen, historyMessages }: HistoryProps) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay data-state={isOpen ? "open" : undefined} className="fixed inset-0  bg-ink-soft/80" />
      <Dialog.Content
        data-state={isOpen ? "open" : undefined}
        className="fixed flex flex-col gap-4 left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-elevated p-6"
      >
        <Dialog.Title className="font-medium">History</Dialog.Title>
        <Dialog.Description className="text-sm">
          {historyMessages.length} message{historyMessages.length > 1 && "s"}
        </Dialog.Description>
        <div className="max-h-9/12 p-1 overflow-y-auto">
          {historyMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ul>
              {historyMessages.map((entry) => (
                <HistoryItem key={entry.id} message={entry} />
              ))}
            </ul>
          )}
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            className="absolute right-2.5 top-2.5 inline-flex size-6 appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default History
