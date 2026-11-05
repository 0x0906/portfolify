import { Wrench, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] px-4">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full text-center rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)]">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-accent)] mx-auto">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[var(--color-muted)]">
              SCHEDULED MAINTENANCE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
              System upgrades in progress
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              We are applying system updates and database optimizations. Portfolify will resume normal operations momentarily.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Check again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
