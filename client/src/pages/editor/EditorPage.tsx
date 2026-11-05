import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { api } from "@/services/api"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PortfolioData, ProjectItem, SkillItem, ExperienceItem, EducationItem, CertificationItem, SocialLinkItem } from "@/types/portfolio"
import {
  User,
  FolderGit2,
  Briefcase,
  Code2,
  Settings,
  Eye,
  Save,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react"
import { ImageUploadField } from "@/components/portfolio/ImageUploadField"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { validateEmail } from "@/utils/validation"
import { TEMPLATES } from "@/templates/templateRegistry"
import { SkillSelectDropdown } from "@/components/portfolio/SkillSelectDropdown"
import { LevelSelectDropdown } from "@/components/portfolio/LevelSelectDropdown"

export function EditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "experience" | "skills" | "settings">("profile")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [portfolioId, setPortfolioId] = useState<string | null>(null)
  const [portfolioStatus, setPortfolioStatus] = useState<string>("draft")

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [formData, setFormData] = useState<PortfolioData>({
    templateId: "minimal",
    websiteTitle: "",
    faviconUrl: "",
    profile: {
      fullName: "",
      professionalTitle: "",
      introduction: "",
      biography: "",
      location: "",
      profileImageUrl: "",
      publicContactEmail: "",
    },
    projects: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    socialLinks: [],
    themeSettings: {
      colorScheme: "blue",
      fontScheme: "inter",
      themeMode: "system",
    },
    resumeUrl: "",
  })

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const endpoint = id ? `/portfolio/${id}` : "/portfolio/me"
        const res = await api.get(endpoint)
        if (res.data && res.data.portfolio) {
          setPortfolioId(res.data.portfolio.id)
          setPortfolioStatus(res.data.portfolio.status)
          const data = res.data.data
          setFormData((prev) => ({
            ...prev,
            ...data,
            profile: {
              ...prev.profile,
              ...(data?.profile || {}),
            },
            themeSettings: {
              ...prev.themeSettings,
              ...(data?.themeSettings || {}),
            },
            projects: Array.isArray(data?.projects) ? data.projects : prev.projects,
            skills: Array.isArray(data?.skills) ? data.skills : prev.skills,
            experience: Array.isArray(data?.experience) ? data.experience : prev.experience,
            education: Array.isArray(data?.education) ? data.education : prev.education,
            certifications: Array.isArray(data?.certifications) ? data.certifications : prev.certifications,
            socialLinks: Array.isArray(data?.socialLinks) ? data.socialLinks : prev.socialLinks,
          }))
        } else {
          const selectedTemplate = localStorage.getItem("selected_template_id") || "minimal"
          try {
            const createRes = await api.post("/portfolio", { templateId: selectedTemplate })
            if (createRes.data?.portfolio?.id) {
              setPortfolioId(createRes.data.portfolio.id)
              setPortfolioStatus("draft")
              setFormData((prev) => ({
                ...prev,
                templateId: selectedTemplate as any,
                websiteTitle: "",
              }))
              return
            }
          } catch {}
          navigate("/dashboard")
        }
      } catch {
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [id, navigate])

  const handleSave = async () => {
    setFeedback(null)

    if (formData.profile.publicContactEmail) {
      const emailCheck = validateEmail(formData.profile.publicContactEmail)
      if (!emailCheck.valid) {
        setFeedback({ type: "error", message: emailCheck.error || "Please enter a valid public contact email." })
        return
      }
    }

    setSaving(true)

    try {
      const endpoint = portfolioId ? `/portfolio/${portfolioId}/content` : "/portfolio/me/content"
      const payload = {
        ...formData,
        projects: formData.projects.map((proj) => ({
          ...proj,
          technologies: Array.isArray(proj.technologies)
            ? proj.technologies
            : typeof proj.technologies === "string"
            ? proj.technologies.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        })),
      }
      await api.put(endpoint, payload)
      setFeedback({ type: "success", message: "Changes saved successfully." })
      setTimeout(() => setFeedback(null), 3000)
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to save changes.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePortfolio = async () => {
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const endpoint = portfolioId ? `/portfolio/${portfolioId}` : "/portfolio/me"
      const res = await api.delete(endpoint)
      if (res.data && res.data.success) {
        if (formData.username) {
          try {
            sessionStorage.removeItem(`cache_portfolio_${formData.username}`)
            sessionStorage.removeItem(`cache_portfolio_${formData.username.toLowerCase()}`)
          } catch {}
        }
        navigate("/dashboard")
      } else {
        setDeleteError("Failed to delete portfolio.")
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Failed to delete portfolio.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const updateProfileField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }))
  }

  const addProject = () => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      technologies: [],
      liveUrl: "",
      sourceUrl: "",
      isFeatured: false,
    }
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const updateProject = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.projects]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, projects: updated }
    })
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: "",
      category: "",
      level: undefined,
      proficiency: 0,
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }))
  }

  const updateSkill = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.skills]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, skills: updated }
    })
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      location: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.experience]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, experience: updated }
    })
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      mark: "",
      location: "",
      startYear: "",
      endYear: "",
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.education]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, education: updated }
    })
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addCertification = () => {
    const newCert: CertificationItem = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      issueDate: "",
      credentialUrl: "",
    }
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }))
  }

  const updateCertification = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.certifications]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, certifications: updated }
    })
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const addSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: crypto.randomUUID(),
      platform: "",
      url: "",
    }
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }))
  }

  const updateSocialLink = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.socialLinks]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, socialLinks: updated }
    })
  }

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }))
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4" /> },
    { id: "experience", label: "Experience & Education", icon: <Briefcase className="h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Code2 className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-[var(--z-sticky-nav)] bg-[var(--color-paper)] border-b border-[var(--color-rule)] px-4 sm:px-6 py-2.5">
        <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--color-ink)] text-[var(--color-paper)] font-display text-xs font-bold">
                P
              </span>
              <span className="font-display font-semibold text-base tracking-tight text-[var(--color-ink)] hidden sm:inline">
                Portfolify
              </span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-rule)] hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs h-8 px-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              {formData.username && (
                <span className="font-mono text-xs text-[var(--color-muted)] hidden md:inline">
                  @{formData.username}
                </span>
              )}
              {portfolioStatus === "published" ? (
                <Badge variant="success" className="text-[10px]">
                  Live
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px]">
                  Draft
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => navigate(portfolioId ? `/preview/${portfolioId}` : "/preview")}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
            <Button
              size="sm"
              className="gap-1 text-xs"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </header>

      {feedback && (
        <div
          className={`py-2 px-4 text-center text-xs font-medium border-b ${
            feedback.type === "success"
              ? "bg-[var(--color-paper-2)] text-[var(--color-success)] border-emerald-500/30"
              : "bg-[var(--color-paper-2)] text-[var(--color-error)] border-[var(--color-error)]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="space-y-1">
              <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-input text-xs sm:text-sm font-medium transition-[background-color,color] duration-100 ease-out text-left whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                      activeTab === tab.id
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[var(--shadow-card)] font-medium"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="md:col-span-3 space-y-6">
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                    <CardDescription>
                      Details displayed on your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Full Name</label>
                        <Input
                          placeholder="e.g. John Doe"
                          value={formData.profile.fullName}
                          onChange={(e) => updateProfileField("fullName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Professional Title</label>
                        <Input
                          placeholder="Full-Stack Developer | React & Node.js"
                          value={formData.profile.professionalTitle}
                          onChange={(e) => updateProfileField("professionalTitle", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Short Introduction</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
                        placeholder="A concise sentence introducing your core focus and specialties."
                        value={formData.profile.introduction}
                        onChange={(e) => updateProfileField("introduction", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Full Biography</label>
                      <textarea
                        rows={5}
                        className="w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm leading-relaxed placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
                        placeholder="Write about your engineering background, achievements, and what you love building..."
                        value={formData.profile.biography}
                        onChange={(e) => updateProfileField("biography", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Location</label>
                        <Input
                          placeholder="San Francisco, CA"
                          value={formData.profile.location}
                          onChange={(e) => updateProfileField("location", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Public Contact Email</label>
                        <Input
                          type="email"
                          placeholder="public@example.com"
                          value={formData.profile.publicContactEmail}
                          onChange={(e) => updateProfileField("publicContactEmail", e.target.value)}
                        />
                      </div>
                    </div>

                    <ImageUploadField
                      label="Profile Picture URL"
                      value={formData.profile.profileImageUrl}
                      onChange={(url) => updateProfileField("profileImageUrl", url)}
                      placeholder="https://images.unsplash.com/... or GitHub avatar URL"
                      description="Direct link to your avatar image"
                    />

                    <div>
                      <label className="block text-xs font-medium mb-1">Resume PDF URL</label>
                      <Input
                        placeholder="https://drive.google.com/... or direct PDF link"
                        value={formData.resumeUrl || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                      />
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold">Social Links</label>
                        <Button size="sm" variant="outline" onClick={addSocialLink} className="gap-1 text-xs h-7">
                          <Plus className="h-3 w-3" /> Add Link
                        </Button>
                      </div>

                      {formData.socialLinks.map((link, index) => (
                        <div key={link.id || index} className="flex items-center gap-2 p-2.5 bg-muted/20 rounded-lg border">
                          <Input
                            placeholder="Platform (GitHub, LinkedIn)"
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                            className="w-36 text-xs"
                          />
                          <Input
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                            className="flex-1 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(index)}
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "projects" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Projects</CardTitle>
                      <CardDescription>Applications, tools, and open-source contributions</CardDescription>
                    </div>
                    <Button size="sm" onClick={addProject} className="gap-1 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.projects.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        No projects added yet. Click Add Project above to get started.
                      </p>
                    ) : (
                      formData.projects.map((proj, index) => (
                        <div key={proj.id || index} className="p-4 bg-muted/20 rounded-lg border space-y-3">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-[10px]">Project #{index + 1}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(index)}
                              className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Title</label>
                            <Input
                              placeholder="Project title (e.g. Distributed Task Queue)"
                              value={proj.title}
                              onChange={(e) => updateProject(index, "title", e.target.value)}
                            />
                          </div>
                          <ImageUploadField
                            label="Screenshot URL"
                            value={proj.imageUrl || ""}
                            onChange={(url) => updateProject(index, "imageUrl", url)}
                            placeholder="https://images.unsplash.com/... or direct screenshot URL"
                          />
                          <div>
                            <label className="block text-xs font-medium mb-1">Description</label>
                            <textarea
                              rows={2}
                              className="w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
                              placeholder="Describe what you built, architecture decisions, and impact..."
                              value={proj.description}
                              onChange={(e) => updateProject(index, "description", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Technologies (comma-separated)</label>
                            <Input
                              placeholder="e.g. React, TypeScript, Node.js"
                              value={typeof proj.technologies === "string" ? proj.technologies : Array.isArray(proj.technologies) ? proj.technologies.join(", ") : ""}
                              onChange={(e) => updateProject(index, "technologies", e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Live Demo URL</label>
                              <Input
                                placeholder="https://..."
                                value={proj.liveUrl || ""}
                                onChange={(e) => updateProject(index, "liveUrl", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Source Code URL</label>
                              <Input
                                placeholder="https://github.com/..."
                                value={proj.sourceUrl || ""}
                                onChange={(e) => updateProject(index, "sourceUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "experience" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Work Experience</CardTitle>
                        <CardDescription>Roles, internships, and engineering positions</CardDescription>
                      </div>
                      <Button size="sm" onClick={addExperience} className="gap-1 text-xs">
                        <Plus className="h-3.5 w-3.5" /> Add Role
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.experience.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-6">
                          No work experience added yet.
                        </p>
                      ) : (
                        formData.experience.map((exp, index) => (
                          <div key={exp.id || index} className="p-4 bg-muted/20 rounded-lg border space-y-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-[10px]">Position #{index + 1}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(index)}
                                className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1">Job Title</label>
                                <Input
                                  placeholder="e.g. Senior Software Engineer"
                                  value={exp.jobTitle}
                                  onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Company</label>
                                <Input
                                  placeholder="e.g. Acme Corp"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1">Start Date</label>
                                <Input
                                  placeholder="e.g. 2022 or Jan 2022"
                                  value={exp.startDate || ""}
                                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">End Date</label>
                                <Input
                                  placeholder="e.g. Present or 2024"
                                  value={exp.endDate || ""}
                                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Location</label>
                                <Input
                                  placeholder="San Francisco, CA or Remote"
                                  value={exp.location || ""}
                                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Employment Type</label>
                                <Input
                                  placeholder="Full-time, Contract, Internship"
                                  value={exp.employmentType || ""}
                                  onChange={(e) => updateExperience(index, "employmentType", e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Description</label>
                              <textarea
                                rows={2}
                                className="w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
                                placeholder="Key contributions, technologies, and achievements..."
                                value={exp.description || ""}
                                onChange={(e) => updateExperience(index, "description", e.target.value)}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Education & Certifications</CardTitle>
                        <CardDescription>Academic degrees and certificates</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={addEducation} className="gap-1 text-xs">
                          <Plus className="h-3.5 w-3.5" /> Education
                        </Button>
                        <Button size="sm" variant="outline" onClick={addCertification} className="gap-1 text-xs">
                          <Plus className="h-3.5 w-3.5" /> Certificate
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.education.map((edu, index) => (
                        <div key={edu.id || index} className="p-3 bg-muted/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold">Degree #{index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                              aria-label="Remove education"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Institution</label>
                              <Input
                                placeholder="e.g. University Name"
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Degree</label>
                              <Input
                                placeholder="e.g. B.S. in Computer Science"
                                value={edu.degree || ""}
                                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Start Year</label>
                              <Input
                                placeholder="e.g. 2020"
                                value={edu.startYear || ""}
                                onChange={(e) => updateEducation(index, "startYear", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">End Year</label>
                              <Input
                                placeholder="e.g. 2024"
                                value={edu.endYear || ""}
                                onChange={(e) => updateEducation(index, "endYear", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Grade / GPA</label>
                              <Input
                                placeholder="e.g. 3.9 GPA, 85%"
                                value={edu.mark || ""}
                                onChange={(e) => updateEducation(index, "mark", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Location</label>
                              <Input
                                placeholder="e.g. Boston, MA"
                                value={edu.location || ""}
                                onChange={(e) => updateEducation(index, "location", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {formData.certifications.map((cert, index) => (
                        <div key={cert.id || index} className="p-3 bg-muted/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold">Certificate</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(index)}
                              className="text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Certificate Name</label>
                              <Input
                                placeholder="Certificate Name"
                                value={cert.name}
                                onChange={(e) => updateCertification(index, "name", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Issuer</label>
                              <Input
                                placeholder="Issuer (e.g. AWS)"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Issue Date</label>
                              <Input
                                placeholder="e.g. 2024 or Aug 2024"
                                value={cert.issueDate || ""}
                                onChange={(e) => updateCertification(index, "issueDate", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium mb-1">Credential URL</label>
                              <Input
                                placeholder="https://..."
                                value={cert.credentialUrl || ""}
                                onChange={(e) => updateCertification(index, "credentialUrl", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "skills" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Skills & Technologies</CardTitle>
                      <CardDescription>Core languages, frameworks, and developer tools</CardDescription>
                    </div>
                    <Button size="sm" onClick={addSkill} className="gap-1 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add Skill
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.skills.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No skills added yet. Click Add Skill above.
                      </p>
                    ) : (
                      formData.skills.map((skill, index) => (
                        <div key={skill.id || index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-muted/20 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <SkillSelectDropdown
                              value={skill.name}
                              onChange={(val) => updateSkill(index, "name", val)}
                              placeholder="Select or type a skill..."
                            />
                          </div>

                          <LevelSelectDropdown
                            value={skill.level}
                            onChange={(lvl) => {
                              updateSkill(index, "level", lvl)
                              updateSkill(index, "proficiency", lvl === "Beginner" ? 35 : lvl === "Advanced" ? 100 : 65)
                            }}
                            placeholder="Select Level"
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(index)}
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0 self-end sm:self-center"
                            aria-label="Remove skill"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Template</CardTitle>
                      <CardDescription>The active layout for your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TEMPLATES.map((t, idx) => (
                          <div
                            key={t.id}
                            onClick={() => setFormData((prev) => ({ ...prev, templateId: t.id }))}
                            className={`group rounded-xl border-2 overflow-hidden cursor-pointer transition-colors duration-100 ease-out motion-reduce:transition-none flex flex-col justify-between ${
                              formData.templateId === t.id
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-foreground/20 bg-card"
                            }`}
                          >
                            <div className="w-full aspect-[16/10] overflow-hidden bg-muted/10 border-b border-border/60">
                              <img
                                src={`/templates/${t.id}.png?v=4`}
                                alt={t.name}
                                className="w-full h-full object-cover object-top select-none pointer-events-none"
                                loading={idx === 0 ? "eager" : "lazy"}
                                fetchPriority={idx === 0 ? "high" : "auto"}
                              />
                            </div>
                            <div className="p-3.5 space-y-1">
                              <span className="font-bold text-sm block text-foreground">{t.name}</span>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{t.tagline}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Page Title & Favicon</CardTitle>
                      <CardDescription>Set the browser tab title and favicon for your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Page Title</label>
                        <Input
                          placeholder="e.g. John Doe - Portfolio"
                          value={formData.websiteTitle || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, websiteTitle: e.target.value }))}
                        />
                      </div>

                      <ImageUploadField
                        label="Favicon"
                        value={formData.faviconUrl || ""}
                        onChange={(url) => setFormData((prev) => ({ ...prev, faviconUrl: url }))}
                        placeholder="https://example.com/icon.png"
                        isIcon={true}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-destructive">Danger Zone</CardTitle>
                      <CardDescription className="text-xs">Permanently remove this portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setShowDeleteModal(true)
                          setDeleteError(null)
                        }}
                      >
                        Delete Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-card bg-[var(--color-paper-2)] border border-[var(--color-rule-2)] shadow-[var(--shadow-card)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[var(--color-ink)]">Delete portfolio</h3>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError(null)
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Are you sure you want to delete this portfolio? All associated projects and history will be permanently removed.
            </p>

            {deleteError && (
              <div className="p-2.5 rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError(null)
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeletePortfolio}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
