import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Laptop, Check } from "lucide-react"
import { useTheme, type ThemeMode } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ]

  const CurrentIcon = theme === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] active:bg-[var(--color-paper-2)]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle color theme"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-36 rounded-[var(--radius-card)] border border-[var(--color-rule-2)] bg-[var(--color-paper-2)] text-[var(--color-ink)] py-1 z-[var(--z-dropdown)] text-xs shadow-[var(--shadow-card)]"
        >
          {options.map((opt) => {
            const Icon = opt.icon
            const isSelected = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] active:bg-[var(--color-paper-3)] disabled:opacity-50 disabled:pointer-events-none motion-reduce:transition-none ${
                  isSelected
                    ? "font-semibold text-[var(--color-ink)] bg-[var(--color-paper-3)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)]"
                }`}
                onClick={() => {
                  setTheme(opt.value)
                  setIsOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
