import { z } from "zod"

export const judgeSchema = z.object({
  name: z
    .string()
    .min(1, "Nama juri wajib diisi")
    .max(100, "Nama juri terlalu panjang"),
})

export type JudgeSchema = z.infer<typeof judgeSchema>
