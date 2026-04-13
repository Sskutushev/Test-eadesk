#!/usr/bin/env bash
set -euo pipefail

echo "Benchmark: health endpoints"

for i in {1..5}; do
  curl -sf http://localhost:3001/health > /dev/null
  curl -sf http://localhost:3001/metrics > /dev/null
done

echo "Health endpoints responded successfully"
