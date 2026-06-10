import { parseApiError } from "@/lib/api-error"
import { getApiKeyHeader } from "@/lib/env"
import {
  SystemSettingResSchema,
  SystemSettingRes,
  UpdateSystemSettingReq,
} from "@/schemas/system-setting.schema"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

class SystemSettingService {
  async getSettings(token: string): Promise<SystemSettingRes> {
    const res = await fetch(`${API_URL}/api/v1/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": getApiKeyHeader(),
      },
    })

    if (!res.ok) {
      await parseApiError(res)
    }

    const json = await res.json()
    return SystemSettingResSchema.parse(json.data)
  }

  async getPublicSettings(): Promise<SystemSettingRes> {
    const res = await fetch(`${API_URL}/api/v1/settings/public`, {
      headers: {
        "x-api-key": getApiKeyHeader(),
      },
    })

    if (!res.ok) {
      await parseApiError(res)
    }

    const json = await res.json()
    return SystemSettingResSchema.parse(json.data)
  }

  async updateSettings(token: string, data: UpdateSystemSettingReq) {
    const res = await fetch(`${API_URL}/api/v1/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": getApiKeyHeader(),
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      await parseApiError(res)
    }

    return res.json()
  }
}

export const systemSettingService = new SystemSettingService()
