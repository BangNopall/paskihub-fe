import { z } from "zod"

export const EOTeamListResSchema = z.object({
  registration_id: z.string().uuid(),
  team_id: z.string().uuid(),
  logo_path: z.string().nullable(),
  team_name: z.string(),
  institution: z.string(),
  event_level: z.string(),
  payment_status: z.enum(["WAITING", "DP_PAID", "FULL_PAID", "REJECTED"]),
  assessment_status: z.string(), // PENDING, COMPLETED
  institution_type: z.string(), // SD, SMP, SMA, etc.
})

export type EOTeamListRes = z.infer<typeof EOTeamListResSchema>

export const EOTeamMemberResSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  role: z.string(),
  id_card_path: z.string().nullable(),
  photo_path: z.string().nullable(),
})

export const EOTeamDetailResSchema = z.object({
  registration_id: z.string().uuid(),
  team_id: z.string().uuid(),
  team_name: z.string(),
  logo_path: z.string().nullable(),
  pelatih: z.string(),
  rec_letter_path: z.string().nullable(),
  institution: z.string(),
  event_level: z.string(),
  payment_status: z.enum(["WAITING", "DP_PAID", "FULL_PAID", "REJECTED"]),
  payment_proof_path: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  is_kick: z.boolean(),
  members: z.array(EOTeamMemberResSchema),
  contact_email: z.string(),
  institution_address: z.string(),
})

export type EOTeamDetailRes = z.infer<typeof EOTeamDetailResSchema>

export const EOTeamApproveReqSchema = z.object({
  payment_status: z.enum(["DP_PAID", "FULL_PAID"]),
})

export const EOTeamRejectReqSchema = z.object({
  rejection_reason: z.string().min(1, "Alasan penolakan wajib diisi"),
})

export const EOTeamStatsResSchema = z.object({
  total_teams: z.number(),
  pending_approval: z.number(),
  approved: z.number(),
  rejected: z.number(),
  paid_full: z.number(),
  paid_dp: z.number(),
})

export type EOTeamStatsRes = z.infer<typeof EOTeamStatsResSchema>
