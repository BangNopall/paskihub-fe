# Backend API Contract Summary

This document summarizes the API contracts based on the Swagger specification.

## Endpoints

### GET /api/v1/admin/admins
- **Tags**: Admin
- **Summary**: Get all admins

### POST /api/v1/admin/admins
- **Tags**: Admin
- **Summary**: Create a new admin
- **Parameters**:
  - `admin` (body, Required): Admin Data

### DELETE /api/v1/admin/admins/{id}
- **Tags**: Admin
- **Summary**: Delete admin account
- **Parameters**:
  - `id` (path, Required): Admin User ID

### POST /api/v1/admin/admins/{id}/reset-password
- **Tags**: Admin
- **Summary**: Reset admin password
- **Parameters**:
  - `id` (path, Required): Admin User ID

### GET /api/v1/admin/dashboard
- **Tags**: Dashboard
- **Summary**: Get admin dashboard

### PUT /api/v1/admin/events/{eventId}/status
- **Tags**: Admin
- **Summary**: Update event status
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `status` (body, Required): Status

### GET /api/v1/admin/users
- **Tags**: Admin
- **Summary**: Get all users

### GET /api/v1/admin/users/{userId}
- **Tags**: Admin
- **Summary**: Get admin user detail
- **Parameters**:
  - `userId` (path, Required): User ID

### PUT /api/v1/admin/users/{userId}/archive
- **Tags**: Admin
- **Summary**: Archive organizer event
- **Parameters**:
  - `userId` (path, Required): User ID

### PUT /api/v1/admin/users/{userId}/ban
- **Tags**: Admin
- **Summary**: Ban user
- **Parameters**:
  - `userId` (path, Required): User ID

### PUT /api/v1/admin/users/{userId}/unarchive
- **Tags**: Admin
- **Summary**: Unarchive organizer event
- **Parameters**:
  - `userId` (path, Required): User ID

### PUT /api/v1/admin/users/{userId}/unban
- **Tags**: Admin
- **Summary**: Unban user
- **Parameters**:
  - `userId` (path, Required): User ID

### PUT /api/v1/admin/users/{userId}/verify
- **Tags**: Admin
- **Summary**: Verify user email
- **Parameters**:
  - `userId` (path, Required): User ID

### POST /api/v1/assessment/finalize
- **Tags**: Assessment
- **Summary**: Finalize assessment
- **Parameters**:
  - `req` (body, Required): Finalize Assessment Request

### POST /api/v1/assessment/scores/bulk
- **Tags**: Assessment
- **Summary**: Bulk insert scores
- **Parameters**:
  - `req` (body, Required): Bulk Scores Request

### POST /api/v1/assessment/violations/bulk
- **Tags**: Assessment
- **Summary**: Bulk insert violations
- **Parameters**:
  - `req` (body, Required): Bulk Violations Request

### GET /api/v1/eo/events/{eventId}/assessment/awards
- **Tags**: Event Awards
- **Summary**: Get event awards
- **Parameters**:
  - `eventId` (path, Required): Event ID

### POST /api/v1/eo/events/{eventId}/assessment/awards
- **Tags**: Event Awards
- **Summary**: Create event award
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Award Details

### PUT /api/v1/eo/events/{eventId}/assessment/awards/{id}
- **Tags**: Event Awards
- **Summary**: Update event award
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Award ID
  - `req` (body, Required): Updated Award Details

### DELETE /api/v1/eo/events/{eventId}/assessment/awards/{id}
- **Tags**: Event Awards
- **Summary**: Delete event award
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Award ID

### GET /api/v1/eo/events/{eventId}/assessment/judges
- **Tags**: Judges
- **Summary**: Get judges
- **Parameters**:
  - `eventId` (path, Required): Event ID

### POST /api/v1/eo/events/{eventId}/assessment/judges
- **Tags**: Judges
- **Summary**: Create judge
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Judge Details

### PUT /api/v1/eo/events/{eventId}/assessment/judges/{id}
- **Tags**: Judges
- **Summary**: Update judge
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Judge ID
  - `req` (body, Required): Updated Judge Details

### DELETE /api/v1/eo/events/{eventId}/assessment/judges/{id}
- **Tags**: Judges
- **Summary**: Delete judge
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Judge ID

### GET /api/v1/eo/events/{eventId}/assessment/score-categories
- **Tags**: Score Categories
- **Summary**: Get score categories
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `level_id` (query, Required): Level ID

