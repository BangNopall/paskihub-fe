# Admin User Management Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan detail data relasional pada manajemen user admin (EO & Peserta), fitur perubahan status event oleh admin, dan pembersihan daftar user dari role Admin.

**Architecture:** Implementasi endpoint baru di backend khusus untuk admin, perluasan schema Zod di frontend, dan peningkatan UI berbasis Tabs dan Accordion pada modal detail user.

**Tech Stack:** Next.js (App Router), TypeScript, Zod, Shadcn UI, Go (Fiber), GORM.

---

### Task 1: Backend Repository & Contract Update (paskihub-be)

**Files:**
- Modify: `../paskihub-be/domain/contracts/event_contract.go`
- Modify: `../paskihub-be/internal/app/event/repository/event_repository.go`

- [ ] **Step 1: Update EventRepository interface**
Tambahkan method `UpdateStatus` pada interface `EventRepository` di `domain/contracts/event_contract.go`.

```go
type EventRepository interface {
    // ... existing
    UpdateStatus(ctx context.Context, eventId uuid.UUID, status string) error
}
```

- [ ] **Step 2: Implement UpdateStatus in Repository**
Tambahkan implementasi `UpdateStatus` di `internal/app/event/repository/event_repository.go`.

```go
func (r *eventRepository) UpdateStatus(ctx context.Context, eventId uuid.UUID, status string) error {
	err := r.conn.WithContext(ctx).Model(&entity.Event{}).Where("id = ?", eventId).Update("status", status).Error
	if err != nil {
		log.Warn(log.LogInfo{
			"error": err.Error(),
		}, "[EVENT REPOSITORY][UpdateStatus] failed to update status")
		return domain.ErrInternalServer
	}
	return nil
}
```

- [ ] **Step 3: Commit Repository changes**
```bash
cd ../paskihub-be
git add domain/contracts/event_contract.go internal/app/event/repository/event_repository.go
git commit -m "repo: add UpdateStatus method to event repository"
```

---

### Task 2: Backend Service Implementation (paskihub-be)

**Files:**
- Modify: `../paskihub-be/domain/contracts/event_contract.go`
- Modify: `../paskihub-be/internal/app/event/service/event_service.go`

- [ ] **Step 1: Update EventService interface**
Tambahkan `UpdateEventStatusByAdmin` pada interface `EventService` di `domain/contracts/event_contract.go`.

```go
type EventService interface {
    // ... existing
    UpdateEventStatusByAdmin(ctx context.Context, eventId string, status string) error
}
```

- [ ] **Step 2: Implement UpdateEventStatusByAdmin in Service**
Tambahkan implementasi di `internal/app/event/service/event_service.go`.

```go
func (s *eventService) UpdateEventStatusByAdmin(ctx context.Context, eventId string, status string) error {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	id, err := uuid.Parse(eventId)
	if err != nil {
		return domain.ErrInternalServer
	}

	return s.eventRepo.UpdateStatus(ctx, id, status)
}
```

- [ ] **Step 3: Commit Service changes**
```bash
git add domain/contracts/event_contract.go internal/app/event/service/event_service.go
git commit -m "feat: implement UpdateEventStatusByAdmin in event service"
```

---

### Task 3: Backend Controller & Routing (paskihub-be)

**Files:**
- Modify: `../paskihub-be/internal/app/user/controller/user_controller.go`

- [ ] **Step 1: Add UpdateEventStatus handler**
Tambahkan method `UpdateEventStatus` di `user_controller.go` (karena admin user management ada di sini).

```go
func (c *userController) UpdateEventStatus(ctx *fiber.Ctx) error {
	eventId := ctx.Params("eventId")
	
	var req struct {
		Status string `json:"status" validate:"required"`
	}
	if err := ctx.BodyParser(&req); err != nil {
		return nil
	}

	err := c.eventSvc.UpdateEventStatusByAdmin(ctx.Context(), eventId, req.Status)
	if err != nil {
		response.Send(ctx, domain.GetCode(err), "failed to update event status", nil, err)
		return nil
	}

	response.Send(ctx, http.StatusOK, "success to update event status", nil, nil)
	return nil
}
```

- [ ] **Step 2: Register Admin Route**
Daftarkan route baru di `InitUserController` pada group `adminRouter`.

```go
// Inside InitUserController
adminRouter.Put("/events/:eventId/status", userController.UpdateEventStatus)
```

- [ ] **Step 3: Commit Controller changes**
```bash
git add internal/app/user/controller/user_controller.go
git commit -m "feat: add admin endpoint to update event status"
```

