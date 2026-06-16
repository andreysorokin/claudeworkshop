# Shared Repo — Engineering Hub

This is the **shared repo** for the organisation. It plays two roles:

1. **Local plugin marketplace** (`org-shared`) serving one plugin, `org-standards`, which carries
   the skills, commands, code-style and lint/test hooks every repo uses. See
   `.claude-plugin/marketplace.json` and `plugins/org-standards/`.
2. **Cumulative knowledge hub** about how the projects fit together.

@knowledge/architecture.md
@knowledge/glossary.md

## The Three Ways to Run

- **From here (the hub) — "run the whole show".** Launch with:

  ```bash
  claude --add-dir ../backend --add-dir ../frontend
  ```

  You get every shared skill (this repo enables `org-standards@org-shared` itself) plus the
  cumulative knowledge above. Use `/org-standards:spec` to design a cross-repo feature and
  `/org-standards:implement-spec` to dispatch subagents that edit both apps.

- **From `../backend`** — the Express API. Its `.claude/settings.json` points back here as a
  directory marketplace and enables `org-standards`. Nothing is duplicated.

- **From `../frontend`** — the React + Vite app. Same wiring, same single source.

## Why a plugin (not copy-paste)

`CLAUDE.md` and `@imports` cascade across the tree, but **settings, hooks, and skills do not
cascade across sibling repos**. So the only no-duplication way to share skills/hooks/commands is
to package them as a plugin and serve them from a marketplace — which is exactly what this repo
does. The marketplace is a local directory source, so **no git publishing is required**.

## Shared skills (namespaced `/org-standards:<name>`)

- `code-style` — house TypeScript / Express / React conventions (the lint hook enforces them).
- `adr` — record an Architecture Decision Record under `docs/decisions/`.
- `start-branch` — create a `feat/` or `fix/` branch by convention.
- `spec` — brainstorm a feature, write a short spec, split it into repo-tagged tasks.
- `implement-spec` — dispatch one subagent per task to implement a spec.

Plus the `/org-standards:commit` command and a `PostToolUse` lint/test hook.