### POST /api/v1/eo/events/{eventId}/assessment/score-categories
- **Tags**: Score Categories
- **Summary**: Create score category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Score Category Details

### PUT /api/v1/eo/events/{eventId}/assessment/score-categories/{id}
- **Tags**: Score Categories
- **Summary**: Update score category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Score Category ID
  - `req` (body, Required): Updated Score Category Details

### DELETE /api/v1/eo/events/{eventId}/assessment/score-categories/{id}
- **Tags**: Score Categories
- **Summary**: Delete score category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Score Category ID

### POST /api/v1/eo/events/{eventId}/assessment/score-sub-categories
- **Tags**: Score Sub Categories
- **Summary**: Create score sub category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Score Sub Category Details

### PUT /api/v1/eo/events/{eventId}/assessment/score-sub-categories/{id}
- **Tags**: Score Sub Categories
- **Summary**: Update score sub category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Score Sub Category ID
  - `req` (body, Required): Updated Score Sub Category Details

### DELETE /api/v1/eo/events/{eventId}/assessment/score-sub-categories/{id}
- **Tags**: Score Sub Categories
- **Summary**: Delete score sub category
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Score Sub Category ID

### POST /api/v1/eo/events/{eventId}/assessment/scores
- **Tags**: Assessment
- **Summary**: Input single score
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Score Input Details

### GET /api/v1/eo/events/{eventId}/assessment/unified
- **Tags**: Assessment
- **Summary**: Get unified assessment system
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `level_id` (query, Required): Level ID

### GET /api/v1/eo/events/{eventId}/assessment/violation-types
- **Tags**: Violation Types
- **Summary**: Get violation types
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `level_id` (query, Required): Level ID

### POST /api/v1/eo/events/{eventId}/assessment/violation-types
- **Tags**: Violation Types
- **Summary**: Create violation type
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `req` (body, Required): Violation Type Details

### PUT /api/v1/eo/events/{eventId}/assessment/violation-types/{id}
- **Tags**: Violation Types
- **Summary**: Update violation type
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Violation Type ID
  - `req` (body, Required): Updated Violation Type Details

### DELETE /api/v1/eo/events/{eventId}/assessment/violation-types/{id}
- **Tags**: Violation Types
- **Summary**: Delete violation type
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `id` (path, Required): Violation Type ID

### GET /api/v1/eo/events/{eventId}/teams
- **Tags**: EO Team
- **Summary**: Get list of teams
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `event_level_id` (query, Optional): Event Level ID filter
  - `institution_type` (query, Optional): Institution Type filter (SD, SMP, SMA, UMUM, PURNA)

### GET /api/v1/eo/events/{eventId}/teams/stats
- **Tags**: EO Team
- **Summary**: Get team statistics
- **Parameters**:
  - `eventId` (path, Required): Event ID

### GET /api/v1/eo/events/{eventId}/teams/{registrationId}
- **Tags**: EO Team
- **Summary**: Get team details
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `registrationId` (path, Required): Registration ID

### PUT /api/v1/eo/events/{eventId}/teams/{registrationId}/approve
- **Tags**: EO Team
- **Summary**: Approve team registration
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `registrationId` (path, Required): Registration ID
  - `req` (body, Required): Approval Details

### PUT /api/v1/eo/events/{eventId}/teams/{registrationId}/kick
- **Tags**: EO Team
- **Summary**: Kick team
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `registrationId` (path, Required): Registration ID

### PUT /api/v1/eo/events/{eventId}/teams/{registrationId}/reject
- **Tags**: EO Team
- **Summary**: Reject team registration
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `registrationId` (path, Required): Registration ID
  - `req` (body, Required): Rejection Reason

### PUT /api/v1/eo/events/{eventId}/teams/{registrationId}/start-assessment
- **Tags**: EO Team
- **Summary**: Start team assessment
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `registrationId` (path, Required): Registration ID

### GET /api/v1/eo/profile
- **Tags**: EO Profile
- **Summary**: Get EO profile

### PUT /api/v1/eo/profile/password
- **Tags**: EO Profile
- **Summary**: Update EO password
- **Parameters**:
  - `req` (body, Required): Update Password Request

### GET /api/v1/eo/staff
- **Tags**: EO Staff
- **Summary**: Get list of staff

