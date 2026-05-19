# Missing Backend Needs: Admin Management

This document outlines the required backend changes to support the **Admin Management** page in the dashboard.

## 1. Data Model Changes (`domain/entity/user.go`)

Currently, the `User` entity lacks specific fields for administrative staff identity and activity tracking.

- **Add `LastLoginAt` field:** A timestamp to track when the admin last accessed the system.

```go
type User struct {
    // ... existing fields
    LastLoginAt *time.Time `json:"last_login_at" gorm:"type:timestamp;default:null;"`
}
```

## 2. DTO Changes (`domain/dto/user_dto.go`)

- **Update `UserResponse`:** Include `last_login_at`.
- **Create `AdminCreateRequest`:**
  ```go
  type AdminCreateRequest struct {
      Email    string `json:"email" validate:"required,email"`
      Password string `json:"password" validate:"required,min=8"`
  }
  ```

## 3. New Endpoints (`internal/app/user/controller/user_controller.go`)

The following endpoints are needed under the `/api/v1/admin` group (guarded by `AuthAdmin` middleware):

| Method   | Endpoint                                  | Description                                                 |
| :------- | :---------------------------------------- | :---------------------------------------------------------- |
| `POST`   | `/api/v1/admin/admins`                    | Create a new admin staff account.                           |
| `DELETE` | `/api/v1/admin/admins/:id`                | Permanently remove an admin's access.                       |
| `POST`   | `/api/v1/admin/admins/:id/reset-password` | Manually reset/trigger a password reset for an admin staff. |

## 4. Business Logic Updates (`internal/app/user/service/user_service.go`)

- **Role Constraint:** Ensure only the `ADMIN` role is used for ini staff accounts. No `SUPERADMIN` role should be implemented as per requirements.
- **Login Tracking:** Update `LastLoginAt` whenever a user successfully logs in.
- **Admin Fetching:** Ensure `GET /api/v1/admin/admins` returns the `last_login_at` fields correctly and filter users by role `ADMIN`.

## 5. Frontend Alignment

- **Identity Display:** The frontend will use the `email` as the primary identifier (e.g., in the "Admin" column).
- **Role Removal:** The frontend will remove all references to "Super Admin" and the role-switching dialog.
- **SSR Implementation:** The admin list will be fetched on the server using Server-Side Rendering (SSR) for the initial load.
