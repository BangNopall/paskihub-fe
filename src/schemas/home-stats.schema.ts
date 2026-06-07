import { z } from "zod"

export const homeStatsSchema = z.object({
  total_events: z.number().int().nonnegative(),
  total_organizers: z.number().int().nonnegative(),
  total_participants: z.number().int().nonnegative(),
  total_teams: z.number().int().nonnegative(),
})

export const homeStatsResponseSchema = z.object({
  data: homeStatsSchema,
})

export type HomeStats = z.infer<typeof homeStatsSchema>
