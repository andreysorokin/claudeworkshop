---
description: Stage changes and write a conventional-commit message derived from the diff.
---

# Commit

Create a well-formed commit for the current changes, following the org git conventions.

## Steps

1. Run `git status` and `git diff --staged` (and `git diff` for unstaged) to see what changed.
2. If nothing is staged, stage the relevant changed files with `git add` (never `git add -A`
   blindly — only the files related to this change).
3. Compose a **conventional-commit** message:
   - First line: `type(scope): summary` — `type` is one of
     `feat`, `fix`, `chore`, `docs`, `refactor`, `test`; `scope` is the repo/area; summary is
     imperative and ≤ 72 chars.
   - Optional body: a short paragraph on the *why* when it isn't obvious.
4. Commit with the composed message.
5. Report the commit hash and the subject line.

Do not push. Do not amend existing commits unless explicitly asked.