### POST /api/v1/eo/staff
- **Tags**: EO Staff
- **Summary**: Create a new staff account
- **Parameters**:
  - `req` (body, Required): Staff Create Request

### DELETE /api/v1/eo/staff/{id}
- **Tags**: EO Staff
- **Summary**: Delete a staff account
- **Parameters**:
  - `id` (path, Required): Staff ID

### PUT /api/v1/eo/staff/{id}/password
- **Tags**: EO Staff
- **Summary**: Reset staff password
- **Parameters**:
  - `id` (path, Required): Staff ID
  - `req` (body, Required): Reset Password Request

### GET /api/v1/events/admin/show/{id}
- **Tags**: Events
- **Summary**: Show event data (Admin)
- **Parameters**:
  - `id` (path, Required): Event ID

### POST /api/v1/events/create
- **Tags**: Events
- **Summary**: Create a new event
- **Parameters**:
  - `event` (body, Required): Event details

### DELETE /api/v1/events/delete/{id}
- **Tags**: Events
- **Summary**: Delete an event
- **Parameters**:
  - `id` (path, Required): Event ID

### PUT /api/v1/events/update/{id}
- **Tags**: Events
- **Summary**: Update an event
- **Parameters**:
  - `id` (path, Required): Event ID
  - `event` (body, Required): Updated details

### POST /api/v1/events/upload/{id}/logo
- **Tags**: Events
- **Summary**: Upload event logo
- **Parameters**:
  - `id` (path, Required): Event ID
  - `logo` (formData, Required): Logo Image

### POST /api/v1/events/upload/{id}/poster
- **Tags**: Events
- **Summary**: Upload event poster
- **Parameters**:
  - `id` (path, Required): Event ID
  - `poster` (formData, Required): Poster Image

### GET /api/v1/events/user/{userId}
- **Tags**: Events
- **Summary**: Show auth user's events
- **Parameters**:
  - `userId` (path, Required): User ID

### POST /api/v1/events/{id}/levels
- **Tags**: Events
- **Summary**: Create event level
- **Parameters**:
  - `id` (path, Required): Event ID
  - `level` (body, Required): Level details

### PUT /api/v1/events/{id}/levels/{levelId}
- **Tags**: Events
- **Summary**: Update event level
- **Parameters**:
  - `id` (path, Required): Event ID
  - `levelId` (path, Required): Level ID
  - `level` (body, Required): Updated level details

### DELETE /api/v1/events/{id}/levels/{levelId}
- **Tags**: Events
- **Summary**: Delete event level
- **Parameters**:
  - `id` (path, Required): Event ID
  - `levelId` (path, Required): Level ID

### GET /api/v1/files/{resourceType}/{resourceId}
- **Tags**: Private Files
- **Summary**: Download an authorized private file
- **Parameters**:
  - `resourceType` (path, Required): Private resource type
  - `resourceId` (path, Required): Resource ID

### GET /api/v1/organizer/dashboard
- **Tags**: Dashboard
- **Summary**: Get organizer dashboard

### GET /api/v1/peserta/assessment/recap/{regis_id}
- **Tags**: Participant Assessment
- **Summary**: Get assessment recap
- **Parameters**:
  - `regis_id` (path, Required): Registration ID

### GET /api/v1/peserta/dashboard
- **Tags**: Dashboard
- **Summary**: Get participant dashboard

### GET /api/v1/peserta/events/active
- **Tags**: Participant Event
- **Summary**: Get active events

### GET /api/v1/peserta/events/open
- **Tags**: Participant Event
- **Summary**: Get open events

### POST /api/v1/peserta/events/register
- **Tags**: Participant Event
- **Summary**: Register to an event
- **Parameters**:
  - `event_level_id` (formData, Required): Event Level ID
  - `team_id` (formData, Required): Team ID
  - `payment_type` (formData, Required): Payment Type (dp, lunas)
  - `payment_proof` (formData, Required): Payment Proof Image

### PUT /api/v1/peserta/events/register/{id}/pelunasan
- **Tags**: Participant Event
- **Summary**: Pelunasan payment for event
- **Parameters**:
  - `id` (path, Required): Registration ID
  - `payment_proof` (formData, Required): Payment Proof Image

### GET /api/v1/peserta/events/registrations/{regis_id}
- **Tags**: Participant Event
- **Summary**: Get registration detail
- **Parameters**:
  - `regis_id` (path, Required): Registration ID

