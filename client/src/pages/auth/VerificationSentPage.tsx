import { useLocation, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, ArrowRight, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function VerificationSentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = (location.state as { email?: string; unverifiedNotice?: boolean })?.email || ""
  const isUnverifiedNotice = (location.state as { email?: string; unverifiedNotice?: boolean })?.unverifiedNotice || false

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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-accent)] mb-3">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {isUnverifiedNotice ? "Verification required" : "Check your inbox"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            {isUnverifiedNotice
              ? "Your email address must be verified before accessing Portfolify."
              : "We sent a secure verification link to your email address."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {email ? (
            <div className="p-3 bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-input text-xs font-mono text-[var(--color-ink)] break-all">
              {email}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-muted)]">
              Please check the email address you registered with.
            </p>
          )}

          <div className="p-3.5 bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-input text-xs text-[var(--color-muted)] text-left flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--color-accent)]" />
            <span>
              If you do not see the email in your inbox within a couple of minutes, please check your <strong className="text-[var(--color-ink)]">Spam</strong> or <strong className="text-[var(--color-ink)]">Junk</strong> folder.
            </span>
          </div>

          <div className="text-xs text-[var(--color-muted)] space-y-1.5 text-left bg-[var(--color-paper)] border border-[var(--color-rule)] p-4 rounded-card">
            <p className="font-semibold text-[var(--color-ink)]">Next steps</p>
            <p>1. Open your inbox (or spam folder) and locate the message from Portfolify.</p>
            <p>2. Click the verification button in the email.</p>
            <p>3. Once verified, return to sign in to access your dashboard.</p>
          </div>

          <div className="pt-2">
            <Button size="default" className="w-full gap-2" onClick={() => navigate("/sign-in")}>
              Go to Sign in
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
