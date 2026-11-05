import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { authClient } from "@/services/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KeyRound, Eye, EyeOff, Check, X, AlertCircle, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const passwordHasMinLength = password.length >= 8
  const passwordHasNumber = /\d/.test(password)
  const passwordHasLetter = /[a-zA-Z]/.test(password)
  const passwordMatches = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("Reset token is missing from the URL.")
      return
    }

    if (!passwordHasMinLength || !passwordHasNumber || !passwordHasLetter) {
      setErrorMessage("Please fulfill all password requirements.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (response.error) {
        setErrorMessage(response.error.message || "Failed to reset password. Link may have expired.")
      } else {
        navigate("/sign-in", { state: { passwordResetSuccess: true } })
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.")
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

      <Card className="w-full max-w-md border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)] rounded-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-accent)] mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Create new password
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            Choose a strong password to secure your Portfolify account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--color-ink)]">
                New password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2 space-y-1 text-[11px] text-[var(--color-muted)]">
                  <span className={`flex items-center gap-1 ${passwordHasMinLength ? "text-[var(--color-success)] font-medium" : ""}`}>
                    {passwordHasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    At least 8 characters
                  </span>
                  <span className={`flex items-center gap-1 ${passwordHasNumber ? "text-[var(--color-success)] font-medium" : ""}`}>
                    {passwordHasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Contains a number
                  </span>
                  <span className={`flex items-center gap-1 ${passwordHasLetter ? "text-[var(--color-success)] font-medium" : ""}`}>
                    {passwordHasLetter ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Contains letters
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--color-ink)]">
                Confirm new password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${passwordMatches ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
                  {passwordMatches ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            <Button type="submit" size="default" className="w-full" disabled={loading}>
              {loading ? "Updating password..." : "Reset password"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs">
            <Link
              to="/sign-in"
              className="text-[var(--color-accent)] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
            >
              Return to Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