### GET /api/v1/peserta/profile
- **Tags**: Participant Profile
- **Summary**: Get participant profile

### PUT /api/v1/peserta/profile
- **Tags**: Participant Profile
- **Summary**: Update participant institution
- **Parameters**:
  - `req` (body, Required): Institution Details

### PUT /api/v1/peserta/profile/security
- **Tags**: Participant Profile
- **Summary**: Update participant password
- **Parameters**:
  - `req` (body, Required): Password Details

### GET /api/v1/peserta/rekap/scoreboard/{event_level_id}
- **Tags**: Participant Event
- **Summary**: Get scoreboard for participants
- **Parameters**:
  - `event_level_id` (path, Required): Event Level ID

### GET /api/v1/peserta/teams
- **Tags**: Participant Team
- **Summary**: Get participant teams

### POST /api/v1/peserta/teams
- **Tags**: Participant Team
- **Summary**: Create a new participant team
- **Parameters**:
  - `name` (formData, Required): Team Name
  - `coach_name` (formData, Required): Coach Name
  - `logo` (formData, Required): Team Logo
  - `recommendation_letter` (formData, Required): Recommendation Letter

### GET /api/v1/peserta/teams/{id}
- **Tags**: Participant Team
- **Summary**: Get team details
- **Parameters**:
  - `id` (path, Required): Team ID

### PUT /api/v1/peserta/teams/{id}
- **Tags**: Participant Team
- **Summary**: Update participant team
- **Parameters**:
  - `id` (path, Required): Team ID
  - `name` (formData, Required): Team Name
  - `pelatih_name` (formData, Required): Coach Name
  - `logo_team` (formData, Optional): Team Logo
  - `surat_rekomendasi` (formData, Optional): Recommendation Letter

### DELETE /api/v1/peserta/teams/{id}
- **Tags**: Participant Team
- **Summary**: Delete participant team
- **Parameters**:
  - `id` (path, Required): Team ID

### GET /api/v1/public/home-stats
- **Tags**: Dashboard
- **Summary**: Get public home stats

### GET /api/v1/rekap/detail/{regisId}
- **Tags**: Rekap Assessment
- **Summary**: Get team assessment detail
- **Parameters**:
  - `regisId` (path, Required): Registration ID

### POST /api/v1/rekap/leaderboard/custom/{eventLevelId}
- **Tags**: Rekap Assessment
- **Summary**: Get custom leaderboard
- **Parameters**:
  - `eventLevelId` (path, Required): Event Level ID
  - `req` (body, Required): Custom Leaderboard Criteria

### PUT /api/v1/rekap/publish/{eventLevelId}
- **Tags**: Rekap Assessment
- **Summary**: Publish scoreboard
- **Parameters**:
  - `eventLevelId` (path, Required): Event Level ID
  - `req` (body, Required): Publish Settings

### GET /api/v1/rekap/scoreboard/{eventLevelId}
- **Tags**: Rekap Assessment
- **Summary**: Get scoreboard
- **Parameters**:
  - `eventLevelId` (path, Required): Event Level ID

### GET /api/v1/settings
- **Tags**: System Settings
- **Summary**: Get all system settings (Admin)

### PATCH /api/v1/settings
- **Tags**: System Settings
- **Summary**: Update system settings (Admin)
- **Parameters**:
  - `req` (body, Required): Update Settings Request

### GET /api/v1/settings/public
- **Tags**: System Settings
- **Summary**: Get public system settings

### POST /api/v1/users/forgot-password
- **Tags**: Users
- **Summary**: Forgot user password
- **Parameters**:
  - `user` (body, Required): User Email

### POST /api/v1/users/login
- **Tags**: Users
- **Summary**: User login
- **Parameters**:
  - `user` (body, Required): Login Credentials

### POST /api/v1/users/logout
- **Tags**: Users
- **Summary**: User logout

### POST /api/v1/users/register/{role}
- **Tags**: Users
- **Summary**: Register a new user
- **Parameters**:
  - `role` (path, Required): User Role
  - `user` (body, Required): User Data

### PUT /api/v1/users/reset-password/{token}
- **Tags**: Users
- **Summary**: Reset user password
- **Parameters**:
  - `token` (path, Required): Reset Token
  - `user` (body, Required): New Password

