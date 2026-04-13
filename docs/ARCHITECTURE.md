# Architecture

Signal Lab is a small observability playground with a single workflow:
UI triggers scenarios -> backend runs logic -> persistence + metrics + logs + errors.

## High-level flow

1. Frontend (Next.js) posts to `/api/scenarios` (proxy to backend)
2. Backend (NestJS) executes scenario logic
3. Prisma persists run to PostgreSQL
4. Prometheus metrics exposed at `/metrics`
5. Winston logs shipped to Loki
6. Sentry captures errors for system_error

## Log labels

Loki labels include `app`, `env`, `service`, `level`, `context`, and `scenario` for fast filtering in Explore.

## Services and ports

| Service     | Port |
|-------------|------|
| Frontend    | 3000 |
| Backend     | 3001 |
| Grafana     | 3002 |
| PostgreSQL  | 5432 |
| Prometheus  | 9090 |
| Loki        | 3100 |
