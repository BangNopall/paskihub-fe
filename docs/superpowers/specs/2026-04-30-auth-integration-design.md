# Authentication Integration Design

**Date:** 2026-04-30
**Topic:** Full Authentication Lifecycle Integration (NextAuth v4 & GoFiber)

## 1. Overview

This document specifies the architectural design and implementation details for integrating the Next.js App Router frontend with the existing GoFiber backend for the complete user authentication lifecycle. This includes Login, Registration, Forgot/Reset Password, and Email Verification. The integration strictly adheres to End-to-End Type Safety using Zod and utilizes NextAuth v4 for session management.

## 2. Goals

- Integrate the client-side **Login** form (`src/app/auth/login`) with NextAuth and `/api/v1/users/login`.
- Integrate the **Registration** flow (for EO and Peserta) with `/api/v1/users/register/{role}` via Next.js Server Actions.
- Integrate the **Forgot Password** and **Reset Password** flows with `/api/v1/users/forgot-password` and `/api/v1/users/reset-password/{token}` via Server Actions.
- Integrate **Email Verification** logic on the `/auth/verify-email` page utilizing the `/api/v1/users/verify-email/{email}/{emailVerPass}` endpoint.
- Securely store the JWT Bearer token and user details (Role, ID, Email) within a NextAuth session.
- Validate all user inputs and API responses using Zod schemas to ensure robust type safety.

## 3. Architecture & Data Flow

### 3.1. Schemas (`src/schemas/auth.schema.ts`)

We will define comprehensive Zod schemas for all auth-related actions:

- **Form Schemas**: `loginFormSchema`, `registerFormSchema`, `forgotPasswordSchema`, `resetPasswordSchema`. These validate user input and are mapped directly to React Hook Form.
- **Response Schemas**: `loginResponseSchema`, `registerResponseSchema`, `baseResponseSchema`. These validate the JSON payload received from the GoFiber API, ensuring structural integrity (e.g., extracting the `accessToken` safely).

### 3.2. API Service Layer & Server Actions

Unlike Login (which routes through NextAuth), other auth flows will use Server Actions calling Native Fetch Services to securely communicate with the GoFiber API:

- **`src/services/auth.service.ts`**: Contains native `fetch` wrappers for `registerUser`, `forgotPassword`, `resetPassword`, and `verifyEmail`.
- **`src/actions/auth.actions.ts`**: Contains Next.js Server Actions (`"use server"`) that invoke the services, handle Zod validation on the server, catch errors, and return structured state (Success/Error messages) back to the client UI.

### 3.3. NextAuth Configuration (`src/lib/auth.ts`)

- **Provider**: `CredentialsProvider` configured to handle Login.
- **`authorize` Callback**: Performs native fetch to `/api/v1/users/login`, validates response with `loginResponseSchema`, and returns the validated user object with token.
- **`jwt` & `session` Callbacks**: Merges the backend `accessToken` and user attributes (id, role) into the NextAuth JWT and Session objects for global app state.

### 3.4. Page Refactoring (`src/app/auth/*`)

The existing static UI slicings will be converted to functional React components:

- **Form Handling**: All forms will use `react-hook-form` paired with the shadcn/ui `<Form>` wrapper and `zodResolver`.
- **Login (`/auth/login`)**: Calls `signIn("credentials")` from `next-auth/react`.
- **Register (`/auth/register`)**: Calls the `registerUser` Server Action. Handles loading states and redirects to login/verify-email upon success.
- **Forgot/Reset Password (`/auth/forgot-password`)**: Calls respective Server Actions and displays success toast notifications using `sonner`.
- **Verify Email (`/auth/verify-email/[email]`)**: Likely a Server Component or Client Component with `useEffect` that calls the verification API based on URL parameters and shows a success/failure state.

## 4. Dependencies & Prerequisites

- **NextAuth v4** (`next-auth@^4.24.13`)
- **Zod** and **React Hook Form**
- **Backend URL**: `process.env.API_BASE_URL` defined securely.

## 5. Security Considerations

- **No Client-Side API Exposure**: The `API_BASE_URL` is never exposed to the client. All non-login interactions are proxied through Server Actions.
- **Token Storage**: The JWT Bearer token is securely stored in an HttpOnly cookie managed by NextAuth.
- **Role-Based Access Control (RBAC)**: NextAuth session will hold the `role`, readying the app for Middleware protection.
