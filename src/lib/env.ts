// Environment variable fail-fast validation
const API_BASE_URL = process.env.API_BASE_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")
const API_KEY = process.env.API_KEY
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (typeof window === "undefined") {
  if (!API_BASE_URL && process.env.NODE_ENV === "production") {
    throw new Error("FAIL-FAST: API_BASE_URL is missing in production!")
  }
  if (!API_KEY) {
    throw new Error("FAIL-FAST: API_KEY is missing!")
  }
  if (!NEXTAUTH_SECRET) {
    throw new Error("FAIL-FAST: NEXTAUTH_SECRET is missing!")
  }
}

export const env = {
  API_BASE_URL,
  API_KEY: API_KEY || "",
  NEXTAUTH_SECRET: NEXTAUTH_SECRET || "",
}

export function getApiKeyHeader(): string {
  if (!env.API_KEY) return ""
  // If the API_KEY already starts with 'Key ', do not prepend again
  return env.API_KEY.startsWith("Key ") ? env.API_KEY : `Key ${env.API_KEY}`
}
