import type { Response, Request } from "express"
import { sql } from "drizzle-orm"
import crypto from "crypto"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"

export function escapeHtml(str: string): string {
  if (!str) return ""
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function sanitizeUrl(url: string | undefined): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (/^(?:https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return escapeHtml(trimmed)
  }
  return "#"
}

export function sanitizeImageUrl(url: string | undefined): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (/^(?:https?:\/\/|\/)/i.test(trimmed)) {
    return escapeHtml(trimmed)
  }
  return ""
}

export function renderPortfolioHtml(data: any): string {
  const {
    templateId = "minimal",
    profile = {},
    projects = [],
    skills = [],
    experience = [],
    education = [],
    certifications = [],
    socialLinks = [],
    resumeUrl,
  } = data

  const isCreative = templateId === "creative"
  const isMinimal = templateId === "minimal"
  const isProfessional = templateId === "professional"
  const isTerminal = templateId === "terminal"
  const isCompact = templateId === "compact"
  const isBrutalist = templateId === "brutalist"
  const isGlassmorphic = templateId === "glassmorphic"
  const isLuxury = templateId === "luxury"

  const fontFamily = isTerminal
    ? "ui-monospace, Menlo, Monaco, 'Cascadia Mono', monospace"
    : isLuxury
    ? "'Cormorant Garamond', 'Cinzel', 'Didot', 'Bodoni MT', Georgia, serif"
    : "ui-sans-serif, system-ui, sans-serif"

  const bgColor = isTerminal
    ? "#090d16"
    : isBrutalist
    ? "#FAF7F2"
    : isGlassmorphic
    ? "#0b1120"
    : isLuxury
    ? "#0C0B0A"
    : isCompact
    ? "#0f172a"
    : isMinimal
    ? "#ffffff"
    : isProfessional
    ? "#f8fafc"
    : isCreative
    ? "#171717"
    : "#020617"

  const textColor = isTerminal
    ? "#e2e8f0"
    : isBrutalist
    ? "#09090b"
    : isGlassmorphic
    ? "#f8fafc"
    : isLuxury
    ? "#F5F1EB"
    : isCompact
    ? "#f8fafc"
    : isMinimal
    ? "#171717"
    : isProfessional
    ? "#0f172a"
    : "#f8fafc"

  const cardBg = isTerminal
    ? "#0c1220"
    : isBrutalist
    ? "#ffffff"
    : isGlassmorphic
    ? "rgba(255, 255, 255, 0.07)"
    : isLuxury
    ? "#141311"
    : isCompact
    ? "#1e293b"
    : isMinimal
    ? "#fafafa"
    : isProfessional
    ? "#ffffff"
    : isCreative
    ? "rgba(38, 38, 38, 0.6)"
    : "rgba(15, 23, 42, 0.6)"

  const borderColor = isTerminal
    ? "rgba(16, 185, 129, 0.25)"
    : isBrutalist
    ? "#000000"
    : isGlassmorphic
    ? "rgba(255, 255, 255, 0.15)"
    : isLuxury
    ? "#262320"
    : isCompact
    ? "#334155"
    : isMinimal
    ? "#e5e5e5"
    : isProfessional
    ? "#e2e8f0"
    : isCreative
    ? "rgba(168, 85, 247, 0.2)"
    : "#1e293b"

  const accentColor = isTerminal
    ? "#10b981"
    : isBrutalist
    ? "#FF6B6B"
    : isGlassmorphic
    ? "#38bdf8"
    : isLuxury
    ? "#D4AF37"
    : isCompact
    ? "#06b6d4"
    : isCreative
    ? "#c084fc"
    : isMinimal
    ? "#171717"
    : "#3b82f6"

  const validProfileImageUrl = sanitizeImageUrl(profile.profileImageUrl)

  return `
    <div style="background:${bgColor}; color:${textColor}; font-family: ${fontFamily}; min-height: 100vh; padding: 48px 20px;">
      <div style="max-width: 896px; margin: 0 auto;">
        ${isTerminal ? `
          <div style="display: flex; align-items: center; padding: 10px 16px; background: #0c1220; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; margin-bottom: 32px; font-size: 12px; font-family: monospace;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
              <span style="margin-left: 8px; color: #94a3b8;">${escapeHtml(profile.fullName || "portfolio")}</span>
            </div>
          </div>
        ` : ""}
        <header style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 32px; padding-bottom: 48px; border-bottom: 1px solid ${borderColor};">
          <div style="flex: 1; min-width: 280px;">
            <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 8px 0; color: ${textColor};">${escapeHtml(profile.fullName || "Portfolio")}</h1>
            ${profile.professionalTitle ? `<p style="font-size: 20px; color: ${accentColor}; font-weight: 600; margin: 0 0 16px 0;">${escapeHtml(profile.professionalTitle)}</p>` : ""}
            <p style="color: ${isMinimal || isProfessional ? "#475569" : "#94a3b8"}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">${escapeHtml(profile.introduction || profile.biography || "")}</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
              ${socialLinks.map((link: any) => `
                <a href="${sanitizeUrl(link.url)}" target="_blank" rel="noopener noreferrer" style="padding: 6px 14px; background: ${cardBg}; color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 8px; font-size: 13px; text-decoration: none; font-weight: 500;">
                  ${escapeHtml(link.platform)} ↗
                </a>
              `).join("")}
              ${resumeUrl ? `
                <a href="${sanitizeUrl(resumeUrl)}" target="_blank" rel="noopener noreferrer" style="padding: 6px 14px; background: #2563eb; color: #ffffff; border-radius: 8px; font-size: 13px; text-decoration: none; font-weight: 600;">
                  Download Resume PDF
                </a>
              ` : ""}
            </div>
          </div>

          ${validProfileImageUrl ? `
            <div>
              <img src="${validProfileImageUrl}" alt="${escapeHtml(profile.fullName || "Profile")}" style="width: 140px; height: 140px; border-radius: 20px; object-fit: cover; border: 2px solid ${accentColor};" />
            </div>
          ` : ""}
        </header>

        ${profile.biography ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 16px;">About Me</h2>
            <p style="color: ${isMinimal || isProfessional ? "#334155" : "#cbd5e1"}; line-height: 1.7; font-size: 15px; white-space: pre-line;">${escapeHtml(profile.biography)}</p>
          </section>
        ` : ""}

        ${skills.length > 0 ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 16px;">Skills & Technologies</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${skills.map((s: any) => {
                const lvl = (s.level || "").toLowerCase()
                const prof = lvl === "beginner" ? 35 : lvl === "intermediate" ? 65 : lvl === "advanced" || lvl === "advance" ? 100 : (s.proficiency || 50)
                const barsCount = Math.min(10, Math.max(1, Math.floor(prof / 10)))
                const gauge = "█".repeat(barsCount) + "░".repeat(10 - barsCount)
                if (isTerminal) {
                  return `
                    <div style="padding: 8px 12px; background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 6px; font-size: 12px; color: ${textColor}; font-family: monospace;">
                      <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                        <span style="font-weight: 700;">${escapeHtml(s.name)}</span>
                        ${s.level ? `<span style="font-size: 10px; opacity: 0.7;">${escapeHtml(s.level)}</span>` : ""}
                      </div>
                      <div style="color: ${accentColor}; font-size: 11px; letter-spacing: -1px;">[${gauge}]</div>
                    </div>
                  `
                }
                return `
                  <div style="padding: 8px 12px; background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; font-size: 13px; color: ${textColor}; display: inline-flex; flex-direction: column; gap: 4px; min-width: 120px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                      <span style="font-weight: 600;">${escapeHtml(s.name)}</span>
                      ${s.level ? `<span style="font-size: 10px; opacity: 0.7; text-transform: uppercase; font-family: monospace;">(${escapeHtml(s.level)})</span>` : ""}
                    </div>
                    <div style="width: 100%; height: 3px; background: rgba(148, 163, 184, 0.2); border-radius: 2px; overflow: hidden;">
                      <div style="width: ${prof}%; height: 100%; background: ${accentColor}; border-radius: 2px;"></div>
                    </div>
                  </div>
                `
              }).join("")}
            </div>
          </section>
        ` : ""}

        ${projects.length > 0 ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 20px;">Featured Projects</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
              ${projects.map((p: any) => {
                const projectImg = sanitizeImageUrl(p.imageUrl)
                return `
                <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 20px;">
                  ${projectImg ? `<img src="${projectImg}" alt="${escapeHtml(p.title)}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />` : (isCreative || (!isMinimal && !isProfessional)) ? `
                    <div style="width: 100%; height: 160px; background: rgba(148, 163, 184, 0.08); border: 1px dashed ${borderColor}; border-radius: 8px; margin-bottom: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; font-size: 12px; gap: 4px;">
                      <span style="font-weight: 600; color: ${textColor};">${escapeHtml(p.title)}</span>
                      <span style="font-size: 11px; opacity: 0.7;">No Preview Image</span>
                    </div>
                  ` : ""}
                  <h3 style="font-size: 18px; font-weight: 700; color: ${textColor}; margin: 0 0 8px 0;">${escapeHtml(p.title)}</h3>
                  <p style="color: ${isMinimal || isProfessional ? "#64748b" : "#94a3b8"}; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">${escapeHtml(p.description || "")}</p>
                  <div style="display: flex; gap: 12px; font-size: 13px;">
                    ${p.liveUrl ? `<a href="${sanitizeUrl(p.liveUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${accentColor}; text-decoration: none; font-weight: 600;">Live Demo ↗</a>` : ""}
                    ${p.sourceUrl ? `<a href="${sanitizeUrl(p.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${isMinimal || isProfessional ? "#475569" : "#94a3b8"}; text-decoration: none;">GitHub ↗</a>` : ""}
                  </div>
                </div>
              `}).join("")}
            </div>
          </section>
        ` : ""}

        ${experience.length > 0 ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 20px;">Experience</h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${experience.map((exp: any) => `
                <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 6px;">
                    <h3 style="font-size: 16px; font-weight: 700; color: ${textColor}; margin: 0;">${escapeHtml(exp.jobTitle)}</h3>
                    <span style="font-size: 12px; color: ${isMinimal || isProfessional ? "#64748b" : "#64748b"}; font-family: monospace;">${escapeHtml(exp.startDate || "")} - ${escapeHtml(exp.endDate || "Present")}</span>
                  </div>
                  <p style="font-size: 14px; color: ${accentColor}; font-weight: 500; margin: 0 0 8px 0;">${escapeHtml(exp.company)}${exp.location ? `<span style="font-size: 12px; opacity: 0.8; font-weight: 400;"> · ${escapeHtml(exp.location)}</span>` : ""}</p>
                  <p style="font-size: 14px; color: ${isMinimal || isProfessional ? "#64748b" : "#94a3b8"}; line-height: 1.5; margin: 0;">${escapeHtml(exp.description || "")}</p>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        ${education.length > 0 ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 20px;">Education</h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${education.map((edu: any) => `
                <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 16px;">
                  <h3 style="font-size: 15px; font-weight: 700; color: ${textColor}; margin: 0 0 4px 0;">${escapeHtml(edu.institution)}</h3>
                  <p style="font-size: 13px; color: ${accentColor}; margin: 0;">${escapeHtml(edu.degree || "")} ${edu.fieldOfStudy ? `in ${escapeHtml(edu.fieldOfStudy)}` : ""}${edu.location ? `<span style="font-size: 12px; opacity: 0.8;"> · ${escapeHtml(edu.location)}</span>` : ""}${edu.mark ? `<span style="font-size: 12px; opacity: 0.8;"> · Mark: ${escapeHtml(edu.mark)}</span>` : ""}</p>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        ${certifications.length > 0 ? `
          <section style="margin-top: 48px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${textColor}; margin-bottom: 20px;">Certifications</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${certifications.map((cert: any) => `
                <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3 style="font-size: 15px; font-weight: 700; color: ${textColor}; margin: 0;">${escapeHtml(cert.name)}</h3>
                    <p style="font-size: 13px; color: ${isMinimal || isProfessional ? "#64748b" : "#94a3b8"}; margin: 2px 0 0 0;">${escapeHtml(cert.issuer)}</p>
                  </div>
                  ${cert.credentialUrl ? `
                    <a href="${sanitizeUrl(cert.credentialUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${accentColor}; font-size: 13px; font-weight: 600; text-decoration: none;">Verify ↗</a>
                  ` : ""}
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <footer style="margin-top: 64px; padding-top: 24px; border-top: 1px solid ${borderColor}; text-align: center; font-size: 12px; color: #64748b;">
          <p>© ${new Date().getFullYear()} ${escapeHtml(profile.fullName || "")}. Built with Portfolify.</p>
        </footer>
      </div>
    </div>
  `
}

export async function handlePublicPortfolioRequest(req: Request, res: Response) {
  try {
    const rawUsername = String(req.params.username || "").toLowerCase().trim()
    const isApiRequest = req.path.startsWith("/api/public") || req.headers.accept?.includes("application/json")

    const found = await db
      .select()
      .from(schema.portfolios)
      .where(sql`lower(${schema.portfolios.username}) = ${rawUsername}`)
      .limit(1)

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    res.setHeader("Pragma", "no-cache")
    res.setHeader("Expires", "0")
    res.setHeader("Surrogate-Control", "no-store")

    if (found.length === 0) {
      if (isApiRequest) {
        return res.status(404).json({
          error: "Not Found",
          message: `Portfolio with username '${rawUsername}' not found.`,
        })
      }
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>404 - Portfolio Not Found | Portfolify</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
              a { color: #38bdf8; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <div>
              <h1 style="font-size: 48px; margin: 0 0 8px 0;">404</h1>
              <h2>Portfolio Not Found</h2>
              <p style="color: #94a3b8; max-width: 400px; margin: 0 auto 24px auto;">The portfolio username "${escapeHtml(rawUsername)}" does not exist or has been removed.</p>
              <a href="/">← Go to Portfolify Home</a>
            </div>
          </body>
        </html>
      `)
    }

    const portfolio = found[0]

    if (portfolio.status !== "published") {
      if (isApiRequest) {
        return res.status(404).json({
          error: "Unavailable",
          message: "This portfolio is currently in draft mode or unpublished.",
        })
      }
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Portfolio Unpublished | Portfolify</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
              a { color: #38bdf8; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <div>
              <h1 style="font-size: 32px; margin: 0 0 8px 0;">Portfolio Unavailable</h1>
              <p style="color: #94a3b8; max-width: 420px; margin: 0 auto 24px auto;">This portfolio is currently in draft mode or has been unpublished by its owner.</p>
              <a href="/">← Return to Portfolify</a>
            </div>
          </body>
        </html>
      `)
    }

    db.insert(schema.portfolioAnalytics).values({
      id: crypto.randomUUID(),
      portfolioId: portfolio.id,
      eventType: "pageview",
    }).catch(() => {})

    let data: any = {}
    if (portfolio.publishedSnapshot) {
      try {
        data = JSON.parse(portfolio.publishedSnapshot)
      } catch {
        data = {}
      }
    }

    if (isApiRequest) {
      return res.status(200).json({
        success: true,
        portfolio: {
          username: portfolio.username,
          templateId: portfolio.templateId,
          status: portfolio.status,
          publishedAt: portfolio.publishedAt,
        },
        data,
      })
    }

    const fullName = data.profile?.fullName || "Portfolio"
    const title = data.profile?.professionalTitle || "Showcase"
    const description = data.profile?.introduction || `Check out ${fullName}'s portfolio and projects.`
    const pageTitle = data.websiteTitle || `${fullName}${data.profile?.professionalTitle ? ` - ${data.profile.professionalTitle}` : ""} | Portfolify`
    const canonicalUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/${portfolio.username}`

    const htmlBody = renderPortfolioHtml(data)
    const validFavicon = sanitizeImageUrl(data.faviconUrl)
    const validOgImage = sanitizeImageUrl(data.profile?.profileImageUrl)

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    ${validFavicon ? `<link rel="icon" href="${validFavicon}" />` : `<link rel="icon" type="image/svg+xml" href="/vite.svg" />`}

    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    ${validOgImage ? `<meta property="og:image" content="${validOgImage}" />` : ""}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${validOgImage ? `<meta name="twitter:image" content="${validOgImage}" />` : ""}

    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    ${htmlBody}
  </body>
</html>`

    return res.status(200).send(fullHtml)
  } catch {
    if (req.path.startsWith("/api/public") || req.headers.accept?.includes("application/json")) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to render portfolio.",
      })
    }
    return res.status(500).send("Internal Server Error")
  }
}
