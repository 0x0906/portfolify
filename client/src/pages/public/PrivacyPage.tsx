import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"

export function PrivacyPage() {
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
              Privacy policy
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-mono">
              Last updated: October 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[var(--color-muted)] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                1. Overview
              </h2>
              <p>
                Portfolify respects your privacy. This policy outlines what information is collected, how it is stored securely, and your rights concerning personal portfolio content and account credentials.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                2. Information collected
              </h2>
              <p>
                When you create an account, we store your email address and name. When creating a portfolio, we store the career entries, project summaries, resume links, and profile photos you explicitly input.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                3. Public vs. private data
              </h2>
              <p>
                Only details you publish under your unique portfolio link are publicly accessible. Account passwords, session tokens, and draft variations remain confidential and encrypted at rest.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                4. Account deletion and data control
              </h2>
              <p>
                You may permanently delete your account and associated portfolios anytime through Account Settings. Deletion purges all associated records and assets immediately.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
