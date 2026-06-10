# QA Frontend Final Regression and Backend Alignment Report - Paskihub FE

Tanggal audit: 7 Juni 2026  
Frontend repository: `paskihub-fe`  
Branch/commit saat audit: `nopal-fix/security` / `f228218` + uncommitted Batch 1-8 changes  
Referensi wajib:

- `docs/qa-frontend-regression-and-alignment-report.md`
- `backend-frontend-implementation-alignment.md`
- `swagger.json`
- `AGENTS.md`

## 0. Production Readiness Addendum

Tanggal perbaikan: 7 Juni 2026  
Status setelah perbaikan production blocker: **PASS - siap untuk regression QA dengan backend runtime/staging.**

Perbaikan yang sudah diterapkan setelah audit final awal:

- `src/actions/eo-team.actions.ts`: directive `"use server"` dipindahkan menjadi statement pertama sehingga Next production build tidak gagal.
- `src/app/api/files/[resourceType]/[resourceId]/route.ts`: private file proxy sekarang memakai `session.accessToken`, `getApiKeyHeader()`, format `x-api-key: Key <api_key>`, dan kontrak `params` Next 16.
- `src/services/system-setting.service.ts` dan service lain: raw/unused `API_KEY` lokal dibersihkan; header API key memakai helper seragam.
- `src/lib/api-error.ts`: nested backend error diparse aman agar tidak jatuh menjadi pesan `[object Object]`; 413/non-JSON error tetap aman.
- `src/services/home-stats.service.ts`, `src/services/ranking.service.ts`, dan `src/services/participant-event.service.ts`: false empty fallback prioritas dihapus; contract/schema mismatch sekarang naik sebagai error.
- `src/app/(home)/page.tsx`: home stats menampilkan status tidak tersedia, bukan angka nol palsu, saat backend/contract gagal.
- `src/app/auth/login/page.tsx` dan `src/components/ui/navbar.tsx`: unknown role fail closed dan tidak diarahkan ke dashboard peserta.
- `src/services/wallet.service.ts`: public settings tidak lagi mengirim bearer token.
- `.prettierignore`: artefak referensi lokal yang tidak dipakai build diabaikan dari `prettier --check`.

Verification setelah perbaikan:

| Command | Status | Evidence |
|---|---|---|
| `npm run typecheck` | PASS | `tsc --noEmit` selesai tanpa error |
| `npm run lint` | PASS | ESLint selesai dengan `--max-warnings 0` |
| `npm test` | PASS | Vitest: 5 files, 15 tests |
| `npm run build:prod` | PASS | `prettier --check .` dan `next build` selesai sukses |

Catatan tersisa:

- `npm run build:prod` masih menampilkan warning Next 16: konvensi `middleware` deprecated dan disarankan migrasi ke `proxy`. Warning ini tidak memblokir build.
- `npm audit --omit=dev` masih menunjukkan 4 moderate vulnerabilities pada transitive dependency (`next/postcss`, `next-auth/uuid`). Tidak diperbaiki di batch ini karena `npm audit fix --force` menyarankan perubahan breaking/downgrade dependency.
- Authenticated E2E lintas role, ownership private file valid, dan mutasi backend tetap perlu diverifikasi di staging dengan akun/fixture backend.

## 1. Executive Summary

**Overall status: FAIL - belum siap production.**

Batch 1-8 menyelesaikan banyak finding prioritas secara statis: status transaksi
`APPROVE`, schema role strict, enum EO-team `KICKED`, update team form-data sesuai
Swagger, wallet proof tanpa PDF, sebagian private-file URL berpindah ke route proxy,
helper API key `Key <api_key>`, dan beberapa test enum/helper sudah ditambahkan.

Namun final regression gate masih gagal pada tiga level:

1. `npm run build:prod` gagal pada Prettier sebelum build.
2. `npm run lint` gagal karena 31 warning dengan `--max-warnings 0`.
3. `npm exec next build` gagal karena `"use server"` di `src/actions/eo-team.actions.ts`
   tidak berada di baris paling atas.

