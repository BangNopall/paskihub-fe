import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxyFileUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // Already a full URL — return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  try {
    // Handle proxy-able API file paths: /api/v1/files/{type}/{id}
    const match = url.match(/\/?api\/v1\/files\/([^/]+)\/(.+)$/)
    if (match) {
      const resourceType = match[1]
      const resourceId = match[2]
      return `/api/files/${resourceType}/${resourceId}`
    }
  } catch {
    // Silently ignore URL parsing errors
  }

  // Relative backend asset path (e.g. /public/uploads/...) — prepend backend base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  return baseUrl + (url.startsWith("/") ? url : `/${url}`)
}
