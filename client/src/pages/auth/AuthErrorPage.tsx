import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function AuthErrorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const error = searchParams.get("error") || "An authentication error occurred."

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-12">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input px-1"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-[var(--color-ink)] text-[var(--color-paper)] font-display text-xs font-bold">
          P
        </span>
        <span className="font-display font-semibold text-lg tracking-tight text-[var(--color-ink)]">
          Portfolify
        </span>
      </Link>

      <Card className="w-full max-w-md border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)] rounded-card text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Authentication error
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            We encountered a problem while verifying your session
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-3 bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-input text-xs text-[var(--color-ink)] font-mono">
            {error}
          </div>

          <Button size="default" className="w-full gap-2" onClick={() => navigate("/sign-in")}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