Selain itu, private file proxy belum valid secara fungsional karena route memakai
`session.user.token`, sementara Auth.js session yang dibuat di `src/lib/auth.ts`
menyimpan token di `session.accessToken`. Proxy juga masih mengirim raw
`process.env.API_KEY`, bukan helper `getApiKeyHeader()`.

Authenticated E2E untuk tiga role, ownership, file privat valid, staff organizer,
dan mutasi backend belum bisa diverifikasi tanpa akun/fixture QA serta backend runtime.

## 2. Verification Result

| Command / Check | Status | Evidence / Notes |
|---|---|---|
| `npm run typecheck` | PASS | `tsc --noEmit` selesai tanpa error |
| `npm run lint` | FAIL | 31 warning; `API_KEY` unused di banyak service, unused expression di `eo-team.actions.ts` |
| `npm test` | PASS | Vitest: 5 files, 15 tests |
| `npm run build:prod` | FAIL | Prettier check gagal pada 19 file |
| `npm exec next build` | FAIL | `"use server"` directive bukan statement pertama di `src/actions/eo-team.actions.ts` |
| `npm audit --omit=dev` | FAIL | 4 moderate vulnerabilities: `next/postcss`, `next-auth/uuid` |
| Browser smoke home | PASS | Home render, no console warn/error, logo navbar points to `/` |
| Browser smoke login validation | PASS | Empty submit shows email/password validation |
| Browser smoke protected routes | PASS | Admin/organizer/peserta redirect to login when unauthenticated |
| Proxy without session | PASS | `/api/files/id-card/test-resource` returns 401 unauthenticated |
| Authenticated proxy | NOT VERIFIED | No session fixture; static code shows likely 401 due `session.user.token` mismatch |

## 3. Batch 1-8 Regression Summary

| Batch | Target | Current Status | Evidence | Notes |
|---|---|---|---|---|
| Batch 1 | Private File Proxy | PARTIAL / STILL ISSUE | `src/app/api/files/[resourceType]/[resourceId]/route.ts` | Proxy exists and unauthenticated returns 401, but token source and API key header are wrong |
| Batch 2 | Contract Mismatch | MOSTLY FIXED | `src/lib/team-form.ts`, transaction page, EO schema | Update team uses Swagger fields; `APPROVE` and `KICKED` fixed |
| Batch 3 | Auth Role | PARTIAL | `auth.schema.ts`, `middleware.ts`, login page | Role enum and middleware fail-closed improved; client dashboard helper still defaults unknown role to peserta |
| Batch 4 | Upload Validation | PARTIAL | `wallet.actions.ts`, wallet form, `team.actions.ts` | Wallet PDF removed; team server validation added, but team photo permits PDF and validation uses `any` |
| Batch 5 | Error Handling Service | PARTIAL | `api-error.ts`, services | Central parser exists; several services still use ad hoc parsing or false empty fallback |
| Batch 6 | API Key and Env | PARTIAL | `env.ts`, services, `.example-env` | Helper exists, but system settings and file proxy bypass it; unused raw `API_KEY` left behind |
| Batch 7 | Schema/Type Hardening | PARTIAL | auth/admin/EO tests and schemas | Key enum tests added; many domain enums remain free strings/`any` |
| Batch 8 | Build Prod and Cleanup | REGRESSION | `npm run build:prod`, `npm exec next build` | Build prod and Next build fail; LCP/navbar/CTA improved |

## 4. Previous Finding Closure

