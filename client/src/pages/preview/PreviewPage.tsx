import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "@/services/api"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import { ResponsivePreviewFrame } from "@/components/preview/ResponsivePreviewFrame"
import { samplePortfolioData } from "@/templates/sampleData"
import type { PortfolioData } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useTheme } from "@/context/ThemeContext"
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Edit3,
  Send,
  Loader2,
  AlertCircle,
  EyeOff,
  ExternalLink,
} from "lucide-react"

export function PreviewPage() {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const { id } = useParams<{ id?: string }>()
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [loading, setLoading] = useState(true)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [portfolioMeta, setPortfolioMeta] = useState<any>(null)
  const [publishing, setPublishing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setLoading(true)
        const endpoint = id ? `/portfolio/${id}` : "/portfolio/me"
        const res = await api.get(endpoint)
        if (res.data && res.data.portfolio) {
          setPortfolioMeta(res.data.portfolio)
          setPortfolioData(res.data.data)
        } else {
          setPortfolioData(samplePortfolioData)
        }
      } catch {
        setPortfolioData(samplePortfolioData)
      } finally {
        setLoading(false)
      }
    }

    fetchDraft()
  }, [id])

  const handleTogglePublish = async () => {
    if (!portfolioMeta) return
    setPublishing(true)
    setFeedback(null)

    try {
      if (portfolioMeta.status === "published") {
        await api.post(`/portfolio/${portfolioMeta.id}/unpublish`)
        setPortfolioMeta((prev: any) => ({ ...prev, status: "unpublished" }))
        setFeedback("Portfolio has been unpublished.")
      } else {
        const res = await api.post(`/portfolio/${portfolioMeta.id}/publish`)
        setPortfolioMeta((prev: any) => ({
          ...prev,
          status: "published",
          publishedAt: res.data.publishedAt,
        }))
        setFeedback("Portfolio successfully published live.")
      }
    } catch {
      setFeedback("Failed to update publication status.")
    } finally {
      setPublishing(false)
    }
  }

  const liveUrl = portfolioMeta?.username ? `${window.location.origin}/${portfolioMeta.username}` : ""

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper-3)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-[var(--z-sticky-nav)] flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate("/dashboard")
              }
            }}
            aria-label="Exit preview"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Exit Preview
          </Button>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--color-rule)]">
            <span className="font-display font-semibold text-sm text-[var(--color-ink)]">Preview</span>
            {portfolioMeta && (
              <Badge
                variant={portfolioMeta.status === "published" ? "success" : "secondary"}
                className="text-[10px]"
              >
                {portfolioMeta.status === "published" ? "Live" : "Draft"}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 border border-[var(--color-rule)] rounded-input p-0.5 bg-[var(--color-paper)]">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`h-7 px-2.5 rounded-input text-xs flex items-center gap-1 transition-[background-color,color] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
              deviceMode === "desktop"
                ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`h-7 px-2.5 rounded-input text-xs flex items-center gap-1 transition-[background-color,color] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
              deviceMode === "tablet"
                ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`h-7 px-2.5 rounded-input text-xs flex items-center gap-1 transition-[background-color,color] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
              deviceMode === "mobile"
                ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {portfolioMeta?.status === "published" && liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-input hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              Visit Live <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8"
            onClick={() => navigate(portfolioMeta?.id ? `/editor/${portfolioMeta.id}` : "/editor")}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Button>
          {portfolioMeta && (
            <Button
              variant={portfolioMeta.status === "published" ? "outline" : "default"}
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={handleTogglePublish}
              disabled={publishing}
            >
              {portfolioMeta.status === "published" ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Unpublish
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Publish Live
                </>
              )}
            </Button>
          )}
        </div>
      </header>

      {feedback && (
        <div className="bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] text-[var(--color-ink)] py-2 text-center text-xs font-medium">
          {feedback}
        </div>
      )}

      <main className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-muted)]">Rendering preview...</span>
          </div>
        ) : !portfolioData ? (
          <div className="text-center p-8">
            <AlertCircle className="h-6 w-6 text-[var(--color-error)] mx-auto mb-2" />
            <p className="text-xs text-[var(--color-muted)]">No portfolio content available.</p>
          </div>
        ) : (
          <ResponsivePreviewFrame
            device={deviceMode}
            isDark={resolvedTheme === "dark"}
            title="Portfolio Preview"
          >
            <TemplateRenderer
              data={{
                ...portfolioData,
                themeSettings: {
                  ...portfolioData.themeSettings,
                  themeMode: resolvedTheme,
                },
              }}
            />
          </ResponsivePreviewFrame>
        )}
      </main>
    </div>
  )
}
