import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/utils/cn"

interface LevelSelectDropdownProps {
  value?: "Beginner" | "Intermediate" | "Advanced" | ""
  onChange: (level: "Beginner" | "Intermediate" | "Advanced") => void
  placeholder?: string
  className?: string
}

const LEVELS: ("Beginner" | "Intermediate" | "Advanced")[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
]

export function LevelSelectDropdown({
  value,
  onChange,
  placeholder = "Select Level",
  className,
}: LevelSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (lvl: "Beginner" | "Intermediate" | "Advanced") => {
    onChange(lvl)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative w-full sm:w-36 shrink-0", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 rounded-md border border-input bg-background pl-3 pr-8 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-left flex items-center justify-between text-foreground"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-foreground"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-50 zoom-in-95 duration-150 overflow-hidden"
        >
          <div className="p-1 space-y-0.5 text-xs">
            {LEVELS.map((lvl) => {
              const isSelected = value === lvl
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelect(lvl)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-sm flex items-center justify-between text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted/80 text-foreground"
                  )}
                >
                  <span>{lvl}</span>
                  {isSelected && (
                    <Check className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
