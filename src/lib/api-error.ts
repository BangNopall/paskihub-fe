export class ApiError extends Error {
  public status: number
  public details: any

  constructor(status: number, message: string, details?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export async function parseApiError(res: Response): Promise<never> {
  let errData: any = {}
  try {
    const text = await res.text()
    errData = text ? JSON.parse(text) : {}
  } catch {
    // Non-JSON response
  }

  if (
    errData?.status === "KICKED" ||
    errData?.message === "KICKED" ||
    errData?.error === "KICKED"
  ) {
    throw new Error("KICKED")
  }

  const message =
    errData.message ||
    errData.error ||
    errData.details ||
    `HTTP Error ${res.status}`

  if (res.status === 401) throw new ApiError(401, "Sesi berakhir. Silakan login kembali.", errData)
  if (res.status === 403) throw new ApiError(403, "Akses ditolak.", errData)
  if (res.status === 404) throw new ApiError(404, "Data tidak ditemukan.", errData)
  if (res.status === 413) throw new ApiError(413, "File terlalu besar.", errData)
  if (res.status === 400) throw new ApiError(400, message, errData)
  if (res.status === 409) throw new ApiError(409, message, errData)
  if (res.status === 429) throw new ApiError(429, "Terlalu banyak permintaan. Coba lagi nanti.", errData)
  if (res.status >= 500) throw new ApiError(res.status, "Terjadi masalah pada server. Coba lagi nanti.", errData)

  throw new ApiError(res.status, message, errData)
}
