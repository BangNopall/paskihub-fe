# Backend Updates for Participant Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update backend DTOs and services in `paskihub-be` to include missing fields required for the participant dashboard, specifically regarding event details, registration status, and team member counts.

**Architecture:** Modified Go DTOs to include new response fields and updated service implementations to populate these fields from existing entities.

**Tech Stack:** Go, GORM, GoFiber

---

### Task 1: Update Participant Event DTOs

**Files:**
- Modify: `domain/dto/participant_event_dto.go`

- [ ] **Step 1: Add new fields to `OpenEventResponse` and `ActiveEventResponse`**

```go
type OpenEventResponse struct {
	Id             string                   `json:"id"`
	Name           string                   `json:"name"`
	Description    string                   `json:"description"`
	LogoPath       string                   `json:"logo_path"`
	PosterPath     string                   `json:"poster_path"`
	Organizer      string                   `json:"organizer"`
	Status         string                   `json:"status"`
	OpenDate       string                   `json:"open_date"`
	CloseDate      string                   `json:"close_date"`
	Location       string                   `json:"location"`
	MinTeamMembers int                      `json:"min_team_members"`
	MaxTeamMembers int                      `json:"max_team_members"`
	Levels         []OpenEventLevelResponse `json:"levels"`
	BankName       string                   `json:"bank_name"`
	BankNumber     string                   `json:"bank_number"`
	NamePj         string                   `json:"name_pj"`
	NoWaPj         string                   `json:"no_wa_pj"`
}

type ActiveEventResponse struct {
	RegistrationId  string `json:"registration_id"`
	EventName       string `json:"event_name"`
	EventLogoPath   string `json:"event_logo_path"`
	TeamName        string `json:"team_name"`
	PaymentStatus   string `json:"payment_status"`
	PaymentType     string `json:"payment_type"`
	RejectionReason string `json:"rejection_reason"`
	IsKick          bool   `json:"is_kick"`
}
```

- [ ] **Step 2: Commit**

```bash
git add domain/dto/participant_event_dto.go
git commit -m "feat: add missing fields to participant event response DTOs"
```

### Task 2: Update Participant Event Service

**Files:**
- Modify: `internal/app/participant_event/service/participant_event_impl.go`

- [ ] **Step 1: Populate new fields in `GetOpenEvents` and `GetActiveEvents`**

In `GetOpenEvents`:
```go
		oev := dto.OpenEventResponse{
			Id:             ev.Id.String(),
			Name:           ev.Name,
			Description:    ev.Description,
			LogoPath:       ev.LogoPath,
			PosterPath:     ev.PosterPath,
			Organizer:      ev.Organizer,
			Status:         string(ev.Status),
			OpenDate:       ev.OpenDate.Format("2006-01-02"),
			CloseDate:      ev.CloseDate.Format("2006-01-02"),
			Location:       ev.Location,
			MinTeamMembers: ev.MinTeamMembers,
			MaxTeamMembers: ev.MaxTeamMembers,
			BankName:       ev.BankName,
			BankNumber:     ev.BankNumber,
			NamePj:         ev.NamePj,
			NoWaPj:         ev.NoWaPj,
		}
```

In `GetActiveEvents`:
```go
	for _, r := range registrations {
		res = append(res, dto.ActiveEventResponse{
			RegistrationId:  r.Id.String(),
			EventName:       r.EventLevel.Event.Name,
			EventLogoPath:   r.EventLevel.Event.LogoPath,
			TeamName:        r.Team.Name,
			PaymentStatus:   string(r.PaymentStatus),
			PaymentType:     r.PaymentType,
			RejectionReason: r.RejectionReason,
			IsKick:          r.IsKick,
		})
	}
```

- [ ] **Step 2: Commit**

```bash
git add internal/app/participant_event/service/participant_event_impl.go
git commit -m "feat: populate new fields in participant event service"
```

### Task 3: Update Participant Team DTO

**Files:**
- Modify: `domain/dto/participant_team_dto.go`

- [ ] **Step 1: Add `MembersCount` to `ParticipantTeamResponse`**

```go
type ParticipantTeamResponse struct {
	Id              string `json:"id"`
	Name            string `json:"name"`
	LogoPath        string `json:"logo_path"`
	Pelatih         string `json:"pelatih"`
	InstitutionType string `json:"institution_type"`
	PaymentStatus   string `json:"payment_status"`
	MembersCount    int    `json:"members_count"`
}
```

- [ ] **Step 2: Commit**

```bash
git add domain/dto/participant_team_dto.go
git commit -m "feat: add MembersCount to ParticipantTeamResponse DTO"
```

### Task 4: Update Participant Team Service

**Files:**
- Modify: `internal/app/participant_team/service/participant_team_impl.go`

- [ ] **Step 1: Populate `MembersCount` in `GetTeams`**

```go
		responses = append(responses, dto.ParticipantTeamResponse{
			Id:              t.Id.String(),
			Name:            t.Name,
			LogoPath:        t.LogoPath,
			Pelatih:         t.Pelatih,
			InstitutionType: string(t.Institution.InstitutionType),
			PaymentStatus:   paymentStatus,
			MembersCount:    len(t.TeamMembers),
		})
```

- [ ] **Step 2: Commit**

```bash
git add internal/app/participant_team/service/participant_team_impl.go
git commit -m "feat: populate MembersCount in participant team service"
```
