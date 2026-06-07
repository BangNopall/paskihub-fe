import {
  homeStatsResponseSchema,
  type HomeStats,
} from "@/schemas/home-stats.schema"

const sample = homeStatsResponseSchema.parse({
  code: 200,
  data: {
    total_events: 12,
    total_organizers: 8,
    total_participants: 240,
    total_teams: 64,
  },
  message: "success to get home stats",
  status: "success",
})

const stats: HomeStats = sample.data

stats.total_events satisfies number
stats.total_organizers satisfies number
stats.total_participants satisfies number
stats.total_teams satisfies number
