import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })
dotenv.config({ path: path.resolve(process.cwd(), "../.env") })

import app from "./app.js"
import { initDatabase } from "./db/init.js"

const port = Number(process.env.PORT) || 5000

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolify server listening on port ${port}`)
})

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`)
  } else {
    console.error("Server listener error:", err)
  }
})

initDatabase().catch((err) => {
  console.error("Database initialization notice:", err)
})
