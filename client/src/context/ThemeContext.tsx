import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeMode
  resolvedTheme: "light" | "dark"
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system"
    const saved = localStorage.getItem("portfolify_theme") as ThemeMode | null
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved
    }
    return "system"
  })

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    const saved = localStorage.getItem("portfolify_theme")
    if (saved === "dark") return "dark"
    if (saved === "light") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches)
      const root = document.documentElement
      if (isDark) {
        root.classList.add("dark")
        root.setAttribute("data-mode", "dark")
        root.style.colorScheme = "dark"
        setResolvedTheme("dark")
      } else {
        root.classList.remove("dark")
        root.setAttribute("data-mode", "light")
        root.style.colorScheme = "light"
        setResolvedTheme("light")
      }
    }

    applyTheme()

    const handleChange = () => {
      if (theme === "system") {
        applyTheme()
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem("portfolify_theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
