import { z } from "zod"

export const SubCategoryScoreDetailSchema = z.object({
  sub_category_id: z.string().uuid(),
  sub_category_name: z.string(),
  judge_name: z.string(),
  score_value: z.number(),
  grade: z.string().nullable(),
})

export const CategoryScoreDetailSchema = z.object({
  category_id: z.string().uuid(),
  category_name: z.string(),
  sub_categories: z.array(SubCategoryScoreDetailSchema),
})

export const TeamViolationDetailSchema = z.object({
  violation_id: z.string().uuid(),
  violation_name: z.string(),
  point: z.number(),
  judge_name: z.string(),
})

export const TeamAssessmentDetailResSchema = z.object({
  regis_id: z.string().uuid(),
  team_name: z.string(),
  insti_name: z.string(),
  categories: z
    .array(CategoryScoreDetailSchema)
    .nullable()
    .transform((v) => v || []),
  violations: z
    .array(TeamViolationDetailSchema)
    .nullable()
    .transform((v) => v || []),
  total_score: z.number(),
  total_violation: z.number(),
  final_score: z.number(),
})

export type TeamAssessmentDetailRes = z.infer<
  typeof TeamAssessmentDetailResSchema
>

export const ScoreboardItemSchema = z.object({
  regis_id: z.string().uuid(),
  team_name: z.string(),
  insti_name: z.string(),
  total_score: z.number(),
  total_violation_points: z.number(),
  final_score: z.number(),
  rank: z.number(),
})

export type ScoreboardItem = z.infer<typeof ScoreboardItemSchema>

export const ScoreboardResSchema = z.object({
  event_level_id: z.string().uuid(),
  items: z
    .array(ScoreboardItemSchema)
    .nullable()
    .transform((v) => v || []),
})

export type ScoreboardRes = z.infer<typeof ScoreboardResSchema>
