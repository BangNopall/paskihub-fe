const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export interface Judge {
  id: string
  event_id: string
  name: string
}

export const judgeService = {
  async getAllJudges(token: string, eventId: string): Promise<Judge[]> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/judges`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      throw new Error("Gagal mengambil data juri")
    }

    const data = await res.json()
    return data.data || []
  },

  async createJudge(
    token: string,
    eventId: string,
    name: string
  ): Promise<Judge> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/judges`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal menambah juri")
    }

    const data = await res.json()
    return data.data
  },

  async updateJudge(
    token: string,
    eventId: string,
    id: string,
    name: string
  ): Promise<Judge> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/judges/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal memperbarui juri")
    }

    const data = await res.json()
    return data.data
  },

  async deleteJudge(token: string, eventId: string, id: string): Promise<void> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/judges/${id}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal menghapus juri")
    }
  },
}
