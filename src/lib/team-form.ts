import { TeamFormData } from "@/schemas/team.schema"

export function buildCreateTeamFormData(data: TeamFormData): FormData {
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

  return formData
}

export function buildUpdateTeamFormData(data: TeamFormData): FormData {
  const formData = new FormData()
  formData.append("name", data.namaTim)
  formData.append("pelatih_name", data.pelatih)

  if (data.logoTim instanceof File) {
    formData.append("logo_team", data.logoTim)
  }

  if (data.suratRekomendasi instanceof File) {
    formData.append("surat_rekomendasi", data.suratRekomendasi)
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

  return formData
}
