# Authentication Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. (Gemini CLI does not support subagents, so use single-session execution).

**Goal:** Implement the full authentication lifecycle (Login, Register, Forgot Password, Reset Password, Verify Email) using NextAuth v4, Zod, and Server Actions against the GoFiber backend.

**Architecture:** We use Zod for E2E type safety. NextAuth handles the session and login token storage via the Credentials provider. Server actions and native fetch handle Registration and Password recovery.

**Tech Stack:** Next.js 16.1.7 (App Router), NextAuth v4, React Hook Form, Zod, TailwindCSS v4, shadcn/ui.

---

### Task 1: Define Auth Zod Schemas

**Files:**

- Create: `src/schemas/auth.schema.ts`

- [ ] **Step 1: Write the Zod Schemas**
      Create the file and define the schemas for all auth flows.

```typescript
// src/schemas/auth.schema.ts
import { z } from "zod"

// Form Validation Schemas
export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const registerFormSchema = z.object({
  name: z.string().min(3, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid").optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

// API Response Schemas
export const baseResponseSchema = z.object({
  message: z.string().optional(),
  status: z.string().optional(),
})

export const loginResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
      name: z.string().optional(),
    }),
  }),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
```

- [ ] **Step 2: Verify TypeScript compiles**
      Run: `npm run typecheck`
      Expected: PASS (No errors)

- [ ] **Step 3: Commit**

```bash
git add src/schemas/auth.schema.ts
git commit -m "feat: add auth zod schemas"
```

### Task 2: Implement Auth Services (Native Fetch)

**Files:**

- Create: `src/services/auth.service.ts`

- [ ] **Step 1: Write native fetch wrappers**

```typescript
// src/services/auth.service.ts
import {
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/schemas/auth.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"

export const authService = {
  async register(role: "eo" | "peserta", data: RegisterFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/register/${role}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Registration failed")
    }
    return res.json()
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Gagal mengirim email reset password")
    return res.json()
  },

  async resetPassword(token: string, data: ResetPasswordFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/reset-password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: data.password }),
    })
    if (!res.ok) throw new Error("Gagal mereset password")
    return res.json()
  },

  async verifyEmail(email: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/users/verify-email/${email}/${token}`,
      {
        method: "GET",
      }
    )
    if (!res.ok) throw new Error("Verifikasi email gagal")
    return res.json()
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**
      Run: `npm run typecheck`
      Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/services/auth.service.ts
git commit -m "feat: add auth service native fetch wrappers"
```

### Task 3: Implement Auth Server Actions

**Files:**

- Create: `src/actions/auth.actions.ts`

- [ ] **Step 1: Write Server Actions**

```typescript
// src/actions/auth.actions.ts
"use server"

import { authService } from "@/services/auth.service"
import {
  registerFormSchema,
  RegisterFormData,
  forgotPasswordSchema,
  ForgotPasswordFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/auth.schema"

export async function registerAction(
  role: "eo" | "peserta",
  data: RegisterFormData
) {
  try {
    const parsed = registerFormSchema.parse(data)
    await authService.register(role, parsed)
    return {
      success: true,
      message: "Registrasi berhasil. Silakan cek email Anda.",
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function forgotPasswordAction(data: ForgotPasswordFormData) {
  try {
    const parsed = forgotPasswordSchema.parse(data)
    await authService.forgotPassword(parsed)
    return {
      success: true,
      message: "Link reset password telah dikirim ke email Anda.",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memproses permintaan",
    }
  }
}

export async function resetPasswordAction(
  token: string,
  data: ResetPasswordFormData
) {
  try {
    const parsed = resetPasswordSchema.parse(data)
    await authService.resetPassword(token, parsed)
    return {
      success: true,
      message: "Password berhasil diubah. Silakan login.",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mereset password",
    }
  }
}

export async function verifyEmailAction(email: string, token: string) {
  try {
    await authService.verifyEmail(email, token)
    return { success: true, message: "Email berhasil diverifikasi." }
  } catch (error: any) {
    return { success: false, message: error.message || "Verifikasi gagal" }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**
      Run: `npm run typecheck`
      Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/actions/auth.actions.ts
git commit -m "feat: add auth server actions"
```

### Task 4: Configure NextAuth v4

**Files:**

- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/types/next-auth.d.ts`

- [ ] **Step 1: Extend NextAuth Types**

```typescript
// src/types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      name?: string
    }
    accessToken: string
  }
  interface User {
    id: string
    email: string
    role: string
    name?: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    accessToken: string
  }
}
```

- [ ] **Step 2: Write NextAuth Options**

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { loginResponseSchema } from "@/schemas/auth.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"

export const authOptions: NextAuthOptions = {
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) throw new Error("Invalid credentials")

          const data = await res.json()
          const parsed = loginResponseSchema.parse(data)

          return {
            id: parsed.data.user.id,
            email: parsed.data.user.email,
            role: parsed.data.user.role,
            name: parsed.data.user.name,
            accessToken: parsed.data.access_token,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
}
```

- [ ] **Step 3: Write Route Handler**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

- [ ] **Step 4: Verify TypeScript compiles**
      Run: `npm run typecheck`
      Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/next-auth.d.ts src/lib/auth.ts src/app/api/auth/[...nextauth]/route.ts
git commit -m "feat: configure NextAuth v4"
```

### Task 5: Refactor Login Page

**Files:**

- Modify: `src/app/auth/login/page.tsx`

- [ ] **Step 1: Implement React Hook Form and signIn**
      Replace the static form in `src/app/auth/login/page.tsx` to use RHF, Zod, and `signIn`.
      _(Note for agent: When executing, replace the specific `<form>` block with shadcn `<Form>` components, use `useForm<LoginFormData>({ resolver: zodResolver(loginFormSchema) })`, and call `signIn("credentials", { ...data, redirect: false })` on submit. Show toast on success/error)._

- [ ] **Step 2: Commit**

```bash
git add src/app/auth/login/page.tsx
git commit -m "feat: integrate NextAuth into Login page"
```

_(Remaining pages like Register, Forgot Password will be handled similarly by the executing agent by binding the RHF to the server actions created in Task 3)._
