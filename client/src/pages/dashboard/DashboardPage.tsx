import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { api } from "@/services/api"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import { ResponsivePreviewFrame } from "@/components/preview/ResponsivePreviewFrame"
import { samplePortfolioData } from "@/templates/sampleData"
import type { PortfolioData } from "@/types/portfolio"
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Eye,
  Settings,
  Loader2,
  Trash2,
  X,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  ArrowLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  TEMPLATES,
  getTemplateMeta,
} from "@/templates/templateRegistry"

interface PortfolioSummary {
  id: string
  username: string
  templateId: string
  status: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  websiteTitle?: string
  visitCount: number
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { resolvedTheme } = useTheme()

  const [loading, setLoading] = useState(true)
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([])
  const [publishedPortfolio, setPublishedPortfolio] = useState<PortfolioSummary | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createSearch, setCreateSearch] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const [portfolioToDelete, setPortfolioToDelete] = useState<PortfolioSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [publishLoadingId, setPublishLoadingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [statusNotice, setStatusNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState<PortfolioData | null>(null)
  const [previewTitle, setPreviewTitle] = useState("")
  const [previewTemplateId, setPreviewTemplateId] = useState("")
  const [previewPortfolioId, setPreviewPortfolioId] = useState<string | null>(null)
  const [previewIsTemplate, setPreviewIsTemplate] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  useEffect(() => {
    if (!previewModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewModalOpen(false)
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [previewModalOpen])

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      const res = await api.get("/portfolio/list")
      if (res.data) {
        setPortfolios(res.data.portfolios || [])
        setPublishedPortfolio(res.data.publishedPortfolio || null)
      }
    } catch {
      setPortfolios([])
      setPublishedPortfolio(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const modalTemplates = TEMPLATES.filter((tpl) => {
    const q = createSearch.toLowerCase().trim()
    if (!q) return true
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.category.toLowerCase().includes(q) ||
      tpl.description.toLowerCase().includes(q) ||
      tpl.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  const handleCreatePortfolio = async (templateId: string) => {
    if (isCreating) return
    setIsCreating(true)
    setStatusNotice(null)
    localStorage.setItem("selected_template_id", templateId)

    try {
      const res = await api.post("/portfolio", { templateId })
      if (res.data?.portfolio?.id) {
        setShowCreateModal(false)
        setPreviewModalOpen(false)
        navigate(`/editor/${res.data.portfolio.id}`)
      } else {
        navigate("/editor")
      }
    } catch {
      navigate("/editor")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete || isDeleting) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const res = await api.delete(`/portfolio/${portfolioToDelete.id}`)
      if (res.data?.success) {
        try {
          sessionStorage.removeItem(`cache_portfolio_${portfolioToDelete.username}`)
          sessionStorage.removeItem(`cache_portfolio_${portfolioToDelete.username.toLowerCase()}`)
        } catch {}
        setPortfolios((prev) => prev.filter((p) => p.id !== portfolioToDelete.id))
        if (
          publishedPortfolio?.id === portfolioToDelete.id ||
          publishedPortfolio?.username.toLowerCase() === portfolioToDelete.username.toLowerCase()
        ) {
          setPublishedPortfolio(null)
        }
        setStatusNotice({
          type: "success",
          text: `Portfolio "${portfolioToDelete.username}" deleted.`,
        })
        setPortfolioToDelete(null)
        setTimeout(() => setStatusNotice(null), 4000)
      } else {
        setDeleteError("Failed to delete portfolio.")
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Failed to delete portfolio.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePublish = async (targetPortfolio: PortfolioSummary) => {
    setPublishLoadingId(targetPortfolio.id)
    setStatusNotice(null)

    try {
      if (targetPortfolio.status === "published") {
        const res = await api.post(`/portfolio/${targetPortfolio.id}/unpublish`)
        if (res.data?.success) {
          sessionStorage.removeItem(`cache_portfolio_${targetPortfolio.username}`)
          setPortfolios((prev) =>
            prev.map((p) => (p.id === targetPortfolio.id ? { ...p, status: "unpublished" } : p))
          )
          setPublishedPortfolio(null)
          setStatusNotice({
            type: "success",
            text: `Portfolio "${targetPortfolio.username}" unpublished.`,
          })
          setTimeout(() => setStatusNotice(null), 3000)
        }
      } else {
        const res = await api.post(`/portfolio/${targetPortfolio.id}/publish`)
        if (res.data?.success) {
          sessionStorage.removeItem(`cache_portfolio_${targetPortfolio.username}`)
          const updatedList = portfolios.map((p) => {
            if (p.id === targetPortfolio.id) {
              return { ...p, status: "published", publishedAt: res.data.publishedAt }
            }
            if (p.status === "published") {
              return { ...p, status: "draft" }
            }
            return p
          })
          setPortfolios(updatedList)
          const updatedTarget = updatedList.find((p) => p.id === targetPortfolio.id) || null
          setPublishedPortfolio(updatedTarget)
          setStatusNotice({
            type: "success",
            text: `Portfolio "${targetPortfolio.username}" is now live.`,
          })
          setTimeout(() => setStatusNotice(null), 4000)
        }
      }
    } catch (err: any) {
      setStatusNotice({
        type: "error",
        text: err.response?.data?.message || "Failed to update publication status.",
      })
    } finally {
      setPublishLoadingId(null)
    }
  }

  const handleOpenPortfolioPreview = async (portfolio: PortfolioSummary) => {
    setPreviewTitle(portfolio.websiteTitle || `@${portfolio.username}`)
    setPreviewTemplateId(portfolio.templateId)
    setPreviewPortfolioId(portfolio.id)
    setPreviewIsTemplate(false)
    setPreviewDevice("desktop")
    setPreviewModalOpen(true)
    setPreviewLoading(true)

    try {
      const res = await api.get(`/portfolio/${portfolio.id}`)
      if (res.data?.data) {
        setPreviewData(res.data.data)
      } else {
        setPreviewData({
          ...samplePortfolioData,
          templateId: portfolio.templateId as any,
          username: portfolio.username,
        })
      }
    } catch {
      setPreviewData({
        ...samplePortfolioData,
        templateId: portfolio.templateId as any,
        username: portfolio.username,
      })
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleOpenTemplatePreview = (templateId: string) => {
    const meta = getTemplateMeta(templateId)
    setPreviewTitle(meta.name)
    setPreviewTemplateId(templateId)
    setPreviewPortfolioId(null)
    setPreviewIsTemplate(true)
    setPreviewDevice("desktop")
    setPreviewData({
      ...samplePortfolioData,
      templateId: templateId as any,
    })
    setPreviewLoading(false)
    setPreviewModalOpen(true)
  }

  const liveUrl = publishedPortfolio ? `${window.location.origin}/${publishedPortfolio.username}` : ""

  const handleCopyLiveUrl = () => {
    if (!liveUrl) return
    navigator.clipboard.writeText(liveUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-rule)]">
            <div>
              <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-[var(--color-ink)]">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-0.5">
                {user?.name ? `${user.name}’s workspace` : "Manage and deploy your portfolios"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Button>
              {portfolios.length > 0 && (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New portfolio
                </Button>
              )}
            </div>
          </div>

          {statusNotice && (
            <div
              className={`p-3 rounded-input text-xs sm:text-sm flex items-center justify-between border ${
                statusNotice.type === "success"
                  ? "bg-[var(--color-paper-2)] text-[var(--color-success)] border-emerald-500/30"
                  : "bg-[var(--color-paper-2)] text-[var(--color-error)] border-[var(--color-error)]"
              }`}
            >
              <span>{statusNotice.text}</span>
              <button
                type="button"
                onClick={() => setStatusNotice(null)}
                className="opacity-70 hover:opacity-100 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {portfolios.length > 0 && publishedPortfolio && (
            <Card className="rounded-card border border-emerald-500/30 bg-emerald-500/[0.03]">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Badge variant="success" className="text-[10px]">
                        Live Portfolio
                      </Badge>
                      <span className="text-xs text-[var(--color-muted)]">
                        {getTemplateMeta(publishedPortfolio.templateId).name}
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-lg">
                      {publishedPortfolio.websiteTitle || `${publishedPortfolio.username}'s Portfolio`}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => handleOpenPortfolioPreview(publishedPortfolio)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => navigate(`/editor/${publishedPortfolio.id}`)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-[var(--color-paper)] rounded-input border border-[var(--color-rule)] text-xs">
                  <div className="flex items-center gap-2 flex-1 font-mono break-all px-1 text-[var(--color-ink)]">
                    <Globe className="h-3.5 w-3.5 text-[var(--color-success)] shrink-0" />
                    <span>{liveUrl}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={handleCopyLiveUrl}
                    >
                      {copied ? <Check className="h-3 w-3 text-[var(--color-success)]" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-input hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
              <p className="text-xs text-[var(--color-muted)]">Loading portfolios…</p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h2 className="font-display font-semibold text-xl text-[var(--color-ink)]">
                  Create your first portfolio
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-muted)]">
                  Select a layout below to generate your portfolio and start customizing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden flex flex-col justify-between hover:border-[var(--color-rule-2)] transition-[border-color] duration-100 ease-out"
                  >
                    <div className="w-full aspect-[16/10] overflow-hidden bg-[var(--color-paper)] border-b border-[var(--color-rule)]">
                      <img
                        src={`/templates/${tpl.id}.png?v=4`}
                        alt={tpl.name}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-display font-semibold text-base text-[var(--color-ink)]">
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
                          {tpl.tagline}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--color-rule)]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1 text-xs"
                          onClick={() => handleOpenTemplatePreview(tpl.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="w-full text-xs"
                          disabled={isCreating}
                          onClick={() => handleCreatePortfolio(tpl.id)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--color-ink)]">
                  Your Portfolios ({portfolios.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((p) => {
                  const isLive = p.status === "published"
                  const isActionLoading = publishLoadingId === p.id
                  const templateMeta = getTemplateMeta(p.templateId)

                  return (
                    <Card
                      key={p.id}
                      className={`rounded-card flex flex-col justify-between border ${
                        isLive
                          ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                          : "border-[var(--color-rule)] bg-[var(--color-paper-2)] hover:border-[var(--color-rule-2)]"
                      }`}
                    >
                      <CardHeader className="p-4 pb-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[var(--color-muted)]">
                            {templateMeta.name}
                          </span>
                          <span className="text-xs text-[var(--color-muted)] font-mono">
                            {isLive ? "Published" : "Draft"}
                          </span>
                        </div>

                        <div>
                          <CardTitle className="text-base truncate">
                            {p.websiteTitle || `@${p.username}`}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs mt-0.5">
                            /{p.username}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-rule)]">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1 text-xs"
                            onClick={() => handleOpenPortfolioPreview(p)}
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="w-full gap-1 text-xs"
                            onClick={() => navigate(`/editor/${p.id}`)}
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-rule)]">
                          <Button
                            variant={isLive ? "outline" : "default"}
                            size="sm"
                            className="flex-1 gap-1 text-xs"
                            onClick={() => handleTogglePublish(p)}
                            disabled={isActionLoading}
                          >
                            {isLive ? "Unpublish" : "Publish Live"}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[var(--color-error)] hover:bg-[var(--color-paper-3)] px-2"
                            title="Delete portfolio"
                            onClick={() => {
                              setPortfolioToDelete(p)
                              setDeleteError(null)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {previewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio Preview"
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-[var(--color-paper)]"
        >
          <header className="h-14 px-4 sm:px-6 border-b border-[var(--color-rule)] flex items-center justify-between bg-[var(--color-paper-2)] shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5"
                onClick={() => setPreviewModalOpen(false)}
                aria-label="Exit preview"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exit Preview
              </Button>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--color-rule)] min-w-0">
                <Badge variant="outline" className="text-xs shrink-0">
                  {previewIsTemplate ? "Template" : "Portfolio"}
                </Badge>
                <h2 className="text-sm font-semibold truncate text-[var(--color-ink)]">
                  {previewTitle}
                </h2>
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

            <div className="flex items-center gap-2 shrink-0">
              {previewIsTemplate ? (
                <Button
                  size="sm"
                  className="text-xs h-8"
                  disabled={isCreating}
                  onClick={() => handleCreatePortfolio(previewTemplateId)}
                >
                  Start with this layout
                </Button>
              ) : (
                previewPortfolioId && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1 hidden sm:inline-flex"
                      onClick={() => window.open(`/preview/${previewPortfolioId}`, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Tab
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs h-8 gap-1"
                      onClick={() => {
                        setPreviewModalOpen(false)
                        navigate(`/editor/${previewPortfolioId}`)
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                  </>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1"
                onClick={() => setPreviewModalOpen(false)}
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
                setPreviewModalOpen(false)
              }
            }}
          >
            {previewLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
                <p className="text-xs text-[var(--color-muted)]">Loading preview…</p>
              </div>
            ) : previewData ? (
              <ResponsivePreviewFrame
                device={previewDevice}
                isDark={resolvedTheme === "dark"}
                title="Portfolio Preview"
              >
                <TemplateRenderer data={previewData} />
              </ResponsivePreviewFrame>
            ) : null}
          </main>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-card bg-[var(--color-paper-2)] border border-[var(--color-rule-2)] shadow-[var(--shadow-card)] p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-rule)] shrink-0">
              <div>
                <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">New portfolio</h3>
                <p className="text-xs text-[var(--color-muted)]">Select a layout style to begin.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateSearch("")
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] p-1 rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative w-full shrink-0">
              <Search className="h-3 w-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <Input
                placeholder="Search templates by name, style, or tech stack..."
                value={createSearch}
                onChange={(e) => setCreateSearch(e.target.value)}
                className="pl-7 h-8 text-xs bg-[var(--color-paper)] w-full"
              />
              {createSearch && (
                <button
                  onClick={() => setCreateSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  aria-label="Clear search"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>

            <div className="overflow-y-auto pr-1 flex-1 no-scrollbar">
              {modalTemplates.length === 0 ? (
                <div className="text-center py-10 text-xs text-[var(--color-muted)]">
                  No layouts match your filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                  {modalTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="group rounded-input border border-[var(--color-rule)] bg-[var(--color-paper)] overflow-hidden flex flex-col justify-between hover:border-[var(--color-rule-2)] transition-[border-color] duration-100 ease-out"
                    >
                      <div className="w-full aspect-[16/10] overflow-hidden bg-[var(--color-paper-2)] border-b border-[var(--color-rule)]">
                        <img
                          src={`/templates/${tpl.id}.png?v=4`}
                          alt={tpl.name}
                          className="w-full h-full object-cover object-top select-none pointer-events-none"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-display font-semibold text-sm text-[var(--color-ink)]">{tpl.name}</h4>
                          <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
                            {tpl.tagline}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-rule)]">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1 text-xs"
                            onClick={() => {
                              setShowCreateModal(false)
                              handleOpenTemplatePreview(tpl.id)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isCreating}
                            onClick={() => handleCreatePortfolio(tpl.id)}
                          >
                            {isCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Select"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {portfolioToDelete && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-card bg-[var(--color-paper-2)] border border-[var(--color-rule-2)] shadow-[var(--shadow-card)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[var(--color-ink)]">Delete portfolio</h3>
              <button
                type="button"
                onClick={() => {
                  setPortfolioToDelete(null)
                  setDeleteError(null)
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Are you sure you want to delete <span className="font-mono font-semibold text-[var(--color-ink)]">@{portfolioToDelete.username}</span>? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="p-2.5 rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPortfolioToDelete(null)
                  setDeleteError(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeletePortfolio}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
