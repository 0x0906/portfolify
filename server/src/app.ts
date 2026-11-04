import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./config/auth.js"
import portfolioRoutes from "./routes/portfolioRoutes.js"
import { handlePublicPortfolioRequest } from "./services/portfolioRenderer.js"

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)

const app = express()

app.set("trust proxy", 1)

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

app.all("/api/auth/*", toNodeHandler(auth))

app.get("/verify-email", (req: Request, res: Response) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"
  const token = String(req.query.token || "")
  res.redirect(`${clientUrl}/verify-email?token=${encodeURIComponent(token)}`)
})

app.get("/reset-password/:token", (req: Request, res: Response) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"
  const token = String(req.params.token || "")
  res.redirect(`${clientUrl}/reset-password?token=${encodeURIComponent(token)}`)
})

app.use(cookieParser())
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))

app.use("/api/portfolio", portfolioRoutes)

const handleHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "portfolify-api",
    timestamp: new Date().toISOString()
  })
}

app.get("/health", handleHealth)
app.get("/api/health", handleHealth)

app.get("/api/public/:username", handlePublicPortfolioRequest)
app.get("/p/:username", handlePublicPortfolioRequest)

const reservedPrefixes = [
  "api",
  "health",
  "verify-email",
  "reset-password",
  "sign-in",
  "sign-up",
  "login",
  "register",
  "dashboard",
  "editor",
  "preview",
  "settings",
  "templates",
  "about",
  "features",
  "contact",
  "privacy",
  "terms"
]

app.get("/:username", (req: Request, res: Response, next: NextFunction) => {
  const param = String(req.params.username || "").toLowerCase()
  if (reservedPrefixes.includes(param) || param.includes(".")) {
    return next()
  }
  return handlePublicPortfolioRequest(req, res)
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  })
})

export default app
