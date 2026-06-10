# Laporan QA Frontend PaskiHub

Tanggal audit: 7 Juni 2026  
Project: `paskihub-fe`  
Branch/commit: `main` / `c2cf310`

## Ringkasan Eksekutif

Status QA: **belum siap production**.

Frontend dapat dikompilasi dan halaman publik utama berhasil dirender pada desktop
serta mobile. Proteksi route tanpa sesi juga bekerja untuk dashboard `ADMIN`,
`ORGANIZER`, dan `PESERTA`.

Namun, ada beberapa blocker dan risiko production:

1. Wallet menampilkan rekening transfer hardcoded ketika backend settings gagal.
2. Release gate `build:prod`, lint, dan format belum lulus.
3. Upload menerima request hingga 500 MB tanpa validasi server-side yang konsisten.
4. `npm audit --omit=dev` melaporkan 10 vulnerability production.
5. Contoh environment tidak mendokumentasikan nama variable backend yang benar.
6. Tidak ada automated test suite untuk alur bisnis tiga role.

## Scope dan Metode

Audit mencakup:

- Struktur App Router dan route publik/protected.
- Auth.js session, expiry, middleware, dan role redirect.
- Server Actions, service backend, Zod schema, dan error handling.
- Form, upload, wallet, transaksi, event, team, assessment, dan ranking.
- TypeScript, ESLint, Prettier, production build, dan dependency audit.
- Smoke test runtime desktop `1280x720` dan mobile `390x844`.
- Validasi aksesibilitas dasar, navigasi, console warning, dan responsive overflow.

Audit tidak melakukan perubahan kode aplikasi. Pengujian mutasi authenticated
end-to-end tidak dilakukan karena tidak tersedia akun/fixture QA untuk ketiga role.

## Hasil Verification Gate

| Pemeriksaan                    | Hasil         | Catatan                                              |
| ------------------------------ | ------------- | ---------------------------------------------------- |
| `npm run typecheck`            | PASS          | `tsc --noEmit` selesai tanpa error                   |
| `npm run lint`                 | FAIL          | 264 masalah: 41 error, 223 warning                   |
| `npm run format`               | FAIL          | `src/components/ui/navbar.tsx` belum sesuai Prettier |
| `npm run build:prod`           | FAIL          | Berhenti pada Prettier check                         |
| `npm exec next build`          | PASS          | Compile, TypeScript, dan generate 28 page berhasil   |
| `npm audit --omit=dev`         | FAIL          | 2 high, 8 moderate                                   |
| Automated unit/integration/e2e | NOT AVAILABLE | Tidak ada test runner/config/test file executable    |

Distribusi lint error utama:

- 17 `react-hooks/error-boundaries`
- 10 `react-hooks/set-state-in-effect`
- 10 `react-hooks/preserve-manual-memoization`
- 2 `react-hooks/purity`
- 1 `prefer-const`
- 1 unused ESLint disable directive

## Temuan Prioritas

### QA-001 - Critical - Rekening Transfer Palsu Ditampilkan Saat Backend Gagal

**Bukti**

- `src/services/wallet.service.ts:33-59` menangkap semua kegagalan settings lalu
  mengembalikan identitas dan nomor rekening placeholder yang hardcoded.
- `src/app/organizer/dashboard/wallet/page.tsx:61-68` meneruskan fallback tersebut
  sebagai data normal.
- `src/components/organizer/wallet-topup-form.tsx:187-223` meminta pengguna
  mentransfer uang ke rekening yang ditampilkan.

**Dampak**

Ketika backend timeout, API key salah, schema berubah, atau endpoint down, pengguna
tetap melihat instruksi transfer yang tampak valid. Ini dapat menyebabkan transfer
uang ke rekening yang salah dan merupakan risiko finansial langsung.

**Rekomendasi**

Fail closed: jangan render form top-up atau instruksi transfer ketika settings tidak
terverifikasi. Tampilkan error state yang jelas dan minta pengguna mencoba kembali.

### QA-002 - High - Release Gate Production Gagal

**Bukti**

- `npm run build:prod` gagal pada Prettier check.
- `npm run lint` gagal dengan 41 error dan 223 warning.
- Error aplikasi tersebar pada verify email, assessment, jury, profile, ranking,
  score recap, team form, chart, dan hook mobile.

**Dampak**

Pipeline yang menjalankan script repository tidak dapat merilis build. Sebagian lint
error juga menandai cascading render, impure render, dan error boundary yang tidak
bekerja sesuai asumsi.

**Rekomendasi**

Jadikan `typecheck`, `lint`, `format`, dan `build:prod` sebagai required CI checks.
Pisahkan error aplikasi dari issue komponen UI generated, lalu selesaikan berdasarkan
risiko runtime.

