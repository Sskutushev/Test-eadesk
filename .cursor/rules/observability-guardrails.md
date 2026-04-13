# Observability Guardrails

Each scenario must include:

## 1) Prometheus metrics
```ts
// Always in finally
this.prometheus.scenarioRunsTotal.labels(type, status).inc();
this.prometheus.scenarioDuration.labels(type).observe(durationSec);

// In catch only
this.prometheus.scenarioErrorsTotal.labels(type).inc();
```

## 2) Structured logs via Winston
```ts
// INFO at start
this.logger.log(`Starting scenario: ${type}`, 'ScenarioService');

// WARN for slow operations
this.logger.warn(`Operation took ${ms}ms`, 'ScenarioService');

// ERROR on exception
this.logger.error(`Scenario failed: ${err.message}`, err.stack, 'ScenarioService');
```

## 3) Prisma persistence
Each run is persisted in scenario_runs: type, status, durationMs, errorMsg

## 4) Sentry on errors
```ts
Sentry.captureException(err, {
  tags: { scenario: type },
  extra: { durationMs: Date.now() - startTime },
});
```

## Metric naming
- All metrics start with scenario_
- Use _total for counters
- Use _seconds for histograms

## Adding a new scenario - checklist
1) Add enum value in prisma schema
2) Run `npx prisma migrate dev`
3) Add switch case in scenario.service.ts
4) Ensure logging, metrics, and Sentry are present
5) Add option in frontend select
6) Update README.md
