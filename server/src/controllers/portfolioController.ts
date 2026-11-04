import type { Response } from "express"
import { and, desc, eq, ne, sql } from "drizzle-orm"
import crypto from "crypto"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"
import type { AuthenticatedRequest } from "../middleware/auth.js"

const RESERVED_USERNAMES = [
  "admin",
  "api",
  "dashboard",
  "login",
  "signup",
  "sign-in",
  "sign-up",
  "settings",
  "templates",
  "about",
  "contact",
  "features",
  "privacy",
  "terms",
  "preview",
  "editor",
  "auth",
  "public",
]

function getTargetPortfolioId(req: AuthenticatedRequest): string | undefined {
  if (typeof req.params.id === "string" && req.params.id && req.params.id !== "me") {
    return req.params.id
  }
  if (typeof req.query.id === "string" && req.query.id && req.query.id !== "me") {
    return req.query.id
  }
  if (typeof req.body?.portfolioId === "string" && req.body.portfolioId && req.body.portfolioId !== "me") {
    return req.body.portfolioId
  }
  return undefined
}

export async function getUserPortfolios(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id

    const userPortfolios = await db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.userId, userId))
      .orderBy(desc(schema.portfolios.createdAt))

    const portfoliosWithMeta = await Promise.all(
      userPortfolios.map(async (p) => {
        const analyticsCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(schema.portfolioAnalytics)
          .where(eq(schema.portfolioAnalytics.portfolioId, p.id))

        let parsedSnapshot: any = {}
        if (p.publishedSnapshot) {
          try {
            parsedSnapshot = JSON.parse(p.publishedSnapshot)
          } catch {
            parsedSnapshot = {}
          }
        }

        return {
          id: p.id,
          username: p.username,
          templateId: p.templateId,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          publishedAt: p.publishedAt,
          websiteTitle: parsedSnapshot.websiteTitle || `${p.username}'s Portfolio`,
          visitCount: Number(analyticsCount[0]?.count || 0),
        }
      })
    )

    const publishedPortfolio = portfoliosWithMeta.find((p) => p.status === "published") || null

    return res.status(200).json({
      portfolios: portfoliosWithMeta,
      publishedPortfolio,
    })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve user portfolios.",
    })
  }
}

export async function getMyPortfolio(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)

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
      return res.status(200).json({ portfolio: null })
    }

    const portfolio = userPortfolios[0]

    const [
      profiles,
      projects,
      skills,
      experience,
      education,
      certifications,
      socialLinks,
      themeSettingsList,
      analyticsCount,
    ] = await Promise.all([
      db
        .select()
        .from(schema.portfolioProfiles)
        .where(eq(schema.portfolioProfiles.portfolioId, portfolio.id))
        .limit(1),
      db
        .select()
        .from(schema.portfolioProjects)
        .where(eq(schema.portfolioProjects.portfolioId, portfolio.id))
        .orderBy(schema.portfolioProjects.displayOrder),
      db
        .select()
        .from(schema.portfolioSkills)
        .where(eq(schema.portfolioSkills.portfolioId, portfolio.id))
        .orderBy(schema.portfolioSkills.displayOrder),
      db
        .select()
        .from(schema.portfolioExperience)
        .where(eq(schema.portfolioExperience.portfolioId, portfolio.id))
        .orderBy(schema.portfolioExperience.displayOrder),
      db
        .select()
        .from(schema.portfolioEducation)
        .where(eq(schema.portfolioEducation.portfolioId, portfolio.id))
        .orderBy(schema.portfolioEducation.displayOrder),
      db
        .select()
        .from(schema.portfolioCertifications)
        .where(eq(schema.portfolioCertifications.portfolioId, portfolio.id)),
      db
        .select()
        .from(schema.portfolioSocialLinks)
        .where(eq(schema.portfolioSocialLinks.portfolioId, portfolio.id))
        .orderBy(schema.portfolioSocialLinks.displayOrder),
      db
        .select()
        .from(schema.portfolioThemeSettings)
        .where(eq(schema.portfolioThemeSettings.portfolioId, portfolio.id))
        .limit(1),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schema.portfolioAnalytics)
        .where(eq(schema.portfolioAnalytics.portfolioId, portfolio.id)),
    ])

    const visitCount = Number(analyticsCount[0]?.count || 0)

    let parsedSnapshot: any = {}
    if (portfolio.publishedSnapshot) {
      try {
        parsedSnapshot = JSON.parse(portfolio.publishedSnapshot)
      } catch {
        parsedSnapshot = {}
      }
    }

    const structuredData = {
      id: portfolio.id,
      username: portfolio.username,
      templateId: portfolio.templateId,
      status: portfolio.status,
      publishedAt: portfolio.publishedAt?.toISOString(),
      websiteTitle: parsedSnapshot.websiteTitle || "",
      faviconUrl: parsedSnapshot.faviconUrl || "",
      resumeUrl: parsedSnapshot.resumeUrl || "",
      profile: profiles[0] || {
        fullName: "",
        professionalTitle: "",
        introduction: "",
        biography: "",
        location: "",
        profileImageUrl: "",
        publicContactEmail: "",
      },
      projects: projects.map((p: any) => ({
        ...p,
        technologies: p.technologies ? p.technologies.split(",").map((t: string) => t.trim()) : [],
      })),
      skills,
      experience,
      education,
      certifications,
      socialLinks,
      themeSettings: themeSettingsList[0] || {
        colorScheme: "blue",
        fontScheme: "inter",
        themeMode: "system",
      },
    }

    return res.status(200).json({
      portfolio,
      data: structuredData,
      visitCount,
    })
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve portfolio.",
    })
  }
}