### QA-003 - High - Batas Upload 500 MB dan Validasi Hanya di Client

**Bukti**

- `next.config.mjs:11-15` mengatur Server Actions dan proxy body menjadi 500 MB.
- `src/actions/event.actions.ts:24-56` hanya memastikan object file tersedia.
- `src/actions/participant-event.actions.ts:8-41` dan
  `src/actions/wallet.actions.ts:8-31` meneruskan `FormData` tanpa validasi size/type.
- Team create/edit juga tidak memvalidasi file pada Server Action.
- Beberapa UI hanya memakai `accept`, yang dapat dilewati.
- Pesan wallet menyebut maksimal 5 MB, tetapi kode membatasi 10 MB
  (`src/components/organizer/wallet-topup-form.tsx:88-95`).

**Dampak**

Authenticated client dapat mengirim file sangat besar atau tipe yang tidak diizinkan
langsung ke Server Action. Risiko meliputi memory pressure, bandwidth exhaustion,
timeout, storage abuse, dan UX yang inkonsisten.

**Rekomendasi**

Turunkan limit global ke kebutuhan terbesar yang nyata. Validasi `File.size`,
`File.type`, extension, jumlah file, dan field payload di Server Action sebelum
meneruskan ke backend. Backend tetap harus melakukan validasi independen.

### QA-004 - High - Dependency Production Memiliki Vulnerability

**Bukti**

`npm audit --omit=dev` melaporkan:

- 10 vulnerability total.
- 2 high dan 8 moderate.
- `next@16.1.7` ditandai high dan direct dependency.
- `next-auth@4.24.13` ditandai moderate dan direct dependency.

**Dampak**

Risiko aktual bergantung pada advisory dan fitur yang digunakan, tetapi dependency
framework/auth yang direct harus dianggap release concern.

**Rekomendasi**

Review advisory satu per satu, upgrade ke patch yang kompatibel, lalu ulangi audit,
build, dan regression test auth. Jangan memakai saran major downgrade otomatis untuk
NextAuth tanpa analisis kompatibilitas.

### QA-005 - High - Contoh Environment Salah dan Dapat Mengarah ke Localhost

**Bukti**

- `.example-env:8` mendokumentasikan `API_URL`.
- Seluruh integrasi server memakai `process.env.API_BASE_URL`.
- Ada 18 module yang fallback ke `http://localhost:3010` ketika variable tidak ada.

**Dampak**

Deployment baru yang mengikuti `.example-env` dapat diam-diam mencoba mengakses
localhost container/server, menyebabkan login dan seluruh integrasi backend gagal.
Fallback menyamarkan konfigurasi production yang hilang.

**Rekomendasi**

Samakan dokumentasi ke `API_BASE_URL`. Pada production, validasi environment saat
startup/build dan fail fast ketika variable wajib tidak tersedia.

### QA-006 - Medium - Boundary Otorisasi Frontend Tidak Fail Closed

**Bukti**

- `src/schemas/auth.schema.ts:40-47` menerima role sebagai string bebas.
- `src/middleware.ts:30-74` hanya menangani tiga string role yang dikenal.
- Role tidak dikenal tidak masuk cabang penolakan cross-role.
- Sebagian besar Server Action hanya memeriksa keberadaan session/token, bukan role.
- Action menerima `eventId`, `registrationId`, `userId`, dan resource ID dari client.

**Dampak**

Frontend bergantung penuh pada backend untuk role dan ownership enforcement. Jika
backend endpoint lemah atau token mengandung role tak dikenal, UI layer tidak fail
closed. Ini bukan bukti bypass backend, tetapi merupakan defense-in-depth gap.

**Rekomendasi**

Gunakan enum role pada schema, tolak role tak dikenal, dan verifikasi role pada setiap
Server Action sensitif. Backend tetap harus memvalidasi role serta ownership resource.

### QA-007 - Medium - Error Backend dan Schema Drift Disamarkan Sebagai Data Kosong

**Bukti**

- `team.service.ts` mengubah HTTP/schema failure menjadi `[]` atau `null`.
- `participant-event.service.ts` mengubah beberapa HTTP failure menjadi `[]`/`null`.
- `admin.service.ts` mengubah Zod parse failure menjadi list kosong.
- `wallet.service.ts` mengubah failure wallet/log menjadi `null`/`[]`.
- `profile.service.ts:17` mengubah failure event menjadi `[]`.

**Dampak**

Pengguna dapat melihat “belum ada data”, diarahkan ke onboarding, atau menganggap
resource hilang ketika masalah sebenarnya adalah backend down, unauthorized, atau
response contract berubah. Diagnosis production menjadi sulit.

