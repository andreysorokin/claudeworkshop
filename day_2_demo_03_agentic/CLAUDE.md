# Code Quality Reporter — Agentic Demo

## What This Demonstrates

An **orchestrator → sub-agent** pipeline with hook-driven validation:

```
Main session (orchestrator)
  └── spawns analyst   → writes reports/metrics.json
        └── [hook validates metrics.json]
  └── spawns formatter → writes reports/metrics-data.md
        └── [hook validates metrics-data.md]
```

## Sub-Agents

Two agent definitions live in `.claude/agents/`:

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| `analyst` | Reads `src/` and extracts metrics | Source files | `reports/metrics.json` |
| `formatter` | Reads `reports/metrics.json` and writes a report | metrics.json | `reports/metrics-data.md` |

## Hook

After every `Write` tool call, `.claude/settings.json` runs `bash validate.sh`.

`validate.sh` checks:
- If `reports/metrics.json` was just written: valid JSON with required keys
- If `reports/metrics-data.md` was just written: contains `## Summary` and `## Metrics` sections
- Other files: passes silently

## Running the Demo

Ask the orchestrator:
> "Generate the code quality report for the src/ directory using the analyst and formatter agents."

Or headless:
```bash
claude -p "Generate the code quality report for the src/ directory using the analyst and formatter agents."
```
