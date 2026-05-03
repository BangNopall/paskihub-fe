import { EODataFormData, PesertaDataFormData } from "@/schemas/profile.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const profileService = {
  async getEventsByUserId(token: string, userId: string) {
    const res = await fetch(`${API_URL}/api/v1/events/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  },

  async updateEvent(id: string, data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/events/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update event")
    }
    return res.json()
  },

  async uploadEventLogo(id: string, file: File, token: string) {
    const formData = new FormData()
    formData.append("logo", file)
    const res = await fetch(`${API_URL}/api/v1/events/upload/${id}/logo`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to upload logo")
    }
    return res.json()
  },

  async uploadEventPoster(id: string, file: File, token: string) {
    const formData = new FormData()
    formData.append("poster", file)

    const res = await fetch(`${API_URL}/api/v1/events/upload/${id}/poster`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to upload poster")
    }
    return res.json()
  },

  async createEventLevel(eventId: string, data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/events/${eventId}/levels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create event level")
    }
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
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update event level")
    }
    return res.json()
  },

  async deleteEventLevel(eventId: string, levelId: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/events/${eventId}/levels/${levelId}`,
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
      throw new Error(err.message || "Failed to delete event level")
    }
    return res.json()
  },

  async getPesertaProfile(token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return null
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
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create event")
    }
    return res.json()
  },

  async updatePesertaProfile(data: PesertaDataFormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update profile")
    }
    return res.json()
  },

  async getEOProfile(token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/profile`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to get EO profile")
    }
    return res.json()
  },

  async updateEOPassword(data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update EO password")
    }
    return res.json()
  },

  async getEOStaff(token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/staff`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to get EO staff")
    }
    return res.json()
  },

  async createEOStaff(data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create staff account")
    }
    return res.json()
  },

  async resetEOStaffPassword(id: string, data: any, token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/staff/${id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to reset staff password")
    }
    return res.json()
  },

  async deleteEOStaff(id: string, token: string) {
    const res = await fetch(`${API_URL}/api/v1/eo/staff/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete staff account")
    }
    return res.json()
  },
}
