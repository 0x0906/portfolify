import { useParams, useSearchParams } from "react-router-dom"
import { TemplateRenderer } from "@/templates/TemplateRenderer"
import { samplePortfolioData } from "@/templates/sampleData"
import type { TemplateId } from "@/templates/templateRegistry"

export function TemplatePreviewStandalone() {
  const { templateId } = useParams<{ templateId: string }>()
  const [searchParams] = useSearchParams()
  const currentId = (templateId || "minimal") as TemplateId

  const requestedTheme = searchParams.get("theme")
  const isDark = requestedTheme === "dark"

  return (
    <div
      id="template-root"
      className="min-h-screen"
    >
      <TemplateRenderer
        data={{
          ...samplePortfolioData,
          templateId: currentId,
          themeSettings: {
            ...samplePortfolioData.themeSettings,
            themeMode: isDark ? "dark" : "light",
          },
        }}
      />
    </div>
  )
}
