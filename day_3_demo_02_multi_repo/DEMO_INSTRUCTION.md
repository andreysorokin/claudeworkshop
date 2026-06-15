# Demo: One Shared Harness Across Many Repos

---

## The Story

The organisation has outgrown a single repo. There's now a backend and a frontend, and more on the
way. Every repo should follow the same code style, use the same skills, and run the same lint/test
hooks — but nobody wants to copy-paste `.claude/` setup into every project and keep it in sync.

Today you'll set up **one shared repo** that every project borrows from, and you'll run Claude three
different ways — from the hub, from the backend, and from the frontend — proving the shared harness
shows up everywhere without being duplicated anywhere.

---

## Setup

```bash
cd day_3_demo_02_multi_repo
( cd backend  && npm install )
( cd frontend && npm install )
```

Three repos sit side by side: `shared/`, `backend/`, `frontend/`.

---

## Part 1 — The Problem: Standards That Don't Cascade (15 min)

### 1a. Show the shape

Open the three directories. Point out that `backend/.claude/settings.json` and
`frontend/.claude/settings.json` are tiny, and neither contains any skills, hooks, or a code-style
file.

> "The naive fix is to copy a `.claude/skills/` and a hooks block into every repo. That doesn't
> scale — five repos later, they've all drifted."

### 1b. Name the constraint

> "Here's the rule that decides the design: **`CLAUDE.md` and `@imports` cascade up the directory
> tree, but settings, hooks, and skills do NOT cascade across sibling repos.** So sharing the
> *harness* can't rely on the filesystem — it needs a real distribution mechanism."

**The point:** Knowledge cascades; the harness doesn't. That gap is what a plugin fills.

---

## Part 2 — The Shared Repo as a Marketplace (25 min)

### 2a. Tour the marketplace

Open `shared/.claude-plugin/marketplace.json` and `shared/plugins/org-standards/.claude-plugin/plugin.json`.

> "`shared/` is a **local plugin marketplace** called `org-shared`. It serves one plugin,
> `org-standards`. Because the marketplace source is a local `directory`, there's **no git to
> publish** — it's just a folder on disk."

### 2b. What the plugin bundles

Walk through `shared/plugins/org-standards/`:
- `skills/` — `code-style`, `adr`, `start-branch`, `spec`, `implement-spec`
- `commands/commit.md` — the `/commit` helper
- `hooks/hooks.json` + `scripts/lint.sh` — the PostToolUse lint/test hook

> "Code style ships as a **skill plus a lint hook** — guidance the model can pull in, and
> enforcement that runs on every edit. A plugin can't inject an always-on `CLAUDE.md`, so this is
> the plugin-native way to enforce conventions. No manual `@import` anywhere."

### 2c. How a repo opts in

Open `backend/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "org-shared": { "source": { "source": "directory", "path": "../shared" } }
  },
  "enabledPlugins": { "org-standards@org-shared": true }
}
```

> "Six lines. That's the entire cost of joining the org standard. The frontend's file is identical
> except for its deny globs."

**The point:** Define skills/hooks once in a plugin; every repo enables it with a few lines.

---

## Part 3 — Run Mode 2: From the Backend (25 min)

```bash
cd backend
claude
```

### 3a. Prove the plugin loaded

```
/plugin marketplace list      # shows org-shared
/plugin                       # shows org-standards enabled
```

### 3b. Use a shared skill

> 💬 Ask: "Record an ADR: we use node:test for backend unit tests."

Claude runs `/org-standards:adr` and writes `docs/decisions/ADR-001-*.md` — a skill it never had
to define locally.

### 3c. Watch the shared hook fire

> 💬 Ask: "Add a `GET /api/version` route that returns `{ version: '1.0.0' }`, following our code style."

When Claude saves the file, the plugin's PostToolUse hook runs `npm run lint` (`tsc --noEmit`)
automatically — output appears inline. Claude self-corrects on any type error.

**The point:** Skills and hooks defined in `shared/` work here with zero local duplication.

---

## Part 4 — Run Mode 3: From the Frontend (15 min)

```bash
cd ../frontend
claude
```

### 4a. Same harness, different repo

> 💬 Ask: "What's our code style for React components?"

Claude pulls in `/org-standards:code-style` — the same skill the backend used.

