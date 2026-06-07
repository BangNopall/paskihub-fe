# Home Stats Backend Needs

## Context

The public home page at `src/app/(home)/page.tsx` renders four aggregate stats with SSR:

- `Jumlah event`
- `Event Organizer`
- `Peserta`
- `Tim`

The current Swagger file now exposes a public endpoint that matches these needs. Earlier dashboard endpoints contain partial stats, but they require `BearerAuth` and are scoped to admin or organizer dashboards.

## Available Endpoint

```http
GET /api/v1/public/home-stats
```

Swagger security:

- `ApiKeyAuth`
- No `BearerAuth`

This keeps the endpoint usable from a Next.js Server Component while keeping `API_KEY` server-side.

## Swagger Response Shape

```json
{
  "code": 200,
  "data": {
    "total_events": 120,
    "total_organizers": 45,
    "total_participants": 980,
    "total_teams": 210
  },
  "message": "success to get home stats",
  "status": "success"
}
```

## Field Notes

- `total_events`: Total events excluding `ARCHIVED` status.
- `total_organizers`: Total active verified organizer accounts.
- `total_participants`: Total active verified participant accounts.
- `total_teams`: Total teams owned by active verified participant accounts.

All fields should be non-negative integers. If backend filtering rules differ, please document them in Swagger so the frontend copy can be aligned with the displayed values.

## Frontend Fallback

If the endpoint returns a non-OK response or an unexpected payload, the frontend service returns:

```json
{
  "total_events": 0,
  "total_organizers": 0,
  "total_participants": 0,
  "total_teams": 0
}
```

## Swagger Status

As of the Swagger file checked from `/Users/noxval/_PROJECT_/paskihub-be/docs/swagger.json`, `GET /api/v1/public/home-stats` exists and returns `dto.HomeStatsResponse`.
