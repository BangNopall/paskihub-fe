import { getApiKeyHeader } from "@/lib/env"
import { parseApiError } from "@/lib/api-error"
import {
  homeStatsResponseSchema,
  type HomeStats,
} from "@/schemas/home-stats.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

class HomeStatsService {
  async getStats(): Promise<HomeStats> {
    const res = await fetch(`${API_URL}/api/v1/public/home-stats`, {
      headers: {
        "x-api-key": getApiKeyHeader(),
      },
      cache: "no-store",
    })

    if (!res.ok) {
      await parseApiError(res)
    }

    const json = await res.json()
    return homeStatsResponseSchema.parse(json).data
  }
}

export const homeStatsService = new HomeStatsService()
