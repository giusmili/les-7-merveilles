# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A French-language single-page showcase site ("Les Sept Merveilles du Monde") built on the Cloudflare `vinext-starter` template used by the OpenAI Sites hosting platform. It renders as a Next.js app but runs as a Cloudflare Worker via `vinext` + Vite, not the Next.js server.

## Commands

Run everything from the repo root. On **Windows**, several npm scripts embed POSIX inline env-var syntax (`VAR=x command`) that fails under `cmd.exe`/PowerShell (`'WRANGLER_LOG_PATH' n'est pas reconnu...`). Either run them from Git Bash, or set the var and call the underlying binary directly, e.g.:
```powershell
$env:WRANGLER_LOG_PATH=".wrangler/wrangler.log"; npx vite
```

- Install deps: `npm install` (or `npm run install:ci` for the CI-tuned, non-retrying `npm ci` — Linux-only, needs `flock`/GNU `timeout`, not meant to be re-run as part of a normal dev loop)
- Dev server: `npm run dev` (wraps `vite`; on Windows use `npx vite` directly per above)
- Build: `npm run build` (wraps `scripts/build-verified.sh`, Linux-only helper with a bounded timeout)
- Serve the built worker: `npm run start` (wraps `vinext start`)
- Lint: `npm run lint` (wraps `eslint . --ignore-pattern dist --ignore-pattern .next` via `scripts/sites-env.sh`, a bash env-sandboxing wrapper; on Windows run `npx eslint . --ignore-pattern dist --ignore-pattern .next` directly)
- Typecheck: `npx tsc --noEmit`
- Tests: `npm test` (runs `npm run build` first, then `node --test tests/*.test.mjs` — the tests import from `dist/`, so a stale/missing build makes them fail). Single test: build once, then e.g. `node --test tests/rendered-html.test.mjs`
- Drizzle migrations (only relevant if the DB scaffolding gets wired in): `npm run db:generate`

## Architecture

**The actual site is small and self-contained**: `app/page.tsx` (hardcoded `wonders` array driving both the card grid and the itinerary list), `app/layout.tsx`, and `app/globals.css` (hand-written CSS with hardcoded class names — Tailwind and the vendored shadcn theme are imported into the same file but the page itself doesn't use Tailwind utility classes). Everything else in the repo is starter scaffolding; the sections below explain what's real infrastructure vs. unwired boilerplate.

**Worker entrypoint**: `worker/index.ts` is the actual Cloudflare Worker `fetch` handler — it special-cases `/_vinext/image` for image optimization and otherwise delegates to vinext's `app-router-entry` handler. This is what `vite.config.ts` points at as the build's `main`.

**Binding types**: `worker-configuration.d.ts` is the single source of truth for the `Env` / `Cloudflare.Env` shape (`ASSETS`, `DB`, `IMAGES`). Both `worker/index.ts` and `db/index.ts` rely on this global declaration — extend it there when adding a binding rather than re-declaring `Env` locally in a file.

**Local binding simulation**: `vite.config.ts` reads `.openai/hosting.json` (`d1`/`r2` flags, populated by the hosting platform) to build a `localBindingConfig` passed to `@cloudflare/vite-plugin`, simulating whatever D1/R2 bindings the platform has provisioned.

**Unwired scaffolding** (present but not used by the current page — don't assume it's load-bearing):
- `components/ui/` (~60 files) + `hooks/use-mobile.ts` + `vendor/shadcn-tailwind-4.13.0.css`: the shadcn/ui registry, vendored verbatim. `eslint.config.mjs` deliberately relaxes lint rules on these paths since they're vendored, not hand-authored — don't "fix" lint issues in there by editing the files' logic.
- `db/`, `drizzle/`, `drizzle.config.ts`, `examples/d1/`: D1 + Drizzle scaffolding; `db/schema.ts` starts intentionally empty.
- `app/chatgpt-auth.ts`: optional server-only "Sign in with ChatGPT" (SIWC) helpers for the OpenAI Sites platform (`getChatGPTUser`, `requireChatGPTUser`, `chatGPTSignInPath`/`chatGPTSignOutPath`). The platform's dispatcher owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, and `/callback` — don't implement app routes at those paths. SIWC establishes identity only, not workspace membership.

**Tests exercise the starter's plumbing, not the page content**: `tests/rendered-html.test.mjs` checks that the built worker emits a dev-preview meta tag; `tests/ui-components.test.mjs` checks generated Tailwind utilities and a couple of the vendored shadcn components. Neither renders or asserts on `app/page.tsx`'s actual content.

## Notes

- This directory is not tracked by any Git repository (per explicit user preference — do not initialize one unless asked).
- Auth headers (`oai-authenticated-user-email`, etc.) and the SIWC flow are documented in `README.md` if a future task touches per-user identity.
