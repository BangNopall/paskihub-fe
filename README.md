# PaskiHub Frontend

<div align="center">

**Platform digital untuk mengelola dan mengikuti lomba Paskibra dalam satu sistem terpusat.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Tech Stack](#-tech-stack)
- [Arsitektur Project](#-arsitektur-project)
- [Fitur Utama](#-fitur-utama)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Project](#-menjalankan-project)
- [Struktur Folder](#-struktur-folder)
- [Environment Variables](#-environment-variables)
- [Autentikasi & Otorisasi](#-autentikasi--otorisasi)
- [Konvensi Kode](#-konvensi-kode)
- [Testing](#-testing)
- [Scripts](#-scripts)

---

## 🚀 Tentang Project

**PaskiHub** adalah platform digital yang membantu **Event Organizer (EO)** dan **Peserta** mengelola serta mengikuti lomba Paskibra. Seluruh proses lomba — mulai dari pendaftaran tim, manajemen event, penilaian oleh juri, rekapitulasi skor, hingga pengumuman peringkat — dikelola dalam satu sistem yang terintegrasi, tertib, dan transparan.

Repositori ini merupakan **frontend** dari PaskiHub yang dibangun menggunakan **Next.js 16** dengan **App Router** dan **React Server Components (RSC)**.

---

## 🛠 Tech Stack

| Kategori           | Teknologi                                                    |
| ------------------ | ------------------------------------------------------------ |
| **Framework**      | Next.js 16 (App Router, Turbopack)                           |
| **Library UI**     | React 19, React DOM 19                                       |
| **Bahasa**         | TypeScript 5.9                                               |
| **Styling**        | Tailwind CSS 4, PostCSS                                      |
| **UI Components**  | shadcn/ui (Radix Luma style), Radix UI, Lucide React Icons   |
| **Animasi**        | Framer Motion 12                                             |
| **Form**           | React Hook Form + Zod (validation)                           |
| **Autentikasi**    | NextAuth.js 4 (Credentials Provider, JWT Strategy)           |
| **Data Table**     | TanStack React Table 8                                       |
| **Chart**          | Recharts 3                                                   |
| **Drag & Drop**    | dnd-kit                                                      |
| **Theming**        | next-themes                                                  |
| **Notifikasi**     | Sonner (toast)                                               |
| **Fonts**          | Poppins, Montserrat (local fonts)                            |
| **Icons**          | Lucide React, Iconify                                        |
| **Testing**        | Vitest 4                                                     |
| **Linting**        | ESLint 9, Prettier 3                                         |

---

## 🏗 Arsitektur Project

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                    Next.js 16 (App Router)                      │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Pages /   │  │  Middleware   │  │   React Server           │  │
│  │  Layouts   │  │  (Auth Guard) │  │   Components (RSC)       │  │
│  └─────┬─────┘  └──────┬───────┘  └────────────┬─────────────┘  │
│        │               │                        │                │
│  ┌─────▼───────────────▼────────────────────────▼─────────────┐  │
│  │              Server Actions (src/actions/)                  │  │
│  │         Typed API calls with Zod validation                 │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────────┐  │
│  │              Services Layer (src/services/)                 │  │
│  │    fetch() → Backend REST API (/api/v1/...) + x-api-key     │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
├────────────────────────────┼─────────────────────────────────────┤
│                            ▼                                     │
│                   PaskiHub Backend API                            │
└──────────────────────────────────────────────────────────────────┘
```

### Pola Arsitektur

- **Server Components (RSC)**: Halaman-halaman utama dirender di server untuk performa optimal.
- **Server Actions** (`src/actions/`): Menangani mutasi data (create, update, delete) dari client components.
- **Services Layer** (`src/services/`): Abstraksi HTTP request ke backend API dengan header autentikasi.
- **Schemas** (`src/schemas/`): Validasi data menggunakan **Zod** — memastikan type-safety antara frontend dan API.
- **Middleware**: Route protection berbasis role menggunakan NextAuth.js middleware.

---

## ✨ Fitur Utama

### 🏠 Halaman Publik
- Landing page dengan statistik platform (jumlah event, organizer, peserta, tim)
- Informasi tentang PaskiHub, layanan, dan kontak

### 🔐 Autentikasi
- Login dengan email & password (Credentials Provider)
- Register untuk role **Organizer** dan **Peserta**
- Forgot password & reset password via email
- Verifikasi email
- Session management berbasis JWT dengan auto-expire

### 📊 Dashboard Organizer (EO)
| Fitur                    | Deskripsi                                                        |
| ------------------------ | ---------------------------------------------------------------- |
| **Dashboard Overview**   | Statistik total event, tim terdaftar, saldo koin                 |
| **Manajemen Event**      | Buat, edit, kelola event lomba (Draft, Open, Closed, Archived)   |
| **Manajemen Tim**        | Review pendaftaran tim, approve/reject, kelola anggota tim       |
| **Tim EO**               | Kelola anggota tim panitia (sub-accounts)                        |
| **Form Penilaian**       | Buat dan atur form penilaian lomba                               |
| **Sistem Penilaian**     | Atur konfigurasi sistem penilaian                                |
| **Juri**                 | Kelola data juri yang akan menilai lomba                         |
| **Sistem Ranking**       | Konfigurasi dan lihat peringkat peserta                          |
| **Rekap Nilai**          | Lihat rekapitulasi nilai lomba secara detail                     |
| **Wallet / Koin**        | Kelola saldo koin untuk fitur premium                            |
| **Profil**               | Kelola profil organizer                                          |

### 👤 Dashboard Peserta
| Fitur                  | Deskripsi                                              |
| ---------------------- | ------------------------------------------------------ |
| **Dashboard Overview** | Statistik event diikuti, status tim                    |
| **Event Saya**         | Lihat event yang diikuti, detail event, status         |
| **Manajemen Tim**      | Lihat dan kelola tim yang terdaftar                    |
| **Profil**             | Kelola profil peserta                                  |

### 🛡 Dashboard Admin
| Fitur                  | Deskripsi                                              |
| ---------------------- | ------------------------------------------------------ |
| **Dashboard Overview** | Statistik platform keseluruhan                         |
| **Manajemen User**     | Kelola semua user (Organizer, Peserta)                 |
| **Manajemen Admin**    | Kelola akun admin                                      |
| **Transaksi**          | Monitor transaksi koin                                 |
| **Pengaturan Sistem**  | Konfigurasi pengaturan platform                        |

---

## 📦 Prasyarat

Pastikan software berikut sudah terinstal:

| Software     | Versi Minimum | Keterangan                   |
| ------------ | ------------- | ---------------------------- |
| **Node.js**  | 18.x          | Runtime JavaScript           |
| **npm**      | 9.x           | Package manager              |
| **Git**      | 2.x           | Version control              |

> **Catatan:** Project ini menggunakan backend API PaskiHub (`paskihub-be`) yang harus berjalan agar fitur berfungsi penuh. Secara default, frontend terhubung ke `http://localhost:3010`.

---

## ⚙ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/BangNopall/paskihub-fe.git
cd paskihub-fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.example-env` menjadi `.env` dan isi variabelnya:

```bash
cp .example-env .env
```

Edit file `.env` sesuai kebutuhan (lihat bagian [Environment Variables](#-environment-variables)).

### 4. Pastikan Backend API Berjalan

Pastikan `paskihub-be` sudah berjalan di `API_BASE_URL` yang dikonfigurasi (default: `http://localhost:3010`).

---

## ▶ Menjalankan Project

### Development Server (dengan Turbopack)

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` (default).

### Production Build

```bash
# Build dengan pengecekan format (untuk CI/CD)
npm run build:prod

# Build dengan auto-fix format (untuk lokal)
npm run build:local
```

### Start Production Server

```bash
npm start
```

---

## 📁 Struktur Folder

```
paskihub-fe/
├── public/                          # Aset statis (gambar, ikon, dll.)
│   ├── dashboard/                   # Gambar untuk dashboard
│   └── home/                        # Gambar untuk halaman utama
├── src/
│   ├── actions/                     # Server Actions (mutasi data)
│   │   ├── admin.actions.ts         # CRUD admin
│   │   ├── assessment.actions.ts    # Manajemen penilaian
│   │   ├── auth.actions.ts          # Autentikasi (register, logout, dll.)
│   │   ├── eo-team.actions.ts       # Manajemen tim EO
│   │   ├── event.actions.ts         # CRUD event
│   │   ├── judge.actions.ts         # Manajemen juri
│   │   ├── participant-event.actions.ts  # Event untuk peserta
│   │   ├── profile.actions.ts       # Update profil
│   │   ├── ranking.actions.ts       # Sistem ranking
│   │   ├── rekap.actions.ts         # Rekap nilai
│   │   ├── system-setting.actions.ts # Pengaturan sistem
│   │   ├── team.actions.ts          # Manajemen tim
│   │   └── wallet.actions.ts        # Transaksi wallet
│   ├── app/                         # App Router (halaman & layout)
│   │   ├── (home)/                  # Landing page (route group)
│   │   ├── admin/dashboard/         # Halaman admin
│   │   │   ├── admins/              # Manajemen admin
│   │   │   ├── settings/            # Pengaturan sistem
│   │   │   ├── transactions/        # Transaksi
│   │   │   └── users/               # Manajemen user
│   │   ├── api/                     # API routes (NextAuth, file upload)
│   │   ├── auth/                    # Halaman autentikasi
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-email/
│   │   ├── organizer/dashboard/     # Halaman organizer
│   │   │   ├── assessment-form/     # Form penilaian
│   │   │   ├── assessment-system/   # Sistem penilaian
│   │   │   ├── event/               # Manajemen event
│   │   │   ├── jury/                # Manajemen juri
│   │   │   ├── profile/             # Profil organizer
│   │   │   ├── ranking-system/      # Sistem ranking
│   │   │   ├── score-recap/         # Rekap nilai
│   │   │   ├── team/                # Manajemen tim
│   │   │   └── wallet/              # Wallet / koin
│   │   ├── peserta/dashboard/       # Halaman peserta
│   │   │   ├── event/               # Event peserta
│   │   │   ├── profile/             # Profil peserta
│   │   │   └── team/                # Tim peserta
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Root page (landing)
│   ├── components/                  # Komponen React
│   │   ├── admin/                   # Komponen khusus admin
│   │   ├── organizer/               # Komponen khusus organizer
│   │   ├── peserta/                 # Komponen khusus peserta
│   │   └── ui/                      # UI primitives (shadcn/ui) — 59 komponen
│   ├── hooks/                       # Custom React hooks
│   │   └── use-mobile.ts            # Hook deteksi perangkat mobile
│   ├── lib/                         # Utilitas & konfigurasi
│   │   ├── api-error.ts             # Custom ApiError class & parser
│   │   ├── auth.ts                  # Konfigurasi NextAuth.js
│   │   ├── constants.ts             # Konstanta (level lomba, status event)
│   │   ├── env.ts                   # Validasi environment variables
│   │   ├── file-validation.ts       # Validasi file upload
│   │   ├── fonts.ts                 # Konfigurasi font lokal
│   │   ├── team-form.ts             # Utilitas form tim
│   │   ├── team-status.ts           # Utilitas status tim
│   │   └── utils.ts                 # Utilitas umum (cn, dll.)
│   ├── middleware.ts                # Route protection & role-based access
│   ├── schemas/                     # Zod schemas (validasi & type inference)
│   │   ├── admin.schema.ts
│   │   ├── assessment.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── eo-team.schema.ts
│   │   ├── organizer-dashboard.schema.ts
│   │   ├── participant-dashboard.schema.ts
│   │   ├── participant-event.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── ranking.schema.ts
│   │   ├── rekap.schema.ts
│   │   ├── team.schema.ts
│   │   └── *.test.ts                # Unit tests untuk schemas
│   ├── services/                    # Service layer (HTTP ke backend API)
│   │   ├── admin.service.ts
│   │   ├── assessment.service.ts
│   │   ├── auth.service.ts
│   │   ├── eo-team.service.ts
│   │   ├── home-stats.service.ts
│   │   ├── judge.service.ts
│   │   ├── organizer-dashboard.service.ts
│   │   ├── participant-dashboard.service.ts
│   │   ├── participant-event.service.ts
│   │   ├── profile.service.ts
│   │   ├── ranking.service.ts
│   │   ├── rekap.service.ts
│   │   ├── system-setting.service.ts
│   │   ├── team.service.ts
│   │   └── wallet.service.ts
│   ├── styles/                      # Styling
│   │   ├── fonts/                   # File font lokal (Poppins, Montserrat)
│   │   └── globals.css              # Global CSS (Tailwind + custom variables)
│   └── types/                       # TypeScript type declarations
│       ├── css.d.ts                 # CSS module types
│       └── next-auth.d.ts           # NextAuth session/token type augmentation
├── .example-env                     # Template environment variables
├── .prettierrc                      # Konfigurasi Prettier
├── components.json                  # Konfigurasi shadcn/ui
├── eslint.config.mjs                # Konfigurasi ESLint (flat config)
├── next.config.mjs                  # Konfigurasi Next.js
├── package.json                     # Dependencies & scripts
├── postcss.config.mjs               # Konfigurasi PostCSS
├── tsconfig.json                    # Konfigurasi TypeScript
└── vitest.config.ts                 # Konfigurasi Vitest
```

---

## 🔑 Environment Variables

Buat file `.env` berdasarkan `.example-env`:

| Variable           | Required | Deskripsi                                         | Contoh                        |
| ------------------ | -------- | ------------------------------------------------- | ----------------------------- |
| `APP_URL`          | Ya       | URL publik aplikasi                               | `http://localhost:3000`       |
| `APP_PORT`         | Tidak    | Port aplikasi (default: 3000)                     | `3000`                        |
| `APP_NAME`         | Ya       | Nama aplikasi (digunakan di metadata & title)     | `PaskiHub`                    |
| `APP_DESCRIPTION`  | Tidak    | Deskripsi aplikasi untuk SEO                      | `Platform Lomba Paskibra`     |
| `NODE_ENV`         | Tidak    | Environment (development/production)              | `development`                 |
| `MAINTENANCE_MODE` | Tidak    | Aktifkan mode maintenance                         | `false`                       |
| `API_BASE_URL`     | Ya*      | URL backend API PaskiHub                          | `http://localhost:3010`       |
| `API_KEY`          | Ya       | API key untuk autentikasi ke backend              | `Key your-api-key-here`       |
| `NEXTAUTH_URL`     | Ya       | URL NextAuth (sama dengan APP_URL)                | `http://localhost:3000`       |
| `NEXTAUTH_SECRET`  | Ya       | Secret key untuk enkripsi JWT NextAuth            | `your-random-secret-string`   |

> **\*** `API_BASE_URL` wajib di production. Di development, default ke `http://localhost:3010`.

### Fail-Fast Validation

Aplikasi akan **langsung crash** saat startup jika variable wajib berikut tidak diset:
- `API_KEY`
- `NEXTAUTH_SECRET`
- `API_BASE_URL` (hanya di production)

---

## 🔐 Autentikasi & Otorisasi

### Mekanisme Autentikasi

1. **Provider**: NextAuth.js Credentials Provider
2. **Strategy**: JWT (JSON Web Token)
3. **Session Duration**: 1 jam (mengikuti token backend)
4. **Token Expired**: Otomatis redirect ke halaman login dengan pesan error

### Role-Based Access Control (RBAC)

Terdapat 3 role utama:

| Role          | Prefix Route         | Akses                                              |
| ------------- | -------------------- | --------------------------------------------------- |
| `ADMIN`       | `/admin/dashboard`   | Manajemen platform, user, transaksi, pengaturan     |
| `ORGANIZER`   | `/organizer/dashboard` | Manajemen event, tim, penilaian, juri, wallet      |
| `PESERTA`     | `/peserta/dashboard` | Lihat event, daftar tim, lihat hasil                |

### Middleware Protection

File `src/middleware.ts` menangani:
- ✅ Redirect user yang sudah login dari halaman auth ke dashboard sesuai role
- ✅ Proteksi route dashboard (membutuhkan login)
- ✅ Pencegahan cross-role access (organizer tidak bisa akses `/admin/*`, dll.)
- ✅ Penanganan session expired (hapus cookie & redirect ke login)

---

## 📐 Konvensi Kode

### Formatting (Prettier)

```json
{
  "endOfLine": "lf",
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

> **Catatan:** Tidak menggunakan semicolons, menggunakan double quotes.

### Linting (ESLint)

- Menggunakan ESLint flat config (`eslint.config.mjs`)
- Plugin: TypeScript-ESLint, React, Next.js, Prettier
- `no-console: warn` — hindari console.log di production
- `prefer-const: error` — wajib gunakan `const` jika variable tidak di-reassign

### Path Alias

```json
{
  "@/*": ["./src/*"]
}
```

Gunakan `@/` untuk import dari folder `src/`:
```typescript
import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"
```

### Pola Penamaan File

| Tipe File       | Pola                         | Contoh                     |
| --------------- | ---------------------------- | -------------------------- |
| Page            | `page.tsx`                   | `app/admin/dashboard/page.tsx` |
| Layout          | `layout.tsx`                 | `app/organizer/dashboard/layout.tsx` |
| Client Component| `*Client.tsx` / `client.tsx` | `MyEventClient.tsx`        |
| Server Action   | `*.actions.ts`               | `event.actions.ts`         |
| Service         | `*.service.ts`               | `team.service.ts`          |
| Schema          | `*.schema.ts`                | `auth.schema.ts`           |
| Test            | `*.test.ts`                  | `auth.schema.test.ts`      |

---

## 🧪 Testing

Project ini menggunakan **Vitest** untuk unit testing, terutama untuk validasi Zod schemas.

```bash
# Jalankan semua test
npm test

# Jalankan test dengan watch mode
npx vitest
```

File test berlokasi di folder yang sama dengan file yang di-test:
- `src/schemas/auth.schema.test.ts`
- `src/schemas/eo-team.schema.test.ts`
- `src/schemas/team.schema.test.ts`
- `src/lib/api-error.test.ts`
- `src/lib/team-form.test.ts`

---

## 📜 Scripts

| Script             | Perintah                 | Deskripsi                                          |
| ------------------ | ------------------------ | -------------------------------------------------- |
| `npm run dev`      | `next dev --turbopack`   | Jalankan development server dengan Turbopack       |
| `npm run build:prod` | `prettier --check . && next build` | Build production (gagal jika format salah)  |
| `npm run build:local` | `prettier --write . && next build` | Build lokal (auto-fix format)            |
| `npm run lint`     | `eslint ./src ...`       | Cek linting (zero warnings tolerance)              |
| `npm run format`   | `prettier --check .`     | Cek format kode                                    |
| `npm run format:fix` | `prettier --write .`   | Auto-fix format kode                               |
| `npm start`        | `next start`             | Jalankan production server                         |
| `npm run typecheck`| `tsc --noEmit`           | Cek TypeScript tanpa build                         |
| `npm test`         | `vitest run`             | Jalankan unit tests                                |

---

## 🤝 Kontribusi

1. Buat branch baru dari `main`
2. Pastikan kode lolos linting: `npm run lint`
3. Pastikan format kode benar: `npm run format`
4. Pastikan TypeScript valid: `npm run typecheck`
5. Jalankan test: `npm test`
6. Buat Pull Request

---

## 📄 Lisensi

Private — Hak Cipta Dilindungi.
