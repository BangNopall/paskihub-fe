"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { judgeService } from "@/services/judge.service"
import { revalidatePath } from "next/cache"

async function getSessionToken() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error("Sesi telah berakhir. Silakan login kembali.")
  }
  return session.accessToken
}

export async function createJudgeAction(eventId: string, name: string) {
  try {
    const token = await getSessionToken()
    await judgeService.createJudge(token, eventId, name)
    revalidatePath("/organizer/dashboard/jury")
    return { success: true, message: "Juri berhasil ditambahkan" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateJudgeAction(
  eventId: string,
  id: string,
  name: string
) {
  try {
    const token = await getSessionToken()
    await judgeService.updateJudge(token, eventId, id, name)
    revalidatePath("/organizer/dashboard/jury")
    return { success: true, message: "Juri berhasil diperbarui" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function deleteJudgeAction(eventId: string, id: string) {
  try {
    const token = await getSessionToken()
    await judgeService.deleteJudge(token, eventId, id)
    revalidatePath("/organizer/dashboard/jury")
    return { success: true, message: "Juri berhasil dihapus" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