| Previous Finding | Current Status | Evidence | Notes |
|---|---|---|---|
| Private file direct URL | PARTIALLY RESOLVED | `getProxyFileUrl()` and UI links use `/api/files/...` | Proxy implementation has token/API-key bugs |
| Update participant team field mismatch | FIXED | `buildUpdateTeamFormData()` appends `pelatih_name`, `logo_team`, `surat_rekomendasi` | Test covers absence of `coach_name` on update |
| Transaction `APPROVED` vs `APPROVE` | FIXED | `transactions/page.tsx`, admin schemas/client | Query and UI use `APPROVE` |
| EO-team `KICKED` unsupported | FIXED | `eo-team.schema.ts`, organizer/participant UI, test | List/detail schemas accept `KICKED` |
| Unknown role not fail-closed | PARTIALLY FIXED | `RoleSchema`, middleware fail-closed | Login/navbar client helper still defaults unknown role to peserta |
| Wallet proof PDF mismatch | FIXED | Wallet UI/action allow JPG/JPEG/PNG only | Runtime backend top-up not verified |
| Team upload validation missing | PARTIALLY FIXED | `validateTeamDataFiles()` in team action | MIME rules still broad for member photo and rely on `File.type` only |
| Error/schema empty state | PARTIALLY FIXED | `parseApiError()` used in several services | `home-stats` and `ranking` still return empty data; participant-event remains ad hoc |
| API key prefix implicit | PARTIALLY FIXED | `getApiKeyHeader()` | `system-setting.service.ts` and file proxy still raw API key |
| Build prod failure | STILL ISSUE / REGRESSION | `build:prod` and `next build` fail | Current state cannot ship |
| Wallet clickable div accessibility | FIXED | Coin options are buttons; upload uses label/input |
| CTA WhatsApp/navbar logo/LCP | FIXED | Home uses `priority`; CTA `wa.me`; logo `/` | Browser smoke no LCP warning |

## 5. Backend/Swagger Alignment Final

| Domain | Status | Method/Path | Request/Params | Response Parsing | Security Header | Notes |
|---|---|---|---|---|---|---|
| Auth/User | PARTIAL | Login/register/logout/reset paths match | Login body matches | Login role strict | API key helper used | Banned message improved; unknown client helper fallback remains |
| Admin | PARTIAL | Admin/user/transaction paths mostly match | Transaction status fixed | Many schemas parse | API key helper used except settings domain | `any` remains in user detail mapping |
| Organizer/Event | PARTIAL | Event/level/profile paths match | Event payloads still `any` | Mixed | API key helper used | Runtime not verified |
| Organizer Team | REGRESSION | Paths match | Actions call correct endpoints | EO schema accepts `KICKED` | API key helper used | Next build fails due server action directive placement |
| Participant Team | FIXED / PARTIAL | CRUD paths match | Update multipart fixed | Team schemas parse | API key helper used | Upload validation partial; private file proxy bug |
| Participant Event | PARTIAL | Open/active/register/detail/recap paths match | Upload action partly validates | Zod parse used | API key helper used | Error handling still ad hoc; public logo URL direct is expected |
| Wallet/Transaction | PARTIAL | Wallet/admin transaction paths match | Wallet proof image-only; status `APPROVE` fixed | Admin schema parses | API key helper used | Public settings still sends Bearer in wallet service |
| Assessment | PARTIAL | Judge/category/subcategory/finalize paths match | Many action payloads remain `any` | Zod on unified | API key helper used | Bulk endpoints not clearly used |
| Ranking | PARTIAL | Award paths match | Request schema exists | Zod parse on non-empty | API key helper used | `getAwards()` returns `[]` when `data` missing |
| Recap | PARTIAL | Recap paths match | Paths/params align | Zod parse | API key helper used | Staff-owner runtime gap remains backend/frontend E2E risk |
| Settings | STILL ISSUE | `/settings`, `/settings/public` paths match | PATCH schema exists | Zod parse | Raw `process.env.API_KEY!` | Does not use `Key ` helper |
| Dashboard | PARTIAL | Admin/organizer/peserta paths match | No-store | Zod parse in dashboard services | API key helper used | Staff organizer dashboard gap not runtime verified |
| Private File | STILL ISSUE | Frontend route added | Params validated minimally | Streams response | Wrong token and raw API key | Authenticated file loads likely fail |

