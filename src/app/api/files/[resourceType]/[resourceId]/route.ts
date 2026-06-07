import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceType: string; resourceId: string } }
) {
  try {
    const session: any = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.token) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { resourceType, resourceId } = params

    // Validate params basically to prevent directory traversal attacks if necessary,
    // though the backend should also handle it.
    if (!resourceType || !resourceId || resourceType.includes('/') || resourceId.includes('/')) {
      return new Response("Invalid resource", { status: 400 })
    }

    const backendUrl = `${process.env.API_BASE_URL}/api/v1/files/${resourceType}/${resourceId}`

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.user.token}`,
    }

    // Add API KEY if provided
    if (process.env.API_KEY) {
      // Backend expects "Key <api_key>" but typically swagger sets "x-api-key: Key <value>"
      // In existing services, it is typically passed verbatim. I will check existing services to see how it's done.
      headers["x-api-key"] = process.env.API_KEY
    }

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers,
    })

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return new Response("Unauthorized", { status: 401 })
      }
      if (backendResponse.status === 403) {
        return new Response("Forbidden", { status: 403 })
      }
      if (backendResponse.status === 404) {
        return new Response("Not Found", { status: 404 })
      }
      return new Response("Error fetching file", { status: backendResponse.status })
    }

    // Proxy the response
    const contentType = backendResponse.headers.get("content-type") || "application/octet-stream"
    const contentDisposition = backendResponse.headers.get("content-disposition")
    
    const responseHeaders = new Headers()
    responseHeaders.set("Content-Type", contentType)
    
    // Only set Content-Disposition if it's safe (e.g. from backend)
    if (contentDisposition) {
      responseHeaders.set("Content-Disposition", contentDisposition)
    }

    return new Response(backendResponse.body, {
      status: 200,
      headers: responseHeaders,
    })
  } catch {
    return new Response("Internal Server Error", { status: 500 })
  }
}
