import { getApiKeyHeader } from "@/lib/env"
import {
  OrganizerDashboard,
  organizerDashboardResponseSchema,
} from "@/schemas/organizer-dashboard.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
const API_KEY = process.env.API_KEY

class OrganizerDashboardService {
  async getDashboard(token: string): Promise<OrganizerDashboard> {
    const res = await fetch(`${API_URL}/api/v1/organizer/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": getApiKeyHeader(),
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : "Gagal mengambil data dashboard organizer"

      throw new Error(message)
    }

    const json = await res.json()
    return organizerDashboardResponseSchema.parse(json).data
  }
}

export const organizerDashboardService = new OrganizerDashboardService()
