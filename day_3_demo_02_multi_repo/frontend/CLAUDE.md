# Frontend — React + Vite

React + Vite + TypeScript UI. Runnable with `npm install && npm run dev` (serves on `:5173`,
proxies `/api` to the backend on `:3001`).

## Shared standards

Engineering standards, skills, the commit command, and the lint/test hooks all come from the
**`org-standards` plugin**, enabled in `.claude/settings.json` from the local `../shared`
marketplace — nothing is duplicated in this repo. For conventions, use the
`/org-standards:code-style` skill. Other shared skills: `/org-standards:adr`,
`/org-standards:start-branch`, `/org-standards:spec`, `/org-standards:implement-spec`.

## Layout

- `index.html` — Vite entry document.
- `src/main.tsx` — mounts `<App />` into `#root`.
- `src/App.tsx` — the root component; fetches backend health on mount.
- `src/api.ts` — typed client for the backend contract (`fetchHealth`, `healthLabel`).
- `src/api.test.ts` — Vitest unit tests for the pure helper.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — type-check + production build.
- `npm run lint` — `tsc --noEmit` (also run automatically by the shared PostToolUse hook on edits).
- `npm test` — Vitest.

## Contract

Consumes the backend API described in `../shared/knowledge/architecture.md`. Keep `src/api.ts`
types in sync with that contract.
