# Design Spec: Admin User Management Enhancements

**Date:** 2026-05-07
**Topic:** Enhanced User Details and Event Management for Admin
**Status:** Draft

---

## 1. Overview
Halaman Manajemen User pada dashboard Admin memerlukan pembaruan untuk memberikan visibilitas yang lebih dalam terhadap data relasional user. Admin juga memerlukan kemampuan untuk mengelola status event milik Organizer secara langsung. Selain itu, daftar user harus dibersihkan dari role "ADMIN" untuk menjaga fokus manajemen pada "ORGANIZER" dan "PESERTA".

## 2. Requirements

### 2.1 User Filtering
- Sembunyikan semua user dengan role `ADMIN` dari tabel daftar user.
- Admin hanya dapat melihat dan mengelola user dengan role `ORGANIZER` dan `PESERTA`.

### 2.2 Role-Specific Details
- **ORGANIZER**:
    - Menampilkan detail data event yang dibuat.
    - Menampilkan detail level di setiap event (Nama, Biaya Pendaftaran, Biaya DP).
    - Fitur merubah status event secara spesifik (DRAFT, OPEN, CLOSED, ARCHIVED).
- **PESERTA**:
    - Menampilkan detail profil instansi (Nama, Alamat, PJ, No WA).
    - Menampilkan daftar tim yang dibuat beserta detail anggota (Nama & Role).
    - Menampilkan riwayat pendaftaran event (Nama Event, Level, Status Pembayaran, Status Penilaian).

## 3. Architecture Changes

### 3.1 Backend (`paskihub-be`)
Menambahkan endpoint khusus Admin untuk pembaruan status event.

*   **Repository (`internal/app/event/repository/event_repository.go`)**:
    - Menambahkan `UpdateStatus(ctx, eventId, status)` untuk update kolom status saja.
*   **Service (`internal/app/event/service/event_service.go`)**:
    - Menambahkan `UpdateEventStatusByAdmin(ctx, eventId, status)`.
*   **Controller (`internal/app/user/controller/user_controller.go`)**:
    - Menambahkan route: `PUT /api/v1/admin/events/:eventId/status` (Protected by `AuthAdmin`).

### 3.2 Frontend (`paskihub-fe`)

*   **Schema (`src/schemas/admin.schema.ts`)**:
    - Memperluas `UserResponseSchema` dan menambahkan schema baru untuk `EOData`, `PesertaData`, `Team`, `Member`, dan `EventHistory` guna mendukung data relasional yang mendalam.
*   **Service (`src/services/admin.service.ts`)**:
    - Menambahkan method `updateEventStatus(eventId, status)`.
*   **Actions (`src/actions/admin.actions.ts`)**:
    - Menambahkan `updateEventStatusAction(eventId, status)` dengan `revalidatePath`.
*   **UI Component (`src/components/admin/user-management-client.tsx`)**:
    - Implementasi filter `user.role !== "ADMIN"`.
    - Peningkatan visual Modal Detail dengan Tabs yang lebih informatif.
    - Implementasi Dropdown/Select untuk merubah status event pada list event Organizer.

## 4. API Changes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/v1/admin/events/:eventId/status` | Update status event oleh Admin |

Request Body:
```json
{
  "status": "OPEN"
}
```

## 5. UI/UX Enhancements
- **Organizer View**: Menggunakan kartu event yang ringkas. Status event ditampilkan dengan Select component yang mencolok.
- **Participant View**:
    - Tab Profil: Layout form-like read-only yang bersih.
    - Tab Tim: Menggunakan Accordion untuk menghemat ruang saat daftar tim banyak.
    - Tab Riwayat: Tabel dengan badge status pendaftaran.

## 6. Self-Review Check
- [x] Sesuai dengan Opsi B (Perubahan status per event).
- [x] Admin disembunyikan dari list.
- [x] Data relasional (Level, Anggota Tim, Riwayat) tercakup.
- [x] Mengikuti arsitektur server-first dengan Server Actions.
