import * as React from "react"

// ─── Types ─────────────────────────────────────────────────
export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

// ─── Component ─────────────────────────────────────────────

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, id, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(
      Boolean(props.value || props.defaultValue)
    )

    const isFloating = isFocused || hasValue

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>

        {/* Label فوق الـ input — بدون floating animation معقدة */}
        <label
          htmlFor={id}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: error
              ? "var(--salis-danger, #EF4444)"
              : isFocused
              ? "var(--salis-coral-start, #FF6B6B)"
              : "var(--salis-text-secondary, #6B5E4E)",
            transition: "color 150ms",
            userSelect: "none",
          }}
        >
          {label}
        </label>

        {/* Input */}
        <input
          ref={ref}
          id={id}
          onFocus={e => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            setHasValue(Boolean(e.target.value))
            props.onBlur?.(e)
          }}
          onChange={e => {
            setHasValue(Boolean(e.target.value))
            props.onChange?.(e)
          }}
          style={{
            width: "100%",
            padding: "11px 14px",
            background: "var(--salis-bg-surface, #F5EFE6)",
            border: `1px solid ${
              error
                ? "var(--salis-danger, #EF4444)"
                : isFocused
                ? "var(--salis-coral-start, #FF6B6B)"
                : "var(--salis-border, #E8DDD0)"
            }`,
            borderRadius: "var(--salis-radius-md, 12px)",
            fontSize: "14px",
            color: "var(--salis-text-primary, #1A1A2E)",
            outline: "none",
            transition: "border-color 150ms",
            fontFamily: "inherit",
          }}
          {...props}
        />

        {/* Error أو Hint */}
        {error && (
          <p style={{
            fontSize: "12px",
            color: "var(--salis-danger, #EF4444)",
            margin: 0,
          }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{
            fontSize: "12px",
            color: "var(--salis-text-muted, #9B8C7C)",
            margin: 0,
          }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = "InputField"
