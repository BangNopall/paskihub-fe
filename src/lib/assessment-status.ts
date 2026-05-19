export const ASSESSMENT_STATUSES = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const

export type AssessmentStatus =
  (typeof ASSESSMENT_STATUSES)[keyof typeof ASSESSMENT_STATUSES]

export function isCompletedAssessmentStatus(status: string) {
  return status === ASSESSMENT_STATUSES.COMPLETED
}
