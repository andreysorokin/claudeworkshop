# Backend — Express API

Express + TypeScript JSON API. Runnable with `npm install && npm run dev` (listens on `:3001`).

## Shared standards

Engineering standards, skills, the commit command, and the lint/test hooks all come from the
**`org-standards` plugin**, enabled in `.claude/settings.json` from the local `../shared`
marketplace — nothing is duplicated in this repo. For conventions, use the
`/org-standards:code-style` skill. Other shared skills: `/org-standards:adr`,
`/org-standards:start-branch`, `/org-standards:spec`, `/org-standards:implement-spec`.

## Layout

- `src/index.ts` — entry point; starts the HTTP listener.
- `src/server.ts` — `createApp()` builds the Express app (separate from the listener so tests can
  import it).
- `src/routes/health.ts` — `healthRouter()`; `GET /api/health` -> `200 { status, service }`.
- `src/__tests__/` — `node:test` unit tests.

## Commands

- `npm run dev` — watch + serve (tsx).
- `npm run lint` — `tsc --noEmit` (also run automatically by the shared PostToolUse hook on edits).
- `npm test` — `node:test` runner.

## Contract

This API owns the HTTP contract documented in `../shared/knowledge/architecture.md`. Update that
table when adding or changing routes.
