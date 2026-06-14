# Demo: Context Management, Tooling & Customisation

---

## The Story

You've been working with Claude on the Enchanted Stables order processor. The session is rich. Now master your context budget, wire in external docs, guarantee code quality automatically, and build your own slash commands.

**Six parts. One continuous session.** (Part 5 covers both commands and skills.)

---

## Setup

```bash
cd day_2_demo_01_context_management
npm install
```

Open Claude Code. Do 3–4 turns of real work — ask about the `Order` type, about loyalty rules, about the processor. Build up some token usage before Part 1.

---

## Part 1 — Context Commands (5 min)

### Show the budget

```
/usage
```

Point out: tokens used, cache hits, cost. Then:

> "Your context window is finite and expensive. A long agentic session can burn 200K tokens. That's real money and real latency."

### Compact — keep the thread, cut the cost

```
/compact
```

Watch the count drop. Then ask something that needs earlier context:

> 💬 Ask: "Based on what we discussed, what would be the first function to refactor?"

Claude still knows. The summary kept the substance; the history is gone.

**The point:** `/compact` is your escape valve. Use it before any large task.

### Clear — fresh start, permanent context intact

```
/clear
```

Then, without pointing at any file:

> 💬 Ask: "What do you know about this project?"

Claude reads `CLAUDE.md` and answers with loyalty rules, currency, coding standards. Same knowledge, zero history.

**The point:** `/clear` removes conversation. It doesn't erase project knowledge — that lives in `CLAUDE.md`, not the chat.

---

## Part 2 — CLAUDE.md: Permanent Layered Context (5 min)

Open `CLAUDE.md`. Point to line 3:

```markdown
@CLAUDE_CODING_STANDARDS.md
```

> "Claude merges these two files automatically. One imports the other — project context separated from team standards."

Open `src/CLAUDE.md`:

> "This file activates only inside `src/`. Stricter rules: JSDoc required, no commented-out code, explicit types everywhere."

Show the three-layer stack:

```
~/.claude/CLAUDE.md    → always on   (your global style)
      CLAUDE.md        → always on   (project rules + @-imports)
      src/CLAUDE.md    → inside src/ (strictest rules)
```

> 💬 Ask: "What linting rules apply to TypeScript in `src/`?"

Claude synthesises from all three layers — no file paths in the prompt.

**The point:** Write CLAUDE.md once. Every session benefits. It's infrastructure, not a prompt.

---

## Part 3 — MCP: Live Documentation (5 min)

Open `.mcp.json` — four lines, one npm package:

```json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] }
  }
}
```

> "Context7 fetches current docs from official sources — not Claude's training data, which has a cutoff."

> 💬 Ask (without MCP hint): "How do I generate an HTML report in Vitest?"

Then:

> 💬 Ask: "How do I generate and serve an HTML report in Vitest? Fetch current docs first."

Watch the tool call fire. The second answer reflects the current Vitest version.

> 💬 Ask: "What changed about refs and forwardRef in React 19? Fetch the React docs with Context7 first."

React 19 made `ref` a plain prop — `forwardRef` is gone for most cases. Without fetching, Claude might give the React 17 answer.

**The point:** Library APIs change. Fetch-then-answer beats guess-from-training-data.

---

## Part 4 — PostToolUse Hooks: Automatic Lint (7 min)

Open `.claude/settings.json`:

```json
"PostToolUse": [{
  "matcher": "Edit|Write",
  "command": "npm run lint 2>&1 | tail -40"
}]
```

> "Every edit triggers ESLint. The output lands in Claude's context automatically — before the next thought."

Run it from the terminal:

```bash
npm run lint
```

Four violations in `src/processor.ts`:

| Line | Rule | Violation |
|------|------|-----------|
| 3 | `no-var` | `var LOYALTY_RATE` |
| 5 | `no-explicit-any` | `order: any` |
| 6 | `no-unused-vars` | `debugInfo` assigned, never read |
| 9 | `no-console` | `console.log` in production code |

> 💬 Ask the audience: "Would you have caught the unused variable in a PR review?"

Now ask Claude:

> 💬 Ask: "Add a function `applyLoyaltyMultiplier` that takes an `Order` and a multiplier, validates both are positive, and returns a `LoyaltyResult`. Use types from types.ts."

Watch the sequence:
1. Claude reads `src/types.ts`
2. Claude writes the function to `src/processor.ts`
3. **Hook fires** — lint output enters Claude's context
4. Claude sees the 4 pre-existing violations + any new ones
5. Claude fixes everything — including code it didn't write
6. Hook fires again — clean

**The point:** The hook delivers the signal. Claude self-corrects. No "please fix lint" needed.

---

## Part 5 — Custom Commands and Skills: Your Workflow as Code (8 min)

### Commands — slash commands for repeatable prompts

Open `.claude/commands/scaffold.md`:

> "One markdown file in `.claude/commands/` — Claude Code picks it up automatically. No registration, no config."

Point out `$ARGUMENTS` and the structured steps.

```
/scaffold loyalty-calculator
```

