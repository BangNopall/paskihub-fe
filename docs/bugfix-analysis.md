# Bugfix Analysis Report

## Bug 1: Wallet coin balance affected by future exchange rate changes
**Root Cause:**
- The `Wallet` entity only stores `Saldo` (in IDR). 
- The `CoinBalance` displayed in the dashboard is calculated dynamically as `wallet.Saldo / current_setting.CoinRate`.
- When the `CoinRate` setting is updated by the admin, the displayed coin balance shrinks or grows because the IDR amount is static, causing the user to lose their previously purchased coins.
- In `eo_team_service.go`, the approval fee uses the dynamic `setting.CoinRate` to calculate `totalFeeIDR := setting.ApprovalFee * setting.CoinRate`, further affecting purchasing power.

**Proposed Solution:**
1. Add `CoinRateSnapshot float64` to `WalletTransaction` to lock the rate at transaction time.
2. Add `CoinBalance float64` to `Wallet` to act as the true source of truth for the organizer's coin balance.
3. Update top-up approval logic to increment both `Saldo` (IDR) and `CoinBalance` (Coins).
4. Update team approval logic to decrement `CoinBalance` by `setting.ApprovalFee` and decrement `Saldo` proportionally.
5. Update `dashboard_repository.go` to return `wallet.CoinBalance` directly instead of dynamically computing it.

## Bug 2: Event category/school level validation bypass
**Root Cause:**
- In `participant_event_impl.go`, the `RegisterEvent` function validates if the team belongs to the user and if the member count is within limits.
- However, it **does not** validate if the team's `InstitutionType` (e.g., SD, SMP, SMA) matches the selected `EventLevel.Name` (which the frontend correctly sets to "SD", "SMP", "SMA", "UMUM", or "PURNA").

**Proposed Solution:**
1. Inject a strict validation rule in `participant_event_impl.go` during `RegisterEvent`:
   `if string(team.Institution.InstitutionType) != level.Name { return error }`
   This will immediately block a team registered as "SMA" from registering into an "SD" event level.

## Bug 3: Location filter in participant event search
**Root Cause:**
- The location filter is only implemented in the frontend client component (`MyEventClient.tsx`) as a local state filter over an array. 
- The backend `GetOpenEvents` endpoint in `participant_event_controller.go` does not accept or process query parameters like `?location=jakarta`.

**Proposed Solution:**
1. Update `ParticipantEventController.GetOpenEvents` to extract `location` and `search` query parameters.
2. Pass these parameters down to `participant_event_impl.go` (Repository layer) to append a `WHERE LOWER(location) LIKE ?` clause.
3. In the frontend, update `MyEventClient.tsx` to push URL parameters (`router.push('?location=...')`) instead of filtering client-side.
4. Update `page.tsx` to pass `searchParams` to `getOpenEvents`.

## Bug 4: Payment proof file returns "Not Found" for Organizer
**Root Cause:**
- The private file endpoint logic in `private_file_service.go` reads the file path from the database (which starts with a leading slash due to how `saveFile` is implemented: `return "/" + filepath.ToSlash(...)`).
- For paths starting with `/public/`, it trims the leading slash. But for paths starting with `/storage/`, it leaves the leading slash intact.
- Calling `os.Stat("/storage/private/payments/...")` checks the root of the host filesystem instead of the relative project directory, leading to a `404 Not Found` error.

**Proposed Solution:**
1. In `private_file_service.go` -> `ResolvePrivateFile`, unconditionally strip the leading slash using `strings.TrimPrefix(path, "/")`.
2. This ensures `os.Stat` correctly resolves `storage/private/...` relative to the backend's working directory.
