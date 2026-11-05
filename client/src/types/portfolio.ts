export interface ProfileData {
  fullName: string
  professionalTitle: string
  introduction: string
  biography: string
  location: string
  profileImageUrl: string
  publicContactEmail: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  technologies: string[] | string
  imageUrl?: string
  liveUrl?: string
  sourceUrl?: string
  startDate?: string
  endDate?: string
  isFeatured?: boolean
  displayOrder?: number
}

export interface SkillItem {
  id: string
  name: string
  category: string
  level?: "Beginner" | "Intermediate" | "Advanced"
  proficiency?: number
  displayOrder?: number
}

export interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  location?: string
  employmentType?: string
  description?: string
  startDate?: string
  endDate?: string
  displayOrder?: number
}

export interface EducationItem {
  id: string
  institution: string
  degree?: string
  fieldOfStudy?: string
  mark?: string
  location?: string
  startYear?: string
  endYear?: string
  description?: string
  displayOrder?: number
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  issueDate?: string
  credentialUrl?: string
}

export interface SocialLinkItem {
  id: string
  platform: string
  url: string
  displayOrder?: number
}

export interface SectionSettings {
  id?: string
  sectionKey: string
  isVisible: boolean
  displayOrder: number
}

export interface ThemeSettings {
  colorScheme: "blue" | "emerald" | "purple" | "slate" | "amber"
  fontScheme: "inter" | "serif" | "mono"
  themeMode: "light" | "dark" | "system"
}

export interface PortfolioData {
  username?: string
  templateId: "minimal" | "terminal" | "brutalist" | "glassmorphic" | "luxury" | string
  status?: "draft" | "published" | "unpublished"
  publishedAt?: string
  websiteTitle?: string
  faviconUrl?: string
  resumeUrl?: string
  profile: ProfileData
  projects: ProjectItem[]
  skills: SkillItem[]
  experience: ExperienceItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  socialLinks: SocialLinkItem[]
  sections?: SectionSettings[]
  themeSettings: ThemeSettings
}
