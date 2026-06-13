# Demo — Plan Mode vs Edit Mode

**Files:** `notes.md` — a short team notes document with two TODOs

> Claude Code works on any text file, not just source code.
> This demo uses a plain Markdown document so the focus stays on the *mode*, not the language.

---

## The task

> "Fill in the two TODO sections in notes.md."

Run this twice — once in Edit mode, once in Plan mode.

---

## Round 1 — Edit Mode (Claude acts immediately)

Open Claude Code:
```
claude
```

Prompt:
```
Fill in the two TODO sections in notes.md with a short paragraph each.
```

**What happens:** Claude reads `notes.md`, proposes a diff for each section, and asks you to approve before writing. You see the exact text it intends to add — approve, and it's applied.

Point out: you approved the *diff*, but Claude had already decided the wording and structure before you saw anything. There was no moment to steer the approach.

Reset before Round 2:
```bash
git checkout -- notes.md
```

---

## Round 2 — Plan Mode (Claude proposes first)

Open Claude Code again:
```
claude
```

Switch to Plan mode, then give the same prompt:
```
/plan

Fill in the two TODO sections in notes.md with a short paragraph each.
```

**What happens:**
1. Claude reads `notes.md`.
2. It describes what it *intends* to write for each section — without touching the file.
3. You can redirect: *"For on-call, mention PagerDuty. For incidents, keep it to two sentences."*
4. You approve → Claude exits Plan mode and applies the edit exactly as described.

Open the file and show the result.

---

## What to compare

| | Edit mode | Plan mode |
|-|-----------|-----------|
| What you approve | The diff (exact text) | The intent first, then the diff |
| Can you steer the approach before Claude writes? | No | Yes |
| Best for | Small, obvious changes | Anything where intent matters |

---

## Key message

Plan mode is not a code feature — it is a *workflow* feature. It applies equally to documentation, configuration, commit messages, test data, or any other text Claude touches. Use it whenever you want to review intent before the change lands.

---

## Discussion

- When would you use Plan mode on a real task? (Refactors, migrations, anything touching many files)
- What happens if you reject the plan? (Refine the prompt, plan again — no files were touched)
- How is this similar to reviewing a PR before merging?
