"use client"

import type { ReactNode } from "react"
import type { PIIMatch } from "@/lib/piiDetect"
import { cn } from "@/lib/utils"

type PIIPreviewBubbleProps = {
  message: string
  matches: PIIMatch[]
  onSend: () => void
  onDismissForever: () => void
  onCancel: () => void
}

const HighlightedMessage = ({ message, matches }: { message: string; matches: PIIMatch[] }) => {
  if (matches.length === 0) {
    return <span>{message}</span>
  }

  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of matches) {
    // Add text before the match
    if (match.start > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{message.slice(lastIndex, match.start)}</span>)
    }

    // Add the highlighted match
    parts.push(
      <mark
        key={`match-${match.start}`}
        className="bg-flame/20 text-flame px-0.5 rounded-sm font-medium"
        title={`Donnée sensible détectée`}
      >
        {match.value}
      </mark>,
    )

    lastIndex = match.end
  }

  // Add remaining text
  if (lastIndex < message.length) {
    parts.push(<span key={`text-${lastIndex}`}>{message.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

const PIIPreviewBubble = ({ message, matches, onSend, onDismissForever, onCancel }: PIIPreviewBubbleProps) => {
  return (
    <div className="flex flex-col items-end gap-1.5 animate-in slide-in-from-bottom-2 fade-in duration-200 container-chat-no-top">
      <div
        className={cn(
          "ml-auto max-w-[85%] px-4 py-2.5 rounded-2xl",
          "bg-flame/8 border-2 border-dashed border-flame/30",
        )}
      >
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          <HighlightedMessage message={message} matches={matches} />
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-flame/80">Données sensibles</span>
        <span className="text-muted-foreground/40">·</span>
        <button
          type="button"
          onClick={onSend}
          className="text-[10px] text-flame font-medium hover:text-flame-hover transition-colors"
        >
          Envoyer
        </button>
        <button
          type="button"
          onClick={onDismissForever}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          title="Ne plus afficher cet avertissement"
        >
          Ne plus avertir
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

export default PIIPreviewBubble
