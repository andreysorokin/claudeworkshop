# Demo: Context Management, Tooling & Customisation

---

## The Story

You've been working with Claude on the donation processor for an hour. The session is rich with context. Now master how to manage that context budget, understand what Claude can always see, wire in external systems, guarantee code quality automatically, and build your own slash commands.

Five parts. One continuous session.

---

## Setup (before the session)

```bash
cd day_2_demo_01_context_management
npm install
```

Open Claude Code in this directory. Start by doing a few turns of real work — ask Claude to explain the code, ask about Gift Aid rules, ask about the types. This builds up token usage so Part 1 is meaningful.

---

## Part 1 — Context Commands: Managing Your Budget (5 min)

### 1a. Show what you've spent

After 3–4 conversation turns, type:

```
/usage
```

Point out the numbers:
- **Context window used**: tokens consumed so far
- **Cache hits**: how much was served from prompt cache (cheaper)
- **Cost**: actual dollars spent in this session

> "Your context window is a finite, expensive resource. Every token costs latency. Every turn compounds. By the end of a long agentic task, you can easily burn 200K tokens — that's real money, and real slowness."

### 1b. Compact — keep the thread, shrink the cost

```
/compact
```

Watch the token count drop significantly. Then ask a follow-up question — something that requires memory of the earlier conversation:

> "Based on what we discussed, what would be the first function to refactor?"

Claude still knows the context. The summary preserved the substance; the verbatim history is gone.

**Teaching point**: `/compact` is your escape valve mid-session. You stay in the thread but reset the cost. Use it before any large agentic task — start fresh on the budget.

### 1c. Clear — fresh session, permanent context intact

```
/clear
```

Now ask, without pointing to any file:

> "What do you know about this project?"

Claude reads `CLAUDE.md` automatically and answers with specific project rules — the donation domain, Gift Aid rate, coding standards. Same knowledge, zero conversation history.

**Teaching point**: `/clear` removes ephemeral conversation history. It doesn't erase project knowledge — because that knowledge lives in `CLAUDE.md`, not in the chat. Show the contrast: this is why `CLAUDE.md` matters.

---

## Part 2 — CLAUDE.md: Permanent, Layered Context (5 min)

Still in the fresh session from Part 1. Open `CLAUDE.md` on screen.

### 2a. The @-import

Line 3:
```markdown
@CLAUDE_CODING_STANDARDS.md
```

> "Claude merges these two files automatically. One CLAUDE.md can import another — useful for separating project context from team-wide standards."

Open `CLAUDE_CODING_STANDARDS.md` alongside. Show that it's a separate file with TypeScript rules.

### 2b. Directory scope

Open `src/CLAUDE.md`.

> "This file applies only when Claude is working inside `src/`. It adds stricter rules on top of the root ones — JSDoc required, no commented-out code, explicit return types."

### 2c. The three-layer hierarchy

Draw this on screen or read it aloud:

```
~/.claude/CLAUDE.md       → always on  (your global preferences, name, style)
      CLAUDE.md           → always on  (project rules + @-imports)
      src/CLAUDE.md       → active in src/  (directory-scoped stricter rules)
```

Ask Claude (still in the fresh session):

> "What linting rules apply to TypeScript in `src/`?"

Claude synthesises the answer from all three layers — no file paths mentioned in the prompt.

**Teaching point**: Write CLAUDE.md once. Benefit every session. This is infrastructure, not a prompt — you don't paste it anywhere; it loads automatically.

---

## Part 3 — MCP: Claude Fetches Live Documentation (5 min)

Open `.mcp.json`. Show the entire file — it's four lines:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

> "One npm package. No tokens. No config. Context7 fetches live, up-to-date documentation from official library sources — not Claude's training data, which has a cutoff date."

### Demo prompt 1 — Vitest HTML reports

Ask Claude:

w/o MCP:
```
How to generate and Serve HTML Report UI in Vitest?
```

```
How to generate and Serve HTML Report UI in Vitest? Fetch current docs to make sure the answer is up to date.
```

Watch the tool call fire in the UI — Claude calls Context7 to retrieve the Vitest docs before composing its answer.

> "Notice Claude says it's fetching docs before answering. The answer reflects the current Vitest version — not what was true at the training cutoff. This matters: library APIs change."

### Demo prompt 2 — React 19 refs

Ask Claude:

```
What is the current recommended way to use refs and forwardRef in React 19? Fetch current React docs with Context7 first to make sure the answer is up to date, and point out what changed from older React examples.
```

Claude fetches the React 19 docs, then explains the shift — `ref` is now a prop in React 19, `forwardRef` is no longer needed for most cases.

