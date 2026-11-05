import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your session…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }

  if (import.meta.env.PROD && user && !user.emailVerified) {
    return (
      <Navigate
        to="/verification-sent"
        state={{ email: user.email, unverifiedNotice: true }}
        replace
      />
    )
  }

  return children
}
