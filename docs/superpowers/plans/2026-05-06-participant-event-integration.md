# Participant Event Pages Integration Plan

I'm using the writing-plans skill to create the implementation plan.

**Goal:** Integrate Paskihub API into the participant event pages (`/peserta/dashboard/event/**`) using Server-Side Rendering (SSR) and Server Actions.

**Architecture:** 
- Fetch data in Next.js Server Components (Pages).
- Use dedicated service layers (`participant-event.service.ts`) with native `fetch`.
- Use Zod for schema validation.
- Implement mutations (registration, pelunasan) via Server Actions.

**Tech Stack:** Next.js (App Router), TypeScript, Zod, Auth.js, Shadcn UI.

---

### Task 1: Zod Schemas for Participant Events

**Files:**
- Create: `src/schemas/participant-event.schema.ts`

- [x] **Step 1: Define Open Event and Active Event schemas**

```typescript
import { z } from "zod"

export const OpenEventLevelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  regis_fee: z.string(),
  dp_fee: z.string(),
})

export const OpenEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  logo_path: z.string().nullable(),
  poster_path: z.string().nullable(),
  levels: z.array(OpenEventLevelSchema),
  // Additional fields from missing BE needs
  organizer: z.string().optional(),
  status: z.string().optional(),
  open_date: z.string().optional(),
  close_date: z.string().optional(),
  location: z.string().optional(),
  min_team_members: z.number().optional(),
  max_team_members: z.number().optional(),
})

export const ActiveEventSchema = z.object({
  registration_id: z.string().uuid(),
  event_name: z.string(),
  event_logo_path: z.string().nullable(),
  team_name: z.string(),
  payment_status: z.string(),
})

export type OpenEvent = z.infer<typeof OpenEventSchema>
export type ActiveEvent = z.infer<typeof ActiveEventSchema>
```

- [x] **Step 2: Commit schemas**

```bash
git add src/schemas/participant-event.schema.ts
git commit -m "feat: add zod schemas for participant events"
```

---

### Task 2: Participant Event Service

**Files:**
- Create: `src/services/participant-event.service.ts`

- [x] **Step 1: Implement fetch functions for open and active events**

```typescript
import { 
  OpenEvent, 
  OpenEventSchema, 
  ActiveEvent, 
  ActiveEventSchema 
} from "@/schemas/participant-event.schema"
import { z } from "zod"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const participantEventService = {
  async getOpenEvents(token: string): Promise<OpenEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/open`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return []
    const json = await res.json()
    return z.array(OpenEventSchema).parse(json.data || [])
  },

  async getActiveEvents(token: string): Promise<ActiveEvent[]> {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/active`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!res.ok) return []
    const json = await res.json()
    return z.array(ActiveEventSchema).parse(json.data || [])
  },

  async registerEvent(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/register`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal mendaftar event")
    }
    return res.json()
  },

  async pelunasanEvent(regisId: string, formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/events/register/${regisId}/pelunasan`, {
      method: "PUT",
      headers: {
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Gagal upload pelunasan")
    }
    return res.json()
  }
}
```

- [x] **Step 2: Commit service**

```bash
git add src/services/participant-event.service.ts
git commit -m "feat: implement participant event service"
```

---

### Task 3: Participant Event Server Actions

**Files:**
- Create: `src/actions/participant-event.actions.ts`

- [x] **Step 1: Implement register and pelunasan actions**

```typescript
"use server"

import { participantEventService } from "@/services/participant-event.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function registerEventAction(formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await participantEventService.registerEvent(formData, session.accessToken)
    revalidatePath("/peserta/dashboard/event")
    return { success: true, message: "Pendaftaran berhasil dikirim." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mendaftar" }
  }
}

export async function pelunasanEventAction(regisId: string, formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) throw new Error("Unauthorized")

    await participantEventService.pelunasanEvent(regisId, formData, session.accessToken)
    revalidatePath(`/peserta/dashboard/event/${regisId}/overview`)
    return { success: true, message: "Bukti pembayaran berhasil diunggah." }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mengunggah bukti" }
  }
}
```

- [x] **Step 2: Commit actions**

```bash
git add src/actions/participant-event.actions.ts
git commit -m "feat: add participant event server actions"
```

---

### Task 4: Integrate `My Event` Page (SSR)

**Files:**
- Modify: `src/app/peserta/dashboard/event/page.tsx`

- [x] **Step 1: Convert to Server Component and fetch data**

```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { participantEventService } from "@/services/participant-event.service"
import { teamService } from "@/services/team.service"
import MyEventClient from "./MyEventClient" // We will extract the client logic

export default async function MyEventPage() {
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken

  const [openEvents, activeEvents, myTeams] = await Promise.all([
    participantEventService.getOpenEvents(token),
    participantEventService.getActiveEvents(token),
    teamService.getTeams(token)
  ])

  return (
    <MyEventClient 
      initialOpenEvents={openEvents} 
      initialActiveEvents={activeEvents}
      myTeams={myTeams}
    />
  )
}
```

- [x] **Step 2: Create `MyEventClient.tsx` by extracting from the current page**
- [x] **Step 3: Update `MyEventClient` to use Server Actions for registration**
- [x] **Step 4: Commit integration**

```bash
git add src/app/peserta/dashboard/event/page.tsx src/app/peserta/dashboard/event/MyEventClient.tsx
git commit -m "feat: integrate My Event page with SSR and API"
```

---

### Task 5: Integrate `Event Overview` Page (SSR)

**Files:**
- Modify: `src/app/peserta/dashboard/event/[id]/overview/page.tsx`

- [x] **Step 1: Fetch registration and recap data via SSR**
- [x] **Step 2: Update UI to map API data to the components**
- [x] **Step 3: Implement Pelunasan action**
- [x] **Step 4: Commit integration**

```bash
git add src/app/peserta/dashboard/event/[id]/overview/page.tsx
git commit -m "feat: integrate Event Overview page with SSR and API"
```
