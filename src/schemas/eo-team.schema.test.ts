import { describe, it, expect } from "vitest"
import { EOTeamListResSchema } from "./eo-team.schema"

describe("EOTeamListResSchema", () => {
  it("should parse KICKED payment_status", () => {
    const data = {
      registration_id: "123e4567-e89b-12d3-a456-426614174000",
      team_id: "123e4567-e89b-12d3-a456-426614174001",
      logo_path: null,
      team_name: "Tim Kuda Hitam",
      institution: "SMA 1",
      event_level: "Nasional",
      payment_status: "KICKED",
      assessment_status: "PENDING",
      institution_type: "SMA",
    }
    const result = EOTeamListResSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.payment_status).toBe("KICKED")
    }
  })
})
