import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
          <div className="space-y-3 pb-6 border-b border-[var(--color-rule)]">
            <Badge variant="outline" className="text-xs">
              Legal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              Terms of service
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-mono">
              Last updated: October 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[var(--color-muted)] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                1. Acceptance of terms
              </h2>
              <p>
                By creating an account or accessing Portfolify, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                2. Permitted use
              </h2>
              <p>
                Portfolify is designed to host legitimate personal portfolios, resumes, and project showcases. Users may not upload malicious code, phishing material, or copyright-infringing content.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                3. Usernames and vanity paths
              </h2>
              <p>
                Usernames are allocated on a first-come, non-reserved basis. Portfolify reserves the right to reclaim vanity paths that impersonate individuals, entities, or trademark holders.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                4. Service availability
              </h2>
              <p>
                We strive for continuous availability, but services are provided on an as-is basis. We recommend maintaining backup copies of your project summaries and resume files.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
