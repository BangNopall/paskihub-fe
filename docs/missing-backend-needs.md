# Missing Backend Needs for Assessment Form Integration

Berikut adalah beberapa kebutuhan di frontend yang saat ini belum terakomodasi sepenuhnya di backend (berdasarkan analisis Swagger dan source code BE):

## 1. Status Penilaian "Sedang Dinilai" (In Progress)

Saat ini, `EOTeamListRes.assessment_status` hanya bernilai `PENDING` (jika belum ada skor) atau `COMPLETED` (jika sudah ada skor).
Frontend membutuhkan status **"Sedang Dinilai"** agar penyelenggara tahu tim mana yang sedang dalam proses input namun belum difinalisasi.

**Kebutuhan:**

- Tambahkan enum `IN_PROGRESS` pada status penilaian di backend.
- Tambahkan endpoint (misal: `PUT /api/v1/eo/events/{eventId}/teams/{registrationId}/start-assessment`) untuk mengubah status menjadi `IN_PROGRESS`.
- Atau, otomatis ubah status menjadi `IN_PROGRESS` saat salah satu juri mulai mengisi form (jika memungkinkan).

## 2. Normalisasi Format Range Nilai (Grades)

Backend saat ini mengembalikan field `Grades` dalam format `map[string][]string` (contoh: `{"Kurang": ["6-8"], "Cukup": ["9-11"]}`).
Frontend membutuhkan data ini dalam bentuk array angka untuk mempermudah rendering tombol pilihan nilai (misal: `[6, 7, 8]`).

**Saran Perubahan DTO:**
Ubah `ScoreSubCategoryRes.Grades` agar mengembalikan list angka eksplisit atau pastikan frontend memiliki parser yang konsisten jika format string tetap digunakan.

## 3. Gabungan Endpoint Bulk Submission

Frontend mengirimkan Penilaian (Skor) dan Pelanggaran dalam satu aksi "Simpan Final". Saat ini backend memiliki dua endpoint terpisah:

- `POST /api/v1/assessment/scores/bulk`
- `POST /api/v1/assessment/violations/bulk`

**Kebutuhan (Opsional tapi Disarankan):**
Sebuah endpoint "Finalize Assessment" yang menerima baik skor maupun pelanggaran dalam satu payload untuk menjaga integritas data dan konsistensi status tim menjadi `COMPLETED`.

## 4. Mapping Fields Identitas Tim

Di halaman Detail Form Penilaian, frontend membutuhkan informasi ringkas tim:

- `team_name`
- `institution` (schoolName)
- `event_level` (category)

Ini sudah ada di `GET /api/v1/eo/events/{eventId}/teams/{registrationId}`, namun pastikan endpoint ini mengembalikan data yang lengkap (termasuk logo) agar UI tidak kosong.
