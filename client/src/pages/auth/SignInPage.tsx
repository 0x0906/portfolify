import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { authClient } from "@/services/auth-client"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { validateEmail } from "@/utils/validation"

export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshSession } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.")
      return
    }

    const emailCheck = validateEmail(email)
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const response = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      })

      if (response.error) {
        const errMsg = (response.error.message || "").toLowerCase()
        const errCode = String((response.error as any).code || "").toLowerCase()
        if (errMsg.includes("verify") || errCode.includes("verify") || response.error.status === 403) {
          navigate("/verification-sent", { state: { email, unverifiedNotice: true } })
        } else {
          setErrorMessage(response.error.message || "Invalid email or password.")
        }
      } else {
        await refreshSession()
        const returnTo = (location.state as any)?.returnTo
        const savedTemplate = localStorage.getItem("selected_template_id")
        if (returnTo) {
          navigate(returnTo)
        } else if (savedTemplate) {
          navigate("/editor")
        } else {
          navigate("/dashboard")
        }
      }
    } catch {
      setErrorMessage("Unable to sign in. Please check your connection.")
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
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[var(--color-muted)]">
            Enter your credentials to manage and publish your portfolio
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[var(--color-ink)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--color-accent)] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-muted)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-input border-[var(--color-rule-2)] text-[var(--color-accent)] focus:ring-[var(--color-focus)] h-4 w-4"
                />
                Remember this device
              </label>
            </div>

            <Button type="submit" size="default" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--color-muted)]">
            Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-[var(--color-accent)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
