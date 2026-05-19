import { z } from "zod"

export const organizerDashboardStatValueSchema = z.object({
  value: z.number(),
  trend: z.string(),
})

export const organizerDashboardCoinValueSchema = z.object({
  value: z.number(),
  coins: z.number(),
})

export const organizerDashboardActivitySchema = z.object({
  id: z.string(),
  team_name: z.string(),
  event_name: z.string(),
  time_ago: z.string(),
  status: z.string(),
})

export const organizerDashboardUpcomingEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  registered_teams: z.number().int(),
  status: z.string(),
})

export const organizerDashboardSchema = z.object({
  stats: z.object({
    total_event: organizerDashboardStatValueSchema,
    total_team: organizerDashboardStatValueSchema,
    coin_balance: organizerDashboardCoinValueSchema,
    revenue: organizerDashboardStatValueSchema,
  }),
  recent_activities: z.preprocess(
    (val) => val ?? [],
    z.array(organizerDashboardActivitySchema)
  ),
  upcoming_events: z.preprocess(
    (val) => val ?? [],
    z.array(organizerDashboardUpcomingEventSchema)
  ),
})

export const organizerDashboardResponseSchema = z.object({
  data: organizerDashboardSchema,
})

export type OrganizerDashboard = z.infer<typeof organizerDashboardSchema>
export type OrganizerDashboardActivity = z.infer<
  typeof organizerDashboardActivitySchema
>
export type OrganizerDashboardUpcomingEvent = z.infer<
  typeof organizerDashboardUpcomingEventSchema
>
