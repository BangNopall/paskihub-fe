# Design Spec: Frontend Integration and Production Readiness Program

**Date:** 2026-06-10
**Status:** Approved for planning
**Repositories:**

- Frontend: `/Users/noxval/_PROJECT_/paskihub-fe`
- Backend source of truth: `/Users/noxval/_PROJECT_/paskihub-be`

## 1. Objective

Audit the complete Paskihub frontend, align its API usage with the backend
implementation, fix confirmed issues in controlled batches, and produce an
evidence-based production-readiness assessment.

The work preserves the existing UI direction and repository architecture.
Backend code is inspected but not modified unless the user gives a separate,
explicit instruction.

## 2. Delivery Strategy

Use a risk-first, staged program instead of a single project-wide rewrite.

1. Establish an audit baseline and inventory.
2. Fix authentication and security risks.
3. Align API contracts and replace supported mock data.
4. Fix build, type, runtime, and operational stability issues.
5. Improve accessibility, performance, metadata, and UX defects.
6. Run final regression verification and publish final reports.

Each batch must be independently reviewable, narrowly scoped, and verified
before the next batch begins. Confirmed cross-cutting infrastructure issues may
be fixed once and then applied consistently across modules.

## 3. System Boundaries

### 3.1 Frontend

The audit covers:

- App Router routes, layouts, loading states, and error states
- Authentication, middleware, sessions, role redirects, and authorization
- Zod schemas and TypeScript domain contracts
- Services, native `fetch` configuration, cache policy, and error parsing
- Server Actions, mutation handling, and path revalidation
- Admin, Organizer, Peserta, public, and authentication modules
- Forms, uploads, dashboards, tables, pagination, and status workflows
- Environment configuration, dependencies, tests, lint, format, and builds
- Accessibility, metadata, performance, empty states, and error states

Generated or library-style `src/components/ui` files are not changed unless a
confirmed issue requires a focused correction.

### 3.2 Backend

The backend is read-only evidence for:

- Registered routes and middleware
- Controllers and request binding
- Services/use cases and business rules
- Repositories where response behavior depends on persistence
- Request DTOs, response DTOs, models, enums, and pagination
- JWT/authentication and role authorization
- Error response conventions and status codes
- Upload validation and private-file authorization
- Environment requirements, seed data, and Swagger documentation

When Swagger differs from executable backend code, the implemented backend
route and handler behavior wins. The mismatch is documented.

## 4. Audit Baseline

Before behavior changes, create a traceable inventory for every significant
frontend module:

| Area | Required evidence |
| --- | --- |
| Purpose | User goal and supported workflow |
| Surface | Routes, pages, components, schemas, services, and actions |
| Access | Allowed roles and enforcement points |
| Data | Displayed data, forms, mutations, uploads, and state transitions |
| Backend | Actual endpoints, methods, payloads, responses, errors, and auth |
| Alignment | Match, partial match, missing support, obsolete code, or mock |
| Readiness | Confirmed defects, risks, test gaps, and recommended action |

Baseline verification records the exact results of:

```bash
npm run typecheck
npm run lint
npm run test
npm run format
npm run build:prod
```

A failed command is evidence to investigate, not a reason to suppress checks.
Environment-dependent failures must be separated from code defects.

## 5. Remediation Batches

### 5.1 Authentication and Security

Review token/session lifecycle, NextAuth callbacks, middleware and layout
protection, role checks, API key handling, sensitive logging, file access,
upload validation, redirects, and user-facing auth failures.

Security fixes take priority over feature completeness. Authorization must be
enforced server-side; hidden UI alone is not considered protection.

### 5.2 API Contracts and Real Data

For each frontend call:

1. Trace the backend route to its handler and DTO.
2. record method, path, headers, auth, request, response, and errors;
3. compare the service and Zod schema;
4. correct confirmed mismatches;
5. route client mutations through Server Actions where appropriate; and
6. remove mock or placeholder data only when backend support exists.

