# Spec for Authentication Forms

branch: claude/feature/auth-forms

## Summary
- Add interactive login and signup forms to their respective pages (`/login` and `/signup`)
- Each form includes email, password (with show/hide toggle), and a submit button
- On submit, form data is logged to the console (no backend integration yet)
- Users can easily navigate between the login and signup forms via a link/toggle

## Functional Requirements
- The `/login` page renders a login form with:
  - An email input field
  - A password input field with a show/hide password icon toggle
  - A "Log In" submit button
  - A link/prompt to switch to the signup form (e.g. "Don't have an account? Sign up")
- The `/signup` page renders a signup form with:
  - An email input field
  - A password input field with a show/hide password icon toggle
  - A "Sign Up" submit button
  - A link/prompt to switch to the login form (e.g. "Already have an account? Log in")
- The show/hide password toggle changes the password input type between `password` and `text`
- On form submission, the email and password values are logged to the browser console
- The form does not navigate away or make any network requests on submit

## Possible Edge Cases
- Submitting the form with empty fields should still log (no validation required yet)
- The password toggle should work independently for each form
- Switching between login and signup should navigate to the other page without losing the toggle state unexpectedly

## Acceptance Criteria
- `/login` displays a form with email, password (with toggle), and "Log In" button
- `/signup` displays a form with email, password (with toggle), and "Sign Up" button
- Clicking the eye/hide icon toggles password visibility on both forms
- Submitting either form logs `{ email, password }` to the console
- Each form has a clearly visible link to switch to the other form
- Navigation between `/login` and `/signup` works correctly

## Open Questions
- Should the show/hide icon use a specific icon library already in the project, or can we use a simple SVG inline? Use a simple SVG inline
- Should the "switch form" link be a styled button, plain anchor, or Next.js `<Link>`? Nextjs `<Link>`

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Login form renders email input, password input, and submit button
- Signup form renders email input, password input, and submit button
- Password visibility toggle changes input type from `password` to `text` and back
- Submitting the login form calls `console.log` with the entered email and password
- Submitting the signup form calls `console.log` with the entered email and password
- The "switch to signup" link on the login page points to `/signup`
- The "switch to login" link on the signup page points to `/login`
