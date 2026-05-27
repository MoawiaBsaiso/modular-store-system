import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // جلب الثيم المخزن مسبقاً أو استخدام الوضع الفاتح كافتراضي
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("modular-theme") as Theme) || "light";
    }
    return "light";
  });

  // مراقبة وتحديث الـ HTML DOM Class فور تغير الثيم
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("modular-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};