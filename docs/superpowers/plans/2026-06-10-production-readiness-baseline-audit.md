# Production Readiness Baseline Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a complete, evidence-backed baseline of the Paskihub frontend, its backend API contracts, integration mismatches, production risks, and prioritized remediation work without changing application behavior.

**Architecture:** Treat the Go backend implementation as read-only API evidence and trace each frontend module from route to component, action, service, schema, and backend handler/DTO. Store findings in nine linked documents using stable IDs so later security, API, stability, and UI remediation plans can update the same records without duplicating or losing evidence.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, Auth.js/NextAuth v4, native `fetch`, Zod, GoFiber, GORM, Swagger, Markdown, npm verification scripts.

---

## File Structure

This baseline creates documentation only:

- `docs/frontend-project-analysis.md`: repository architecture, runtime flow, dependencies, environment, and baseline command results.
- `docs/frontend-module-analysis.md`: module-by-module purpose, routes, roles, UI, data flow, and readiness.
- `docs/backend-api-contract-summary.md`: backend routes, middleware, DTOs, responses, errors, uploads, and authorization.
- `docs/frontend-backend-api-alignment.md`: frontend call-to-backend contract matrix and mismatch findings.
- `docs/frontend-production-readiness-audit.md`: consolidated risk register and release-gate assessment.
- `docs/frontend-api-integration-plan.md`: ordered API remediation backlog derived from alignment findings.
- `docs/frontend-production-fix-plan.md`: ordered security, stability, and UI remediation backlog.
- `docs/frontend-api-integration-final-report.md`: in-progress report that defines API completion gates.
- `docs/frontend-production-readiness-final-report.md`: in-progress report that defines final release gates.

No file under `src/` or `/Users/noxval/_PROJECT_/paskihub-be` is modified in this plan.

Use these stable finding prefixes:

- `AUTH-###`: authentication, session, route protection, authorization
- `API-###`: endpoint, method, header, request, response, schema, pagination
- `DATA-###`: mock, static, stale, fallback, or misleading data
- `SEC-###`: secret, upload, private file, logging, trust-boundary issue
- `BUILD-###`: typecheck, lint, test, format, build, dependency, environment
- `UX-###`: accessibility, loading, error, empty state, navigation, metadata
- `PERF-###`: caching, rendering, bundle, image, or request performance

Severity must be one of `Critical`, `High`, `Medium`, `Low`, or `Info`.
Status must be one of `Open`, `Blocked by backend`, `Accepted`, `Fixed`, or
`Verified`.

### Task 1: Capture Repository and Verification Baseline

**Files:**

- Create: `docs/frontend-project-analysis.md`
- Read: `AGENTS.md`
- Read: `package.json`
- Read: `next.config.mjs`
- Read: `tsconfig.json`
- Read: `eslint.config.mjs`
- Read: `vitest.config.ts`
- Read: `src/lib/env.ts`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/AGENTS.md`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/go.mod`

- [ ] **Step 1: Record repository state without exposing secrets**

Run:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git log -5 --oneline
node --version
npm --version
```

Expected: commands complete successfully. Record the branch, commit, runtime
versions, and whether pre-existing changes are present. Never print either
repository's `.env` content.

- [ ] **Step 2: Inventory framework and configuration**

Run:

```bash
node -e 'const p=require("./package.json"); console.log(JSON.stringify({scripts:p.scripts,dependencies:p.dependencies,devDependencies:p.devDependencies},null,2))'
rg -n "process\\.env|API_BASE_URL|API_KEY|NEXTAUTH|cache:|revalidate" src next.config.mjs
```

Expected: output identifies the installed dependency declarations, all
environment-variable consumers, and explicit cache policies.

- [ ] **Step 3: Run the baseline release gates**

Run each command separately and preserve its exit status and concise error
evidence:

```bash
npm run typecheck
npm run lint
npm run test
npm run format
npm run build:prod
```

Expected: every command has a recorded `PASS`, `FAIL`, or `BLOCKED` result.
`BLOCKED` is allowed only when external environment requirements prevent the
command from reaching the code under test; include the exact blocker.

- [ ] **Step 4: Write the project analysis**

Create `docs/frontend-project-analysis.md` with this structure:

```md
# Frontend Project Analysis

**Audit date:** 2026-06-10
**Frontend branch:** `<recorded branch>`
**Frontend commit:** `<recorded commit>`
**Backend reference:** `/Users/noxval/_PROJECT_/paskihub-be`
**Scope:** Static analysis and baseline verification; no application behavior changes.

