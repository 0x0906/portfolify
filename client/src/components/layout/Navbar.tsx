import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] w-full border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] active:opacity-80 rounded-input"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--color-ink)] text-[var(--color-paper)] font-display text-xs font-bold">
            P
          </span>
          <span className="font-display font-semibold text-base tracking-tight text-[var(--color-ink)]">
            Portfolify
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/templates"
            className="hidden sm:inline-block text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] active:text-[var(--color-ink)] transition-colors duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input px-2 py-1 motion-reduce:transition-none"
          >
            Templates
          </Link>
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 py-1 px-1.5 -my-1 rounded-input hover:bg-[var(--color-paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors duration-100 group text-decoration-none"
                title="Go to dashboard"
                aria-label="User profile, go to dashboard"
              >
                <UserAvatar
                  src={user?.image}
                  name={user?.name || user?.email}
                  size="sm"
                  className="transition-transform group-hover:scale-105"
                />
                <span className="max-w-[120px] sm:max-w-[150px] truncate text-xs font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                  {user?.name || user?.email || "Account"}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                onClick={() => signOut()}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs h-8"
                onClick={() => navigate("/sign-up")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