## 6. Detailed Findings

### QA-FINAL-001 - Critical - Production Build Fails

**Category:** Build / Regression  
**Location:** `src/actions/eo-team.actions.ts:1-2`

`npm exec next build` fails because an import appears before `"use server"`. Next.js
requires the directive to be the first statement in a Server Action file. Because this
file is imported by `src/app/organizer/dashboard/team/client.tsx`, build reports it as
a client import that depends on server-only `revalidatePath`.

**Impact:** Application cannot be production-built.

**Fix direction:** Move `"use server"` to line 1, then place imports after it.

### QA-FINAL-002 - Critical - Private File Proxy Uses Wrong Session Token

**Category:** Security / File Access / Auth  
**Location:** `src/app/api/files/[resourceType]/[resourceId]/route.ts:10-35`

The proxy checks `session.user.token` and forwards `Authorization: Bearer
${session.user.token}`. Auth session callback stores token at `session.accessToken`,
not `session.user.token`.

**Impact:** Authenticated private file requests are likely rejected as 401, so ID card,
recommendation letter, payment proof, and wallet proof remain broken.

**Fix direction:** Read `session.accessToken`, then fetch backend with
`Authorization: Bearer <token>` and `x-api-key: getApiKeyHeader()`.

### QA-FINAL-003 - High - File Proxy Sends Raw API Key

**Category:** Backend Contract / Security  
**Location:** `src/app/api/files/[resourceType]/[resourceId]/route.ts:31-35`

Swagger requires `x-api-key` format `Key <api_key>`, but proxy forwards
`process.env.API_KEY` raw and bypasses `getApiKeyHeader()`.

**Impact:** Proxy fails when env stores an unprefixed API key, even though normal
services now work through the helper.

**Fix direction:** Use the centralized header helper consistently.

### QA-FINAL-004 - High - Release Gate Still Fails on Lint and Prettier

**Category:** Build / CI  
**Location:** Many service files, `.prettierignore`, formatting output

`npm run lint` fails with 31 warnings because migration left unused `const API_KEY =
process.env.API_KEY` declarations and `eo-team.actions.ts` has an unused expression.
`npm run build:prod` also fails before build because Prettier finds 19 files not
formatted.

**Impact:** CI/release gate remains red.

**Fix direction:** Remove stale constants and run scoped Prettier on source files
without rewriting unrelated user artifacts.

### QA-FINAL-005 - High - System Settings Still Bypasses API Key Helper

**Category:** Backend Contract / API Key  
**Location:** `src/services/system-setting.service.ts:12-49`

Settings service sends `process.env.API_KEY!` directly for protected and public
settings endpoints.

**Impact:** Admin settings can fail under the same API key prefix mismatch Batch 6
was meant to remove.

**Fix direction:** Import and use `getApiKeyHeader()`, plus `parseApiError()`.

### QA-FINAL-006 - High - Error Handling Still Has False Empty Fallbacks

**Category:** Error Handling / Service  
**Location:** `src/services/home-stats.service.ts:29-37`,
`src/services/ranking.service.ts:38-42`

Home stats converts backend failure/schema error into zero counts. Ranking awards
returns `[]` when `data` is absent even if the response contract drifted.

**Impact:** Backend down or contract drift can still look like legitimate empty data.

**Fix direction:** Only render empty state for successful responses with explicit empty
arrays. Treat missing `data` or schema mismatch as unavailable/contract error.

### QA-FINAL-007 - Medium - Central Error Parser Still Can Emit `[object Object]`

**Category:** Error Handling  
**Location:** `src/lib/api-error.ts:30-45`

`message` may be assigned `errData.error`, which is an object for Swagger
`response.ErrorResponse`. Passing that object to `Error` can still become
`[object Object]`.

