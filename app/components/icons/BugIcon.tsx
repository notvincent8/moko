type IconProps = { className?: string }

export const BugOffIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 15 15" fill="none" className={className} aria-hidden="true">
    <ellipse cx="7.5" cy="9" rx="3" ry="3.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="7.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 7h2M11 7h2M2.5 11l1.5-1M12.5 11l-1.5-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

export const BugOnIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 15 15" fill="none" className={className} aria-hidden="true">
    <ellipse cx="7.5" cy="9" rx="3" ry="3.5" fill="currentColor" />
    <circle cx="7.5" cy="4.5" r="2" fill="currentColor" />
    <path d="M2 7h2M11 7h2M2.5 11l1.5-1M12.5 11l-1.5-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