## Executive Summary

State the architecture, current maturity, and the most important verified risks
in five to ten concise bullets.

## Runtime and Dependency Baseline

| Item | Declared/Detected Value | Evidence | Assessment |
| --- | --- | --- | --- |
| Next.js | version from `package.json` | `package.json` | Note drift from AGENTS.md when present |
| React | version from `package.json` | `package.json` | Compatible/needs review |
| Node.js | command output | `node --version` | Record only |
| Package manager | command output | `npm --version` | Record only |

## Architecture

Document App Router structure, Server Component default, client boundaries,
Server Actions, services, Zod schemas, Auth.js, middleware, and shared UI.

## Environment and Deployment Configuration

List variable names and consumers without recording values. Explain fail-fast
behavior, API key formatting, production URL requirements, and build-time
requirements.

## Data and Request Flow

Describe:
`page/layout -> Server Action or Server Component -> service -> fetch -> Go API`
and the client mutation path separately.

## Cross-Cutting Concerns

Cover authentication, authorization, error parsing, cache policy, uploads,
private files, validation, loading/error states, and logging.

## Verification Baseline

| Command | Status | Evidence |
| --- | --- | --- |
| `npm run typecheck` | PASS/FAIL/BLOCKED | concise output |
| `npm run lint` | PASS/FAIL/BLOCKED | concise output |
| `npm run test` | PASS/FAIL/BLOCKED | test/file count or error |
| `npm run format` | PASS/FAIL/BLOCKED | concise output |
| `npm run build:prod` | PASS/FAIL/BLOCKED | concise output |

## Initial Risks

Use stable finding IDs and link each item to the detailed audit document.

## Constraints

- Backend is read-only.
- Existing UI direction is preserved.
- Runtime flows requiring accounts or external services remain explicitly
  unverified until fixtures are available.
```

- [ ] **Step 5: Check and commit the baseline document**

Run:

```bash
npx prettier --check docs/frontend-project-analysis.md
git diff --check
git add docs/frontend-project-analysis.md
git commit -m "docs: record frontend verification baseline"
```

Expected: formatting and diff checks pass; commit contains only the project
analysis document.

### Task 2: Inventory Frontend Modules and Data Flows

**Files:**

- Create: `docs/frontend-module-analysis.md`
- Read: `src/app/**/*`
- Read: `src/components/**/*`
- Read: `src/actions/**/*`
- Read: `src/services/**/*`
- Read: `src/schemas/**/*`
- Read: `src/lib/auth.ts`
- Read: `src/middleware.ts`

- [ ] **Step 1: Generate a route and layer inventory**

Run:

```bash
find src/app -type f \( -name 'page.tsx' -o -name 'layout.tsx' -o -name 'loading.tsx' -o -name 'error.tsx' -o -name 'route.ts' \) | sort
find src/actions src/services src/schemas src/components -type f | sort
rg -n "use client|use server|fetch\\(|Service|Action|redirect\\(|notFound\\(" src/app src/components src/actions src/services
```

Expected: all route surfaces and cross-layer references are visible.

- [ ] **Step 2: Identify static, mock, fallback, and incomplete behavior**

Run:

```bash
rg -n "data\\.json|mock|dummy|placeholder|hardcoded|static|fallback|return \\[\\]|return null|coming soon|belum tersedia" src --glob '!src/components/ui/**'
rg -n "console\\.(log|debug|info)|\\bany\\b|@ts-ignore|eslint-disable" src --glob '!src/components/ui/**'
```

Expected: every result is classified as legitimate UI copy/test fixture,
intentional fallback, or a candidate finding. A text match alone is not treated
as proof of a defect.

- [ ] **Step 3: Trace public and authentication modules**

Read the public home route, auth pages, `src/actions/auth.actions.ts`,
`src/services/auth.service.ts`, `src/schemas/auth.schema.ts`,
`src/lib/auth.ts`, and `src/middleware.ts`.

For each workflow, record:

```text
purpose -> route -> component/form -> action/service -> schema -> backend call
-> success path -> error path -> role/access behavior
```

Expected: login, registration, profile completion, email verification, forgot
password, reset password, public statistics, and logout are covered.

- [ ] **Step 4: Trace Admin modules**

Read all files under:

```text
src/app/admin/
src/components/admin/
src/actions/admin.actions.ts
src/actions/system-setting.actions.ts
src/services/admin.service.ts
src/services/admin-dashboard.service.ts
src/services/system-setting.service.ts
src/schemas/admin.schema.ts
src/schemas/admin-dashboard.schema.ts
src/schemas/system-setting.schema.ts
```

Expected: dashboard, users, admins, transactions, and settings each have a
complete route-to-service trace.

- [ ] **Step 5: Trace Organizer modules**

Read all organizer routes/components and these domain layers:

```text
src/actions/event.actions.ts
src/actions/eo-team.actions.ts
src/actions/judge.actions.ts
src/actions/assessment.actions.ts
src/actions/ranking.actions.ts
src/actions/rekap.actions.ts
src/actions/wallet.actions.ts
src/actions/profile.actions.ts
src/services/organizer-dashboard.service.ts
src/services/eo-team.service.ts
src/services/judge.service.ts
src/services/assessment.service.ts
src/services/ranking.service.ts
src/services/rekap.service.ts
src/services/wallet.service.ts
src/services/profile.service.ts
src/schemas/organizer-dashboard.schema.ts
src/schemas/eo-team.schema.ts
src/schemas/judge.schema.ts
src/schemas/assessment.schema.ts
src/schemas/ranking.schema.ts
src/schemas/rekap.schema.ts
src/schemas/profile.schema.ts
```

Expected: dashboard, profile, events and levels, staff/team, jury, assessment
form/system, ranking, score recap, and wallet are covered.

- [ ] **Step 6: Trace Peserta modules**

Read all participant routes/components and these domain layers:

```text
src/actions/team.actions.ts
src/actions/participant-event.actions.ts
src/actions/profile.actions.ts
src/services/participant-dashboard.service.ts
src/services/team.service.ts
src/services/participant-event.service.ts
src/services/profile.service.ts
src/schemas/participant-dashboard.schema.ts
src/schemas/team.schema.ts
src/schemas/participant-event.schema.ts
src/schemas/profile.schema.ts
```

Expected: dashboard, profile, team CRUD, event discovery, event overview,
registration, payment proof, and recap are covered.

- [ ] **Step 7: Write the module analysis**

Create `docs/frontend-module-analysis.md`. Use one section per module and this
exact table:

```md
## `<Module Name>`

