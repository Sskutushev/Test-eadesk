# Code Conventions

## Naming
- variables, functions: camelCase
- React components, classes, types: PascalCase
- constants: UPPER_SNAKE_CASE
- component files: kebab-case.tsx
- NestJS services: kebab-case.service.ts

## Imports
- Frontend: absolute paths via @/*
- Backend: relative for internal, absolute for external

## NestJS module structure
Each module includes: module.ts, controller.ts, service.ts, dto/, entities/ (if needed)

## Git commits (Conventional Commits)
- feat: new functionality
- fix: bug fix
- obs: observability changes
- infra: docker/ci/config
- docs: documentation

## Error handling
- Wrap service logic in try/catch
- Always Sentry.captureException on errors
- DTO validation via class-validator
- Never return stack traces to clients in production
