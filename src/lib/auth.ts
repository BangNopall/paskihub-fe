import CredentialsProvider from "next-auth/providers/credentials"
import { loginResponseSchema } from "@/schemas/auth.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  } catch (e) {
    return null
  }
}

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const res = await fetch(`${API_URL}/api/v1/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY || "",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            throw new Error("Invalid credentials")
          }

          const data = await res.json()

          const parsed = loginResponseSchema.parse(data)
          const decoded = parseJwt(parsed.data.token)

          return {
            id: parsed.data.id || "",
            email: parsed.data.email || credentials.email,
            role: parsed.data.role || "",
            accessToken: parsed.data.token,
            accessTokenExpires: decoded?.exp ? decoded.exp * 1000 : 0,
          }
        } catch (error: any) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.accessToken = user.accessToken
        token.accessTokenExpires = user.accessTokenExpires
      }

      // Check if the access token has expired
      if (
        token.accessTokenExpires &&
        Date.now() > (token.accessTokenExpires as number)
      ) {
        return {
          ...token,
          error: "SessionExpired",
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email
        session.accessToken = token.accessToken
        session.error = token.error
      }
      console.log(token)
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour to match backend token
  },
  secret: process.env.NEXTAUTH_SECRET,
}
