import { useNavigate } from "react-router-dom"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full text-center rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)]">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-error)] mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[var(--color-muted)]">
              500 ERROR
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
              Internal service error
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              The server encountered an error processing your request. Reload the page or return to the application home.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reload page
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="h-3.5 w-3.5" />
              Return home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
