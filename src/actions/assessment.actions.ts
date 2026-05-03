"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { assessmentService } from "@/services/assessment.service"

const REVALIDATE_PATH = "/organizer/dashboard/assessment-system"

async function getSession() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error("Unauthorized")
  return session
}

// Violations
export async function createViolationAction(eventId: string, data: any) {
  try {
    const session = await getSession()
    await assessmentService.createViolation(eventId, data, session.accessToken)
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Pelanggaran berhasil ditambahkan" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambahkan pelanggaran",
    }
  }
}

export async function updateViolationAction(
  eventId: string,
  id: string,
  data: any
) {
  try {
    const session = await getSession()
    await assessmentService.updateViolation(
      eventId,
      id,
      data,
      session.accessToken
    )
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Pelanggaran berhasil diperbarui" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui pelanggaran",
    }
  }
}

export async function deleteViolationAction(eventId: string, id: string) {
  try {
    const session = await getSession()
    await assessmentService.deleteViolation(eventId, id, session.accessToken)
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Pelanggaran berhasil dihapus" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus pelanggaran",
    }
  }
}

// Categories
export async function createCategoryAction(eventId: string, data: any) {
  try {
    const session = await getSession()
    await assessmentService.createCategory(eventId, data, session.accessToken)
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Kategori berhasil ditambahkan" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambahkan kategori",
    }
  }
}

export async function updateCategoryAction(
  eventId: string,
  id: string,
  data: any
) {
  try {
    const session = await getSession()
    await assessmentService.updateCategory(
      eventId,
      id,
      data,
      session.accessToken
    )
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Kategori berhasil diperbarui" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui kategori",
    }
  }
}

export async function deleteCategoryAction(eventId: string, id: string) {
  try {
    const session = await getSession()
    await assessmentService.deleteCategory(eventId, id, session.accessToken)
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Kategori berhasil dihapus" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus kategori",
    }
  }
}

// Sub-Categories
export async function createSubCategoryAction(eventId: string, data: any) {
  try {
    const session = await getSession()
    await assessmentService.createSubCategory(
      eventId,
      data,
      session.accessToken
    )
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Sub-kategori berhasil ditambahkan" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambahkan sub-kategori",
    }
  }
}

export async function updateSubCategoryAction(
  eventId: string,
  id: string,
  data: any
) {
  try {
    const session = await getSession()
    await assessmentService.updateSubCategory(
      eventId,
      id,
      data,
      session.accessToken
    )
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Sub-kategori berhasil diperbarui" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui sub-kategori",
    }
  }
}

export async function deleteSubCategoryAction(eventId: string, id: string) {
  try {
    const session = await getSession()
    await assessmentService.deleteSubCategory(eventId, id, session.accessToken)
    revalidatePath(REVALIDATE_PATH)
    return { success: true, message: "Sub-kategori berhasil dihapus" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus sub-kategori",
    }
  }
}