**Purpose:** concise user goal
**Roles:** `PUBLIC`, `ADMIN`, `ORGANIZER`, or `PESERTA`

| Concern | Evidence |
| --- | --- |
| Routes/pages | exact paths |
| Components | exact paths |
| Actions | exact paths or `None` |
| Services | exact paths or `None` |
| Schemas | exact paths or `None` |
| Data displayed | fields and source |
| Forms/mutations | operation and validation |
| Access enforcement | middleware/layout/action/service |
| Loading/error/empty state | implemented behavior |
| Current readiness | Ready/Partial/Blocked |

### Flow

Describe the actual end-to-end flow.

### Findings

List stable finding IDs or `No confirmed finding in baseline`.
```

Required module sections:

1. Public home
2. Authentication and account recovery
3. Registration and role profile completion
4. Shared navigation, layout, session, and file proxy
5. Admin dashboard
6. Admin user and admin management
7. Admin transactions
8. Admin system settings
9. Organizer dashboard and profile
10. Organizer events and levels
11. Organizer staff/team
12. Organizer jury
13. Organizer assessment forms and scoring
14. Organizer ranking and awards
15. Organizer score recap
16. Organizer wallet
17. Peserta dashboard and profile
18. Peserta team management
19. Peserta event discovery, registration, and overview

- [ ] **Step 8: Check and commit the module analysis**

Run:

```bash
npx prettier --check docs/frontend-module-analysis.md
git diff --check
git add docs/frontend-module-analysis.md
git commit -m "docs: map frontend modules and flows"
```

Expected: checks pass and the commit contains only the module analysis.

### Task 3: Build the Backend API Contract Summary

**Files:**

- Create: `docs/backend-api-contract-summary.md`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/internal/infra/server/http_server.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/internal/middlewares/*.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/internal/app/*/controller/*.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/internal/app/*/service/*.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/domain/dto/*.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/domain/entity/*.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/domain/enums/enums.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/domain/errors.go`
- Read: `/Users/noxval/_PROJECT_/paskihub-be/docs/swagger.json`

- [ ] **Step 1: Extract implemented routes and middleware**

