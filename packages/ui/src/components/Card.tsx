import * as React from "react"

// ─── Types ─────────────────────────────────────────────────
export interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  padding?: "none" | "sm" | "md" | "lg"
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

// ─── Component ─────────────────────────────────────────────
export function Card({
  children,
  hoverable = false,
  padding = "md",
  style,
  className,
  onClick,
}: CardProps) {
  const paddingMap = {
    none: "0",
    sm: "12px",
    md: "20px",
    lg: "28px",
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: "var(--salis-bg-base, #FFFBF7)",
        border: "1px solid var(--salis-border, #E8DDD0)",
        borderRadius: "var(--salis-radius-lg, 16px)",
        padding: paddingMap[padding],
        cursor: onClick ? "pointer" : undefined,
        transition: hoverable
          ? "transform 250ms var(--salis-ease-out, cubic-bezier(0.16,1,0.3,1)), box-shadow 250ms var(--salis-ease-out, cubic-bezier(0.16,1,0.3,1))"
          : undefined,
        ...style,
      }}
      onMouseEnter={e => {
        if (!hoverable) return
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(26,26,46,0.1)"
      }}
      onMouseLeave={e => {
        if (!hoverable) return
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {children}
    </div>
  )
}
