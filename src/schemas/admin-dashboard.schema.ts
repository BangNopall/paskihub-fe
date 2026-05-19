import { z } from "zod"

export const adminDashboardStatValueSchema = z.object({
  value: z.number(),
  trend: z.string(),
})

export const adminDashboardTransactionSchema = z.object({
  id: z.string(),
  eo_name: z.string(),
  amount: z.number(),
  amount_koin: z.number(),
  time_ago: z.string(),
  status: z.enum(["PENDING", "APPROVE", "REJECTED"]),
})

export const adminDashboardEORegistrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  registered_at: z.string(),
})

export const adminDashboardSchema = z.object({
  stats: z.object({
    total_revenue: adminDashboardStatValueSchema,
    total_eo: adminDashboardStatValueSchema,
    total_participants: adminDashboardStatValueSchema,
    pending_topups: adminDashboardStatValueSchema,
  }),
  recent_transactions: z.preprocess(
    (val) => val ?? [],
    z.array(adminDashboardTransactionSchema)
  ),
  eo_registrations: z.preprocess(
    (val) => val ?? [],
    z.array(adminDashboardEORegistrationSchema)
  ),
})

export const adminDashboardResponseSchema = z.object({
  data: adminDashboardSchema,
})

export type AdminDashboard = z.infer<typeof adminDashboardSchema>
export type AdminDashboardTransaction = z.infer<
  typeof adminDashboardTransactionSchema
>
export type AdminDashboardEORegistration = z.infer<
  typeof adminDashboardEORegistrationSchema
>
