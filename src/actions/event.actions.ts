"use server"

import { profileService } from "@/services/profile.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateEventAction(id: string, data: any) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await profileService.updateEvent(id, data, session.accessToken)
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Event berhasil diperbarui." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui event",
    }
  }
}

export async function uploadEventLogoAction(id: string, formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const file = formData.get("logo") as File
    if (!file || file.size === 0) throw new Error("File logo tidak ditemukan")
    if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran file maksimal 5MB")
    if (!["image/jpeg", "image/png"].includes(file.type))
      throw new Error("Format file harus JPG atau PNG")

    await profileService.uploadEventLogo(id, file, session.accessToken)
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Logo berhasil diunggah." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mengunggah logo" }
  }
}

export async function uploadEventPosterAction(id: string, formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const file = formData.get("poster") as File
    if (!file || file.size === 0) throw new Error("File poster tidak ditemukan")
    if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran file maksimal 5MB")
    if (!["image/jpeg", "image/png"].includes(file.type))
      throw new Error("Format file harus JPG atau PNG")

    await profileService.uploadEventPoster(id, file, session.accessToken)
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Poster berhasil diunggah." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengunggah poster",
    }
  }
}

export async function createEventLevelAction(eventId: string, data: any) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await profileService.createEventLevel(eventId, data, session.accessToken)
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Jenjang berhasil ditambahkan." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambahkan jenjang",
    }
  }
}

export async function updateEventLevelAction(
  eventId: string,
  levelId: string,
  data: any
) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await profileService.updateEventLevel(
      eventId,
      levelId,
      data,
      session.accessToken
    )
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Jenjang berhasil diperbarui." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui jenjang",
    }
  }
}

export async function deleteEventLevelAction(eventId: string, levelId: string) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await profileService.deleteEventLevel(eventId, levelId, session.accessToken)
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Jenjang berhasil dihapus." }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus jenjang",
    }
  }
}
