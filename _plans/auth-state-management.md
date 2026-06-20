# Plan: Auth State Management with useUser Hook

## Context
The app has Firebase installed and a Firestore database configured, but no auth state management exists. No context providers, no user references, and no Firebase Auth integration are anywhere in the codebase. This feature adds a global real-time Firebase Auth listener and exposes the current user (or `null`) to any component via a `useUser` hook — without touching sign-up, login, or logout flows.

## Decisions
- `useUser()` returns `{ user: User | null, loading: boolean }` (single hook, single import)
- `UserProvider` lives in the **root layout** (`app/layout.tsx`) so auth state is available on all pages, including public ones (needed later for redirect logic on `/`)

---

## Files to Create

### 1. `lib/firebase/auth.ts` (new)
Export a Firebase Auth instance derived from the existing app singleton.
```
import { getAuth } from 'firebase/auth';
import app from './config';
export const auth = getAuth(app);
```

### 2. `contexts/UserContext.tsx` (new)
- `"use client"` directive — uses React hooks and a Firebase listener
- Creates `UserContext` with shape `{ user: User | null, loading: boolean }`
- `UserProvider` subscribes to `onAuthStateChanged(auth, ...)` on mount; unsubscribes on unmount
- Initial state: `{ user: null, loading: true }` — resolves to the real state on first emission
- `useUser()` reads from context and **throws a descriptive error** if called outside `UserProvider`

---

## Files to Modify

### 3. `app/layout.tsx`
- Import `UserProvider` from `@/contexts/UserContext`
- Wrap `{children}` with `<UserProvider>` inside the `<body>` tag
- Keep the layout as a Server Component — rely on `UserProvider`'s own `"use client"` boundary (preferred over converting the root layout)

---

## Files to Create (Tests)

### 4. `tests/contexts/UserContext.test.tsx` (new)
Mirror the patterns from `tests/components/AuthForm.test.tsx`:
- Explicit imports from `vitest`
- `vi.mock('firebase/auth')` to mock `onAuthStateChanged`
- `renderHook` from `@testing-library/react` with a wrapper supplying `UserProvider`
- `afterEach(() => { vi.restoreAllMocks(); })`

**Test cases:**
1. Returns `{ user: null, loading: true }` before auth resolves
2. Returns `{ user: null, loading: false }` when auth resolves to no user
3. Returns `{ user: <User>, loading: false }` when auth resolves to a signed-in user
4. Calling `useUser()` outside `UserProvider` throws a descriptive error

---

## Reuse
- Firebase app singleton: `lib/firebase/config.ts` (default export `app`) — do not re-initialize
- Test conventions: match `tests/components/AuthForm.test.tsx` exactly (explicit imports, `afterEach` cleanup)

---

## Verification
1. `npm test` — all 4 new test cases pass alongside existing tests
2. `npm run dev` — no runtime errors on any page (`/`, `/login`, `/heists`, etc.)

## Out of Scope
- Do not use the hook anywhere in the application yet.
