import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authClient } from "@/services/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Check, X, AlertCircle, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { validateEmail } from "@/utils/validation"

export function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const passwordHasMinLength = password.length >= 8
  const passwordHasNumber = /\d/.test(password)
  const passwordHasSpecialOrLetter = /[a-zA-Z]/.test(password)
  const passwordMatches = password === confirmPassword && confirmPassword.length > 0
  const passwordStrengthScore = [passwordHasMinLength, passwordHasNumber, passwordHasSpecialOrLetter].filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.")
      return
    }

    const emailCheck = validateEmail(email)
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.")
      return
    }

    if (!passwordHasMinLength || !passwordHasNumber || !passwordHasSpecialOrLetter) {
      setErrorMessage("Please meet all password strength requirements.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    if (!agreeTerms) {
      setErrorMessage("You must accept the Terms of Service and Privacy Policy.")
      return
    }

    setLoading(true)

    try {
      const response = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: `${window.location.origin}/verify-email`,
      })

      if (response.error) {
        setErrorMessage(response.error.message || "Failed to create account. Please try again.")
      } else {
        navigate("/verification-sent", { state: { email } })
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-12">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors px-2.5 py-1.5 rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
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
          <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Create your account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            Join Portfolify to build and publish your personal portfolio
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
                Full name
              </label>
              <Input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
            </div>

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
                autoComplete="email"
                spellCheck={false}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--color-ink)]">
                Password
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
                  autoComplete="new-password"
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
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5 w-full bg-[var(--color-paper-3)] rounded-pill overflow-hidden">
                    <div
                      className={`h-full transition-colors duration-300 ${
                        passwordStrengthScore === 1
                          ? "w-1/3 bg-[var(--color-error)]"
                          : passwordStrengthScore === 2
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-emerald-600"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-[var(--color-muted)] pt-1">
                    <span className={`flex items-center gap-1 ${passwordHasMinLength ? "text-[var(--color-success)] font-medium" : ""}`}>
                      {passwordHasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      At least 8 characters
                    </span>
                    <span className={`flex items-center gap-1 ${passwordHasNumber ? "text-[var(--color-success)] font-medium" : ""}`}>
                      {passwordHasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Contains at least one number
                    </span>
                    <span className={`flex items-center gap-1 ${passwordHasSpecialOrLetter ? "text-[var(--color-success)] font-medium" : ""}`}>
                      {passwordHasSpecialOrLetter ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Contains letters
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--color-ink)]">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${passwordMatches ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
                  {passwordMatches ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-input border-[var(--color-rule-2)] text-[var(--color-accent)] focus:ring-[var(--color-focus)]"
              />
              <label htmlFor="terms" className="text-xs text-[var(--color-muted)] leading-normal cursor-pointer select-none">
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="text-[var(--color-accent)] underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" className="text-[var(--color-accent)] underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button type="submit" size="default" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--color-muted)]">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-[var(--color-accent)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
