---
name: spec
description: Brainstorm a new feature with the user, write a short spec, and break it into implementable tasks. Use when starting a non-trivial feature that spans one or more repos, before any code is written. Pass the feature idea.
---

# Spec

Turn a rough feature idea into a short, shared spec with a task checklist. Works from any repo,
and is especially useful from the `shared/` hub when a feature touches both backend and frontend.

`$ARGUMENTS` — the feature idea (e.g. "let users save a favourite item").

## Steps

**1. Brainstorm**

Ask the user 2–4 focused questions to pin down scope, the user-facing behaviour, and which
repos are affected (backend, frontend, or both). Keep it short — don't over-interrogate.

**2. Load the template**

Read `template.md` from this skill's directory.

**3. Write the spec**

Derive a kebab-case slug from the feature name. Fill in the template:
- **Problem / Goal / Non-goals** — crisp, a few bullets each.
- **Approach** — the chosen design, referencing the cross-repo contract in
  `../shared/knowledge/architecture.md` when relevant.
- **Tasks** — a checklist of small, independently-implementable tasks. **Tag each task with its
  repo** in the form `- [ ] (backend) ...` / `- [ ] (frontend) ...`. Each task should be doable
  by one subagent in one pass.

Write it to `docs/specs/<slug>.md` (create the directory if needed). When run from the hub,
write to `shared/docs/specs/<slug>.md` so it's the shared source of truth.

**4. Report**

Output the spec path and the task list. Tell the user they can run `/org-standards:implement-spec`
to execute it.
