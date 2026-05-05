# Design Spec: Multi-Level Awards (Predikat Juara)

**Date:** 2026-05-05  
**Topic:** Ranking System Refactor for Multi-Level Support  
**Status:** Validated (Approved by User)

---

## 1. Overview

Fitur **Predikat Juara** memungkinkan satu jenis penghargaan (award) mencakup beberapa jenjang kompetisi sekaligus (misal: "Juara Umum" yang diperebutkan bersama oleh jenjang SMP dan SMA). Sistem akan menggabungkan daftar tim dari jenjang-jenjang terpilih ke dalam satu _leaderboard_ gabungan berdasarkan kategori penilaian yang dipilih.

## 2. Data Model Changes

### 2.1 Schema Refactor (Frontend)

Update pada `src/schemas/ranking.schema.ts`:

- Ubah `event_level_id` (string) menjadi `event_level_ids` (array string).
- Update `AwardResSchema` untuk menangani array `levels`.

### 2.2 API Logic

- **Service (`ranking.service.ts`):** Update payload `createAward` dan `updateAward`.
- **Action (`ranking.actions.ts`):** Memastikan revalidasi cache berjalan dengan benar.

## 3. UI/UX Refactor

### 3.1 Ranking System Page (`ranking-system-client.tsx`)

- **Global List:** Menghapus filter tab jenjang pada daftar utama. Semua award ditampilkan dalam satu list besar.
- **Card Information:** Menambahkan label/badge jenjang pada setiap kartu award (misal: "Jenjang: SMP, SMA").
- **Modal Form:**
  - Ganti input Jenjang dari `Single Choice` menjadi `Multi-select` (Checkbox list).
  - **Dynamic Category Filtering:** Hanya menampilkan kategori penilaian yang tersedia di _semua_ jenjang yang dipilih untuk memastikan keadilan skor.

### 3.2 Score Recap Page (`score-recap/page.tsx`)

- Implementasi integrasi API (saat ini masih mock).
- Menambahkan logika peritungan gabungan untuk award yang memiliki lebih dari satu jenjang.

## 4. Requirement Dependencies

Fitur ini membutuhkan perubahan pada Backend (BE) sesuai dengan dokumen `docs/organizer-ranking-be-needs.md`.

---

**Spec Self-Review:**

- [x] No TBD.
- [x] Scope is focused on Multi-level ranking.
- [x] Clearly defined as "Leaderboard Gabungan".
- [x] UX strategy aligned with "Global Group" approach.