Run:

```bash
rg -n "\\.(Get|Post|Put|Patch|Delete)\\(" /Users/noxval/_PROJECT_/paskihub-be/internal
rg -n "Authentication|AuthAdmin|AuthPeserta|AuthEO|Verified|ApiKey|APIKey" /Users/noxval/_PROJECT_/paskihub-be/internal
```

Expected: the implemented method/path registrations and middleware chains are
identified from source.

- [ ] **Step 2: Extract request and response contracts**

Run:

```bash
rg -n "^type .*Request struct|^type .*Response struct|json:|form:|validate:" /Users/noxval/_PROJECT_/paskihub-be/domain/dto
rg -n "SuccessResponse|ErrorResponse|Status\\(|JSON\\(|SendStatus|GetCode" /Users/noxval/_PROJECT_/paskihub-be/internal/app /Users/noxval/_PROJECT_/paskihub-be/pkg
```

Expected: DTO field names, binding mode, validation tags, response envelopes,
and error/status behavior are available for contract recording.

- [ ] **Step 3: Trace authorization-sensitive behavior**

Read middleware plus service methods that validate ownership, parent organizer
relationships, participant identity, admin privileges, private-file ownership,
wallet mutations, event registration, assessment finalization, and ranking.

Expected: the summary distinguishes route middleware from service-level
authorization and flags any behavior that cannot be proven statically.

- [ ] **Step 4: Compare Swagger with implementation**

Run:

```bash
node -e 'const s=require("/Users/noxval/_PROJECT_/paskihub-be/docs/swagger.json"); for (const [p,ops] of Object.entries(s.paths||{})) for (const [m,o] of Object.entries(ops)) console.log(m.toUpperCase(),p,o.operationId||"")' | sort
```

Compare that output with Step 1. For each mismatch, record:

```text
Swagger-only | implementation-only | method/path mismatch | body/schema mismatch
```

Expected: executable source remains authoritative.

- [ ] **Step 5: Write the backend contract summary**

Create `docs/backend-api-contract-summary.md` with:

```md
# Backend API Contract Summary

**Source of truth:** implemented Go routes, controllers, services, and DTOs
**Swagger role:** secondary comparison artifact
**Backend modifications:** none

## Global Contract

Document API prefix, API-key format, auth bearer format, response envelope,
error envelope, pagination, date handling, multipart conventions, and relevant
status codes.

## Authentication and Authorization

Document JWT claims/lifetime, middleware, role constants, verification rules,
ownership checks, and private-file access.

## Endpoint Matrix

| Domain | Method | Path | Access | Request | Success Response | Errors | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use exact implemented contracts. Split the matrix by:

- Auth/User
- Public/Home
- Admin
- Dashboard
- Organizer profile/event/staff
- Participant profile/team/event
- Wallet/transactions/settings
- Assessment/forms/recap/ranking
- Private files

## Enum and State Transitions

Record role, event, registration/payment, team membership, transaction,
assessment, and award enums plus allowed transitions proven by services.

## Upload Contracts

Record field names, required/optional status, MIME/size validation, storage
behavior, and download authorization.

## Swagger Drift

| Drift ID | Type | Swagger | Implementation | Frontend Impact |
| --- | --- | --- | --- | --- |

## Runtime Dependencies

List PostgreSQL, Redis, mail, object storage, and external integrations that
affect frontend-verifiable flows without recording credentials.
```

- [ ] **Step 6: Check and commit the backend summary**

Run:

```bash
npx prettier --check docs/backend-api-contract-summary.md
git diff --check
git add docs/backend-api-contract-summary.md
git commit -m "docs: summarize implemented backend contracts"
```

Expected: checks pass; no backend file is staged or modified.

### Task 4: Create the Frontend-Backend Alignment Matrix

**Files:**

- Create: `docs/frontend-backend-api-alignment.md`
- Read: `src/services/*.ts`
- Read: `src/actions/*.ts`
- Read: `src/schemas/*.ts`
- Read: `docs/backend-api-contract-summary.md`
- Read: `swagger.json`
- Read: `backend-frontend-implementation-alignment.md`

- [ ] **Step 1: Extract every frontend backend call**

Run:

```bash
rg -n "fetch\\(" src/services src/actions src/lib src/app/api
rg -n "/api/v1/|API_BASE_URL|Authorization|x-api-key|FormData|URLSearchParams" src/services src/actions src/lib src/app/api
```

