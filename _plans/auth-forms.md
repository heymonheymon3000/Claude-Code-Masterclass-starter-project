# Plan: Authentication Forms (login + signup)

## Context
The `/login` and `/signup` pages are currently static shells with only a title. This plan wires up interactive forms with email, password (with show/hide toggle), a submit button, and a link to switch between the two pages. Submitted values are logged to the console only — no backend or navigation yet.

The open questions in the spec have been resolved:
- Eye toggle icon: simple inline SVG (not lucide-react)
- Switch-form link: Next.js `<Link>`

---

## Approach: Shared `AuthForm` component

The two forms are nearly identical. A single `AuthForm` component parameterised by `mode: "login" | "signup"` is the cleanest approach and avoids duplication.

---

## Files to Create / Modify

### 1. `components/AuthForm/AuthForm.tsx` _(new)_
A `"use client"` component (needs state). Props: `{ mode: "login" | "signup" }`.

- State: `email`, `password`, `showPassword` (boolean)
- On submit: `console.log({ email, password })` + `e.preventDefault()`
- Password field: `type={showPassword ? "text" : "password"}` with an inline SVG toggle button
- Submit label: `"Log In"` when `mode === "login"`, `"Sign Up"` when `mode === "signup"`
- Switch link: Next.js `<Link>` — login page shows "Don't have an account? Sign up" → `/signup`; signup page shows "Already have an account? Log in" → `/login`
- Reuse global CSS classes: `.center-content`, `.page-content`, `.form-title`, `.btn`

### 2. `components/AuthForm/AuthForm.module.css` _(new)_
- `@reference "../../app/globals.css"` at top
- Styles for: form layout, input fields, password wrapper (relative positioning for the toggle), toggle button, switch link
- Use CSS custom properties: `--color-primary`, `--color-body`, `--color-light`, `--color-lighter`, `--color-error`

### 3. `components/AuthForm/index.ts` _(new)_
```ts
export { default } from "./AuthForm"
```

### 4. `app/(public)/login/page.tsx` _(modify)_
Replace the static shell with:
```tsx
import AuthForm from "@/components/AuthForm"
export default function LoginPage() {
  return <AuthForm mode="login" />
}
```

### 5. `app/(public)/signup/page.tsx` _(modify)_
Replace the static shell with:
```tsx
import AuthForm from "@/components/AuthForm"
export default function SignupPage() {
  return <AuthForm mode="signup" />
}
```
Also fix the existing bug: function is currently named `SignupPage` in both files.

---

## Tests: `tests/components/AuthForm.test.tsx` _(new)_

Follows the same pattern as `Avatar.test.tsx` and `Navbar.test.tsx`:
- `render`, `screen` from `@testing-library/react`
- `userEvent` from `@testing-library/user-event` (for typing + clicking)
- `vi.spyOn(console, "log")` to assert console output

Test cases (matching spec):
1. Login form renders an email input, password input, and "Log In" button
2. Signup form renders an email input, password input, and "Sign Up" button
3. Password toggle changes input type from `password` → `text` → `password`
4. Submitting login form calls `console.log` with entered email and password
5. Submitting signup form calls `console.log` with entered email and password
6. Login page switch link has `href="/signup"`
7. Signup page switch link has `href="/login"`

---

## Verification
1. `npm test` — all 7 new AuthForm tests pass alongside existing tests
2. `npm run dev` — visit `/login`: form renders, typing works, eye toggle works, submit logs to console, "Sign up" link navigates to `/signup`
3. Visit `/signup`: same checks, "Log in" link navigates to `/login`
