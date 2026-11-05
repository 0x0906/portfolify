import { betterAuth } from "better-auth"
import { APIError } from "better-auth/api"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email.js"
import { validateEmail } from "../utils/validation.js"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const check = validateEmail(user.email)
          if (!check.valid) {
            throw new APIError("BAD_REQUEST", { message: check.error || "Invalid email address." })
          }
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_development_secret_key_at_least_32_characters_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    async sendResetPassword({ user, token }: any) {
      const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")
      const resetLink = `${clientUrl}/reset-password?token=${token}`
      await sendPasswordResetEmail(user.email, resetLink)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, token }: any) {
      const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")
      const verificationLink = `${clientUrl}/verify-email?token=${token}`
      await sendVerificationEmail(user.email, verificationLink)
    },
  },
  trustedOrigins: async (request) => {
    const rawClientUrl = process.env.CLIENT_URL?.replace(/\/$/, "")
    const customTrusted = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim().replace(/\/$/, ""))
      .filter(Boolean)

    const origins = [
      ...(rawClientUrl ? [rawClientUrl] : []),
      ...customTrusted,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://*.vercel.app",
      "*.vercel.app",
      "https://*.onrender.com",
      "*.onrender.com",
    ]

    if (!request) return origins
    const reqOrigin = request.headers.get("origin") || request.headers.get("referer")
    if (reqOrigin) {
      try {
        const parsed = new URL(reqOrigin).origin
        if (
          parsed.endsWith(".vercel.app") ||
          parsed.endsWith(".onrender.com") ||
          parsed.includes("localhost") ||
          parsed.includes("127.0.0.1") ||
          (rawClientUrl && parsed === rawClientUrl)
        ) {
          origins.push(parsed)
        }
      } catch {}
    }
    return Array.from(new Set(origins))
  },
})
