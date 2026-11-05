import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  X,
  Search,
  Code2,
  Cpu,
  Layers,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { api } from "@/services/api"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import { ResponsivePreviewFrame } from "@/components/preview/ResponsivePreviewFrame"
import { samplePortfolioData } from "@/templates/sampleData"
import {
  TEMPLATES,
} from "@/templates/templateRegistry"
import type { PortfolioData } from "@/types/portfolio"

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { resolvedTheme } = useTheme()
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!previewTemplateId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewTemplateId(null)
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [previewTemplateId])

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.category.toLowerCase().includes(q) ||
      tpl.description.toLowerCase().includes(q) ||
      tpl.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  const handleHeroCta = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/sign-up")
    }
  }

  const handleSelectTemplate = async (templateId: string) => {
    localStorage.setItem("selected_template_id", templateId)

    if (!isAuthenticated) {
      navigate("/sign-in", { state: { returnTo: "/editor" } })
      return
    }

    try {
      const listRes = await api.get("/portfolio/list")
      const userPortfolios = listRes.data?.portfolios || []

      if (userPortfolios.length > 0) {
        const existingPortfolio = userPortfolios[0]
        await api.patch(`/portfolio/${existingPortfolio.id}`, { templateId })
        navigate(`/editor/${existingPortfolio.id}`)
      } else {
        const res = await api.post("/portfolio", { templateId })
        if (res.data?.portfolio?.id) {
          navigate(`/editor/${res.data.portfolio.id}`)
        } else {
          navigate("/editor")
        }
      }
    } catch {
      navigate("/editor")
    }
  }

  const getPreviewData = (tplId: string): PortfolioData => {
    return {
      ...samplePortfolioData,
      templateId: tplId as any,
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />

      <main className="flex-1">

        <section className="border-b border-[var(--color-rule)] bg-[var(--color-paper)] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-ink)] leading-[1.08]">
                Build and host your developer portfolio
              </h1>

              <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto">
                Portfolify lets you pick a layout, add your projects and work history, and publish a clean portfolio with a shareable public link.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="default"
                  size="lg"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleHeroCta}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Create your portfolio"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const el = document.getElementById("catalog")
                    el?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Explore templates
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-16 border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <div className="container mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Curated layouts
                </h2>
                <p className="text-sm text-[var(--color-muted)] mt-1 max-w-xl">
                  Thoughtful aesthetic styles built for creators, professionals, and makers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/templates"
                  className="text-xs font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input px-1"
                >
                  View full catalog
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <div className="relative w-full max-w-md">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  aria-label="Search templates"
                  placeholder="Search templates by name, style, or tech stack…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 h-9 text-xs rounded-input border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] placeholder:text-[var(--color-muted)] disabled:opacity-50 disabled:pointer-events-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="group rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] overflow-hidden flex flex-col justify-between hover:border-[var(--color-rule-2)] transition-colors duration-100 ease-out motion-reduce:transition-none"
                >
                  <div className="w-full aspect-[16/10] overflow-hidden bg-[var(--color-paper-2)] border-b border-[var(--color-rule)]">
                    <img
                      src={`/templates/${tpl.id}.png?v=4`}
                      alt={tpl.name}
                      width={640}
                      height={400}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-base text-[var(--color-ink)]">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
                        {tpl.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-rule)] flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs gap-1.5"
                        onClick={() => setPreviewTemplateId(tpl.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSelectTemplate(tpl.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
                Built for visual fidelity
              </h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Design and architectural principles that distinguish Portfolify from generic site builders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] space-y-3">
                <div className="h-8 w-8 rounded-sm bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Code2 className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-ink)]">
                  Instant Public Link
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Clean URLs for resumes and GitHub bios with zero DNS configuration.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] space-y-3">
                <div className="h-8 w-8 rounded-sm bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Cpu className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-ink)]">
                  Fast SSR Delivery
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Pre-rendered HTML with full meta tags for instant recruiter inspection.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] space-y-3">
                <div className="h-8 w-8 rounded-sm bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-ink)]">
                  Schema Portability
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Switch layouts anytime without re-entering work history or project data.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] space-y-3">
                <div className="h-8 w-8 rounded-sm bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Palette className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-ink)]">
                  Dual Palette Parity
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Strict light and dark modes designed with equal contrast and weight.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--color-paper-2)]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
                Launch your personal showcase
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                Select a layout, configure your work history, and publish your portfolio today.
              </p>
              <div className="pt-2">
                <Button
                  variant="default"
                  size="lg"
                  className="gap-2"
                  onClick={handleHeroCta}
                >
                  {isAuthenticated ? "Open Dashboard" : "Create portfolio"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {previewTemplateId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Template Preview"
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-[var(--color-paper)]"
        >
          <header className="h-14 px-4 sm:px-6 border-b border-[var(--color-rule)] flex items-center justify-between bg-[var(--color-paper-2)] shrink-0 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5"
                onClick={() => setPreviewTemplateId(null)}
                aria-label="Exit template preview"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exit Preview
              </Button>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--color-rule)]">
                <span className="font-semibold text-sm text-[var(--color-ink)]">
                  {TEMPLATES.find((t) => t.id === previewTemplateId)?.name}
                </span>
                <span className="text-xs text-[var(--color-muted)]">layout</span>
              </div>
            </div>

            <div className="flex items-center gap-1 border border-[var(--color-rule)] rounded-input p-0.5 bg-[var(--color-paper)]">
              <button
                type="button"
                className={`h-7 px-2.5 text-xs rounded-input flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  previewDevice === "desktop"
                    ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor className="h-3 w-3" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                className={`h-7 px-2.5 text-xs rounded-input flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  previewDevice === "tablet"
                    ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
                onClick={() => setPreviewDevice("tablet")}
              >
                <Tablet className="h-3 w-3" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                className={`h-7 px-2.5 text-xs rounded-input flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  previewDevice === "mobile"
                    ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-3 w-3" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  const tpl = previewTemplateId
                  setPreviewTemplateId(null)
                  handleSelectTemplate(tpl)
                }}
              >
                Use layout
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1"
                onClick={() => setPreviewTemplateId(null)}
                aria-label="Close preview"
              >
                <X className="h-3.5 w-3.5" />
                <span>Close</span>
              </Button>
            </div>
          </header>

          <main
            className="flex-1 overflow-auto bg-[var(--color-paper-3)] p-4 sm:p-6 flex justify-center cursor-pointer"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPreviewTemplateId(null)
              }
            }}
          >
            <ResponsivePreviewFrame
              device={previewDevice}
              isDark={resolvedTheme === "dark"}
              title="Template Preview"
            >
              <TemplateRenderer data={getPreviewData(previewTemplateId)} />
            </ResponsivePreviewFrame>
          </main>
        </div>
      )}

      <Footer />
    </div>
  )
}
