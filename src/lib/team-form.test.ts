import { describe, it, expect } from "vitest"
import { buildCreateTeamFormData, buildUpdateTeamFormData } from "./team-form"
import { TeamFormData } from "@/schemas/team.schema"

describe("team-form builders", () => {
  it("buildCreateTeamFormData uses legacy field names", () => {
    const data: TeamFormData = {
      namaTim: "Tim A",
      pelatih: "Coach B",
      members: [],
    }
    const fd = buildCreateTeamFormData(data)
    expect(fd.get("coach_name")).toBe("Coach B")
    expect(fd.get("pelatih_name")).toBeNull()
  })

  it("buildUpdateTeamFormData uses correct backend field names", () => {
    const data: TeamFormData = {
      namaTim: "Tim A",
      pelatih: "Coach B",
      members: [],
    }
    const fd = buildUpdateTeamFormData(data)
    expect(fd.get("pelatih_name")).toBe("Coach B")
    expect(fd.get("coach_name")).toBeNull()
  })
})
