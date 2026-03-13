import { DownloadIcon } from "@radix-ui/react-icons"
import * as Toggle from "@radix-ui/react-toggle"
import * as Tooltip from "@radix-ui/react-tooltip"
import { type FocusEvent, type MouseEvent, memo, type ReactNode, useCallback } from "react"
import { BugOffIcon, BugOnIcon } from "@/app/components/icons/BugIcon"
import { cn } from "@/lib/utils"

type HistoryToolbarProps = {
  debug?: {
    show: boolean
    onToggle: (value: boolean) => void
  }
  onDownload?: () => void
  className?: string
}
const preventFocus = (e: FocusEvent) => e.preventDefault()

// Moko tooltip - warm editorial aesthetic, ink/cream contrast
const MokoTooltip = memo(({ children, label }: { children: ReactNode; label: string }) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild onFocus={preventFocus}>
      {children}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        side="left"
        sideOffset={12}
        hideWhenDetached
        avoidCollisions
        className={cn(
          "z-100 px-2.5 py-1.5",
          "bg-ink dark:bg-cream",
          "rounded-md",
          "shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
        )}
      >
        <span className="text-[11px] font-medium tracking-wide text-cream dark:text-ink">{label}</span>
        <Tooltip.Arrow className="fill-ink dark:fill-cream" width={8} height={4} />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
))
MokoTooltip.displayName = "MokoTooltip"

const DebugToggle = memo(
  ({ showDebug, onPressedChange }: { showDebug: boolean; onPressedChange: (value: boolean) => void }) => (
    <MokoTooltip label={showDebug ? "Debug ON" : "Debug OFF"}>
      <Toggle.Root
        pressed={showDebug}
        onPressedChange={onPressedChange}
        aria-label={showDebug ? "Hide debug messages" : "Show debug messages"}
        data-state={showDebug ? "on" : "off"}
        className="toolbar-button data-[state=on]:bg-flame/10 data-[state=on]:border-flame data-[state=on]:text-flame"
      >
        {showDebug ? <BugOnIcon className="w-4 h-4" /> : <BugOffIcon className="w-4 h-4" />}
      </Toggle.Root>
    </MokoTooltip>
  ),
)
DebugToggle.displayName = "DebugToggle"

const DownloadButton = memo(({ onClick }: { onClick?: () => void }) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      onClick?.()
    },
    [onClick],
  )

  return (
    <MokoTooltip label="Download">
      <button type="button" onClick={handleClick} aria-label="Download history" className="toolbar-button">
        <DownloadIcon className="w-4 h-4" />
      </button>
    </MokoTooltip>
  )
})
DownloadButton.displayName = "DownloadButton"

const HistoryToolbar = ({ debug, onDownload, className }: HistoryToolbarProps) => {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={100}>
      <div
        className={cn(
          "flex gap-1 p-1.5 rounded-xl",
          "bg-surface-elevated",
          "border border-border",
          "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
          // Responsive: horizontal on mobile, vertical on desktop
          "flex-row sm:flex-col",
          className,
        )}
      >
        <DownloadButton onClick={onDownload} />
        {debug && <DebugToggle showDebug={debug.show} onPressedChange={debug.onToggle} />}
      </div>
    </Tooltip.Provider>
  )
}

export default HistoryToolbar
