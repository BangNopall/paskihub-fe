"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"

export async function approveTeamAction(
  eventId: string,
  registrationId: string,
  paymentStatus: string
) {
  const session: any = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const res = await fetch(
    `${API_URL}/api/v1/eo/events/${eventId}/teams/${registrationId}/approve`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        "x-api-key": `Key ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ payment_status: paymentStatus }),
    }
  )

  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.message || "Gagal menyetujui pendaftaran")
  }

  revalidatePath("/organizer/dashboard/team")
  return { success: true }
}

export async function rejectTeamAction(
  eventId: string,
  registrationId: string,
  rejectionReason: string
) {
  const session: any = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const res = await fetch(
    `${API_URL}/api/v1/eo/events/${eventId}/teams/${registrationId}/reject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        "x-api-key": `Key ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    }
  )

  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.message || "Gagal menolak pendaftaran")
  }

  revalidatePath("/organizer/dashboard/team")
  return { success: true }
}

export async function kickTeamAction(eventId: string, registrationId: string) {
  const session: any = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const res = await fetch(
    `${API_URL}/api/v1/eo/events/${eventId}/teams/${registrationId}/kick`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "x-api-key": `Key ${process.env.API_KEY}`,
      },
    }
  )

  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.message || "Gagal mengeluarkan tim")
  }

  revalidatePath("/organizer/dashboard/team")
  return { success: true }
}
