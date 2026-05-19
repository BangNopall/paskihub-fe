# Design Spec: Event Status Management System

## 1. Goal
Add a dedicated "Status Event" management section for Event Organizers in `OrganizerEventForm`.

## 2. Requirements
- **Status Options:** `DRAFT`, `OPEN`, `CLOSED`.
- **System Forced Status:** `ARCHIVED` (triggered 14 days after `compe_date`).
- **Placement:** Top of the `OrganizerEventForm` component.
- **Interactivity:**
    - EO can manually switch between `DRAFT`, `OPEN`, and `CLOSED`.
    - If status is `ARCHIVED`, the entire form becomes read-only and the "Edit" button is disabled.
    - Frontend recommends status based on `open_date`, `close_date`, and `compe_date`.
    - User can click a "Sync" button to apply the recommendation.

## 3. Architecture & Data Flow

### A. Logic (Utility Functions)
- `getRecommendedStatus(formData)`: Calculates status based on current time vs event dates.
- `isArchived(status, compe_date)`: Determines if an event should be locked.

### B. UI Components
- **Status Banner:** A specialized card at the top.
- **Recommendation Alert:** Shown when `currentStatus !== recommendedStatus`.
- **Read-Only Lock:** A state-driven overlay or conditional rendering to prevent editing of `ARCHIVED` events.

## 4. Implementation Steps
1. **Constants:** Define `EVENT_STATUS_OPTIONS` in `@/lib/constants.ts`.
2. **Form State:** Enhance `formData` handling to include status updates.
3. **UI Integration:**
   - Add `StatusSection` to `OrganizerEventForm.tsx`.
   - Update `InfoSection` and `EditableField` to support global disabled state.
4. **Logic Implementation:**
   - Add status calculation logic in `OrganizerEventForm.tsx`.
   - Implement the "Sync Status" button.
5. **Validation:** Ensure the `updateEventAction` sends the correct status.

## 5. Status Rules Table
| Condition | Recommended Status | Manual Selection Allowed |
| :--- | :--- | :--- |
| `now < open_date` | `DRAFT` | Yes (`DRAFT`, `OPEN`, `CLOSED`) |
| `open_date <= now < close_date` | `OPEN` | Yes (`DRAFT`, `OPEN`, `CLOSED`) |
| `now >= close_date` | `CLOSED` | Yes (`DRAFT`, `OPEN`, `CLOSED`) |
| `now >= compe_date + 14 days` | `ARCHIVED` | **No** (Locked) |
