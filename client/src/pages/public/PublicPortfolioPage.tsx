import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/services/api"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import type { PortfolioData } from "@/types/portfolio"
import { sanitizeImg } from "@/utils/url"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, Home, EyeOff } from "lucide-react"

export function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [errorType, setErrorType] = useState<"not_found" | "unpublished" | null>(null)

  useEffect(() => {
    if (!username) {
      setErrorType("not_found")
      setLoading(false)
      return
    }

    try {
      sessionStorage.removeItem(`cache_portfolio_${username}`)
      sessionStorage.removeItem(`cache_portfolio_${username.toLowerCase()}`)
    } catch {}

    let isMounted = true

    const fetchPublicPortfolio = async () => {
      setLoading(true)
      setErrorType(null)
      setPortfolioData(null)

      try {
        const cleanUsername = username.toLowerCase().trim()
        const res = await api.get(`/public/${encodeURIComponent(cleanUsername)}`, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        if (!isMounted) return

        if (res.data && res.data.data) {
          document.documentElement.classList.remove("dark")
          setPortfolioData(res.data.data)
          const name = res.data.data.profile?.fullName || username
          const title = res.data.data.profile?.professionalTitle || "Portfolio"
          document.title = res.data.data.websiteTitle || `${name} - ${title} | Portfolify`
          const sanitizedFavicon = sanitizeImg(res.data.data.faviconUrl)
          if (sanitizedFavicon) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
            if (!link) {
              link = document.createElement("link")
              link.rel = "shortcut icon"
              document.getElementsByTagName("head")[0].appendChild(link)
            }
            link.href = sanitizedFavicon
          }
        } else {
          setPortfolioData(null)
          setErrorType("not_found")
        }
      } catch (err: any) {
        if (!isMounted) return
        setPortfolioData(null)
        if (err.response?.status === 404 && err.response?.data?.error === "Unavailable") {
          setErrorType("unpublished")
        } else {
          setErrorType("not_found")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPublicPortfolio()

    return () => {
      isMounted = false
    }
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (errorType === "unpublished") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4">
        <div className="max-w-md w-full text-center space-y-6 rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)] p-8 sm:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-muted)] mx-auto">
            <EyeOff className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[var(--color-muted)]">
              UNPUBLISHED
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              Portfolio is unpublished
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              This developer showcase is currently in draft mode or has been taken down by its author.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button size="sm" className="gap-2" onClick={() => navigate("/")}>
              <Home className="h-3.5 w-3.5" />
              Return to Portfolify
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (errorType === "not_found" || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4">
        <div className="max-w-md w-full text-center space-y-6 rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)] p-8 sm:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-error)] mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[var(--color-muted)]">
              404 NOT FOUND
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              Portfolio not found
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              The portfolio "@{username}" does not exist or may have been renamed.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button size="sm" className="gap-2" onClick={() => navigate("/")}>
              <Home className="h-3.5 w-3.5" />
              Return to Portfolify
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <TemplateRenderer data={portfolioData} />
}
