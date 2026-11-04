import type { Response } from "express"
import { and, desc, eq } from "drizzle-orm"
import crypto from "crypto"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"
import type { AuthenticatedRequest } from "../middleware/auth.js"

export async function savePortfolioContent(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = typeof req.params.id === "string" && req.params.id !== "me" ? req.params.id : typeof req.query.id === "string" && req.query.id !== "me" ? req.query.id : typeof req.body?.portfolioId === "string" && req.body.portfolioId !== "me" ? req.body.portfolioId : undefined

    let userPortfolios
    if (targetId) {
      userPortfolios = await db
        .select()
        .from(schema.portfolios)
        .where(and(eq(schema.portfolios.id, targetId), eq(schema.portfolios.userId, userId)))
        .limit(1)
    } else {
      userPortfolios = await db
        .select()
        .from(schema.portfolios)
        .where(eq(schema.portfolios.userId, userId))
        .orderBy(desc(schema.portfolios.updatedAt))
        .limit(1)
    }

    if (userPortfolios.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Portfolio not found. Please initialize a portfolio first.",
      })
    }

    const portfolio = userPortfolios[0]
    const {
      profile,
      projects,
      skills,
      experience,
      education,
      certifications,
      socialLinks,
      themeSettings,
      templateId,
      websiteTitle,
      faviconUrl,
      resumeUrl,
    } = req.body

    const now = new Date()

    let snapshotData: any = {}
    if (portfolio.publishedSnapshot) {
      try {
        snapshotData = JSON.parse(portfolio.publishedSnapshot)
      } catch {
        snapshotData = {}
      }
    }

    if (websiteTitle !== undefined) snapshotData.websiteTitle = websiteTitle
    if (faviconUrl !== undefined) snapshotData.faviconUrl = faviconUrl
    if (resumeUrl !== undefined) snapshotData.resumeUrl = resumeUrl

    if (portfolio.status === "published") {
      snapshotData = {
        ...snapshotData,
        username: portfolio.username,
        templateId: templateId || portfolio.templateId,
        status: "published",
        publishedAt: portfolio.publishedAt?.toISOString() || now.toISOString(),
        websiteTitle: websiteTitle !== undefined ? websiteTitle : snapshotData.websiteTitle || `${profile?.fullName || req.user!.name} - Portfolio`,
        faviconUrl: faviconUrl !== undefined ? faviconUrl : snapshotData.faviconUrl || "",
        resumeUrl: resumeUrl !== undefined ? resumeUrl : snapshotData.resumeUrl || "",
        profile: profile || snapshotData.profile || {},
        projects: Array.isArray(projects)
          ? projects.map((p: any) => ({
              ...p,
              technologies: Array.isArray(p.technologies)
                ? p.technologies
                : p.technologies
                ? p.technologies.split(",").map((t: string) => t.trim())
                : [],
            }))
          : snapshotData.projects || [],
        skills: skills || snapshotData.skills || [],
        experience: experience || snapshotData.experience || [],
        education: education || snapshotData.education || [],
        certifications: certifications || snapshotData.certifications || [],
        socialLinks: socialLinks || snapshotData.socialLinks || [],
        themeSettings: themeSettings || snapshotData.themeSettings || {},
      }
    }

    const portfolioUpdates: any = {
      updatedAt: now,
      publishedSnapshot: JSON.stringify(snapshotData),
    }
    if (templateId) {
      portfolioUpdates.templateId = templateId
    }

    await db
      .update(schema.portfolios)
      .set(portfolioUpdates)
      .where(eq(schema.portfolios.id, portfolio.id))

    await Promise.all([
      db.delete(schema.portfolioProjects).where(eq(schema.portfolioProjects.portfolioId, portfolio.id)),
      db.delete(schema.portfolioSkills).where(eq(schema.portfolioSkills.portfolioId, portfolio.id)),
      db.delete(schema.portfolioExperience).where(eq(schema.portfolioExperience.portfolioId, portfolio.id)),
      db.delete(schema.portfolioEducation).where(eq(schema.portfolioEducation.portfolioId, portfolio.id)),
      db.delete(schema.portfolioCertifications).where(eq(schema.portfolioCertifications.portfolioId, portfolio.id)),
      db.delete(schema.portfolioSocialLinks).where(eq(schema.portfolioSocialLinks.portfolioId, portfolio.id)),
    ])

    const insertTasks: Promise<any>[] = []

    if (profile) {
      const profilePromise = (async () => {
        const existingProfile = await db
          .select()
          .from(schema.portfolioProfiles)
          .where(eq(schema.portfolioProfiles.portfolioId, portfolio.id))
          .limit(1)

        if (existingProfile.length > 0) {
          await db
            .update(schema.portfolioProfiles)
            .set({
              fullName: profile.fullName || req.user!.name || "Developer",
              professionalTitle: profile.professionalTitle || "",
              introduction: profile.introduction || "",
              biography: profile.biography || "",
              location: profile.location || "",
              profileImageUrl: profile.profileImageUrl || "",
              publicContactEmail: profile.publicContactEmail || "",
            })
            .where(eq(schema.portfolioProfiles.id, existingProfile[0].id))
        } else {
          await db.insert(schema.portfolioProfiles).values({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            fullName: profile.fullName || req.user!.name || "Developer",
            professionalTitle: profile.professionalTitle || "",
            introduction: profile.introduction || "",
            biography: profile.biography || "",
            location: profile.location || "",
            profileImageUrl: profile.profileImageUrl || "",
            publicContactEmail: profile.publicContactEmail || req.user!.email,
          })
        }
      })()
      insertTasks.push(profilePromise)
    }

    const validProjects = Array.isArray(projects)
      ? projects.filter(
          (proj) =>
            proj &&
            ((proj.title && proj.title.trim()) ||
              (proj.description && proj.description.trim()) ||
              (proj.liveUrl && proj.liveUrl.trim()) ||
              (proj.sourceUrl && proj.sourceUrl.trim()) ||
              (proj.projectUrl && proj.projectUrl.trim()) ||
              (proj.githubUrl && proj.githubUrl.trim()) ||
              (proj.imageUrl && proj.imageUrl.trim()))
        )
      : []

    if (validProjects.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioProjects).values(
          validProjects.map((proj, i) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            title: (proj.title || "").trim() || "Untitled Project",
            description: proj.description || "",
            liveUrl: proj.liveUrl || proj.projectUrl || "",
            sourceUrl: proj.sourceUrl || proj.githubUrl || "",
            imageUrl: proj.imageUrl || "",
            technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies || "",
            displayOrder: i,
          }))
        )
      )
    }

    const validSkills = Array.isArray(skills)
      ? skills.filter((skill) => skill && skill.name && skill.name.trim())
      : []

    if (validSkills.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioSkills).values(
          validSkills.map((skill, i) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            name: (skill.name || "").trim(),
            category: (skill.category || "").trim() || "General",
            level: skill.level || "Intermediate",
            proficiency:
              skill.level === "Beginner"
                ? (skill.proficiency && skill.proficiency <= 45 ? skill.proficiency : 35)
                : skill.level === "Intermediate"
                ? (skill.proficiency && skill.proficiency >= 50 && skill.proficiency <= 75 ? skill.proficiency : 65)
                : skill.level === "Advanced" || skill.level === "Advance"
                ? 100
                : (skill.proficiency || 50),
            displayOrder: i,
          }))
        )
      )
    }

    const validExperience = Array.isArray(experience)
      ? experience.filter(
          (exp) =>
            exp &&
            ((exp.company && exp.company.trim()) ||
              (exp.jobTitle && exp.jobTitle.trim()) ||
              (exp.description && exp.description.trim()))
        )
      : []

    if (validExperience.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioExperience).values(
          validExperience.map((exp, i) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            company: (exp.company || "").trim() || "Company",
            jobTitle: (exp.jobTitle || "").trim() || "Role",
            location: exp.location || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            employmentType: exp.employmentType || "",
            description: exp.description || "",
            displayOrder: i,
          }))
        )
      )
    }

    const validEducation = Array.isArray(education)
      ? education.filter(
          (edu) =>
            edu &&
            ((edu.institution && edu.institution.trim()) ||
              (edu.degree && edu.degree.trim()) ||
              (edu.fieldOfStudy && edu.fieldOfStudy.trim()))
        )
      : []

    if (validEducation.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioEducation).values(
          validEducation.map((edu, i) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            institution: (edu.institution || "").trim() || "Institution",
            degree: (edu.degree || "").trim() || "Degree",
            fieldOfStudy: edu.fieldOfStudy || "",
            mark: edu.mark || "",
            location: edu.location || "",
            startYear: edu.startYear || "",
            endYear: edu.endYear || "",
            description: edu.description || "",
            displayOrder: i,
          }))
        )
      )
    }

    const validCertifications = Array.isArray(certifications)
      ? certifications.filter((cert) => cert && cert.name && cert.name.trim())
      : []

    if (validCertifications.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioCertifications).values(
          validCertifications.map((cert) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            name: (cert.name || "").trim(),
            issuer: (cert.issuer || "").trim() || "Issuer",
            issueDate: cert.issueDate || "",
            credentialUrl: cert.credentialUrl || "",
          }))
        )
      )
    }

    const validSocialLinks = Array.isArray(socialLinks)
      ? socialLinks.filter((link) => link && link.url && link.url.trim())
      : []

    if (validSocialLinks.length > 0) {
      insertTasks.push(
        db.insert(schema.portfolioSocialLinks).values(
          validSocialLinks.map((link, i) => ({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            platform: (link.platform || "").trim() || "Link",
            url: (link.url || "").trim(),
            displayOrder: i,
          }))
        )
      )
    }

    if (themeSettings) {
      const themePromise = (async () => {
        const existingTheme = await db
          .select()
          .from(schema.portfolioThemeSettings)
          .where(eq(schema.portfolioThemeSettings.portfolioId, portfolio.id))
          .limit(1)

        if (existingTheme.length > 0) {
          await db
            .update(schema.portfolioThemeSettings)
            .set({
              colorScheme: themeSettings.colorScheme || "blue",
              fontScheme: themeSettings.fontScheme || "inter",
              themeMode: themeSettings.themeMode || "system",
            })
            .where(eq(schema.portfolioThemeSettings.id, existingTheme[0].id))
        } else {
          await db.insert(schema.portfolioThemeSettings).values({
            id: crypto.randomUUID(),
            portfolioId: portfolio.id,
            colorScheme: themeSettings.colorScheme || "blue",
            fontScheme: themeSettings.fontScheme || "inter",
            themeMode: themeSettings.themeMode || "system",
          })
        }
      })()
      insertTasks.push(themePromise)
    }

    await Promise.all(insertTasks)

    return res.status(200).json({ success: true, message: "Portfolio saved successfully." })
  } catch (error) {
    console.error("Save portfolio content error:", error)
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save portfolio content.",
    })
  }
}
