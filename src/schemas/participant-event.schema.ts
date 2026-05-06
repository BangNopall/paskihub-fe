import { z } from "zod"

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
  levels: z.array(OpenEventLevelSchema),
  organizer: z.string().optional(),
  status: z.string().optional(),
  open_date: z.string().optional(),
  close_date: z.string().optional(),
  location: z.string().optional(),
  min_team_members: z.number().optional(),
  max_team_members: z.number().optional(),
})

export const ActiveEventSchema = z.object({
  registration_id: z.string().uuid(),
  event_name: z.string(),
  event_logo_path: z.string().nullable(),
  team_name: z.string(),
  payment_status: z.string(),
})

export type OpenEvent = z.infer<typeof OpenEventSchema>
export type ActiveEvent = z.infer<typeof ActiveEventSchema>
