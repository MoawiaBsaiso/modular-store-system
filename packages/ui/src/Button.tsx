import * as React from "react"

// ─── Types ─────────────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  fullWidth?: boolean
}

// ─── Styles ────────────────────────────────────────────────
// استخدام CSS variables من Salis Design Tokens
// بدل hardcoded colors أو Tailwind classes
const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, var(--salis-coral-start, #FF6B6B), var(--salis-coral-end, #FF8E53))",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "var(--salis-bg-surface, #F5EFE6)",
    color: "var(--salis-text-primary, #1A1A2E)",
    border: "1px solid var(--salis-border, #E8DDD0)",
  },
  danger: {
    background: "var(--salis-danger, #EF4444)",
    color: "#fff",
    border: "none",
  },
  outline: {
    background: "transparent",
    color: "var(--salis-text-primary, #1A1A2E)",
    border: "1px solid var(--salis-border, #E8DDD0)",
  },
  ghost: {
    background: "transparent",
    color: "var(--salis-text-secondary, #6B5E4E)",
    border: "none",
  },
}

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, React.CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: "12px", borderRadius: "var(--salis-radius-sm, 8px)" },
  md: { padding: "10px 20px", fontSize: "14px", borderRadius: "var(--salis-radius-md, 12px)" },
  lg: { padding: "14px 28px", fontSize: "15px", borderRadius: "var(--salis-radius-md, 12px)" },
}

// ─── Component ─────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontWeight: 600,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
      transition: "opacity 150ms, transform 150ms",
      width: fullWidth ? "100%" : undefined,
      outline: "none",
      fontFamily: "inherit",
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={baseStyle}
        onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.opacity = "0.88" }}
        onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.opacity = "1" }}
        onMouseDown={e => { if (!isDisabled) e.currentTarget.style.transform = "scale(0.97)" }}
        onMouseUp={e => { e.currentTarget.style.transform = "scale(1)" }}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    )
  }
)

Button.displayName = "Button"

// ─── Spinner ───────────────────────────────────────────────
// مكون مستقل — لا يعتمد على أي library خارجية
function Spinner() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "salis-spin 0.7s linear infinite" }}
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes salis-spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  )
}
