# Code Audit

Perform a comprehensive code audit of this project against its own rules.

## Steps

1. Read every TypeScript file in `src/` (including `src/CLAUDE.md` for the directory rules)
2. Read `CLAUDE.md` and `CLAUDE_CODING_STANDARDS.md` for the full rule set
3. Check each file against **all** rules:
   - **Type safety**: no `any`, explicit return types on public functions, proper use of interfaces
   - **Code style**: `const`/`let` only, named exports, camelCase names, no `console.log`
   - **Documentation**: JSDoc on every exported function in `src/`
   - **Test coverage**: every exported function should have a corresponding test file

## Output Format

Produce a structured report with three sections:

### Summary
- Files checked: N
- Total violations: N
- Files with violations: list them

### Violations by File
For each violation: `filename:line — rule name — description`

### Priority Fixes
Top 3 most impactful changes, with the specific edit required.

**Do not fix anything** — this is a read-only audit. Report only.