**Impact:** User-facing and logged errors remain unclear for nested backend errors.

**Fix direction:** Prefer `errData.error?.details`, `errData.error?.message`, then
plain string fallbacks only.

### QA-FINAL-008 - Medium - Public Settings Endpoint Sends Bearer from Wallet Service

**Category:** Backend Contract / Least Privilege  
**Location:** `src/services/wallet.service.ts:37-45`

`GET /api/v1/settings/public` is API-key-only in Swagger, but wallet service still
requires a token and sends Bearer.

**Impact:** Not a direct client leak, but it violates minimal credential usage and
couples public settings to auth state.

**Fix direction:** Call public settings with API key only and schema-parse response.

### QA-FINAL-009 - Medium - Important Enums Remain Free Strings

**Category:** Schema / Type Hardening  
**Location:** `team.schema.ts`, `participant-event.schema.ts`, `eo-team.schema.ts`

Role, transaction, and EO payment status improved, but assessment status, participant
payment status, event status, institution type, and team member role are still largely
`z.string()` or UI-only constants.

**Impact:** Backend enum drift and typo regressions can still pass typecheck.

**Fix direction:** Add shared enum schemas for all Swagger enum groups and use
`z.infer`.

### QA-FINAL-010 - Medium - `any` Remains in Risky Areas

**Category:** TypeScript / Schema  
**Location:** actions/services for assessment, profile, admin, file validation, Auth

Batch 7 reduced some risk but did not remove `any` from high-impact paths, including
assessment payloads, admin user mapping, Auth callbacks, and file validation.

**Impact:** Strict TypeScript still does not protect core backend contracts.

**Fix direction:** Prioritize request DTOs and response schemas for assessment,
settings, profile, admin detail, and files.

### QA-FINAL-011 - Low - Navbar/Login Dashboard Helper Still Defaults Unknown Role to Peserta

**Category:** Auth / UX  
**Location:** `src/components/ui/navbar.tsx:90-95`,
`src/app/auth/login/page.tsx:18-22`

Middleware now fail-closes unknown roles, but client helpers still map unknown or
missing role to `/peserta/dashboard`.

**Impact:** Less dangerous than before because `RoleSchema` rejects unknown login
roles, but stale/malformed client session can still navigate to peserta.

**Fix direction:** Return `/auth/login?error=AccessDenied` or no dashboard link for
unknown role.

## 7. Batch Checklist

### Batch 1 - Private File Proxy

- [x] Frontend proxy route exists.
- [x] UI references for ID card, recommendation letter, organizer proof, admin proof
      mostly use `/api/files/...`.
- [x] Proxy returns 401 without session.
- [x] Proxy maps backend 401/403/404.
- [ ] Proxy uses correct session token.
- [ ] Proxy uses `getApiKeyHeader()`.
- [ ] Authenticated file load verified.

### Batch 2 - Contract Mismatch

- [x] Update team uses `pelatih_name`.
- [x] Update team uses `logo_team`.
- [x] Update team uses `surat_rekomendasi`.
- [x] Transaction status uses `APPROVE`.
- [x] EO-team schema/UI supports `KICKED`.

### Batch 3 - Auth Role

- [x] Login response role is strict enum.
- [x] Middleware has unknown-role fail-closed path.
- [x] Login distinguishes `Banned`, `ServerError`, and invalid credentials.
- [x] Session expired shows safe login toast.
- [ ] Client dashboard helpers avoid unknown-role peserta fallback.

### Batch 4 - Upload Validation

- [x] Wallet proof accepts JPG/JPEG/PNG only.
- [x] Wallet proof rejects PDF in UI and action.
- [x] Team action validates logo, recommendation letter, ID card, and photo files.
- [x] Non-JSON upload errors are parsed through `parseApiError()` in team service.
- [ ] File validation avoids `any`.
- [ ] MIME/extension/magic-byte validation is fully aligned with backend.

### Batch 5 - Error Handling Service

