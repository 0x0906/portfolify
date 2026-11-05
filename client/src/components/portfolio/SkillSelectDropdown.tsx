import { useState, useRef, useEffect, useMemo } from "react"
import { ChevronDown, Check, Plus } from "lucide-react"
import { cn } from "@/utils/cn"

export const PRESET_SKILLS: string[] = [
  "Angular",
  "AWS",
  "Azure",
  "C#",
  "C++",
  "CI/CD",
  "Django",
  "Docker",
  "Elasticsearch",
  "Express.js",
  "FastAPI",
  "Figma",
  "Firebase",
  "Flutter",
  "Git & GitHub",
  "Go",
  "Google Cloud",
  "GraphQL",
  "gRPC",
  "HTML & CSS",
  "Java",
  "JavaScript",
  "Jest",
  "Kotlin",
  "Kubernetes",
  "Linux",
  "MongoDB",
  "MySQL",
  "NestJS",
  "Next.js",
  "Nginx",
  "Node.js",
  "PHP",
  "PostgreSQL",
  "Postman",
  "Prisma",
  "Python",
  "React Native",
  "React.js",
  "Redis",
  "Redux",
  "REST APIs",
  "Ruby",
  "Rust",
  "SQL",
  "SQLite",
  "Supabase",
  "Svelte",
  "Swift",
  "Tailwind CSS",
  "Terraform",
  "TypeScript",
  "UI/UX Design",
  "Vite",
  "Vitest",
  "Vue.js",
  "Zustand",
]

interface SkillSelectDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SkillSelectDropdown({
  value,
  onChange,
  placeholder = "Select or type a skill...",
  className,
}: SkillSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(value || "")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep search in sync when value changes from outside
  useEffect(() => {
    setSearch(value || "")
  }, [value])

  // Close on outside click and commit typed value if valid
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (search.trim() && search.trim() !== value) {
          onChange(search.trim())
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [search, value, onChange])

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return PRESET_SKILLS
    return PRESET_SKILLS.filter((s) => s.toLowerCase().includes(q))
  }, [search])

  const exactMatch = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return PRESET_SKILLS.some((s) => s.toLowerCase() === q)
  }, [search])

  const handleSelect = (skillName: string) => {
    onChange(skillName)
    setSearch(skillName)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setSearch(next)
    onChange(next)
    if (!isOpen) setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === "Enter") {
      e.preventDefault()
      const firstSkill = filteredSkills[0]
      if (firstSkill && !exactMatch && search.trim()) {
        handleSelect(firstSkill)
      } else {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-8 rounded-md border border-input bg-background pl-3 pr-8 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              inputRef.current?.focus()
            }
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
          aria-label="Toggle skills dropdown"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isOpen && "rotate-180 text-foreground"
            )}
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-50 zoom-in-95 duration-150 overflow-hidden"
        >
          {/* Flat, clean scrollable dropdown list */}
          <div className="max-h-56 overflow-y-auto p-1 space-y-0.5 text-xs overscroll-contain">
            {/* Custom Skill Option if user typed something not in preset */}
            {search.trim() && !exactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(search.trim())}
                className="w-full text-left px-2.5 py-1.5 rounded-sm bg-accent/40 hover:bg-accent text-accent-foreground font-medium flex items-center justify-between gap-2 transition-colors mb-0.5"
              >
                <span className="truncate flex items-center gap-1.5">
                  <Plus className="h-3 w-3 text-primary shrink-0" />
                  <span>Use: <strong>"{search.trim()}"</strong></span>
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono shrink-0">Custom</span>
              </button>
            )}

            {filteredSkills.length === 0 && !search.trim() && (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No skills available.
              </div>
            )}

            {filteredSkills.length === 0 && search.trim() && exactMatch && (
              <div className="p-2 text-center text-xs text-muted-foreground">
                No matching skills.
              </div>
            )}

            {filteredSkills.map((skillName) => {
              const isSelected = value.trim().toLowerCase() === skillName.toLowerCase()
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => handleSelect(skillName)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-sm flex items-center justify-between text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted/80 text-foreground"
                  )}
                >
                  <span className="truncate">{skillName}</span>
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
