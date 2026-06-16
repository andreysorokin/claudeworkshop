#!/usr/bin/env bash
# PostToolUse hook (shared via the org-standards plugin).
#
# Reads the hook payload from stdin, finds the edited file, walks up to the
# nearest package.json, and runs that package's lint (and tests for test files).
#
# Walking up to the package root is what makes this hook correct in ALL three
# run modes — including launching Claude in shared/ with `--add-dir ../backend`,
# where the cwd is shared/ but the edited file lives under ../backend.

set -euo pipefail

payload="$(cat)"

# Extract the edited file path from the hook payload (no jq dependency — node is
# always present in these TypeScript repos).
file_path="$(printf '%s' "$payload" | node -e '
  let raw = "";
  process.stdin.on("data", (d) => (raw += d));
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(raw);
      process.stdout.write((j.tool_input && j.tool_input.file_path) || "");
    } catch {
      process.stdout.write("");
    }
  });
' 2>/dev/null || true)"

# Only react to TypeScript/JavaScript source edits.
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs) ;;
  *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0

# Walk up from the edited file to the nearest package.json.
dir="$(cd "$(dirname "$file_path")" && pwd)"
pkg_dir=""
while [ "$dir" != "/" ]; do
  if [ -f "$dir/package.json" ]; then
    pkg_dir="$dir"
    break
  fi
  dir="$(dirname "$dir")"
done

[ -n "$pkg_dir" ] || exit 0

cd "$pkg_dir"

# Skip silently if dependencies aren't installed yet.
[ -d node_modules ] || { echo "[org-standards] node_modules missing in $pkg_dir — run 'npm install' to enable lint/test hooks."; exit 0; }

echo "[org-standards] lint: $(basename "$pkg_dir")"
npm run --silent lint 2>&1 | tail -20 || true

# Run tests too when a test file was edited.
case "$file_path" in
  *.test.*|*.spec.*|*/__tests__/*)
    echo "[org-standards] test: $(basename "$pkg_dir")"
    npm test --silent 2>&1 | tail -20 || true
    ;;
esac

exit 0
