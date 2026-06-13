# Demo: Agentic Sessions

---

## Setup (before the session)

```bash
cd day_2_demo_03_agentic
# No npm install needed — no Node.js dependencies
# Ensure reports/ is empty
rm -f reports/metrics.json reports/metrics-data.md
```

---

## Use Case

The engineering team wants automated code quality reporting with no human in the loop. Every night a CI job should scan the codebase, produce a structured report, and fail loudly if the output is malformed — all without anyone opening a Claude session.

The agentic pipeline models exactly this:

- **`analyst` agent** reads source files and writes structured JSON — one clear responsibility
- **`formatter` agent** turns that JSON into a human-readable report — another clear responsibility
- **PostToolUse hook** validates every file write — bad output is caught immediately and the agent retries
- **`claude -p`** runs the whole chain headlessly — same pipeline, no interactive session, composable with any scheduler or CI system

---

## Teaching Points

1. **Sub-agents decompose large tasks** — each agent has a single responsibility
2. **PostToolUse hooks validate every output** — no bad intermediate files propagate
3. **Agents read each other's outputs** via shared files (or could use tools/resources)
4. **Headless `-p`** — same pipeline, no interactive session needed

---

## Walkthrough Script

### Step 1 — Show the architecture (3 min)

Open `.claude/agents/` and walk through the two agent definition files:
- `analyst.md` — scoped to reading and counting; outputs structured JSON
- `formatter.md` — scoped to writing; takes JSON and produces markdown

> "Each agent only knows what it needs to know. The orchestrator coordinates them."

Show `validate.sh`:
> "This runs after every file write — if the output is malformed, the agent sees the error and retries."

### Step 2 — Run the pipeline (15 min)

Ask Claude:
> "Generate the code quality report for the src/ directory using the analyst and formatter agents."

Watch Claude:
1. Spawn `analyst` to analyse `src/`
2. Analyst writes `reports/metrics.json`
3. Hook fires — validate.sh checks the JSON — passes
4. Spawn `formatter` with the metrics
5. Formatter writes `reports/metrics-data.md`
6. Hook fires — validate.sh checks the report structure — passes

Open `reports/metrics-data.md` when done and show the result to the audience.

### Step 3 — Simulate a validation failure (5 min)

Corrupt the expected format: open `formatter.md` and temporarily remove `## Metrics` from the required sections list. Re-run. Show the hook failing and the formatter correcting itself.

Restore `formatter.md` when done.

### Step 4 — Headless execution (5 min)

Two layers of permission control work together here:

- **`settings.json`** pre-approves `Write(reports/*)` — scopes write access to the output directory only, used in interactive sessions to reduce prompts
- **`--dangerously-skip-permissions`** bypasses all remaining permission checks — required for fully unattended `-p` runs where there is no user to approve anything

The `-p` flag prints output and exits. Pass `--dangerously-skip-permissions` for sub-agents to write files without any prompt.

**Option A — full pipeline** (analyst scans src/, then formatter produces the report):

```bash
cd day_2_demo_03_agentic
rm -f reports/metrics.json reports/metrics-data.md

claude --dangerously-skip-permissions -p "Use the analyst agent to analyse src/ and write reports/metrics.json, then use the formatter agent to turn that into reports/metrics-data.md"
```

**Option B — formatter only** (metrics.json already exists, just reformat):

```bash
claude --dangerously-skip-permissions -p "Use the formatter agent to read reports/metrics.json and produce reports/metrics-data.md"
```

**Check the exit code** (0 = success, non-zero = something failed — useful as a CI gate):

```bash
echo $?
```

**Capture output** for logging:

```bash
claude --dangerously-skip-permissions -p "Use the analyst agent to analyse src/ and write reports/metrics.json, then use the formatter agent to turn that into reports/metrics-data.md" > run.log 2>&1
```

> "`--dangerously-skip-permissions` is what CI usage looks like. No GUI, no prompts. The agents are loaded from `.claude/agents/`, the hook still fires on every write, and the exit code tells your pipeline whether to proceed. The flag name is intentionally loud — it signals that you've taken responsibility for what the prompt does, which is appropriate when you own the code and the environment."

### Step 5 — Team / multi-step patterns (5 min)

> "The same pattern scales:
> - 10 analyst agents running on 10 modules in parallel
> - A test-writer agent that reads the report and generates tests for low-coverage files
> - A PR-description agent that summarises all the output at the end"

Show the hooks config in `.claude/settings.json` — one hook, catches everything.

---

## Files

```
.claude/agents/analyst.md     — sub-agent: analyses src/ → metrics.json
.claude/agents/formatter.md   — sub-agent: formats metrics.json → metrics-data.md
.claude/settings.json         — PostToolUse hook: runs validate.sh after Write
validate.sh                   — validates output file structure
src/                          — sample codebase to analyse
reports/                      — output directory (empty at start)
```
