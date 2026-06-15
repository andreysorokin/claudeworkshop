# Multi-Repo: One Shared Harness, Three Ways to Run

This demo shows how to share a Claude Code engineering harness — skills, hooks, a commit command,
code style, and cumulative knowledge — across several repositories **without duplicating anything**,
and how the *same* shared setup is available no matter where you launch Claude.

## The three repos

```
day_3_demo_02_multi_repo/
├── shared/      # the hub: a local plugin marketplace + cumulative knowledge
├── backend/     # Express + TypeScript API
└── frontend/    # React + Vite + TypeScript UI
```

- **shared/** serves a local marketplace `org-shared` with one plugin, **`org-standards`**, which
  bundles the skills, the `/commit` command, and a PostToolUse lint/test hook. It also holds
  cumulative knowledge (`knowledge/architecture.md`, `knowledge/glossary.md`).
- **backend/** and **frontend/** each contain only a ~6-line `.claude/settings.json` that points at
  `../shared` and enables the plugin — plus their own project `CLAUDE.md`. No shared content is
  copied into them.

## The key idea

`CLAUDE.md` and `@imports` cascade across the directory tree, but **settings, hooks, and skills do
NOT cascade across sibling repos**. So the no-duplication way to share skills/hooks/commands is to
**package them as a plugin** and serve them from a **marketplace** — the officially recommended
pattern. Because the marketplace is a local `directory` source, **no git publishing is required**.

Code style is delivered the plugin-native way: a `code-style` **skill** (guidance) plus a
**lint hook** (enforcement) — so there is no manual `@import` of a style file anywhere.

## The three ways to run

| # | Launch from | Command | What you get |
|---|-------------|---------|--------------|
| 1 | `shared/` (the hub) | `claude --add-dir ../backend --add-dir ../frontend` | All shared skills + cumulative knowledge; orchestrate features across both apps via `/org-standards:spec` → `/org-standards:implement-spec`. |
| 2 | `backend/` | `claude` | Express API with the full shared harness — nothing duplicated. |
| 3 | `frontend/` | `claude` | React app with the same shared harness. |

In every mode the shared skills are namespaced `/org-standards:<name>`:
`code-style`, `adr`, `start-branch`, `spec`, `implement-spec` (plus the `/org-standards:commit` command).

## Quick start

```bash
# backend
cd backend && npm install && npm run dev      # http://localhost:3001/api/health

# frontend (separate terminal)
cd frontend && npm install && npm run dev     # http://localhost:5173  (proxies /api -> backend)
```

See `DEMO_INSTRUCTION.md` for the full walkthrough.
