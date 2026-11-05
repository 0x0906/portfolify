export type TemplateId = "minimal" | "terminal" | "brutalist" | "glassmorphic" | "luxury"

export interface TemplateDefinition {
  id: TemplateId
  name: string
  category: "Minimal" | "Developer" | "Creative" | "Modern" | "All"
  tagline: string
  description: string
  tags: string[]
  features: string[]
  accentColor: string
  accentBg: string
  isPopular?: boolean
  isNew?: boolean
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "Minimal",
  "Developer",
  "Creative",
  "Modern",
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "minimal",
    name: "Minimalist Design",
    category: "Minimal",
    tagline: "Swiss-inspired editorial minimalism with generous whitespace, confident typography, and refined grid",
    description:
      "A sophisticated, distraction-free aesthetic rooted in modernist design principles. Features dramatic typography, refined editorial projects, and an uncluttered reading experience.",
    tags: ["Minimalist", "Editorial", "Modernist", "High Contrast", "Whitespace"],
    features: [
      "Editorial typography with generous whitespace",
      "Hairline navigation & ambient contrast",
      "Responsive editorial project showcase",
      "Independent education & certification records",
      "Light and dark theme support",
    ],
    accentColor: "border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100",
    accentBg: "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
    isPopular: true,
  },
  {
    id: "terminal",
    name: "Dev Terminal",
    category: "Developer",
    tagline: "Monospace console layout with interactive command shell and clean timeline",
    description:
      "Clean monospace layout with an interactive command bar, project showcases, skills matrix, and structured timeline.",
    tags: ["Terminal", "Developer", "Monospace", "Interactive"],
    features: [
      "Monospace typography",
      "Interactive command navigation",
      "Structured career history",
      "Light and dark mode",
      "One-click contact",
    ],
    accentColor: "border-emerald-500/40 hover:border-emerald-400",
    accentBg: "bg-emerald-500/10 text-emerald-400",
    isPopular: true,
  },
  {
    id: "brutalist",
    name: "Neo-Brutalist",
    category: "Creative",
    tagline: "High-energy brutalist aesthetics with chunky solid borders, hard offset shadows, and vibrant color blocks",
    description:
      "Authentic neo-brutalist showcase featuring chunky solid borders, hard offset drop shadows, expressive typography, and a curated palette of vibrant tones that carry each other across light and dark mode.",
    tags: ["Neo-Brutalism", "Bold Typography", "Creative", "Vibrant Palette", "Offset Shadows"],
    features: [
      "Chunky solid borders & offset shadows",
      "Harmonized 5-tone vibrant color palette",
      "Interactive category filtering",
      "Rich dark mode with deep surface depth",
      "Clean high-contrast typography",
    ],
    accentColor: "border-black hover:border-[#FF6B6B]",
    accentBg: "bg-[#FFDE59] text-black font-black",
    isPopular: true,
    isNew: true,
  },
  {
    id: "glassmorphic",
    name: "Glassmorphism Aurora",
    category: "Modern",
    tagline: "Luminous frosted glass surfaces with ambient aurora gradients and sleek depth",
    description:
      "A modern translucent design system with frosted glass panels, ambient lighting, smooth reflections, and crisp typography.",
    tags: ["Glassmorphism", "Frosted Glass", "Aurora", "Translucent", "Modern"],
    features: [
      "Translucent frosted glass cards",
      "Ambient aurora glow lighting",
      "Floating frosted navigation bar",
      "Interactive project filtering",
      "Light and dark mode",
    ],
    accentColor: "border-cyan-400/40 hover:border-cyan-500",
    accentBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    isPopular: true,
    isNew: true,
  },
  {
    id: "luxury",
    name: "Luxury Minimalism",
    category: "Minimal",
    tagline: "Haute-couture dark aesthetics with velvet obsidian, antique gold accents, and bespoke typography",
    description:
      "A timeless haute-aesthetic template inspired by luxury ateliers and art galleries. Features generous breathing room, refined obsidian surfaces, antique gold accents, gallery-curated project showcases, and bespoke typography.",
    tags: ["Quiet Luxury", "Velvet Obsidian", "Antique Gold", "Atelier", "Dark Aesthetic"],
    features: [
      "Velvet obsidian and antique gold palette",
      "Delicate champagne gold hairline accents",
      "Gallery-curated project showcase",
      "Chronicle experience and education records",
      "Editorial typography with generous whitespace",
    ],
    accentColor: "border-[#D4AF37]/50 hover:border-[#D4AF37]",
    accentBg: "bg-[#0C0B0A] text-[#F5F1EB]",
    isPopular: true,
    isNew: true,
  },
]

export function getTemplateMeta(id?: string): TemplateDefinition {
  const found = TEMPLATES.find((t) => t.id === id)
  if (found) return found
  return TEMPLATES[0]
}
