# Demo Instructions — Fix Issues

This demo shows how Claude Code can be used to onboard into an unfamiliar codebase, identify and fix bugs surfaced by failing tests, and improve test coverage — all within a single session.

---

## Setup

```bash
npm install
```

---

## Step 1 — Initialise the project context

Run `/init` to generate a `CLAUDE.md` file.

Claude will scan the project structure, scripts, source files, and tests, then produce a concise reference document covering commands, architecture, and any known issues. This file is automatically included in every future Claude Code session in this repo.

**What to highlight:** Claude identifies the two intentional bugs and documents them in `CLAUDE.md` without being asked.

---

## Step 2 — Run the application

Prompt:
> Can you please run the application?

Claude runs `npm run start` (installing dependencies first if needed) and prints the receipt. The output looks plausible at a glance, but the numbers are wrong:

- **Subtotal** shows `$10.73` instead of the correct `$19.70`
- **Discounted total** shows `$1.07` instead of `$17.73`

**What to highlight:** The app runs without errors, so the bugs would not be caught without tests or careful inspection.

---

## Step 3 — Enrich CLAUDE.md with a purpose statement

Prompt:
> After you've seen the output, could you please write a short summary on the purpose of this application in CLAUDE.md

Claude adds a "Purpose" section describing what the app does, using what it observed from the live output.

**What to highlight:** Claude uses runtime context — not just static analysis — to write accurate documentation.

---

## Step 4 — Analyse the failing tests (Plan Mode)

Enable Plan Mode, then prompt:
> Please run the tests and analyse the test results, what has to be fixed and why

Claude statically traces the two bugs without executing code:

**Bug 1 — `calculateCartTotal` (`src/shoppingCart.ts:25`)**  
`total += product.price` — quantity is never multiplied in.  
Failing tests: *calculates total for a single item*, *calculates total for multiple items*.

**Bug 2 — `getDiscountedTotal` (`src/shoppingCart.ts:48`)**  
`subtotal * (discountPercent / 100)` returns the discount amount rather than the post-discount price.  
Failing test: *applies discount correctly*.

Claude writes a structured plan file and exits Plan Mode for approval.

**What to highlight:** Plan Mode separates analysis from execution — useful for reviewing proposed changes before they are applied.

---

## Step 5 — Apply the fixes

After approving the plan, Claude makes two targeted edits:

```ts
// Before
total += product.price;
// After
total += product.price * item.quantity;
```

```ts
// Before
return subtotal * (discountPercent / 100);
// After
return subtotal * (1 - discountPercent / 100);
```

Claude then runs `npm run test` to confirm all 7 tests pass.

---

## Step 6 — Review test coverage

Prompt:
> Check the test coverage, are we covering all the shopping cart logic methods?

Claude audits all four exported functions against the existing tests and identifies:

- `getProductById` — **no direct tests** (only exercised indirectly)
- `getDiscountedTotal` — missing a 0% / default discount case
- `calculateCartTotal` — no test for an unknown `productId`

**What to highlight:** Claude reasons about coverage without running a coverage tool, by reading both the source and the test file.

---

## Step 7 — Add missing test coverage

Prompt:
> Please add the test to fix getProductById coverage

Claude adds a new `describe('getProductById')` block with two tests:

- Returns the correct product object for a known ID
- Returns `undefined` for an unknown ID

Runs `npm run test` — all 9 tests pass.

---

## Key Takeaways

| Capability demonstrated | Where |
|---|---|
| Codebase onboarding via `/init` | Step 1 |
| Running and observing a live app | Step 2 |
| Documentation from runtime context | Step 3 |
| Structured planning before editing | Step 4 |
| Targeted bug fixes with test validation | Step 5 |
| Coverage gap analysis without tooling | Step 6 |
| Writing new tests to close gaps | Step 7 |
