#!/usr/bin/env bash
set -euo pipefail

echo "Signal Lab Smoke Test"
echo ""

FAIL=0

check() {
  printf "  %-40s" "$1"
  if eval "$2" > /dev/null 2>&1; then
    echo "OK"
  else
    echo "FAIL"
    FAIL=$((FAIL + 1))
  fi
}

check "Frontend running"     "curl -sf http://localhost:3000"
check "Backend health"       "curl -sf http://localhost:3001/health"
check "Metrics endpoint"     "curl -sf http://localhost:3001/metrics | grep -q scenario_"
check "Grafana running"      "curl -sf http://localhost:3002/api/health"
check "Prometheus running"   "curl -sf http://localhost:9090/-/healthy"
check "Loki running"         "curl -sf http://localhost:3100/ready"

echo ""
echo "Running scenarios..."
curl -s -X POST http://localhost:3001/api/scenarios \
  -H "Content-Type: application/json" -d '{"type":"success"}' > /dev/null
curl -s -X POST http://localhost:3001/api/scenarios \
  -H "Content-Type: application/json" -d '{"type":"system_error"}' > /dev/null

sleep 2

check "Metrics updated" \
  "curl -sf http://localhost:3001/metrics | grep -q 'scenario_runs_total.*success'"
check "History endpoint works" \
  "curl -sf http://localhost:3001/api/scenarios | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.length) process.exit(1);'"

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "Smoke test PASSED"
else
  echo "Smoke test FAILED ($FAIL checks)"
  exit 1
fi
