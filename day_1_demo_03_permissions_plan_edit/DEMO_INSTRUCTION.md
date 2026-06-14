# Demo Instructions — Permissions, Plan Mode & Edit Mode

---

## What This Demo Shows

Three things at once, in one short session:

1. **Permissions — write protection** — Claude Code respects a deny list in `.claude/settings.json`. The approved plan (`docs/official/`) is locked; Claude explains why rather than silently skipping.
2. **Permissions — read protection** — The same deny mechanism blocks *reading* too. Claude cannot see the contents of `.env`, making secrets invisible even in-context.
3. **Plan mode vs Edit mode** — Before touching any file, Claude can be asked to *plan first*: it describes every change it intends to make and waits for approval. Only then does it switch to Edit mode and apply the changes.

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

| File                            | Read   | Edit / Write | Why                                            |
| ------------------------------- | ------ | ------------ | ---------------------------------------------- |
| `CLAUDE.md`                     | Yes    | Yes          | No restriction                                 |
| `DEMO_INSTRUCTION.md`           | Yes    | Yes          | No restriction                                 |
| `docs/draft/project_plan.md`    | Yes    | **Yes**      | Allowed — this is the working copy             |
| `docs/official/project_plan.md` | Yes    | **No**       | Write/Edit denied by `.claude/settings.json`   |
| `.env`                          | **No** | **No**       | Read denied — Claude cannot see secrets at all |
| `.claude/settings.json`         | Yes    | Yes*         | *No deny rule on itself — worth discussing     |

> **Key point:** `docs/official/` is write-protected but still readable. `.env` is read-protected — Claude cannot see the contents at all, so secrets never enter the context window.

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

### Step 3 — Demonstrate Plan mode

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

### Step 4 — Approve and switch to Edit mode

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

**On Plan vs Edit mode:**
- When would you always use Plan mode? (Changes touching many files, anything irreversible)
- When is Edit mode fine without a plan? (Single-file changes, bug fixes with a failing test as a guardrail)
- What is the escape hatch if a plan looks wrong? (Reject it, refine the prompt, plan again)

---

## Reset Instructions (run between workshop groups)

```bash
# Restore docs/draft/project_plan.md to its original state
git checkout -- docs/draft/project_plan.md
```

The official file never changes during the demo, so no reset is needed there.
