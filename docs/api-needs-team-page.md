# Kebutuhan API untuk Halaman Daftar Tim (Organizer)

Berdasarkan implementasi terbaru pada halaman Dashboard Organizer - Daftar Tim, terdapat beberapa field yang dibutuhkan di response API agar fitur frontend dapat berjalan sesuai desain UI/UX.

## Endpoint: `GET /api/v1/eo/events/{eventId}/teams`

Mohon ditambahkan field berikut pada objek di dalam array `data`:

| Field               | Tipe Data | Deskripsi                                                                                                            | Status Saat Ini              |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| `institution_type`  | `string`  | Kategori institusi (contoh: `SD`, `SMP`, `SMA`, `UMUM`, `PURNA`). Digunakan untuk filter tab di frontend.            | **Selesai (Sudah Tersedia)** |
| `assessment_status` | `string`  | Status penilaian tim (contoh: `PENDING`, `COMPLETED`). Digunakan untuk badge "Selesai Dinilai" atau "Belum Dinilai". | **Selesai (Sudah Tersedia)** |

## Catatan Tambahan

- **Filter Query:** Jika memungkinkan, mohon support query parameter `institution_type` pada endpoint tersebut untuk optimasi filtering di sisi backend.
- **Stats Accuracy:** Pastikan `GET /api/v1/eo/events/{eventId}/teams/stats` menghitung data berdasarkan status terbaru (termasuk tim yang baru di-approve).

---

_Dokumen ini dibuat secara otomatis oleh Gemini CLI untuk sinkronisasi FE-BE._
