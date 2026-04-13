#!/usr/bin/env bash
set -e

echo "Starting Signal Lab development environment..."

docker compose up -d postgres

echo "Waiting for PostgreSQL..."
until docker compose exec postgres pg_isready -U signal > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL ready"

echo "Running Prisma migrations..."
cd backend
npx prisma migrate deploy
npx prisma generate
cd ..

docker compose up -d

echo ""
echo "Signal Lab is running"
echo ""
echo "Frontend:   http://localhost:3000"
echo "Backend:    http://localhost:3001"
echo "Metrics:    http://localhost:3001/metrics"
echo "Health:     http://localhost:3001/health"
echo "Grafana:    http://localhost:3002  (admin/admin)"
echo "Prometheus: http://localhost:9090"
echo "Loki:       http://localhost:3100"
