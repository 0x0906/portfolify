import { useState, useMemo } from "react"
import { useTemplateTheme } from "@/utils/useTemplateTheme"
import type { PortfolioData } from "@/types/portfolio"
import {
  ArrowUpRight,
  Github,
  Download,
  Sun,
  Moon,
  Mail,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Layers,
  Menu,
  X,
} from "lucide-react"
import { ProjectImage } from "@/components/portfolio/ProjectImage"
import { sanitizeLink, sanitizeImg } from "@/utils/url"
import { getSkillProficiency } from "@/utils/skillProficiency"

// Curated 5-tone vibrant palette that carries each other
// 1. Golden Yellow (#FFDE59)
// 2. Coral Blossom (#FF6B6B)
// 3. Neo Mint (#1DD1A1)
// 4. Royal Iris (#6C5CE7 / #A29BFE)
// 5. Electric Sky (#54A0FF / #38BDF8)
const SKILL_THEMES = [
  {
    cardBg: "bg-[#FFF9DB] dark:bg-[#1E1C14]",
    borderColor: "border-black dark:border-[#FFDE59]",
    shadowColor: "shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#000]",
    textColor: "text-amber-950 dark:text-amber-200",
    barTrack: "bg-white/80 dark:bg-black/50 border-black dark:border-[#FFDE59]/50",
    barFill: "bg-[#FFDE59]",
    badgeBg: "bg-[#FFDE59] text-black border-black",
  },
  {
    cardBg: "bg-[#FFF0F0] dark:bg-[#221618]",
    borderColor: "border-black dark:border-[#FF6B6B]",
    shadowColor: "shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#000]",
    textColor: "text-rose-950 dark:text-rose-200",
    barTrack: "bg-white/80 dark:bg-black/50 border-black dark:border-[#FF6B6B]/50",
    barFill: "bg-[#FF6B6B]",
    badgeBg: "bg-[#FF6B6B] text-white border-black",
  },
  {
    cardBg: "bg-[#EBFBEE] dark:bg-[#132019]",
    borderColor: "border-black dark:border-[#1DD1A1]",
    shadowColor: "shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#000]",
    textColor: "text-emerald-950 dark:text-emerald-200",
    barTrack: "bg-white/80 dark:bg-black/50 border-black dark:border-[#1DD1A1]/50",
    barFill: "bg-[#1DD1A1]",
    badgeBg: "bg-[#1DD1A1] text-black border-black",
  },
  {
    cardBg: "bg-[#F3F0FF] dark:bg-[#1A1728]",
    borderColor: "border-black dark:border-[#A29BFE]",
    shadowColor: "shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#000]",
    textColor: "text-purple-950 dark:text-purple-200",
    barTrack: "bg-white/80 dark:bg-black/50 border-black dark:border-[#A29BFE]/50",
    barFill: "bg-[#6C5CE7] dark:bg-[#A29BFE]",
    badgeBg: "bg-[#6C5CE7] text-white border-black",
  },
  {
    cardBg: "bg-[#E7F5FF] dark:bg-[#121E2A]",
    borderColor: "border-black dark:border-[#54A0FF]",
    shadowColor: "shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#000]",
    textColor: "text-blue-950 dark:text-blue-200",
    barTrack: "bg-white/80 dark:bg-black/50 border-black dark:border-[#54A0FF]/50",
    barFill: "bg-[#54A0FF]",
    badgeBg: "bg-[#54A0FF] text-black border-black",
  },
]

