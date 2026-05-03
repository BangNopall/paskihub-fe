"use server"

import { profileService } from "@/services/profile.service"
import {
  eoDataFormSchema,
  EODataFormData,
  pesertaDataFormSchema,
  PesertaDataFormData,
  eoUpdatePasswordSchema,
  EOUpdatePasswordData,
  eoStaffCreateSchema,
  EOStaffCreateData,
  eoStaffResetPasswordSchema,
  EOStaffResetPasswordData,
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
    return { success: true, message: "Profil berhasil diperbarui." }
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

export async function createEOStaffAction(data: EOStaffCreateData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = eoStaffCreateSchema.parse(data)
    await profileService.createEOStaff(parsed, session.accessToken)
    revalidatePath("/organizer/dashboard/profile")
    return { success: true, message: "Akun staff berhasil dibuat." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function resetEOStaffPasswordAction(
  id: string,
  data: EOStaffResetPasswordData
) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    const parsed = eoStaffResetPasswordSchema.parse(data)
    await profileService.resetEOStaffPassword(id, parsed, session.accessToken)
    return { success: true, message: "Password staff berhasil direset." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function deleteEOStaffAction(id: string) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await profileService.deleteEOStaff(id, session.accessToken)
    revalidatePath("/organizer/dashboard/profile")
    return { success: true, message: "Akun staff berhasil dihapus." }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}
