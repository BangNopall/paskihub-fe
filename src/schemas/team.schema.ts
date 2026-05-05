import { z } from "zod"

// Member Schema for Form
export const TeamMemberSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  role: z.string().min(1, "Jabatan wajib diisi"),
  idCard: z.any().optional(), // For File object in client
  photo: z.any().optional(),   // For File object in client
  idCardUrl: z.string().optional(), // For existing URLs during edit
  photoUrl: z.string().optional(),   // For existing URLs during edit
})

// Team Payload Schema for Form (Multi-part handled in action)
export const TeamFormSchema = z.object({
  namaTim: z.string().min(1, "Nama tim wajib diisi"),
  pelatih: z.string().min(1, "Nama pelatih wajib diisi"),
  logoTim: z.any().optional(),
  suratRekomendasi: z.any().optional(),
  logoTimUrl: z.string().optional(),
  suratRekomendasiUrl: z.string().optional(),
  members: z.array(TeamMemberSchema).min(1, "Minimal harus ada 1 anggota"),
})

export type TeamFormData = z.infer<typeof TeamFormSchema>

// API Response Schemas
export const ParticipantTeamMemberResSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  role: z.string(),
  id_card_path: z.string().nullable(),
  photo_path: z.string().nullable(),
})

export type ParticipantTeamMemberRes = z.infer<typeof ParticipantTeamMemberResSchema>

export const ParticipantTeamResSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logo_path: z.string().nullable(),
  pelatih: z.string(),
  institution_type: z.string(),
  payment_status: z.string(),
})

export type ParticipantTeamRes = z.infer<typeof ParticipantTeamResSchema>

export const TeamDetailResSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logo_path: z.string().nullable(),
  pelatih: z.string(),
  institution_type: z.string(),
  rec_letter_path: z.string().nullable(),
  members_grouped: z.record(z.string(), z.array(ParticipantTeamMemberResSchema)),
})

export type TeamDetailRes = z.infer<typeof TeamDetailResSchema>
