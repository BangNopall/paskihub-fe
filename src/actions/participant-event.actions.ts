"use server"

import { participantEventService } from "@/services/participant-event.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function registerEventAction(formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await participantEventService.registerEvent(formData, session.accessToken)
    revalidatePath("/peserta/dashboard/event")
    return { success: true, message: "Pendaftaran berhasil dikirim." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mendaftar" }
  }
}

export async function pelunasanEventAction(regisId: string, formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await participantEventService.pelunasanEvent(regisId, formData, session.accessToken)
    revalidatePath(`/peserta/dashboard/event/${regisId}/overview`)
    return { success: true, message: "Bukti pembayaran berhasil diunggah." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mengunggah bukti" }
  }
}