export async function createPortfolio(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const requestedTemplate = req.body.templateId || "minimal"
    let requestedUsername = (req.body.username || "").toLowerCase().trim()

    const userDisplayName = req.user?.name?.trim() || req.user?.email?.split("@")[0] || "Developer"
    if (!requestedUsername) {
      const sanitizedName = userDisplayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      requestedUsername = `${sanitizedName || "dev"}-${randomSuffix}`
    }

    const existingUsernames = await db
      .select({ id: schema.portfolios.id })
      .from(schema.portfolios)
      .where(sql`lower(${schema.portfolios.username}) = ${requestedUsername}`)
      .limit(1)

    if (existingUsernames.length > 0) {
      const extraSuffix = Math.floor(100 + Math.random() * 900)
      requestedUsername = `${requestedUsername}-${extraSuffix}`
    }

    const portfolioId = crypto.randomUUID()

    await db.insert(schema.portfolios).values({
      id: portfolioId,
      userId,
      username: requestedUsername,
      templateId: requestedTemplate,
      status: "draft",
    })

    await Promise.all([
      db.insert(schema.portfolioProfiles).values({
        id: crypto.randomUUID(),
        portfolioId,
        fullName: "",
        professionalTitle: "",
        introduction: "",
        biography: "",
        location: "",
        profileImageUrl: "",
        publicContactEmail: "",
      }),
      db.insert(schema.portfolioThemeSettings).values({
        id: crypto.randomUUID(),
        portfolioId,
        colorScheme: "blue",
        fontScheme: "inter",
        themeMode: "system",
      }),
    ])

    return res.status(201).json({
      success: true,
      portfolio: {
        id: portfolioId,
        username: requestedUsername,
        templateId: requestedTemplate,
        status: "draft",
      },
    })
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Conflict",
        message: "Username is already in use. Please select a different username.",
      })
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create portfolio.",
    })
  }
}

export async function checkUsername(req: AuthenticatedRequest, res: Response) {
  try {
    const username = String(req.query.username || "").toLowerCase().trim()

    if (!username || username.length < 3 || username.length > 30) {
      return res.status(200).json({
        available: false,
        message: "Username must be between 3 and 30 characters.",
      })
    }

    if (!/^[a-z0-9-]+$/.test(username)) {
      return res.status(200).json({
        available: false,
        message: "Username can only contain letters, numbers, and hyphens.",
      })
    }

    if (RESERVED_USERNAMES.includes(username)) {
      return res.status(200).json({
        available: false,
        message: "This username is reserved and cannot be claimed.",
      })
    }

    const targetPortfolioId = typeof req.query.portfolioId === "string" ? req.query.portfolioId : undefined

    const existing = await db
      .select({ id: schema.portfolios.id, userId: schema.portfolios.userId })
      .from(schema.portfolios)
      .where(sql`lower(${schema.portfolios.username}) = ${username}`)
      .limit(1)

    if (existing.length > 0) {
      if (targetPortfolioId && existing[0].id === targetPortfolioId) {
        return res.status(200).json({ available: true, isCurrent: true })
      }
      return res.status(200).json({
        available: false,
        message: "Username is already claimed.",
      })
    }

    return res.status(200).json({ available: true })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to verify username availability.",
    })
  }
}