Watch Claude create:
- `src/loyalty-calculator.ts` with proper types and named exports
- `src/loyalty-calculator.test.ts` with stubs for normal, zero, and error cases
- Hook fires — violations fixed inline

Now run the audit:

```
/audit
```

Claude scans every file in `src/`, checks against the rule hierarchy, reports violations by file, line, and rule — including missing test coverage.

### Skills — commands with templates and structured knowledge

Open `.claude/skills/adr/`:

> "Skills go one level deeper than commands. They can carry templates, reference files, and multi-step instructions. Same zero-config pickup — a folder in `.claude/skills/`."

Point out two files:
- `README.md` — the instructions Claude follows (find next number, fill template, save, report)
- `template.md` — the ADR template Claude fills in

Show the flow end-to-end:

> 💬 Ask: "The audit flagged missing test coverage. Please add it."

Claude picks Vitest (native TypeScript support, no ts-jest needed), installs it, writes tests for all three exported functions — happy path, zero/null, and error cases.

Then invoke the skill:

```
/adr test framework
```

Claude reads the existing `docs/decisions/` directory, finds no prior ADRs, picks number `001`, fills the template with real context from `CLAUDE.md` and `tsconfig.json`, and writes `ADR-001-test-framework.md`. No copy-paste. No hallucinated library versions.

**The point:** Commands handle repeatable prompts. Skills handle repeatable *workflows* — multi-step tasks that need templates, numbering, or structured output.

---

## Part 6 — Git Workflow: Rules in CLAUDE.md (5 min)

Open `CLAUDE.md` → **Git Workflow** section. Point out:
- Conventional Commits format with valid/invalid examples
- Diff Review Checklist
- PR description template

> 💬 Ask Claude: "I want to commit current changes. My message is: 'Fixed stuff'"

Claude refuses — no type, past tense, too vague — and suggests a corrected message.

**The point:** The rule is in CLAUDE.md. Claude saw it at session start. You didn't re-explain it.

### The `/commit` command and split commits

Nothing is staged yet. Run:

```
/commit
```

Claude runs `git diff --cached`. Nothing staged — it reports and stops. It won't invent a commit.

Stage the files and try again:

```
/commit
```

Claude drafts a Conventional Commits message, displays it, and **waits for approval before running `git commit`**.

Now demonstrate intent detection — the two new artifacts (tests + ADR) are different concerns:

> 💬 Say: "Split into 2 commits."

Claude stages and commits in sequence:
1. `test: add vitest and processor test suite` — `package.json`, `package-lock.json`, `tests/`
2. `docs: record ADR-001 for vitest as test framework` — `docs/`

Then:

> 💬 Ask: "Review the diff of the last commit against the rules in CLAUDE.md."

Claude runs `git diff HEAD~1..HEAD`, applies the checklist, flags any violations by rule name.

---

## Summary

| Feature | What it does |
|---|---|
| `/usage` | Live token budget |
| `/compact` | Compress history, keep substance, cut cost |
| `/clear` | Fresh session — CLAUDE.md still loads |
| CLAUDE.md hierarchy | Permanent layered context; write once |
| `@`-imports | Modular — project rules vs. team standards |
| Context7 MCP | Live docs — answers reflect current versions |
| PostToolUse hooks | Lint/test fires on every edit; Claude self-corrects |
| Custom commands | Repeatable prompts as project slash commands |
| Skills | Multi-step workflows with templates and structured output |
| `/commit` | Staged diff → validated Conventional Commits message + approval gate |
| Split commits | Say "split into 2 commits" — Claude stages and commits in sequence |
| Git rules in CLAUDE.md | Commit format + diff checklist every session |

**The pattern:** Each layer makes Claude more capable without more prompting. Invest once in config; every session benefits.

---

## Reset After Demo

Restore the four intentional violations in `src/processor.ts`:

```typescript
var LOYALTY_RATE = 0.10                        // no-var
export function processOrder(order: any)        // no-explicit-any
  const debugInfo = `Processing order ${...}`  // no-unused-vars
  console.log('Invalid order amount:', ...)    // no-console
```

Delete files created during the demo:

```bash
rm -rf tests/ docs/
git checkout package.json package-lock.json
```

Delete any files created by `/scaffold`.

---

## Files

```
DEMO_INSTRUCTION.md                       — this file
CLAUDE.md                                 — project rules (loads at session start)
CLAUDE_CODING_STANDARDS.md                — imported by CLAUDE.md via @-syntax
src/CLAUDE.md                             — stricter rules, active inside src/
.mcp.json                                 — MCP server config (Context7)
.claude/settings.json                     — PostToolUse lint hook + git permissions
.claude/commands/scaffold.md              — /scaffold custom command
.claude/commands/audit.md                 — /audit: multi-file rule check
.claude/commands/commit.md                — /commit: staged diff → validated commit
.claude/skills/adr/README.md             — /adr skill instructions
.claude/skills/adr/template.md           — ADR template Claude fills in
src/processor.ts                          — order processor (4 intentional violations)
src/types.ts                              — TypeScript interfaces (clean)
tests/processor.test.ts                   — created during demo (Vitest)
docs/decisions/ADR-001-test-framework.md  — created during demo
```