export function BrutalistTemplate({ data }: { data: PortfolioData }) {
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

  const { isDark, toggleTheme, rootRef } = useTemplateTheme(themeSettings?.themeMode)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const validProfileImg = sanitizeImg(profile.profileImageUrl)

  // Unique technologies from projects for interactive filtering
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

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects
    return projects.filter((p) => {
      const list = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === "string"
        ? p.technologies.split(",").map((t) => t.trim().toLowerCase())
        : []
      return list.includes(selectedCategory.toLowerCase())
    })
  }, [projects, selectedCategory])

  const handleCopyEmail = () => {
    if (!profile.publicContactEmail) return
    navigator.clipboard.writeText(profile.publicContactEmail).then(() => {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    })
  }

  const navLinks = [
    { label: "About", href: "#about", hoverColor: "hover:bg-[#FFDE59] hover:text-black" },
    ...(projects.length > 0 ? [{ label: "Projects", href: "#projects", hoverColor: "hover:bg-[#FF6B6B] hover:text-white" }] : []),
    ...(experience.length > 0 ? [{ label: "Experience", href: "#experience", hoverColor: "hover:bg-[#6C5CE7] hover:text-white" }] : []),
    ...(skills.length > 0 ? [{ label: "Skills", href: "#skills", hoverColor: "hover:bg-[#1DD1A1] hover:text-black" }] : []),
    ...(education.length > 0 ? [{ label: "Education", href: "#education", hoverColor: "hover:bg-[#54A0FF] hover:text-black" }] : []),
    ...(certifications.length > 0 ? [{ label: "Certifications", href: "#certifications", hoverColor: "hover:bg-[#FFDE59] hover:text-black" }] : []),
    { label: "Contact", href: "#contact", hoverColor: "hover:bg-[#FFDE59] hover:text-black" },
  ]

  return (
    <div ref={rootRef} className={isDark ? "dark" : ""}>
      <div className="min-h-screen overflow-x-clip bg-[#FAF7F2] dark:bg-[#0F1117] text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-150 selection:bg-[#FFDE59] selection:text-black">
        
        {/* Sticky Neo-Brutalist Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#161824]/95 backdrop-blur-sm border-b-[3px] border-black dark:border-white px-4 sm:px-6 py-3 shadow-[0_3px_0_0_#000] dark:shadow-[0_3px_0_0_#000]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            
            <a
              href="#about"
              className="inline-flex items-center px-3 py-1 bg-[#FFDE59] text-black border-2 border-black font-black text-sm sm:text-base tracking-tight uppercase shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] transition-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black truncate max-w-[130px] min-[380px]:max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-[200px]"
            >
              {profile.fullName || "Portfolio"}
            </a>

            <nav className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-wider" aria-label="Sections">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 bg-white dark:bg-[#1F2233] text-zinc-900 dark:text-zinc-100 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white shrink-0 ${item.hoverColor}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {resumeUrl && (
                <a
                  href={sanitizeLink(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Resume</span>
                </a>
              )}

              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="p-1.5 bg-[#1DD1A1] hover:bg-[#10B981] text-black border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
              >
                {isDark ? <Sun className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-1.5 bg-[#FFDE59] text-black border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-3 mt-3 border-t-[3px] border-black dark:border-white space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Navigation">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 bg-white dark:bg-[#1F2233] text-zinc-900 dark:text-zinc-100 border-2 border-black dark:border-white font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] text-center ${item.hoverColor}`}
                  >
                    {item.label}
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
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-2 border-black dark:border-white font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_0_#000] transition-colors"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Download Resume</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 sm:space-y-16">
          
          {/* Hero Section */}
          <section
            id="about"
            className="scroll-mt-20 p-6 sm:p-10 bg-white dark:bg-[#181A26] border-[3px] border-black dark:border-white shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#000] rounded-sm"
          >
            <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-6 sm:gap-8 lg:gap-12">
              <div className="space-y-4 flex-1 min-w-0">
                
                {profile.professionalTitle && (
                  <div className="inline-block px-3 py-1 bg-[#FFDE59] text-black border-2 border-black font-black text-xs sm:text-sm uppercase tracking-wide shadow-[2px_2px_0_0_#000]">
                    {profile.professionalTitle}
                  </div>
                )}

                <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] uppercase break-words text-zinc-950 dark:text-zinc-50">
                  {profile.fullName || "Your Name"}
                </h1>

                {(profile.introduction || profile.biography) && (
                  <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium break-words max-w-2xl">
                    {profile.introduction || profile.biography}
                  </p>
                )}

                {/* Location & Social Pills (Carrying each other in vibrant harmony) */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-black">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F0FF] dark:bg-[#6C5CE7]/30 text-purple-950 dark:text-purple-200 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] uppercase max-w-full">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6C5CE7] dark:text-[#A29BFE]" aria-hidden="true" />
                      <span className="truncate">{profile.location}</span>
                    </span>
                  )}

                  {profile.publicContactEmail && (
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EBFBEE] dark:bg-[#1DD1A1]/30 text-emerald-950 dark:text-emerald-200 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:bg-[#1DD1A1] hover:text-black dark:hover:bg-[#1DD1A1] dark:hover:text-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white uppercase max-w-full"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[160px] min-[380px]:max-w-[200px] sm:max-w-xs md:max-w-md">{profile.publicContactEmail}</span>
                          <Copy className="h-3 w-3 shrink-0 ml-1 opacity-70" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E7F5FF] dark:bg-[#54A0FF]/30 text-blue-950 dark:text-blue-200 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:bg-[#54A0FF] hover:text-black dark:hover:bg-[#54A0FF] dark:hover:text-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white uppercase"
                    >
                      <Github className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{link.platform}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Profile Avatar with Chunky Multi-Layer Neo-Brutalist Frame */}
              {validProfileImg && (
                <div className="shrink-0 mx-auto lg:mx-0">
                  <div className="p-2 bg-[#FF6B6B] border-[3px] border-black dark:border-white shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#000]">
                    <img
                      src={validProfileImg}
                      alt={profile.fullName || "Profile"}
                      width="128"
                      height="128"
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover border-2 border-black dark:border-white block bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Featured Projects Section */}
          {projects && projects.length > 0 && (
            <section id="projects" className="space-y-6 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-[3px] border-black dark:border-white">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-[#FF6B6B] text-white border-2 border-black dark:border-white shadow-[1px_1px_0_0_#000]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                    Projects
                  </h2>
                </div>

                {allTechnologies.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap text-xs font-black">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`px-3 py-1 border-2 border-black dark:border-white uppercase tracking-wider transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
                        selectedCategory === "All"
                          ? "bg-[#FFDE59] text-black shadow-[3px_3px_0_0_#000] translate-x-[-1px] translate-y-[-1px]"
                          : "bg-white dark:bg-[#1E202E] text-zinc-800 dark:text-zinc-200 shadow-[2px_2px_0_0_#000] hover:bg-[#FFF9DB] dark:hover:bg-[#FFDE59]/20"
                      }`}
                    >
                      All
                    </button>
                    {allTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedCategory(tech)}
                        className={`px-3 py-1 border-2 border-black dark:border-white uppercase tracking-wider transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
                          selectedCategory === tech
                            ? "bg-[#FFDE59] text-black shadow-[3px_3px_0_0_#000] translate-x-[-1px] translate-y-[-1px]"
                            : "bg-white dark:bg-[#1E202E] text-zinc-800 dark:text-zinc-200 shadow-[2px_2px_0_0_#000] hover:bg-[#FFF9DB] dark:hover:bg-[#FFDE59]/20"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project, idx) => {
                  const techList = Array.isArray(project.technologies)
                    ? project.technologies
                    : typeof project.technologies === "string"
                    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                    : []

                  // Cycle through 5 harmonious chip themes
                  const chipPalettes = [
                    "bg-[#FFF9DB] dark:bg-[#FFDE59]/20 text-amber-950 dark:text-amber-200 border-amber-900/30 dark:border-[#FFDE59]/40",
                    "bg-[#EBFBEE] dark:bg-[#1DD1A1]/20 text-emerald-950 dark:text-emerald-200 border-emerald-900/30 dark:border-[#1DD1A1]/40",
                    "bg-[#F3F0FF] dark:bg-[#6C5CE7]/25 text-purple-950 dark:text-purple-200 border-purple-900/30 dark:border-[#A29BFE]/40",
                    "bg-[#E7F5FF] dark:bg-[#54A0FF]/20 text-blue-950 dark:text-blue-200 border-blue-900/30 dark:border-[#54A0FF]/40",
                    "bg-[#FFF0F0] dark:bg-[#FF6B6B]/20 text-rose-950 dark:text-rose-200 border-rose-900/30 dark:border-[#FF6B6B]/40",
                  ]

                  return (
                    <article
                      key={project.id || idx}
                      className="group bg-white dark:bg-[#181A26] border-[3px] border-black dark:border-white shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#000] transition-[transform,box-shadow] flex flex-col justify-between overflow-hidden rounded-sm"
                    >
                      <div>
                        {project.imageUrl && (
                          <div className="w-full aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b-[3px] border-black dark:border-white">
                            <ProjectImage
                              src={project.imageUrl}
                              alt={project.title}
                              title={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200 motion-reduce:transform-none"
                            />
                          </div>
                        )}

                        <div className="p-5 sm:p-6 space-y-3">
                          <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-zinc-950 dark:text-zinc-50 break-words">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium break-words">
                              {project.description}
                            </p>
                          )}

                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {techList.map((tech, tIdx) => {
                                const palette = chipPalettes[tIdx % chipPalettes.length]
                                return (
                                  <span
                                    key={tIdx}
                                    className={`text-[11px] font-bold px-2.5 py-0.5 border ${palette} shadow-[1px_1px_0_0_#000]`}
                                  >
                                    {tech}
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-[#131520] border-t-[3px] border-black dark:border-white flex flex-wrap items-center gap-3 text-xs font-bold">
                          {project.liveUrl && (
                            <a
                              href={sanitizeLink(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white uppercase font-black"
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={sanitizeLink(project.sourceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#1E202E] text-zinc-900 dark:text-zinc-100 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white uppercase font-black"
                            >
                              <Github className="h-3.5 w-3.5" aria-hidden="true" />
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

          {/* Career & Experience Section */}
          {experience && experience.length > 0 && (
            <section id="experience" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-2.5 pb-3 border-b-[3px] border-black dark:border-white">
                <span className="p-1 bg-[#6C5CE7] text-white border-2 border-black dark:border-white shadow-[1px_1px_0_0_#000]">
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                  Experience
                </h2>
              </div>

              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-5 sm:p-6 bg-white dark:bg-[#181A26] border-[3px] border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] rounded-sm space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 text-xs font-bold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-black uppercase text-zinc-950 dark:text-zinc-50">
                          {exp.jobTitle}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#FFDE59] text-black border-2 border-black shadow-[1px_1px_0_0_#000] font-black text-xs uppercase">
                          {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-zinc-500 dark:text-zinc-400 font-semibold">
                            · {exp.employmentType}
                          </span>
                        )}
                      </div>

                      {(exp.startDate || exp.endDate) && (
                        <span className="px-2.5 py-0.5 bg-[#F3F0FF] dark:bg-[#6C5CE7]/30 border-2 border-black dark:border-white shrink-0 text-xs font-black text-purple-950 dark:text-purple-200">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {exp.location && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 text-[#6C5CE7] dark:text-[#A29BFE]" aria-hidden="true" />
                        <span>{exp.location}</span>
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed pt-1 break-words">
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
            <section id="skills" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-2.5 pb-3 border-b-[3px] border-black dark:border-white">
                <span className="p-1 bg-[#1DD1A1] text-black border-2 border-black dark:border-white shadow-[1px_1px_0_0_#000]">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                  Skills
                </h2>
              </div>

              <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {skills.map((skill, idx) => {
                  const prof = getSkillProficiency(skill)
                  const theme = SKILL_THEMES[idx % SKILL_THEMES.length]

                  return (
                    <div
                      key={skill.id || idx}
                      className={`p-3.5 ${theme.cardBg} border-[2.5px] ${theme.borderColor} ${theme.shadowColor} rounded-sm space-y-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-[transform,box-shadow]`}
                    >
                      <div className="flex items-center justify-between gap-1 text-xs font-black">
                        <span className={`truncate uppercase ${theme.textColor}`}>
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 ${theme.badgeBg} border shrink-0`}>
                            {skill.level}
                          </span>
                        )}
                      </div>

                      <div className={`w-full ${theme.barTrack} border-2 h-2.5 overflow-hidden`}>
                        <div
                          className={`${theme.barFill} h-full transition-[width] duration-300`}
                          style={{ width: `${prof}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Education Section - Standalone */}
          {education && education.length > 0 && (
            <section id="education" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-2.5 pb-3 border-b-[3px] border-black dark:border-white">
                <span className="p-1 bg-[#54A0FF] text-black border-2 border-black dark:border-white shadow-[1px_1px_0_0_#000]">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                  Education
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-5 bg-white dark:bg-[#181A26] border-[3px] border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] rounded-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="text-base font-black uppercase break-words text-zinc-950 dark:text-zinc-50">
                        {edu.institution}
                      </span>
                      {(edu.startYear || edu.endYear) && (
                        <span className="px-2 py-0.5 bg-[#E7F5FF] dark:bg-[#54A0FF]/30 border-2 border-black dark:border-white shrink-0 text-[11px] font-black text-blue-950 dark:text-blue-200">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-black text-[#6C5CE7] dark:text-[#A29BFE]">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.mark && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        {edu.mark}
                      </p>
                    )}
                    {edu.location && (
                      <p className="text-xs text-zinc-500 font-medium">
                        {edu.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section - Standalone */}
          {certifications && certifications.length > 0 && (
            <section id="certifications" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-2.5 pb-3 border-b-[3px] border-black dark:border-white">
                <span className="p-1 bg-[#FFDE59] text-black border-2 border-black dark:border-white shadow-[1px_1px_0_0_#000]">
                  <Award className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                  Certifications
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-5 bg-white dark:bg-[#181A26] border-[3px] border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] rounded-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="text-base font-black uppercase break-words text-zinc-950 dark:text-zinc-50">
                        {cert.name}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={sanitizeLink(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#1DD1A1] hover:bg-[#10B981] text-black border-2 border-black dark:border-white font-black text-xs shrink-0 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_0_#000] transition-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {cert.issuer}
                    </p>
                    {cert.issueDate && (
                      <p className="text-xs text-zinc-500 font-medium">
                        {cert.issueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section
            id="contact"
            className="p-6 sm:p-10 bg-[#FFDE59] dark:bg-[#181A26] text-black dark:text-white border-[3px] border-black dark:border-white shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#000] rounded-sm space-y-6 scroll-mt-20"
          >
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-[#FF6B6B] text-white border-2 border-black dark:border-white font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_0_#000]">
                Get In Touch
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                Let's Work Together
              </h2>
              <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-300 font-bold max-w-xl">
                Have a project in mind, an engineering role, or a collaboration inquiry? Feel free to reach out.
              </p>
            </div>

            {profile.publicContactEmail && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 max-w-xl">
                <div className="flex-1 px-4 py-2.5 bg-white dark:bg-[#12131C] border-[2.5px] border-black dark:border-white shadow-[2px_2px_0_0_#000] text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 truncate select-all">
                  {profile.publicContactEmail}
                </div>
                <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-white dark:bg-[#252838] text-black dark:text-white text-xs font-black uppercase tracking-wider border-[2.5px] border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:bg-[#1DD1A1] hover:text-black dark:hover:bg-[#1DD1A1] dark:hover:text-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color,color] flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${profile.publicContactEmail}`}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-black text-white dark:bg-[#FF6B6B] dark:text-white text-xs font-black uppercase tracking-wider border-[2.5px] border-black dark:border-white shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow,background-color] flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white shrink-0"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Send Mail</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-4 border-t-2 border-black/30 dark:border-white/20 text-xs font-bold text-zinc-900 dark:text-zinc-400">
              <p>© {new Date().getFullYear()} {profile.fullName || "Developer"}. All rights reserved.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