> "React 19 changed how refs work. Without fetching docs, Claude might give you the React 17/18 answer. With Context7, it tells you what changed and why."

### The pattern

> "The same pattern works for any library with an MCP server — fetch-then-answer instead of guess-from-training-data. Each `.mcp.json` is project-scoped. You opt in per project. Claude decides when to call the tool, or you ask directly."

---

## Part 4 — PostToolUse: Automatic Lint on Every Edit (7 min)

### 4a. Show the hook

Open `.claude/settings.json`:

```json
"PostToolUse": [{
  "matcher": "Edit|Write",
  "command": "npm run lint 2>&1 | tail -40"
}]
```

> "Every time Claude edits or writes a TypeScript file, ESLint runs. The last 40 lines of output land in Claude's context automatically — before the next thought."

### 4b. Show the violations live

Run from the terminal:

```bash
npm run lint
```

You'll see 4 violations in `src/processor.ts` (3 errors, 1 warning):

| Line | Rule | Violation |
|------|------|-----------|
| 3 | `no-var` | `var TAX_RATE` — should be `const` |
| 5 | `@typescript-eslint/no-explicit-any` | `donation: any` parameter |
| 6 | `@typescript-eslint/no-unused-vars` | `debugInfo` assigned but never read |
| 9 | `no-console` | `console.log` in production code |

And `src/types.ts` is clean — 0 errors.

> "These are real, common mistakes. The code runs fine. Tests would pass. No one would necessarily catch the unused variable in a PR review."

Ask the audience: "Would you have caught the unused variable?"

### 4c. Ask Claude to add a feature

```
Add a function `applyGiftAidMultiplier` that takes a Donation and a multiplier, validates both are positive, and returns a GiftAidResult. Use the types from types.ts.
```

Watch the sequence:
1. Claude reads `src/types.ts` to understand `Donation` and `GiftAidResult`
2. Claude writes the new function to `src/processor.ts`
3. **Hook fires automatically** — lint output appears in Claude's context
4. Claude sees the 4 pre-existing violations alongside any new ones
5. Claude fixes everything — including code it didn't write — in the same turn
6. Hook fires again — clean output

**The teaching moment**: Claude didn't need to be told "fix the linting". The hook delivered the signal. This is tighter than CI — it happens before commit, before PR, within the same edit loop.

> "The hook can run anything: `npm test`, `tsc --noEmit`, a custom validation script, a security scanner. Every tool that outputs to stdout can be a real-time feedback loop."

---

## Part 5 — Custom Commands: Your Workflow as a Slash Command (5 min)

### 5a. Show the command file

Open `.claude/commands/scaffold.md`.

> "This is a custom slash command. One markdown file in `.claude/commands/` — Claude Code picks it up automatically. No registration, no config, no code."

Point out:
- `$ARGUMENTS` — whatever you type after the command name
- The structured steps — Claude follows them in order
- It references CLAUDE.md conventions — so the scaffold stays consistent

### 5b. Run it live

Type in Claude Code:

```
/scaffold gift-aid-calculator
```

Watch Claude:
1. Create `src/gift-aid-calculator.ts` with proper types, named exports, explicit return types
2. Create `src/gift-aid-calculator.test.ts` with test stubs (normal, zero, error case)
3. The PostToolUse lint hook fires — if there are any violations, Claude fixes them inline

The new files match the project conventions exactly — because the command says "follow CLAUDE.md", and Claude does.

### 5c. The second command — /audit

Open `.claude/commands/audit.md`.

> "This one reads all source files, checks each against CLAUDE.md rules, and produces a structured report. No fixes — just findings."

Run:
```
/audit
```

Claude scans every file in `src/`, checks against the rule hierarchy, outputs a report with violations by file, line number, and rule name.

> "Any multi-step task you repeat — scaffolding, auditing, summarising changes for standup, generating a changelog — can be a slash command. It's Claude Code automation. No code required."

---

## Part 6 — Git Workflow: Commit Messages, Diff Review, and the /commit Command (5 min)

### 6a. The rules are already in CLAUDE.md

Open `CLAUDE.md` and scroll to the **Git Workflow** section.

> "We've encoded Conventional Commits format, branch naming, PR description structure, and a diff review checklist — all in CLAUDE.md. Claude reads this at the start of every session. No prompting required."

Point out three things:
- The `type(scope): description` format with a concrete valid/invalid table
- The **Diff Review Checklist** — Claude applies this when asked to review
- The PR Descriptions template — four required sections, `None` required for breaking changes

