import { getApiKeyHeader } from "@/lib/env"
import {
  ScoreboardRes,
  ScoreboardResSchema,
  TeamAssessmentDetailRes,
  TeamAssessmentDetailResSchema,
} from "@/schemas/rekap.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

export const rekapService = {
  async getTeamAssessmentDetail(
    regisId: string,
    token: string
  ): Promise<TeamAssessmentDetailRes> {
    const res = await fetch(`${API_URL}/api/v1/rekap/detail/${regisId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to fetch team assessment detail")
    }
    const data = await res.json()
    return TeamAssessmentDetailResSchema.parse(data.data)
  },

  async getScoreboard(
    eventLevelId: string,
    token: string
  ): Promise<ScoreboardRes> {
    const res = await fetch(
      `${API_URL}/api/v1/rekap/scoreboard/${eventLevelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to fetch scoreboard")
    }
    const data = await res.json()
    return ScoreboardResSchema.parse(data.data)
  },

  async getLeaderboardCustom(
    eventLevelId: string,
    categoryIds: string[],
    token: string
  ): Promise<ScoreboardRes> {
    const res = await fetch(
      `${API_URL}/api/v1/rekap/leaderboard/custom/${eventLevelId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score_category_ids: categoryIds,
        }),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to fetch custom leaderboard")
    }
    const data = await res.json()
    return ScoreboardResSchema.parse(data.data)
  },

  async publishScoreboard(
    eventLevelId: string,
    isPublished: boolean,
    token: string
  ) {
    const res = await fetch(`${API_URL}/api/v1/rekap/publish/${eventLevelId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_score_published: isPublished,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to publish scoreboard")
    }
    return res.json()
  },
}
