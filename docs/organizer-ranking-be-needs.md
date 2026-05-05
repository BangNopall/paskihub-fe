# Kebutuhan Backend: Sistem Juara Multi-Jenjang (Predikat Juara)

Untuk mendukung fitur "Predikat Juara" di mana satu jenis juara bisa mencakup beberapa jenjang sekaligus (misal: Juara Umum SMP & SMA), diperlukan perubahan pada modul `assessment` (Event Awards).

## 1. Perubahan Entitas (`domain/entity/assessment.go`)

Ubah struct `EventAward` untuk mendukung relasi Many-to-Many ke `EventLevel`.

```go
type EventAward struct {
    ID              uuid.UUID       `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    EventID         uuid.UUID       `gorm:"type:uuid;not null"`
    Name            string          `gorm:"type:varchar(255);not null"`
    LimitRank       int             `gorm:"not null;default:1"`
    CreatedAt       time.Time
    UpdatedAt       time.Time

    // Relasi Baru
    Event           Event           `gorm:"foreignKey:EventID;references:Id"`
    // Many-to-Many ke Jenjang (Levels)
    EventLevels     []EventLevel    `gorm:"many2many:event_award_levels;"`
    // Many-to-Many ke Kategori Nilai
    ScoreCategories []ScoreCategory `gorm:"many2many:event_award_score_categories;"`
}
```

## 2. Perubahan DTO (`domain/dto/assessment_dto.go`)

Update request payload untuk menerima array ID jenjang.

```go
type CreateAwardReq struct {
    EventLevelIDs    []uuid.UUID `json:"event_level_ids" validate:"required,min=1"`
    Name             string      `json:"name" validate:"required"`
    LimitRank        int         `json:"limit_rank" validate:"required,min=1"`
    ScoreCategoryIDs []uuid.UUID `json:"score_category_ids" validate:"required,min=1"`
}

type AwardRes struct {
    ID               uuid.UUID          `json:"id"`
    EventID          uuid.UUID          `json:"event_id"`
    EventLevelIDs    []uuid.UUID        `json:"event_level_ids"` // List ID Jenjang
    Levels           []EventLevelRes    `json:"levels"`          // Detail Jenjang untuk Label UI
    Name             string             `json:"name"`
    LimitRank        int                `json:"limit_rank"`
    ScoreCategories  []ScoreCategoryRes `json:"score_categories"`
}
```

## 3. Logika Repositori & Service

- **Repository:** `UpdateAward` harus menggunakan `Association.Replace` untuk `EventLevels` dan `ScoreCategories`.
- **Service:** Pastikan semua `ScoreCategoryIDs` yang dikirim dalam request memang ada di dalam daftar `EventLevelIDs` yang dipilih untuk menjaga keadilan standar nilai.

## 4. Endpoint Baru/Update

`GET /api/v1/eo/events/:eventId/awards`
Response harus mengembalikan semua award milik event tersebut tanpa perlu filter `level_id` (karena sekarang bersifat global).
