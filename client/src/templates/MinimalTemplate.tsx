import { useState } from "react"
import { useTemplateTheme } from "@/utils/useTemplateTheme"
import type { PortfolioData } from "@/types/portfolio"
import {
  Github,
  ArrowUpRight,
  Download,
  Sun,
  Moon,
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

export function MinimalTemplate({ data }: { data: PortfolioData }) {
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

  const { isDark, toggleTheme, rootRef } = useTemplateTheme(data.themeSettings?.themeMode)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCopyEmail = () => {
    if (profile.publicContactEmail) {
      navigator.clipboard.writeText(profile.publicContactEmail).then(() => {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      })
    }
  }

  const validProfileImg = sanitizeImg(profile.profileImageUrl)

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
      <div className="min-h-screen overflow-x-clip bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-200">
        
        {/* Minimalist Hairline Sticky Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-neutral-950/90 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 sm:px-8 py-3.5 transition-colors duration-200">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            
            <a
              href="#about"
              className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 rounded truncate max-w-[180px] sm:max-w-xs"
            >
              {profile.fullName || "Portfolio"}
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400" aria-label="Sections">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 rounded shrink-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions + Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
              {resumeUrl && (
                <a
                  href={sanitizeLink(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors font-medium"
                  title="Download resume"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Resume</span>
                </a>
              )}

              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
              >
                {isDark ? <Sun className="h-3.5 w-3.5" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-3 mt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 animate-in fade-in slide-in-from-top-2 duration-150">
              <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {resumeUrl && (
                  <div className="pt-2 mt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
                    <a
                      href={sanitizeLink(resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <Download className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                      <span>Download Resume</span>
                    </a>
                  </div>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-16 md:py-20 space-y-14 sm:space-y-20 md:space-y-24">
          
          {/* Hero Section */}
          <section id="about" className="scroll-mt-20 pt-2 sm:pt-6">
            <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-6 sm:gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <div className="space-y-5 sm:space-y-6 flex-1 min-w-0">
                
                <div className="space-y-2">
                  <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1] break-words">
                    {profile.fullName || "Your Name"}
                  </h1>
                  {profile.professionalTitle && (
                    <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-normal break-words">
                      {profile.professionalTitle}
                    </p>
                  )}
                </div>

                {(profile.introduction || profile.biography) && (
                  <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-light max-w-2xl break-words">
                    {profile.introduction || profile.biography}
                  </p>
                )}

                {/* Metadata & Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 text-xs">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300 max-w-full">
                      <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">{profile.location}</span>
                    </span>
                  )}

                  {profile.publicContactEmail && (
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors max-w-full"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[170px] min-[380px]:max-w-[220px] sm:max-w-xs md:max-w-md">{profile.publicContactEmail}</span>
                          <Copy className="h-3 w-3 text-neutral-400 ml-1 shrink-0" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5 text-neutral-500 shrink-0" aria-hidden="true" />
                      <span>{link.platform}</span>
                      <ExternalLink className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Portrait */}
              {validProfileImg && (
                <div className="shrink-0 mx-auto md:mx-0">
                  <img
                    src={validProfileImg}
                    alt={profile.fullName || "Profile"}
                    width="144"
                    height="144"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800 shadow-sm"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Featured Projects */}
          {projects && projects.length > 0 && (
            <section id="projects" className="space-y-6 sm:space-y-8 scroll-mt-20">
              <div className="flex items-baseline justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Featured Projects
                </h2>
                <span className="text-xs font-mono text-neutral-500">
                  {projects.length} {projects.length === 1 ? "project" : "projects"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {projects.map((project, idx) => {
                  const techList = Array.isArray(project.technologies)
                    ? project.technologies
                    : typeof project.technologies === "string"
                    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                    : []

                  return (
                    <article
                      key={project.id || idx}
                      className="group flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {project.imageUrl && (
                          <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                            <ProjectImage
                              src={project.imageUrl}
                              alt={project.title}
                              title={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <h3 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors break-words">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed break-words">
                              {project.description}
                            </p>
                          )}
                        </div>

                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {techList.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs">
                          {project.liveUrl && (
                            <a
                              href={sanitizeLink(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                            >
                              <span>Live Preview</span>
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={sanitizeLink(project.sourceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
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

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <section id="experience" className="space-y-6 sm:space-y-8 scroll-mt-20">
              <div className="flex items-baseline justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Experience
                </h2>
                <span className="text-xs font-mono text-neutral-500">Career</span>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-4 sm:p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                          {exp.jobTitle}
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                          at {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-neutral-400 dark:text-neutral-500">
                            · {exp.employmentType}
                          </span>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs font-mono text-neutral-500 shrink-0">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {exp.location && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
                        <span>{exp.location}</span>
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed break-words">
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
            <section id="skills" className="space-y-6 sm:space-y-8 scroll-mt-20">
              <div className="flex items-baseline justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Skills &amp; Technologies
                </h2>
                <span className="text-xs font-mono text-neutral-500">Proficiency</span>
              </div>

              <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {skills.map((skill, idx) => {
                  const prof = getSkillProficiency(skill)

                  return (
                    <div
                      key={skill.id || idx}
                      className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-1 text-xs font-medium">
                        <span className="truncate text-neutral-900 dark:text-neutral-100">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono shrink-0">
                            {skill.level}
                          </span>
                        )}
                      </div>

                      {/* Hairline Minimalist Progress Bar */}
                      <div className="w-full bg-neutral-200/80 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-300"
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
            <section id="education" className="space-y-6 sm:space-y-8 scroll-mt-20">
              <div className="flex items-baseline justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Education
                </h2>
                <span className="text-xs font-mono text-neutral-500">Academic Background</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-4 sm:p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm break-words">
                        {edu.institution}
                      </span>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-neutral-500 font-mono text-xs shrink-0">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.mark && (
                      <p className="text-xs text-neutral-500">
                        Grade: {edu.mark}
                      </p>
                    )}
                    {edu.location && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
                        <span>{edu.location}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section - Standalone */}
          {certifications && certifications.length > 0 && (
            <section id="certifications" className="space-y-6 sm:space-y-8 scroll-mt-20">
              <div className="flex items-baseline justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Certifications
                </h2>
                <span className="text-xs font-mono text-neutral-500">Verified Credentials</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-4 sm:p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm break-words">
                        {cert.name}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={sanitizeLink(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline shrink-0"
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Issuer: {cert.issuer}
                    </p>
                    {cert.issueDate && (
                      <p className="text-xs font-mono text-neutral-500">
                        Issued: {cert.issueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-20 pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-6">
            <div className="max-w-xl space-y-2.5">
              <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Interested in working together or have an inquiry? Feel free to reach out directly.
              </p>
            </div>

            {profile.publicContactEmail && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-lg">
                <div className="flex-1 px-3.5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 truncate select-all">
                  {profile.publicContactEmail}
                </div>
                <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 text-emerald-400 dark:text-emerald-600" aria-hidden="true" />
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
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shrink-0"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Send Mail</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-6 sm:pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500">
              <p>© {new Date().getFullYear()} {profile.fullName || "Developer"}. All rights reserved.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
