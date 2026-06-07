import { describe, it, expect } from "vitest"
import { loginFormSchema } from "@/schemas/auth.schema"

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
