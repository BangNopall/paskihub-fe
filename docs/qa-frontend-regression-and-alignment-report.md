# QA Frontend Regression and Backend Alignment Report - Paskihub FE

Tanggal audit: 7 Juni 2026  
Frontend repository: `paskihub-fe`  
Branch/commit: `nopal-fix/security` / `459844e`  
Backend contract references:

- `backend-frontend-implementation-alignment.md`
- `swagger.json`
- `docs/qa-frontend-report.md`

> Catatan: file alignment ditemukan di root repository, bukan pada path
> `docs/backend-frontend-implementation-alignment.md` yang disebutkan dalam request.
> Audit memakai file root tersebut tanpa mengubahnya.

## 1. Executive Summary

**Overall status: FAIL - belum siap production.**

Perbaikan sejak QA sebelumnya menutup sejumlah masalah penting: fallback rekening
hardcoded sudah dihapus, limit request turun dari 500 MB menjadi 10 MB, lint dan
typecheck sudah bersih, test runner sudah tersedia, loading/error boundary telah
ditambahkan untuk tiga dashboard role, contoh environment memakai `API_BASE_URL`,
dan route protected menolak pengguna tanpa sesi.

Namun frontend belum align penuh dengan kontrak backend. Ditemukan satu blocker
critical, tujuh finding high, lima medium, dan tiga low. Risiko terbesar adalah:

1. File privat masih dibuka melalui URL backend langsung tanpa API key dan Bearer.
2. Payload update participant team tidak cocok dengan nama multipart field Swagger.
3. Filter transaksi memakai `APPROVED`, sedangkan backend memakai `APPROVE`.
4. Auth dan middleware masih menerima unknown role lalu default ke dashboard peserta.
5. Schema EO-team menolak status backend `KICKED`.
6. Error/schema drift masih dapat berubah menjadi `[]`, `null`, atau pesan
   `[object Object]`.
7. Wallet tetap mengizinkan PDF walau backend hanya menerima gambar.

Authenticated end-to-end untuk `ADMIN`, `ORGANIZER`, `PESERTA`, ownership, mutasi,
staff organizer, dan file privat belum dapat diverifikasi karena tidak tersedia
akun/fixture QA serta backend test environment dalam scope frontend ini.

## 2. Verification Result