### GET /api/v1/users/show/{userId}
- **Tags**: Users
- **Summary**: Get user by ID
- **Parameters**:
  - `userId` (path, Required): User ID

### GET /api/v1/users/verify-email/{email}/{emailVerPass}
- **Tags**: Users
- **Summary**: Verify user email
- **Parameters**:
  - `email` (path, Required): User Email
  - `emailVerPass` (path, Required): Verification Password

### GET /api/v1/wallets/admin/transactions
- **Tags**: Wallets
- **Summary**: Get all transactions (Admin)
- **Parameters**:
  - `status` (query, Optional): Transaction Status (PENDING, APPROVE, REJECTED)
  - `page` (query, Optional): Page Number
  - `limit` (query, Optional): Items Per Page

### PUT /api/v1/wallets/admin/transactions/{transactionId}/approve
- **Tags**: Wallets
- **Summary**: Approve top-up (Admin)
- **Parameters**:
  - `transactionId` (path, Required): Transaction ID

### PUT /api/v1/wallets/admin/transactions/{transactionId}/reject
- **Tags**: Wallets
- **Summary**: Reject top-up (Admin)
- **Parameters**:
  - `transactionId` (path, Required): Transaction ID
  - `request` (body, Required): Rejection Reason

### GET /api/v1/wallets/{eventId}
- **Tags**: Wallets
- **Summary**: Get wallet info
- **Parameters**:
  - `eventId` (path, Required): Event ID

### GET /api/v1/wallets/{eventId}/logs
- **Tags**: Wallets
- **Summary**: Get transaction logs
- **Parameters**:
  - `eventId` (path, Required): Event ID

### POST /api/v1/wallets/{eventId}/topup
- **Tags**: Wallets
- **Summary**: Request wallet top-up
- **Parameters**:
  - `eventId` (path, Required): Event ID
  - `amount` (formData, Required): Top-up Amount
  - `coupon_code` (formData, Optional): Coupon Code
  - `proof` (formData, Required): Transfer Proof Image

## Definitions

### dto.ActiveEventResponse
- `event_logo_path`: string
- `event_name`: string
- `is_kick`: boolean
- `payment_status`: string
- `payment_type`: string
- `registration_id`: string
- `rejection_reason`: string
- `team_name`: string

### dto.AdminCreateRequest
- `email`: string
- `password`: string

### dto.AdminDashboardEORegistrationRes
- `email`: string
- `id`: string
- `name`: string
- `registered_at`: string

### dto.AdminDashboardRes
- `eo_registrations`: array
- `recent_transactions`: array
- `stats`: object

### dto.AdminDashboardStatValue
- `trend`: string
- `value`: number

### dto.AdminDashboardStats
- `pending_topups`: object
- `total_eo`: object
- `total_participants`: object
- `total_revenue`: object

### dto.AdminDashboardTransactionRes
- `amount`: number
- `amount_koin`: number
- `eo_name`: string
- `id`: string
- `status`: object
- `time_ago`: string

### dto.AdminEventLevelRes
- `dp_fee`: string
- `name`: string
- `regis_fee`: string

### dto.AdminEventRegistrationRes
- `assessment_status`: string
- `event_level_name`: string
- `event_name`: string
- `payment_status`: string

### dto.AdminEventRes
- `compe_date`: string
- `event_levels`: array
- `event_name`: string
- `location`: string
- `status`: string

### dto.AdminJudgeRes
- `name`: string

### dto.AdminStaffRes
- `name`: string
- `role`: string

### dto.AdminTeamMemberRes
- `name`: string
- `role`: string

### dto.AdminTeamRes
- `coach`: string
- `members`: array
- `members_count`: integer
- `team_name`: string

### dto.AdminTransactionPaginationResponse
- `limit`: integer
- `page`: integer
- `total`: integer
- `transactions`: array

### dto.AdminTransactionResponse
- `amount`: number
- `amount_koin`: number
- `created_at`: string
- `eo_name`: string
- `id`: string
- `proof_path`: string
- `rejection_reason`: string
- `status`: object

### dto.AdminUserDetailResponse
- `address`: string
- `email`: string
- `email_is_verified`: boolean
- `eo_data`: object
- `event`: object
- `id`: string
- `institution`: object
- `is_banned`: boolean
- `joined_at`: string
- `last_login_at`: string
- `name`: string
- `peserta_data`: object
- `phone`: string
- `role`: string
- `school_name`: string
- `status`: string

