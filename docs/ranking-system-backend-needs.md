# Backend Needs: Ranking System Configuration (Peringkat Juara)

Halaman **Ranking System** pada Organizer Dashboard membutuhkan API untuk mengelola konfigurasi juara yang nantinya akan digunakan oleh sistem untuk mengkalkulasi pemenang secara otomatis.

## 1. Data Model (Entity)

Dibutuhkan entitas baru, misalnya `EventAward` (atau `RankingConfig`), yang merepresentasikan satu jenis juara.

| Field              | Tipe          | Deskripsi                                                                |
| ------------------ | ------------- | ------------------------------------------------------------------------ |
| `id`               | UUID          | Primary Key                                                              |
| `event_id`         | UUID          | ID Event terkait                                                         |
| `event_level_id`   | UUID          | ID Jenjang/Tingkat terkait (SD, SMP, dll)                                |
| `name`             | String        | Nama Juara (contoh: "Juara Umum", "Juara Madya")                         |
| `limit_rank`       | Integer       | Jumlah pemenang yang diberikan (contoh: 3 untuk Juara 1, 2, 3)           |
| `score_categories` | Array of UUID | Daftar ID `ScoreCategory` yang nilainya akan dijumlahkan untuk juara ini |
| `created_at`       | Timestamp     | Waktu dibuat                                                             |
| `updated_at`       | Timestamp     | Waktu diperbarui                                                         |

## 2. API Endpoints (REST)

Dibutuhkan endpoint CRUD yang dilindungi middleware `AuthOrganizer` dan `ApiKey`.

### A. List Awards

- **Endpoint**: `GET /api/v1/eo/events/{eventId}/awards`
- **Query Params**: `event_level_id` (Optional)
- **Response**: Array of `EventAward` objects.

### B. Create Award

- **Endpoint**: `POST /api/v1/eo/events/{eventId}/awards`
- **Body**:
  ```json
  {
    "event_level_id": "uuid",
    "name": "Juara Umum",
    "limit_rank": 3,
    "score_category_ids": ["uuid-1", "uuid-2"]
  }
  ```

### C. Update Award

- **Endpoint**: `PUT /api/v1/eo/events/{eventId}/awards/{awardId}`
- **Body**: (Sama seperti POST)

### D. Delete Award

- **Endpoint**: `DELETE /api/v1/eo/events/{eventId}/awards/{awardId}`

---

## 3. Catatan Integrasi

Saat ini Frontend sedang dikembangkan menggunakan _Server Side Rendering_ (SSR). Data `EventLevels` dan `ScoreCategories` yang sudah ada di Backend sangat dibutuhkan sebagai referensi saat pembuatan `EventAward` di atas.
