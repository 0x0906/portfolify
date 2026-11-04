import type { Request, Response, NextFunction } from "express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../config/auth.js"

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser
  session?: any
  query: any
  body: any
  headers: any
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session || !session.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be signed in to access this resource.",
      })
    }

    req.user = session.user as AuthenticatedUser
    req.session = session.session
    next()
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication session expired or invalid.",
    })
  }
}

export async function requireVerifiedUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  await requireAuth(req, res, () => {
    if (process.env.NODE_ENV !== "development" && !req.user?.emailVerified) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Email verification is required before managing portfolios.",
      })
    }
    next()
  })
}
