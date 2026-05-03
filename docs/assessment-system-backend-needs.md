# Backend Requirements for Assessment System Integration

After analyzing the `swagger.json` and the frontend requirements for the Assessment System page, here are the identified gaps and needs for the backend API:

## 1. Level-Specific Assessment Association

The frontend implementation allows organizers to configure different assessment criteria for each **Jenjang** (e.g., SD, SMP, SMA).

- **Issue:** Currently, the following endpoints are scoped only by `eventId`:
  - `/api/v1/eo/events/{eventId}/assessment/score-categories`
  - `/api/v1/eo/events/{eventId}/assessment/score-sub-categories`
  - `/api/v1/eo/events/{eventId}/assessment/violation-types`
- **Need:** These entities should ideally be associated with an `event_level_id` so that organizers can define different scoring systems for different levels.
- **Request:** Add `event_level_id` (query param for GET, body field for POST/PUT) to these assessment endpoints.

## 2. Sub-Category Max Score and Grades

The frontend expects each **Sub-Category** to have a `maxScore` and associated **Grade Ranges** (e.g., "Kurang", "Cukup", "Baik", "Sangat Baik").

- **Issue:**
  - `dto.CreateScoreSubCategoryReq` only contains `name` and `score_categories_id`.
  - `/api/v1/eo/events/{eventId}/assessment/grade-rules` appears to be a global event setting.
- **Need:**
  - Each sub-category should store its own `max_score`.
  - The backend should clarify if `grade-rules` are indeed global or if they should be configurable per sub-category (or if they are just labels that apply to the `max_score`).
- **Request:** Add `max_score` to `ScoreSubCategory` DTOs. If grades are sub-category specific, they should also be part of the sub-category configuration.

## 3. Unified Data Fetching

To implement Server-Side Rendering (SSR) efficiently:

- **Need:** A single endpoint that returns all assessment configuration for a specific level.
- **Example:** `GET /api/v1/eo/events/{eventId}/assessment-system?level_id={levelId}`
- **Response Structure:**
  ```json
  {
    "violations": [...],
    "categories": [
      {
        "id": "...",
        "name": "...",
        "sub_categories": [
          {
            "id": "...",
            "name": "...",
            "max_score": 100,
            "grades": { ... }
          }
        ]
      }
    ]
  }
  ```

## 4. Grade Rules Mapping

- **Current BE Enum:** `Kurang`, `Cukup`, `Baik`, `Sangat Baik`.
- **FE Requirement:** Matches.
- **Refinement:** Ensure that these rules can be correctly associated with the sub-categories or levels as per the needs above.
