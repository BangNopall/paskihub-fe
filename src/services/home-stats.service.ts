import {
  homeStatsResponseSchema,
  type HomeStats,
} from "@/schemas/home-stats.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const emptyHomeStats: HomeStats = {
  total_events: 0,
  total_organizers: 0,
  total_participants: 0,
  total_teams: 0,
}

class HomeStatsService {
  async getStats(): Promise<HomeStats> {
    try {
      const res = await fetch(`${API_URL}/api/v1/public/home-stats`, {
        headers: {
          "x-api-key": API_KEY || "",
        },
        cache: "no-store",
      })

      if (!res.ok) {
        return emptyHomeStats
      }

      const json = await res.json()
      return homeStatsResponseSchema.parse(json).data
    } catch {
      return emptyHomeStats
    }
  }
}

export const homeStatsService = new HomeStatsService()
