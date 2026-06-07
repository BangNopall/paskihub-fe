import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getApiKeyHeader } from "@/lib/env"

const API_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3010")

type PrivateFileParams = {
  resourceType: string
  resourceId: string
}

type AuthSession = {
  accessToken?: string | null
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<PrivateFileParams> }
) {
  try {
    const session = (await getServerSession(authOptions)) as AuthSession | null
    const accessToken = session?.accessToken

    if (!accessToken) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { resourceType, resourceId } = await params

    if (
      !resourceType ||
      !resourceId ||
      resourceType.includes("/") ||
      resourceId.includes("/")
    ) {
      return new Response("Invalid resource", { status: 400 })
    }

    const backendUrl = `${API_URL}/api/v1/files/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`

    const headers: Record<string, string> = {
      "x-api-key": getApiKeyHeader(),
      Authorization: `Bearer ${accessToken}`,
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
      return new Response("Error fetching file", {
        status: backendResponse.status,
      })
    }

    const contentType =
      backendResponse.headers.get("content-type") || "application/octet-stream"
    const contentDisposition = backendResponse.headers.get(
      "content-disposition"
    )

    const responseHeaders = new Headers()
    responseHeaders.set("Content-Type", contentType)

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