Expected: every direct backend call has a known owner. Calls outside
`src/services` must be justified or flagged for review.

- [ ] **Step 2: Compare each call against backend evidence**

For every call, record:

```text
frontend owner
method and path
auth and API-key headers
query/path parameters
request body or multipart fields
cache policy
expected status
Zod response schema
backend route/controller/DTO
alignment result
```

Alignment result must be one of:

- `Aligned`
- `Partial`
- `Mismatch`
- `Frontend-only requirement`
- `Backend-only capability`
- `Runtime verification required`

- [ ] **Step 3: Validate schema strictness and fallback semantics**

Run:

```bash
rg -n "\\.parse\\(|safeParse\\(|z\\.object|z\\.enum|z\\.string\\(\\)" src/services src/schemas
rg -n "catch|return \\[\\]|return \\{|return null|fallback|empty" src/services
```

Expected: distinguish valid empty backend results from transport failure,
contract drift, or hidden error fallback.

- [ ] **Step 4: Write the alignment document**

Create `docs/frontend-backend-api-alignment.md`:

```md
# Frontend-Backend API Alignment

## Status Legend

Define `Aligned`, `Partial`, `Mismatch`, `Frontend-only requirement`,
`Backend-only capability`, and `Runtime verification required`.

## Integration Matrix

| Finding ID | Domain | Frontend Owner | Frontend Contract | Backend Evidence | Status | Severity | Required Action |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Mock and Static Data Register

| Finding ID | Location | Current Data | Backend Support | User Impact | Decision |
| --- | --- | --- | --- | --- | --- |

## Header and Authentication Matrix

| Call | API Key | Bearer Token | Cache | Backend Requirement | Status |
| --- | --- | --- | --- | --- | --- |

## Schema and Error-Handling Matrix

| Service | Response Schema | Error Parser | Empty Semantics | Status |
| --- | --- | --- | --- | --- |

## Unsupported Frontend Requirements

List only capabilities with no implemented backend support. Do not propose
invented endpoints; reference the UI/module requiring each capability.

## Backend Capabilities Not Used by Frontend

List implemented endpoints that appear relevant but unused, and state whether
that is intentional, dead integration, or requires product clarification.
```

- [ ] **Step 5: Cross-check completeness**

Run:

```bash
test "$(rg -l 'fetch\\(' src/services src/actions src/lib src/app/api | wc -l | tr -d ' ')" -gt 0
rg -n "Aligned|Partial|Mismatch|Frontend-only requirement|Backend-only capability|Runtime verification required" docs/frontend-backend-api-alignment.md
```

Expected: all service/action/API-route files containing backend calls appear in
the matrix or are explicitly recorded as shared infrastructure.

- [ ] **Step 6: Check and commit the alignment matrix**

Run:

```bash
npx prettier --check docs/frontend-backend-api-alignment.md
git diff --check
git add docs/frontend-backend-api-alignment.md
git commit -m "docs: map frontend backend API alignment"
```

Expected: checks pass and only the alignment document is committed.

### Task 5: Consolidate the Production Readiness Risk Register

**Files:**

- Create: `docs/frontend-production-readiness-audit.md`
- Read: `docs/frontend-project-analysis.md`
- Read: `docs/frontend-module-analysis.md`
- Read: `docs/backend-api-contract-summary.md`
- Read: `docs/frontend-backend-api-alignment.md`
- Read: `docs/qa-frontend-final-report.md`
- Read: `docs/qa-frontend-regression-and-alignment-report.md`
- Read: `qa-backend-regression-report.md`

- [ ] **Step 1: Reconcile old reports with current evidence**

For every previously reported issue:

1. verify it against the current commit;
2. preserve its historical context;
3. mark it `Fixed`, `Still open`, `Regressed`, or `Not reproducible`;
4. assign a current stable finding ID; and
5. avoid copying stale conclusions into the new audit.

Expected: conflicting old report statements do not remain unexplained.

- [ ] **Step 2: Classify release risk**

Use these release rules:

```text
Critical: exploitable security issue, unauthorized access, data corruption, or
production build cannot be created.

High: core role workflow fails, backend contract causes incorrect mutation or
data exposure, secret handling is unsafe, or release gate is red.

Medium: recoverable workflow failure, misleading state, incomplete validation,
accessibility blocker, or material maintainability risk.

Low: limited UX, metadata, performance, or consistency issue without core-flow
failure.

Info: verified observation or improvement opportunity with no current defect.
```