### 4b. Hook fires for the frontend too

> 💬 Ask: "Add a `formatService` helper to `src/api.ts` that upper-cases the service name, with a Vitest test."

Saving triggers the shared hook; because a `.ts` and a test file changed, it runs both `npm run
lint` and `npm test` for the *frontend's* package — the hook script finds the right package root
on its own.

> "Notice what's different between the two repos: only the project `CLAUDE.md`. Everything shared is
> in one place."

**The point:** One source of truth; the difference between repos is only their own domain knowledge.

---

## Part 5 — Run Mode 1: The Hub Runs the Whole Show (35 min)

```bash
cd ../shared
claude --add-dir ../backend --add-dir ../frontend
```

### 5a. Cumulative knowledge

> 💬 Ask: "What does this system look like, end to end?"

Claude reads `shared/CLAUDE.md`, which imports `knowledge/architecture.md` and `knowledge/glossary.md`
— it describes both apps and the HTTP contract without you opening either repo.

### 5b. Spec a cross-repo feature

> 💬 Ask: "Let users fetch a build info banner. Use /org-standards:spec to design it across both repos."

Claude brainstorms briefly, then writes `shared/docs/specs/<slug>.md` with a **repo-tagged task
checklist** — some `(backend)`, some `(frontend)`.

### 5c. Implement it with subagents

> 💬 Ask: "Now run /org-standards:implement-spec on that spec."

Claude dispatches one subagent per task — backend route first, then the frontend caller — each
following `/org-standards:code-style`, each touching only its own repo. The lint hook verifies every
edit. Claude reports what changed in each repo and ticks the checklist.

**The point:** From the hub you orchestrate the whole system. The same shared skills the individual
repos used are what power the cross-repo agentic loop.

---

## What This Demo Teaches

| Part | Capability |
|---|---|
| The problem | Knowledge cascades across repos; settings/hooks/skills do not |
| Marketplace | Share a harness as a local plugin — no duplication, no git |
| From backend | Shared skills + lint hook with a 6-line opt-in |
| From frontend | Identical harness; only domain knowledge differs |
| The hub | Cumulative knowledge + subagent orchestration across both repos |

---

## Reset After Demo

```bash
# Remove anything generated during the demo
rm -rf backend/docs frontend/docs shared/docs
git checkout -- backend/src frontend/src   # if live edits were committed/staged

# Optional: drop installed deps
rm -rf backend/node_modules frontend/node_modules
```

If `/org-standards:start-branch` created a branch, switch back: `git checkout main`.

---

## Files

```
README.md                                   — repo map + the three run modes
DEMO_INSTRUCTION.md                          — this file
shared/CLAUDE.md                             — hub: cumulative knowledge + how to run the show
shared/knowledge/architecture.md             — the cross-repo HTTP contract (imported by CLAUDE.md)
shared/knowledge/glossary.md                 — shared terms (imported by CLAUDE.md)
shared/.claude-plugin/marketplace.json       — the local marketplace "org-shared"
shared/.claude/settings.json                 — hub enables org-standards for itself
shared/plugins/org-standards/.claude-plugin/plugin.json
shared/plugins/org-standards/skills/code-style/SKILL.md       — TS/Express/React conventions
shared/plugins/org-standards/skills/adr/{SKILL.md,template.md}
shared/plugins/org-standards/skills/start-branch/SKILL.md
shared/plugins/org-standards/skills/spec/{SKILL.md,template.md}
shared/plugins/org-standards/skills/implement-spec/SKILL.md
shared/plugins/org-standards/commands/commit.md               — /org-standards:commit
shared/plugins/org-standards/hooks/hooks.json                 — PostToolUse lint/test
shared/plugins/org-standards/scripts/lint.sh                  — finds package root, runs lint/test
backend/.claude/settings.json                — registers ../shared marketplace + enables plugin
backend/CLAUDE.md                            — backend facts + plugin pointer
backend/src/{index.ts,server.ts,routes/health.ts,__tests__/health.test.ts}
frontend/.claude/settings.json               — same wiring, pointing at ../shared
frontend/CLAUDE.md                           — frontend facts + plugin pointer
frontend/src/{main.tsx,App.tsx,api.ts,api.test.ts}
```
