# Demo: Large Codebases — Plan Mode & Navigation

---

## Setup

```bash
cd day_2_demo_02_large_codebase
npm install
npm test   # all tests should pass
```

---

## Teaching Points

1. **Plan mode** — Claude proposes before it edits; you approve or redirect
2. **Grep over read** — Claude finds patterns, not full-file reads
3. **CLAUDE.md hints** — cut search space before grep even runs
4. **Milestone commits** — every passing state is a rollback point

---

## The Story

The Enchanted Stables checkout API is missing input validation. Someone can order 0 saddles, or skip the shipping address, and the order goes through. Fix it — but on an unfamiliar codebase.

---

## Walkthrough

### Step 1 — Frame it (2 min)

> "Checkout API. Missing validation. Find the right pattern and add it."

Don't show any code yet. Let Claude navigate first.

### Step 2 — Enter Plan Mode (5 min)

Press Shift+Tab. Then:

> 💬 Ask: "Add input validation to the checkout API. Validate: customerId is not empty, items array is not empty, each item has a positive quantity, shippingAddress is not empty."

Watch Claude:
- Read `CLAUDE.md` for navigation hints
- Grep for `validateBody` to find the existing helper
- Open `src/api/middleware.ts` to understand the pattern
- Open `src/api/checkout.ts` to see what's missing
- Propose a plan with file names and change locations

**Point out:** Claude found the existing pattern by searching, not by reading all 15 files.

### Step 3 — Approve (2 min)

Review the plan. Approve it. If something looks off, redirect before a single line changes.

> "This is plan mode's value: you reviewed the approach first."

### Step 4 — Watch the edits (10 min)

Claude edits `src/api/checkout.ts`, then `tests/api/checkout.test.ts`.

After `checkout.ts` — pause and commit:

```bash
git add src/api/checkout.ts
git commit -m "feat(checkout): add input validation"
```

After tests — commit again:

```bash
git add tests/api/checkout.test.ts
git commit -m "test(checkout): cover validation error paths"
```

**Point out:** Milestone commits. If the next step breaks something, the previous commit is a clean rollback.

### Step 5 — Run tests (5 min)

```bash
npm test
```

All tests pass. If any fail, demo the self-correction loop.

### Step 6 — Reflect (3 min)

> "On a 150-file codebase this pattern is identical: CLAUDE.md tells Claude where to look, plan mode reveals the approach, grep finds patterns, small commits keep history clean."

---

## The Exact Demo Prompt

```
Add input validation to src/api/checkout.ts. Validate:
- customerId is non-empty
- items array is non-empty
- each item's quantity is a positive integer
- shippingAddress is non-empty

Reuse the existing validateBody helper. Then add tests to
tests/api/checkout.test.ts covering each validation rule.
```

---

## Files

```
src/api/checkout.ts        — missing validation (demo target)
src/api/middleware.ts      — has validateBody() helper (reference pattern)
tests/api/checkout.test.ts — sparse tests (extended during demo)
```

---

## Bonus: Navigating Without LSP

Claude Code CLI has no language server. Navigation is grep:

```bash
grep -rn "validateBody" src/    # find definition + all call sites
grep -rn "AppError" src/        # locate custom error class
find src/api -name "*.ts"       # list files in a layer
```

Or just ask:

> 💬 Ask: "Where is AppError defined?"

Claude runs grep internally and returns the answer without reading every file.

**The point:** CLAUDE.md hints narrow the search before grep runs. On a 500-file codebase that jump matters.

---

## Bonus: LSP in the CLI

Install once:

```bash
npm install -g typescript-language-server typescript
```

Inside a Claude Code session:

```
/plugin        # select the TypeScript LSP plugin
/reload-plugins
```

Then:

> 💬 Ask: "Find all usages of the Order interface with LSP."

Claude calls `LSP › findReferences` in parallel across files — type-resolved, not text-matched.

**Token comparison:**

| Mode | How Claude finds a symbol | Extra tokens |
|---|---|---|
| CLI + CLAUDE.md hints | grep output (5–20 lines) | ~200–500 |
| IDE + LSP | Language server in-process | ~0–50 |
| CLI, no hints | May read full files | 500–3 000 per file |