### dto.AdminUserEODetail
- `events`: array
- `judges`: array
- `panitia`: array

### dto.AdminUserPesertaDetail
- `event_history`: array
- `teams`: array

### dto.AssessmentCategoryDetail
- `category_name`: string
- `sub_categories`: array

### dto.AssessmentRecapResponse
- `categories`: array
- `final_score`: number
- `max_score`: number
- `total_score`: number
- `total_violation_points`: number
- `violations`: array

### dto.AssessmentSubCategoryDetail
- `name`: string
- `scores`: array

### dto.AssessmentViolationDetail
- `judge_name`: string
- `name`: string
- `point`: number

### dto.AwardRes
- `event_id`: string
- `event_level_ids`: array
- `id`: string
- `levels`: array
- `limit_rank`: integer
- `name`: string
- `score_categories`: array

### dto.BulkInsertScoresRequest
- `judges_id`: string
- `regis_id`: string
- `scores`: array

### dto.BulkInsertViolationsRequest
- `judges_id`: string
- `regis_id`: string
- `violation_type_ids`: array

### dto.CategoryScoreDetail
- `category_id`: string
- `category_name`: string
- `sub_categories`: array

### dto.CoinValue
- `coins`: number
- `value`: number

### dto.CreateAwardReq
- `event_level_ids`: array
- `limit_rank`: integer
- `name`: string
- `score_category_ids`: array

### dto.CreateJudgeReq
- `name`: string

### dto.CreateScoreCategoryReq
- `event_level_id`: string
- `name`: string

### dto.CreateScoreSubCategoryReq
- `grades`: object
- `max_score`: number
- `name`: string
- `score_categories_id`: string

### dto.CreateViolationTypeReq
- `event_level_id`: string
- `name`: string
- `point`: number

### dto.CustomLeaderboardRequest
- `score_category_ids`: array

### dto.EOActivityRes
- `event_name`: string
- `id`: string
- `status`: string
- `team_name`: string
- `time_ago`: string

### dto.EOProfileRes
- `email`: string

### dto.EOStaffCreateReq
- `confirm_password`: string
- `email`: string
- `password`: string

### dto.EOStaffRes
- `created_at`: string
- `email`: string
- `id`: string
- `status`: string

### dto.EOStaffResetPasswordReq
- `confirm_password`: string
- `password`: string

### dto.EOTeamApproveReq
- `payment_status`: object

### dto.EOTeamDetailRes
- `contact_email`: string
- `event_level`: string
- `institution`: string
- `institution_address`: string
- `is_kick`: boolean
- `logo_path`: string
- `members`: array
- `payment_proof_path`: string
- `payment_status`: object
- `pelatih`: string
- `rec_letter_path`: string
- `registration_id`: string
- `rejection_reason`: string
- `team_id`: string
- `team_name`: string

### dto.EOTeamListRes
- `assessment_status`: string
- `event_level`: string
- `institution`: string
- `institution_type`: string
- `logo_path`: string
- `payment_status`: object
- `registration_id`: string
- `team_id`: string
- `team_name`: string

### dto.EOTeamMemberRes
- `full_name`: string
- `id`: string
- `id_card_path`: string
- `photo_path`: string
- `role`: object

### dto.EOTeamRejectReq
- `rejection_reason`: string

### dto.EOTeamStatsRes
- `approved`: integer
- `paid_dp`: integer
- `paid_full`: integer
- `pending_approval`: integer
- `rejected`: integer
- `total_teams`: integer

### dto.EOUpdatePasswordReq
- `confirm_password`: string
- `new_password`: string
- `old_password`: string

### dto.EventCreate
- `bank_name`: string
- `bank_number`: string
- `close_date`: string
- `location`: string
- `nama_pj`: string
- `name`: string
- `no_wa_pj`: string
- `open_date`: string
- `organizer`: string
- `user_id`: string

### dto.EventLevelCreate
- `dp_fee`: string
- `event_id`: string
- `name`: string
- `regis_fee`: string

### dto.EventLevelResponse
- `dp_fee`: string
- `id`: string
- `name`: string
- `regis_fee`: string

### dto.EventLevelUpdate
- `dp_fee`: string
- `event_id`: string
- `id`: string
- `name`: string
- `regis_fee`: string