- [x] Shared `ApiError` parser exists.
- [x] Team/admin/profile/wallet paths partly use parser.
- [ ] No `return []` fallback on contract drift.
- [ ] No `return null` fallback in all risky areas.
- [ ] Nested backend errors cannot become `[object Object]`.
- [ ] Participant-event service is fully migrated to central parser.

### Batch 6 - API Key and Env

- [x] `getApiKeyHeader()` adds `Key ` and avoids double prefix.
- [x] `.example-env` no longer contains `NEXT_PUBLIC_API_KEY`.
- [x] Most services use helper.
- [ ] File proxy uses helper.
- [ ] System settings service uses helper.
- [ ] Lint is clean after helper migration.

### Batch 7 - Schema/Type Hardening

- [x] Role enum hardened.
- [x] Transaction status hardened.
- [x] EO payment status includes `KICKED`.
- [x] Tests added for role, `KICKED`, API errors, team form builder.
- [ ] Event, assessment, institution, team member, wallet type are fully strict.
- [ ] `any` removed from risky paths.

### Batch 8 - Build Prod and Minor Cleanup

- [x] Navbar logo points to `/`.
- [x] WhatsApp CTA points to `wa.me`.
- [x] Home LCP warning addressed with `priority`; browser smoke shows no LCP warning.
- [x] Wallet coin/upload controls are keyboard-accessible.
- [ ] `npm run lint` passes.
- [ ] `npm run build:prod` passes.
- [ ] `npm exec next build` passes.

## 8. Manual / Runtime Coverage

| Flow | Result | Notes |
|---|---|---|
| Home page render | PASS | Browser DOM has meaningful content; console clean |
| Login page render | PASS | Browser DOM has form and h1 |
| Empty login submit | PASS | Shows email/password validation |
| Protected routes without session | PASS | Admin/organizer/peserta redirect to login |
| Proxy route without session | PASS | `curl` returns 401 |
| Organizer team authenticated page | NOT VERIFIED | Build failure blocks production confidence |
| File proxy authenticated | NOT VERIFIED / LIKELY FAIL | Static token mismatch |
| Admin/organizer/peserta mutations | NOT VERIFIED | No role fixtures/backend E2E |
| Staff organizer ownership | NOT VERIFIED | Backend alignment doc still notes backend effective-owner gap |

## 9. Recommended Fix Priority

### Must Fix Before Production

1. Move `"use server"` to first line in `src/actions/eo-team.actions.ts`.
2. Fix private file proxy to use `session.accessToken` and `getApiKeyHeader()`.
3. Remove stale `API_KEY` declarations and lint warning in EO team action.
4. Format the 19 files failing Prettier, scoped to intended Batch 1-8 files.
5. Migrate `system-setting.service.ts` to `getApiKeyHeader()` and central error parser.
6. Fix nested `parseApiError()` message extraction.

### Should Fix Soon

1. Remove false empty fallbacks in home stats/ranking and remaining risky services.
2. Finish participant-event migration to central error handling.
3. Harden remaining enums: event, assessment, institution, team member, wallet type.
4. Remove `any` from file validation, assessment actions, profile service, admin detail.
5. Add authenticated E2E fixtures for three roles and private file access.

### Nice to Have

1. Use public settings without Bearer from wallet service.
2. Add proxy route tests for 401/403/404/header forwarding.
3. Add middleware tests for unknown role, expired session, and cross-role redirects.

## 10. Final Verdict

Frontend **belum lulus QA final**. Banyak kontrak utama sudah bergerak ke arah benar,
tetapi kondisi akhir masih gagal release gate dan memiliki dua blocker: production
build tidak bisa berjalan, dan private file proxy kemungkinan tidak berfungsi untuk
pengguna yang sudah login.

Setelah blocker di atas diperbaiki, ulangi minimal:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build:prod`
- `npm exec next build`
- authenticated smoke test untuk private files dan organizer team page
