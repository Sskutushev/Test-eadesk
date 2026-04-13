#!/usr/bin/env bash
set -euo pipefail

API_URL="http://localhost:3001"
PROMETHEUS_URL="http://localhost:9090"
LOKI_URL="http://localhost:3100"
GRAFANA_URL="http://localhost:3002"

PASS=0
FAIL=0

check() {
  local name="$1"
  local condition="$2"

  if eval "$condition" > /dev/null 2>&1; then
    echo "  [PASS] $name"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $name"
    FAIL=$((FAIL + 1))
  fi
}

echo "========================================"
echo " Signal Lab Integration Tests"
echo "========================================"

echo ""
echo "=== Phase 1: Infrastructure ==="

check "Frontend available (port 3000)" \
  "curl -sf http://localhost:3000 > /dev/null"

check "Backend health endpoint" \
  "curl -sf $API_URL/health | grep -q 'ok'"

check "Prometheus available" \
  "curl -sf $PROMETHEUS_URL/-/healthy"

check "Loki available" \
  "curl -sf $LOKI_URL/ready | grep -q 'ready'"

check "Grafana available" \
  "curl -sf $GRAFANA_URL/api/health | grep -q 'ok'"

echo ""
echo "=== Phase 2: Backend API ==="

check "GET /api/scenarios returns array" \
  "curl -sf $API_URL/api/scenarios | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!Array.isArray(d)) process.exit(1);'"

for SCENARIO in success slow_query system_error; do
  RESULT=$(curl -sf -X POST "$API_URL/api/scenarios" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"$SCENARIO\"}" 2>&1)

  check "POST /api/scenarios {type: $SCENARIO} returns status" \
    "echo '$RESULT' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.status) process.exit(1);'"
done

echo ""
echo "=== Phase 3: Prometheus Metrics ==="

check "Endpoint /metrics available" \
  "curl -sf $API_URL/metrics | grep -q 'scenario_'"

check "scenario_runs_total contains success" \
  "curl -sf $API_URL/metrics | grep -q 'scenario_runs_total.*success'"

check "scenario_runs_total contains system_error" \
  "curl -sf $API_URL/metrics | grep -q 'scenario_runs_total.*system_error'"

check "scenario_errors_total exists" \
  "curl -sf $API_URL/metrics | grep -q 'scenario_errors_total'"

check "scenario_duration_seconds exists" \
  "curl -sf $API_URL/metrics | grep -q 'scenario_duration_seconds'"

check "Prometheus scraping backend (targets UP)" \
  "curl -sf '$PROMETHEUS_URL/api/v1/targets' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); const t=d.data.activeTargets||[]; if(!t.some(x=>x.health==="up")) process.exit(1);'"

check "Prometheus stores scenario_runs_total" \
  "curl -sf '$PROMETHEUS_URL/api/v1/query?query=scenario_runs_total' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.data.result || d.data.result.length===0) process.exit(1);'"

echo ""
echo "=== Phase 4: Loki Logs ==="

sleep 3

check "Loki contains signal-lab logs" \
  "curl -sf -G '$LOKI_URL/loki/api/v1/query' --data-urlencode 'query={app=\"signal-lab\"}' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.data.result || d.data.result.length===0) process.exit(1);'"

echo ""
echo "=== Phase 5: Grafana Dashboard ==="

check "Grafana datasource Prometheus present" \
  "curl -sf -u admin:admin '$GRAFANA_URL/api/datasources' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.some(x=>x.type==="prometheus")) process.exit(1);'"

check "Grafana datasource Loki present" \
  "curl -sf -u admin:admin '$GRAFANA_URL/api/datasources' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.some(x=>x.type==="loki")) process.exit(1);'"

check "Grafana dashboard signal-lab exists" \
  "curl -sf -u admin:admin '$GRAFANA_URL/api/dashboards/uid/signal-lab' | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); if(!d.dashboard) process.exit(1);'"

echo ""
echo "========================================"
echo " Test Summary"
echo "========================================"
echo ""
echo "  PASSED: $PASS"
echo "  FAILED: $FAIL"
echo "  TOTAL:  $((PASS + FAIL))"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo "  STATUS: ALL TESTS PASSED"
  exit 0
else
  echo "  STATUS: $FAIL TESTS FAILED"
  exit 1
fi
