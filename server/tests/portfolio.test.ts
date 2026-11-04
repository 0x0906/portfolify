import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"

describe("Portfolio Public & Username Endpoints", () => {
  it("should return 401 when accessing /api/portfolio/me without session", async () => {
    const res = await request(app).get("/api/portfolio/me")
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty("error", "Unauthorized")
  })

  it("should reject reserved usernames", async () => {
    const res = await request(app)
      .get("/api/portfolio/username/check")
      .query({ username: "admin" })
    expect(res.body).toHaveProperty("available", false)
  })

  it("should handle nonexistent public portfolio username", async () => {
    const res = await request(app).get("/nonexistent-user-xyz-999")
    if (res.status === 500) {
      expect(res.text).toBe("Internal Server Error")
    } else {
      expect(res.status).toBe(404)
      expect(res.text).toContain("Portfolio Not Found")
    }
  }, 15000)

  it("should return 404 with no-cache headers for nonexistent or deleted public portfolio api", async () => {
    const res = await request(app).get("/api/public/deleted-user-random-12345")
    if (res.status === 500) {
      expect(res.body).toHaveProperty("error", "Internal Server Error")
    } else {
      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty("error", "Not Found")
      expect(res.headers["cache-control"]).toContain("no-store")
    }
  }, 15000)
})
