const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
import {
  SystemSettingResSchema,
  SystemSettingRes,
  UpdateSystemSettingReq,
} from "@/schemas/system-setting.schema"

class SystemSettingService {
  async getSettings(token: string): Promise<SystemSettingRes> {
    const res = await fetch(`${API_URL}/api/v1/settings/public`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.API_KEY!,
      },
    })

    if (!res.ok) {
      throw new Error("Gagal mengambil pengaturan sistem")
    }

    const json = await res.json()
    return SystemSettingResSchema.parse(json.data)
  }

  async getPublicSettings(): Promise<SystemSettingRes> {
    const res = await fetch(`${API_URL}/api/v1/settings/public`, {
      headers: {
        "x-api-key": process.env.API_KEY!,
      },
    })

    if (!res.ok) {
      throw new Error("Gagal mengambil pengaturan publik")
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
        "x-api-key": process.env.API_KEY!,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.message || "Gagal memperbarui pengaturan")
    }

    return res.json()
  }
}

export const systemSettingService = new SystemSettingService()
