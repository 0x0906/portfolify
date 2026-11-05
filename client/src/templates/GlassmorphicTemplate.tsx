import { useState, useMemo } from "react"
import { useTemplateTheme } from "@/utils/useTemplateTheme"
import type { PortfolioData } from "@/types/portfolio"
import {
  ExternalLink,
  Github,
  Download,
  Sun,
  Moon,
  Mail,
  MapPin,
  Copy,
  Check,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { ProjectImage } from "@/components/portfolio/ProjectImage"
import { sanitizeLink, sanitizeImg } from "@/utils/url"
import { getSkillProficiency } from "@/utils/skillProficiency"

export function GlassmorphicTemplate({ data }: { data: PortfolioData }) {
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
  const [selectedTech, setSelectedTech] = useState<string>("All")

  const validProfileImg = sanitizeImg(profile.profileImageUrl)

  // Unique technologies from projects
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

  const navLinks = [
    { label: "About", href: "#about" },
    ...(projects.length > 0 ? [{ label: "Projects", href: "#projects" }] : []),
    ...(experience.length > 0 ? [{ label: "Experience", href: "#experience" }] : []),
    ...(skills.length > 0 ? [{ label: "Skills", href: "#skills" }] : []),
    ...(education.length > 0 ? [{ label: "Education", href: "#education" }] : []),
    ...(certifications.length > 0 ? [{ label: "Certifications", href: "#certifications" }] : []),
    { label: "Contact", href: "#contact" },
  ]

  return (
    <div ref={rootRef} className={isDark ? "dark" : ""}>
      <div className="relative min-h-screen overflow-x-clip bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-200 selection:bg-cyan-500/20 selection:text-cyan-800 dark:selection:text-cyan-200">
        
        {/* Ambient Aurora Glow Lights (Fixed Background) */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-br from-cyan-400/30 via-indigo-400/20 to-transparent dark:from-cyan-600/20 dark:via-indigo-600/15 blur-3xl" />
          <div className="absolute top-1/4 -right-32 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full bg-gradient-to-bl from-purple-400/25 via-pink-400/20 to-transparent dark:from-purple-600/15 dark:via-pink-600/10 blur-3xl" />
          <div className="absolute bottom-12 left-1/3 w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-400/15 to-transparent dark:from-emerald-600/10 dark:via-teal-600/10 blur-3xl" />
        </div>

        {/* Floating Frosted Glass Header */}
        <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-2.5 px-4 sm:px-6 flex items-center justify-between gap-3 transition-colors">
            
            <a
              href="#about"
              className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg truncate max-w-[130px] min-[380px]:max-w-[180px] sm:max-w-xs lg:max-w-[200px]"
            >
              {profile.fullName || "Portfolio"}
            </a>

            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold" aria-label="Sections">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/15 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/20 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                  <span>Resume</span>
                </a>
              )}

              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="p-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/15 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {isDark ? <Sun className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/15 text-slate-700 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Frosted Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 p-3 backdrop-blur-xl bg-white/85 dark:bg-zinc-900/85 border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                {resumeUrl && (
                  <div className="pt-2 mt-1 border-t border-white/60 dark:border-white/10">
                    <a
                      href={sanitizeLink(resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                    >
                      <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>Download Resume</span>
                    </a>
                  </div>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 sm:space-y-16">
          
          {/* Frosted Hero Card */}
          <section
            id="about"
            className="scroll-mt-24 p-6 sm:p-10 backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl transition-colors"
          >
            <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-6 sm:gap-8 lg:gap-12">
              <div className="space-y-4 flex-1 min-w-0">
                
                {profile.professionalTitle && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 text-cyan-700 dark:text-cyan-300 text-xs font-semibold tracking-wide">
                    <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{profile.professionalTitle}</span>
                  </div>
                )}

                <h1 className="text-2xl min-[400px]:text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white break-words leading-[1.1]">
                  {profile.fullName || "Your Name"}
                </h1>

                {(profile.introduction || profile.biography) && (
                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-normal break-words max-w-2xl">
                    {profile.introduction || profile.biography}
                  </p>
                )}

                {/* Location & Social Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-medium">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-700 dark:text-zinc-300 shadow-sm">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 shrink-0" aria-hidden="true" />
                      <span>{profile.location}</span>
                    </span>
                  )}

                  {profile.publicContactEmail && (
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[150px] min-[380px]:max-w-[200px] sm:max-w-xs">{profile.publicContactEmail}</span>
                          <Copy className="h-3 w-3 shrink-0 ml-0.5 opacity-60" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      <Github className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 shrink-0" aria-hidden="true" />
                      <span>{link.platform}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Profile Avatar with Translucent Ring */}
              {validProfileImg && (
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="p-1.5 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white/80 dark:border-white/20 shadow-xl">
                    <img
                      src={validProfileImg}
                      alt={profile.fullName || "Profile"}
                      width="128"
                      height="128"
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover bg-slate-200 dark:bg-zinc-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Featured Projects Section */}
          {projects && projects.length > 0 && (
            <section id="projects" className="space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-zinc-800">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Projects
                </h2>

                {allTechnologies.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap text-xs font-semibold">
                    <button
                      onClick={() => setSelectedTech("All")}
                      className={`px-3 py-1 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        selectedTech === "All"
                          ? "backdrop-blur-md bg-cyan-600 text-white dark:bg-cyan-500 dark:text-zinc-950 shadow-md shadow-cyan-500/20 font-bold"
                          : "backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    {allTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className={`px-3 py-1 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          selectedTech === tech
                            ? "backdrop-blur-md bg-cyan-600 text-white dark:bg-cyan-500 dark:text-zinc-950 shadow-md shadow-cyan-500/20 font-bold"
                            : "backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
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

                  return (
                    <article
                      key={project.id || idx}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-xl hover:border-white dark:hover:border-white/20 transition-[transform,box-shadow,border-color] duration-200"
                    >
                      <div>
                        {project.imageUrl && (
                          <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-950 border-b border-white/60 dark:border-white/10">
                            <ProjectImage
                              src={project.imageUrl}
                              alt={project.title}
                              title={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transform-none"
                            />
                          </div>
                        )}

                        <div className="p-6 space-y-3">
                          <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white break-words group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal break-words">
                              {project.description}
                            </p>
                          )}

                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {techList.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg backdrop-blur-md bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className="p-4 sm:p-5 backdrop-blur-md bg-white/40 dark:bg-white/[0.02] border-t border-white/60 dark:border-white/10 flex flex-wrap items-center gap-3 text-xs font-semibold">
                          {project.liveUrl && (
                            <a
                              href={sanitizeLink(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={sanitizeLink(project.sourceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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
            <section id="experience" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white">
                Experience
              </h2>

              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-6 backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-sm rounded-2xl space-y-2 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-semibold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {exp.jobTitle}
                        </span>
                        <span className="text-cyan-700 dark:text-cyan-400 font-medium">
                          at {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-slate-500 dark:text-zinc-400 font-normal">
                            · {exp.employmentType}
                          </span>
                        )}
                      </div>

                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-slate-500 dark:text-zinc-400 shrink-0 font-normal">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {exp.location && (
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span>{exp.location}</span>
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-normal leading-relaxed pt-1 break-words">
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
            <section id="skills" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white">
                Skills
              </h2>

              <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {skills.map((skill, idx) => {
                  const prof = getSkillProficiency(skill)
                  const lvl = skill.level?.toLowerCase()
                  const gradientClass =
                    lvl === "beginner"
                      ? "from-amber-500 to-amber-400"
                      : lvl === "intermediate"
                      ? "from-cyan-500 to-blue-500"
                      : "from-cyan-500 to-indigo-500"

                  return (
                    <div
                      key={skill.id || idx}
                      className="p-4 rounded-2xl backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-sm space-y-2 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="truncate text-slate-900 dark:text-white">{skill.name}</span>
                        {skill.level && (
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">
                            {skill.level}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-200/70 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${gradientClass} h-full rounded-full transition-[width] duration-300`}
                          style={{ width: `${prof}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <section id="education" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white">
                Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-5 rounded-2xl backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-sm space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-base font-bold text-slate-900 dark:text-white break-words">
                        {edu.institution}
                      </span>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-slate-500 dark:text-zinc-400 shrink-0 text-xs font-normal">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-cyan-700 dark:text-cyan-400">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.mark && (
                      <p className="text-xs text-slate-600 dark:text-zinc-400">
                        {edu.mark}
                      </p>
                    )}
                    {edu.location && (
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
                        {edu.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <section id="certifications" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white">
                Certifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-5 rounded-2xl backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-sm space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-base font-bold text-slate-900 dark:text-white break-words">
                        {cert.name}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={sanitizeLink(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-400 hover:underline text-xs shrink-0 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
                        >
                          <span>Verify</span>
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                      {cert.issuer}
                    </p>
                    {cert.issueDate && (
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
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
            className="p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/65 dark:bg-zinc-900/60 border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4 scroll-mt-24 transition-colors"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white">
              Contact
            </h2>

            <div className="space-y-4 max-w-xl">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                Feel free to reach out for inquiries, collaboration opportunities, or questions.
              </p>

              {profile.publicContactEmail && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <div className="flex-1 px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-950/60 border border-white/80 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-800 dark:text-zinc-200 truncate select-all">
                    {profile.publicContactEmail}
                  </div>
                  <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/80 dark:border-white/15 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shrink-0"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${profile.publicContactEmail}`}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shrink-0"
                    >
                      <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-500">
              <p>© {new Date().getFullYear()} {profile.fullName || "Developer"}. All rights reserved.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
