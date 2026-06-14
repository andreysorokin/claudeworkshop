# Demo Instructions — Permissions, Plan Mode & Edit Mode

---

## What This Demo Shows

Five things at once, in one short session:

1. **Permissions — write protection** — Claude Code respects a deny list in `.claude/settings.json`. The approved plan (`docs/official/`) is locked; Claude explains why rather than silently skipping.
2. **Permissions — read protection** — The same deny mechanism blocks *reading* too. Claude cannot see the contents of `.env`, making secrets invisible even in-context.
3. **Plan mode vs Edit mode** — Before touching any file, Claude can be asked to *plan first*: it describes every change it intends to make and waits for approval. Only then does it switch to Edit mode and apply the changes.
4. **Pre-hook — location enforcement** — A `PreToolUse` hook blocks any attempt to create a Markdown file outside `docs/draft/`. Claude cannot write `.md` files to arbitrary locations.
5. **Post-hook — structure enforcement** — A `PostToolUse` hook inspects every `##` header in files written or edited inside `docs/draft/`. Any header that is not one of the three standard names is automatically tagged `[NON-STANDARD SECTION]`.

---

## The Documents at a Glance

**`docs/official/project_plan.md`** — locked, 3 approved items:

| #   | Item                           | Status      |
| --- | ------------------------------ | ----------- |
| 1   | Set up development environment | Done        |
| 2   | Define API contract            | Done        |
| 3   | Launch internal beta           | In Progress |

**`docs/draft/project_plan.md`** — editable, adds 2 proposed items + a Pending Decisions section:

| #   | Item                 | Status   |
| --- | -------------------- | -------- |
| 4   | User testing round 1 | Proposed |
| 5   | Performance audit    | Proposed |

---

## File Map — What Claude Can and Cannot Do

| File                                 | Read   | Edit / Write | Why                                                         |
| ------------------------------------ | ------ | ------------ | ----------------------------------------------------------- |
| `CLAUDE.md`                          | Yes    | Yes          | No restriction                                              |
| `DEMO_INSTRUCTION.md`                | Yes    | Yes          | No restriction                                              |
| `docs/draft/project_plan.md`         | Yes    | **Yes**      | Allowed — this is the working copy                          |
| `docs/official/project_plan.md`      | Yes    | **No**       | Write/Edit denied by `.claude/settings.json`                |
| `.env`                               | **No** | **No**       | Read denied — Claude cannot see secrets at all              |
| `.claude/settings.json`              | Yes    | Yes*         | *No deny rule on itself — worth discussing                  |
| `.claude/hooks/docs-draft-only.ts`   | Yes    | Yes          | Pre-hook — enforces Markdown creation location              |
| `.claude/hooks/enforce-structure.ts` | Yes    | Yes          | Post-hook — enforces `##` header structure in `docs/draft/` |

> **Key point:** `docs/official/` is write-protected but still readable. `.env` is read-protected — Claude cannot see the contents at all, so secrets never enter the context window.

---

## Standard `##` Headers for `docs/draft/`

The post-hook recognises exactly three standard section names:

| Header                   | Purpose                          |
| ------------------------ | -------------------------------- |
| `## Approved Work Items` | Items signed off and in progress |
| `## Proposed Additions`  | Items awaiting review            |
| `## Pending Decisions`   | Open questions blocking sign-off |

Any other `##` header is automatically rewritten to `## <title> [NON-STANDARD SECTION]`.

---

## Step-by-Step Walkthrough

### Step 1 — Open the project

```
cd day_1_demo_03_permissions_plan_edit
claude
```

Claude loads, reads `CLAUDE.md`, and learns the two-folder convention before you type anything.

---

### Step 2 — Trigger the permission wall (Edit mode, no plan)

Paste this prompt:

```
Add item 4 (user testing) and item 5 (performance audit) to the project plan,
and resolve the three pending decisions with reasonable defaults.
```

**What happens:** Claude attempts to edit `docs/official/project_plan.md` → permission denied.  
Claude explains the block and redirects itself to `docs/draft/project_plan.md`.

**Stop here.** Point out:
- The deny rules come from `.claude/settings.json` — open it and show participants.
- `CLAUDE.md` reinforced the rule in plain English — Claude read both.
- Claude did not silently skip or crash; it explained and adapted.

---

### Step 3 — Trigger the pre-hook (location enforcement)

Ask Claude to create a Markdown file outside `docs/draft/`:

```
Create a new file docs/UserGuide.md
```

**What happens:** The `PreToolUse` hook (`docs-draft-only.ts`) fires before the write and blocks it with:

