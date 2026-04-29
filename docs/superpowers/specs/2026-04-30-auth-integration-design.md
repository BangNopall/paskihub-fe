# Authentication Integration Design
**Date:** 2026-04-30
**Topic:** NextAuth v4 Integration with GoFiber Backend

## 1. Overview
This document specifies the architectural design and implementation details for integrating the Next.js App Router frontend with the existing GoFiber backend for user authentication (Login). The integration strictly adheres to End-to-End Type Safety using Zod and utilizes NextAuth v4 for session management.

## 2. Goals
- Integrate the client-side Login form (`src/app/auth/login/page.tsx`) with the backend `/api/v1/users/login` endpoint.
- Securely store the JWT Bearer token and user details (Role, ID, Email) within a NextAuth session.
- Validate both user input (form) and API responses using Zod schemas to ensure type safety and fail gracefully if the backend contract changes.
- Provide a robust authentication foundation that enables secure, token-authenticated requests across the application.

## 3. Architecture & Data Flow

### 3.1. Schemas (`src/schemas/auth.schema.ts`)
We will define two primary Zod schemas:
- **`loginFormSchema`**: Validates the user input (email and password). Used by React Hook Form via `@hookform/resolvers/zod`.
- **`loginResponseSchema`**: Validates the JSON payload received from the GoFiber API upon a successful login. It ensures the response structurally matches our expectations (e.g., contains an `accessToken`, `user` object with `id`, `email`, `role`).

### 3.2. NextAuth Configuration (`src/lib/auth.ts`)
This file will export the NextAuth configuration (`authOptions`).
- **Provider**: `CredentialsProvider`.
- **`authorize` Callback**:
  1. Receives credentials from the client-side `signIn` call.
  2. Performs a native `fetch` to `process.env.API_BASE_URL + "/api/v1/users/login"`.
  3. Validates the response using `loginResponseSchema.parse()`.
  4. Returns the validated user object (including the token) to NextAuth.
- **`jwt` Callback**: Merges the backend `accessToken` and user attributes (id, role) into the NextAuth JWT.
- **`session` Callback**: Maps the JWT data into the NextAuth `Session` object so it can be accessed on the client (`useSession`) and server (`getServerSession`).

### 3.3. API Route (`src/app/api/auth/[...nextauth]/route.ts`)
This file serves as the Next.js App Router endpoint for NextAuth, wrapping and exporting the NextAuth handlers (GET, POST) initialized with the `authOptions` defined in `src/lib/auth.ts`.

### 3.4. Login Page (`src/app/auth/login/page.tsx`)
The existing slicing will be refactored:
- **Form Handling**: Utilize `react-hook-form` paired with the shadcn/ui `<Form>` component wrapper.
- **Validation**: Hook up `zodResolver(loginFormSchema)`.
- **Submission**: The `onSubmit` handler will trigger `signIn("credentials", { email, password, redirect: false })` from `next-auth/react`.
- **Feedback**: Implement toast notifications (via `sonner`) to display success or error messages (e.g., "Invalid credentials") to the user.

## 4. Dependencies & Prerequisites
- **NextAuth v4** (`next-auth@^4.24.13`) is installed.
- **Zod** and **React Hook Form** are installed and configured.
- **Backend URL**: Ensure `API_BASE_URL` is set in the `.env` file (pointing to the GoFiber API host, e.g., `http://localhost:3010`).

## 5. Security Considerations
- **Environment Variables**: The `API_BASE_URL` should never be prefixed with `NEXT_PUBLIC_` to keep internal routing secure where applicable.
- **Token Storage**: The JWT Bearer token is securely stored in an HttpOnly cookie managed by NextAuth.
- **Role-Based Access Control (RBAC)**: Storing the user `role` in the session prepares the application for future RBAC middleware implementation.
