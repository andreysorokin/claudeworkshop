---
name: code-style
description: The organisation's shared TypeScript / Express / React coding conventions. Invoke before writing or reviewing code in any repo so new code matches the house style, or when asked "what's our code style / convention for X".
---

# Code Style

These conventions apply to **every** repo. The PostToolUse lint hook (also shipped in this
plugin) enforces the mechanical parts; this skill is the human-readable contract.

## TypeScript

- `strict` mode always on. Never use `any` — prefer `unknown` + narrowing, or a precise type.
- Explicit return types on all exported functions.
- Named exports only (no `export default`) except where a framework requires it (e.g. Vite entry).
- `const` by default; `let` only when reassigned. No `var`.
- Prefer `type` aliases for shapes; `interface` only when declaration-merging is needed.

## Naming

- Types / classes / React components: `PascalCase`
- Functions, variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `camelCase.ts`; React component files: `PascalCase.tsx`

## Backend (Express)

- Routes are thin — parse/validate the request, delegate to a service, shape the response.
- Business logic lives in services, not in route handlers.
- One router per resource (`routes/<resource>.ts`).
- Use the HTTP status table below.

## Frontend (React)

- Function components + hooks only. No class components.
- Props are explicitly typed; destructure in the signature.
- Side effects in `useEffect`; data fetching wrapped, never inline in JSX.

## HTTP Conventions

| Outcome | Status |
|---------|--------|
| Success with body | 200 OK |
| Resource created | 201 Created |
| Success, no body | 204 No Content |
| Validation failure | 400 Bad Request |
| Not found | 404 Not Found |
| Unexpected error | 500 Internal Server Error |

## Testing

- Backend: `node --test` with the built-in `node:test` + `node:assert`.
- Test name format: `describe('<unit>')` + `it('<scenario> -> <expected>')`.
- One logical assertion per test where practical.

## Git

- Conventional commits: `type(scope): summary` (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`).
- Branch names: `feat/<slug>` or `fix/<slug>`.

Report back which conventions are relevant to the file at hand before writing code.
