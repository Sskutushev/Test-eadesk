---
name: orchestrator-skill
description: Use when a task is large (>30 min), spans multiple services, or needs parallel subagent execution
---

# Orchestrator Skill

## When to use
- Task touches more than two services
- Estimated time >30 minutes
- Parallel frontend + backend changes
- Adding a new scenario (backend + frontend + docs)

## Decomposition process

### 1. Analyze the task
Identify services touched and dependencies.

### 2. Create a plan (TodoWrite)
```
Task: Add scenario "rate_limit_exceeded"
Subtasks:
[ ] [backend] Add enum value in schema.prisma
[ ] [backend] Create migration
[ ] [backend] Add case in scenario.service.ts
[ ] [frontend] Add option in scenario-form.tsx
[ ] [docs] Update README.md
```

### 3. Delegate to subagents
- Atomic tasks (single file, <15 min): small model
- Related tasks (2-3 files): medium model
- Architectural decisions: main model

### 4. Verification
```bash
curl -X POST http://localhost:3001/api/scenarios \
  -H "Content-Type: application/json" \
  -d '{"type":"rate_limit_exceeded"}'
curl http://localhost:3001/metrics | grep scenario_
curl -G http://localhost:3100/loki/api/v1/query --data-urlencode 'query={app="signal-lab"}'
```

## Context economy
- Pass only the relevant file snippet
- Avoid sending full files unless necessary
- Aggregate subagent outputs before next step
