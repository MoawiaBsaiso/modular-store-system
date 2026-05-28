import * as React from "react"

// ─── Types ─────────────────────────────────────────────────
export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "coral"
  size?: "sm" | "md"
  children: React.ReactNode
  style?: React.CSSProperties
}

// ─── Styles ────────────────────────────────────────────────
const variantStyles: Record<NonNullable<BadgeProps["variant"]>, React.CSSProperties> = {
  default: {
    background: "var(--salis-bg-surface, #F5EFE6)",
    color: "var(--salis-text-secondary, #6B5E4E)",
    border: "1px solid var(--salis-border, #E8DDD0)",
  },
  success: {
    background: "#DCFCE7",
    color: "#166534",
    border: "1px solid #BBF7D0",
  },
  warning: {
    background: "#FEF9C3",
    color: "#854D0E",
    border: "1px solid #FEF08A",
  },
  danger: {
    background: "#FEE2E2",
    color: "#991B1B",
    border: "1px solid #FECACA",
  },
  coral: {
    background: "linear-gradient(135deg, var(--salis-coral-start, #FF6B6B), var(--salis-coral-end, #FF8E53))",
    color: "#fff",
    border: "none",
  },
}

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, React.CSSProperties> = {
  sm: { fontSize: "10px", padding: "2px 8px" },
  md: { fontSize: "12px", padding: "3px 10px" },
}

// ─── Component ─────────────────────────────────────────────
export function Badge({ variant = "default", size = "md", children, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 600,
        borderRadius: "99px",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
