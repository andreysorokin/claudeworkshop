# Coding Standards

## TypeScript

- **Strict mode** — `tsconfig.json` has `"strict": true`, no exceptions
- **No `any`** — use the correct type or `unknown` with a type guard
- **No `var`** — `const` and `let` only
- **Named exports only** — no default exports anywhere
- **Explicit return types** on every public function

## Code Style

- Function names: `camelCase`
- Type and interface names: `PascalCase`
- File names: `kebab-case`
- **No `console.log`** in production code — remove before committing

## Test Coverage

Every exported function must have tests covering:
1. A normal / happy-path value
2. Zero, `null`, or empty input
3. An error condition (if the function can throw)

## Exports

- One primary concern per file
- Re-export from `src/index.ts` for the public API surface
- Never barrel-export implementation details
