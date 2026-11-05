import { lazy, Suspense } from "react"
import type { PortfolioData } from "@/types/portfolio"

const MinimalTemplate = lazy(() => import("./MinimalTemplate").then((m) => ({ default: m.MinimalTemplate })))
const TerminalTemplate = lazy(() => import("./TerminalTemplate").then((m) => ({ default: m.TerminalTemplate })))
const BrutalistTemplate = lazy(() => import("./BrutalistTemplate").then((m) => ({ default: m.BrutalistTemplate })))
const GlassmorphicTemplate = lazy(() => import("./GlassmorphicTemplate").then((m) => ({ default: m.GlassmorphicTemplate })))
const LuxuryTemplate = lazy(() => import("./LuxuryTemplate").then((m) => ({ default: m.LuxuryTemplate })))

interface TemplateRendererProps {
  data: PortfolioData
}

export function TemplateRenderer({ data }: TemplateRendererProps) {
  const templateId = data.templateId || "minimal"

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-paper)] text-[var(--color-muted)] text-sm font-mono">
          Loading portfolio…
        </div>
      }
    >
      {templateId === "terminal" ? (
        <TerminalTemplate data={data} />
      ) : templateId === "brutalist" ? (
        <BrutalistTemplate data={data} />
      ) : templateId === "glassmorphic" ? (
        <GlassmorphicTemplate data={data} />
      ) : templateId === "luxury" ? (
        <LuxuryTemplate data={data} />
      ) : (
        <MinimalTemplate data={data} />
      )}
    </Suspense>
  )
}
