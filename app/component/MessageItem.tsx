import { memo } from "react"
import type { Item } from "@/app/hook/useChat"

const MessageItem = memo(({ item }: { item: Item }) => (
  <div className="flex items-start  gap-2">
    {item.role === "assistant" && <span className="text-blue-500">MOKO: </span>}
    {item.streaming && item.message === "" && <span className="text-gray-400">Typing...</span>}
    {item.message && (
      <span className={item.error ? "line-through text-gray-400" : ""}>
        {item.message} {!item.pending && item.role === "user" && <small>✓</small>}
      </span>
    )}
  </div>
))

MessageItem.displayName = "MessageItem"
export default MessageItem
