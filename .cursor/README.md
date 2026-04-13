# Cursor AI Layer - Signal Lab

This folder turns the repo into a predictable environment for Cursor.

## Contents

- rules/ - stack constraints, conventions, observability guardrails
- skills/ - custom skills for observability, Prisma migrations, Docker debugging, orchestration
- commands/ - common workflows (dev start, run scenario, reset DB)
- hooks/ - pre-commit and post-merge checks to protect observability and infra

## How to use

1. Follow rules/ when adding code or changing stack.
2. Use skills/ prompts when a task matches the description.
3. Run commands/ scripts for common workflows.
4. Hooks can be symlinked into .git/hooks if desired.
