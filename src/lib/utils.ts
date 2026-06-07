import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxyFileUrl(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const isAbsolute = url.startsWith("http://") || url.startsWith("https://")
    const path = isAbsolute ? new URL(url).pathname : url

    const match = path.match(/\/?api\/v1\/files\/([^/]+)\/(.+)$/)
    if (match) {
      const resourceType = match[1]
      const resourceId = match[2]
      return `/api/files/${resourceType}/${resourceId}`
    }
  } catch {
    // Silently ignore URL parsing errors and return original
  }

  return url
}
