import { useState, useMemo, useRef, useEffect } from "react"
import type { PortfolioData } from "@/types/portfolio"
import {
  Github,
  ArrowUpRight,
  Download,
  Mail,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Menu,
  X,
} from "lucide-react"
import { ProjectImage } from "@/components/portfolio/ProjectImage"
import { sanitizeLink, sanitizeImg } from "@/utils/url"
import { getSkillProficiency } from "@/utils/skillProficiency"

export function LuxuryTemplate({ data }: { data: PortfolioData }) {
  const {
    profile,
    projects = [],
    skills = [],
    experience = [],
    education = [],
    certifications = [],
    socialLinks = [],
    resumeUrl,
  } = data

  const rootRef = useRef<HTMLDivElement>(null)

  // Luxury template is exclusively dark theme
  useEffect(() => {
    const doc = rootRef.current?.ownerDocument || (typeof document !== "undefined" ? document : null)
    if (!doc) return
    doc.documentElement.classList.add("dark")
    doc.documentElement.setAttribute("data-mode", "dark")
    doc.documentElement.style.colorScheme = "dark"
  }, [])

  const [copiedEmail, setCopiedEmail] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState<string>("All")

  const handleCopyEmail = () => {
    if (profile.publicContactEmail) {
      navigator.clipboard.writeText(profile.publicContactEmail).then(() => {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      })
    }
  }

  // Profile image: only display if the user actually provided one
  const validProfileImg = sanitizeImg(profile.profileImageUrl)

  // Extract unique project technologies for curated filtering
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
    <div ref={rootRef} className="dark">
      <div className="min-h-screen overflow-x-clip bg-[#0C0B0A] text-[#F5F1EB] font-luxury transition-colors duration-200 selection:bg-[#D4AF37]/20 selection:text-[#E8D49E]">
        {/* Ambient Gold Hairline Highlight at top of page */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        {/* Haute Minimalist Floating Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0C0B0A]/90 border-b border-[#221F1C] px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            {/* User Brand / Name */}
            <a
              href="#about"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded py-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block shrink-0" />
              <span className="font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold text-[#F5F1EB] group-hover:text-[#D4AF37] transition-colors truncate max-w-[130px] min-[380px]:max-w-[180px] sm:max-w-xs lg:max-w-[220px]">
                {profile.fullName || "Portfolio"}
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#A39B90]"
              aria-label="Sections"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#F5F1EB] hover:underline underline-offset-8 decoration-[#D4AF37]/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs shrink-0 font-sans">
              {resumeUrl && (
                <a
                  href={sanitizeLink(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#D4AF37]/50 bg-[#1A1816] text-[#DFC28A] hover:text-white hover:border-[#D4AF37] transition-all text-[11px] font-medium uppercase tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                  title="Download Resume"
                >
                  <Download className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Resume</span>
                </a>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-1.5 rounded-sm border border-[#262320] bg-[#151413] text-[#DFC28A] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-4 mt-3 border-t border-[#221F1C] animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
              <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded text-xs uppercase tracking-[0.2em] font-medium text-[#A39B90] hover:bg-[#1A1816] hover:text-[#F5F1EB] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {resumeUrl && (
                  <div className="pt-2 mt-2 border-t border-[#221F1C]/80">
                    <a
                      href={sanitizeLink(resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] hover:bg-[#1A1816] transition-colors"
                    >
                      <Download className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                      <span>Download Resume</span>
                    </a>
                  </div>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Main Haute Minimalist Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-20 space-y-16 sm:space-y-24">
          {/* About / Hero Section */}
          <section id="about" className="scroll-mt-24 pt-2 sm:pt-4">
            <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-8 sm:gap-12 lg:gap-16 pb-12 sm:pb-16 border-b border-[#221F1C]">
              <div className="space-y-6 flex-1 min-w-0">
                {/* Professional Title in Subtle Gold Lettering */}
                {profile.professionalTitle && (
                  <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                    <span className="w-4 h-[1px] bg-[#D4AF37]" />
                    <span>{profile.professionalTitle}</span>
                  </div>
                )}

                {/* Primary Heading in Cormorant Garamond */}
                <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5F1EB] leading-[1.08] break-words">
                  {profile.fullName || "Portfolio"}
                </h1>

                {/* Editorial Biography / Introduction */}
                {(profile.introduction || profile.biography) && (
                  <p className="text-sm sm:text-base md:text-lg font-light text-[#B3ACA0] leading-relaxed max-w-xl break-words">
                    {profile.introduction || profile.biography}
                  </p>
                )}

                {/* Metadata & Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 text-xs font-sans">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#262320] bg-[#151413] text-[#B3ACA0] max-w-full">
                      <MapPin className="h-3 w-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">{profile.location}</span>
                    </span>
                  )}

                  {profile.publicContactEmail && (
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#262320] bg-[#151413] text-[#B3ACA0] hover:text-[#F5F1EB] hover:border-[#D4AF37] transition-colors max-w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                          <span className="text-emerald-400 font-medium">Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[150px] min-[380px]:max-w-[200px] sm:max-w-xs">{profile.publicContactEmail}</span>
                          <Copy className="h-3 w-3 text-[#D4AF37] ml-1 shrink-0 opacity-70" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#262320] bg-[#151413] text-[#B3ACA0] hover:text-[#F5F1EB] hover:border-[#D4AF37] transition-colors"
                    >
                      <Github className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span>{link.platform}</span>
                      <ExternalLink className="h-3 w-3 text-[#D4AF37] opacity-70" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Portrait: Render ONLY if user provided a valid profile image URL */}
              {validProfileImg && (
                <div className="shrink-0 mx-auto lg:mx-0">
                  <div className="relative p-1.5 rounded-sm border border-[#D4AF37]/50 bg-[#161412] shadow-sm">
                    <img
                      src={validProfileImg}
                      alt={profile.fullName || "Portrait"}
                      width="160"
                      height="160"
                      className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-[1px] contrast-[1.05] transition-all duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section id="projects" className="space-y-8 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-3 border-b border-[#221F1C]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#F5F1EB]">
                    Projects
                  </h2>
                  <p className="text-xs font-sans text-[#A39B90] mt-0.5">
                    Selected work and software architecture
                  </p>
                </div>

                {/* Filter Pills */}
                {allTechnologies.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap text-xs font-sans">
                    <button
                      onClick={() => setSelectedTech("All")}
                      className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                        selectedTech === "All"
                          ? "bg-[#F5F1EB] text-[#161514]"
                          : "border border-[#262320] bg-[#151413] text-[#A39B90] hover:text-[#F5F1EB]"
                      }`}
                    >
                      All
                    </button>
                    {allTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                          selectedTech === tech
                            ? "bg-[#F5F1EB] text-[#161514]"
                            : "border border-[#262320] bg-[#151413] text-[#A39B90] hover:text-[#F5F1EB]"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {filteredProjects.map((project, idx) => {
                  const techList = Array.isArray(project.technologies)
                    ? project.technologies
                    : typeof project.technologies === "string"
                    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                    : []

                  return (
                    <article
                      key={project.id || idx}
                      className="group flex flex-col justify-between rounded-sm border border-[#262320] bg-[#121110] p-5 sm:p-6 hover:border-[#D4AF37]/50 transition-colors duration-200"
                    >
                      <div className="space-y-4">
                        {/* Project image: only render if user set one */}
                        {project.imageUrl && (
                          <div className="w-full aspect-[16/10] overflow-hidden rounded-[1px] bg-[#1A1816] border border-[#221F1C]">
                            <ProjectImage
                              src={project.imageUrl}
                              alt={project.title}
                              title={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <h3 className="font-luxury text-lg sm:text-xl font-normal text-[#F5F1EB] group-hover:text-[#D4AF37] transition-colors break-words">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-xs sm:text-sm font-light text-[#B3ACA0] leading-relaxed break-words">
                              {project.description}
                            </p>
                          )}
                        </div>

                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 font-sans">
                            {techList.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#1A1816] text-[#DFC28A] border border-[#221F1C]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className="flex flex-wrap items-center gap-4 pt-4 mt-4 border-t border-[#221F1C] text-xs font-sans">
                          {project.liveUrl && (
                            <a
                              href={sanitizeLink(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-[#F5F1EB] hover:text-[#D4AF37] transition-colors"
                            >
                              <span>View Project</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={sanitizeLink(project.sourceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#A39B90] hover:text-[#F5F1EB] transition-colors"
                            >
                              <Github className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
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
            <section id="experience" className="space-y-8 scroll-mt-24">
              <div className="pb-3 border-b border-[#221F1C]">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#F5F1EB]">
                  Experience
                </h2>
                <p className="text-xs font-sans text-[#A39B90] mt-0.5">
                  Career history and engineering roles
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-5 sm:p-6 rounded-sm border border-[#221F1C] bg-[#121110] space-y-3 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-sans">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-luxury text-base sm:text-lg font-normal text-[#F5F1EB]">
                          {exp.jobTitle}
                        </span>
                        <span className="text-[#D4AF37] font-medium">
                          at {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-[#A39B90]">
                            · {exp.employmentType}
                          </span>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs uppercase tracking-wider text-[#DFC28A] shrink-0 font-medium">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {exp.location && (
                      <p className="text-xs text-[#A39B90] flex items-center gap-1.5 font-sans">
                        <MapPin className="h-3 w-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        <span>{exp.location}</span>
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-xs sm:text-sm font-light text-[#B3ACA0] leading-relaxed break-words">
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
            <section id="skills" className="space-y-8 scroll-mt-24">
              <div className="pb-3 border-b border-[#221F1C]">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#F5F1EB]">
                  Skills
                </h2>
                <p className="text-xs font-sans text-[#A39B90] mt-0.5">
                  Technical proficiencies &amp; disciplines
                </p>
              </div>

              <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {skills.map((skill, idx) => {
                  const prof = getSkillProficiency(skill)
                  const isAdvanced =
                    skill.level?.toLowerCase() === "advanced" ||
                    skill.level?.toLowerCase() === "advance" ||
                    prof === 100

                  return (
                    <div
                      key={skill.id || idx}
                      className="p-4 rounded-sm border border-[#221F1C] bg-[#121110] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-1 text-xs font-sans">
                        <span className="truncate font-medium text-[#F5F1EB]">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold shrink-0">
                            {skill.level}
                          </span>
                        )}
                      </div>

                      {/* Delicate Champagne Gold Hairline Progress Bar: 100% completed for Advanced */}
                      <div className="w-full bg-[#221F1C] h-[1.5px] rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#B89758] via-[#DFC28A] to-[#D4AF37] h-full rounded-full transition-all duration-300"
                          style={{ width: `${isAdvanced ? 100 : prof}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Distinct Standalone Education Section */}
          {education && education.length > 0 && (
            <section id="education" className="space-y-8 scroll-mt-24">
              <div className="pb-3 border-b border-[#221F1C]">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#F5F1EB]">
                  Education
                </h2>
                <p className="text-xs font-sans text-[#A39B90] mt-0.5">
                  Academic qualifications &amp; degrees
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-5 rounded-sm border border-[#221F1C] bg-[#121110] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-sans">
                      <span className="font-luxury text-base font-medium text-[#F5F1EB] break-words">
                        {edu.institution}
                      </span>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-[#D4AF37] text-xs font-medium uppercase tracking-wider shrink-0">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-sans font-medium text-[#B3ACA0]">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.mark && (
                      <p className="text-xs font-sans text-[#A39B90]">
                        Distinction: {edu.mark}
                      </p>
                    )}
                    {edu.location && (
                      <p className="text-xs font-sans text-[#A39B90] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        <span>{edu.location}</span>
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-xs sm:text-sm font-light text-[#B3ACA0] leading-relaxed break-words pt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Distinct Standalone Certifications Section */}
          {certifications && certifications.length > 0 && (
            <section id="certifications" className="space-y-8 scroll-mt-24">
              <div className="pb-3 border-b border-[#221F1C]">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#F5F1EB]">
                  Certifications
                </h2>
                <p className="text-xs font-sans text-[#A39B90] mt-0.5">
                  Verified credentials &amp; licenses
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-5 rounded-sm border border-[#221F1C] bg-[#121110] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-sans">
                      <span className="font-luxury text-base font-medium text-[#F5F1EB] break-words">
                        {cert.name}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={sanitizeLink(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#D4AF37] hover:underline shrink-0"
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-sans text-[#B3ACA0]">
                      Issued by {cert.issuer}
                    </p>
                    {cert.issueDate && (
                      <p className="text-xs font-sans text-[#A39B90]">
                        Issued: {cert.issueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-24 pt-10 border-t border-[#221F1C] space-y-6">
            <div className="max-w-xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#F5F1EB]">
                Contact
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#B3ACA0] leading-relaxed">
                Feel free to reach out for inquiries, advisory engagements, or engineering roles.
              </p>
            </div>

            {profile.publicContactEmail && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg font-sans">
                <div className="flex-1 px-4 py-2.5 rounded-sm border border-[#262320] bg-[#151413] text-xs sm:text-sm text-[#F5F1EB] truncate select-all">
                  {profile.publicContactEmail}
                </div>
                <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-sm bg-[#F5F1EB] text-[#161514] text-xs font-medium uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
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
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-sm border border-[#D4AF37]/70 bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] shrink-0"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            )}

            {/* Copyright Notice */}
            <div className="pt-8 border-t border-[#221F1C]/60 text-xs font-sans text-[#A39B90]">
              <p>© {new Date().getFullYear()} {profile.fullName || "Portfolio"}. All rights reserved.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