- [ ] **Step 3: Write the production readiness audit**

Create `docs/frontend-production-readiness-audit.md`:

```md
# Frontend Production Readiness Audit

**Audit status:** Baseline complete
**Readiness verdict:** Recommended / Conditionally recommended / Blocked

## Executive Verdict

State the verdict and the exact conditions preventing a stronger verdict.

## Release Gates

| Gate | Status | Evidence | Blocking Findings |
| --- | --- | --- | --- |
| TypeScript | PASS/FAIL/BLOCKED | command | IDs |
| Lint | PASS/FAIL/BLOCKED | command | IDs |
| Tests | PASS/FAIL/BLOCKED | command | IDs |
| Format | PASS/FAIL/BLOCKED | command | IDs |
| Production build | PASS/FAIL/BLOCKED | command | IDs |
| Auth and role protection | status | static/runtime evidence | IDs |
| API contract alignment | status | alignment matrix | IDs |
| Core role E2E | status | evidence or missing fixtures | IDs |

## Risk Register

| Finding ID | Severity | Category | Affected Modules | Evidence | Impact | Required Fix | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Security and Privacy

Cover auth/session, authorization, private files, API keys, secrets, uploads,
logging, personal data, and browser exposure.

## Reliability and Data Integrity

Cover request contracts, mutations, validation, error semantics, cache policy,
state transitions, and misleading fallbacks.

## Operational Readiness

Cover environment variables, build behavior, dependency advisories, runtime
services, observability limitations, and deployment assumptions.

## UX, Accessibility, SEO, and Performance

Cover only verified findings, preserving existing UI direction.

## Runtime Verification Gaps

List exact account roles, fixtures, backend services, and flows needed for
staging verification.

## Readiness by Module

| Module | Status | Blocking Findings | Runtime Gap |
| --- | --- | --- | --- |
```

- [ ] **Step 4: Check finding integrity**

Run:

```bash
rg -o "(AUTH|API|DATA|SEC|BUILD|UX|PERF)-[0-9]{3}" docs/frontend-production-readiness-audit.md | sort | uniq -d
rg -n "Critical|High|Medium|Low|Info" docs/frontend-production-readiness-audit.md
```

Expected: repeated IDs refer to the same finding, not different issues. Every
Critical or High finding has exact evidence and a concrete required fix.

- [ ] **Step 5: Check and commit the audit**

Run:

```bash
npx prettier --check docs/frontend-production-readiness-audit.md
git diff --check
git add docs/frontend-production-readiness-audit.md
git commit -m "docs: publish frontend production readiness audit"
```

Expected: checks pass and only the readiness audit is committed.

### Task 6: Create the API Integration Remediation Plan

**Files:**

- Create: `docs/frontend-api-integration-plan.md`
- Read: `docs/frontend-backend-api-alignment.md`
- Read: `docs/frontend-production-readiness-audit.md`

- [ ] **Step 1: Select API findings only**

Include `API-*` and `DATA-*` findings plus `AUTH-*` or `SEC-*` findings whose
fix directly changes an API call. Exclude speculative changes and backend
changes not authorized by the user.

Expected: every selected item points to a row in the alignment matrix.

- [ ] **Step 2: Group work into independently verifiable batches**

Use this order:

1. shared auth/header/error infrastructure;
2. authentication and account workflows;
3. admin services;
4. organizer event/team/profile services;
5. organizer assessment/ranking/recap services;
6. wallet/settings/private files;
7. participant profile/team/event services;
8. public data and remaining mock replacement.

Move a batch only when dependencies require it; document the dependency.

- [ ] **Step 3: Write the API integration plan**

Create `docs/frontend-api-integration-plan.md`:

```md
# Frontend API Integration Plan

## Objective

Align all supported frontend calls with implemented backend contracts while
keeping backend code read-only.

## Prioritization Rules

Security and incorrect mutations first, contract/schema mismatches second,
misleading data and unused capability last.

## Batch Register

| Batch | Findings | Frontend Files | Backend Evidence | Expected Behavior | Tests | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Batch Details

For every batch include:

- exact finding IDs;
- exact files expected to change;
- schemas or test files to add/update first;
- service/action/UI behavior to change;
- backend source files proving the contract;
- focused test command;
- `npm run typecheck` and `npm run lint`;
- browser or staging flow when required;
- rollback concern and remaining backend gap.

## Backend-Blocked Requirements

List finding ID, required product behavior, current backend evidence, frontend
impact, and the decision to defer. Do not specify invented method/path details.

## Completion Gate

Every matrix row must end as `Aligned`, `Blocked by backend`, or explicitly
accepted with rationale and verification evidence.
```

