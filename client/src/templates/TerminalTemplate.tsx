import { useState, useRef, useMemo } from "react"
import { useTemplateTheme } from "@/utils/useTemplateTheme"
import type { PortfolioData } from "@/types/portfolio"
import {
  Terminal,
  Github,
  ExternalLink,
  Download,
  Sun,
  Moon,
  Mail,
  MapPin,
  Copy,
  Check,
  CornerDownLeft,
  GraduationCap,
  Award,
  Menu,
  X,
} from "lucide-react"
import { ProjectImage } from "@/components/portfolio/ProjectImage"
import { sanitizeLink, sanitizeImg } from "@/utils/url"
import { getSkillProficiency } from "@/utils/skillProficiency"

interface CommandHistoryEntry {
  command: string
  output: string
  timestamp: string
}

export function TerminalTemplate({ data }: { data: PortfolioData }) {
  const {
    profile,
    projects = [],
    skills = [],
    experience = [],
    education = [],
    certifications = [],
    socialLinks = [],
    resumeUrl,
    themeSettings,
  } = data

  const { isDark, setIsDark, toggleTheme, rootRef } = useTemplateTheme(themeSettings?.themeMode)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([])
  const [selectedTech, setSelectedTech] = useState<string>("All")
  const terminalInputRef = useRef<HTMLInputElement>(null)

  const username = data.username || profile.fullName?.toLowerCase().replace(/\s+/g, "") || "developer"
  const validProfileImg = sanitizeImg(profile.profileImageUrl)

  // Collect unique technologies from projects
  const allTechnologies = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      const list = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === "string"
        ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : []
      list.forEach((t) => set.add(t))
    })
    return Array.from(set).slice(0, 8)
  }, [projects])

  // Filter projects by selected tech
  const filteredProjects = useMemo(() => {
    if (selectedTech === "All") return projects
    return projects.filter((p) => {
      const list = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === "string"
        ? p.technologies.split(",").map((t) => t.trim().toLowerCase())
        : []
      return list.includes(selectedTech.toLowerCase())
    })
  }, [projects, selectedTech])

  const handleCopyEmail = () => {
    if (!profile.publicContactEmail) return
    navigator.clipboard.writeText(profile.publicContactEmail).then(() => {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    })
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase()
    if (!trimmed) return

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    let reply = ""

    switch (trimmed) {
      case "help":
        reply = "Commands: about, projects, experience, skills, education, certifications, contact, resume, theme, clear"
        break
      case "whoami":
      case "about":
        reply = `${profile.fullName || "Developer"}${profile.professionalTitle ? ` · ${profile.professionalTitle}` : ""}`
        scrollToSection("about")
        break
      case "projects":
      case "ls":
        reply = `Viewing ${projects.length} projects.`
        scrollToSection("projects")
        break
      case "skills":
        reply = `Viewing ${skills.length} skills.`
        scrollToSection("skills")
        break
      case "experience":
        reply = `Viewing experience timeline.`
        scrollToSection("experience")
        break
      case "education":
      case "edu":
        reply = `Viewing education history.`
        scrollToSection("education")
        break
      case "certifications":
      case "certs":
        reply = `Viewing certifications.`
        scrollToSection("certifications")
        break
      case "contact":
        reply = profile.publicContactEmail || "Navigating to contact."
        scrollToSection("contact")
        break
      case "resume":
        if (resumeUrl) {
          reply = "Opening resume..."
          window.open(sanitizeLink(resumeUrl), "_blank")
        } else {
          reply = "Resume not provided."
        }
        break
      case "theme":
        setIsDark((prev) => !prev)
        reply = `Theme set to ${!isDark ? "dark" : "light"} mode.`
        break
      case "clear":
        setCommandHistory([])
        setCommandInput("")
        return
      default:
        reply = `command not found: ${cmdStr}. Type "help" for options.`
        break
    }

    setCommandHistory((prev) => [...prev.slice(-4), { command: cmdStr, output: reply, timestamp: now }])
    setCommandInput("")
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(commandInput)
  }

  const navActions = [
    { label: "about", action: () => executeCommand("about") },
    { label: "projects", action: () => executeCommand("projects") },
    { label: "experience", action: () => executeCommand("experience") },
    { label: "skills", action: () => executeCommand("skills") },
    { label: "contact", action: () => executeCommand("contact") },
  ]

  const navLinks = [
    { label: "about", href: "#about" },
    ...(projects.length > 0 ? [{ label: "projects", href: "#projects" }] : []),
    ...(experience.length > 0 ? [{ label: "experience", href: "#experience" }] : []),
    ...(skills.length > 0 ? [{ label: "skills", href: "#skills" }] : []),
    ...(education.length > 0 ? [{ label: "education", href: "#education" }] : []),
    ...(certifications.length > 0 ? [{ label: "certs", href: "#certifications" }] : []),
    { label: "contact", href: "#contact" },
  ]

  return (
    <div ref={rootRef} className={isDark ? "dark" : ""}>
      <div className="min-h-screen overflow-x-clip bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-mono transition-colors duration-200 selection:bg-emerald-500/20 dark:selection:bg-emerald-500/30 selection:text-emerald-700 dark:selection:text-emerald-300">
        
        {/* Window Chrome Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors duration-200">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block border border-rose-600/40" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block border border-amber-600/40" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block border border-emerald-600/40" />
              </div>
              <div className="flex items-center gap-2 truncate text-xs text-slate-600 dark:text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[120px] min-[380px]:max-w-[170px] sm:max-w-[200px] lg:max-w-none">
                  {username}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400" aria-label="Sections">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  ~/{item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
              {resumeUrl && (
                <a
                  href={sanitizeLink(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-xs"
                >
                  <Download className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Resume</span>
                </a>
              )}

              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="p-1.5 rounded border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              >
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-1.5 rounded border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Terminal Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                # Navigate:
              </div>
              <nav className="grid grid-cols-2 gap-1.5" aria-label="Mobile Navigation">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors text-xs flex items-center gap-1.5"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">&gt;</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
              {resumeUrl && (
                <div className="pt-1">
                  <a
                    href={sanitizeLink(resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>cat ./resume.pdf</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
          
          {/* Hero Profile Section */}
          <section id="about" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-7 shadow-sm transition-colors duration-200">
            <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-6 sm:gap-8 lg:gap-12">
              <div className="space-y-4 flex-1 min-w-0">
                <div className="space-y-1">
                  <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white break-words">
                    {profile.fullName || "Developer"}
                  </h1>
                  {profile.professionalTitle && (
                    <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-medium">
                      {profile.professionalTitle}
                    </p>
                  )}
                </div>

                {(profile.introduction || profile.biography) && (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words max-w-2xl">
                    {profile.introduction || profile.biography}
                  </p>
                )}

                {/* Location & Social Links */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                      <span>{profile.location}</span>
                    </span>
                  )}
                  {profile.publicContactEmail && (
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-300 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          <span className="truncate max-w-[150px] min-[380px]:max-w-[200px] sm:max-w-xs">{profile.publicContactEmail}</span>
                          <Copy className="h-2.5 w-2.5 text-slate-400 dark:text-slate-500 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={sanitizeLink(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      <Github className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                      <span>{link.platform}</span>
                      <ExternalLink className="h-2.5 w-2.5 text-slate-400 dark:text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Profile Avatar */}
              {validProfileImg && (
                <div className="shrink-0 mx-auto md:mx-0">
                  <img
                    src={validProfileImg}
                    alt={profile.fullName || "Profile"}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Interactive Command Shell */}
            <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Quick navigation">
                {navActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="px-2.5 py-1 text-xs rounded border transition-colors bg-slate-100 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                  >
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* CLI Input */}
              <form onSubmit={handleCommandSubmit} className="relative">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-within:border-emerald-500 dark:focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none text-xs sm:text-sm">&gt;</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Type a command or section name..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none font-mono"
                    aria-label="Terminal command input"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                    title="Send command"
                    aria-label="Submit command"
                  >
                    <CornerDownLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Command Output */}
              {commandHistory.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-mono">
                  {commandHistory.map((item, idx) => (
                    <div key={idx} className="flex items-baseline justify-between gap-2 min-w-0">
                      <div className="flex items-baseline gap-2 min-w-0 break-words">
                        <span className="text-emerald-600 dark:text-emerald-400 shrink-0">&gt;</span>
                        <span className="text-slate-600 dark:text-slate-400 shrink-0">{item.command}:</span>
                        <span className="text-slate-900 dark:text-slate-200 break-words min-w-0">{item.output}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 shrink-0">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section id="projects" className="space-y-5 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Projects
                </h2>

                {allTechnologies.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap text-xs">
                    <button
                      onClick={() => setSelectedTech("All")}
                      className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                        selectedTech === "All"
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      All
                    </button>
                    {allTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                          selectedTech === tech
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project, idx) => {
                  const techList = Array.isArray(project.technologies)
                    ? project.technologies
                    : typeof project.technologies === "string"
                    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                    : []

                  return (
                    <article
                      key={project.id || idx}
                      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                      <div>
                        {project.imageUrl && (
                          <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                            <ProjectImage
                              src={project.imageUrl}
                              alt={project.title}
                              title={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                            />
                          </div>
                        )}

                        <div className="p-4 space-y-2.5">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white break-words">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                              {project.description}
                            </p>
                          )}

                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {techList.map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs">
                          {project.liveUrl && (
                            <a
                              href={sanitizeLink(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={sanitizeLink(project.sourceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                            >
                              <Github className="h-3 w-3" />
                              <span>Source</span>
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <section id="experience" className="space-y-5 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pb-2 border-b border-slate-200 dark:border-slate-800">
                Experience
              </h2>

              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {exp.jobTitle}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          at {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-slate-500">
                            · {exp.employmentType}
                          </span>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-slate-500 shrink-0">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {exp.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-600" />
                        <span>{exp.location}</span>
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1 break-words">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section id="skills" className="space-y-5 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pb-2 border-b border-slate-200 dark:border-slate-800">
                Skills
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill, idx) => {
                  const prof = getSkillProficiency(skill)
                  const barsCount = Math.min(10, Math.max(1, Math.floor(prof / 10)))
                  const emptyCount = 10 - barsCount
                  const gauge = "█".repeat(barsCount) + "░".repeat(emptyCount)

                  return (
                    <div
                      key={skill.id || idx}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          {skill.level && <span>{skill.level}</span>}
                          <span>{prof}%</span>
                        </div>
                      </div>

                      {/* Monospace Level Gauge */}
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 tracking-tighter truncate select-none">
                        [{gauge}]
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <section
              id="education"
              className="scroll-mt-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition-colors duration-200"
            >
              {/* Terminal Window Chrome */}
              <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block border border-rose-600/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block border border-amber-600/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block border border-emerald-600/40" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 text-slate-800 dark:text-slate-200">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <h2 className="text-xs sm:text-sm font-bold tracking-tight truncate">
                      Education
                    </h2>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {education.length} {education.length === 1 ? "record" : "records"}
                </span>
              </div>

              {/* Terminal Content Body */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none">&gt;</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm break-words">
                          {edu.institution}
                        </span>
                      </div>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-slate-500 shrink-0 text-xs font-mono">
                          [{edu.startYear} – {edu.endYear || "Present"}]
                        </span>
                      )}
                    </div>
                    <div className="pl-3.5 space-y-1">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      </p>
                      {edu.mark && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Grade: {edu.mark}
                        </p>
                      )}
                      {edu.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
                          <span>{edu.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <section
              id="certifications"
              className="scroll-mt-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition-colors duration-200"
            >
              {/* Terminal Window Chrome */}
              <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block border border-rose-600/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block border border-amber-600/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block border border-emerald-600/40" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 text-slate-800 dark:text-slate-200">
                    <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <h2 className="text-xs sm:text-sm font-bold tracking-tight truncate">
                      Certifications
                    </h2>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {certifications.length} {certifications.length === 1 ? "record" : "records"}
                </span>
              </div>

              {/* Terminal Content Body */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none">&gt;</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm break-words">
                          {cert.name}
                        </span>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={sanitizeLink(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:border-slate-400 dark:hover:border-slate-600 text-xs shrink-0 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                        >
                          <span>Verify</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="pl-3.5 space-y-1 text-xs">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        Issuer: {cert.issuer}
                      </p>
                      {cert.issueDate && (
                        <p className="text-slate-500 font-mono">
                          Issued: [{cert.issueDate}]
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 scroll-mt-20 shadow-sm transition-colors duration-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pb-2 border-b border-slate-200 dark:border-slate-800">
              Contact
            </h2>

            <div className="space-y-4 max-w-xl">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Feel free to reach out for opportunities, questions, or collaboration.
              </p>

              {profile.publicContactEmail && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono truncate select-all">
                    {profile.publicContactEmail}
                  </div>
                  <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors shrink-0"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${profile.publicContactEmail}`}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} {profile.fullName || "Developer"}. All rights reserved.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
