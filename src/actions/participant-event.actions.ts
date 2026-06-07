"use server"

import { participantEventService } from "@/services/participant-event.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function registerEventAction(formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    for (const [key, value] of formData.entries()) {
      if (
        typeof value === "object" &&
        value !== null &&
        "size" in value &&
        "type" in value
      ) {
        const file = value as File
        if (file.size > 0) {
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`Ukuran file maksimal 5MB`)
          }
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            throw new Error(`Format file harus JPG, PNG, atau PDF`)
          }
        }
      }
    }

    await participantEventService.registerEvent(formData, session.accessToken)
    revalidatePath("/peserta/dashboard/event")
    return { success: true, message: "Pendaftaran berhasil dikirim." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mendaftar" }
  }
}

export async function pelunasanEventAction(
  regisId: string,
  formData: FormData
) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    for (const [key, value] of formData.entries()) {
      if (
        typeof value === "object" &&
        value !== null &&
        "size" in value &&
        "type" in value
      ) {
        const file = value as File
        if (file.size > 0) {
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`Ukuran file maksimal 5MB`)
          }
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            throw new Error(`Format file harus JPG, PNG, atau PDF`)
          }
        }
      }
    }

    await participantEventService.pelunasanEvent(
      regisId,
      formData,
      session.accessToken
    )
    revalidatePath(`/peserta/dashboard/event/${regisId}/overview`)
    return { success: true, message: "Bukti pembayaran berhasil diunggah." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengunggah bukti",
    }
  }
}
