# Kebutuhan API Juri (Organizer)

Untuk meningkatkan fungsionalitas pengelolaan juri di Paskihub, berikut adalah rekomendasi penambahan field pada DTO Juri:

## 1. Penambahan Field pada `dto.JuryRequest` & `dto.JuryRes`

Saat ini hanya ada `name`. Disarankan menambah:

- `email` (string, required): Dibutuhkan agar juri bisa memiliki akun akses sendiri ke sistem penilaian.
- `phone_number` (string, optional): Untuk koordinasi panitia dengan juri.
- `institution` (string, optional): Asal instansi juri.

## 2. Endpoint Validasi

- `GET /api/v1/organizer/juries/check-email?email=...`: Untuk mengecek apakah email juri sudah terdaftar di sistem agar tidak terjadi duplikasi.

## 3. Response Structure

Pastikan `GET /api/v1/organizer/juries` mengembalikan array objek dengan struktur:

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-string",
      "name": "Nama Juri",
      "email": "juri@example.com",
      "phone_number": "0812...",
      "created_at": "timestamp"
    }
  ]
}
```
