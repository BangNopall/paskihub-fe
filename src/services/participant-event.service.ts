import { getApiKeyHeader } from "@/lib/env"
import { parseApiError } from "@/lib/api-error"
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

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

export const participantEventService = {
  async getOpenEvents(token: string): Promise<OpenEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/open`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    const json = await res.json()
    return z.array(OpenEventSchema).parse(json.data)
  },

  async getActiveEvents(token: string): Promise<ActiveEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/active`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    const json = await res.json()
    return z.array(ActiveEventSchema).parse(json.data)
  },

  async registerEvent(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/register`, {
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

  async pelunasanEvent(regisId: string, formData: FormData, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/peserta/events/register/${regisId}/pelunasan`,
      {
        method: "PUT",
        headers: {
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
    if (!res.ok) await parseApiError(res)
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
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) await parseApiError(res)
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
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) await parseApiError(res)
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
          "x-api-key": getApiKeyHeader(),
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) await parseApiError(res)
    const json = await res.json()
    return ParticipantScoreboardSchema.parse(json.data)
  },
}
