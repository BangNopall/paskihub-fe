"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { RankingAwardFormData } from "@/schemas/ranking.schema"

const REVALIDATE_PATH = "/organizer/dashboard/ranking-system"

async function getSession() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error("Unauthorized")
  return session
}

export async function createRankingAwardAction(
  eventId: string,
  data: RankingAwardFormData
) {
  try {
    const session = await getSession()

    // TODO: Call actual service when backend is ready
    // await rankingService.createAward(eventId, data, session.accessToken)

    console.log("Creating award for event", eventId, data)

    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Konfigurasi juara berhasil ditambahkan" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambahkan konfigurasi juara",
    }
  }
}

export async function updateRankingAwardAction(
  eventId: string,
  id: string,
  data: RankingAwardFormData
) {
  try {
    const session = await getSession()

    // TODO: Call actual service when backend is ready
    // await rankingService.updateAward(eventId, id, data, session.accessToken)

    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Konfigurasi juara berhasil diperbarui" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui konfigurasi juara",
    }
  }
}

export async function deleteRankingAwardAction(eventId: string, id: string) {
  try {
    const session = await getSession()

    // TODO: Call actual service when backend is ready
    // await rankingService.deleteAward(eventId, id, session.accessToken)

    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Konfigurasi juara berhasil dihapus" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus konfigurasi juara",
    }
  }
}