Unsupported frontend requirements remain documented gaps. No endpoints or
fields are invented.

### 5.3 Production Stability

Address TypeScript, lint, test, format, build, runtime, environment, caching,
loading, error, empty-state, and broken-navigation defects. Refactoring remains
limited to what is needed for correctness or to remove meaningful duplication.

The installed dependency state is authoritative during verification. Version
drift between project instructions and `package.json` is reported rather than
silently assumed.

### 5.4 UI Quality

Apply focused accessibility, performance, metadata, responsive, and UX fixes
without redesigning the product. Preserve established components and visual
patterns. Significant frontend changes receive browser-based functional and
visual verification when the local application can run.

## 6. Error Handling and Data Safety

- Parse backend data with Zod before exposing it to application code.
- Convert backend and transport failures into predictable service/action
  results without leaking credentials or internal details.
- Keep auth-sensitive and frequently changing dashboard requests uncached
  unless the backend contract and UX justify another policy.
- Validate files and mutation inputs at trust boundaries.
- Preserve backend status semantics where the UI needs actionable feedback.
- Never log access tokens, API keys, passwords, or sensitive personal data.

## 7. Verification Model

Verification scales with the affected behavior:

- Unit tests for schemas and deterministic utilities
- Focused action/service tests where existing patterns support them
- Typecheck and lint after each implementation batch
- Relevant test suite after focused changes
- Production build at stable checkpoints and final completion
- Browser checks for changed interactive user flows
- Cross-role regression checks for Admin, Organizer, and Peserta

No batch is called complete without fresh command or browser evidence.
Pre-existing unrelated failures are documented separately and are not hidden.

## 8. Documentation Deliverables

The following files are living artifacts:

1. `docs/frontend-project-analysis.md`
2. `docs/frontend-module-analysis.md`
3. `docs/backend-api-contract-summary.md`
4. `docs/frontend-backend-api-alignment.md`
5. `docs/frontend-production-readiness-audit.md`
6. `docs/frontend-api-integration-plan.md`
7. `docs/frontend-production-fix-plan.md`
8. `docs/frontend-api-integration-final-report.md`
9. `docs/frontend-production-readiness-final-report.md`

The first seven are established during baseline analysis and updated as facts
change. The two final reports are completed only after remediation and final
verification; before then, they may explicitly show an in-progress status.

Findings use stable identifiers, severity, evidence, affected modules,
recommended action, implementation status, and verification evidence so the
same issue can be tracked across documents without duplication.

## 9. Checkpoints and Change Control

- Baseline audit completes before broad implementation.
- Each risk batch has an explicit scope derived from confirmed findings.
- Unrelated working-tree changes are preserved.
- Backend changes require separate user approval.
- New dependencies require a demonstrated need.
- A serious unresolved issue prevents an unconditional production-ready claim.
- Discoveries that materially expand scope are added to the backlog and
  prioritized instead of being folded into an uncontrolled refactor.

## 10. Completion Criteria

The program is complete when:

- every significant frontend module has an audit record;
- every frontend API integration is mapped to backend evidence or marked as an
  unsupported requirement;
- supported production flows no longer depend on accidental mock data;
- confirmed critical and high-risk frontend defects are fixed or explicitly
  accepted by the user;
- required verification has fresh recorded results;
- all nine required documents reflect final implementation status; and
- the final readiness report clearly states whether deployment is recommended,
  conditionally recommended, or blocked, with remaining risks.

## 11. Explicit Non-Goals

- Rewriting the application from scratch
- Casual visual redesign
- Modifying backend behavior without explicit authorization
- Inventing missing backend capabilities
- Eliminating every low-value style issue unrelated to production risk
- Claiming readiness solely because the project compiles

## 12. Approved Decisions

- Execution is staged rather than big-bang.
- Work is prioritized by risk.
- Priority order is security/auth, API and mock-data alignment, production
  stability, then UX/accessibility/performance.
- Backend implementation is the API source of truth and remains read-only.
- Existing UI/UX direction is preserved.
