import * as React from "react"
import { useTheme } from "./ThemeProvider.js"

// ─── Types ─────────────────────────────────────────────────
export interface ThemeToggleProps {
  size?: "sm" | "md"
  style?: React.CSSProperties
}

// ─── Component ─────────────────────────────────────────────
export function ThemeToggle({ size = "md", style }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  const dimension = size === "sm" ? "32px" : "38px"
  const iconSize = size === "sm" ? "14px" : "17px"

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الداكن"}
      title={isDark ? "وضع فاتح" : "وضع داكن"}
      style={{
        width: dimension,
        height: dimension,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--salis-bg-surface, #F5EFE6)",
        border: "1px solid var(--salis-border, #E8DDD0)",
        borderRadius: "var(--salis-radius-sm, 8px)",
        cursor: "pointer",
        fontSize: iconSize,
        transition: "background 150ms, border-color 150ms",
        outline: "none",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--salis-bg-muted, #EDE5D8)")}
      onMouseLeave={e => (e.currentTarget.style.background = "var(--salis-bg-surface, #F5EFE6)")}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  )
}
