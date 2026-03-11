import { cn } from "@/lib/utils"

type DisclaimerProps = {
  className?: string
}

const Disclaimer = ({ className }: DisclaimerProps) => {
  return (
    <p
      className={cn(
        "text-[10px] text-muted-foreground/60 select-none tracking-wide uppercase",
        className,
      )}
    >
      <span aria-hidden="true">~</span> IA · Pas un professionnel
    </p>
  )
}

export default Disclaimer