### dto.EventResponse
- `bank_name`: string
- `bank_number`: string
- `close_date`: string
- `compe_date`: string
- `description`: string
- `event_levels`: array
- `id`: string
- `location`: string
- `logo_path`: string
- `max_team_members`: integer
- `min_team_members`: integer
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string
- `open_date`: string
- `organizer`: string
- `poster_path`: string
- `registrations`: array
- `status`: string
- `user`: object
- `wa_group`: string

### dto.EventUpdate
- `bank_name`: string
- `bank_number`: string
- `close_date`: string
- `compe_date`: string
- `description`: string
- `id`: string
- `location`: string
- `max_team_members`: integer
- `min_team_members`: integer
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string
- `open_date`: string
- `organizer`: string
- `status`: string
- `user_id`: string
- `wa_group`: string

### dto.FinalizeAssessmentRequest
- `judges_id`: string
- `regis_id`: string
- `scores`: array
- `violation_type_ids`: array

### dto.HomeStatsResponse
- `total_events`: integer
- `total_organizers`: integer
- `total_participants`: integer
- `total_teams`: integer

### dto.InputScoreReq
- `judges_id`: string
- `regis_id`: string
- `score_value`: number
- `sub_category_id`: string

### dto.InstitutionProfileResponse
- `address`: string
- `institution_type`: string
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string

### dto.InstitutionResponse
- `address`: string
- `id`: string
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string
- `teams`: array
- `type`: object
- `users`: array

### dto.JudgeRes
- `event_id`: string
- `id`: string
- `name`: string

### dto.JudgeScoreDetail
- `judge_name`: string
- `value`: number

### dto.OpenEventLevelResponse
- `dp_fee`: string
- `id`: string
- `name`: string
- `regis_fee`: string

### dto.OpenEventResponse
- `bank_name`: string
- `bank_number`: string
- `close_date`: string
- `description`: string
- `id`: string
- `levels`: array
- `location`: string
- `logo_path`: string
- `max_team_members`: integer
- `min_team_members`: integer
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string
- `open_date`: string
- `organizer`: string
- `poster_path`: string
- `status`: string

### dto.OrganizerDashboardRes
- `recent_activities`: array
- `stats`: object
- `upcoming_events`: array

### dto.OrganizerStats
- `coin_balance`: object
- `revenue`: object
- `total_event`: object
- `total_team`: object

### dto.ParticipantActivity
- `description`: string
- `time`: string
- `title`: string

### dto.ParticipantDashboardRes
- `recent_activities`: array
- `stats`: object
- `upcoming_events`: array

### dto.ParticipantProfileResponse
- `email`: string
- `institution`: object

### dto.ParticipantStats
- `active_event`: integer
- `finished_event`: integer
- `pending_payment`: integer
- `total_team`: integer

### dto.ParticipantTeamMemberResponse
- `full_name`: string
- `id`: string
- `id_card_path`: string
- `photo_path`: string
- `role`: string

### dto.ParticipantTeamResponse
- `id`: string
- `institution_type`: string
- `logo_path`: string
- `members_count`: integer
- `name`: string
- `payment_status`: string
- `pelatih`: string

### dto.ParticipantUpcomingEventRes
- `date`: string
- `detail_url_id`: string
- `id`: string
- `registered_teams`: integer
- `status`: string
- `title`: string

### dto.PublishScoreboardRequest
- `is_score_published`: boolean

### dto.RegistrationDetailResponse
- `event`: object
- `event_level_id`: string
- `payment`: object
- `team`: object

### dto.RegistrationResponse
- `event_level`: object
- `event_level_id`: string
- `id`: string
- `is_kick`: boolean
- `payment_proof_path`: string
- `payment_status`: object
- `rejection_reason`: string
- `team`: object
- `team_id`: string

### dto.RejectTopUpRequest
- `rejection_reason`: string

### dto.ScoreCategoryRes
- `event_id`: string
- `event_level_id`: string
- `id`: string
- `name`: string
- `sub_categories`: array

### dto.ScoreInput
- `score_value`: number
- `sub_category_id`: string

### dto.ScoreRes
- `grade`: string
- `id`: string
- `judges_id`: string
- `regis_id`: string
- `score_value`: number
- `sub_category_id`: string

### dto.ScoreSubCategoryRes
- `grade_numbers`: object
- `grades`: object
- `id`: string
- `max_score`: number
- `name`: string
- `score_categories_id`: string

