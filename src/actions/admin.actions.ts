"use server"

import { adminService } from "@/services/admin.service"
import { AdminCreateInput, AdminCreateSchema } from "@/schemas/admin.schema"
import { revalidatePath } from "next/cache"

export async function createAdminAction(input: AdminCreateInput) {
  try {
    const validated = AdminCreateSchema.parse(input)
    await adminService.createAdmin(validated)
    revalidatePath("/admin/dashboard/admins")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteAdminAction(adminId: string) {
  try {
    await adminService.deleteAdmin(adminId)
    revalidatePath("/admin/dashboard/admins")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resetAdminPasswordAction(adminId: string) {
  try {
    await adminService.resetAdminPassword(adminId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function banUserAction(userId: string) {
  try {
    await adminService.banUser(userId)
    revalidatePath("/admin/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function activateUserAction(userId: string) {
  try {
    await adminService.unbanUser(userId)
    revalidatePath("/admin/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function verifyUserAction(userId: string) {
  try {
    await adminService.verifyUser(userId)
    revalidatePath("/admin/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function fetchUserDetailAction(userId: string) {
  try {
    const data = await adminService.fetchUserDetail(userId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateEventStatusAction(eventId: string, status: string) {
  try {
    await adminService.updateEventStatus(eventId, status)
    return { success: true, message: "Status event berhasil diperbarui" }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memperbarui status event" }
  }
}
