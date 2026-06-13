# Scaffold TypeScript Module

Scaffold a new TypeScript module for this project.

Module name: $ARGUMENTS

## Steps

**1. Create `src/$ARGUMENTS.ts`**
- Import only from `./types` — no new type definitions in this file
- Export all functions as **named exports** (no default export)
- Explicit return types on every function
- No `any`, no `var`, no `console.log`
- Add JSDoc to every exported function (`@param`, `@returns`)

**2. Create `src/$ARGUMENTS.test.ts`**
- One `describe` block per exported function, named after the function
- Three `it` stubs per function:
  - `'returns the correct result for a normal input'`
  - `'handles zero or empty input'`
  - `'throws on invalid input'` (only if the function can throw)
- Leave test bodies as `// TODO` stubs — do not implement

## After Creating Both Files

Run `npm run lint` and fix any violations immediately before reporting done.
