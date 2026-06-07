import { getApiKeyHeader } from "@/lib/env"
import {
  ParticipantDashboard,
  participantDashboardResponseSchema,
} from "@/schemas/participant-dashboard.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
const API_KEY = process.env.API_KEY

class ParticipantDashboardService {
  async getDashboard(token: string): Promise<ParticipantDashboard> {
    const res = await fetch(`${API_URL}/api/v1/peserta/dashboard`, {
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
          : "Gagal mengambil data dashboard peserta"

      throw new Error(message)
    }

    const json = await res.json()
    return participantDashboardResponseSchema.parse(json).data
  }
}

export const participantDashboardService = new ParticipantDashboardService()