**Rekomendasi**

Bedakan empty state sah dari unavailable/unauthorized/schema error. Gunakan typed
service error dan route-level error UI; log server secara terstruktur tanpa data
sensitif.

### QA-008 - Medium - Tidak Ada Automated Test Suite

**Bukti**

- Tidak ada Jest, Vitest, Playwright, atau test script pada `package.json`.
- Tidak ditemukan `*.test.*`, `*.spec.*`, atau e2e config.
- `home-stats.schema.type-test.ts` hanya diperiksa oleh TypeScript; pemanggilan
  `.parse()` di dalamnya tidak dieksekusi oleh `tsc --noEmit` dan bukan assertion dari
  test runner.

**Dampak**

Regression auth, role redirect, form validation, upload, wallet, assessment, dan
transaksi hanya terdeteksi manual atau setelah production.

**Rekomendasi**

Prioritaskan:

1. Unit test schema dan utility.
2. Integration test Server Action/service dengan mocked backend.
3. E2E smoke test per role untuk login, redirect, dashboard, dan satu mutation utama.
4. Negative test upload, expired session, forbidden ownership, dan malformed response.

### QA-009 - Medium - Tidak Ada Route Loading/Error Boundary

**Bukti**

Tidak ditemukan `loading.tsx`, `error.tsx`, `global-error.tsx`, atau route-specific
`not-found.tsx` di `src/app`.

**Dampak**

Request dashboard yang lambat tidak punya loading state konsisten. Zod parse error,
network exception, atau render error bergantung pada fallback framework dan dapat
menampilkan pengalaman error generik.

**Rekomendasi**

Tambahkan boundary per area `admin`, `organizer`, dan `peserta`, terutama route yang
melakukan beberapa backend request.

### QA-010 - Medium - Data Transaksi Dicetak ke Server Log

**Bukti**

- `src/app/admin/dashboard/transactions/page.tsx:20-21` menjalankan
  `console.log(initialData)`.
- Object transaksi berisi nama EO, nominal, jumlah koin, status, proof path, alasan
  penolakan, dan waktu.

**Dampak**

Data bisnis/finansial masuk ke log deployment dan dapat terbaca oleh pihak dengan
akses observability yang lebih luas daripada akses admin aplikasi.

**Rekomendasi**

Hapus log payload. Jika perlu observability, log event metadata minimum seperti status,
duration, request ID, dan jumlah record.

### QA-011 - Medium - Kontrak Zod Belum Konsisten pada Action dan Service

**Bukti**

- Hanya sebagian kecil Server Action yang memanggil schema `.parse()`.
- Assessment dan event action banyak memakai `any`.
- Banyak service mutation mengembalikan raw `res.json()`.
- Admin user detail dan wallet response tidak divalidasi dengan Zod.
- ESLint secara eksplisit mematikan `@typescript-eslint/no-explicit-any`.

**Dampak**

TypeScript memberi rasa aman palsu pada boundary network. Perubahan backend dapat
masuk ke UI sebagai shape tidak valid dan gagal jauh dari sumber masalah.

**Rekomendasi**

Validasi input di Server Action dan response di service. Gunakan `z.infer` dan typed
result union, lalu aktifkan kembali larangan `any` secara bertahap.

### QA-012 - Medium - Aksesibilitas Dasar Belum Memadai

**Bukti runtime**

- `<html lang="en">` walau konten utama berbahasa Indonesia.
- Halaman home dan login tidak memiliki `<h1>`.
- Hero “PaskiHub” dirender sebagai elemen non-heading.
- Setelah submit login kosong, pesan error tampil tetapi input tidak memiliki
  `aria-invalid`/`aria-describedby`.
- Checkbox “Ingat saya” menghasilkan control visual dan hidden checkbox; hidden input
  tidak memiliki accessible name.
- Pilihan top-up berupa `<div onClick>` tanpa semantics button/keyboard.

**Dampak**

Navigasi screen reader, pemahaman bahasa, pengumuman error, dan penggunaan keyboard
menjadi kurang andal.

**Rekomendasi**

Gunakan `lang="id"`, heading hierarchy yang benar, relasikan error ke field, dan ubah
card interaktif menjadi button/radio yang dapat difokuskan.

### QA-013 - Low - “Ingat Saya” Tidak Memiliki Efek

**Bukti**

`src/app/auth/login/page.tsx:144-153` merender checkbox tanpa state, registration,
atau pengaruh terhadap konfigurasi session. Session tetap `maxAge: 3600` pada
`src/lib/auth.ts:113-116`.

**Dampak**

UI menjanjikan persistence yang tidak dijalankan dan dapat membingungkan pengguna.

