#!/usr/bin/env bash
set -e

echo "This will delete all data in the database."
read -p "Are you sure? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo "Resetting database..."
docker compose down -v

echo "Starting PostgreSQL..."
docker compose up -d postgres

echo "Waiting for PostgreSQL..."
until docker compose exec postgres pg_isready -U signal > /dev/null 2>&1; do
  sleep 1
done

echo "Applying migrations..."
cd backend
npx prisma migrate deploy
cd ..

echo "Starting all services..."
docker compose up -d

echo "Database reset complete"
