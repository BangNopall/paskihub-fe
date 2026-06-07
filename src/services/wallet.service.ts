const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
const API_KEY = process.env.API_KEY

export const walletService = {
  async getWalletInfo(token: string, eventId: string) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const errMsg = err?.message || err?.error || `HTTP ${res.status}`
      if (res.status === 401) throw new Error("Unauthorized: " + errMsg)
      if (res.status === 403) throw new Error("Forbidden: " + errMsg)
      if (res.status === 400) throw new Error("Bad Request: " + errMsg)
      if (
        err?.status === "KICKED" ||
        err?.message === "KICKED" ||
        err?.error === "KICKED"
      )
        throw new Error("KICKED")
      throw new Error(errMsg)
    }
    const data = await res.json()
    return data.data
  },

  async getWalletLogs(token: string, eventId: string) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}/logs`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const errMsg = err?.message || err?.error || `HTTP ${res.status}`
      if (res.status === 401) throw new Error("Unauthorized: " + errMsg)
      if (res.status === 403) throw new Error("Forbidden: " + errMsg)
      if (res.status === 400) throw new Error("Bad Request: " + errMsg)
      if (
        err?.status === "KICKED" ||
        err?.message === "KICKED" ||
        err?.error === "KICKED"
      )
        throw new Error("KICKED")
      throw new Error(errMsg)
    }
    const data = await res.json()
    return data.data || []
  },

  async getPublicSettings(token: string) {
    try {
      const res = await fetch(`${API_URL}/api/v1/settings/public`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 }, // Cache selama 1 jam
      })

      if (!res.ok) {
        throw new Error("Failed to fetch public settings")
      }
      const data = await res.json()
      return data.data
    } catch (error) {
      console.error("Failed to fetch public settings:", error)
      return null
    }
  },

  async requestTopUp(token: string, eventId: string, formData: FormData) {
    const res = await fetch(`${API_URL}/api/v1/wallets/${eventId}/topup`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error.message || "Gagal mengajukan top up")
    }
    return res.json()
  },
}
