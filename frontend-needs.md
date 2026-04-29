# API Contract - Paskihub Frontend

Dokumen ini berisi daftar lengkap endpoint API yang dibutuhkan oleh frontend Paskihub, berdasarkan analisis struktur UI dan data mock yang ada.

## 1. Autentikasi & Akun

### Login
- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "email": "string",
    "password": "string",
    "rememberMe": "boolean"
  }
  ```
- **Expected Response:**
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "organizer | peserta | admin"
    }
  }
  ```

### Register (Dasar)
- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "organizer | peserta"
  }
  ```
- **Expected Response:** `201 Created`

### Lupa Password
- **Endpoint:** `/api/auth/forgot-password`
- **Method:** `POST`
- **Payload:** `{ "email": "string" }`
- **Expected Response:** `200 OK`

### Reset Password
- **Endpoint:** `/api/auth/reset-password`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Expected Response:** `200 OK`

---

## 2. Organizer (Penyelenggara)

### Dashboard Overview
- **Endpoint:** `/api/organizer/dashboard`
- **Method:** `GET`
- **Expected Response (OrganizerDashboardData):**
  ```json
  {
    "stats": {
      "totalEvent": { "value": 3, "trend": "string" },
      "totalTeam": { "value": 47, "trend": "string" },
      "coinBalance": { "value": 250000, "coins": 250 },
      "revenue": { "value": 35250000, "trend": "string" }
    },
    "recentActivities": [
      {
        "id": "string",
        "teamName": "string",
        "eventName": "string",
        "timeAgo": "string",
        "status": "Perlu Review | Selesai"
      }
    ],
    "upcomingEvents": [
      {
        "id": "string",
        "title": "string",
        "date": "string",
        "registeredTeams": 18,
        "status": "Buka Pendaftaran | Tutup | Sedang Berjalan"
      }
    ]
  }
  ```

### Detail Event (Get & Update)
- **Endpoint:** `/api/organizer/events/{id}`
- **Method:** `GET` | `PUT`
- **Payload (PUT - Multipart/FormData):**
  - `namaEvent`: string
  - `penyelenggara`: string
  - `email`: string
  - `deskripsi`: string
  - `bukaPendaftaran`: string (date)
  - `tutupPendaftaran`: string (date)
  - `pelaksanaanLomba`: string (date)
  - `lokasi`: string
  - `kuotaTim`: number
  - `minAnggota`: number
  - `maxAnggota`: number
  - `waPanitia`: string
  - `penanggungJawab`: string
  - `linkGrupWa`: string
  - `namaBank`: string
  - `atasNama`: string
  - `nomorRekening`: string
  - `logo`: File (optional)
  - `poster`: File (optional)
  - `categories`: JSON String of `EventCategory[]`
- **Expected Response (EventData):**
  ```json
  {
    "namaEvent": "string",
    "penyelenggara": "string",
    "email": "string",
    "deskripsi": "string",
    "bukaPendaftaran": "YYYY-MM-DD",
    "tutupPendaftaran": "YYYY-MM-DD",
    "pelaksanaanLomba": "YYYY-MM-DD",
    "lokasi": "string",
    "kuotaTim": 55,
    "minAnggota": 10,
    "maxAnggota": 25,
    "waPanitia": "string",
    "penanggungJawab": "string",
    "linkGrupWa": "string",
    "namaBank": "string",
    "atasNama": "string",
    "nomorRekening": "string",
    "logoUrl": "string",
    "posterUrl": "string",
    "categories": [
      {
        "id": "string",
        "name": "string",
        "totalQuota": 50,
        "registered": 32,
        "remaining": 18,
        "registrationFee": 150000,
        "downPayment": 75000
      }
    ]
  }
  ```

### Manajemen Juri
- **GET All:** `/api/organizer/juries`
- **POST Create:** `/api/organizer/juries` (Payload: `{ "name": "string" }`)
- **PUT Update:** `/api/organizer/juries/{id}` (Payload: `{ "name": "string" }`)
- **DELETE:** `/api/organizer/juries/{id}`
- **Expected Response (Jury):** `{ "id": "string", "name": "string" }`

### Manajemen Tim (Peserta di Event)
- **GET All Teams:** `/api/organizer/teams`
- **Approve Tim:** `POST /api/organizer/teams/{id}/approve`
- **Reject Tim:** `POST /api/organizer/teams/{id}/reject` (Payload: `{ "reason": "string" }`)
- **Kick Tim:** `DELETE /api/organizer/teams/{id}/kick`
- **Expected Response (TeamRecord):**
  ```json
  {
    "id": "string",
    "name": "string",
    "category": "string",
    "coachName": "string",
    "schoolName": "string",
    "status": "Approved | Pending | Rejected",
    "paymentType": "Lunas | DP",
    "logoUrl": "string",
    "recommendationLetterName": "string",
    "recommendationLetterUrl": "string",
    "members": {
      "pelatih": [], "danpas": [], "official": [], "pasukan": []
    }
  }
  ```

---

## 3. Peserta (Tim Lomba)

### Profil & Keamanan
- **GET Profile:** `/api/peserta/profile`
- **PUT Update Profile:** `/api/peserta/profile`
- **POST Change Password:** `/api/peserta/change-password`
- **Expected Response (ParticipantProfile):**
  ```json
  {
    "id": "string",
    "schoolName": "string",
    "schoolAddress": "string",
    "educationLevel": "SD | SMP | SMA | PURNA | UMUM",
    "picName": "string",
    "picPhone": "string",
    "email": "string"
  }
  ```

### Manajemen Tim Saya
- **GET All My Teams:** `/api/peserta/teams`
- **POST Create Team:** `/api/peserta/teams` (Multipart/FormData)
- **PUT Update Team:** `/api/peserta/teams/{id}` (Multipart/FormData)
- **DELETE Team:** `/api/peserta/teams/{id}`
- **Payload (Multipart/FormData):**
  - `name`: string
  - `category`: string
  - `coachName`: string
  - `logo`: File (optional)
  - `recommendationLetter`: File (optional)
  - `members`: JSON String of members data

### Dashboard & Event
- **GET Dashboard Stats:** `/api/peserta/dashboard`
- **GET All Available Events:** `/api/peserta/events`
- **GET Event Detail:** `/api/peserta/events/{id}`
- **Expected Response (PesertaDashboard):**
  ```json
  {
    "stats": {
      "totalTeam": 2,
      "activeEvent": 1,
      "finishedEvent": 0,
      "pendingPayment": 1
    },
    "recentActivities": [
      {
        "title": "string",
        "description": "string",
        "time": "string"
      }
    ]
  }
  ```

---

## 4. Admin

### Dashboard & Users
- **GET Users:** `/api/admin/users`
- **GET Admins:** `/api/admin/admins`
- **GET Transactions:** `/api/admin/transactions`
- **GET Settings:** `/api/admin/settings`

---

## 5. Struktur Global Error
Semua endpoint harus mengembalikan struktur error yang konsisten jika gagal:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "any"
  }
}
```
