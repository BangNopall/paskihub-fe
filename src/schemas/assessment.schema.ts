import { z } from "zod"

export const ViolationTypeSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  event_level_id: z.string().uuid(),
  name: z.string().min(1, "Nama pelanggaran harus diisi"),
  point: z.number().min(0, "Poin harus positif"),
})

export type ViolationType = z.infer<typeof ViolationTypeSchema>

export const ScoreSubCategorySchema = z.object({
  id: z.string().uuid(),
  score_categories_id: z.string().uuid(),
  name: z.string().min(1, "Nama sub-kategori harus diisi"),
  max_score: z.number().min(0),
  grades: z
    .record(z.string(), z.array(z.string()))
    .nullish()
    .transform((v) => v || {}),
})

export type ScoreSubCategory = z.infer<typeof ScoreSubCategorySchema>

export const ScoreCategorySchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  event_level_id: z.string().uuid(),
  name: z.string().min(1, "Nama kategori harus diisi"),
  sub_categories: z
    .array(ScoreSubCategorySchema)
    .nullish()
    .transform((v) => v || []),
})

export type ScoreCategory = z.infer<typeof ScoreCategorySchema>

export const UnifiedAssessmentSchema = z.object({
  violations: z
    .array(ViolationTypeSchema)
    .nullish()
    .transform((v) => v || []),
  categories: z
    .array(ScoreCategorySchema)
    .nullish()
    .transform((v) => v || []),
})

export type UnifiedAssessment = z.infer<typeof UnifiedAssessmentSchema>

// Input Schemas
export const CreateViolationSchema = z.object({
  name: z.string().min(1, "Nama pelanggaran harus diisi"),
  point: z.number().min(0, "Poin harus positif"),
  event_level_id: z.string().uuid(),
})

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  event_level_id: z.string().uuid(),
})

export const CreateSubCategorySchema = z.object({
  score_categories_id: z.string().uuid(),
  name: z.string().min(1, "Nama sub-kategori harus diisi"),
  max_score: z.number().min(0),
  grades: z.record(z.string(), z.array(z.string())),
})
