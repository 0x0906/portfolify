import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import {
  Layers,
  Search,
  FileText,
  ShieldCheck,
  Smartphone,
  Palette,
  Zap,
  Globe,
} from "lucide-react"

export function FeaturesPage() {
  const featureList = [
    {
      icon: <Layers className="h-4 w-4" />,
      title: "Modular Section Builder",
      description: "Reorder, toggle, and curate sections for projects, skills, employment timeline, and credentials without schema loss.",
    },
    {
      icon: <Search className="h-4 w-4" />,
      title: "Social Sharing Previews",
      description: "Every public portfolio includes metadata for clean previews when shared on LinkedIn, X, and messaging apps.",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Direct Resume Hosting",
      description: "Link or upload verified PDF resumes. Portfolify serves direct, shareable download links for technical recruiters.",
    },
    {
      icon: <Palette className="h-4 w-4" />,
      title: "Curated Technical Themes",
      description: "Architected color schemes and typographic scales paired for high legibility, contrast fidelity, and technical focus.",
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      title: "Cross-Device Responsiveness",
      description: "Precision-tested across mobile handhelds, tablets, and wide monitors to guarantee your work presents cleanly everywhere.",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      title: "Direct Username Routing",
      description: "Claim clean vanity paths like portfolify.dev/username ready for your GitHub bio, email signature, and resume header.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      title: "Draft vs. Published Workflow",
      description: "Iterate privately in draft mode with live simulated devices. Publish updates only when every detail is verified.",
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Instant Server-Rendered Delivery",
      description: "Pre-rendered HTML ensures recruiters and visitors see your work immediately without client-side loading spinners.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink)]">
              Platform features
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              Technical capabilities designed specifically for software engineers, systems programmers, and technical leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureList.map((item, idx) => (
              <Card
                key={idx}
                className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] hover:border-[var(--color-rule-2)] transition-[border-color] duration-100 ease-out"
              >
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                    {item.icon}
                  </div>
                  <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
