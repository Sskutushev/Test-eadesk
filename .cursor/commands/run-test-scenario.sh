#!/usr/bin/env bash
set -e

SCENARIO=${1:-system_error}
API_URL="http://localhost:3001"

echo "Running scenario: $SCENARIO"

RESULT=$(curl -s -X POST "$API_URL/api/scenarios" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"$SCENARIO\"}")

echo "Result: $RESULT"

DURATION=$(echo "$RESULT" | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); console.log(d.durationMs ?? "?");')
STATUS=$(echo "$RESULT" | node -e 'const d=JSON.parse(require("fs").readFileSync(0)); console.log(d.status ?? "?");')

echo ""
echo "Observability check:"
echo "  Status: $STATUS | Duration: ${DURATION}ms"
echo ""
echo "  Metrics:    curl $API_URL/metrics | grep scenario_"
echo "  History:    curl $API_URL/api/scenarios"
echo "  Grafana:    http://localhost:3002/d/signal-lab"
echo "  Prometheus: http://localhost:9090/graph?g0.expr=scenario_runs_total"

echo ""
echo "Current metric values:"
curl -s "$API_URL/metrics" | grep "^scenario_" | head -20
