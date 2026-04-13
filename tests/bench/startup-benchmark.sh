#!/usr/bin/env bash
set -euo pipefail

echo "Benchmark: startup time"
START=$(date +%s)

docker compose up -d --build

echo "Waiting for backend health..."
until curl -sf http://localhost:3001/health > /dev/null; do
  sleep 1
done

END=$(date +%s)
ELAPSED=$((END - START))
echo "Startup seconds: $ELAPSED"