export async function updateUsername(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)
    const newUsername = String(req.body.username || "").toLowerCase().trim()

    if (!newUsername || newUsername.length < 3 || newUsername.length > 30) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Username must be between 3 and 30 characters.",
      })
    }

    if (!/^[a-z0-9-]+$/.test(newUsername)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Username can only contain letters, numbers, and hyphens.",
      })
    }

    if (RESERVED_USERNAMES.includes(newUsername)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "This username is reserved.",
      })
    }

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
        message: "No portfolio found.",
      })
    }

    const portfolio = userPortfolios[0]

    const conflict = await db
      .select({ id: schema.portfolios.id })
      .from(schema.portfolios)
      .where(and(sql`lower(${schema.portfolios.username}) = ${newUsername}`, ne(schema.portfolios.id, portfolio.id)))
      .limit(1)

    if (conflict.length > 0) {
      return res.status(400).json({
        error: "Conflict",
        message: "Username already taken.",
      })
    }

    await db
      .update(schema.portfolios)
      .set({
        username: newUsername,
        updatedAt: new Date(),
      })
      .where(eq(schema.portfolios.id, portfolio.id))

    return res.status(200).json({ success: true, username: newUsername })
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Conflict",
        message: "Username already taken.",
      })
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update username.",
    })
  }
}

export async function updatePortfolioMeta(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)
    const { templateId } = req.body

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
        message: "No portfolio found to update.",
      })
    }

    const portfolio = userPortfolios[0]
    const updates: any = { updatedAt: new Date() }
    if (templateId) {
      updates.templateId = templateId
      if (portfolio.publishedSnapshot) {
        try {
          const snapshot = JSON.parse(portfolio.publishedSnapshot)
          snapshot.templateId = templateId
          updates.publishedSnapshot = JSON.stringify(snapshot)
        } catch {}
      }
    }

    await db
      .update(schema.portfolios)
      .set(updates)
      .where(eq(schema.portfolios.id, portfolio.id))

    return res.status(200).json({ success: true, templateId })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update portfolio settings.",
    })
  }
}

export async function publishPortfolio(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)

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
        message: "No portfolio found to publish.",
      })
    }

    const portfolio = userPortfolios[0]

    await db
      .update(schema.portfolios)
      .set({
        status: "draft",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.portfolios.userId, userId),
          ne(schema.portfolios.id, portfolio.id),
          eq(schema.portfolios.status, "published")
        )
      )

    const [
      profiles,
      projects,
      skills,
      experience,
      education,
      certifications,
      socialLinks,
      themeSettings,
    ] = await Promise.all([
      db.select().from(schema.portfolioProfiles).where(eq(schema.portfolioProfiles.portfolioId, portfolio.id)),
      db.select().from(schema.portfolioProjects).where(eq(schema.portfolioProjects.portfolioId, portfolio.id)).orderBy(schema.portfolioProjects.displayOrder),
      db.select().from(schema.portfolioSkills).where(eq(schema.portfolioSkills.portfolioId, portfolio.id)).orderBy(schema.portfolioSkills.displayOrder),
      db.select().from(schema.portfolioExperience).where(eq(schema.portfolioExperience.portfolioId, portfolio.id)).orderBy(schema.portfolioExperience.displayOrder),
      db.select().from(schema.portfolioEducation).where(eq(schema.portfolioEducation.portfolioId, portfolio.id)),
      db.select().from(schema.portfolioCertifications).where(eq(schema.portfolioCertifications.portfolioId, portfolio.id)),
      db.select().from(schema.portfolioSocialLinks).where(eq(schema.portfolioSocialLinks.portfolioId, portfolio.id)),
      db.select().from(schema.portfolioThemeSettings).where(eq(schema.portfolioThemeSettings.portfolioId, portfolio.id)),
    ])

    let existingSnapshot: any = {}
    if (portfolio.publishedSnapshot) {
      try {
        existingSnapshot = JSON.parse(portfolio.publishedSnapshot)
      } catch {
        existingSnapshot = {}
      }
    }

    const snapshot = {
      username: portfolio.username,
      templateId: portfolio.templateId,
      status: "published",
      publishedAt: new Date().toISOString(),
      websiteTitle: existingSnapshot.websiteTitle || `${profiles[0]?.fullName || req.user!.name} - Portfolio`,
      faviconUrl: existingSnapshot.faviconUrl || "",
      resumeUrl: existingSnapshot.resumeUrl || "",
      profile: profiles[0] || {},
      projects: projects.map((p: any) => ({
        ...p,
        technologies: p.technologies ? p.technologies.split(",").map((t: string) => t.trim()) : [],
      })),
      skills,
      experience,
      education,
      certifications,
      socialLinks,
      themeSettings: themeSettings[0] || {},
    }

    const now = new Date()

    await db
      .update(schema.portfolios)
      .set({
        status: "published",
        publishedAt: now,
        updatedAt: now,
        publishedSnapshot: JSON.stringify(snapshot),
      })
      .where(eq(schema.portfolios.id, portfolio.id))

    return res.status(200).json({
      success: true,
      status: "published",
      publishedAt: now.toISOString(),
      username: portfolio.username,
      id: portfolio.id,
    })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to publish portfolio.",
    })
  }
}

