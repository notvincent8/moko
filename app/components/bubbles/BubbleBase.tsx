import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

export type BubbleBaseProps = ComponentPropsWithoutRef<"article"> & {
  className?: string
  children: ReactNode
  busy: boolean
  debug?: boolean
}

const BubbleBase = ({ busy, className, children, debug, ...props }: BubbleBaseProps) => {
  return (
    <article
      aria-atomic="true"
      aria-busy={busy}
      {...props}
      className={cn("relative rounded-lg p-4 max-w-100 w-full ml-auto wrap-break-word", className)}
    >
      {debug && <div className="absolute top-0 right-0 text-xs text-flame px-1 rounded-bl">Debug</div>}
      {children}
    </article>
  )
}

export default BubbleBase
