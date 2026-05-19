# Backend Requirements for Participant Event Integration

To support the full integration of the Participant Event pages, the following changes/additions are required in the backend:

## 1. DTO Updates

### `OpenEventResponse`
Update `domain/dto/participant_event_dto.go` to include more details for the "Explore Events" section.
- `Organizer string`
- `Status string`
- `OpenDate time.Time`
- `CloseDate time.Time`
- `Location string`
- `MinTeamMembers int`
- `MaxTeamMembers int`

### `ActiveEventResponse`
Update `domain/dto/participant_event_dto.go` to include payment type and rejection reason.
- `PaymentType string` (e.g., "DP", "LUNAS")
- `RejectionReason string`

## 2. New Endpoints

### Get Registration Detail
Needed for the `overview` page to show specific data for a team's registration.
- **Method:** `GET`
- **Path:** `/api/v1/peserta/events/registrations/:regis_id`
- **Response:**
  ```json
  {
    "event": {
      "id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "location": "string",
      "price": number,
      "target_date": "string"
    },
    "team": {
      "id": "string",
      "name": "string",
      "logo_url": "string",
      "official_count": number,
      "pasukan_count": number
    },
    "payment": {
      "status": "string",
      "amount_paid": number,
      "total_amount": number,
      "remaining_amount": number,
      "proof_url": "string"
    }
  }
  ```

### Get Scoreboard for Participants
Provide leaderboard data to participants if published.
- **Method:** `GET`
- **Path:** `/api/v1/peserta/rekap/scoreboard/:event_level_id`
- **Logic:** Must verify `event_level.is_score_published == true`.

## 3. Controller Logic
- Ensure all participant endpoints are under the `/api/v1/peserta` group with `AuthPeserta` middleware.
- `RegisterEvent` should handle `multipart/form-data` for the payment proof.
- `PelunasanEvent` should be accessible for re-uploading proof if the status is `REJECTED`.