| Command / Check               | Status       | Notes                                                                                                       |
| ----------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`           | PASS         | `tsc --noEmit` selesai tanpa error                                                                          |
| `npm run lint`                | PASS         | ESLint selesai tanpa warning/error                                                                          |
| `npm run build:prod`          | FAIL         | Prettier check gagal pada tiga file referensi untracked: alignment markdown, backend QA report, dan Swagger |
| `npm exec next build`         | PASS         | Compile, TypeScript, dan generate 28 page berhasil                                                          |
| `npm test`                    | PASS         | Vitest: 1 file, 3 test, seluruhnya schema login                                                             |
| `npm audit --omit=dev`        | FAIL         | 4 moderate, 0 high/critical; mencakup direct dependency `next` dan `next-auth`                              |
| Runtime desktop               | PARTIAL PASS | Home dan login render; tidak ada overlay/error console, tetapi ada warning LCP                              |
| Runtime mobile `390x844`      | PARTIAL PASS | Home render dan tidak horizontal overflow; warning LCP tetap muncul                                         |
| Protected route tanpa sesi    | PASS         | Admin, organizer, peserta diarahkan ke `/auth/login?callbackUrl=...`                                        |
| Login empty-submit validation | PASS         | Error email/password tampil dan field ditandai invalid                                                      |
| Authenticated role/E2E        | NOT RUN      | Tidak ada akun atau fixture QA                                                                              |

`npm run build:prod` tetap merupakan release gate yang gagal. Kegagalan format saat
audit berasal dari file referensi untracked, bukan source aplikasi. Build Next.js
langsung tetap lulus, tetapi pipeline yang memakai script resmi repository akan
berhenti sebelum build.

## 3. Regression Result from Previous QA

| Previous Finding                          | Previous Priority | Current Status     | Evidence                                                          | Notes                                                                                                      |
| ----------------------------------------- | ----------------- | ------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| QA-001 rekening fallback hardcoded        | Critical          | RESOLVED           | `wallet.service.ts:61-81`, wallet page error state                | Settings failure menjadi `null`; form top-up tidak dirender                                                |
| QA-002 release gate gagal                 | High              | PARTIALLY RESOLVED | lint/typecheck/build Next lulus; `build:prod` gagal               | Prettier check mencakup tiga file referensi untracked                                                      |
| QA-003 upload 500 MB/client-only          | High              | PARTIALLY RESOLVED | `next.config.mjs`; event/payment/wallet actions                   | Limit 10 MB dan sebagian action validation ada; team action belum validasi dan wallet contract masih salah |
| QA-004 production vulnerabilities         | High              | PARTIALLY RESOLVED | `npm audit --omit=dev`                                            | Turun dari 10 menjadi 4 moderate, belum nol                                                                |
| QA-005 env example salah/local fallback   | High              | PARTIALLY RESOLVED | `.example-env`, seluruh service                                   | Nama env benar dan production tidak fallback localhost; belum fail-fast dan prefix API key tidak jelas     |
| QA-006 authorization tidak fail closed    | Medium            | NOT RESOLVED       | `auth.schema.ts`, `middleware.ts:30-77`                           | Unknown role masih diterima/default peserta                                                                |
| QA-007 error/schema menjadi empty         | Medium            | NOT RESOLVED       | `team.service.ts:42-87`, `admin.service.ts`, `profile.service.ts` | Pola `[]`/`null` masih ada                                                                                 |
| QA-008 tidak ada automated test           | Medium            | PARTIALLY RESOLVED | Vitest config dan `auth.schema.test.ts`                           | Hanya 3 test schema login; tidak ada service/action/E2E                                                    |
| QA-009 tidak ada loading/error boundary   | Medium            | RESOLVED           | `admin`, `organizer`, `peserta` dashboard                         | Loading dan error boundary tersedia per area dashboard                                                     |
| QA-010 transaksi dicetak ke log           | Medium            | RESOLVED           | `transactions/page.tsx`                                           | Debug log transaksi sebelumnya tidak ditemukan                                                             |
| QA-011 Zod/action/service tidak konsisten | Medium            | NOT RESOLVED       | Banyak `any`; response mentah; enum free string                   | Strict TypeScript belum diikuti kontrak domain yang ketat                                                  |
| QA-012 aksesibilitas dasar                | Medium            | PARTIALLY RESOLVED | Login heading/ARIA membaik                                        | Wallet option/upload masih clickable `div`; beberapa label tidak terasosiasi                               |
| QA-013 Remember Me tanpa efek             | Low               | RESOLVED           | Halaman login                                                     | Kontrol telah dihapus                                                                                      |
| QA-014 placeholder link/CTA               | Low               | REGRESSION         | Navbar logo `href="#"`; CTA “Whatsapp” ke `/auth/register`        | CTA berlabel dan tujuan tidak cocok                                                                        |
| QA-015 warning LCP home                   | Low               | NOT RESOLVED       | Runtime console; home hero image                                  | Warning meminta eager loading untuk `dashboard.jpg`                                                        |
| QA-016 query pagination tidak divalidasi  | Low               | REGRESSION         | `transactions/page.tsx:18-33`                                     | Page/limit sudah divalidasi, tetapi enum baru memakai `APPROVED` yang salah                                |

## 4. Backend-Frontend Alignment Summary

| Area                   | Previous Status  | Current Status   | Notes                                                                                         |
| ---------------------- | ---------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| Global Contract        | PARTIAL          | PARTIALLY FIXED  | Base URL/header ada; API key prefix, fail-fast, dan typed errors belum beres                  |
| Auth and Session       | NEEDS ADJUSTMENT | STILL ISSUE      | Expiry membaik; banned detail dan unknown role masih salah                                    |
| Role and Ownership     | PARTIAL          | NOT VERIFIED     | Unauthenticated guard lulus; authenticated cross-role/ownership belum E2E                     |
| API Endpoint Matrix    | PARTIAL          | REGRESSION FOUND | Update team multipart dan status transaksi mismatch                                           |
| Status and Enum        | NEEDS ADJUSTMENT | REGRESSION FOUND | `KICKED` hilang; `APPROVED` baru bertentangan dengan `APPROVE`                                |
| Upload and File Access | NEEDS ADJUSTMENT | STILL ISSUE      | Private proxy belum ada; team validation lemah; wallet PDF mismatch                           |
| Wallet and Payment     | PARTIAL          | PARTIALLY FIXED  | Rekening fail-closed; proof access/format/error parsing belum benar                           |
| Assessment and Recap   | PARTIAL          | STILL ISSUE      | Endpoint utama ada; payload banyak `any`, staff owner gap belum selesai                       |
| Error Handling         | PARTIAL          | STILL ISSUE      | Tidak ada standard handler untuk 401/403/404/409/413/429/500                                  |
| Environment            | PARTIAL          | PARTIALLY FIXED  | Nama env benar; belum fail-fast/prefix contract; `NEXT_PUBLIC_API_KEY` masih didokumentasikan |

## 5. Swagger Endpoint Alignment

Swagger berisi 82 path dan 99 operasi. Seluruh endpoint protected mendeklarasikan
`ApiKeyAuth + BearerAuth`; endpoint public/auth memakai `ApiKeyAuth`. Matriks berikut
mengelompokkan operasi yang relevan terhadap UI.

| Domain              | Method          | Swagger Path                                               | Frontend Location                  | Status             | Notes                                                                                     |
| ------------------- | --------------- | ---------------------------------------------------------- | ---------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| Auth                | POST            | `/api/v1/users/login`                                      | `src/lib/auth.ts`                  | PARTIAL            | Path/body cocok; banned/error detail dibuang                                              |
| Auth                | POST            | `/api/v1/users/register/{role}`                            | `auth.service.ts`, actions         | MATCH              | API-key-only                                                                              |
| Auth                | POST            | `/api/v1/users/forgot-password`                            | `auth.service.ts`                  | MATCH              | API-key-only                                                                              |
| Auth                | PUT             | `/api/v1/users/reset-password/{token}`                     | `auth.service.ts`                  | PARTIAL            | Frontend min 8, backend min 6; frontend lebih ketat                                       |
| Auth                | GET             | `/api/v1/users/verify-email/{email}/{emailVerPass}`        | `auth.service.ts`                  | MATCH              | Path parameters cocok                                                                     |
| Auth                | POST            | `/api/v1/users/logout`                                     | `auth.service.ts`, action          | MATCH              | API key + Bearer                                                                          |
| User                | GET             | `/api/v1/users/show/{userId}`                              | Tidak ditemukan jelas              | NOT FOUND          | Tidak harus diimplementasikan bila UI tidak memerlukan                                    |
| Admin               | GET/POST        | `/api/v1/admin/admins`                                     | `admin.service.ts`                 | PARTIAL            | Path cocok; list schema failure menjadi `[]`                                              |
| Admin               | DELETE/POST     | `/api/v1/admin/admins/{id}/*`                              | `admin.service.ts`                 | MATCH              | Delete/reset password tersedia                                                            |
| Admin               | GET             | `/api/v1/admin/users`                                      | `admin.service.ts`                 | PARTIAL            | Path cocok; schema drift menjadi empty list                                               |
| Admin               | GET/PUT         | `/api/v1/admin/users/{userId}/*`                           | `admin.service.ts`                 | PARTIAL            | Mutasi cocok; detail response tidak diparse Zod                                           |
| Admin               | PUT             | `/api/v1/admin/events/{eventId}/status`                    | `admin.service.ts`                 | MATCH              | Protected server-side                                                                     |
| Dashboard           | GET             | `/api/v1/admin/dashboard`                                  | `admin-dashboard.service.ts`       | MATCH              | `no-store`, Zod parsed                                                                    |
| Event               | POST            | `/api/v1/events/create`                                    | `profile.service.ts`, event action | PARTIAL            | Path cocok; payload menggunakan `any`                                                     |
| Event               | GET             | `/api/v1/events/user/{userId}`                             | `profile.service.ts`               | PARTIAL            | HTTP failure dapat menjadi `[]`                                                           |
| Event               | PUT/DELETE      | `/api/v1/events/{update,delete}/{id}`                      | `profile.service.ts`               | PARTIAL            | Path/method cocok; typing/error belum seragam                                             |
| Event               | POST            | `/api/v1/events/upload/{id}/{logo,poster}`                 | `event.actions.ts`                 | PARTIAL            | 5 MB image validation ada; backend security/header cocok                                  |
| Event Level         | POST/PUT/DELETE | `/api/v1/events/{id}/levels/*`                             | profile/event service/action       | PARTIAL            | Path cocok; request typing longgar                                                        |
| EO Profile          | GET/PUT         | `/api/v1/eo/profile*`                                      | `profile.service.ts`               | PARTIAL            | Response/error tidak seragam                                                              |
| EO Staff            | CRUD            | `/api/v1/eo/staff/*`                                       | profile service/UI                 | NEEDS RUNTIME TEST | Frontend ada; effective owner backend masih gap                                           |
| EO Team             | GET/PUT         | `/api/v1/eo/events/{eventId}/teams/*`                      | `eo-team.service.ts`, actions      | MISMATCH           | `KICKED` ditolak schema list/detail                                                       |
| Participant Profile | GET/PUT         | `/api/v1/peserta/profile*`                                 | `profile.service.ts`, actions      | PARTIAL            | GET error dapat menjadi `null`                                                            |
| Participant Team    | GET/POST        | `/api/v1/peserta/teams`                                    | `team.service.ts`, actions         | PARTIAL            | Create field utama cocok; upload action tidak divalidasi                                  |
| Participant Team    | GET/DELETE      | `/api/v1/peserta/teams/{id}`                               | `team.service.ts`, actions         | PARTIAL            | Path cocok; schema error menjadi `null`                                                   |
| Participant Team    | PUT             | `/api/v1/peserta/teams/{id}`                               | `team.actions.ts:53-87`            | MISMATCH           | Swagger: `pelatih_name`, `logo_team`, `surat_rekomendasi`; frontend mengirim create names |
| Participant Event   | GET             | `/api/v1/peserta/events/{open,active}`                     | `participant-event.service.ts`     | MATCH              | `no-store`, Zod array                                                                     |
| Participant Event   | POST/PUT        | `/api/v1/peserta/events/register*`                         | participant event action/service   | PARTIAL            | Endpoint cocok; upload MIME/backend enforcement perlu runtime                             |
| Participant Event   | GET             | `/api/v1/peserta/events/registrations/{regis_id}`          | participant event service          | MATCH              | Zod parsed                                                                                |
| Participant Recap   | GET             | `/api/v1/peserta/assessment/recap/{regis_id}`              | participant event service          | MATCH              | Zod parsed                                                                                |
| Participant Score   | GET             | `/api/v1/peserta/rekap/scoreboard/{event_level_id}`        | participant event service          | MATCH              | Zod parsed                                                                                |
| Wallet              | GET             | `/api/v1/wallets/{eventId}`                                | `wallet.service.ts`                | PARTIAL            | Path/header cocok; error shape parsing salah                                              |
| Wallet              | GET             | `/api/v1/wallets/{eventId}/logs`                           | `wallet.service.ts`                | PARTIAL            | Proof private masih direct URL                                                            |
| Wallet              | POST            | `/api/v1/wallets/{eventId}/topup`                          | wallet service/action              | MISMATCH           | Frontend menerima PDF; backend image-only                                                 |
| Wallet Admin        | GET             | `/api/v1/wallets/admin/transactions`                       | admin service/page                 | MISMATCH           | Filter frontend `APPROVED`, backend `APPROVE`                                             |
| Wallet Admin        | PUT             | `/api/v1/wallets/admin/transactions/{id}/{approve,reject}` | admin service/action               | MATCH              | Endpoint tersedia                                                                         |
| Assessment          | CRUD            | `/api/v1/eo/events/{eventId}/assessment/judges`            | judge service/actions              | PARTIAL            | Endpoint cocok; staff ownership/runtime belum diuji                                       |
| Assessment          | CRUD            | `.../violation-types`                                      | assessment service/actions         | PARTIAL            | Banyak request `any`                                                                      |
| Assessment          | CRUD            | `.../score-categories`                                     | assessment service/actions         | PARTIAL            | GET `level_id` contract perlu runtime                                                     |
| Assessment          | CRUD            | `.../score-sub-categories`                                 | assessment service/actions         | PARTIAL            | Payload grade longgar                                                                     |
| Assessment          | GET             | `.../unified?level_id=`                                    | assessment service                 | MATCH              | Query digunakan                                                                           |
| Assessment          | POST            | `/api/v1/assessment/finalize`                              | assessment service/action          | MATCH              | Protected request                                                                         |
| Assessment          | POST            | `/api/v1/assessment/{scores,violations}/bulk`              | Tidak jelas dipakai UI             | NOT USED           | Single score endpoint digunakan pada assessment form                                      |
| Ranking             | CRUD            | `.../assessment/awards`                                    | ranking service/actions            | PARTIAL            | Path cocok; GET failure dapat menjadi `[]`                                                |
| Recap               | GET/POST/PUT    | `/api/v1/rekap/*`                                          | rekap service/actions              | PARTIAL            | Zod ada; typed status/error belum seragam                                                 |
| Settings            | GET             | `/api/v1/settings/public`                                  | system/wallet service              | PARTIAL            | Wallet mengirim Bearer yang tidak diperlukan                                              |
| Settings            | GET/PATCH       | `/api/v1/settings`                                         | system setting service/action      | MATCH              | API key + Bearer                                                                          |
| Dashboard           | GET             | `/api/v1/organizer/dashboard`                              | organizer dashboard service        | NEEDS RUNTIME TEST | Frontend cocok; staff effective-owner backend gap                                         |
| Dashboard           | GET             | `/api/v1/peserta/dashboard`                                | participant dashboard service      | MATCH              | `no-store`, Zod parsed                                                                    |
| Public              | GET             | `/api/v1/public/home-stats`                                | home stats service                 | MATCH              | API-key-only, cache dapat diterima                                                        |
| Private File        | GET             | `/api/v1/files/{resourceType}/{resourceId}`                | Tidak ada frontend route handler   | MISMATCH           | UI membuka path langsung tanpa required headers                                           |

## 6. Auth, API Key, and Session Review

- **API key format:** Swagger mendeskripsikan header `x-api-key` dengan format
  `Key <api_key>`. Semua service mengirim `process.env.API_KEY` apa adanya. Sistem
  hanya bekerja bila deployment menyimpan prefix di nilai env. `.example-env` tidak
  menjelaskan format tersebut.
- **Bearer:** Protected service umumnya mengirim `Authorization: Bearer <token>`.
  Tidak ditemukan API key/token di browser console pada smoke test.
- **Public endpoint:** `walletService.getPublicSettings()` mengirim Bearer ke endpoint
  API-key-only. Ini tidak membocorkan token ke client karena berjalan server-side,
  tetapi menambah coupling dan tidak mengikuti minimal-header contract.
- **Banned user:** `authorize()` mengubah seluruh HTTP/schema/network failure menjadi
  `null`, sehingga banned/403 tidak dapat dibedakan dari credential salah.
- **Unknown role:** `loginResponseSchema` menerima `z.string()`. Middleware dan navbar
  mengarahkan setiap role selain admin/organizer ke peserta.
- **Session expired:** JWT `exp` dipakai dan middleware membersihkan cookie lalu
  redirect ke login dengan `error=SessionExpired`. Ini merupakan perbaikan positif,
  tetapi invalid/revoked/banned token 401/403 dari service belum ditangani global.
- **Environment:** Production fallback menjadi empty string, bukan localhost, tetapi
  tidak ada fail-fast untuk `API_BASE_URL`, `API_KEY`, atau `NEXTAUTH_SECRET`.
- **Client env:** `.example-env` masih mencantumkan `NEXT_PUBLIC_API_KEY`. Walaupun
  tidak ditemukan pemakaian source, nama tersebut berisiko mendorong deployment
  mengekspos API key ke bundle client.

## 7. Role and Ownership Review

| Route/Feature              | Expected Role                  | Current Guard                                    | Status  | Notes                                                    |
| -------------------------- | ------------------------------ | ------------------------------------------------ | ------- | -------------------------------------------------------- |
| `/admin/*`                 | ADMIN                          | Middleware + admin layout session                | PARTIAL | Unauthenticated lulus; unknown role dapat lolos          |
| `/organizer/*`             | ORGANIZER                      | Middleware + organizer layout                    | PARTIAL | Cross-role belum diuji dengan sesi nyata                 |
| `/peserta/*`               | PESERTA                        | Middleware + peserta layout                      | PARTIAL | Unknown role default ke peserta                          |
| Admin mutations            | ADMIN                          | Session/token in service                         | PARTIAL | Action tidak selalu assert role; backend source of truth |
| Organizer event/team       | ORGANIZER/staff owner          | Session/token; parent helper pada beberapa route | PARTIAL | Effective parent tidak konsisten end-to-end              |
| Participant team/event     | PESERTA owner                  | Session/token                                    | PARTIAL | Backend ownership required; 403 UX belum seragam         |
| Private file               | Resource owner/authorized role | Tidak ada frontend proxy                         | FAIL    | Browser request tidak membawa API key/Bearer             |
| Unauthenticated dashboards | None                           | NextAuth middleware                              | PASS    | Ketiga role redirect ke login pada runtime               |

Backend tetap harus menjadi source of truth untuk ownership. Frontend guard saat ini
belum cukup sebagai defense in depth karena role tidak dienumkan dan banyak Server
Action hanya mengecek keberadaan token.

## 8. Enum and Status Review

| Enum Group           | Backend Values                                          | Frontend Values                                               | Status     | Notes                                            |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------- | ---------- | ------------------------------------------------ |
| Registration/payment | `WAITING`, `DP_PAID`, `FULL_PAID`, `REJECTED`, `KICKED` | EO schema tanpa `KICKED`; participant UI mengenalnya          | MISMATCH   | Data kicked dapat menggagalkan seluruh Zod array |
| Transaction          | `PENDING`, `APPROVE`, `REJECTED`                        | Page query memakai `APPROVED`; schema admin memakai `APPROVE` | REGRESSION | Contract layer internal tidak konsisten          |
| Assessment           | `PENDING`, `IN_PROGRESS`, `COMPLETED`                   | Banyak `z.string()`                                           | PARTIAL    | Typo/status baru tidak akan tertangkap           |
| Event                | `DRAFT`, `OPEN`, `CLOSED`, `ARCHIVED`                   | Beberapa schema/type string bebas                             | PARTIAL    | UI bergantung string manual                      |
| User Role            | `ADMIN`, `ORGANIZER`, `PESERTA`                         | Login role `z.string()`                                       | MISMATCH   | Menyebabkan fail-open/default peserta            |
| Institution          | `SD`, `SMP`, `SMA`, `PURNA`, `UMUM`                     | Banyak string bebas                                           | PARTIAL    | Filter UI tidak dijamin exhaustive               |
| Team member          | `PASUKAN`, `DANPAS`, `OFFICIAL`, `PELATIH`              | Form/member schema string bebas                               | PARTIAL    | Payload invalid lolos frontend                   |
| Wallet type          | `TOPUP`, `WITHDRAW`                                     | Tidak konsisten dienumkan                                     | PARTIAL    | Badge/filter bisa jatuh ke fallback              |

## 9. Upload and Private File Access Review

| File Type             | Backend Rule                       | Frontend Handling                          | Status  | Notes                                                                |
| --------------------- | ---------------------------------- | ------------------------------------------ | ------- | -------------------------------------------------------------------- |
| Event logo/poster     | Public image; request cap 10 MB    | Action 5 MB JPEG/PNG                       | PARTIAL | Size/type lebih ketat, tetapi extension/magic-byte tidak divalidasi  |
| Team logo             | Public upload                      | Input/type longgar; action tanpa size/MIME | FAIL    | Dapat melewati UI `accept`                                           |
| ID card               | Private, API key + Bearer download | Direct `<img>`/`<a>` ke backend path       | FAIL    | Header auth tidak dapat ditambahkan oleh tag browser                 |
| Recommendation letter | Private authenticated              | Direct link ke backend path                | FAIL    | Tidak ada proxy                                                      |
| Registration proof    | Private authenticated              | 5 MB JPG/PNG/PDF validation                | PARTIAL | View/download tetap direct URL; backend MIME alignment perlu runtime |
| Wallet proof          | Private; backend JPG/JPEG/PNG      | UI/action menerima PDF                     | FAIL    | Client check 10 MB tetapi pesan 5 MB; action 5 MB                    |
| Admin proof preview   | Private authenticated              | Direct `<img>` dan download URL            | FAIL    | Admin pun tidak dapat mengirim required headers                      |

Tidak ditemukan route seperti `src/app/api/files/[...]/route.ts`. Route handler API
satu-satunya adalah NextAuth. Desain yang dibutuhkan:

1. Route handler same-origin memeriksa NextAuth session.
2. Resource type dan ID divalidasi/di-allowlist.
3. Server fetch ke `/api/v1/files/{resourceType}/{resourceId}` dengan API key dan
   Bearer session.
4. Response di-stream dengan content type/disposition yang aman.
5. 401, 403, dan 404 dipetakan eksplisit.
6. Seluruh `<img>` dan download link private diarahkan ke route tersebut.

## 10. Error Handling Review

| HTTP Status     | Expected UX             | Current Handling                                       | Status       | Notes                                               |
| --------------- | ----------------------- | ------------------------------------------------------ | ------------ | --------------------------------------------------- |
| 400             | Validation/global error | Beberapa service memberi prefix generic                | PARTIAL      | Backend detail nested sering tidak terbaca          |
| 401             | Session expired/login   | Middleware hanya mengenali local JWT expiry            | PARTIAL      | 401 service tidak memicu sign-out global            |
| 403             | Access denied           | Sebagian throw; sebagian halaman menjadi generic/empty | PARTIAL      | Banned/ownership tidak dibedakan konsisten          |
| 404             | Not found               | Typed not-found state                                  | FAIL         | Banyak service hanya throw generic atau `null`      |
| 409             | Conflict                | Conflict message                                       | FAIL         | Tidak ada standard mapping                          |
| 413             | File too large          | Pesan file-size                                        | PARTIAL      | Team menangani non-JSON, flow lain belum seragam    |
| 429             | Retry later             | Rate limit state                                       | NOT VERIFIED | Tidak ada handler khusus                            |
| 500             | Server error/retry      | Dashboard error boundary                               | PARTIAL      | Boundary ada, service masih dapat menyamarkan error |
| Schema mismatch | Contract error          | Logged lalu `[]`/`null`                                | FAIL         | Empty state palsu masih terjadi                     |

Swagger `response.ErrorResponse` berbentuk nested `error.code/message/details`.
Pola `err?.message || err?.error` dapat menghasilkan object yang kemudian dirangkai
menjadi teks `[object Object]`. `walletService.requestTopUp()` juga mengakses
`err.error.message` tanpa guard; response kosong/non-JSON dapat menimbulkan error
sekunder dan menutupi status asli.

## 11. Detailed Findings

### Finding 1: Private file dibuka langsung tanpa required authentication

**Priority:** Critical  
**Category:** Security / Swagger Contract / File Access  
**Location:** participant team list/edit, organizer team client, admin transaction client

**Issue:** Swagger mewajibkan API key dan Bearer pada
`GET /api/v1/files/{resourceType}/{resourceId}`, tetapi frontend membentuk URL backend
langsung untuk `<img>` dan `<a>`.

**Evidence:** `team-list-client.tsx:104-138`,
`organizer/dashboard/team/client.tsx:114-155,288-303`,
`transaction-management-client.tsx:387-410`. Tidak ada file proxy `route.ts`.

**Impact:** File privat gagal dimuat/download atau implementasi backend terpaksa
dilonggarkan. Jika storage path ternyata public, dokumen ID/payment dapat bocor.

**Recommendation:** Tambah authenticated same-origin proxy dan migrasikan seluruh
private asset URL ke proxy tersebut.

### Finding 2: Payload update participant team tidak cocok dengan Swagger

**Priority:** High  
**Category:** Regression / Swagger Contract / Action  
**Location:** `src/actions/team.actions.ts:53-78`

**Issue:** Frontend update mengirim `coach_name`, `logo`, dan
`recommendation_letter`. Swagger update meminta `pelatih_name`, `logo_team`, dan
`surat_rekomendasi`.

**Impact:** Update coach/logo/letter dapat diabaikan atau ditolak backend walau create
team bekerja.

**Recommendation:** Pisahkan builder multipart create dan update sesuai DTO backend,
kemudian tambahkan contract test untuk nama field.

### Finding 3: Transaction filter memakai status yang tidak ada

**Priority:** High  
**Category:** Regression / Swagger Contract / Enum  
**Location:** `src/app/admin/dashboard/transactions/page.tsx:18-33`

**Issue:** Query schema menerima `APPROVED`, sedangkan Swagger/backend mendefinisikan
`APPROVE`.

**Impact:** URL/filter approved valid dapat diubah menjadi `undefined`, dan query yang
salah dapat dikirim ke backend.

**Recommendation:** Gunakan enum backend `APPROVE` secara konsisten atau mapping
eksplisit hanya pada presentation label.

### Finding 4: Unknown role dan banned login tidak fail closed

**Priority:** High  
**Category:** Auth / Role / Security  
**Location:** `src/schemas/auth.schema.ts`, `src/lib/auth.ts:36-70`,
`src/middleware.ts:30-77`

**Issue:** Role response adalah free string. Middleware/navbar menganggap role lain
sebagai peserta. Semua kegagalan login, termasuk banned/403/schema/network, menjadi
invalid credentials.

**Impact:** UX banned salah dan defense-in-depth role tidak fail closed. Unknown role
dapat memasuki protected route yang tidak ditolak oleh cabang middleware.

**Recommendation:** Enum role, reject unknown role saat authorize, dan redirect ke
access-denied/sign-out. Pertahankan error code banned yang aman untuk UX.

### Finding 5: Schema EO-team menolak status `KICKED`

**Priority:** High  
**Category:** Schema / Enum / Regression  
**Location:** `src/schemas/eo-team.schema.ts:3-43`

**Issue:** `payment_status` list dan detail tidak mencakup `KICKED`, walau backend dan
sebagian participant UI sudah memakainya.

**Impact:** Satu tim kicked dapat menggagalkan parse seluruh list organizer dan
menjatuhkan halaman/error boundary.

**Recommendation:** Samakan enum list/detail/badge/filter dan tambahkan fixture test
untuk setiap nilai backend.

### Finding 6: Upload wallet dan team belum align

**Priority:** High  
**Category:** Upload / Action / Swagger Contract  
**Location:** `wallet.actions.ts:18-30`,
`wallet-topup-form.tsx:90-96,232-241`, `team.actions.ts`

**Issue:** Wallet menerima PDF walau backend image-only. UI memeriksa 10 MB tetapi
pesannya 5 MB, sedangkan action membatasi 5 MB. Team action tidak memvalidasi
size/MIME setiap file.

**Impact:** Request yang UI anggap valid ditolak backend; client dapat mengirim file
team besar/tipe berbahaya langsung ke Server Action.

**Recommendation:** Jadikan backend rules sebagai shared server-side validation,
sinkronkan UI, dan validasi semua team files serta jumlah/total payload.

### Finding 7: Schema/HTTP error masih disamarkan sebagai empty state

**Priority:** High  
**Category:** Service / Error Handling / Schema  
**Location:** `team.service.ts:42-87`, `admin.service.ts`, `profile.service.ts`,
`ranking.service.ts`

**Issue:** Zod failure atau HTTP failure tertentu masih menghasilkan `[]`/`null`.
Error response nested juga tidak diparse konsisten.

**Impact:** Backend down, contract drift, forbidden, dan data benar-benar kosong
terlihat sama bagi pengguna dan monitoring.

**Recommendation:** Buat typed server error/parser terpusat, throw contract error
untuk Zod failure, dan render empty state hanya untuk response sukses dengan data
kosong.

### Finding 8: Release script resmi tetap gagal

**Priority:** High  
**Category:** Build / Regression  
**Location:** `package.json` script `build:prod`

**Issue:** `prettier --check .` memeriksa seluruh untracked reference artifacts dan
gagal sebelum `next build`.

**Impact:** CI/deploy yang memakai script resmi gagal walau source dapat dibuild.

**Recommendation:** Putuskan ownership/format file referensi atau scope check secara
disengaja. Jangan auto-format file pengguna tanpa persetujuan.

### Finding 9: API key contract dan environment belum fail-fast

**Priority:** Medium  
**Category:** Auth / Environment / Security  
**Location:** `.example-env`, seluruh `src/services`, `src/lib/auth.ts`

**Issue:** Prefix `Key ` bergantung pada isi env, missing env menjadi empty header,
dan `NEXT_PUBLIC_API_KEY` didokumentasikan.

**Impact:** Deployment salah konfigurasi gagal secara terlambat dan tidak diagnostik;
operator dapat keliru mengekspos key sebagai public env.

**Recommendation:** Normalisasi header server-side, validate env saat startup, hapus
dokumentasi public API key bila tidak diperlukan.

### Finding 10: Error status tidak punya handler konsisten

**Priority:** Medium  
**Category:** Service / UX  
**Location:** seluruh `src/services`

**Issue:** 401/403/404/409/413/429/500 ditangani ad hoc. Tidak ada typed error bersama
atau global re-auth/access-denied flow.

**Impact:** Pesan salah, redirect tidak konsisten, dan root cause production sulit
ditelusuri.

**Recommendation:** Standardisasi parser `response.ErrorResponse`, status taxonomy,
dan mapping action/page.

### Finding 11: Type contract masih terlalu longgar

**Priority:** Medium  
**Category:** TypeScript / Schema / Action  
**Location:** auth options, assessment service/actions, profile service,
admin/user UI, team schema

**Issue:** Banyak `any`, file form memakai `z.any()`, assessment payload `any`, dan
response tertentu dipakai mentah.

**Impact:** Strict mode tidak melindungi perubahan DTO/enum, sehingga mismatch baru
seperti `APPROVED` lolos typecheck.

**Recommendation:** Gunakan schema request/response domain dan `z.infer`, terutama
auth role, assessment, team update, transaction, dan files.

### Finding 12: Test suite terlalu sempit untuk klaim regression-safe

**Priority:** Medium  
**Category:** Testing  
**Location:** `src/schemas/auth.schema.test.ts`

**Issue:** Hanya tiga test schema login. Tidak ada test service, action, middleware,
upload, enum, contract, atau E2E.

**Impact:** Mismatch Swagger dan role/file regressions tidak terdeteksi otomatis.

**Recommendation:** Tambahkan contract-oriented unit/integration tests dan minimal
authenticated E2E smoke per role.

### Finding 13: Public endpoint menerima Bearer yang tidak diperlukan

**Priority:** Medium  
**Category:** Service / Security  
**Location:** `src/services/wallet.service.ts:61-70`

**Issue:** `/api/v1/settings/public` adalah API-key-only tetapi wallet service meminta
token dan mengirim Bearer.

**Impact:** Coupling public settings ke sesi dan perluasan penggunaan credential tanpa
kebutuhan.

**Recommendation:** Panggil endpoint dengan API key saja dan schema-validate response.

### Finding 14: Interaksi wallet belum keyboard accessible

**Priority:** Low  
**Category:** Accessibility / UI  
**Location:** `wallet-topup-form.tsx:144-166,239-258`

**Issue:** Pilihan coin dan upload trigger adalah clickable `div` tanpa role,
tabIndex, keyboard handler, atau selected semantics.

**Impact:** Pengguna keyboard/screen reader tidak mendapat interaksi setara.

**Recommendation:** Gunakan button/radio dan label file input yang semantik.

### Finding 15: CTA “Whatsapp” mengarah ke registrasi

**Priority:** Low  
**Category:** UI / Regression  
**Location:** home contact CTA

**Issue:** Runtime DOM menunjukkan link berlabel `Whatsapp` dengan URL
`/auth/register`; logo navbar juga masih `href="#"`.

**Impact:** Navigasi tidak sesuai ekspektasi dan menurunkan kepercayaan pengguna.

**Recommendation:** Samakan label, destination, dan analytics intent.

### Finding 16: Warning LCP halaman publik masih muncul

**Priority:** Low  
**Category:** Performance / Regression  
**Location:** `src/app/(home)/page.tsx:44-51`

**Issue:** Runtime Next.js memperingatkan `dashboard.jpg` sebagai LCP tanpa eager
loading.

**Impact:** Potensi LCP lebih lambat dan noise pada observability development.

**Recommendation:** Tandai hero image sesuai API Next/Image saat ini dan ukur ulang
dengan Lighthouse/Web Vitals.

## 12. Manual Testing Checklist

### Auth

- [ ] Login admin valid dan redirect ke admin dashboard.
- [ ] Login organizer valid dan redirect ke organizer dashboard.
- [ ] Login peserta valid dan redirect ke peserta dashboard.
- [ ] Login banned user menampilkan pesan access denied yang benar.
- [x] Empty login submit menampilkan validation error.
- [ ] Invalid credentials tidak membocorkan detail backend.
- [ ] Expired token membersihkan sesi dan redirect sekali, tanpa loop.
- [ ] Revoked/banned token aktif menangani 401/403 secara global.
- [ ] Unknown role ditolak dan tidak masuk dashboard peserta.

### Role Access

- [x] Unauthenticated user ditolak dari ketiga dashboard.
- [ ] Peserta mengakses admin/organizer route.
- [ ] Organizer mengakses admin/peserta route.
- [ ] Admin mengakses organizer/peserta route.
- [ ] Staff organizer memakai effective parent pada seluruh fitur.
- [ ] Ownership denial tampil sebagai access denied, bukan empty state.

### Admin

- [ ] Dashboard dan statistik.
- [ ] User list/detail serta malformed response.
- [ ] Ban, unban, verify.
- [ ] Archive/unarchive event.
- [ ] Event status update.
- [ ] Filter transaksi dengan `PENDING`, `APPROVE`, `REJECTED`.
- [ ] Approve/reject top-up dan double-submit.
- [ ] View/download private wallet proof.
- [ ] Settings read/update dan validation errors.

### Organizer

- [ ] Create/update/delete event.
- [ ] Upload logo/poster: valid, wrong MIME, oversized.
- [ ] Create/update/delete event level.
- [ ] View teams termasuk status `KICKED`.
- [ ] View private ID card, recommendation letter, payment proof.
- [ ] Approve/reject/kick team.
- [ ] Staff organizer menjalankan flow event/team/wallet/assessment/recap.
- [ ] CRUD judge/category/subcategory/violation.
- [ ] Input score, finalize, duplicate finalize.
- [ ] Ranking award CRUD.
- [ ] Publish/unpublish recap.
- [ ] Wallet top-up JPG/PNG.
- [ ] Wallet PDF harus ditolak frontend sesuai backend.
- [ ] 403/404/409/413/429/500 state.

### Peserta

- [ ] Update profile/password.
- [ ] Create team dengan seluruh member/file.
- [ ] Update team memastikan nama multipart update cocok.
- [ ] Delete team dan ownership denial.
- [ ] Team file wrong MIME/oversized/total request oversized.
- [ ] Open events dan active events.
- [ ] Registration serta payment proof.
- [ ] Pelunasan dan duplicate/conflict case.
- [ ] Registration detail.
- [ ] Recap dan published scoreboard.
- [ ] Kicked participant flow.

### File Access

- [x] Public home images render.
- [ ] Public event logo/poster render.
- [ ] Private ID card via authenticated proxy.
- [ ] Private recommendation letter via proxy.
- [ ] Private registration proof via proxy.
- [ ] Private wallet proof via proxy.
- [ ] File 401 redirects/re-authenticates safely.
- [ ] File 403 menunjukkan access denied.
- [ ] File 404 menunjukkan not found.
- [ ] Content type/disposition dan filename aman.

### Responsive, Accessibility, Performance

- [x] Home desktop render tanpa overlay.
- [x] Home mobile `390x844` tanpa horizontal overflow.
- [ ] Dashboard tables/modal pada mobile/tablet.
- [ ] Keyboard-only login, wallet, dialog, dropdown, upload.
- [ ] Screen reader labels dan focus return modal.
- [ ] LCP/CLS/INP production build.
- [ ] Large team/table data performance.

## 13. Recommended Fix Priority

### Must Fix Before Production

1. Implement authenticated proxy untuk seluruh private files.
2. Perbaiki multipart update team sesuai Swagger.
3. Samakan transaction status ke `APPROVE`.
4. Fail closed untuk unknown role dan pertahankan banned/403 login signal.
5. Tambahkan `KICKED` ke schema/UI organizer.
6. Samakan wallet proof ke image-only dan validasi upload team di Server Action.
7. Hentikan schema/HTTP error menjadi empty state palsu.
8. Pulihkan `npm run build:prod` sebagai release gate yang lulus.

### Should Fix Soon

1. Standardisasi API key prefix, env fail-fast, dan typed error parser.
2. Hilangkan `NEXT_PUBLIC_API_KEY` dari dokumentasi bila tidak diperlukan.
3. Ketatkan Zod enum/request/response dan kurangi `any`.
4. Tambahkan service/action/middleware/contract tests.
5. Verifikasi dan perbaiki effective organizer ownership bersama backend.
6. Pisahkan public settings dari Bearer/session.

### Nice to Have

1. Perbaiki keyboard semantics wallet.
2. Perbaiki CTA WhatsApp/logo navbar.
3. Hilangkan warning LCP dan jalankan Web Vitals audit.
4. Tambahkan E2E responsive/accessibility linting pada CI.

## 14. Final Verdict

Frontend **belum aman untuk production**. Build aplikasi berhasil, lint/typecheck
bersih, route unauthenticated terlindungi, dan beberapa finding lama benar-benar
selesai. Namun private file access adalah blocker security/functional, dan dua
regresi kontrak (`update team` serta `APPROVED`) dapat mematahkan alur bisnis utama.

Perubahan backend masih diperlukan untuk konsistensi effective organizer/staff pada
wallet, assessment, team, recap, dan dashboard sebagaimana dicatat laporan alignment.
Frontend juga memerlukan E2E authenticated untuk tiga role sebelum release. Area
manual paling kritis adalah private files, ownership/403, kicked team, team update,
wallet proof, transaction filter, assessment finalize, dan staff organizer.
