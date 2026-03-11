import { ArrowRightIcon } from "@radix-ui/react-icons"
import { type KeyboardEvent, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

type ChatInputProps = {
  disabled?: boolean
  onSend: (message: string) => void
}

const ChatInput = ({ disabled = false, onSend }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    if (disabled || !textareaRef.current) return
    const value = textareaRef.current.value.trim()
    if (!value) return
    onSend(value)
    textareaRef.current.value = ""
  }, [disabled, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        "w-full min-w-48 max-w-md",
        "flex items-end gap-2 bg-surface-elevated border border-border rounded-xl px-3 py-2 transition-colors",
        disabled ? "opacity-60 cursor-not-allowed" : "focus-within:border-flame/40",
      )}
    >
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        id="user-message"
        rows={1}
        className={cn(
          "input-auto-expand flex-1 bg-transparent border-none",
          "focus:ring-0 focus-visible:ring-0 focus:outline-none",
          "text-foreground placeholder:text-muted-foreground/60 text-base leading-relaxed",
          "disabled:cursor-not-allowed",
        )}
        placeholder={disabled ? "Waiting..." : "Say something..."}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        aria-label="Send message"
        className={cn(
          "shrink-0 p-1.5 mb-0.5 transition-colors rounded-md",
          disabled
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "text-muted-foreground hover:text-flame hover:bg-flame/5",
        )}
      >
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ChatInput
