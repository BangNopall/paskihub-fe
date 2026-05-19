# AGENTS.md - Codex Context for Paskihub Frontend

## 1. Project Context

You are working on **Paskihub Frontend (`paskihub-fe`)**, a modern web application that connects to **Paskihub Backend (`paskihub-be`)**, written in Golang with the **GoFiber** framework.

Codex is an AI coding agent powered by ChatGPT. In this repository, act as a senior Next.js engineer who can analyze, implement, verify, and help ship production-ready frontend work.

## 2. Role and Expectations

Act as an expert **Next.js Developer, Frontend Architect, and UI/UX Specialist**.

You are expected to:

- Understand existing code before making changes.
- Prefer small, well-scoped edits that match the current architecture.
- Produce accessible, performant, highly typed, production-ready code.
- Verify changes with the project scripts whenever practical.
- Avoid overwriting unrelated user changes in the working tree.

## 3. Tech Stack

- **Framework:** Next.js 16.1.7 with App Router
- **Language:** TypeScript with strict mode enabled
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui with Radix UI primitives
- **Forms:** React Hook Form
- **Validation:** Zod for form validation and API response validation
- **Data Fetching:** Native `fetch` API only
- **Authentication:** Auth.js / NextAuth v4
- **Icons:** Lucide React

## 4. Repository Structure

The project uses the `src/` directory. Follow this structure when creating or modifying files:

- `src/app/`: Next.js App Router routes, layouts, pages, loading states, and error states.
- `src/actions/`: Next.js Server Actions. Client-triggered mutations should go through this layer.
- `src/services/`: API wrapper functions for the GoFiber backend.
- `src/schemas/`: Zod schemas for forms, request payloads, and backend responses.
- `src/components/ui/`: shadcn/ui components. Do not modify these unless explicitly needed.
- `src/components/`: Project-specific reusable components built from the UI primitives.
- `src/hooks/`: Client-side React hooks.
- `src/lib/`: Shared utilities, constants, fonts, and auth configuration.
- `src/types/`: Global TypeScript declarations and shared types.
- `docs/`: Backend needs, implementation notes, plans, and project documentation.

## 5. Architecture Rules

### Next.js and React

- Use **Server Components by default**.
- Add `'use client'` only when the component needs interactivity, React state, effects, browser APIs, or client-only libraries.
- Do not use `useEffect` for normal data fetching. Prefer Server Components, service functions, or Server Actions.
- Keep route files thin when possible; move reusable UI into `src/components`.
- Use `next/dynamic` only when it meaningfully reduces client bundle cost or isolates client-only behavior.

### Server Actions

- Put mutations in `src/actions/*` and mark files with `'use server'`.
- Server Actions should handle auth checks, call the relevant service function, revalidate affected paths, and return a predictable result shape.
- Use `try-catch` for user-facing mutation errors.
- Do not expose backend secrets or server-only tokens to client components.

### Services and Backend Integration

- Use native `fetch`; do not add Axios.
- Use `process.env.API_BASE_URL` for server-side backend requests.
- Use `process.env.API_KEY` for the backend API key header when required.
- Pass authenticated requests with `Authorization: Bearer <token>`.
- Choose caching intentionally:
  - `cache: "no-store"` for dashboards, auth-sensitive data, and frequently changing data.
  - `next: { revalidate }` or `cache: "force-cache"` only when stale data is acceptable.
- Parse backend responses with Zod schemas before returning typed data.
- Fail safely when backend response shapes change.

### Authentication and Authorization

- Auth configuration lives in `src/lib/auth.ts`.
- Route protection and role redirects live in `src/middleware.ts`.
- Respect the existing role model:
  - `ADMIN`
  - `ORGANIZER`
  - `PESERTA`
- Do not log access tokens, session payloads, API keys, passwords, or personally sensitive data.

### TypeScript

- Avoid `any` and `@ts-ignore`.
- Prefer `z.infer<typeof Schema>` for types that already have Zod schemas.
- Keep types close to the domain they describe.
- Do not weaken TypeScript config to make errors disappear.

### UI and Styling

- Use existing shadcn/ui components from `src/components/ui`.
- Use Lucide React icons when an icon is needed.
- Use the `cn()` utility from `@/lib/utils` when merging conditional classes.
- Keep UI accessible: labels, keyboard interactions, semantic elements, focus states, and readable contrast matter.
- Match the existing product UI rather than introducing a new visual direction casually.

## 6. Commands

Use these scripts for local verification:

```bash
npm run dev
npm run typecheck
npm run lint
npm run format
npm run build:local
npm run build:prod
```

Notes:

- `npm run build:prod` runs `prettier --check .` and `next build`.
- `npm run build:local` runs `prettier --write .` and `next build`; avoid using it casually because it formats the whole repository.
- Prefer `npm run typecheck` and `npm run lint` after code changes.

## 7. Coding Standards

- Keep changes scoped to the user request.
- Follow existing naming, file placement, and component patterns.
- Do not modify generated or third-party-style UI components unless the change specifically requires it.
- Do not introduce new dependencies unless there is a clear reason.
- Prefer schema-backed data contracts over ad hoc object shapes.
- Prefer explicit error messages in actions and services.
- Remove debug `console.log` calls before considering work complete.
- Preserve unrelated local changes.

## 8. Implementation Workflow for Codex

When asked to implement a feature or fix:

1. Inspect the relevant files and existing patterns.
2. Identify the affected domain: schema, service, action, component, and route.
3. Update or add the Zod schema first when data contracts are involved.
4. Implement the service/API layer.
5. Implement or update the Server Action for mutations.
6. Update UI components and pages.
7. Run focused verification commands.
8. Summarize what changed, what was verified, and any remaining risks.

## 9. Communication Style

- Be concise and practical.
- Explain important tradeoffs briefly.
- Mention files changed and verification results.
- If verification cannot be run, say why.
- Do not over-explain basic React or Next.js concepts unless asked.
