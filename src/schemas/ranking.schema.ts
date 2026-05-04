import { z } from "zod"

export const RankingAwardSchema = z.object({
  id: z.string().uuid().optional(),
  event_level_id: z.string().uuid("Jenjang harus dipilih"),
  name: z.string().min(1, "Nama juara harus diisi"),
  limit_rank: z.number().min(1, "Minimal urutan adalah 1"),
  score_category_ids: z
    .array(z.string().uuid())
    .min(1, "Pilih minimal satu kategori penilaian"),
})

export type RankingAwardFormData = z.infer<typeof RankingAwardSchema>

export const AwardResSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  event_level_id: z.string().uuid(),
  name: z.string(),
  limit_rank: z.number(),
  score_categories: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    })
  ),
})

export type AwardRes = z.infer<typeof AwardResSchema>
