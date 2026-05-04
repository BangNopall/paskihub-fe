import {
  AwardRes,
  AwardResSchema,
  RankingAwardFormData,
} from "@/schemas/ranking.schema"
import { z } from "zod"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const rankingService = {
  async getAwards(
    eventId: string,
    token: string,
    levelId?: string
  ): Promise<AwardRes[]> {
    const url = new URL(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/awards`
    )
    if (levelId) url.searchParams.append("level_id", levelId)

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch awards")
    }

    const data = await res.json()
    if (!data.data) {
      return []
    }
    return z.array(AwardResSchema).parse(data.data)
  },

  async createAward(
    eventId: string,
    data: RankingAwardFormData,
    token: string
  ): Promise<AwardRes> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/awards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create award")
    }

    const result = await res.json()
    return AwardResSchema.parse(result.data)
  },

  async updateAward(
    eventId: string,
    id: string,
    data: RankingAwardFormData,
    token: string
  ): Promise<AwardRes> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/awards/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update award")
    }

    const result = await res.json()
    return AwardResSchema.parse(result.data)
  },

  async deleteAward(eventId: string, id: string, token: string): Promise<void> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/awards/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete award")
    }
  },
}
