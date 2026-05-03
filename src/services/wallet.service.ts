const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
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
    if (!res.ok) return null
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
    if (!res.ok) return []
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
      console.warn("Falling back to default settings due to error:", error)
      // Return default mock if backend not ready or fails
      return {
        coin_rate: 1000,
        bank_info: {
          bank_name: "BCA",
          account_number: "1234567890",
          account_name: "PaskiHub Indonesia",
        },
      }
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
