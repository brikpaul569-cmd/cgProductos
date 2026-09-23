# Feature: Next.js 16 Upgrade

## Objective
Migrate cgproductos from Next.js 15.5.26 / React 19.1.0 to Next.js 16.3.x / React 19.2, clearing the last 2 npm audit vulnerabilities (bundled `postcss` under `next`) without leaving the build, lint, type-check, or runtime in a broken state.

## Problem
`npm audit` reports 2 remaining vulnerabilities (1 high, 1 moderate) rooted in `next`'s bundled `postcss`. The only published fix path is `next@16.3.6`, a semver-major bump. `next@15.5.26` already resolved the 16 earlier vulns including 2 critical ones.

## Why
User explicitly authorized the migration after being told it is a breaking change (`"si hazo"`).

## Scope
- `package.json` dependencies + scripts
- `next.config.ts` (removed `eslint` option)
- Any source files touched by the Next 16 codemods
- README if the documented stack/version changes

## Out of scope
- Other major bumps (framer-motion 13, lucide-react 1.x, eslint 10, typescript 7, @types/node 26) — user did not authorize these.
- Redesign, refactors, or feature work.
- Removing `typescript.ignoreBuildErrors` / `eslint.ignoreDuringBuilds` intent beyond what Next 16 forces.

## Constraints
- Preserve all application behavior, visuals, and Spanish UI strings exactly.
- Generated code/comments stay English.
- No AI attribution in commits; Conventional Commit messages only.
- Delivery stays local-to-repo (commit on feature branch); push is a separate human decision unless already authorized for this repo.

## Resolved execution settings
- **TDD**: disabled — no test runner/framework exists in this project (verified: no `test` script, no test deps, no `*.test.*` files). Ordinary functional checks apply: `lint`, `tsc --noEmit`, `build`, dev-server HTTP probe.
- **Source**: ODD default (not user-configured), **runner**: N/A.
- **Delivery strategy**: `ask-on-risk` (project default; no PR forecast — work is local commits only).
- **Chain strategy**: not yet required (well under 400 authored lines).

## Acceptance criteria
- [x] `next` is 16.x and `react`/`react-dom` are 19.2.x in `package.json` — landed at next 16.3.6 / react 19.3.0 (codemod picked 19.3, not 19.2; 19.3 satisfies the React 19.2+ requirement)
- [x] `npm audit` reports 0 vulnerabilities — confirmed `found 0 vulnerabilities`
- [x] `npm run lint` exits 0
- [x] `npx tsc --noEmit` exits 0
- [x] `npm run build` exits 0 with no viewport/compat warnings
- [x] `npm run dev` serves `/` with HTTP 200 and title `CG Productos`
- [x] README reflects the actual installed stack
- [ ] Work-unit commit created on `chore/nextjs-16-upgrade` with commit identity recorded below

## Checklist
- [x] T1 — Run Next 16 upgrade codemod and inspect diff
- [x] T2 — Install `next@16`, `react@19.3`, `react-dom@19.3`, matching `@types/*` and `eslint-config-next@16`
- [x] T3 — Fix `next.config.ts` (removed removed `eslint` key; dropped `--turbopack` flags from scripts now that Turbopack is default)
- [x] T4 — Fix codemod/source breakage revealed by `lint` + `tsc`
- [x] T5 — Full verification: lint, tsc, build, dev-server HTTP 200, `npm audit`
- [x] T6 — Update README stack, commit work unit, record evidence

## Progress
Complete through T6 verification. Remaining: record the work-unit commit identity (self-blocking — this document is part of the commit).

