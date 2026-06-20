# Plan: Signup Firebase Auth

## Context
The signup form (`AuthForm` in `mode="signup"`) currently only logs credentials to the console. This feature wires it to Firebase Authentication, generates a random PascalCase codename as the user's display name, and writes a minimal user document to Firestore (no email stored). Only the Firebase Web SDK is used.

---

## Files to Create

### 1. `lib/firebase/firestore.ts` (new)
Export a Firestore singleton derived from the existing app instance — same pattern as `lib/firebase/auth.ts`:
```
import { getFirestore } from "firebase/firestore";
import app from "./config";
export const db = getFirestore(app);
```

### 2. `lib/generateCodename.ts` (new)
Pure function that generates a random PascalCase codename by picking one word from each of three word arrays (e.g. adjectives, colours, animals) and capitalising each. Returns a string like `SwiftCrimsonFox`.
- Three separate arrays of unique words (10–15 words each is enough)
- Each call picks one random word per array via `Math.random()`
- Joins them capitalised: `word1[0].toUpperCase() + word1.slice(1) + ...`
- No side effects — pure function, easy to test

---

## Files to Modify

### 3. `components/AuthForm/AuthForm.tsx`
All changes are scoped to the `mode === "signup"` path — the login path is left untouched.

**Add:**
- `error: string | null` state (initially `null`)
- `useRouter` from `next/navigation` for the post-signup redirect
- Imports: `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`; `doc`, `setDoc` from `firebase/firestore`; `auth` from `@/lib/firebase/auth`; `db` from `@/lib/firebase/firestore`; `generateCodename` from `@/lib/generateCodename`

**Replace `handleSubmit` signup logic:**
1. Wrap in try/catch
2. Call `createUserWithEmailAndPassword(auth, email, password)`
3. Generate codename via `generateCodename()`
4. Call `updateProfile(result.user, { displayName: codename })`
5. Call `setDoc(doc(db, "users", result.user.uid), { codename, id: result.user.uid })`
6. On success: `router.push("/heists")`
7. On error: set `error` to a human-readable message from the Firebase error

**Add error display in JSX:** render `error` string in the form when non-null (below the submit button, using a simple red text element — no new CSS class needed, use Tailwind `text-red-500 text-sm`).

The login branch of `handleSubmit` keeps the existing `console.log` — no change.

---

## Files to Create (Tests)

### 4. `tests/lib/generateCodename.test.ts` (new)
Unit tests — no mocking needed, pure function:
- Returns a non-empty string
- Result is PascalCase (each word starts with uppercase, no spaces)
- Contains words from all three sets (assert length > some minimum)
- Two consecutive calls return different results (run 5 times, assert not all identical)

### 5. `tests/components/AuthForm.signup.test.tsx` (new)
Integration tests for the signup path. Mirror mock patterns from `tests/contexts/UserContext.test.tsx`:
- `vi.mock("@/lib/firebase/auth", () => ({ auth: {} }))`
- `vi.mock("@/lib/firebase/firestore", () => ({ db: {} }))`
- `vi.mock("firebase/auth", () => ({ createUserWithEmailAndPassword: vi.fn(), updateProfile: vi.fn() }))`
- `vi.mock("firebase/firestore", () => ({ doc: vi.fn(), setDoc: vi.fn() }))`
- `vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))`
- `vi.mock("@/lib/generateCodename", () => ({ generateCodename: () => "SwiftCrimsonFox" }))`

**Test cases:**
- On valid submit: `createUserWithEmailAndPassword` is called with email + password
- On success: `updateProfile` is called with the generated codename as `displayName`
- On success: `setDoc` is called with `{ codename, id }` (no email)
- On success: router `push("/heists")` is called
- On Firebase error: an error message is rendered in the form

---

## Reuse
- `lib/firebase/auth.ts` — existing `auth` singleton, import directly
- `lib/firebase/config.ts` — `app` default export, used by the new `firestore.ts`
- Mock pattern: established in `tests/contexts/UserContext.test.tsx`
- CSS: existing `AuthForm.module.css` classes unchanged; use Tailwind utility for error text

---

## Verification
1. `npm test` — all existing tests still pass; new tests pass
2. `npm run dev` — visit `/signup`, create a new account, confirm redirect to `/heists`
3. Firebase Console → Authentication: verify user was created
4. Firebase Console → Firestore → `users` collection: verify document has `codename` + `id` only (no email)
