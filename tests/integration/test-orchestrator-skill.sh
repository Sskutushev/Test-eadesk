#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_ORCHESTRATOR_TEST:-}" = "1" ]; then
  echo "Skipping orchestrator skill test (SKIP_ORCHESTRATOR_TEST=1)"
  exit 0
fi

if ! command -v claude > /dev/null 2>&1; then
  echo "Claude CLI not found. Set SKIP_ORCHESTRATOR_TEST=1 to skip."
  exit 0
fi

SUPERPOWERS_DIR="$HOME/.claude/superpowers"

echo "========================================"
echo " Integration Test: orchestrator-skill"
echo "========================================"

TEST_PROJECT=$(mktemp -d)
trap "rm -rf $TEST_PROJECT" EXIT

cp -r "$(pwd)" "$TEST_PROJECT/signal-lab"
cd "$TEST_PROJECT/signal-lab"

PROMPT="Using the orchestrator-skill, add a new scenario type 'network_timeout' to Signal Lab.\nIt should: sleep 3 seconds, log a WARN, and succeed (status 200, no exception).\nBreak the task into atomic subtasks and show the execution plan before implementing."

cd "$SUPERPOWERS_DIR"
timeout 1800 claude -p "$PROMPT" \
  --allowed-tools=all \
  --add-dir "$TEST_PROJECT/signal-lab" \
  --permission-mode bypassPermissions \
  2>&1 | tee "$TEST_PROJECT/orchestrator-output.txt"

SESSION_DIR="$HOME/.claude/projects/$(echo "$SUPERPOWERS_DIR" | sed 's|/|-|g' | sed 's|^-||')"
SESSION_FILE=$(find "$SESSION_DIR" -name "*.jsonl" -type f -mmin -30 | sort -r | head -1)

echo ""
echo "=== Verification ==="

if [ -n "$SESSION_FILE" ] && grep -q '"skill":"orchestrator-skill"' "$SESSION_FILE" 2>/dev/null; then
  echo "  [PASS] Orchestrator skill invoked"
else
  echo "  [WARN] Could not verify skill invocation from transcript"
fi

if grep -q "network_timeout" "$TEST_PROJECT/signal-lab/backend/prisma/schema.prisma"; then
  echo "  [PASS] network_timeout added to Prisma schema"
else
  echo "  [FAIL] network_timeout NOT in Prisma schema"
fi

if grep -q "network_timeout" "$TEST_PROJECT/signal-lab/backend/src/scenario/scenario.service.ts"; then
  echo "  [PASS] network_timeout case in scenario.service.ts"
else
  echo "  [FAIL] network_timeout case NOT in scenario.service.ts"
fi

echo ""
echo "========================================"
