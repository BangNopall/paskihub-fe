# Peserta Dashboard Backend Contract

## Context

The participant dashboard page at `src/app/peserta/dashboard/page.tsx` is integrated with:

```http
GET /api/v1/peserta/dashboard
```

The current Swagger contract supports dashboard statistics, recent activities, and upcoming events:

- `data.stats.total_team`
- `data.stats.active_event`
- `data.stats.finished_event`
- `data.stats.pending_payment`
- `data.recent_activities[].title`
- `data.recent_activities[].description`
- `data.recent_activities[].time`
- `data.upcoming_events[].id`
- `data.upcoming_events[].title`
- `data.upcoming_events[].date`
- `data.upcoming_events[].registered_teams`
- `data.upcoming_events[].status`
- `data.upcoming_events[].detail_url_id`

The frontend renders these fields with SSR.

## Response Shape

```json
{
  "data": {
    "stats": {
      "total_team": 2,
      "active_event": 1,
      "finished_event": 0,
      "pending_payment": 1
    },
    "recent_activities": [
      {
        "title": "Lomba Paskibra Nasional 2026",
        "description": "Status pendaftaran tim Garuda Muda: WAITING",
        "time": "5 jam yang lalu"
      }
    ],
    "upcoming_events": [
      {
        "id": "event-or-registration-id",
        "title": "Lomba Paskibra Nasional 2026",
        "date": "2026-03-15",
        "registered_teams": 18,
        "status": "OPEN",
        "detail_url_id": "registration-id-or-event-id"
      }
    ]
  }
}
```

## Field Notes

- `id`: Stable identifier for the event item.
- `title`: Event name shown in the card.
- `date`: Competition date or closest relevant event date.
- `registered_teams`: Number of registered teams for the event.
- `status`: Event status label source, for example `OPEN`, `CLOSED`, or `FINISHED`.
- `detail_url_id`: Registration ID used by the frontend to link to `/peserta/dashboard/event/[detail_url_id]/overview`.

## Existing Stat Accuracy

`stats.finished_event` exists in Swagger and is displayed by the frontend. Backend should keep this value aligned with the finalized rule for completed participant registrations/events.
