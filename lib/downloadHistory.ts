import type { Item } from "@/app/hooks/useChat"

type DownloadHistoryOptions = {
  messages: Item[]
  includeDebug?: boolean
}

const pad = (n: number) => String(n).padStart(2, "0")

const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

const formatMessage = ({ role, content, sentAt, debug: isDebug }: Item) => {
  const timestamp = sentAt ? `[${formatTime(new Date(sentAt))}] ` : ""
  const debug = isDebug ? `(Debug) ` : ""
  const speaker = role === "user" ? "You" : "Moko"
  return `${timestamp}${debug}${speaker}: ${content}`
}

export const downloadChatHistory = ({ messages, includeDebug = false }: DownloadHistoryOptions) => {
  const now = new Date()

  const filename = `moko-chat-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.txt`

  const header = [
    "Moko - Chat History",
    includeDebug ? "DEBUG MODE ON" : null,
    now.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
    "─".repeat(40),
    "\n",
  ]
    .filter(Boolean)
    .join("\n")

  const body = messages.map(formatMessage).join("\n\n")

  const blob = new Blob([header + body], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}
