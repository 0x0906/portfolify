import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authClient } from "@/services/auth-client"

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isEmailVerified: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isEmailVerified: false,
  signOut: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const sessionResult = await authClient.getSession()
      if (sessionResult && sessionResult.data && sessionResult.data.user) {
        if ((sessionResult.data as any)?.session?.token) {
          try {
            localStorage.setItem("bearer_token", (sessionResult.data as any).session.token)
          } catch {}
        }
        setUser(sessionResult.data.user as User)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("bearer_token")
    } catch {}
    try {
      await authClient.signOut()
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.emailVerified,
    signOut: handleSignOut,
    refreshSession: fetchSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
