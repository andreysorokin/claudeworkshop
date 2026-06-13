# Source Directory Rules

Production code. Stricter than the project-wide defaults.

## Additional Requirements

- **JSDoc required** on every exported function: `@param`, `@returns`, and `@throws` if applicable
- **No commented-out code** — delete it; if it matters, it belongs in a PR description
- **No TODOs without a ticket** — `// TODO: AN-1234 description` format only
- **No implicit `any`** — all function parameters must be explicitly typed, even when inference would work

## Type Safety in This Directory

```typescript
// Bad — inference produces `any` for external input
export function processDonation(donation) { ... }

// Good — explicit, matches the interface in types.ts
export function processDonation(donation: Donation): ProcessResult { ... }
```

## Import Order (enforced by ESLint)

1. Node built-ins
2. Third-party packages
3. Internal imports (`./`, `../`)
