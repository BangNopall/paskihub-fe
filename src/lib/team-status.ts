import type { EOTeamListRes } from "@/schemas/eo-team.schema"

export const APPROVED_TEAM_PAYMENT_STATUSES = ["DP_PAID", "FULL_PAID"] as const

export function isApprovedTeamPaymentStatus(
  paymentStatus: EOTeamListRes["payment_status"]
) {
  return APPROVED_TEAM_PAYMENT_STATUSES.includes(
    paymentStatus as (typeof APPROVED_TEAM_PAYMENT_STATUSES)[number]
  )
}