### 6b. Show the rule in action — bad commit rejected

Ask Claude:

```
I want to commit the current changes. My commit message is: "Fixed stuff"
```

Claude will refuse and explain why — `"Fixed stuff"` has no type, uses past tense, and is too vague. It will suggest a corrected message following the Conventional Commits format.

> "The rule is in CLAUDE.md. Claude saw it at session start. You didn't re-explain it. The constraint is part of the project's permanent context — not a one-off instruction."

### 6c. Run /commit to stage and commit with a valid message

Stage the git rules additions:

```bash
git add CLAUDE.md .claude/settings.json .claude/commands/commit.md .gitignore
```

Then type in Claude Code:

```
/commit adds git workflow rules and commit command
```

Watch the sequence:
1. Claude runs `git diff --cached` — reads the staged diff
2. Claude drafts a commit message following the rules from CLAUDE.md
3. Claude shows you the exact `git commit` command and waits for approval
4. After approval, Claude commits and reports the short hash

The commit message will look like:
```
docs(git): add Conventional Commits rules and /commit command
```

> "Claude derived the type (`docs`), the scope (`git`), and the imperative description from the diff — not from your instructions. The rules in CLAUDE.md did the work."

### 6d. Ask Claude to review the diff

After committing, ask:

```
Review the diff of the last commit against the rules in CLAUDE.md.
```

Claude runs `git diff HEAD~1..HEAD`, applies the Diff Review Checklist from CLAUDE.md, and produces a structured report. Any checklist failures are flagged by rule name and line.

> "This is the diff review encoded as context — not a one-off checklist you paste in. It lives in the project. Any team member opens this project and gets the same review quality."

### The pattern

| Encoded rule | Where | Effect |
|---|---|---|
| Commit format | `CLAUDE.md` → Git Workflow | Claude rejects/corrects bad messages |
| Diff checklist | `CLAUDE.md` → Git Workflow | Review produces structured findings |
| `/commit` command | `.claude/commands/commit.md` | Full commit workflow in one command |

> "CLAUDE.md is not just project documentation — it's policy enforcement. Every session, every team member, no extra prompting."

---

## What This Demo Teaches

| Feature | What it does |
|---|---|
| `/usage` | See your token budget in real time |
| `/compact` | Compress history, keep context, reduce cost |
| `/clear` | Fresh session — CLAUDE.md still loads |
| CLAUDE.md hierarchy | Permanent, layered context; write once, active always |
| `@`-imports | Modular context — separate project rules from standards |
| Context7 MCP | Fetch live documentation — answers reflect current library versions, not training cutoff |
| PostToolUse hooks | Automated lint/test feedback — Claude self-corrects |
| Custom commands | Reusable workflows as project-local slash commands |
| Git rules in CLAUDE.md | Commit format, diff checklist, PR template enforced every session |
| `/commit` command | Staged diff → valid Conventional Commits message → confirmed commit |

**The pattern**: Each layer makes Claude more capable without more prompting per session. You invest once in configuration; every session benefits automatically.

---

## Resetting After the Demo (Part 6)

The git repository and initial commit are permanent — no reset needed for Part 6.

---

## Resetting After the Demo (Parts 1–5)

If Claude edited `src/processor.ts` during Part 4, restore the intentional violations:

```typescript
// Restore these four issues in processor.ts:
var TAX_RATE = 0.25                          // no-var
export function processDonation(donation: any)  // no-explicit-any
  const debugInfo = `Processing: ${donation.id}` // no-unused-vars
  console.log('Invalid amount:', donation.amount) // no-console
```

Delete any files Claude created during Part 5 (`/scaffold`, `/audit` output).

---

## Files

```
DEMO_INSTRUCTION.md              — this file
CLAUDE.md                        — project rules (loads at session start)
CLAUDE_CODING_STANDARDS.md       — imported by CLAUDE.md via @-syntax
src/CLAUDE.md                    — stricter rules, active inside src/
.mcp.json                        — MCP server configs (placeholder tokens)
.claude/settings.json            — PostToolUse lint hook + git command permissions
.claude/commands/scaffold.md     — /scaffold custom command
.claude/commands/audit.md        — /audit custom command
.claude/commands/commit.md       — /commit: staged diff → validated commit message
.gitignore                       — ignores node_modules, dist, .DS_Store
src/processor.ts                 — donation processor (4 intentional lint violations)
src/types.ts                     — TypeScript interfaces (clean)
package.json                     — ESLint devDependencies
.eslintrc.json                   — ESLint rules
tsconfig.json                    — TypeScript config
```
