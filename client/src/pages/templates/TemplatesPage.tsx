import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import { ResponsivePreviewFrame } from "@/components/preview/ResponsivePreviewFrame"
import { samplePortfolioData } from "@/templates/sampleData"
import { TEMPLATES } from "@/templates/templateRegistry"
import type { PortfolioData } from "@/types/portfolio"
import { Eye, X, Monitor, Tablet, Smartphone, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { api } from "@/services/api"

export function TemplatesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { resolvedTheme } = useTheme()
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [searchQuery, setSearchQuery] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getPreviewData = (tplId: string): PortfolioData => {
    return {
      ...samplePortfolioData,
      templateId: tplId as any,
      themeSettings: {
        ...samplePortfolioData.themeSettings,
        themeMode: resolvedTheme,
      },
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    if (isApplying) return
    setIsApplying(true)
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
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Design catalog
              </Badge>
              <span className="text-xs text-[var(--color-muted)]">
                {TEMPLATES.length === 1 ? "Curated layout" : `${TEMPLATES.length} layouts`}
              </span>
            </div>
            <h1 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight text-[var(--color-ink)]">
              Portfolio templates
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              Every layout is fully responsive, clean, and customizable. Switch designs anytime without losing your content.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--color-rule)] flex justify-start">
            <div className="relative w-full max-w-md">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <Input
                placeholder="Search templates by name, style, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs bg-[var(--color-paper)] w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16 border border-[var(--color-rule)] rounded-card bg-[var(--color-paper-2)] p-6 space-y-3">
              <p className="text-sm text-[var(--color-muted)]">No templates match "{searchQuery}".</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTemplates.map((tpl, idx) => (
                  <Card
                    key={tpl.id}
                    onClick={() => setPreviewTemplateId(tpl.id)}
                    className="group rounded-card overflow-hidden flex flex-col justify-between transition-[border-color] duration-100 ease-out border border-[var(--color-rule)] bg-[var(--color-paper-2)] cursor-pointer hover:border-[var(--color-rule-2)] shadow-[var(--shadow-card)]"
                  >
                    <div className="w-full aspect-[16/10] overflow-hidden bg-[var(--color-paper)] border-b border-[var(--color-rule)]">
                      <img
                        src={`/templates/${tpl.id}.png?v=4`}
                        alt={tpl.name}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">{tpl.name}</h3>
                        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--color-rule)] flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => setPreviewTemplateId(tpl.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs"
                          disabled={isApplying}
                          onClick={() => handleUseTemplate(tpl.id)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  role="navigation"
                  aria-label="Template catalog pagination"
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--color-rule)]"
                >
                  <p className="text-xs text-[var(--color-muted)] order-2 sm:order-1">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} layouts
                  </p>

                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="text-xs h-8 px-3 gap-1"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`w-8 h-8 rounded-input text-xs font-medium transition-[background-color,color] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                            currentPage === page
                              ? "bg-[var(--color-ink)] text-[var(--color-paper)] font-semibold shadow-[var(--shadow-card)]"
                              : "border border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="text-xs h-8 px-3 gap-1"
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          )}
        </div>
      </main>

      {previewTemplateId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Template Preview"
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-[var(--color-paper)]"
        >
          <header className="h-14 px-4 sm:px-6 border-b border-[var(--color-rule)] flex items-center justify-between bg-[var(--color-paper-2)] shrink-0 gap-3">
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
              <ThemeToggle />
              <Button
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  const id = previewTemplateId
                  setPreviewTemplateId(null)
                  if (id) {
                    handleUseTemplate(id)
                  }
                }}
                disabled={isApplying}
              >
                Use layout
              </Button>
              <Button
                size="sm"
                variant="outline"
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
