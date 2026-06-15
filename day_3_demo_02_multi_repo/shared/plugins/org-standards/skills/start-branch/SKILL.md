---
name: start-branch
description: Start a new feature or fix branch using the org branch-naming convention. Use at the beginning of a piece of work, before making changes. Pass a short description of the work.
---

# Start Branch

Create a new working branch following the org convention. Works in any repo.

`$ARGUMENTS` — a short description of the work (e.g. "add user profile endpoint").

## Steps

1. Decide the type from the description: `feat` for new functionality, `fix` for bug fixes,
   `chore` for tooling/maintenance, `docs` for documentation.
2. Derive a kebab-case slug from the description (e.g. "add user profile endpoint" -> `add-user-profile-endpoint`).
3. Propose the branch name `<type>/<slug>` and confirm it with the user.
4. Check the working tree is clean (`git status`). If there are uncommitted changes, ask before proceeding.
5. Create and switch to the branch: `git checkout -b <type>/<slug>`.
6. Report the branch name and confirm you're on it (`git branch --show-current`).

Do not create a branch off anything other than the current branch unless asked.