### dto.ScoreboardItem
- `final_score`: number
- `insti_name`: string
- `rank`: integer
- `regis_id`: string
- `team_name`: string
- `total_score`: number
- `total_violation_points`: number

### dto.ScoreboardResponse
- `event_level_id`: string
- `items`: array

### dto.StatValue
- `trend`: string
- `value`: number

### dto.SubCategoryScoreDetail
- `grade`: string
- `judge_name`: string
- `score_value`: number
- `sub_category_id`: string
- `sub_category_name`: string

### dto.SystemSettingResponse
- `approval_fee`: number
- `bank_info`: object
- `coin_rate`: number

### dto.TeamAssessmentDetailResponse
- `categories`: array
- `final_score`: number
- `insti_name`: string
- `regis_id`: string
- `team_name`: string
- `total_score`: number
- `total_violation`: number
- `violations`: array

### dto.TeamDetailResponse
- `id`: string
- `institution_type`: string
- `logo_path`: string
- `members_grouped`: object
- `name`: string
- `pelatih`: string
- `rec_letter_path`: string

### dto.TeamMemberResponse
- `full_name`: string
- `id`: string
- `id_card_path`: string
- `role`: object

### dto.TeamResponse
- `id`: string
- `logo_path`: string
- `name`: string
- `pelatih`: string
- `rec_letter_path`: string
- `team_members`: array

### dto.TeamViolationDetail
- `judge_name`: string
- `point`: number
- `violation_id`: string
- `violation_name`: string

### dto.UnifiedAssessmentRes
- `categories`: array
- `violations`: array

### dto.UpcomingEventRes
- `date`: string
- `id`: string
- `registered_teams`: integer
- `status`: string
- `title`: string

### dto.UpdateAwardReq
- `event_level_ids`: array
- `limit_rank`: integer
- `name`: string
- `score_category_ids`: array

### dto.UpdateEventStatusRequest
- `status`: string

### dto.UpdateInstitutionRequest
- `address`: string
- `institution_type`: string
- `name`: string
- `name_pj`: string
- `no_wa_pj`: string

### dto.UpdateJudgeReq
- `name`: string

### dto.UpdatePasswordRequest
- `confirm_password`: string
- `new_password`: string
- `old_password`: string

### dto.UpdateScoreCategoryReq
- `name`: string

### dto.UpdateScoreSubCategoryReq
- `grades`: object
- `max_score`: number
- `name`: string

### dto.UpdateSystemSettingRequest
- `account_name`: string
- `account_number`: string
- `approval_fee`: number
- `bank_name`: string
- `coin_rate`: number

### dto.UpdateViolationTypeReq
- `name`: string
- `point`: number

### dto.UserForgotPassword
- `email`: string

### dto.UserLogin
- `email`: string
- `password`: string

### dto.UserLoginResponse
- `email`: string
- `id`: string
- `parent_id`: string
- `role`: string
- `token`: string

### dto.UserRegister
- `confirm_password`: string
- `email`: string
- `password`: string

### dto.UserResetPassword
- `confirm_password`: string
- `password`: string

### dto.UserResponse
- `created_at`: string
- `email`: string
- `email_is_verified`: boolean
- `event`: object
- `id`: string
- `institution`: object
- `is_banned`: boolean
- `last_login_at`: string
- `name`: string
- `role`: string

### dto.ViolationTypeRes
- `event_id`: string
- `event_level_id`: string
- `id`: string
- `name`: string
- `point`: number

### dto.WalletResponse
- `event_id`: string
- `id`: string
- `pending_topup_count`: integer
- `saldo`: number
- `saldo_koin`: number
- `successful_topup_count`: integer

### dto.WalletTransactionResponse
- `amount`: number
- `amount_koin`: number
- `created_at`: string
- `id`: string
- `proof_path`: string
- `rejection_reason`: string
- `status`: object
- `type`: object
- `updated_at`: string
- `wallet_id`: string

### enums.InstitutionType

### enums.RegistrationStatus

### enums.TeamType

### enums.TransactionStatus

### enums.WalletType

### response.ErrorDetail
- `code`: string
- `details`: object
- `message`: string

### response.ErrorResponse
- `error`: object

### response.Response
- `code`: integer
- `data`: object
- `message`: string
- `status`: object

### response.Status

