import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import dns from "dns"
import dotenv from "dotenv"
import path from "path"
import * as schema from "./schema.js"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })
dotenv.config({ path: path.resolve(process.cwd(), "../.env") })

const { Pool } = pg

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/portfolify"

const isRemoteDb = Boolean(
  connectionString.includes("supabase") ||
  connectionString.includes("pooler") ||
  connectionString.includes("render.com") ||
  process.env.DATABASE_SSL === "true" ||
  (process.env.NODE_ENV === "production" && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1"))
)

const dnsLookup = (
  hostname: string,
  opts: any,
  cb: (err: any, address?: string, family?: number) => void
) => {
  if (typeof opts === "function") {
    cb = opts
    opts = {}
  }

  dns.resolve4(hostname, (err: any, addresses: any) => {
    if (err || !addresses || addresses.length === 0) {
      return dns.lookup(hostname, opts, cb)
    }

    const healthy = (addresses as string[]).filter((ip: string) => ip !== "13.36.13.135")
    const selected = healthy.length > 0 ? healthy[0] : addresses[0]
    cb(null, selected, 4)
  })
}

export const pool = new Pool({
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ...(isRemoteDb ? { lookup: dnsLookup } : {}),
} as any)

pool.on("error", (err: any) => {
  console.error("PostgreSQL pool client error:", err?.message || err)
})

export const db = drizzle(pool, { schema })
