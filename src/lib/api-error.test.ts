import { describe, it, expect } from "vitest"
import { parseApiError, ApiError } from "./api-error"

describe("parseApiError", () => {
  it("throws ApiError instead of returning empty object", async () => {
    const mockRes = new Response(JSON.stringify({ message: "Not Found" }), { status: 404 })
    await expect(parseApiError(mockRes)).rejects.toThrowError(ApiError)
  })

  it("handles KICKED specially", async () => {
    const mockRes = new Response(JSON.stringify({ status: "KICKED" }), { status: 400 })
    await expect(parseApiError(mockRes)).rejects.toThrow("KICKED")
  })

  it("throws 500 server error safely without crashing", async () => {
    const mockRes = new Response("Bad Gateway", { status: 502 })
    await expect(parseApiError(mockRes)).rejects.toThrow("Terjadi masalah pada server. Coba lagi nanti.")
  })
})
