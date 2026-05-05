# Session Expiry System Design

## Objective

Implement a proactive session expiry system that synchronizes NextAuth.js session lifetime with the GoFiber backend's 1-hour JWT expiration. When the token expires, users should be automatically redirected to the login page.

## Architecture & Data Flow

1. **Token Decoding:** A utility function decodes the backend JWT payload to extract the `exp` (expiration) timestamp.
2. **NextAuth Configuration (`src/lib/auth.ts`):**
   - **`authorize`:** Decodes the token upon successful login and attaches the `exp` value.
   - **`jwt` callback:** Stores the expiration time (`accessTokenExpires`). Checks if the current time exceeds the expiration. If expired, it sets an `error: "SessionExpired"` flag on the token.
   - **`session` callback:** Passes the `error` flag from the token to the session object.
   - **`session` options:** Sets `maxAge` to 1 hour (3600 seconds) to match the backend token.
3. **Middleware (`src/middleware.ts`):** Intercepts requests to protected routes. If it detects `token.error === "SessionExpired"`, it redirects the user to `/auth/login`.
4. **TypeScript Definitions:** Extends `next-auth` module definitions to include `accessTokenExpires` and `error` properties for type safety.

## Components & Implementation Details

### 1. JWT Utility

A new lightweight utility function inside `src/lib/auth.ts` to parse the JWT payload without relying on heavy external libraries.

```typescript
function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  } catch (e) {
    return null
  }
}
```

### 2. NextAuth Configuration (`src/lib/auth.ts`)

- Update `callbacks.jwt` to handle expiration logic.
- Update `callbacks.session` to propagate the error.
- Add type augmentations for `next-auth` and `next-auth/jwt`.

### 3. Middleware Updates (`src/middleware.ts`)

Add a check at the beginning of the middleware logic to handle `SessionExpired` error and clear cookies.

## Error Handling & Edge Cases

- **Invalid Tokens:** If the JWT cannot be parsed, it falls back gracefully.
- **Clock Skew:** A small buffer can be accounted for if needed, but for now, we follow the exact `exp` from the backend.

## Testing Strategy

- **Manual Verification:** Log in, wait for expiry (or simulate by hardcoding), and verify the redirect.
- **Type Checking:** Run `npm run typecheck` to ensure the extended NextAuth types are correctly applied.
