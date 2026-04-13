# AI Layer

The AI layer makes the repo predictable for Cursor by providing rules, skills, commands, and hooks.

## Rules
- Stack constraints (do not change stack without justification)
- Conventions for naming, modules, and errors
- Observability guardrails

## Skills
- observability-skill: add/debug metrics, logs, errors
- prisma-migration-skill: schema changes and migrations
- docker-debug-skill: container health and networking
- orchestrator-skill: multi-service tasks with context economy

## Orchestrator context
- Context file: `.cursor/orchestrator/context.json`
- Resume supported via saved phase + task list

## Commands
- dev-start.sh: bring up infra and apply migrations
- run-test-scenario.sh: run one scenario and show signals
- reset-db.sh: reset data and restart stack

## Hooks
- pre-commit-observability-check.sh: guardrail verification
- post-merge-infrastructure-update.sh: infra updates and migrations
