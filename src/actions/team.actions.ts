/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { teamService } from "@/services/team.service"
import { TeamFormData } from "@/schemas/team.schema"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { buildCreateTeamFormData, buildUpdateTeamFormData } from "@/lib/team-form"
import { validateFile } from "@/lib/file-validation"

function validateTeamDataFiles(data: TeamFormData) {
  const imageTypes = ["image/jpeg", "image/jpg", "image/png"]
  const docTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
  
  validateFile(data.logoTim, imageTypes, 5, "Logo Tim")
  validateFile(data.suratRekomendasi, docTypes, 5, "Surat Rekomendasi")
  
  data.members?.forEach((m, i) => {
    validateFile(m.idCard, docTypes, 5, `Kartu Identitas Anggota ${i + 1}`)
    validateFile(m.photo, docTypes, 5, `Foto Anggota ${i + 1}`)
  })
}

async function getAuthToken() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error("Unauthorized")
  return session.accessToken
}

export async function createTeamAction(data: TeamFormData) {
  const token = await getAuthToken()

  try {
    validateTeamDataFiles(data)
    const formData = buildCreateTeamFormData(data)
    const res = await teamService.createTeam(formData, token)
    revalidatePath("/peserta/dashboard/team")
    return { success: true, data: res }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTeamAction(id: string, data: TeamFormData) {
  const token = await getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    validateTeamDataFiles(data)
    const formData = buildUpdateTeamFormData(data)
    const res = await teamService.updateTeam(id, formData, token)
    revalidatePath("/peserta/dashboard/team")
    revalidatePath(`/peserta/dashboard/team/edit/${id}`)
    return { success: true, data: res }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTeamAction(id: string) {
  const token = await getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    await teamService.deleteTeam(id, token)
    revalidatePath("/peserta/dashboard/team")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getTeamDetailAction(id: string) {
  const token = await getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const res = await teamService.getTeamDetail(id, token)
    return { success: true, data: res }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
