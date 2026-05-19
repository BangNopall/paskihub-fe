import {
  AdminDashboard,
  adminDashboardResponseSchema,
} from "@/schemas/admin-dashboard.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

class AdminDashboardService {
  async getDashboard(token: string): Promise<AdminDashboard> {
    const res = await fetch(`${API_URL}/api/v1/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": API_KEY || "",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : "Gagal mengambil data dashboard admin"

      throw new Error(message)
    }

    const json = await res.json()
    return adminDashboardResponseSchema.parse(json).data
  }
}

export const adminDashboardService = new AdminDashboardService()
