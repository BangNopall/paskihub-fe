import { describe, it, expect } from "vitest"
import { loginFormSchema, loginResponseSchema } from "@/schemas/auth.schema"

describe("Auth Schema - loginFormSchema", () => {
  it("should validate a correct payload", () => {
    const payload = {
      email: "test@example.com",
      password: "password123",
    }
    const result = loginFormSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it("should fail on invalid email", () => {
    const payload = {
      email: "not-an-email",
      password: "password123",
    }
    const result = loginFormSchema.safeParse(payload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email tidak valid")
    }
  })

  it("should fail on short password", () => {
    const payload = {
      email: "test@example.com",
      password: "123",
    }
    const result = loginFormSchema.safeParse(payload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password minimal 6 karakter")
    }
  })
})

describe("Auth Schema - loginResponseSchema", () => {
  it("should accept valid roles", () => {
    const validRoles = ["ADMIN", "ORGANIZER", "PESERTA"]
    
    validRoles.forEach((role) => {
      const payload = {
        data: {
          id: "123",
          email: "test@test.com",
          role,
          parent_id: null,
          token: "jwt-token",
        }
      }
      const result = loginResponseSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })
  })

  it("should reject invalid roles", () => {
    const invalidRoles = ["SUPERADMIN", "STAFF", "unknown", "", null]
    
    invalidRoles.forEach((role) => {
      const payload = {
        data: {
          id: "123",
          email: "test@test.com",
          role,
          parent_id: null,
          token: "jwt-token",
        }
      }
      const result = loginResponseSchema.safeParse(payload)
      expect(result.success).toBe(false)
    })
  })
})
