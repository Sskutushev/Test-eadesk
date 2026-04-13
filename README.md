# Signal Lab - Observability Playground

Small app that lets you run scenarios and observe metrics, logs, and errors end-to-end.

## Quick start

```bash
cp .env.example .env
docker compose up -d
```

Wait ~20 seconds for services to become healthy.

## Validate installation

```bash
docker compose ps
./tests/smoke/smoke-test.sh
```

## Service URLs

| Service     | URL                           | Description            |
|-------------|--------------------------------|------------------------|
| Frontend    | http://localhost:3000         | UI with scenario form  |
| Backend     | http://localhost:3001         | NestJS API             |
| Metrics     | http://localhost:3001/metrics | Prometheus metrics     |
| Health      | http://localhost:3001/health  | Health check           |
| Grafana     | http://localhost:3002         | admin/admin            |
| Prometheus  | http://localhost:9090         | Metrics query          |
| Loki        | http://localhost:3100         | Logs query             |

## Sentry (optional)

If you want end-to-end Sentry verification, set in `.env` (defaults provided in `.env.example`):

```bash
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_URL=...
```

Generate a test error:

```bash
curl http://localhost:3001/api/sentry-debug
```

## Swagger

Open `http://localhost:3001/docs` for API documentation.

## Scenarios

| Type          | Description                     | Observability                     |
|---------------|---------------------------------|-----------------------------------|
| `success`     | Fast successful request         | Counter increment, INFO log       |
| `slow_query`  | 5 second delay                  | Histogram spike, WARN log         |
| `system_error`| Simulated exception             | Error counter, ERROR log, Sentry  |

## Testing

```bash
./tests/integration/test-observability-pipeline.sh
cd backend && npm test
```

## Benchmarks

```bash
./tests/bench/startup-benchmark.sh
./tests/bench/healthcheck-benchmark.sh
```

## Quality checks

```bash
npm run verify:release

cd backend
npm run typecheck
npm run lint
npm run format

cd ../frontend
npm run typecheck
npm run lint
npm run format
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

## Cursor AI Layer

Details in `.cursor/README.md`.

```
.cursor/
├── rules/     - stack constraints, conventions, guardrails
├── skills/    - custom skills including orchestrator
├── commands/  - common workflows
└── hooks/     - observability integrity checks
```

## Shutdown

```bash
docker compose down
docker compose down -v
```
