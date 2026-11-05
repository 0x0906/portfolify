import { useState, useEffect, useRef } from "react"

export function useTemplateTheme(themeMode?: string) {
  const [isDark, setIsDark] = useState<boolean>(themeMode === "dark")
  const rootRef = useRef<HTMLDivElement>(null)

  // Sync with prop changes (e.g. from parent preview toolbar)
  useEffect(() => {
    if (themeMode) {
      setIsDark(themeMode === "dark")
    }
  }, [themeMode])

  // Sync ownerDocument.documentElement with current isDark
  useEffect(() => {
    const doc = rootRef.current?.ownerDocument || (typeof document !== "undefined" ? document : null)
    if (!doc) return
    if (isDark) {
      doc.documentElement.classList.add("dark")
      doc.documentElement.setAttribute("data-mode", "dark")
      doc.documentElement.style.colorScheme = "dark"
    } else {
      doc.documentElement.classList.remove("dark")
      doc.documentElement.setAttribute("data-mode", "light")
      doc.documentElement.style.colorScheme = "light"
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  return { isDark, setIsDark, toggleTheme, rootRef }
}
