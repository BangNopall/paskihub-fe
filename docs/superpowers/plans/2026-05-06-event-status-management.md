# Event Status Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated "Status Event" section to `OrganizerEventForm` with manual controls for DRAFT, OPEN, CLOSED, and automatic recommendation logic. ARCHIVED events will be read-only.

**Architecture:** 
- Centralize status options in `constants.ts`.
- Implement status calculation logic (recommended vs actual) within `OrganizerEventForm`.
- Add a "Sync" mechanism for automatic status updates based on dates.
- Use conditional rendering to enforce read-only state for `ARCHIVED` events.

**Tech Stack:** Next.js, React, Tailwind CSS, Lucide Icons, date-fns.

---

### Task 1: Add Status Constants

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Add EVENT_STATUS_OPTIONS and helper**

```typescript
export const EVENT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "OPEN", label: "Open", color: "bg-green-100 text-green-600 border-green-200" },
  { value: "CLOSED", label: "Closed", color: "bg-red-100 text-red-600 border-red-200" },
  { value: "ARCHIVED", label: "Archived", color: "bg-gray-100 text-gray-500 border-gray-200" },
] as const

export function getStatusStyle(status: string) {
  return EVENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.color || "bg-slate-100 text-slate-600"
}

export function getStatusLabel(status: string) {
  return EVENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add event status constants and helpers"
```

---

### Task 2: Implement Status Calculation Logic

**Files:**
- Modify: `src/components/organizer/event-form.tsx`

- [ ] **Step 1: Add calculation functions**

Add these inside the component or as helpers:

```typescript
const getRecommendedStatus = (data: EventData): string => {
  const now = new Date()
  const openDate = new Date(data.open_date)
  const closeDate = new Date(data.close_date)
  const compeDate = new Date(data.compe_date)
  
  // ARCHIVED: 14 days after compe_date
  const archiveDate = new Date(compeDate)
  archiveDate.setDate(archiveDate.getDate() + 14)

  if (now >= archiveDate) return "ARCHIVED"
  if (now >= closeDate) return "CLOSED"
  if (now >= openDate) return "OPEN"
  return "DRAFT"
}

const isArchived = (data: EventData): boolean => {
  return data.status === "ARCHIVED" || getRecommendedStatus(data) === "ARCHIVED"
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/organizer/event-form.tsx
git commit -m "feat: implement status calculation logic"
```

---

### Task 3: Add Status Section UI

**Files:**
- Modify: `src/components/organizer/event-form.tsx`

- [ ] **Step 1: Define StatusSection sub-component**

```typescript
function StatusSection({ 
  status, 
  recommended, 
  isEditing, 
  onStatusChange, 
  onSync 
}: { 
  status: string, 
  recommended: string, 
  isEditing: boolean, 
  onStatusChange: (val: string) => void,
  onSync: () => void
}) {
  const style = getStatusStyle(status)
  const isDiff = status !== recommended && recommended !== "ARCHIVED"

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-poppins text-lg font-medium text-slate-900">Status Event</h3>
          <p className="text-sm text-neutral-500">Kelola status publikasi event Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold transition-all", style)}>
            {getStatusLabel(status)}
          </div>
          {isEditing && status !== "ARCHIVED" && (
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-32 bg-white focus-visible:ring-sky-200">
                <SelectValue placeholder="Ubah Status" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUS_OPTIONS.filter(opt => opt.value !== "ARCHIVED").map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {isDiff && isEditing && (
        <div className="mt-2 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-3 text-amber-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Rekomendasi sistem: <strong className="font-bold">{getStatusLabel(recommended)}</strong> berdasarkan jadwal yang diatur.
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSync}
            className="border-amber-200 bg-white text-amber-700 hover:bg-amber-100"
          >
            Gunakan Rekomendasi
          </Button>
        </div>
      )}

      {status === "ARCHIVED" && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-600">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            Event ini telah diarsipkan secara otomatis oleh sistem (14 hari setelah pelaksanaan).
          </span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Integrate StatusSection into OrganizerEventForm**

Place it before "Identitas Event".

- [ ] **Step 3: Handle Read-Only state for ARCHIVED**

In `OrganizerEventForm`, update the "Edit Event" button to be hidden or disabled if `isArchived(formData)` is true.

- [ ] **Step 4: Commit**

```bash
git add src/components/organizer/event-form.tsx
git commit -m "feat: integrate status section UI and read-only logic"
```

---

### Task 4: Final Validation and Testing

**Files:**
- Modify: `src/components/organizer/event-form.tsx`

- [ ] **Step 1: Ensure handleSave includes status**

The current `handleSave` already includes `status: formData.status`. Verify it works correctly with the new UI.

- [ ] **Step 2: Test automatic recommendation logic**
- [ ] **Step 3: Test manual status override**
- [ ] **Step 4: Verify ARCHIVED lockdown**
- [ ] **Step 5: Commit**

```bash
git add src/components/organizer/event-form.tsx
git commit -m "test: verify event status management functionality"
```
