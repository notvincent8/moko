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
      className={cn("rounded-lg p-4 max-w-100 w-full ml-auto wrap-break-word", className)}
    >
      {children}
    </article>
  )
}

export default BubbleBase
