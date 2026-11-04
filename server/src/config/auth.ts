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
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"
      const resetLink = `${clientUrl}/reset-password?token=${token}`
      await sendPasswordResetEmail(user.email, resetLink)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, token }: any) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"
      const verificationLink = `${clientUrl}/verify-email?token=${token}`
      await sendVerificationEmail(user.email, verificationLink)
    },
  },
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
})
