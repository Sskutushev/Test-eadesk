# Demo Instructions - Signal Lab

## Setup (1 minute)

```bash
docker compose up -d
sleep 20
./tests/smoke/smoke-test.sh
```

## Demo flow (5-7 minutes)

### Step 1: Open UI
Open `http://localhost:3000`.

### Step 2: Success scenario
1. Select "Success" and click "Run"
2. Show new entry in history with status success
3. Open `http://localhost:3001/metrics` and find:
   `scenario_runs_total{type="success",status="success"}`

### Step 3: System error scenario (main)
1. Select "System Error" and click "Run"
2. Show:

Grafana `http://localhost:3002/d/signal-lab`
- Error Rate panel increases
- Logs panel shows ERROR entry

Prometheus `http://localhost:9090`
- Query `scenario_errors_total` returns > 0

Loki (Grafana Explore)
- Query `{app="signal-lab"} |= "ERROR"`

Sentry (if DSN configured)
- Issue "Simulated system error" with tag scenario=system_error

### Step 4: Slow query scenario
1. Select "Slow Query" and click "Run"
2. Button stays in running state ~5 seconds
3. Grafana "Duration P99" spikes

### Step 5: Run history
- All three scenarios visible
- History updates every 3 seconds

## Cursor AI layer demo (3 minutes)

1. Open a new Cursor chat
2. Prompt:
```
Use the orchestrator-skill to add a new scenario type 'rate_limit_exceeded'.
It should simulate HTTP 429, sleep 2 seconds, log a WARN, and succeed.
```
3. Expect a plan + atomic subtasks + verification steps

## Final check (interviewer)

```bash
docker compose down -v
docker compose up -d
sleep 25
./tests/smoke/smoke-test.sh
./tests/integration/test-observability-pipeline.sh
```
