# Admin Dashboard Backend Contract

## Context

The admin dashboard page at `src/app/admin/dashboard/page.tsx` renders with SSR from this backend endpoint:

```http
GET /api/v1/admin/dashboard
```

The current Swagger file exposes this endpoint with `ApiKeyAuth` and `BearerAuth`.

## Current Frontend Needs

- `data.stats.total_revenue.value`
- `data.stats.total_revenue.trend`
- `data.stats.total_eo.value`
- `data.stats.total_eo.trend`
- `data.stats.total_participants.value`
- `data.stats.total_participants.trend`
- `data.stats.pending_topups.value`
- `data.stats.pending_topups.trend`
- `data.recent_transactions[].id`
- `data.recent_transactions[].eo_name`
- `data.recent_transactions[].amount`
- `data.recent_transactions[].amount_koin`
- `data.recent_transactions[].time_ago`
- `data.recent_transactions[].status`
- `data.eo_registrations[].id`
- `data.eo_registrations[].name`
- `data.eo_registrations[].email`
- `data.eo_registrations[].registered_at`

## Recommended Response Shape

```json
{
  "data": {
    "stats": {
      "total_revenue": {
        "value": 125000000,
        "trend": "+12% bulan ini"
      },
      "total_eo": {
        "value": 42,
        "trend": "+5 baru"
      },
      "total_participants": {
        "value": 1240,
        "trend": "+156 baru"
      },
      "pending_topups": {
        "value": 8,
        "trend": "Perlu approval"
      }
    },
    "recent_transactions": [
      {
        "id": "transaction-id",
        "eo_name": "SMA 1 Jakarta",
        "amount": 500000,
        "amount_koin": 500,
        "time_ago": "10 menit yang lalu",
        "status": "PENDING"
      }
    ],
    "eo_registrations": [
      {
        "id": "user-id",
        "name": "Lomba Jaya Abadi",
        "email": "contact@lomajaya.com",
        "registered_at": "2026-04-24T00:00:00Z"
      }
    ]
  }
}
```

## Field Notes

- `total_revenue.value`: Total approved top-up revenue in IDR.
- `total_revenue.trend`: Backend-calculated trend label for the current dashboard period.
- `total_eo.value`: Total active organizer accounts.
- `total_eo.trend`: New organizer count or percentage for the current dashboard period.
- `total_participants.value`: Total active participant accounts.
- `total_participants.trend`: New participant count or percentage for the current dashboard period.
- `pending_topups.value`: Total top-up transactions with `PENDING` status.
- `pending_topups.trend`: Short label for pending approval state.
- `recent_transactions`: Latest top-up transactions for the admin approval preview.
- `eo_registrations`: Latest organizer registrations.
- `status`: Should use the existing transaction enum values: `PENDING`, `APPROVE`, `REJECTED`.

## Swagger Status

- `GET /api/v1/admin/dashboard` exists and returns `dto.AdminDashboardRes`.
- `dto.AdminDashboardRes.stats` returns `dto.AdminDashboardStats`.
- `dto.AdminDashboardRes.recent_transactions` returns `dto.AdminDashboardTransactionRes[]`.
- `dto.AdminDashboardRes.eo_registrations` returns `dto.AdminDashboardEORegistrationRes[]`.

## Transaction Pagination Status

Swagger currently documents admin transaction pagination as:

```json
{
  "transactions": [],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

The frontend admin transaction schema now matches this shape.
