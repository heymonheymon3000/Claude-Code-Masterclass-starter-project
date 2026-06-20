# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Pocket Heist** is a web app for organizing lighthearted office missions — "Tiny missions. Big office mischief." Users create "heists," assign them to others, and track active, assigned, and expired heists. The project is the starter scaffold for the Claude Code Masterclass, so it is built out incrementally rather than feature-complete.

## Commands

```bash
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run lint      # run ESLint (next core-web-vitals + typescript configs)
npm test          # run all tests (Vitest)
npx vitest run tests/components/AuthForm.test.tsx   # run a single test file
npx vitest run -t "renders email, password"         # run a single test by name
```

## Architecture

**Next.js App Router** with two route groups that share separate layouts:

- `app/(public)/` — unauthenticated pages (splash `/`, `/login`, `/signup`, `/preview`). No navbar. The root `/` page is intended as a redirect shim: logged-in users go to `/heists`, guests go to `/login` (redirect logic not yet implemented).
- `app/(dashboard)/` — authenticated pages rendered behind a `Navbar`. All heist routes live here: `/heists`, `/heists/create`, `/heists/[id]`.

Pages are largely static shells — no data layer or auth is wired up yet. The `AuthForm` component (`components/AuthForm/`) is the first stateful `"use client"` component: it demonstrates the pattern for interactive, state-driven components that still live in the `components/` directory rather than inline in a page.

**Styling (Tailwind CSS v4):** There is no `tailwind.config.js`. Tailwind is configured entirely in `app/globals.css` via `@import "tailwindcss"` and an `@theme {}` block that defines all design tokens (`--color-*`, `--font-sans`). Add or change theme colors/fonts there, not in a JS config. Component stylesheets must reference globals with `@reference "../../app/globals.css"` to access `@apply` utilities and CSS custom properties.

**Global CSS utilities** defined in `app/globals.css` that are reused across pages:

| Class | Purpose |
|---|---|
| `.btn` | Primary action button (purple, hover → pink) |
| `.center-content` | Full-viewport-height flex column, vertically centered |
| `.page-content` | Responsive max-width container |
| `.form-title` | Centered, bold page heading |

**Icons:** `lucide-react` is installed and used in `Navbar`. For one-off icons within components (e.g. the password show/hide toggle), prefer inline SVGs to avoid importing a library for a single glyph.

**Path alias:** `@/` maps to the project root (e.g. `import AuthForm from "@/components/AuthForm"`).

**Testing:** Vitest + Testing Library in a jsdom environment. Globals (`describe`, `it`, `expect`) are enabled in `vitest.config.mts` but test files import them explicitly for clarity. `vitest.setup.ts` loads `@testing-library/jest-dom/vitest` matchers. Tests live under `tests/` mirroring the source tree. Use `@testing-library/user-event` (not `fireEvent`) for simulating user interactions.

**Component conventions:** Components in `components/` follow a directory-per-component pattern — `ComponentName.tsx`, an optional `ComponentName.module.css`, and a barrel `index.ts` that re-exports the default. Client components that require state or event handlers use the `"use client"` directive at the top of the `.tsx` file.

## Feature workflow

New features follow a spec → plan → implement cycle:

- `_specs/<feature-slug>.md` — functional requirements and acceptance criteria (created by `/spec`)
- `_plans/<feature-slug>.md` — implementation approach and file list (created in plan mode)

Feature branches are named `claude/feature/<feature-slug>`.

- **important:** When implementing any library/framework-specific features, always check the appropriate library/framework documentation using the Context7 MCP server before writing any code.
ccmasterclass
https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=0-1&t=SathVy3svbESSYV9-1