---

### Task 4: Frontend Schema Expansion (paskihub-fe)

**Files:**
- Modify: `src/schemas/admin.schema.ts`

- [ ] **Step 1: Define Detailed Schemas**
Perbarui `src/schemas/admin.schema.ts` untuk mencakup seluruh relasi data.

```typescript
import { z } from "zod";

// Base Event Level
const EventLevelSchema = z.object({
  name: z.string(),
  regis_fee: z.string(),
  dp_fee: z.string(),
});

// EO Data
const AdminEventResSchema = z.object({
  id: z.string().uuid().optional(), // Added for status update action
  event_name: z.string(),
  compe_date: z.string(),
  location: z.string(),
  status: z.string(),
  event_levels: z.array(EventLevelSchema).optional().default([]),
});

const AdminStaffResSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const AdminUserEODetailSchema = z.object({
  panitia: z.array(AdminStaffResSchema).optional().default([]),
  events: z.array(AdminEventResSchema).optional().default([]),
});

// Peserta Data
const AdminTeamMemberResSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const AdminTeamResSchema = z.object({
  team_name: z.string(),
  coach: z.string(),
  members_count: z.number(),
  members: z.array(AdminTeamMemberResSchema).optional().default([]),
});

const AdminEventRegistrationResSchema = z.object({
  event_name: z.string(),
  event_level_name: z.string(),
  payment_status: z.string(),
  assessment_status: z.string(),
});

const AdminUserPesertaDetailSchema = z.object({
  teams: z.array(AdminTeamResSchema).optional().default([]),
  event_history: z.array(AdminEventRegistrationResSchema).optional().default([]),
});

// User Detail Response (Full)
export const AdminUserDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  joined_at: z.string(),
  school_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  eo_data: AdminUserEODetailSchema.optional(),
  peserta_data: AdminUserPesertaDetailSchema.optional(),
});

export type AdminUserDetail = z.infer<typeof AdminUserDetailSchema>;

// Keep existing list schema...
```

- [ ] **Step 2: Commit Schema changes**
```bash
git add src/schemas/admin.schema.ts
git commit -m "feat: expand admin schema for detailed user data"
```

---

### Task 5: Frontend Service & Actions (paskihub-fe)

**Files:**
- Modify: `src/services/admin.service.ts`
- Modify: `src/actions/admin.actions.ts`

- [ ] **Step 1: Add updateEventStatus to Service**
Update `src/services/admin.service.ts`.

```typescript
  async updateEventStatus(eventId: string, status: string) {
    const session: any = await getServerSession(authOptions)
    const token = session?.accessToken
    if (!token) throw new Error("Unauthorized")

    const res = await fetch(`${API_URL}/api/v1/admin/events/${eventId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.details || "Gagal memperbarui status event")
    }
    return { success: true }
  },
```

- [ ] **Step 2: Add updateEventStatusAction**
Update `src/actions/admin.actions.ts`.

```typescript
export async function updateEventStatusAction(eventId: string, status: string) {
  try {
    await adminService.updateEventStatus(eventId, status)
    // We don't necessarily need to revalidate the whole list path here 
    // because this action is inside the detail modal, but it's safe to do.
    return { success: true, message: "Status event berhasil diperbarui" }
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memperbarui status event" }
  }
}
```

- [ ] **Step 3: Commit Service & Action changes**
```bash
git add src/services/admin.service.ts src/actions/admin.actions.ts
git commit -m "feat: add service and action for admin event status update"
```

---

### Task 6: UI Component Enhancement (paskihub-fe)

**Files:**
- Modify: `src/components/admin/user-management-client.tsx`

- [ ] **Step 1: Filter Admin from list**
Modifikasi `filteredUsers` untuk menyembunyikan role ADMIN.

```typescript
  const filteredUsers = users.filter((user) => {
    if (user.role === "ADMIN") return false; // Filter out Admins
    // ... existing search and tab logic
```

- [ ] **Step 2: Implement Event Status Change in Detail Modal**
Perbarui render Tab "Data Event" untuk ORGANIZER. Tambahkan Select component untuk merubah status.

- [ ] **Step 3: Implement Detailed Participant View**
Perbarui render Tab "Data Tim" (dengan anggota) dan "Riwayat Event" untuk PESERTA sesuai rancangan spec.

- [ ] **Step 4: Commit UI changes**
```bash
git add src/components/admin/user-management-client.tsx
git commit -m "feat: enhance user management UI with filtering and detailed views"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Build Check**
Pastikan tidak ada error tipe data.
```bash
npm run build
```
