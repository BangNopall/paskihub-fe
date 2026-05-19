const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY
import {
  EOTeamListResSchema,
  EOTeamDetailResSchema,
  EOTeamListRes,
  EOTeamDetailRes,
  EOTeamStatsRes,
  EOTeamStatsResSchema,
} from "@/schemas/eo-team.schema"
import { z } from "zod"

class EOTeamService {
  async getTeamList(
    token: string,
    eventId: string,
    eventLevelId?: string,
    institutionType?: string
  ): Promise<EOTeamListRes[]> {
    const url = new URL(`${API_URL}/api/v1/eo/events/${eventId}/teams`)
    if (eventLevelId) {
      url.searchParams.append("event_level_id", eventLevelId)
    }
    if (institutionType) {
      url.searchParams.append("institution_type", institutionType)
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": API_KEY || "",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Gagal mengambil daftar tim")
    }

    const json = await res.json()
    return z.array(EOTeamListResSchema).parse(json.data)
  }

  async getTeamDetail(
    token: string,
    eventId: string,
    registrationId: string
  ): Promise<EOTeamDetailRes> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/teams/${registrationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY || "",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      throw new Error("Gagal mengambil detail tim")
    }

    const json = await res.json()
    return EOTeamDetailResSchema.parse(json.data)
  }

  async getTeamStats(token: string, eventId: string): Promise<EOTeamStatsRes> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/teams/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY || "",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      throw new Error("Gagal mengambil statistik tim")
    }

    const json = await res.json()
    return EOTeamStatsResSchema.parse(json.data)
  }

  async startAssessment(
    token: string,
    eventId: string,
    registrationId: string
  ): Promise<void> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/teams/${registrationId}/start-assessment`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY || "",
        },
      }
    )

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json.message || "Gagal memulai penilaian")
    }
  }
}

export const eoTeamService = new EOTeamService()
