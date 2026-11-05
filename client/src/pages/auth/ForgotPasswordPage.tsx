import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { requestPasswordResetEmail } from "@/services/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { validateEmail } from "@/utils/validation"

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const emailCheck = validateEmail(email)
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const response = await requestPasswordResetEmail(
        email,
        `${window.location.origin}/reset-password`
      )

      if (response && response.error) {
        setErrorMessage(response.error.message || "Unable to process request.")
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-12">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors px-2.5 py-1.5 rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign in
        </Link>
      </div>

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
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Forgot password
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            Enter your email to receive a secure password reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-input bg-[var(--color-paper)] border border-emerald-500/30 text-[var(--color-success)] text-xs flex items-start gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  If an account exists for {email}, a password reset link has been dispatched. Please check your inbox.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-4"
                onClick={() => navigate("/sign-in")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {errorMessage && (
                <div className="p-3 rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--color-ink)]">
                  Email address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button type="submit" size="default" className="w-full" disabled={loading}>
                {loading ? "Sending link..." : "Send reset link"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
