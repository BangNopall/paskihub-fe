"use server"

import { profileService } from "@/services/profile.service"
import {
  eoDataFormSchema,
  EODataFormData,
  pesertaDataFormSchema,
  PesertaDataFormData,
  pesertaUpdatePasswordSchema,
  PesertaUpdatePasswordData,
  eoUpdatePasswordSchema,
  EOUpdatePasswordData,
} from "@/schemas/profile.schema"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createEventAction(data: EODataFormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = eoDataFormSchema.parse(data)
    await profileService.createEvent(parsed, session.accessToken)
    revalidatePath("/organizer/dashboard")
    revalidatePath("/organizer/dashboard/event")
    return { success: true, message: "Event berhasil dibuat." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function updatePesertaProfileAction(data: PesertaDataFormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = pesertaDataFormSchema.parse(data)
    await profileService.updatePesertaProfile(parsed, session.accessToken)
    revalidatePath("/peserta/dashboard")
    revalidatePath("/peserta/dashboard/profile")
    return { success: true, message: "Profil berhasil diperbarui." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function updatePesertaPasswordAction(
  data: PesertaUpdatePasswordData
) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = pesertaUpdatePasswordSchema.parse(data)
    await profileService.updatePesertaPassword(parsed, session.accessToken)
    return { success: true, message: "Password berhasil diperbarui." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function updateEOPasswordAction(data: EOUpdatePasswordData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = eoUpdatePasswordSchema.parse(data)
    await profileService.updateEOPassword(parsed, session.accessToken)
    return { success: true, message: "Password berhasil diperbarui." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}
