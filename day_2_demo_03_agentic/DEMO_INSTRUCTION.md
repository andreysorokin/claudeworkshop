# Demo: Agentic Sessions

---

## Setup

```bash
cd day_2_demo_03_agentic
# No npm install needed
rm -f reports/metrics.json reports/metrics-data.md
```

---

## The Story

The Enchanted Stables engineering team wants nightly code quality reports — no human in the loop, no open sessions. A CI job scans the codebase, writes a structured report, and fails loudly if anything is malformed.

This demo is that pipeline.

- **`analyst` agent** — reads `src/`, writes structured JSON
- **`formatter` agent** — turns that JSON into a markdown report
- **PostToolUse hook** — validates every write; bad output fails fast
- **`claude -p`** — runs the whole thing headlessly

---

## Teaching Points

1. **Each agent has one job** — scope prevents accidents; composition enables complexity
2. **Hooks validate every output** — bad files don't propagate downstream

---

## Walkthrough

### Step 1 — Show the architecture (3 min)

Open `.claude/agents/` — two files, two clear responsibilities:
- `analyst.md` — reads and counts; outputs JSON only
- `formatter.md` — writes markdown only

Show `validate.sh`:

> "Fires after every Write. Bad JSON or missing sections? Agent sees the error and retries."

### Step 2 — Run the pipeline (15 min)

> 💬 Ask: "Generate the code quality report for src/ using the analyst and formatter agents."

Watch:
1. `analyst` spawns → scans `src/` → writes `reports/metrics.json`
2. Hook fires → validate.sh passes
3. `formatter` spawns → reads the JSON → writes `reports/metrics-data.md`
4. Hook fires → passes

Open `reports/metrics-data.md` and show it.

### Step 3 — Simulate a failure (5 min)

Temporarily remove `## Metrics` from the required sections in `formatter.md`. Re-run. Show the hook fail — the formatter sees the error and corrects itself.

Restore `formatter.md`.

### Step 4 — Headless execution (5 min)

Two permission layers:
- **`settings.json`** pre-approves `Write(reports/*)` for interactive sessions
- **`--dangerously-skip-permissions`** bypasses all remaining checks for CI

**`--allowedTools` — whitelist specific tools:**

```bash
claude -p "Create a README.txt file with a few words about the project" --allowedTools "Read"
```

Claude has no `Write` tool available, so it stops and reports back:

> _"It seems the write was not approved. Please grant permission to write the file and I'll try again, or let me know if you'd like to adjust the content first."_

> "This is the other end of the spectrum — instead of skipping all checks, you explicitly list what the agent is allowed to do. Useful when you want a sandboxed agent that can read but never modify anything."

**Full pipeline:**

```bash
rm -f reports/metrics.json reports/metrics-data.md

claude  -p \
  "Use the analyst agent to analyse src/ and write reports/metrics.json, \
   then use the formatter agent to produce reports/metrics-data.md"
```

**Formatter only** (metrics.json already exists):

```bash
claude  -p \
  "Use the formatter agent to read reports/metrics.json and produce reports/metrics-data.md"
```

Check the exit code:

```bash
echo $?   # 0 = success; non-zero = CI gate fails
```

> "The flag name is intentionally loud. It signals you've taken responsibility for what the prompt does — appropriate when you own the code and the environment."

### Step 5 — Scale the pattern (5 min)

> "Same pattern, bigger team:
> - 10 analyst agents on 10 modules in parallel
> - A test-writer agent that reads the report and generates tests for low-coverage files
> - A PR-description agent that summarises everything at the end"

Show `.claude/settings.json` — one hook, catches every write.

---

## Files

```
.claude/agents/analyst.md     — sub-agent: analyses src/ → metrics.json
.claude/agents/formatter.md   — sub-agent: formats metrics.json → metrics-data.md
.claude/settings.json         — PostToolUse hook: runs validate.sh after Write
validate.sh                   — validates output file structure
src/                          — codebase to analyse (Enchanted Stables supply shop)
reports/                      — output directory (empty at start)
```
