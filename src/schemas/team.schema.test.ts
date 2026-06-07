import { describe, it, expect } from "vitest"
import { TeamFormSchema, TeamMemberSchema } from "./team.schema"

describe("Team Schema Validation", () => {
  it("TeamMemberSchema should validate valid member", () => {
    const validMember = {
      fullName: "Nopal",
      role: "DANPAS",
    }
    const result = TeamMemberSchema.safeParse(validMember)
    expect(result.success).toBe(true)
  })

  it("TeamMemberSchema should reject empty fields", () => {
    const invalidMember = {
      fullName: "",
      role: "",
    }
    const result = TeamMemberSchema.safeParse(invalidMember)
    expect(result.success).toBe(false)
  })

  it("TeamFormSchema should validate valid team payload", () => {
    const validTeam = {
      namaTim: "Tim Garuda",
      pelatih: "Coach Budi",
      members: [
        {
          fullName: "Nopal",
          role: "DANPAS",
        },
      ],
    }
    const result = TeamFormSchema.safeParse(validTeam)
    expect(result.success).toBe(true)
  })

  it("TeamFormSchema should reject team without members", () => {
    const invalidTeam = {
      namaTim: "Tim Garuda",
      pelatih: "Coach Budi",
      members: [], // Minimal 1
    }
    const result = TeamFormSchema.safeParse(invalidTeam)
    expect(result.success).toBe(false)
  })
})
