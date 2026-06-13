# Storefront Backend

## Project Layout

```
src/core/      — domain logic (cart, pricing, inventory)
src/api/       — request handlers (checkout, products, middleware)
src/db/        — data access (orders, products)
src/utils/     — shared utilities (logger, errors)
tests/         — mirrors src/ structure
```

## Key Patterns

- **Validation** lives in `src/api/middleware.ts` — use `validateBody()` for all request validation
- **Custom errors** in `src/utils/errors.ts` — throw `AppError` with an HTTP status code
- **Database calls** return `Promise` — always `await`; never fire-and-forget
- **Logging** via `logger.ts` — use `logger.info` / `logger.error`; no `console.log` in production code

## Testing

- Tests mirror source structure: `src/api/checkout.ts` → `tests/api/checkout.test.ts`
- Run all tests: `npm test`
- Run one suite: `npm test -- --testPathPattern checkout`
- Minimum coverage: every happy path + at least one validation error path

## Git Rules

- Commit per logical unit: one commit per file group changed for the same reason
- Message format: `<type>(<scope>): <summary>` — e.g. `feat(checkout): add input validation`
- Never commit with failing tests

## Navigation Rules and LSP

When tracing where a symbol is defined or finding all references to
it, use LSP (goToDefinition, findReferences, hover) instead of Grep.
LSP gives exact results; Grep gives text matches.

Use Grep/Glob for discovery (finding files, searching patterns). Use
LSP for understanding (definitions, references, type info).

After locating a file with Grep/Glob, use LSP to navigate within it
rather than reading the whole file.
