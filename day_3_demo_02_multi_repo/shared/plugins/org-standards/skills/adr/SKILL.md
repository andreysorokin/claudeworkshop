---
name: adr
description: Record an Architecture Decision Record (ADR) for the current repo. Use when a meaningful technical decision is made (choosing a library, a pattern, an API contract) and should be written down. Pass a short title describing the decision.
---

# ADR Skill

Record an Architecture Decision for the current project. Works in any repo.

`$ARGUMENTS` — a short title describing the decision (e.g. "use node:test for backend unit tests").

## Steps

**1. Find the next ADR number**

List files in `docs/decisions/`. The next number is the highest existing ADR number + 1.
If the directory is empty or missing, start at `001`.

**2. Load the template**

Read `template.md` from this skill's directory.

**3. Fill in the template**

- **Date:** today's date in `YYYY-MM-DD` format
- **Status:** `Accepted` (default for decisions already in effect) or `Proposed` for new ones
- **Context:** the constraints that made this decision necessary — draw from `CLAUDE.md`, the
  `/org-standards:code-style` conventions, and the relevant source files
- **Decision:** one clear sentence stating what was chosen
- **Consequences:** be specific; reference actual code or rules where relevant

**4. Save**

Write the completed ADR to `docs/decisions/ADR-NNN-<kebab-case-title>.md`.

**5. Report**

Output the file path and a one-line summary of the decision recorded.
