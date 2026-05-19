import {
  OpenEventSchema,
  ActiveEventSchema,
  AssessmentRecapSchema,
  ParticipantScoreboardSchema,
  RegistrationDetailSchema,
} from "@/schemas/participant-event.schema"
import type {
  ActiveEvent,
  AssessmentRecap,
  OpenEvent,
  ParticipantScoreboard,
  RegistrationDetail,
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
    const json = await res.json()
    if (!res.ok) return []
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
    const res = await fetch(
      `${API_URL}/api/v1/peserta/events/register/${regisId}/pelunasan`,
      {
        method: "PUT",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal upload pelunasan")
    }
    return res.json()
  },

  async getRegistrationDetail(
    regisId: string,
    token: string
  ): Promise<RegistrationDetail | null> {
    const res = await fetch(
      `${API_URL}/api/v1/peserta/events/registrations/${regisId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return null
    const json = await res.json()
    return RegistrationDetailSchema.parse(json.data)
  },

  async getAssessmentRecap(
    regisId: string,
    token: string
  ): Promise<AssessmentRecap | null> {
    const res = await fetch(
      `${API_URL}/api/v1/peserta/assessment/recap/${regisId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return null
    const json = await res.json()
    return AssessmentRecapSchema.parse(json.data)
  },

  async getScoreboard(
    eventLevelId: string,
    token: string
  ): Promise<ParticipantScoreboard | null> {
    const res = await fetch(
      `${API_URL}/api/v1/peserta/rekap/scoreboard/${eventLevelId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return null
    const json = await res.json()
    return ParticipantScoreboardSchema.parse(json.data)
  },
}