export async function unpublishPortfolio(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)

    let condition
    if (targetId) {
      condition = and(eq(schema.portfolios.id, targetId), eq(schema.portfolios.userId, userId))
    } else {
      condition = and(eq(schema.portfolios.userId, userId), eq(schema.portfolios.status, "published"))
    }

    await db
      .update(schema.portfolios)
      .set({
        status: "unpublished",
        updatedAt: new Date(),
      })
      .where(condition)

    return res.status(200).json({ success: true, status: "unpublished" })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to unpublish portfolio.",
    })
  }
}

export async function deletePortfolio(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id
    const targetId = getTargetPortfolioId(req)

    let userPortfolios
    if (targetId) {
      userPortfolios = await db
        .select({
          id: schema.portfolios.id,
          username: schema.portfolios.username,
          status: schema.portfolios.status,
        })
        .from(schema.portfolios)
        .where(and(eq(schema.portfolios.id, targetId), eq(schema.portfolios.userId, userId)))
        .limit(1)
    } else {
      userPortfolios = await db
        .select({
          id: schema.portfolios.id,
          username: schema.portfolios.username,
          status: schema.portfolios.status,
        })
        .from(schema.portfolios)
        .where(eq(schema.portfolios.userId, userId))
        .orderBy(desc(schema.portfolios.updatedAt))
        .limit(1)
    }

    if (userPortfolios.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No portfolio found to delete.",
      })
    }

    const targetPortfolio = userPortfolios[0]
    const portfolioId = targetPortfolio.id

    await db
      .update(schema.portfolios)
      .set({
        status: "unpublished",
        publishedSnapshot: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.portfolios.id, portfolioId))

    await Promise.all([
      db.delete(schema.portfolioAnalytics).where(eq(schema.portfolioAnalytics.portfolioId, portfolioId)),
      db.delete(schema.portfolioAssets).where(eq(schema.portfolioAssets.portfolioId, portfolioId)),
      db.delete(schema.portfolioSections).where(eq(schema.portfolioSections.portfolioId, portfolioId)),
      db.delete(schema.portfolioThemeSettings).where(eq(schema.portfolioThemeSettings.portfolioId, portfolioId)),
      db.delete(schema.portfolioSocialLinks).where(eq(schema.portfolioSocialLinks.portfolioId, portfolioId)),
      db.delete(schema.portfolioCertifications).where(eq(schema.portfolioCertifications.portfolioId, portfolioId)),
      db.delete(schema.portfolioEducation).where(eq(schema.portfolioEducation.portfolioId, portfolioId)),
      db.delete(schema.portfolioExperience).where(eq(schema.portfolioExperience.portfolioId, portfolioId)),
      db.delete(schema.portfolioSkills).where(eq(schema.portfolioSkills.portfolioId, portfolioId)),
      db.delete(schema.portfolioProjects).where(eq(schema.portfolioProjects.portfolioId, portfolioId)),
      db.delete(schema.portfolioProfiles).where(eq(schema.portfolioProfiles.portfolioId, portfolioId)),
    ])

    await db
      .delete(schema.portfolios)
      .where(eq(schema.portfolios.id, portfolioId))

    return res.status(200).json({
      success: true,
      deletedId: portfolioId,
      username: targetPortfolio.username,
    })
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete portfolio.",
    })
  }
}
