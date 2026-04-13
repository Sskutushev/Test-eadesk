---
name: observability-skill
description: Use when adding new scenarios, modifying metrics/logs, or debugging observability pipeline
---

# Observability Skill

## Triggers
- Add a new scenario type
- Change metric names
- Debug metrics not appearing in Prometheus
- Debug logs not appearing in Loki
- Debug errors not appearing in Sentry

## Workflow

### Adding a new scenario
1. Check `backend/src/observability/prometheus.service.ts` - do we need a new metric?
2. If needed, add Counter/Histogram following the existing pattern
3. Add a case in `scenario.service.ts` with required calls:
   - `this.logger.log(...)` at start
   - `this.prometheus.scenarioDuration.observe(...)` in finally
   - `Sentry.captureException(...)` in catch
4. Verify metrics: `curl http://localhost:3001/metrics | grep scenario_`
5. Verify logs in Loki: `curl -G http://localhost:3100/loki/api/v1/query --data-urlencode 'query={app="signal-lab"}'`
6. Update dashboard if you need a new visualization

### Debug metrics
```bash
curl http://localhost:3001/metrics | grep scenario_
curl http://localhost:9090/api/v1/targets
curl 'http://localhost:9090/api/v1/query?query=scenario_runs_total'
```

### Debug logs in Loki
```bash
curl -G http://localhost:3100/loki/api/v1/query \
  --data-urlencode 'query={app="signal-lab"}' \
  --data-urlencode 'limit=5'
```

### Debug Sentry
- Ensure SENTRY_DSN is set in .env
- Run system_error scenario and check Sentry Issues
- Tag scenario=system_error should be visible
