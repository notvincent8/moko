import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

type ChatInputProps = {
  disabled?: boolean
  onSend: (message: string | undefined) => void
}

const ChatInput = ({ disabled = false, onSend }: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(() => {
    if (disabled || !inputRef.current) return
    const value = inputRef.current.value.trim()
    if (!value) return
    onSend(value)
    inputRef.current.value = ""
  }, [disabled, onSend])

  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-surface-elevated border border-border rounded-lg px-3 py-2.5 transition-colors",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "focus-within:border-flame/40"
      )}
    >
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        ref={inputRef}
        type="text"
        id="user-message"
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/60 text-base disabled:cursor-not-allowed"
        placeholder={disabled ? "Waiting..." : "Say something..."}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        aria-label="Send message"
        className={cn(
          "p-1 transition-colors",
          disabled
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "text-muted-foreground hover:text-flame"
        )}
      >
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ChatInput
