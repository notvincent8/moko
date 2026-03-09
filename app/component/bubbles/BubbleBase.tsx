import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

export type BubbleBaseProps = ComponentPropsWithoutRef<"article"> & {
  className?: string
  children: ReactNode
  busy: boolean
}

const BubbleBase = ({ busy, className, children, ...props }: BubbleBaseProps) => {
  return (
    <article
      aria-atomic="true"
      aria-busy={busy}
      {...props}
      className={cn("rounded-lg p-4 max-w-xs", className)}
      style={{ contentVisibility: "auto" }}
    >
      {children}
    </article>
  )
}

export default BubbleBase
