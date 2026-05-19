import { z } from "zod"

export const participantDashboardStatsSchema = z.object({
  total_team: z.number().int(),
  active_event: z.number().int(),
  finished_event: z.number().int(),
  pending_payment: z.number().int(),
})

export const participantDashboardActivitySchema = z.object({
  title: z.string(),
  description: z.string(),
  time: z.string(),
})

export const participantDashboardUpcomingEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  date: z.string(),
  registered_teams: z.number().int(),
  status: z.string(),
  detail_url_id: z.string().uuid(),
})

export const participantDashboardSchema = z.object({
  stats: participantDashboardStatsSchema,
  recent_activities: z.preprocess(
    (value) => value ?? [],
    z.array(participantDashboardActivitySchema)
  ),
  upcoming_events: z.preprocess(
    (value) => value ?? [],
    z.array(participantDashboardUpcomingEventSchema)
  ),
})

export const participantDashboardResponseSchema = z.object({
  data: participantDashboardSchema,
})

export type ParticipantDashboard = z.infer<typeof participantDashboardSchema>
export type ParticipantDashboardActivity = z.infer<
  typeof participantDashboardActivitySchema
>
export type ParticipantDashboardUpcomingEvent = z.infer<
  typeof participantDashboardUpcomingEventSchema
>
