import CredentialsProvider from "next-auth/providers/credentials";
import { loginResponseSchema } from "@/schemas/auth.schema";

const API_URL = process.env.API_BASE_URL || "http://localhost:3010";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${API_URL}/api/v1/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!res.ok) throw new Error("Invalid credentials");
          
          const data = await res.json();
          const parsed = loginResponseSchema.parse(data);
          
          return {
            id: parsed.data.user.id,
            email: parsed.data.user.email,
            role: parsed.data.user.role,
            name: parsed.data.user.name,
            accessToken: parsed.data.access_token,
          };
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: "jwt",
  }
};