**Rekomendasi**

Implementasikan behavior yang jelas atau hapus opsi tersebut.

### QA-014 - Low - Link Placeholder dan CTA Tidak Berfungsi

**Bukti**

- CTA WhatsApp home memakai `href="#"`.
- Alamat footer memakai `href="#"`.
- Brand navbar memakai `href="#"`.
- Beberapa pagination/table link juga memakai `href="#"`.

**Dampak**

CTA bantuan tidak membuka WhatsApp, klik mengubah posisi/fragment halaman, dan link
semu menurunkan aksesibilitas.

**Rekomendasi**

Gunakan URL nyata atau semantic button sesuai tujuan interaksi.

### QA-015 - Low - LCP Warning pada Halaman Publik

**Bukti runtime**

Console development memperingatkan image dashboard di hero terdeteksi sebagai LCP
tanpa `loading="eager"`/prioritas yang sesuai.

**Dampak**

Potensi Largest Contentful Paint lebih lambat pada koneksi lambat.

**Rekomendasi**

Konfirmasi elemen LCP dengan Lighthouse production build dan prioritaskan image hero
yang benar.

### QA-016 - Low - Query Pagination Tidak Divalidasi

**Bukti**

`src/app/admin/dashboard/transactions/page.tsx:14-20` memakai `parseInt` langsung
untuk `page` dan `limit`, tanpa cek `NaN`, minimum, maksimum, atau allowlist `status`.

**Dampak**

URL seperti `?page=abc&limit=-100` dapat meneruskan nilai tidak valid ke backend dan
menghasilkan error atau beban query tak terduga.

**Rekomendasi**

Parse query dengan Zod/coercion, clamp nilai, dan allowlist status.

## Hasil Runtime Browser

Environment:

- URL: `http://localhost:3000`
- Browser: Codex in-app Browser
- Desktop: `1280x720`
- Mobile: `390x844`

| Check                          | Hasil                  |
| ------------------------------ | ---------------------- |
| Home render meaningful content | PASS                   |
| Login render                   | PASS                   |
| Register render                | PASS                   |
| Forgot password render         | PASS                   |
| Verify email info page render  | PASS                   |
| Framework error overlay        | PASS - tidak ditemukan |
| Console application error      | PASS - tidak ditemukan |
| Mobile horizontal overflow     | PASS - tidak ditemukan |
| Mobile menu open               | PASS                   |
| Empty login validation         | PASS secara visual     |
| Protected admin redirect       | PASS                   |
| Protected organizer redirect   | PASS                   |
| Protected peserta redirect     | PASS                   |
| Authenticated business flows   | NOT TESTED             |

Catatan runtime:

- Empty login menampilkan “Email tidak valid” dan “Password minimal 6 karakter”.
- Route protected mengarah ke `/auth/login?callbackUrl=...`.
- Mobile menu menampilkan Home, About Us, Service, dan Contacts.
- Console hanya menunjukkan warning LCP image yang dijelaskan pada QA-015.

## Area yang Belum Teruji

- Login sukses dan session expiry dengan akun nyata.
- Cross-role access menggunakan token `ADMIN`, `ORGANIZER`, dan `PESERTA`.
- Ownership check event/team/registration pada backend.
- Create/update/delete admin, user, event, team, judge, assessment, ranking, dan recap.
- Upload file valid, oversize, MIME spoofing, dan backend storage failure.
- Top-up, approve/reject transaksi, dan payment reconciliation.
- Browser selain Chromium serta perangkat mobile fisik.
- Kondisi backend timeout, 401, 403, 422, 500, non-JSON, dan schema drift secara e2e.

## Rekomendasi Urutan Perbaikan

1. Hentikan fallback rekening wallet dan fail closed.
2. Amankan upload serta turunkan request body limit.
3. Pulihkan release gate: format, lint, dan `build:prod`.
4. Perbaiki `.example-env` dan tambahkan startup environment validation.
5. Review/upgrade dependency yang terkena advisory.
6. Tegakkan role dan ownership di backend serta defense-in-depth pada Server Action.
7. Bedakan empty state dari backend/schema error.
8. Tambahkan automated test matrix per role.
9. Tambahkan route loading/error boundary.
10. Selesaikan accessibility dan performance finding.

## Kesimpulan

Fondasi Next.js, role routing, server-side fetch, dan penggunaan Zod sudah tersedia,
tetapi quality gate dan failure handling belum cukup aman untuk production. Risiko
paling mendesak bukan kosmetik: fallback rekening wallet, upload 500 MB, dependency
advisory, dan konfigurasi environment dapat berdampak langsung pada uang, availability,
security, dan keberhasilan deployment.
