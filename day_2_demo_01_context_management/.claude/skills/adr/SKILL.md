# ADR Skill

Record an Architecture Decision for this project.

$ARGUMENTS — a short title describing the decision (e.g. "represent refunds as negative amounts")

## Steps

**1. Find the next ADR number**

List files in `docs/decisions/`. The next number is the highest existing ADR number + 1.
If the directory is empty, start at `001`.

**2. Load the template**

Read `.claude/skills/adr/template.md`.

**3. Fill in the template**

- **Date:** today's date in YYYY-MM-DD format
- **Status:** `Accepted` (default for decisions already in effect) or `Proposed` for new ones
- **Context:** draw from `CLAUDE.md`, `CLAUDE_CODING_STANDARDS.md`, and the relevant source files — explain the constraints that made this decision necessary
- **Decision:** one clear sentence stating what was chosen
- **Consequences:** be specific; reference actual code or rules where relevant

**4. Save**

Write the completed ADR to `docs/decisions/ADR-NNN-<kebab-case-title>.md`.

**5. Report**

Output the file path and a one-line summary of the decision recorded.
