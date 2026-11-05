import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Terminal, Code2 } from "lucide-react"

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink)]">
              About Portfolify
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              We build portfolio tooling for software developers who value speed, scannability, and structural fidelity over marketing fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardContent className="p-6 sm:p-8 space-y-3">
                <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Target className="h-4 w-4" />
                </div>
                <h2 className="font-display font-semibold text-lg text-[var(--color-ink)]">
                  The mission
                </h2>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  Every engineer deserves a public work showcase without spending weeks wrestling CSS resets, DNS records, and build pipelines.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardContent className="p-6 sm:p-8 space-y-3">
                <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                  <Terminal className="h-4 w-4" />
                </div>
                <h2 className="font-display font-semibold text-lg text-[var(--color-ink)]">
                  Engineered for evaluation
                </h2>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  Hiring managers review portfolios in under 30 seconds. We structure every layout to surface system architecture, shipped repositories, and verified impact first.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[var(--color-rule)]">
              <div className="h-8 w-8 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                <Code2 className="h-4 w-4" />
              </div>
              <h2 className="font-display font-semibold text-xl text-[var(--color-ink)]">
                Why we built Portfolify
              </h2>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Standard site builders produce bloated JavaScript bundles, broken mobile layouts, and generic agency templates that fail to communicate technical competency.
            </p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Portfolify provides layout templates designed around engineering disciplines: backend telemetry consoles, monospace terminal prompts, minimal broadsheets, and high-density bento grids.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
