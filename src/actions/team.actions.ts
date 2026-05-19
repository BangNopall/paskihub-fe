"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { teamService } from "@/services/team.service"
import { TeamFormData } from "@/schemas/team.schema"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function getAuthToken() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error("Unauthorized")
  return session.accessToken
}

export async function createTeamAction(data: TeamFormData) {
  const token = await getAuthToken()

  const formData = new FormData()
  formData.append("name", data.namaTim)
  formData.append("coach_name", data.pelatih)

  if (data.logoTim instanceof File) {
    formData.append("logo", data.logoTim)
  }

  if (data.suratRekomendasi instanceof File) {
    formData.append("recommendation_letter", data.suratRekomendasi)
  }

  data.members.forEach((member, index) => {
    formData.append(`members[${index}][full_name]`, member.fullName)
    formData.append(`members[${index}][role]`, member.role)
    if (member.idCard instanceof File) {
      formData.append(`members[${index}][id_card]`, member.idCard)
    }
    if (member.photo instanceof File) {
      formData.append(`members[${index}][photo]`, member.photo)
    }
  })

  try {
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

  const formData = new FormData()
  formData.append("name", data.namaTim)
  formData.append("coach_name", data.pelatih)

  if (data.logoTim instanceof File) {
    formData.append("logo", data.logoTim)
  }

  if (data.suratRekomendasi instanceof File) {
    formData.append("recommendation_letter", data.suratRekomendasi)
  }

  data.members.forEach((member, index) => {
    formData.append(`members[${index}][full_name]`, member.fullName)
    formData.append(`members[${index}][role]`, member.role)
    if (member.idCard instanceof File) {
      formData.append(`members[${index}][id_card]`, member.idCard)
    }
    if (member.photo instanceof File) {
      formData.append(`members[${index}][photo]`, member.photo)
    }
  })

  try {
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
