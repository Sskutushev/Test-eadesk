#!/usr/bin/env bash
set -e

echo "Post-merge: updating infrastructure..."

if git diff HEAD@{1} HEAD --name-only | grep -qE "docker-compose|Dockerfile|docker/"; then
  echo "Docker files changed - rebuilding containers..."
  docker compose up -d --build
else
  echo "No Docker changes detected"
fi

if git diff HEAD@{1} HEAD --name-only | grep -q "prisma/migrations"; then
  echo "New migrations detected - applying..."
  cd backend
  npx prisma migrate deploy
  npx prisma generate
  cd ..
  docker compose restart backend
fi

if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
  echo "package.json changed - reinstalling dependencies..."
  if git diff HEAD@{1} HEAD --name-only | grep -q "backend/package.json"; then
    cd backend && npm ci && cd ..
  fi
  if git diff HEAD@{1} HEAD --name-only | grep -q "frontend/package.json"; then
    cd frontend && npm ci && cd ..
  fi
fi

echo "Infrastructure update complete"
