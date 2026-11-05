import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient

export async function requestPasswordResetEmail(email: string, redirectTo: string) {
  return (authClient as any).requestPasswordReset({
    email,
    redirectTo,
  })
}
