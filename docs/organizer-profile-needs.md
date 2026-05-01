# Backend Requirements for EO Profile & Staff Management (Event Module)

The following API endpoints and data structures are required to support the features in `src/app/organizer/dashboard/profile/page.tsx`, following the `eo` (Event Organizer) module convention as seen in the Swagger documentation.

## 1. Primary Account Security

### GET /api/v1/eo/profile
Retrieves the current Event Organizer's profile information.
- **Purpose**: To display the primary email (read-only) and other profile details.
- **Required Response Fields**:
  - `email`: string
  - `name`: string

### PUT /api/v1/eo/profile/password
Updates the password for the primary EO account.
- **Purpose**: Security management for the main account.
- **Required Request Body**:
  - `old_password`: string (min 8)
  - `new_password`: string (min 8)
  - `confirm_password`: string (min 8)

---

## 2. Staff Account Management (Additional Accounts)

Event Organizers need the ability to manage staff accounts that can access the dashboard.

### GET /api/v1/eo/staff
Retrieves a list of staff accounts associated with the current Event Organizer.
- **Required Response Array Item**:
  - `id`: string (UUID)
  - `email`: string
  - `status`: string ("Verified" | "Unverified")
  - `created_at`: string (ISO date)

### POST /api/v1/eo/staff
Creates a new staff account under the current EO.
- **Required Request Body**:
  - `email`: string
  - `password`: string (min 8)
  - `confirm_password`: string (min 8)

### PUT /api/v1/eo/staff/{id}/password
Updates the password for a specific staff account (Reset by EO).
- **Required Request Body**:
  - `password`: string (min 8)
  - `confirm_password`: string (min 8)

### DELETE /api/v1/eo/staff/{id}
Permanently removes a staff account.

---

## Notes on Alignment
Currently, the Swagger uses the `/api/v1/eo/` prefix for most organizer-related tasks (teams, assessment, etc.). Moving the Profile and Staff management under this prefix ensures architectural consistency.
