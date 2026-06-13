# Code Style

## TypeScript

- Strict mode — `"strict": true` in all `tsconfig.json` files, no exceptions
- No `any` — use the correct type or `unknown` with a type guard
- No `var` — `const` and `let` only
- Named exports only — no default exports except `App` and Vite config
- Explicit return types on all non-trivial functions

## React

- Functional components only — no class components
- Props typed with an explicit `interface` (not inline object types)
- Custom hooks live in `frontend/src/hooks/`; prefixed `use`
- Each component in its own folder: `ComponentName/ComponentName.tsx` + `ComponentName.test.tsx`
- No inline styles — use CSS classes defined in `frontend/src/App.css`

## Error Handling

- Backend: return JSON `{ error: string }` with the correct HTTP status code
- Frontend: surface errors via component state; never silence with `console.error` alone
- Async functions return `Promise<T>`, never `Promise<any>`

## Testing

| Layer | Tools | Convention |
|---|---|---|
| Backend routes | Vitest + Supertest | Integration — test via HTTP against the real `app` |
| React components | Vitest + React Testing Library | Mock hooks; assert on rendered output |
| Custom hooks | Vitest + `renderHook` + `waitFor` | Assert state transitions, not implementation |

Test description format: `it('does X when Y')` — describes observable behaviour, not internal calls.

## HTTP Conventions

| Outcome | Status |
|---|---|
| Success with body | 200 |
| Resource created | 201 + Location header |
| No body | 204 |
| Validation error | 400 |
| Not found | 404 |