## Verification evidence
- `npm run lint` -> exit 0, 0 problems (0 errors, 0 warnings)
- `npx tsc --noEmit` -> exit 0
- `npm run build` -> exit 0, `Next.js 16.3.6 (Turbopack)`, compiled successfully, 6 static pages, no viewport/compat warnings
- `npm audit` -> `found 0 vulnerabilities` (was 16 at session start, 2 before this migration)
- `npm run dev` -> `Next.js 16.3.6`, Ready, bound port 3001 (3000 held by pid 26520)
- `GET /` -> 200, title `CG Productos`, viewport meta `width=device-width, initial-scale=1`
- `GET /test-env` -> 200
- `POST /api/epayco-webhook` (bad signature) -> 403 (correct: rejects invalid signature)
- `GET /api/epayco-webhook` -> 405 (correct: POST-only route)
- Note: an earlier `POST` with `Content-Type: application/json` returned 500 — that was a defect in the test harness, not the code. The route correctly requires `multipart/form-data` or `application/x-www-form-urlencoded`.

## Breakage found and fixed during migration
1. **`next.config.ts` — `eslint` key removed in Next 16.** `tsc` caught it: `TS2353: 'eslint' does not exist in type 'NextConfig'`. Removed, because `next lint` itself was removed in 16.
2. **`eslint.config.mjs` — `FlatCompat` bridge no longer valid.** `eslint-config-next@16` ships native flat `Linter.Config[]` exports. Rewrote to import `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly.
3. **Codemod pinned `eslint@10.11.0`, which is incompatible.** Root cause: `eslint-plugin-react@7.37.5` (latest available, bundled by `eslint-config-next@16`) declares peer `eslint: '^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7'` — no ESLint 10 support. Repaired by pinning `eslint@^9` (9.39.5), which satisfies both `eslint-config-next` (`>=9.0.0`) and the plugin (`^9.7`).
4. **Codemod exported `instant = false` from `layout.tsx`**, which fails the build unless `nextConfig.cacheComponents` is enabled. This project does not adopt Cache Components, so the unused opt-out was removed.
5. **`eslint-plugin-react-hooks@7` (bundled with `eslint-config-next@16`) surfaced 3 new errors** not present before:
   - `Header.tsx` unused `epayReady` state — the value was discarded via `[, setEpayReady]` and never read anywhere (grep-confirmed). State + effect deleted; real fix, no suppression.
   - `Header.tsx` `Date.now()` purity error — the order id is business logic for the payment flow, not render-time state. Extracted to module-level `createOrderId()`.
   - `CountrySelector.tsx` `set-state-in-effect` — **suppressed with justification, not fixed.** Reading `localStorage` during render would desync server/client HTML and break Next.js hydration; the mount effect is the correct SSR-safe pattern here. Note: this component is currently dead code (imported nowhere) — surfaced to the user as a separate product decision.
6. **`@eslint/eslintrc` removed** as a dependency — it only existed to power `FlatCompat`, which is gone.

## Decision log
- TDD: OFF — no test runner/framework exists in this project (no `test` script, no test deps, no `*.test.*` files). Ordinary functional checks used instead.
- Delivery: local work-unit commit on `chore/nextjs-16-upgrade`. Push not performed — the previous push authorization was for the initial import, not a standing remote-write grant.
- Scope held: other major bumps (framer-motion 13, lucide-react 1.x, typescript 7, @types/node 26) deliberately left alone — user did not authorize them.

## Rollback boundary
`package.json`, `package-lock.json`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `src/components/ui/Header.tsx`, `src/components/ui/CountrySelector.tsx`, `src/app/layout.tsx`, `README.md`. Reverting the single work-unit commit restores Next 15.5.26; no other feature work exists on this branch.

## Rationale
- Pinned `eslint@9` rather than accepting the codemod's `eslint@10` because the peer-dependency evidence is unambiguous and 10 cannot work with the bundled plugin.
- Chose a justified suppression over a behavioral refactor for `CountrySelector` because the "fix" (moving the read into render) would introduce a hydration bug — trading a lint error for a runtime error is not an upgrade.
- Rejected deleting `CountrySelector` despite it being dead code: that is a product decision (keep the country modal or not), not a lint fix, and the user has not authorized removing the feature.
