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
npx vitest run tests/components/Navbar.test.tsx   # run a single test file
npx vitest run -t "renders the Create Heist link" # run a single test by name
```

## Architecture

**Next.js App Router** with two route groups that share separate layouts:

- `app/(public)/` — unauthenticated pages (splash `/`, `/login`, `/signup`, `/preview`). No navbar. The root `/` page is intended as a redirect shim: logged-in users go to `/heists`, guests go to `/login` (redirect logic not yet implemented).
- `app/(dashboard)/` — authenticated pages rendered behind a `Navbar`. All heist routes live here: `/heists`, `/heists/create`, `/heists/[id]`.

This is an early-stage scaffold: pages are mostly static shells with no data layer, auth, or forms wired up yet.

**Styling (Tailwind CSS v4):** There is no `tailwind.config.js`. Tailwind is enabled via the `@tailwindcss/postcss` plugin (`postcss.config.mjs`) and configured entirely in `app/globals.css` using `@import "tailwindcss"` and an `@theme {}` block that defines the design tokens (`--color-*`, `--font-sans`). Add or change theme colors/fonts there, not in a JS config. Component styling mixes Tailwind utility classes (often via `@apply` in CSS) with CSS Modules.

**Path alias:** `@/` maps to the project root (e.g. `import Navbar from "@/components/Navbar"`).

**Testing:** Vitest + Testing Library in a jsdom environment, with globals enabled (no per-file imports of `describe`/`it`/`expect` required). `vitest.setup.ts` loads `@testing-library/jest-dom/vitest` matchers. Tests live under `tests/` mirroring the source tree.

**Component conventions:** Components in `components/` follow a directory-per-component pattern — `ComponentName.tsx`, an optional `ComponentName.module.css`, and a barrel `index.ts` that re-exports the default.
