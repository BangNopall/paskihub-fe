import { getApiKeyHeader } from "@/lib/env"
import { EODataFormData, PesertaDataFormData } from "@/schemas/profile.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
import { parseApiError } from "@/lib/api-error"

export const profileService = {
  async getEventsByUserId(token: string, userId: string) {
    const res = await fetch(`${API_URL}/api/v1/events/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    const data = await res.json()
    let events = data.data || []

    // FALLBACK: If events are empty, this might be a staff account.
    // We try to fetch the EO profile which returns the main organizer's info.
    if (events.length === 0) {
      try {
        const profileRes = await this.getEOProfile(token)
        const mainEoId = profileRes?.data?.id || profileRes?.data?.user_id

        if (mainEoId && mainEoId !== userId) {
          const staffRes = await fetch(
            `${API_URL}/api/v1/events/user/${mainEoId}`,
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
          if (staffRes.ok) {
            const staffData = await staffRes.json()
            events = staffData.data || []
          }
        }
      } catch (e) {
        // Fallback silently if it's not a staff account or profile is unavailable
        // eslint-disable-next-line no-console
        console.warn("Staff event fallback check failed:", e)
      }
    }

    return events
  },

  async updateEvent(id: string, data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/events/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async uploadEventLogo(id: string, file: File, token: string) {
    const formData = new FormData()
    formData.append("logo", file)
    const res = await fetch(`${API_URL}/api/v1/events/upload/${id}/logo`, {
      method: "POST",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async uploadEventPoster(id: string, file: File, token: string) {
    const formData = new FormData()
    formData.append("poster", file)

    const res = await fetch(`${API_URL}/api/v1/events/upload/${id}/poster`, {
      method: "POST",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async createEventLevel(eventId: string, data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/events/${eventId}/levels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async updateEventLevel(
    eventId: string,
    levelId: string,
    data: any,
    token: string
  ) {
    const res = await fetch(
      `${API_URL}/api/v1/events/${eventId}/levels/${levelId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async deleteEventLevel(eventId: string, levelId: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/events/${eventId}/levels/${levelId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async getPesertaProfile(token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async createEvent(data: EODataFormData, token: string, userId?: string) {
    // Mapping frontend EODataFormData to backend dto.EventCreate
    const payload = {
      name: data.name,
      organizer: data.organizer,
      location: `${data.location}, ${data.address}`,
      nama_pj: data.nama_pj,
      no_wa_pj: data.no_wa_pj,
      bank_name: data.bank_name,
      bank_number: data.bank_number,
      open_date: data.open_date,
      close_date: data.close_date,
      user_id: userId,
    }

    const res = await fetch(`${API_URL}/api/v1/events/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async updatePesertaProfile(data: PesertaDataFormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async updatePesertaPassword(data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile/security`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async getEOProfile(token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/profile`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },

  async updateEOPassword(data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) await parseApiError(res)
    return res.json()
  },
}
