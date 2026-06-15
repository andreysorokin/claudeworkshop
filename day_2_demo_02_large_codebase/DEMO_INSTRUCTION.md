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
5. **LSP vs Grep** — with a language server Claude gets exact type info; without it, grep fills the gap but misses inferred types and narrowed unions

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

## Bonus: LSP vs No-LSP — Side-by-Side Demo

This bonus shows the same question answered two ways: once with the
TypeScript LSP plugin active, once without it. Run both back-to-back
so attendees feel the difference.

---

### Without LSP (enforce with this prompt)

> 💬 Ask (paste verbatim — the constraint is important):
>
> ```
> Do NOT use any LSP tools. Using only grep and file reads, show me
> all interfaces in this codebase and the type of each property.
> ```

What Claude does:
- `grep -rn "^export interface" src/` to find interface declarations
- Reads each matching file to extract property lines and types
- **Can** find explicit types like `Order.status: 'pending' | 'confirmed' | 'dispatched' | 'delivered'` — they are written in the source
- **Can** find `Order.createdAt: Date` — also explicit in the source

Point out: grep + file reads works, but requires opening every file that contains an interface. On a large codebase that's expensive in tokens. LSP answers the same question without reading any files at all.

---

### With LSP (enforce with this prompt)

First, activate the plugin if not already active:

```bash
npm install -g typescript-language-server typescript
```

Inside a Claude Code session:

```
/plugin        # select the TypeScript LSP plugin
```

> 💬 Ask (paste verbatim):
>
> ```
> Use LSP tools only — no grep, no file reads. Find all interfaces
> in this codebase and show me the exact type of every property.
> ```

What Claude does:
- `LSP documentSymbol` on each file in parallel — no grep, no reads
- `LSP hover` on every property to get the compiler-resolved type
- Returns `Order.status: "pending" | "confirmed" | "dispatched" | "delivered"` and `Order.createdAt: Date` — exact, compiler-verified

Point out: no files were read. The language server answered directly from the type graph.

---

### Token comparison

| Mode | How Claude finds a symbol | Approximate extra tokens |
|---|---|---|
| LSP available | `documentSymbol` + `hover` — no file reads | ~50–200 |
| CLI + CLAUDE.md hints | grep output (5–20 lines) | ~200–500 |
| CLI, no hints | May read full files | 500–3 000 per file |

**The point:** CLAUDE.md hints narrow the grep search space. LSP eliminates the search entirely. On a 500-file codebase both jumps matter — but they stack.