> *Markdown files may only be created inside docs/draft/.*

Open `.claude/hooks/docs-draft-only.ts` and show participants:
- The hook reads the tool input from stdin as JSON.
- It checks whether the file path is inside `docs/draft/`.
- It outputs `{"decision": "block", "reason": "…"}` to prevent the write.
- Claude receives the block message and reports it to the user — no file is created.

---

### Step 4 — Trigger the post-hook (structure enforcement)

Ask Claude to add a non-standard section to the draft:

```
Update docs/draft/project_plan.md — add a "List of Stakeholders" section at the end.
```

**What happens:**
1. Claude edits the file and adds `## List of Stakeholders`.
2. The `PostToolUse` hook (`enforce-structure.ts`) runs immediately after.
3. It detects that `List of Stakeholders` is not one of the three standard headers.
4. It rewrites the line to `## List of Stakeholders [NON-STANDARD SECTION]`.

Open the file and show participants the tagged header. Then open `.claude/hooks/enforce-structure.ts` and show:
- The hook reads the file after the edit.
- It scans only `##` headers (H1 document titles are skipped).
- Standard headers are left untouched; everything else gets tagged.

---

### Step 5 — Demonstrate Plan mode

Start a **new session** (`/clear`) so Claude has no memory of the previous attempt.

Enable Plan mode before giving the same prompt:

```
/plan
```

Then paste the same prompt as Step 2.

**What happens in Plan mode:**
- Claude reads all relevant files.
- It outputs a structured plan: *"I will make the following changes to `docs/draft/project_plan.md`: …"* with each change listed.
- It does **not** touch any file yet.
- You see a plan, not a diff.

Point out:
- Plan mode is useful before agentic sessions — you review intent before Claude acts.
- Claude still respects permissions even in plan mode (it will not *plan* to edit `docs/official/`).

---

### Step 6 — Approve and switch to Edit mode

Accept the plan. Claude exits Plan mode automatically and applies every change it described.

Open the diff and walk through it with participants:
- Targeted edits only — the Pending Decisions section is resolved and items 4–5 are confirmed.
- `docs/official/project_plan.md` untouched.

---

## Discussion Points

**On permissions:**
- Where do deny rules live? (`.claude/settings.json` — per-project; also user-level `~/.claude/settings.json`)
- Two types of protection: write-only (`docs/official/`) vs read+write (`.env`) — open `.claude/settings.json` and point to the difference.
- Why deny *read* on `.env`? Anything Claude reads enters the context window and could appear in completions, logs, or subagent calls.
- Is `docs/official/` truly safe? (Yes for writes from Claude; a human with shell access can still edit it — permissions protect against Claude, not the user)
- What else can you deny? (`Bash(rm *)`, `Bash(git push *)`, entire tools like `WebSearch`)

**On hooks:**
- When does a `PreToolUse` hook run? (Before the tool executes — it can block or allow.)
- When does a `PostToolUse` hook run? (After the tool executes — it can modify files, send notifications, log, etc.)
- What languages can hooks be written in? (Any executable — shell scripts, Python, TypeScript via `npx tsx`.)
- What is the security implication of hooks? (They run as the local user — the same person who configured them.)
- Could the post-hook break a valid edit? (Yes, if a team renames a standard section — the hook should be kept in sync with conventions.)

**On Plan vs Edit mode:**
- When would you always use Plan mode? (Changes touching many files, anything irreversible)
- When is Edit mode fine without a plan? (Single-file changes, bug fixes with a failing test as a guardrail)
- What is the escape hatch if a plan looks wrong? (Reject it, refine the prompt, plan again)

---

## Security Gaps & How to Close Them

**1. Hijacking `docs/official/` via Bash**  
`Write`/`Edit` deny rules don't cover the `Bash` tool. `cp`, redirects, and `sed -i` can still overwrite protected files. Fix: add `"Bash(*docs/official*)"` to the deny list.

**2. Protecting `settings.json`**  
Claude can edit `.claude/settings.json` to remove its own deny rules. Add `"Edit(.claude/settings.json)"` and `"Write(.claude/settings.json)"` to the deny list — ideally in the global `~/.claude/settings.json` so the project file can't undo it.

**3. Restricting Bash by substring**  
Add `"Bash(*docs/official*)"` to the `deny` array to block any shell command that references that path.

---

## Reset Instructions (run between workshop groups)

```bash
# Restore docs/draft/project_plan.md to its original state
git checkout -- docs/draft/project_plan.md
```

The official file never changes during the demo, so no reset is needed there.
