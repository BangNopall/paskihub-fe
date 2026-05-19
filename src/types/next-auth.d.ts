declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      parentId?: string
      organizerId?: string
      name?: string
    }
    accessToken: string
    error?: "SessionExpired"
  }
  interface User {
    id: string
    email: string
    role: string
    parentId?: string
    organizerId?: string
    name?: string
    accessToken: string
    accessTokenExpires: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    email: string
    parentId?: string
    organizerId?: string
    accessToken: string
    accessTokenExpires: number
    error?: "SessionExpired"
  }
}
