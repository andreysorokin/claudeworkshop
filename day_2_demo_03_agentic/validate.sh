#!/usr/bin/env bash
# Validates reports/metrics.json after each Write tool call.
# Called by the PostToolUse hook — exits 0 (silent) if not applicable.

validate_metrics() {
  local file="reports/metrics.json"
  [ -f "$file" ] || return 0

  if ! python3 -c "import json,sys; d=json.load(open('$file')); assert 'sourceFiles' in d and 'totals' in d and 'generatedAt' in d" 2>/dev/null; then
    echo "ERROR [validate.sh]: reports/metrics.json is missing required keys (generatedAt, sourceFiles, totals)"
    exit 1
  fi

  echo "✓ reports/metrics.json is valid"
}

validate_metrics
