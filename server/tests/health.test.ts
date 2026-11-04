import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"

describe("Server Health Endpoint", () => {
  it("should respond with status 200 and ok message", async () => {
    const response = await request(app).get("/api/health")
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("status", "ok")
    expect(response.body).toHaveProperty("service", "portfolify-api")
    expect(response.body).toHaveProperty("timestamp")
  })
})