- [ ] **Step 4: Check and commit the API plan**

Run:

```bash
npx prettier --check docs/frontend-api-integration-plan.md
git diff --check
git add docs/frontend-api-integration-plan.md
git commit -m "docs: plan frontend API remediation batches"
```

Expected: checks pass and only the API integration plan is committed.

### Task 7: Create the Production Fix Plan

**Files:**

- Create: `docs/frontend-production-fix-plan.md`
- Read: `docs/frontend-production-readiness-audit.md`
- Read: `docs/frontend-api-integration-plan.md`

- [ ] **Step 1: Separate API work from other production work**

Reference API batches instead of duplicating them. Include remaining auth,
security, build, type, test, environment, accessibility, metadata, performance,
loading, error, empty-state, and navigation findings.

Expected: each open Critical/High finding belongs to exactly one primary batch.

- [ ] **Step 2: Write the production fix plan**

Create `docs/frontend-production-fix-plan.md`:

```md
# Frontend Production Fix Plan

## Objective

Close verified production risks in risk order without redesigning the product.

## Execution Order

1. Critical security/auth and production build blockers
2. High API/data integrity work from the API integration plan
3. High and Medium runtime/build/environment reliability
4. Accessibility and UX blockers
5. Metadata and performance improvements
6. Final cross-role regression

## Workstream Register

| Workstream | Findings | Scope | Exact Files | Tests First | Verification | Exit Criteria |
| --- | --- | --- | --- | --- | --- | --- |

## Release Checkpoints

After each workstream run focused tests, typecheck, and lint. Run
`npm run build:prod` after every Critical/High workstream and at final
completion.

## Browser and Staging Matrix

| Role | Flow | Required Fixture | Expected Result | Finding IDs |
| --- | --- | --- | --- | --- |

Include unauthenticated protection plus core Admin, Organizer, and Peserta
mutations and private-file access.

## Change-Control Rules

- Backend remains read-only.
- Existing UI direction is preserved.
- New dependencies require evidence.
- Unrelated local changes are not reverted.
- New discoveries receive a stable finding ID before implementation.

## Program Exit Criteria

List the approved completion criteria from the design spec and map each one to
the document or verification evidence that proves it.
```

- [ ] **Step 3: Check and commit the production plan**

Run:

```bash
npx prettier --check docs/frontend-production-fix-plan.md
git diff --check
git add docs/frontend-production-fix-plan.md
git commit -m "docs: plan production remediation workstreams"
```

Expected: checks pass and only the production fix plan is committed.

### Task 8: Initialize the Two Final Reports

**Files:**

- Create: `docs/frontend-api-integration-final-report.md`
- Create: `docs/frontend-production-readiness-final-report.md`
- Read: `docs/frontend-api-integration-plan.md`
- Read: `docs/frontend-production-fix-plan.md`

- [ ] **Step 1: Create the API final report in an honest in-progress state**

Use:

```md
# Frontend API Integration Final Report

**Status:** In progress
**Baseline date:** 2026-06-10
**Completion claim:** Not made; remediation batches have not been executed.

## Baseline

Link the backend contract summary, alignment matrix, and API integration plan.

## Batch Results

| Batch | Findings | Implementation Commit | Tests | Runtime Verification | Result |
| --- | --- | --- | --- | --- | --- |

No batch is marked complete until its implementation and fresh evidence exist.

## Final Alignment

| Domain | Baseline Status | Final Status | Remaining Gap | Evidence |
| --- | --- | --- | --- | --- |

## Backend-Blocked Items

Record only confirmed unsupported requirements.

## Final Conclusion

Remain `In progress` until all planned API batches are complete or explicitly
accepted.
```

- [ ] **Step 2: Create the production final report in an honest in-progress state**

Use:

