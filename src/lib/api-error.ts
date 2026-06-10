export class ApiError extends Error {
  public status: number
  public details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null
}

function asMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value
  if (typeof value === "number") return String(value)
  return undefined
}

export async function parseApiError(res: Response): Promise<never> {
  let errData: unknown = {}
  try {
    const text = await res.text()
    errData = text ? JSON.parse(text) : {}
  } catch {
    // Non-JSON response
  }

  const errorPayload = asRecord(errData) ?? {}
  const nestedError = asRecord(errorPayload.error)

  if (
    errorPayload.status === "KICKED" ||
    errorPayload.message === "KICKED" ||
    errorPayload.error === "KICKED"
  ) {
    throw new Error("KICKED")
  }

  const message =
    asMessage(nestedError?.details) ||
    asMessage(nestedError?.message) ||
    asMessage(errorPayload.details) ||
    asMessage(errorPayload.message) ||
    asMessage(errorPayload.error) ||
    res.statusText ||
    `HTTP Error ${res.status}`

  if (res.status === 401)
    throw new ApiError(401, "Sesi berakhir. Silakan login kembali.", errData)
  if (res.status === 403) throw new ApiError(403, "Akses ditolak.", errData)
  if (res.status === 404)
    throw new ApiError(404, "Data tidak ditemukan.", errData)
  if (res.status === 413)
    throw new ApiError(413, "File terlalu besar.", errData)
  if (res.status === 400) throw new ApiError(400, message, errData)
  if (res.status === 409) throw new ApiError(409, message, errData)
  if (res.status === 429)
    throw new ApiError(
      429,
      "Terlalu banyak permintaan. Coba lagi nanti.",
      errData
    )
  if (res.status >= 500)
    throw new ApiError(
      res.status,
      "Terjadi masalah pada server. Coba lagi nanti.",
      errData
    )

  throw new ApiError(res.status, message, errData)
}
