#!/usr/bin/env bash
set -e

echo "Pre-commit: checking observability integrity..."

ERRORS=0

SENTRY_CALLS=$(grep -r "Sentry.captureException" backend/src/scenario/ 2>/dev/null | wc -l)
if [ "$SENTRY_CALLS" -lt 1 ]; then
  echo "Missing Sentry.captureException in scenario service"
  ERRORS=$((ERRORS + 1))
fi

CONSOLE_LOGS=$(grep -r "console\.log\|console\.error" backend/src/ 2>/dev/null | grep -v ".spec." | wc -l)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
  echo "Found console.log/console.error - use AppLogger instead"
fi

if git diff --cached --name-only | grep -q "schema.prisma"; then
  STAGED_MIGRATIONS=$(git diff --cached --name-only | grep "prisma/migrations" | wc -l)
  if [ "$STAGED_MIGRATIONS" -eq 0 ]; then
    echo "schema.prisma changed but no new migration found"
    echo "Run: cd backend && npx prisma migrate dev --name <description>"
    ERRORS=$((ERRORS + 1))
  fi
fi

ENUM_VALUES=$(awk '/enum ScenarioType/{flag=1;next}/}/{flag=0}flag' backend/prisma/schema.prisma 2>/dev/null | grep -E "^[[:space:]]+[a-z_]+$" | wc -l || echo "0")
SWITCH_CASES=$(grep "case ScenarioType\." backend/src/scenario/scenario.service.ts 2>/dev/null | wc -l || echo "0")

if [ "$ENUM_VALUES" -ne "$SWITCH_CASES" ]; then
  echo "Enum values ($ENUM_VALUES) != switch cases ($SWITCH_CASES)"
  echo "Make sure all scenario types are handled"
fi

if [ "$ERRORS" -gt 0 ]; then
  echo ""
  echo "Pre-commit checks failed ($ERRORS errors). Fix before committing."
  exit 1
fi

echo "Pre-commit observability checks passed"
