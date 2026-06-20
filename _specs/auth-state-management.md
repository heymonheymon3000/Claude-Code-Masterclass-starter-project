# Spec for Auth State Management

branch: claude/feature/auth-state-management

## Summary
- Add a global, real-time Firebase Auth listener that tracks the current user across the app.
- Expose the current user via a `useUser` hook that any page or component can call.
- The hook returns the Firebase `User` object when logged in, or `null` when logged out.
- No sign-up, login, or logout UI is in scope for this feature.

## Functional Requirements
- A `UserProvider` context provider wraps the app and subscribes to Firebase Auth's `onAuthStateChanged` listener on mount.
- The listener updates shared state in real time whenever the auth state changes (login, logout, token refresh).
- The listener is unsubscribed when the provider unmounts to avoid memory leaks.
- A `useUser` hook reads from the context and returns the current user value.
- `useUser` must be usable from any client component or page inside the provider tree without prop drilling.
- While the initial auth state is being resolved, the provider exposes a loading flag so consumers can avoid flash-of-wrong-content.
- The hook throws a clear error if called outside of `UserProvider`.

## Possible Edge Cases
- Auth state is asynchronous on first load — components must handle the initial `undefined`/loading state before `null` or a `User` is known.
- Token expiry or network interruptions may trigger repeated `onAuthStateChanged` calls; the listener handles this automatically via Firebase.
- Multiple components calling `useUser` simultaneously must all receive the same shared reference, not separate listeners.

## Acceptance Criteria
- `useUser()` returns `null` when no user is signed in.
- `useUser()` returns a Firebase `User` object when a user is signed in.
- Calling `useUser()` outside `UserProvider` throws a descriptive error.
- Any existing component that references a user can consume `useUser()` without additional prop changes.
- No sign-up, login, or logout logic is introduced by this feature.
- Auth state updates propagate to all subscribed components in real time without a page refresh.

## Open Questions
- Should the loading state be part of the hook return value (e.g. `{ user, loading }`) or a separate `useUserLoading` hook? Whatever you recommend.
- Should `UserProvider` live in the root layout or only in the dashboard layout (authenticated pages)? Whatever you recommend.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `useUser` returns `null` when the auth state resolves to no user.
- `useUser` returns a user object when the auth state resolves to a signed-in user.
- `useUser` reflects loading state correctly before auth resolves.
- Calling `useUser` outside of `UserProvider` throws an error.
