import { 
  OpenEvent, 
  OpenEventSchema, 
  ActiveEvent, 
  ActiveEventSchema 
} from "@/schemas/participant-event.schema"
import { z } from "zod"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const participantEventService = {
  async getOpenEvents(token: string): Promise<OpenEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/open`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return []
    const json = await res.json()
    return z.array(OpenEventSchema).parse(json.data || [])
  },

  async getActiveEvents(token: string): Promise<ActiveEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/active`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return []
    const json = await res.json()
    return z.array(ActiveEventSchema).parse(json.data || [])
  },

  async registerEvent(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/register`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal mendaftar event")
    }
    return res.json()
  },

  async pelunasanEvent(regisId: string, formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/register/${regisId}/pelunasan`, {
      method: "PUT",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal upload pelunasan")
    }
    return res.json()
  }
}