```md
# Frontend Production Readiness Final Report

**Status:** In progress
**Baseline date:** 2026-06-10
**Deployment recommendation:** Not issued; remediation and final verification remain.

## Baseline Verdict

Link the production readiness audit and summarize its current verdict.

## Finding Closure

| Finding ID | Baseline Severity | Final Status | Fix Commit | Verification Evidence |
| --- | --- | --- | --- | --- |

## Final Release Gates

| Gate | Result | Evidence |
| --- | --- | --- |
| TypeScript | Pending | |
| Lint | Pending | |
| Tests | Pending | |
| Format | Pending | |
| Production build | Pending | |
| Cross-role browser/staging regression | Pending | |

## Residual Risks

Record accepted, backend-blocked, and environment-blocked risks.

## Deployment Recommendation

Set only after final evidence to `Recommended`, `Conditionally recommended`, or
`Blocked`, with concrete conditions.
```

- [ ] **Step 3: Check and commit both report shells**

Run:

```bash
npx prettier --check docs/frontend-api-integration-final-report.md docs/frontend-production-readiness-final-report.md
git diff --check
git add docs/frontend-api-integration-final-report.md docs/frontend-production-readiness-final-report.md
git commit -m "docs: initialize final readiness reports"
```

Expected: both reports clearly avoid a premature completion or deployment
claim.

### Task 9: Cross-Document Integrity and Baseline Completion

**Files:**

- Modify: the nine required documentation files only when integrity checks find
  a concrete inconsistency
- Read: `docs/superpowers/specs/2026-06-10-production-readiness-program-design.md`

- [ ] **Step 1: Verify all required documents exist**

Run:

```bash
for f in \
  docs/frontend-project-analysis.md \
  docs/frontend-module-analysis.md \
  docs/backend-api-contract-summary.md \
  docs/frontend-backend-api-alignment.md \
  docs/frontend-production-readiness-audit.md \
  docs/frontend-api-integration-plan.md \
  docs/frontend-production-fix-plan.md \
  docs/frontend-api-integration-final-report.md \
  docs/frontend-production-readiness-final-report.md
do
  test -s "$f" || exit 1
done
```

Expected: exit code `0`; every required document exists and is non-empty.

- [ ] **Step 2: Verify finding IDs are traceable**

Run:

```bash
rg -o "(AUTH|API|DATA|SEC|BUILD|UX|PERF)-[0-9]{3}" \
  docs/frontend-backend-api-alignment.md \
  docs/frontend-production-readiness-audit.md \
  docs/frontend-api-integration-plan.md \
  docs/frontend-production-fix-plan.md | sort
```

Expected: every planned remediation ID originates in the alignment or readiness
audit. Fix orphaned IDs or mismatched descriptions before continuing.

- [ ] **Step 3: Verify claims against the design**

Check every design requirement:

```text
complete module inventory
backend source-of-truth statement
baseline release gates
risk-first ordering
backend read-only boundary
UI preservation boundary
nine documentation deliverables
runtime verification gaps
no premature production-ready claim
```

Expected: each item has a concrete section in the documentation set.

- [ ] **Step 4: Run documentation quality checks**

Run:

```bash
npx prettier --check \
  docs/frontend-project-analysis.md \
  docs/frontend-module-analysis.md \
  docs/backend-api-contract-summary.md \
  docs/frontend-backend-api-alignment.md \
  docs/frontend-production-readiness-audit.md \
  docs/frontend-api-integration-plan.md \
  docs/frontend-production-fix-plan.md \
  docs/frontend-api-integration-final-report.md \
  docs/frontend-production-readiness-final-report.md
git diff --check
git status --short
```

Expected: Prettier and diff checks pass. `git status` contains no unexpected
application or backend changes.

- [ ] **Step 5: Commit integrity corrections when needed**

If Step 2 or Step 3 required documentation corrections, run:

```bash
git add \
  docs/frontend-project-analysis.md \
  docs/frontend-module-analysis.md \
  docs/backend-api-contract-summary.md \
  docs/frontend-backend-api-alignment.md \
  docs/frontend-production-readiness-audit.md \
  docs/frontend-api-integration-plan.md \
  docs/frontend-production-fix-plan.md \
  docs/frontend-api-integration-final-report.md \
  docs/frontend-production-readiness-final-report.md
git commit -m "docs: reconcile production audit findings"
```

Expected: commit is created only when corrections exist.

- [ ] **Step 6: Publish the baseline checkpoint**

Report:

```text
baseline verification results
readiness verdict
Critical and High finding IDs
backend-blocked requirements
runtime verification gaps
first recommended remediation plan
```

Expected: no implementation claim is made. The next execution plan is selected
from confirmed risk, beginning with authentication/security unless a production
build blocker or data-exposure issue has higher severity.
