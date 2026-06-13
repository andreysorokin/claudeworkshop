# Demo: Large Codebases — Plan Mode & Navigation

---

## Setup (before the session)

```bash
cd day_2_demo_04_large_codebase
npm install
npm test   # all tests should pass
```

---

## Teaching Points

1. **Plan mode** prevents Claude from editing files until you've reviewed its approach
2. **Grep over read** — Claude navigates by searching for patterns, not reading every file
3. **CLAUDE.md navigation hints** reduce noise (Claude knows where to look)
4. **Incremental edits** with milestone commits preserve a working state at each step

---

## Walkthrough Script

### Step 1 — Frame the task (2 min)

> "We have a checkout API that processes orders. It's missing input validation. The task: add validation and tests."

Don't show any code yet. Let Claude navigate first.

### Step 2 — Enter Plan Mode (5 min)

Type `/plan` (or Shift+Tab). Ask Claude:
> "Add input validation to the checkout API. Validate: customerId is not empty, items array is not empty, each item has a positive quantity, shippingAddress is not empty."

**Watch Claude:**
- Read `CLAUDE.md` for navigation hints
- Grep for `validateBody` to find the existing validation helper
- Open `src/api/middleware.ts` to study the pattern
- Open `src/api/checkout.ts` to see what's missing
- Propose a plan: where to add validation, what tests to write

**Discussion**: Claude found the existing pattern with grep. It didn't read all 15 files — it searched for the symbol it needed.

### Step 3 — Approve the plan (2 min)

Review Claude's proposal. If sensible, approve. If not, correct it before any code is written.

> "This is plan mode's value: you reviewed the approach before a single line changed."

### Step 4 — Watch the edits (10 min)

Claude edits `src/api/checkout.ts` then `tests/api/checkout.test.ts`.

After `checkout.ts` is done — **pause and commit**:
```bash
git add src/api/checkout.ts
git commit -m "feat(checkout): add input validation"
```

After `checkout.test.ts` is done — commit again:
```bash
git add tests/api/checkout.test.ts
git commit -m "test(checkout): cover validation error paths"
```

**Discussion**: Milestone commits. If the test additions break something, the previous commit is a clean rollback point.

### Step 5 — Run tests (5 min)

```bash
npm test
```

All tests should pass. If any fail, demo the self-correction loop (same as demo_03).

### Step 6 — Reflect (3 min)

> "On a 150-file codebase this pattern is the same: CLAUDE.md tells Claude where to look, plan mode reveals the approach before changes land, grep finds patterns faster than reading, and small commits keep the history clean."

---

## Demo Task

Ask Claude this verbatim:
> "Add input validation to `src/api/checkout.ts`. Validate that: customerId is non-empty, items array is non-empty, each item's quantity is a positive integer, shippingAddress is non-empty. Reuse the existing `validateBody` helper. Then add tests to `tests/api/checkout.test.ts` covering each validation rule."

---

## Files

```
src/api/checkout.ts       — MISSING validation (demo target)
src/api/middleware.ts     — has validateBody() helper (reference pattern)
tests/api/checkout.test.ts — sparse tests (to be extended in the demo)
```

---

## Bonus: Navigating Without LSP (find & grep)

In Claude Code CLI there is no language server. Claude navigates by searching for patterns — exactly the same commands you can run yourself:

```bash
grep -rn "validateBody" src/    # find where a helper is defined + every call site
grep -rn "AppError" src/        # locate the custom error class
find src/api -name "*.ts"       # list all files in a layer
```

You can also just ask Claude: *"Where is `AppError` defined?"* — it will run grep internally and return the answer without reading every file.

**Teaching point**: the CLAUDE.md hints (`Validation lives in middleware.ts`) cut the search space before grep even runs. On a 500-file codebase this matters — Claude jumps straight to the right file instead of scanning broadly.

---

## Bonus: Installing LSP Support & Running Claude Code from the IDE

Running Claude Code inside an IDE gives it access to the project's language server, which means it can resolve types and navigate symbols without reading extra files.

**VS Code**
1. TypeScript support is bundled — just make sure *TypeScript and JavaScript Language Features* is enabled
2. Install the **Claude Code** extension from the VS Code Marketplace
3. Open this project folder — the TypeScript language server starts automatically
4. Claude Code can now resolve types, jump to definitions, and read diagnostics without opening full files

**JetBrains (WebStorm / IntelliJ + TypeScript plugin)**
1. TypeScript support is built-in — no extra install needed
2. Install the **Claude Code** plugin from the JetBrains Marketplace
3. Open the project; the language server activates on the first `.ts` file

**Show it live**: open `src/api/checkout.ts` in VS Code, hover over `validateBody` — the LSP tooltip appears. Then ask Claude Code the same navigation question you asked in CLI and compare how it answers.

---

## Bonus: LSP Plugin in the CLI — Finding All Usages of a Symbol

Claude Code CLI can use a language server directly (no IDE required) once the TypeScript LSP plugin is installed.

### Pre-requisites

1. **`typescript-language-server` in PATH**

   ```bash
   npm install -g typescript-language-server typescript
   # verify
   typescript-language-server --version
   ```

2. **`typescript` installed in the project** (already present — `npm install` covers it)

3. **`tsconfig.json` in the project root** (already present)

### Install the plugin

Inside a Claude Code session run:

```
/plugin
```

Select the TypeScript LSP plugin from the list, then reload:

```
/reload-plugins
```

You should see: `1 plugin LSP server` in the reload summary.

Also, you might want to enable LSP_ENABLE env:

      {
          "env": {
              "ENABLE_LSP_TOOL": "1"
          },
          "enabledPlugins": {
              "typescript-lsp@claude-plugins-official": true
          }
      }

### Demo prompt

Ask Claude:

> "can you find all usages of Order interface with LSP"

**What to watch:**
- Claude calls `LSP › findReferences` on each field of the `Order` interface in parallel
- Results come back with exact file + line locations across `orders.ts`, `checkout.ts`, and the test file
- Compare the output to what a plain `grep` would return — LSP resolves by type, not by text match

**Teaching point**: the LSP tool gives Claude precise cross-file reference data without reading any source file. On larger codebases this collapses a multi-step grep-and-read workflow into a single structured tool call.

---

## Bonus: Comparing Context Size — CLI grep vs IDE + LSP

Context token usage differs meaningfully between modes:

| Mode | How Claude finds a symbol | Approx. extra tokens |
|---|---|---|
| CLI + CLAUDE.md hints | grep output (5–20 lines) | ~200–500 per lookup |
| IDE + LSP | Language server resolves in-process | ~0–50 (type metadata only) |
| CLI, no hints | May read full files to orient | 500–3 000 per file |

**Demo steps**:
1. In CLI, ask: *"What type does `placeOrder` return?"* — watch Claude grep then read a partial file
2. In VS Code with the Claude Code extension, ask the same question — Claude answers from LSP hover data without opening the file
3. Observe the context bar in each environment (the VS Code extension shows token usage in the sidebar)

**Teaching point**: good CLAUDE.md hints + grep-first discipline keep CLI token usage close to IDE+LSP levels. For very large codebases (500+ files), IDE mode is meaningfully more efficient and the token savings compound across a long session.
