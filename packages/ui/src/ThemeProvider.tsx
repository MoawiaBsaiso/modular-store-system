import * as React from "react"

// ─── Types ─────────────────────────────────────────────────
export type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// ─── Context ───────────────────────────────────────────────
const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

// ─── Provider ──────────────────────────────────────────────
// المشكلة القديمة: كان يستخدم localStorage مباشرة في useState initializer
// هاد يكسر Next.js لأن SSR يشغل الكود على السيرفر وlocalStorage غير موجود هناك
// الحل: نتحقق من window قبل أي استخدام لـ localStorage
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // نبدأ دائماً بـ light على السيرفر — بعدين نصحح على الـ client
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  // هاد يشتغل فقط على الـ client بعد الـ hydration
  React.useEffect(() => {
    const stored = localStorage.getItem("salis-theme") as Theme | null
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    setThemeState(stored ?? preferred)
    setMounted(true)
  }, [])

  // تطبيق الثيم على الـ html element
  React.useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("salis-theme", theme)
  }, [theme, mounted])

  const toggleTheme = React.useCallback(() => {
    setThemeState(prev => (prev === "light" ? "dark" : "light"))
  }, [])

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
