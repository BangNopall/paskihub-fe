import {
  ParticipantTeamRes,
  ParticipantTeamResSchema,
  TeamDetailRes,
  TeamDetailResSchema,
} from "@/schemas/team.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const teamService = {
  async getTeams(token: string): Promise<ParticipantTeamRes[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) return []

    const json = await res.json()
    const data = json.data || []

    try {
      return data.map((item: any) => ParticipantTeamResSchema.parse(item))
    } catch (error) {
      console.error("Zod validation error in getTeams:", error)
      return []
    }
  },

  async getTeamDetail(
    id: string,
    token: string
  ): Promise<TeamDetailRes | null> {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) return null

    const json = await res.json()

    try {
      return TeamDetailResSchema.parse(json.data)
    } catch (error) {
      console.error("Zod validation error in getTeamDetail:", error)
      return null
    }
  },

  async createTeam(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create team")
    }

    return res.json()
  },

  async updateTeam(id: string, formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "PUT",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update team")
    }

    return res.json()
  },

  async deleteTeam(id: string, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/teams/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete team")
    }

    return res.json()
  },
}
