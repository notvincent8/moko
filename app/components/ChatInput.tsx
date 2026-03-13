import { ArrowRightIcon } from "@radix-ui/react-icons"
import { type KeyboardEvent, useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type ChatInputProps = {
  disabled?: boolean
  onSend: (message: string) => void
}

const MAX_CHAR_COUNT = 185

const ChatInput = ({ disabled = false, onSend }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(0)
  const [hasHovered, setHasHovered] = useState(false)

  const handleSubmit = useCallback(() => {
    if (disabled || !textareaRef.current) return
    const value = textareaRef.current.value.trim()
    if (!value) return
    onSend(value)
    textareaRef.current.value = ""
    setCharCount(0)
  }, [disabled, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleMouseEnter = () => {
    if (!hasHovered) {
      setHasHovered(true)
    }
  }
  return (
    <div
      className={cn(
        "w-full min-w-48 max-w-lg flex items-end gap-2 bg-surface-elevated border border-border rounded-xl px-3 py-2 transition-colors relative pb-4",
        disabled ? "opacity-60 cursor-not-allowed" : "focus-within:border-flame/40",
        !hasHovered ? "motion-safe:animate-textarea-pulse" : null,
      )}
    >
      <textarea
        ref={textareaRef}
        onInput={(e) => setCharCount(e.currentTarget.value.length)}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={MAX_CHAR_COUNT}
        id="user-message"
        rows={1}
        className={cn(
          "input-auto-expand flex-1 bg-transparent border-none",
          "focus:ring-0 focus-visible:ring-0 focus:outline-none",
          "text-foreground placeholder:text-muted-foreground/60 text-base leading-relaxed",
          "disabled:cursor-not-allowed ",
        )}
        placeholder={disabled ? "En attente..." : "Écris quelque chose..."}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        aria-label="Send message"
        className={cn(
          "shrink-0 p-1.5 mb-2 transition-colors rounded-md",
          disabled
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "text-muted-foreground hover:text-flame hover:bg-flame/5",
          !hasHovered ? "motion-safe:animate-bounce" : null,
        )}
      >
        <ArrowRightIcon className="w-4 h-4" />
      </button>
      <small
        className={cn(
          "text-xs select-none pointer-none absolute right-2 bottom-1 ",
          charCount >= MAX_CHAR_COUNT * 0.9 ? "text-flame" : "text-muted-foreground/80",
        )}
      >
        {charCount}/{MAX_CHAR_COUNT}
      </small>
    </div>
  )
}

export default ChatInput
