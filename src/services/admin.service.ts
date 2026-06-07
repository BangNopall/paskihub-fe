import {
  AdminUserListSchema,
  UserResponse,
  AdminCreateInput,
  AdminTransactionListResponse,
  AdminTransactionListResponseSchema,
} from "@/schemas/admin.schema"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
const API_KEY = process.env.API_KEY

const mapUserData = (u: any) => {
  let status = "Active"
  if (u.is_banned) {
    status = "Banned"
  } else if (!u.email_is_verified) {
    status = "Pending"
  }

  let joined = "-"
  if (u.created_at) {
    const date = new Date(u.created_at)
    joined = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return {
    ...u,
    status,
    joined,
  }
}

export const adminService = {
  async fetchAdmins(): Promise<UserResponse[]> {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mengambil data admin")
    }

    const json = await res.json()
    const rawData = json.data || json
    const mappedData = Array.isArray(rawData) ? rawData.map(mapUserData) : []

    const parsed = AdminUserListSchema.safeParse(mappedData)
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.error("Zod parse error:", parsed.error)
      return []
    }

    return parsed.data
  },

  async fetchUsers(): Promise<UserResponse[]> {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mengambil data user")
    }

    const json = await res.json()
    const rawData = json.data || json
    const mappedData = Array.isArray(rawData) ? rawData.map(mapUserData) : []

    const parsed = AdminUserListSchema.safeParse(mappedData)
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.error("Zod parse error:", parsed.error)
      return []
    }

    return parsed.data
  },

  async banUser(userId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/ban`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal memblokir user")
    }

    return { success: true }
  },

  async unbanUser(userId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/unban`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mengaktifkan user")
    }

    return { success: true }
  },

  async verifyUser(userId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal memverifikasi user")
    }

    return { success: true }
  },

  async fetchUserDetail(userId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mengambil detail user")
    }

    const json = await res.json()
    return json.data || json
  },

  async createAdmin(payload: AdminCreateInput) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal membuat akun admin")
    }

    return await res.json()
  },

  async deleteAdmin(adminId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/admins/${adminId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal menghapus akun admin")
    }

    return { success: true }
  },

  async resetAdminPassword(adminId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(
      `${API_URL}/api/v1/admin/admins/${adminId}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mereset password admin")
    }

    return { success: true }
  },

  async updateEventStatus(eventId: string, status: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(
      `${API_URL}/api/v1/admin/events/${eventId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal memperbarui status event")
    }
    return { success: true }
  },

  async fetchTransactions(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AdminTransactionListResponse> {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const url = new URL(`${API_URL}/api/v1/wallets/admin/transactions`)
    if (status && status !== "all") url.searchParams.append("status", status)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("limit", limit.toString())

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal mengambil data transaksi")
    }

    const json = await res.json()
    const rawData = json.data || json
    const parsed = AdminTransactionListResponseSchema.safeParse(rawData)
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.error("Zod parse error:", parsed.error)
      return { transactions: [], total: 0, page, limit }
    }

    return {
      ...parsed.data,
      transactions: parsed.data.transactions ?? [],
    }
  },

  async approveTransaction(transactionId: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(
      `${API_URL}/api/v1/wallets/admin/transactions/${transactionId}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal menyetujui transaksi")
    }

    return { success: true }
  },

  async rejectTransaction(transactionId: string, rejection_reason: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(
      `${API_URL}/api/v1/wallets/admin/transactions/${transactionId}/reject`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejection_reason }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal menolak transaksi")
    }

    return { success: true }
  },

  async fetchAdminUsers(): Promise<UserResponse[]> {
    return this.fetchUsers()
  },
}
