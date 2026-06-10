import { getApiKeyHeader } from "@/lib/env"
import {
  ParticipantTeamRes,
  ParticipantTeamResSchema,
  TeamDetailRes,
  TeamDetailResSchema,
} from "@/schemas/team.schema"
import { parseApiError } from "@/lib/api-error"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

export const teamService = {
  async getTeams(token: string): Promise<ParticipantTeamRes[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) await parseApiError(res)

    const json = await res.json()
    const data = json.data || []

    return data.map((item: any) => ParticipantTeamResSchema.parse(item))
  },

  async getTeamDetail(
    id: string,
    token: string
  ): Promise<TeamDetailRes | null> {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) await parseApiError(res)

    const json = await res.json()

    return TeamDetailResSchema.parse(json.data)
  },

  async createTeam(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams`, {
      method: "POST",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) await parseApiError(res)

    return await res.json().catch(() => ({}))
  },

  async updateTeam(id: string, formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "PUT",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) await parseApiError(res)

    return await res.json().catch(() => ({}))
  },

  async deleteTeam(id: string, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) await parseApiError(res)

    return await res.json().catch(() => ({}))
  },
}
