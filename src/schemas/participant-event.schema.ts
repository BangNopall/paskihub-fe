import { z } from "zod"

const AmountSchema = z.union([z.string(), z.number()])
const NullableStringSchema = z.string().nullable().optional()

export const OpenEventLevelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  regis_fee: z.string(),
  dp_fee: z.string(),
})

export const OpenEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  logo_path: z.string().nullable(),
  poster_path: z.string().nullable(),
  levels: z.array(OpenEventLevelSchema).nullable().default([]),
  organizer: z.string().optional(),
  status: z.string().optional(),
  open_date: z.string().optional(),
  close_date: z.string().optional(),
  location: z.string().optional(),
  min_team_members: z.number().optional(),
  max_team_members: z.number().optional(),
  bank_name: z.string().optional(),
  bank_number: z.string().optional(),
  name_pj: z.string().optional(),
  no_wa_pj: z.string().optional(),
})

export const ActiveEventSchema = z.object({
  registration_id: z.string().uuid(),
  event_name: z.string(),
  event_logo_path: z.string().nullable(),
  team_name: z.string(),
  payment_status: z.string(),
  is_kick: z.boolean().optional().default(false),
  rejection_reason: z.string().optional().nullable(),
})

export const RegistrationDetailSchema = z.object({
  event_level_id: NullableStringSchema,
  event: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    date: z.string(),
    location: z.string(),
    price: AmountSchema,
    target_date: z.string().nullable().optional(),
    logo_url: NullableStringSchema,
    logo_path: NullableStringSchema,
  }),
  team: z.object({
    id: z.string(),
    name: z.string(),
    logo_url: NullableStringSchema,
    official_count: z.number().int(),
    pasukan_count: z.number().int(),
  }),
  payment: z.object({
    status: z.string(),
    amount_paid: AmountSchema,
    total_amount: AmountSchema,
    remaining_amount: AmountSchema,
    proof_url: NullableStringSchema,
  }),
})

export const AssessmentJudgeScoreSchema = z.object({
  judge_name: z.string(),
  value: z.number(),
})

export const AssessmentSubCategorySchema = z.object({
  name: z.string(),
  scores: z
    .array(AssessmentJudgeScoreSchema)
    .nullish()
    .transform((value) => value ?? []),
})

export const AssessmentCategorySchema = z.object({
  category_name: z.string(),
  sub_categories: z
    .array(AssessmentSubCategorySchema)
    .nullish()
    .transform((value) => value ?? []),
})

export const AssessmentViolationSchema = z.object({
  judge_name: z.string(),
  name: z.string(),
  point: z.number(),
})

export const AssessmentRecapSchema = z.object({
  categories: z
    .array(AssessmentCategorySchema)
    .nullish()
    .transform((value) => value ?? []),
  final_score: z.number(),
  total_score: z.number(),
  total_violation_points: z.number(),
  violations: z
    .array(AssessmentViolationSchema)
    .nullish()
    .transform((value) => value ?? []),
  max_score: z.number().optional(),
})

export const ParticipantScoreboardItemSchema = z.object({
  final_score: z.number(),
  insti_name: z.string(),
  rank: z.number().int(),
  regis_id: z.string(),
  team_name: z.string(),
  total_score: z.number(),
  total_violation_points: z.number(),
})

export const ParticipantScoreboardSchema = z.object({
  event_level_id: z.string(),
  items: z
    .array(ParticipantScoreboardItemSchema)
    .nullish()
    .transform((value) => value ?? []),
})

export type OpenEvent = z.infer<typeof OpenEventSchema>
export type ActiveEvent = z.infer<typeof ActiveEventSchema>
export type RegistrationDetail = z.infer<typeof RegistrationDetailSchema>
export type AssessmentRecap = z.infer<typeof AssessmentRecapSchema>
export type ParticipantScoreboardItem = z.infer<
  typeof ParticipantScoreboardItemSchema
>
export type ParticipantScoreboard = z.infer<typeof ParticipantScoreboardSchema>
