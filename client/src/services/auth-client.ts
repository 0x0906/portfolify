import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  fetchOptions: {
    credentials: "include",
    onResponse: async (context: any) => {
      const authToken = context?.response?.headers?.get?.("set-auth-token")
      if (authToken) {
        try {
          localStorage.setItem("bearer_token", authToken)
        } catch {}
      }
    },
    onRequest: async (context: any) => {
      try {
        const token = localStorage.getItem("bearer_token")
        if (token && context?.headers) {
          context.headers.set("Authorization", `Bearer ${token}`)
        }
      } catch {}
    },
  },
})

export const {
  signIn,
  signUp,
  useSession,
} = authClient

export async function signOut() {
  try {
    localStorage.removeItem("bearer_token")
  } catch {}
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        try {
          localStorage.removeItem("bearer_token")
        } catch {}
      },
    },
  })
}

export async function requestPasswordResetEmail(email: string, redirectTo: string) {
  return (authClient as any).requestPasswordReset({
    email,
    redirectTo,
  })
}
