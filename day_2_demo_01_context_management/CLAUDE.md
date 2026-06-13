# Donation Processor

@CLAUDE_CODING_STANDARDS.md

## Project Purpose

TypeScript library for processing charitable donations, calculating Gift Aid, and generating donor summaries.

## Domain Rules

- Currency is always **GBP (£)**, two decimal places, no thousand-separators
- Gift Aid rate is **25%** of the net donation amount (UK basic-rate taxpayer, 2024)
- Donations must be ≥ **£1.00** to be eligible for Gift Aid
- Donor must have a signed Gift Aid declaration on file before Gift Aid is claimed
- Refunds are represented as negative amounts — never as a separate data structure

## Key Files

- `src/types.ts` — all shared TypeScript interfaces; no business logic here
- `src/processor.ts` — core donation processing functions
- `.eslintrc.json` — lint rules enforced automatically via PostToolUse hook on every edit
- `.claude/commands/` — project slash commands: `/scaffold`, `/audit`

## Development Notes

ESLint runs automatically after every file edit (PostToolUse hook in `.claude/settings.json`).
Fix violations before moving on — Claude will self-correct if the hook output shows errors.

---

## Git Workflow

### Commit Messages — Conventional Commits

Format: `type(scope): short description`

**Rules:**
- `type` must be one of: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`
- `scope` is optional — use the module name when the change is isolated (e.g. `gift-aid`, `processor`, `types`)
- Description: **imperative mood**, **lowercase**, **no trailing period**, max 72 characters
- Body (optional): explain **why**, not what — the diff already shows what changed
- Footer: `Closes #N` when the commit resolves a tracked issue

**Valid examples:**
```
feat(gift-aid): add multiplier validation for batch donations
fix(processor): reject negative amounts before Gift Aid calculation
refactor(types): extract DonorRecord interface from ProcessResult
test(processor): cover zero-amount edge case in processDonation
docs: document Gift Aid eligibility rules in CLAUDE.md
chore: upgrade eslint-plugin to 7.x
```

**Invalid — never use these patterns:**
```
✗  Fixed bug                          ← no type, past tense
✗  WIP                                ← not a commit message
✗  feat: Added validation.            ← past tense + trailing period
✗  update stuff                       ← no type, vague
✗  FEAT: validate amounts             ← uppercase type
```

### Branch Naming

Pattern: `type/short-description` — same type vocabulary as commits, words separated by hyphens.

```
feat/gift-aid-multiplier
fix/negative-amount-rejection
refactor/donor-types
```

### PR Descriptions

Every PR description must include:
1. **What** — one sentence: what changed and in which module
2. **Why** — one sentence: the business or technical reason
3. **Test plan** — bullet list of what was tested (manual steps or test file references)
4. **Breaking changes** — state `None` explicitly if there are none

### Diff Review Checklist

Before asking Claude to review a diff, it checks:
- [ ] No `any` types introduced
- [ ] No `var` declarations
- [ ] No `console.log` left in
- [ ] Every new exported function has a JSDoc block
- [ ] Commit message matches Conventional Commits format
- [ ] No unrelated changes bundled in the same commit
