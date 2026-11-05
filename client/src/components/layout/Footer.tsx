import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] pt-12 pb-10 text-[var(--color-muted)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[var(--color-rule)]">
          <div>
            <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)] block">
              Portfolify
            </span>
            <p className="mt-2 text-xs text-[var(--color-muted)] max-w-sm">
              Developer portfolio showcase and hosting platform.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6 text-xs">
            <Link
              to="/templates"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              Templates
            </Link>
            <Link
              to="/features"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm transition-colors duration-100 ease-out motion-reduce:transition-none"
            >
              Terms
            </Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} Portfolify</p>
          <p className="text-[11px] text-[var(--color-muted)]">Developer portfolio platform</p>
        </div>
      </div>
    </footer>
  )
}
