# Home Stats API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the public home page stats from a backend API through SSR, with a safe zero fallback while the backend endpoint is pending.

**Architecture:** Add a small schema-backed contract for home stats, a server-only service that calls a future public endpoint with `x-api-key`, and keep `src/app/(home)/page.tsx` as a Server Component. Document the missing backend endpoint and exact response shape in `docs/home-stats-backend-needs.md`.

**Tech Stack:** Next.js App Router Server Component, TypeScript strict mode, native `fetch`, Zod, Tailwind CSS.

---

### Task 1: Schema Contract

**Files:**

- Create: `src/schemas/home-stats.schema.type-test.ts`
- Create: `src/schemas/home-stats.schema.ts`

- [ ] **Step 1: Write the failing type-level contract test**

```ts
import {
  homeStatsResponseSchema,
  type HomeStats,
} from "@/schemas/home-stats.schema"

const sample = homeStatsResponseSchema.parse({
  data: {
    total_events: 12,
    total_organizers: 8,
    total_participants: 240,
    total_teams: 64,
  },
})

const stats: HomeStats = sample.data

stats.total_events satisfies number
stats.total_organizers satisfies number
stats.total_participants satisfies number
stats.total_teams satisfies number
```

- [ ] **Step 2: Run `npm run typecheck`**

Expected: FAIL because `@/schemas/home-stats.schema` does not exist yet.

- [ ] **Step 3: Add the schema**

```ts
import { z } from "zod"

export const homeStatsSchema = z.object({
  total_events: z.number().int().nonnegative(),
  total_organizers: z.number().int().nonnegative(),
  total_participants: z.number().int().nonnegative(),
  total_teams: z.number().int().nonnegative(),
})

export const homeStatsResponseSchema = z.object({
  data: homeStatsSchema,
})

export type HomeStats = z.infer<typeof homeStatsSchema>
```

### Task 2: Server Service

**Files:**

- Create: `src/services/home-stats.service.ts`

- [ ] **Step 1: Add a server-side service**

```ts
import {
  type HomeStats,
  homeStatsResponseSchema,
} from "@/schemas/home-stats.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const emptyHomeStats: HomeStats = {
  total_events: 0,
  total_organizers: 0,
  total_participants: 0,
  total_teams: 0,
}

class HomeStatsService {
  async getStats(): Promise<HomeStats> {
    try {
      const res = await fetch(`${API_URL}/api/v1/public/home-stats`, {
        headers: {
          "x-api-key": API_KEY || "",
        },
        cache: "no-store",
      })

      if (!res.ok) {
        return emptyHomeStats
      }

      const json = await res.json()
      return homeStatsResponseSchema.parse(json).data
    } catch {
      return emptyHomeStats
    }
  }
}

export const homeStatsService = new HomeStatsService()
```

### Task 3: Home Page SSR Wiring

**Files:**

- Modify: `src/app/(home)/page.tsx`

- [ ] **Step 1: Import the service and make the page async**

```ts
import { homeStatsService } from "@/services/home-stats.service"

export default async function HomePage() {
  const stats = await homeStatsService.getStats()
```

- [ ] **Step 2: Replace hardcoded stats**

```tsx
{
  stats.total_events
}
{
  stats.total_organizers
}
{
  stats.total_participants
}
{
  stats.total_teams
}
```

### Task 4: Backend Needs Documentation

**Files:**

- Create: `docs/home-stats-backend-needs.md`

- [ ] **Step 1: Document the required backend endpoint**

```md
# Home Stats Backend Needs

The home page needs a public aggregate stats endpoint for SSR.

GET /api/v1/public/home-stats

Response:
{
"data": {
"total_events": 120,
"total_organizers": 45,
"total_participants": 980,
"total_teams": 210
}
}
```

### Task 5: Verification

**Files:**

- Read: `src/app/(home)/page.tsx`
- Read: `src/services/home-stats.service.ts`
- Read: `src/schemas/home-stats.schema.ts`
- Read: `docs/home-stats-backend-needs.md`

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS.
