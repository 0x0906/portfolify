import axios from "axios"

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api"

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    if (!config || config._retry || config.method?.toLowerCase() !== "get") {
      return Promise.reject(error)
    }

    if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED" || !error.response) {
      config._retry = true
      await new Promise((resolve) => setTimeout(resolve, 350))
      return api(config)
    }

    return Promise.reject(error)
  }
)
