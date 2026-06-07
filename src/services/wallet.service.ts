import { getApiKeyHeader } from "@/lib/env"
import { parseApiError } from "@/lib/api-error"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

export const walletService = {
  async getWalletInfo(token: string, eventId: string) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    const data = await res.json()
    return data.data
  },

  async getWalletLogs(token: string, eventId: string) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}/logs`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) await parseApiError(res)
    const data = await res.json()
    return data.data || []
  },

  async getPublicSettings() {
    const res = await fetch(`${API_URL}/api/v1/settings/public`, {
      method: "GET",
      headers: {
        "x-api-key": getApiKeyHeader(),
      },
      next: { revalidate: 3600 }, // Cache selama 1 jam
    })

    if (!res.ok) await parseApiError(res)

    const data = await res.json()
    return data.data
  },

  async requestTopUp(token: string, eventId: string, formData: FormData) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}/topup`, {
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
}
