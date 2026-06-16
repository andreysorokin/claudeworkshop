---
name: implement-spec
description: Read a spec's task checklist and dispatch one subagent per task to implement them, then collect the results. Use after /org-standards:spec has produced a spec, to execute it — works best from the shared/ hub driving both repos. Pass the spec path or slug.
---

# Implement Spec

Execute a spec by farming its tasks out to subagents. This is the agentic showcase: one
orchestrator, many parallel workers, all sharing the same org standards.

`$ARGUMENTS` — the spec file path or slug (e.g. `docs/specs/favourite-item.md`).

## Steps

**1. Load the spec**

Read the spec file. Extract the **Tasks** checklist. Each `- [ ]` line is one unit of work; note
its repo tag `(backend)` / `(frontend)`.

**2. Check the working context**

If running from the `shared/` hub, confirm the target repos were added with
`--add-dir ../backend --add-dir ../frontend` so subagents can edit them. If not, tell the user
the launch command and stop.

**3. Dispatch one subagent per task**

For each unfinished task, launch a subagent (run independent tasks in parallel — a single message
with multiple Agent calls). Give each subagent:
- the task text and its repo,
- the spec path for context,
- an instruction to follow the org conventions via the `/org-standards:code-style` skill,
- the constraint to touch only files in its tagged repo.

For tasks with a dependency (e.g. frontend consumes a new backend route), run the backend task
first, then the dependent task.

**4. Collect and verify**

As each subagent returns, mark its task `- [x]` in the spec. The shared lint/test hook runs on
every edit, so failures surface automatically — re-dispatch or fix as needed.

**5. Report**

Summarise what each subagent did, which files changed in each repo, and the final state of the
task checklist.
