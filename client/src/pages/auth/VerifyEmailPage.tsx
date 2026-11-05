import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { authClient } from "@/services/auth-client"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, Mail, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, refreshSession } = useAuth()

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
  const token =
    searchParams.get("token") ||
    searchParams.get("token_hash") ||
    searchParams.get("code") ||
    searchParams.get("verification_token") ||
    hashParams.get("token") ||
    hashParams.get("token_hash")

  const isAlreadyVerifiedQuery = searchParams.get("verified") === "true"

  const [status, setStatus] = useState<"loading" | "success" | "error" | "prompt">(
    token ? "loading" : isAlreadyVerifiedQuery || user?.emailVerified ? "success" : "prompt"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resendEmail, setResendEmail] = useState(user?.email || "")
  const [resending, setResending] = useState(false)
  const [resendFeedback, setResendFeedback] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let timer: any
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  useEffect(() => {
    if (isAlreadyVerifiedQuery || user?.emailVerified) {
      setStatus("success")
      return
    }

    if (!token) {
      setStatus("prompt")
      return
    }

    const handleVerify = async () => {
      setStatus("loading")
      try {
        const response = await (authClient as any).verifyEmail({
          query: { token },
        })

        if (response && response.error) {
          setStatus("error")
          setErrorMessage(response.error.message || "This verification link is invalid or has expired.")
        } else {
          setStatus("success")
          await refreshSession()
        }
      } catch {
        setStatus("error")
        setErrorMessage("An error occurred during verification. Please request a new link.")
      }
    }

    handleVerify()
  }, [token, isAlreadyVerifiedQuery, user?.emailVerified, refreshSession])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail || cooldown > 0) return

    setResending(true)
    setResendFeedback(null)

    try {
      const response = await (authClient as any).sendVerificationEmail({
        email: resendEmail,
        callbackURL: `${window.location.origin}/verify-email`,
      })

      if (response && response.error) {
        setResendFeedback(response.error.message || "Failed to send verification link.")
      } else {
        setResendFeedback("A new verification link has been dispatched to your email.")
        setCooldown(60)
      }
    } catch {
      setResendFeedback("Unable to send verification email. Please check your connection.")
    } finally {
      setResending(false)
    }
  }

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
        {status === "loading" && (
          <CardHeader className="pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-accent)] mb-3">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              Verifying your email
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
              Validating verification token...
            </CardDescription>
          </CardHeader>
        )}

        {status === "success" && (
          <>
            <CardHeader className="pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-emerald-500/30 text-[var(--color-success)] mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Email verified
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
                Your email address has been verified and your account is active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="default" className="w-full gap-2" onClick={() => navigate("/dashboard")}>
                Continue to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </>
        )}

        {status === "prompt" && (
          <>
            <CardHeader className="pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-accent)] mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Email verification
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
                Click the link inside the confirmation email, or request a new verification link below.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-left">
              {resendFeedback && (
                <div className="p-3 rounded-input bg-[var(--color-paper)] border border-emerald-500/30 text-[var(--color-success)] text-xs flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{resendFeedback}</span>
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--color-ink)]">
                    Registered email address
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    disabled={resending}
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  size="default"
                  className="w-full gap-2"
                  disabled={resending || cooldown > 0}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Send verification link"}
                </Button>
              </form>

              <div className="pt-2 text-center text-xs">
                <Link
                  to="/sign-in"
                  className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
                >
                  Return to Sign in
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] mb-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Verification failed
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
                {errorMessage || "The verification link may have expired or is invalid."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="default" className="w-full" onClick={() => setStatus("prompt")}>
                Request a new link
              </Button>
              <Button variant="outline" size="default" className="w-full" onClick={() => navigate("/sign-in")}>
                Return to Sign in
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
