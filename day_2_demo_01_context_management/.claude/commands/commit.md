# Commit Staged Changes

Review staged changes and create a Conventional Commits compliant commit.

$ARGUMENTS (optional: a hint about the intent of the change)

## Steps

**1. Inspect what is staged**

Run `git diff --cached` to read the full staged diff.
If nothing is staged, run `git status` and report — do not proceed.

**2. Draft the commit message**

Apply the rules from CLAUDE.md → Git Workflow → Commit Messages:

- Choose `type` from: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`
- Add `(scope)` only if the change is isolated to one module
- Write the description in **imperative mood**, **lowercase**, max 72 chars, **no trailing period**
- Add a body paragraph if the *why* is not obvious from the diff
- Add `Closes #N` footer if a ticket reference is visible in the diff or in `$ARGUMENTS`

**3. Validate the message before committing**

Check the drafted message against every rule in the "Invalid" list in CLAUDE.md.
If it fails any rule, revise until it passes.

**4. Show the message and ask for confirmation**

Display the exact commit command you will run. Wait for explicit approval before executing.

**5. Commit**

Run `git commit -m "<message>"` with the approved message.
Report the short hash and subject line from `git log -1 --oneline` after the commit.
